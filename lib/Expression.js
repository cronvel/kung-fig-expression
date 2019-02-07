/*
	Kung Fig Expression

	Copyright (c) 2015 - 2019 Cédric Ronvel

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
	this.fnOperator = fnOperator ;	// null= just a args
	this.args = args ;
}

Expression.prototype = Object.create( Dynamic.prototype ) ;
Expression.prototype.constructor = Expression ;

module.exports = Expression ;

Expression.prototype.__prototypeUID__ = 'kung-fig/Expression' ;
Expression.prototype.__prototypeVersion__ = require( '../package.json' ).version ;

Expression.serializerFnId = 'Expression' ;

Expression.operators = fnOperators ;
Expression.constants = expressionConstants ;
Expression.mode = mode ;



Expression.serializer = function serializer( object ) {
	return {
		args: [ object.fnOperator.id , object.args ] ,
		overideKeys: [ '__isDynamic__' , '__isApplicable__' ]
	} ;
} ;



Expression.unserializer = function unserializer( fnOperatorId , args ) {
	return new Expression( fnOperators[ fnOperatorId ] , args ) ;
} ;



Expression.prototype.getValue = Expression.prototype.get = function getValue( ctx ) {
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

			if ( strArray.length ) {
				str += '( ' ;
				strArray.forEach( ( e , i ) => {
					if ( ! i ) { str += e ; }
					else { str += ' , ' + e ; }
				} ) ;
				str += ' )' ;
			}

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

		case mode.LIST :
			if ( ! this.args.length ) { return '[]' ; }

			str = '[ ' ;
			strArray.forEach( ( e , i ) => {
				if ( ! i ) { str += e ; }
				else { str += ' , ' + e ; }
			} ) ;
			str += ' ]' ;
			return str ;

		case mode.KV :
			if ( ! this.args.length ) { return '{}' ; }

			str = '{ ' ;
			strArray.forEach( ( e , i ) => {
				if ( ! i ) { str += e ; }
				else if ( i % 2 ) { str += ': ' + e ; }
				else { str += ' , ' + e ; }
			} ) ;
			str += ' }' ;
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



class Stack extends Array {
	constructor( ... args ) {
		super( ... args ) ;
	}

	// This allow stack.map()/.slice()/etc to return an Array, not a Stack
	static get [Symbol.species]() { return Array ; }
}



function parseStack( str , runtime ) {
	var c , expression ,
		stack = new Stack() ;

	while ( runtime.i < runtime.iEndOfLine ) {
		expression = parseExpression( str , runtime ) ;

		if ( expression ) {
			stack.push( expression ) ;
		}

		c = str[ runtime.i ] ;

		if ( c === ')' || c === ']' || c === '}' ) {
			// Close the stack
			runtime.i ++ ;
			break ;
		}
		else if ( c === ',' || c === ':' ) {
			// Next expression
			runtime.i ++ ;
			continue ;
		}
	}

	return stack ;
}



function parseExpression( str , runtime ) {
	var c , args = [] ;

	while ( runtime.i < runtime.iEndOfLine ) {
		parseSpaces( str , runtime ) ;

		// Parse space may reach the end of the line
		if ( runtime.i >= runtime.iEndOfLine ) { break ; }

		c = str[ runtime.i ] ;
		if ( c === ',' || c === ':' || c === ')' || c === ']' || c === '}' ) { break ; }

		args.push( parseArgument( str , runtime ) ) ;
	}

	return fromArguments( args ) ;
}



function parseArgument( str , runtime ) {
	var c , stack ;

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
			return parseStack( str , runtime ) ;

		case 0x5b :	// [   open bracket: this is an array and its sub-expression
			runtime.i ++ ;
			stack = parseStack( str , runtime ) ;
			return new Expression( fnOperators.array , [ ... stack ] ) ;

		case 0x7b :	// {   open curly brace: this is an object and its sub-expression
			runtime.i ++ ;
			stack = parseStack( str , runtime ) ;
			return new Expression( fnOperators.object , [ ... stack ] ) ;

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



function fromArguments( args ) {
	var fnOperator , finalArgs ;

	if ( ! args.length ) { return ; }

	if ( typeof args[ 0 ] === 'function' ) {
		fnOperator = args[ 0 ] ;

		// We remove arguments that are identical to the operator, case like: 1 + 2 + 3 + ...
		args = unstackAndDedup( args , fnOperator ) ;
		return new Expression( fnOperator , args ) ;
	}

	if ( typeof args[ 1 ] === 'function' ) {
		fnOperator = args[ 1 ] ;

		// We remove arguments that are identical to the operator, case like: 1 + 2 + 3 + ...
		args = unstackAndDedup( args , fnOperator ) ;
		return new Expression( fnOperator , args ) ;
	}

	args = unstackAndDedup( args ) ;

	if ( args.length >= 1 ) {
		return args[ 0 ] ;
	}

	return ;
}



const NOTHING = {} ;

function unstackAndDedup( args , exclude = NOTHING ) {
	var replacement ;

	if ( args.some( e => e instanceof Stack ) ) {
		replacement = [] ;
		args.forEach( e => {
			//if ( e !== fnOperator )
			if ( e instanceof Stack ) {
				replacement.push( ... e ) ;
			}
			else if ( e !== exclude ) {
				replacement.push( e ) ;
			}
		} ) ;

		return replacement ;
	}
	else if ( exclude !== NOTHING ) {
		return args.filter( e => e !== exclude ) ;
	}

	return args ;
}


// Skip spaces
function parseSpaces( str , runtime ) {
	while ( runtime.i < runtime.iEndOfLine && str[ runtime.i ] === ' ' ) { runtime.i ++ ; }
}



function afterSpacesChar( str , runtime , i ) {
	while ( i < runtime.iEndOfLine && str[ i ] === ' ' ) { i ++ ; }
	return str[ i ] ;
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



// Find the next separator: space, parens, comma, colon, double-quote, dollar, brackets
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
			case 0x22 :	// "   double-quote
			case 0x24 :	// $   dollar
			case 0x5b :	// [   open bracket
			case 0x5d :	// ]   close bracket
			case 0x7b :	// {   open curly brace
			case 0x7d :	// }   close curly brace
				return i ;
		}
	}

	// return i/eol
	return i ;
}



// An identifier that is a function, a key or a constant
function parseFnKeyConst( str_ , runtime ) {
	var separatorIndex = nextSeparator( str_ , runtime ) ;

	var str = str_.slice( runtime.i , separatorIndex ) ;
	//console.log( 'str before:' , str_ ) ;
	//console.log( 'str after:' , str ) ;

	//var indexOf ;
	//str = str.slice( runtime.i , runtime.iEndOfLine ) ;
	//if ( ( indexOf = str.indexOf( ' ' ) ) !== -1 ) { str = str.slice( 0 , indexOf ) ; }

	runtime.i += str.length ;

	if (
		str_[ separatorIndex ] === ':' ||
		( str_[ separatorIndex ] === ' ' && afterSpacesChar( str_ , runtime , separatorIndex ) === ':' )
	) {
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
	else if ( str in runtime.constants ) {
		return runtime.constants[ str ] ;
	}

	throw new SyntaxError( "Unexpected '" + str + "' in expression" ) ;
}

