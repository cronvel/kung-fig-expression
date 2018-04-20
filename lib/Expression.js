/*
	Kung Fig Expression

	Copyright (c) 2015 - 2018 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



var Dynamic = require( 'kung-fig-dynamic' ) ;
var Ref = require( 'kung-fig-ref' ) ;
//var Template = require( 'kung-fig-template' ) ;
var common = require( 'kung-fig-common' ) ;
var fnOperators = require( './fnOperators.js' ) ;
var expressionConstants = require( './constants.js' ) ;
var mode = require( './mode.js' ) ;



function Expression( fnOperator , args ) {
	this.fnOperator = fnOperator ;
	this.args = args ;
}



Expression.prototype = Object.create( Dynamic.prototype ) ;
Expression.prototype.constructor = Expression ;

module.exports = Expression ;

Expression.prototype.__prototypeUID__ = 'kung-fig/Expression' ;
Expression.prototype.__prototypeVersion__ = require( '../package.json' ).version ;

Expression.operators = fnOperators ;
Expression.constants = expressionConstants ;
Expression.mode = mode ;



// Backward-compatibility, should be deprecated
Expression.create = function create( fnOperator , args ) {
	return new Expression( fnOperator , args ) ;
} ;



Expression.serializer = function serializer( object ) {
	return {
		args: [ object.fnOperator.id , object.args ] ,
		overideKeys: [ '__isDynamic__' , '__isApplicable__' ]
	} ;
} ;



Expression.unserializer = function unserializer( fnOperatorId , args ) {
	return new Expression( fnOperators[ fnOperatorId ] , args ) ;
} ;



Expression.prototype.getValue = Expression.prototype.get = function getFinalValue( ctx ) {
	if ( ! this.__isDynamic__ ) { return this ; }
	return this.fnOperator( this.fnOperator.solveArgs ? this.fnOperator.solveArgs.call( this , ctx ) : this.solveArgs( ctx ) ) ;
} ;



Expression.prototype.apply = function apply( ctx ) {
	if ( ! this.__isApplicable__ ) { return this ; }
	return this.fnOperator( this.fnOperator.solveArgs ? this.fnOperator.solveArgs.call( this , ctx ) : this.solveArgs( ctx ) ) ;
} ;



// Should getValue() and getFinalValue() be the same?
Expression.prototype.getFinalValue = Expression.prototype.getValue ;



Expression.prototype.solveArgs = function solveArgs( ctx ) {
	return this.args.map( e => e && typeof e === 'object' && e.__isDynamic__ ? e.getFinalValue( ctx ) : e ) ;
} ;



Expression.parseFromKfg = function parseFromKfg( str , runtime ) {
	var expression = parseExpression( str , runtime ) ;
	return expression ;
} ;



// /!\ Should supports custom constants /!\
Expression.prototype.stringify = function stringify() {
	var str ,  strArray ;

	strArray = this.args.map( e => {
		if ( e instanceof Ref ) { return e.stringify() ; }
		if ( e instanceof Expression ) { return '( ' + e.stringify() + ' )' ; }
		if ( typeof e === 'number' ) {
			// /!\ Should supports custom constants /!\
			if ( e === expressionConstants.pi ) { return 'pi' ; }
			if ( e === expressionConstants.e ) { return 'e' ; }
			if ( e === expressionConstants.phi ) { return 'phi' ; }
			return '' + e ;
		}
		if ( typeof e === 'string' ) { return common.stringifiers.stringifyQuotedString( e ) ; }
		if ( typeof e === 'boolean' ) { return e ? 'true' : 'false' ; }
		return 'null' ;
	} ) ;

	switch ( this.fnOperator.mode ) {
		case mode.FN :
			str = this.fnOperator.id ;
			strArray.forEach( ( e , i ) => {
				if ( ! i ) { str += ' ' + e ; }
				else { str += ' , ' + e ; }
			} ) ;
			return str ;

		case mode.SINGLE_OP :
			strArray.splice( this.args.length <= 1 ? 0 : 1 , 0 , this.fnOperator.id ) ;
			break ;

		case mode.MULTI_OP :
			if ( this.args.length <= 1 ) {
				strArray.splice( 0 , 0 , this.fnOperator.id ) ;
			}
			else {
				return strArray.join( ' ' + this.fnOperator.id + ' ' ) ;
			}
			break ;

		case mode.SINGLE_OP_AFTER :
			strArray.splice( this.args.length ? 1 : 0 , 0 , this.fnOperator.id ) ;
			break ;

		case mode.KV :
			if ( ! this.args.length ) { return 'object' ; }

			str = '' ;
			strArray.forEach( ( e , i ) => {
				if ( ! i ) { str += e ; }
				else if ( i % 2 ) { str += ': ' + e ; }
				else { str += ' , ' + e ; }
			} ) ;
			return str ;

		default :
			strArray.splice( 0 , 0 , this.fnOperator.id ) ;
			break ;
	}

	return strArray.join( ' ' ) ;
} ;



Expression.parse = function parse( str , operators , constants ) {
	var runtime = {
		i: 0 ,
		iEndOfLine: str.length ,
		depth: 0 ,
		operators: operators || {} ,
		constants: constants || {}
	} ;

	var expression = parseExpression( str , runtime ) ;

	return expression ;
} ;



function parseExpression( str , runtime ) {
	var part , args = [] ,
		hasOp = null ,
		hasComma = false , lastComma = 0 , commaFirst = false ,
		hasColon = false , lastColon = 0 , colonFirst = false , colonCommaMode = false ;

	while ( runtime.i < runtime.iEndOfLine ) {
		parseSpaces( str , runtime ) ;

		// Parse space may reach the end of the line
		if ( runtime.i >= runtime.iEndOfLine ) { break ; }

		if ( str[ runtime.i ] === ')' ) { runtime.i ++ ; break ; }

		if ( str[ runtime.i ] === ':' ) {
			if ( hasOp && hasOp !== fnOperators[':'] ) {
				throw new SyntaxError( "Ambiguous object syntax, unexpected ':', try surrounding the object with parenthesis ()" ) ;
			}

			if ( ! hasComma ) { colonFirst = true ; }

			if ( colonCommaMode ) {
				//console.log( 'squeeze by colon' , lastComma , args ) ;
				part = args.splice( lastComma ) ;
				args.push( fromArguments( part ) ) ;
				lastComma = args.length ;
				runtime.i ++ ;

				hasComma = true ;
				continue ;
			}

			hasColon = true ;
			lastColon = args.length + 1 ;
			if ( ! commaFirst ) { lastComma = lastColon ; }
		}

		if ( str[ runtime.i ] === ',' ) {
			if ( ! hasColon ) { commaFirst = true ; }
			if ( colonFirst ) { colonCommaMode = true ; }

			//console.log( 'squeeze by comma' , lastComma , args ) ;
			hasComma = true ;
			part = args.splice( lastComma ) ;
			args.push( fromArguments( part ) ) ;
			lastComma = args.length ;
			runtime.i ++ ;

			continue ;
		}

		part = parseArgument( str , runtime ) ;
		args.push( part ) ;

		if ( ! hasOp && args.length <= 2 && typeof part === 'function' ) {
			hasOp = part ;
			lastComma = args.length ;
		}
	}

	// There was a comma or colon, stack all remaining data from the last one
	if ( hasComma ) {
		//console.log( '\n\nhasComma lastColon/lastComma/args:' , lastColon , lastComma , args ) ;
		part = args.splice( lastComma ) ;
		args.push( fromArguments( part ) ) ;
	}
	else if ( hasColon ) {
		//console.log( '\n\nhasColon lastColon/lastComma/args:' , lastColon , lastComma , args ) ;
		part = args.splice( lastColon ) ;
		args.push( fromArguments( part ) ) ;
	}

	return fromArguments( args ) ;
}



function fromArguments( args ) {
	var fnOperator ;

	if ( ! args.length ) { return ; }

	if ( typeof args[ 0 ] === 'function' ) {
		fnOperator = args[ 0 ] ;

		// We remove arguments that are identical to the operator, case like: 1 + 2 + 3 + ...
		args = args.filter( e => e !== fnOperator ) ;
		return Expression.create( fnOperator , args ) ;
	}

	if ( typeof args[ 1 ] === 'function' ) {
		fnOperator = args[ 1 ] ;

		// We remove arguments that are identical to the operator, case like: 1 + 2 + 3 + ...
		args = args.filter( e => e !== fnOperator ) ;
		return Expression.create( fnOperator , args ) ;
	}

	if ( args.length === 1 ) {
		args = args[ 0 ] ;

		if ( Array.isArray( args ) ) {
			return Expression.create( fnOperators.array , args ) ;
		}

		return args ;
	}

	return Expression.create( fnOperators.array , args ) ;
}



// Skip spaces
function parseSpaces( str , runtime ) {
	while ( runtime.i < runtime.iEndOfLine && str[ runtime.i ] === ' ' ) { runtime.i ++ ; }
}



function parseArgument( str , runtime ) {
	var c ;

	c = str.charCodeAt( runtime.i ) ;

	if ( c >= 0x30 && c <= 0x39 ) {
		// digit
		return parseNumber( str , runtime ) ;
	}

	switch ( c ) {

		case 0x2d :	// - minus
			c = str.charCodeAt( runtime.i + 1 ) ;
			if ( c >= 0x30 && c <= 0x39 ) {
				// digit
				return parseNumber( str , runtime ) ;
			}

			return parseFnKeyConst( str , runtime ) ;

		case 0x22 :	// "   double-quote: this is a string
			runtime.i ++ ;
			return common.parsers.parseQuotedString( str , runtime ) ;

		case 0x28 :	// (   open parenthesis: this is a sub-expression
			runtime.i ++ ;
			return parseExpression( str , runtime ) ;

		case 0x3a :	// :   colon: this is a key/value
			runtime.i ++ ;
			return fnOperators[':'] ;

		case 0x24 :	// $   dollar: maybe a Template or a Ref
			c = str.charCodeAt( runtime.i + 1 ) ;

			/* Disable Template support, maybe it will be re-introduced later
			if ( c === 0x22 ) {
				runtime.i += 2 ;
				return Template.parseFromKfg( str , runtime ) ;
			}
			*/

			//runtime.i ++ ;
			return Ref.parseFromKfg( str , runtime ) ;

		default :
			return parseFnKeyConst( str , runtime ) ;
	}
}



var numberRegex_ = /^(-?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?)\s*$/ ;

function parseNumber( str , runtime ) {
	str = str.slice( runtime.i , nextSeparator( str , runtime ) ) ;

	//var indexOf ;
	//str = str.slice( runtime.i , runtime.iEndOfLine ) ;
	//if ( ( indexOf = str.indexOf( ' ' ) ) !== -1 ) { str = str.slice( 0 , indexOf ) ; }

	if ( ! numberRegex_.test( str ) ) { throw new SyntaxError( "Expecting a number, but got: '" + str + "'" ) ; }

	runtime.i += str.length ;

	return parseFloat( str ) ;
}



// Find the next separator: space, parens, comma, colon
function nextSeparator( str , runtime ) {
	var i = runtime.i ,
		eol = runtime.iEndOfLine ;

	for ( ; i < eol ; i ++ ) {

		switch ( str.charCodeAt( i ) ) {

			case 0x20 :	//     space
			case 0x28 :	// (   open parenthesis
			case 0x29 :	// )   close parenthesis
			case 0x2c :	// ,   comma
			case 0x3a :	// :   colon
				return i ;
		}
	}

	// return i/eol
	return i ;
}



function parseFnKeyConst( str_ , runtime ) {
	var separatorIndex = nextSeparator( str_ , runtime ) ;

	var str = str_.slice( runtime.i , separatorIndex ) ;
	//console.log( 'str before:' , str_ ) ;
	//console.log( 'str after:' , str ) ;

	//var indexOf ;
	//str = str.slice( runtime.i , runtime.iEndOfLine ) ;
	//if ( ( indexOf = str.indexOf( ' ' ) ) !== -1 ) { str = str.slice( 0 , indexOf ) ; }

	runtime.i += str.length ;

	if ( str_[ separatorIndex ] === ':' ) {
		// This is a key, return the unquoted string
		return str ;
	}
	else if ( str in common.constants ) {
		return common.constants[ str ] ;
	}
	else if ( fnOperators[ str ] ) {
		return fnOperators[ str ] ;
	}
	else if ( str in expressionConstants ) {
		return expressionConstants[ str ] ;
	}
	else if ( runtime.operators[ str ] ) {
		return runtime.operators[ str ] ;
	}
	else if ( runtime.constants[ str ] ) {
		return runtime.constants[ str ] ;
	}

	throw new SyntaxError( "Unexpected '" + str + "' in expression" ) ;
}


