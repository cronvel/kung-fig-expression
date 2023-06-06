/*
	Kung Fig Expression

	Copyright (c) 2015 - 2021 Cédric Ronvel

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



const mode = require( './mode.js' ) ;
const EMPTY_ARRAY = [] ;
const Stack = require( './Stack.js' ) ;
const ObjectEntry = require( './ObjectEntry.js' ) ;



// Utilities

function toDash( str ) {
	return str.replace( /^([A-Z])|([A-Z])/g , ( match , firstLetter , letter ) => {
		if ( firstLetter ) { return firstLetter.toLowerCase() ; }
		return '-' + letter.toLowerCase() ;
	} ) ;
}

function batchOfNativeStatic( scope , scopeName , fnNames ) {
	fnNames.forEach( fnName => {
		//exports[ fnName ] = scope[ fnName ] ;		// This would modify a native method
		exports[ fnName ] = ( ... args ) => scope[ fnName ]( ... args ) ;
		exports[ fnName ].mode = mode.FN ;
		exports[ fnName ].nativeJsFn = scopeName + '.' + fnName ;
	} ) ;
}

function batchOfNativeStringMethod( mode_ , turnToDash , fnNames ) {
	fnNames.forEach( fnName => {
		var opName = turnToDash ? toDash( fnName ) : fnName ;
		//exports[ opName ] = String.prototype[ fnName ] ;	// This would modify a native method
		exports[ opName ] = ( str , ... args ) => ( '' + str )[ fnName ]( ... args ) ;
		exports[ opName ].mode = mode_ ;
		//exports[ opName ].useCall = true ;
		exports[ opName ].nativeJsMethod = fnName ;
		exports[ opName ].nativeJsMethodCast = 'string' ;
	} ) ;
}



// Any change here should be reflected in the official Atom grammar package



// Arithmetic operators

exports.add = exports['+'] = ( ... args ) => {
	var sum = 0 ;
	args.forEach( e => sum += + e ) ;
	return sum ;
} ;
exports['+'].mode = mode.MULTI_OP ;
exports['+'].jsOp = '+' ;

exports.sub = exports['-'] = ( ... args ) => {
	if ( args.length === 1 ) { return -args[ 0 ] ; }	// unary minus

	var i = 1 , iMax = args.length , v ;

	v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v -= + args[ i ] ; }
	return v ;
} ;
exports['-'].mode = mode.MULTI_OP ;
exports['-'].jsOp = '-' ;

exports.mul = exports['*'] = ( ... args ) => {
	var v = 1 ;
	args.forEach( e => v *= + e ) ;
	return v ;
} ;
exports['*'].mode = mode.MULTI_OP ;
exports['*'].jsOp = '*' ;

exports.div = exports['/'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v /= + args[ i ] ; }
	return v ;
} ;
exports['/'].mode = mode.MULTI_OP ;
exports['/'].jsOp = '/' ;

exports.intdiv = exports['\\'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = Math.trunc( v / ( + args[ i ] ) ) ; }
	return v ;
} ;
exports['\\'].mode = mode.MULTI_OP ;
exports['\\'].jsFn = 'intdiv' ;

exports.modulo = exports['%'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = v % ( + args[ i ] ) ; }
	return v ;
} ;
exports['%'].mode = mode.MULTI_OP ;
exports['%'].jsOp = '%' ;

exports.floordiv = exports['\\\\'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = Math.floor( v / ( + args[ i ] ) ) ; }
	return v ;
} ;
exports['\\\\'].mode = mode.MULTI_OP ;
exports['\\'].jsFn = 'floordiv' ;

// Positive modulo
exports.positiveModulo = exports['%+'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;

	for ( ; i < iMax ; i ++ ) {
		v = v % ( + args[ i ] ) ;
		if ( v < 0 ) { v += + args[ i ] ; }
	}

	return v ;
} ;
exports['%+'].mode = mode.MULTI_OP ;
exports['%+'].jsFn = 'positiveModulo' ;



// Comparison operators

exports['>'] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] > args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['>'].mode = mode.MULTI_OP ;
exports['>'].jsOp = '>' ;

exports['≥'] = exports['>='] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] >= args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['>='].mode = mode.MULTI_OP ;
exports['>='].jsOp = '>=' ;

exports['<'] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] < args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['<'].mode = mode.MULTI_OP ;
exports['<'].jsOp = '<' ;

exports['≤'] = exports['<='] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] <= args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['<='].mode = mode.MULTI_OP ;
exports['<='].jsOp = '<=' ;

exports['==='] = exports['=='] = exports['='] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		if ( args[ i ] !== args[ i + 1 ] ) { return false ; }
	}

	return true ;
} ;
exports['='].mode = mode.MULTI_OP ;
exports['='].jsOp = '===' ;

exports['≠'] = exports['!=='] = exports['!='] = ( ... args ) => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		if ( args[ i ] === args[ i + 1 ] ) { return false ; }
	}

	return true ;
} ;
exports['!='].mode = mode.MULTI_OP ;
exports['!='].jsOp = '!==' ;

// Around, almost equal to, with a factor
exports.around = exports['≈'] = exports['%='] = ( left , right , maxRate ) => {
	if ( left === right ) { return true ; }

	if (
		typeof left !== 'number' ||
		typeof right !== 'number' ||
		typeof maxRate !== 'number' ||
		! ( left * right > 0 )		// to catch NaN...
	) {
		return false ;
	}

	if ( maxRate < 1 ) { maxRate = 1 / maxRate ; }

	var deltaRate = left / right ;
	if ( deltaRate < 1 ) { deltaRate = 1 / deltaRate ; }

	return deltaRate <= maxRate ;
} ;
exports['%='].mode = mode.SINGLE_OP_AFTER ;
exports['%='].jsFn = 'around' ;

// Is equal to one of the following
exports['is-one-of'] = ( ... args ) => {
	var i , iMax = args.length ;

	for ( i = 1 ; i < iMax ; i ++ ) {
		if ( args[ 0 ] === args[ i ] ) { return true ; }
	}

	return false ;
} ;
exports['is-one-of'].mode = mode.SINGLE_OP_AFTER ;



// Logical operators

exports.not = exports['!'] = arg => ! arg ;
exports['!'].mode = mode.SINGLE_OP_BEFORE ;
exports['!'].jsOp = '!' ;

exports.and = ( ... args ) => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; v && i < iMax ; i ++ ) { v = v && args[ i ] ; }
	return !! v ;
} ;
exports.and.mode = mode.MULTI_OP ;

exports.or = ( ... args ) => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; ! v && i < iMax ; i ++ ) { v = v || args[ i ] ; }
	return !! v ;
} ;
exports.or.mode = mode.MULTI_OP ;

/* Iterative XOR variant
exports.xor = function xor( args )
{
	var i = 1 , iMax = args.length , v = !! args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v ^= !! args[ i ] ; }
	return !! v ;
} ;
//*/

//* True exclusive XOR variant
exports.xor = ( ... args ) => {
	var i = 0 , iMax = args.length , trueCount = 0 ;
	for ( ; trueCount <= 1 && i < iMax ; i ++ ) { trueCount += args[ i ] && 1 || 0 ; }
	return trueCount === 1 ;
} ;
//*/
exports.xor.mode = mode.MULTI_OP ;

// Guard operator
exports.guard = exports['&&'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; v && i < iMax ; i ++ ) { v = v && args[ i ] ; }
	return v ;
} ;
exports['&&'].mode = mode.MULTI_OP ;
exports['&&'].jsOp = '&&' ;

// Default operator
exports.default = exports['||'] = ( ... args ) => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; ! v && i < iMax ; i ++ ) { v = v || args[ i ] ; }
	return v ;
} ;
exports['||'].mode = mode.MULTI_OP ;
exports['||'].jsOp = '||' ;

// Ternary, with switch-case-like behavior (like JS inline/nested ternaries)
exports['?'] = ( condition , trueExpr = true , ... args ) => {
	if ( condition ) { return trueExpr ; }

	// Switch-case-like
	var i , iMax ;
	for ( i = 0 , iMax = args.length ; i < iMax - 1 ; i += 2 ) {
		if ( args[ i ] ) { return args[ i + 1 ] ; }
	}

	if ( i < iMax ) { return args[ i ] ; }
	return false ;
} ;
exports['?'].mode = mode.SINGLE_OP_AFTER ;
exports['?'].jsSpecial = 'ternary' ;

// Null-coalescing
exports['??'] = ( value , defaultExpr = false ) => value != null ? value : defaultExpr ;	/* eslint-disable-line eqeqeq */
exports['??'].mode = mode.SINGLE_OP_AFTER ;
exports['??'].jsOp = '??' ;

// Three-way operator
exports.threeWay = exports['???'] = ( evaluation , negativeExpr , equalExpr , positiveExpr ) => {
	if ( evaluation < 0 ) { return negativeExpr ; }
	else if ( evaluation > 0 ) { return positiveExpr ; }
	return equalExpr ;
} ;
exports['???'].mode = mode.SINGLE_OP_AFTER ;
exports['???'].jsFn = 'threeWay' ;


// Cast

exports['<int>'] = ( value ) => {
	value = Math.round( + value ) ;
	if ( isFinite( value ) ) { return value ; }
	return NaN ;
} ;
exports['<int>'].mode = mode.SINGLE_OP_BEFORE ;

exports['<float>'] = ( value ) => + value ;
exports['<float>'].mode = mode.SINGLE_OP_BEFORE ;

exports['<string>'] = ( value ) => '' + value ;
exports['<string>'].mode = mode.SINGLE_OP_BEFORE ;

exports['<Array>'] = exports['<array>'] = ( value ) => {
	if ( value === undefined || value === null ) { return [] ; }
	if ( Array.isArray( value ) ) { return value ; }
	if ( typeof value[ Symbol.iterator ] === 'function' ) { return Array.from( value ) ; }
	return [ value ] ;
} ;
exports['<array>'].mode = mode.SINGLE_OP_BEFORE ;


// Rounding

exports.round = ( value , step = 1 ) => {
	if ( step === 1 ) { return Math.round( value ) ; }
	// use: value * ( 1 / step )
	// not: value / step
	// reason: epsilon rounding errors
	return step * Math.round( value * ( 1 / step ) ) ;
} ;
exports.round.mode = mode.FN ;

exports.floor = ( value , step = 1 ) => {
	if ( step === 1 ) { return Math.floor( value ) ; }
	// use: value * ( 1 / step )
	// not: value / step
	// reason: epsilon rounding errors
	return step * Math.floor( value * ( 1 / step ) ) ;
} ;
exports.floor.mode = mode.FN ;

exports.ceil = ( value , step = 1 ) => {
	if ( step === 1 ) { return Math.ceil( value ) ; }
	// use: value * ( 1 / step )
	// not: value / step
	// reason: epsilon rounding errors
	return step * Math.ceil( value * ( 1 / step ) ) ;
} ;
exports.ceil.mode = mode.FN ;

exports.trunc = ( value , step = 1 ) => {
	if ( step === 1 ) { return Math.trunc( value ) ; }
	// use: value * ( 1 / step )
	// not: value / step
	// reason: epsilon rounding errors
	return step * Math.trunc( value * ( 1 / step ) ) ;
} ;
exports.trunc.mode = mode.FN ;


// Various math functions

batchOfNativeStatic( Math , 'Math' , [
	'sign' , 'abs' ,
	'max' , 'min' ,
	'pow' , 'exp' ,
	'sqrt' , 'cbrt' ,
	'log' , 'log2' , 'log10' ,
	'cos' , 'sin' , 'tan' , 'acos' , 'asin' , 'atan' , 'atan2' , 'cosh' , 'sinh' , 'tanh' , 'acosh' , 'asinh' , 'atanh' ,
	'hypot'
] ) ;

// Aliases of native static function
exports['^'] = exports.pow ;

// Clamp a value, ensure it in bounds
exports.clamp = ( v , min , max ) =>
	min <= max ? ( v < min ? min : v > max ? max : v ) :
	( v < max ? max : v > min ? min : v ) ;
exports.clamp.mode = mode.FN ;

exports.avg = ( ... args ) => args.reduce( ( s , e ) => s + e , 0 ) / args.length ;
exports.avg.mode = mode.FN ;

// Linear interpolation, t should be [0;1]
exports.lerp = ( a , b , t ) => a + t * ( b - a ) ;
exports.lerp.mode = mode.FN ;

// Fourier series: fourier( t , period , [ weight1 , phase1 ] , [ weight2 , phase2 ] , ... )
// If a number is found instead of an array, it is a weight without phase change.
// If a phase is omitted, it uses the previous one.
exports.fourier = ( t , period , ... args ) => {
	var i , iMax , v = 0 , phase = 0 , weight ,
		baseF = ( 2 * Math.PI ) / period ;

	for ( i = 0 , iMax = args.length ; i < iMax ; i ++ ) {
		if ( Array.isArray( args[ i ] ) ) {
			weight = args[ i ][ 0 ] ;
			if ( args[ i ][ 1 ] !== undefined ) { phase = args[ i ][ 1 ] ; }
		}
		else {
			weight = args[ i ] ;
		}

		v += weight * Math.cos( ( i + 1 ) * baseF * t + phase ) ;
	}

	return v ;
} ;
exports.fourier.mode = mode.FN ;


// String operators

// Strcat
exports.strcat = exports['..'] = ( ... args ) => args.join( '' ) ;
exports['..'].mode = mode.MULTI_OP ;
exports['..'].jsOp = '+' ;

batchOfNativeStringMethod( mode.SINGLE_OP_AFTER , true , [
	'startsWith' , 'endsWith' , 'includes'
] ) ;

batchOfNativeStringMethod( mode.SINGLE_OP , true , [
	'indexOf' , 'lastIndexOf' , 'padStart' , 'padEnd' , 'slice'
] ) ;

batchOfNativeStringMethod( mode.FN , true , [
	'trim' , 'trimStart' , 'trimEnd' , 'toLowerCase' , 'toUpperCase'
] ) ;

// Aliases of native methods
exports.ltrim = exports['trim-start'] ;
exports.rtrim = exports['trim-end'] ;

// Trim also extra inner spaces
exports.itrim = ( str ) => ( '' + str ).trim().replace( /  +/g , ' ' ) ;
exports.itrim.mode = mode.FN ;



// Array operators

exports.array = ( ... args ) => args ;
exports.array.mode = mode.LIST ;

exports.concat = ( ... args ) => Array.prototype.concat.call( EMPTY_ARRAY , ... args ) ;
exports.concat.mode = mode.FN ;

exports.join = ( array , glue ) => {
	if ( ! Array.isArray( array ) ) { return array ; }
	return array.join( typeof glue === 'string' ? glue : '' ) ;
} ;
exports.join.mode = mode.FN ;


// Object operators

//exports[':'] =
exports.object = ( ... args ) => Object.fromEntries( args ) ;
exports.object.mode = mode.KV ;

// Must not modify existing, merge in a new object
exports.merge = ( ... args ) => Object.assign( {} , ... args ) ;
exports.merge.mode = mode.FN ;



// Type checker operators

exports['is-set?'] = ( value , trueExpr = true , falseExpr = false ) => value !== undefined ? trueExpr : falseExpr ;
exports['is-set?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-boolean?'] = ( value , trueExpr = true , falseExpr = false ) => typeof value === 'boolean' ? trueExpr : falseExpr ;
exports['is-boolean?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-number?'] = ( value , trueExpr = true , falseExpr = false ) => typeof value === 'number' ? trueExpr : falseExpr ;
exports['is-number?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-string?'] = ( value , trueExpr = true , falseExpr = false ) => typeof value === 'string' ? trueExpr : falseExpr ;
exports['is-string?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-array?'] = ( value , trueExpr = true , falseExpr = false ) => Array.isArray( value ) ? trueExpr : falseExpr ;
exports['is-array?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-object?'] = ( value , trueExpr = true , falseExpr = false ) => value && typeof value === 'object' && ! Array.isArray( value ) ? trueExpr : falseExpr ;
exports['is-object?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-real?'] = ( value , trueExpr = true , falseExpr = false ) =>
	typeof value === 'number' && ! Number.isNaN( value ) && value !== Infinity && value !== -Infinity ? trueExpr : falseExpr ;
exports['is-real?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-empty?'] = ( value , trueExpr = true , falseExpr = false ) => {
	var proto ;

	return ! value ? trueExpr :
		typeof value !== 'object' ? falseExpr :
		value.length === 0 ? trueExpr :
		value.size === 0 ? trueExpr :
		( proto = Object.getPrototypeOf( value ) ) === Object.prototype && Object.keys( value ).length === 0 ? trueExpr :
		proto === null && Object.keys( value ).length === 0 ? trueExpr :
		falseExpr ;
} ;
exports['is-empty?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-not-empty?'] = ( value , trueExpr = true , falseExpr = false ) => {
	var proto ;

	return ! value ? falseExpr :
		typeof value !== 'object' ? trueExpr :
		value.length === 0 ? falseExpr :
		value.size === 0 ? falseExpr :
		( proto = Object.getPrototypeOf( value ) ) === Object.prototype && Object.keys( value ).length === 0 ? falseExpr :
		proto === null && Object.keys( value ).length === 0 ? falseExpr :
		trueExpr ;
} ;
exports['is-not-empty?'].mode = mode.SINGLE_OP_AFTER ;


// Misc operators

exports.has = ( stack , searchValue ) => {
	if ( ! stack || typeof stack !== 'object' ) { return false ; }
	else if ( Array.isArray( stack ) ) { return stack.includes( searchValue ) ; }
	else if ( typeof stack.has === 'function' ) { return !! stack.has( searchValue ) ; }
	return false ;
} ;
exports.has.mode = mode.SINGLE_OP_AFTER ;



// Navigation operator
exports['.'] = ( pointer , ... args ) => {
	for ( let i = 0 , iMax = args.length ; i < iMax ; i ++ ) {
		if ( ! pointer || typeof pointer !== 'object' ) { return undefined ; }
		pointer = pointer[ args[ i ] ] ;
	}

	return pointer ;
} ;
exports['.'].mode = mode.MULTI_OP ;
exports['.'].jsSpecial = 'navigation' ;



// Spread operator
exports['...'] = arg => {
	if ( Array.isArray( arg ) ) {
		// Transform an array to a Stack
		return new Stack( ... arg ) ;
	}

	if ( arg && typeof arg === 'object' ) {
		// Transform an object to a Stack of ObjectEntry
		return new Stack( ... Object.entries( arg ).map( e => new ObjectEntry( ... e ) ) ) ;
	}

	return arg ;
} ;
exports['...'].mode = mode.SINGLE_OP_BEFORE ;
exports['...'].jsSpecial = 'spread' ;



// Apply operator
exports['->'] = ( fn , ... args ) => {
	if ( typeof fn !== 'function' ) { throw new SyntaxError( 'The apply operator needs a function as its left-hand-side operand' ) ; }
	return fn( ... args ) ;
} ;
exports['->'].boundFirst = true ;	// We need to bound the function, which is the first argument
exports['->'].mode = mode.SINGLE_OP_AFTER ;
exports['->'].jsSpecial = 'call' ;



// Unit conversion
const units = {} ;
// Use radian
units.deg = units.degree = units['°'] = v => v / 180 * Math.PI ;
// Use Kelvin
units.celsius = units['°C'] = v => v + 273.15 ;

for ( let unit in units ) {
	exports[ unit ] = units[ unit ] ;
	exports[ unit ].mode = mode.SINGLE_OP_AFTER ;
	exports[ unit ].jsFn = unit ;
}



// The function itself should know its identifier
for ( let key in exports ) {
	if ( ! exports[ key ].id ) { exports[ key ].id = key ; }
}

