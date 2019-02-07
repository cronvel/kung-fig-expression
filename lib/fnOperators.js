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



var mode = require( './mode.js' ) ;
const EMPTY_ARRAY = [] ;



// Any change here should be reflected in the official Atom grammar package



// Arithmetic operators

exports.add = exports['+'] = args => {
	//console.log( "op +" , args ) ;
	var sum = 0 ;
	args.forEach( e => sum += + e ) ;
	return sum ;
} ;
exports['+'].mode = mode.MULTI_OP ;

exports.sub = exports['-'] = args => {
	if ( args.length === 1 ) { return -args[ 0 ] ; }	// unary minus

	var i = 1 , iMax = args.length , v ;

	v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v -= + args[ i ] ; }
	return v ;
} ;
exports['-'].mode = mode.MULTI_OP ;

exports.mul = exports['*'] = args => {
	//console.log( "op +" , args ) ;
	var v = 1 ;
	args.forEach( e => v *= + e ) ;
	return v ;
} ;
exports['*'].mode = mode.MULTI_OP ;

exports.div = exports['/'] = args => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v /= + args[ i ] ; }
	return v ;
} ;
exports['/'].mode = mode.MULTI_OP ;

exports.intdiv = exports['\\'] = args => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = Math.trunc( v / ( + args[ i ] ) ) ; }
	return v ;
} ;
exports['\\'].mode = mode.MULTI_OP ;

exports.modulo = exports['%'] = args => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = v % ( + args[ i ] ) ; }
	return v ;
} ;
exports['%'].mode = mode.MULTI_OP ;

exports['\\\\'] = args => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;
	for ( ; i < iMax ; i ++ ) { v = Math.floor( v / ( + args[ i ] ) ) ; }
	return v ;
} ;
exports['\\\\'].mode = mode.MULTI_OP ;

// Positive modulo
exports['%+'] = args => {
	var i = 1 , iMax = args.length , v = + args[ 0 ] ;

	for ( ; i < iMax ; i ++ ) {
		v = v % ( + args[ i ] ) ;
		if ( v < 0 ) { v += + args[ i ] ; }
	}

	return v ;
} ;
exports['%+'].mode = mode.MULTI_OP ;


// Comparison operators

exports['>'] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] > args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['>'].mode = mode.MULTI_OP ;

exports['≥'] = exports['>='] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] >= args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['>='].mode = mode.MULTI_OP ;

exports['<'] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] < args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['<'].mode = mode.MULTI_OP ;

exports['≤'] = exports['<='] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] <= args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['<='].mode = mode.MULTI_OP ;

exports['==='] = exports['=='] = exports['='] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] === args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['='].mode = mode.MULTI_OP ;

exports['≠'] = exports['!=='] = exports['!='] = args => {
	var i = 0 , iMax = args.length - 1 ;

	for ( ; i < iMax ; i ++ ) {
		// Intentional construct, because of NaN
		if ( ! ( args[ i ] !== args[ i + 1 ] ) ) { return false ; }
	}

	return true ;
} ;
exports['!='].mode = mode.MULTI_OP ;

// Around, almost equal to, with a factor
exports['≈'] = exports['%='] = args => {
	if ( args[ 0 ] === args[ 1 ] ) { return true ; }

	if (
		typeof args[ 0 ] !== 'number' ||
		typeof args[ 1 ] !== 'number' ||
		typeof args[ 2 ] !== 'number' ||
		! ( args[ 0 ] * args[ 1 ] > 0 )		// to catch NaN...
	) {
		return false ;
	}

	var maxRate = args[ 2 ] ;
	if ( maxRate < 1 ) { maxRate = 1 / maxRate ; }

	var deltaRate = args[ 0 ] / args[ 1 ] ;
	if ( deltaRate < 1 ) { deltaRate = 1 / deltaRate ; }

	return deltaRate <= maxRate ;
} ;
exports['%='].mode = mode.SINGLE_OP ;


// Logical operators

exports.not = exports['!'] = args => ! args[ 0 ] ;
exports['!'].mode = mode.SINGLE_OP ;

exports.and = args => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; v && i < iMax ; i ++ ) { v = v && args[ i ] ; }
	return !! v ;
} ;
exports.and.mode = mode.MULTI_OP ;

exports.or = args => {
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
exports.xor = args => {
	var i = 0 , iMax = args.length , trueCount = 0 ;
	for ( ; trueCount <= 1 && i < iMax ; i ++ ) { trueCount += args[ i ] && 1 || 0 ; }
	return trueCount === 1 ;
} ;
//*/
exports.xor.mode = mode.MULTI_OP ;

// Guard operator
exports['&&'] = args => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; v && i < iMax ; i ++ ) { v = v && args[ i ] ; }
	return v ;
} ;
exports['&&'].mode = mode.MULTI_OP ;

// Default operator
exports['||'] = args => {
	var i = 1 , iMax = args.length , v = args[ 0 ] ;
	for ( ; ! v && i < iMax ; i ++ ) { v = v || args[ i ] ; }
	return v ;
} ;
exports['||'].mode = mode.MULTI_OP ;

// Ternary
exports['?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return args[ 0 ] ? trueVal : falseVal ;
} ;
exports['?'].mode = mode.SINGLE_OP ;

// Three-way operator
exports['???'] = args => {
	if ( args[ 0 ] < 0 ) { return args[ 1 ] ; }
	else if ( args[ 0 ] > 0 ) { return args[ 3 ] ; }
	return args[ 2 ] ;
} ;
exports['???'].mode = mode.SINGLE_OP ;


// Rounding

exports.round = args => {
	if ( args.length <= 1 ) { return Math.round( args[ 0 ] ) ; }
	// use: args[ 0 ] * ( 1 / args[ 1 ] )
	// not: args[ 0 ] / args[ 1 ]
	// reason: epsilon rounding errors
	return args[ 1 ] * Math.round( args[ 0 ] * ( 1 / args[ 1 ] ) ) ;
} ;
exports.round.mode = mode.FN ;

exports.floor = args => {
	if ( args.length <= 1 ) { return Math.floor( args[ 0 ] ) ; }
	// use: args[ 0 ] * ( 1 / args[ 1 ] )
	// not: args[ 0 ] / args[ 1 ]
	// reason: epsilon rounding errors
	return args[ 1 ] * Math.floor( args[ 0 ] * ( 1 / args[ 1 ] ) ) ;
} ;
exports.floor.mode = mode.FN ;

exports.ceil = args => {
	if ( args.length <= 1 ) { return Math.ceil( args[ 0 ] ) ; }
	// use: args[ 0 ] * ( 1 / args[ 1 ] )
	// not: args[ 0 ] / args[ 1 ]
	// reason: epsilon rounding errors
	return args[ 1 ] * Math.ceil( args[ 0 ] * ( 1 / args[ 1 ] ) ) ;
} ;
exports.ceil.mode = mode.FN ;

exports.trunc = args => {
	if ( args.length <= 1 ) { return Math.trunc( args[ 0 ] ) ; }
	// use: args[ 0 ] * ( 1 / args[ 1 ] )
	// not: args[ 0 ] / args[ 1 ]
	// reason: epsilon rounding errors
	return args[ 1 ] * Math.trunc( args[ 0 ] * ( 1 / args[ 1 ] ) ) ;
} ;
exports.trunc.mode = mode.FN ;


// Various math functions

exports.sign = args => Math.sign( args[ 0 ] ) ;
exports.sign.mode = mode.FN ;

exports.abs = args => Math.abs( args[ 0 ] ) ;
exports.abs.mode = mode.FN ;

exports.max = args => Math.max( ... args ) ;
exports.max.mode = mode.FN ;

exports.min = args => Math.min( ... args ) ;
exports.min.mode = mode.FN ;

exports.pow = exports['^'] = args => Math.pow( args[ 0 ] , args[ 1 ] ) ;
exports.pow.mode = mode.FN ;

exports.exp = args => Math.exp( args[ 0 ] ) ;
exports.exp.mode = mode.FN ;

exports.log = args => Math.log( args[ 0 ] ) ;
exports.log.mode = mode.FN ;

exports.log2 = args => Math.log2( args[ 0 ] ) ;
exports.log2.mode = mode.FN ;

exports.log10 = args => Math.log10( args[ 0 ] ) ;
exports.log10.mode = mode.FN ;

exports.sqrt = args => Math.sqrt( args[ 0 ] ) ;
exports.sqrt.mode = mode.FN ;

exports.cos = args => Math.cos( args[ 0 ] ) ;
exports.cos.mode = mode.FN ;

exports.sin = args => Math.sin( args[ 0 ] ) ;
exports.sin.mode = mode.FN ;

exports.tan = args => Math.tan( args[ 0 ] ) ;
exports.tan.mode = mode.FN ;

exports.acos = args => Math.acos( args[ 0 ] ) ;
exports.acos.mode = mode.FN ;

exports.asin = args => Math.asin( args[ 0 ] ) ;
exports.asin.mode = mode.FN ;

exports.atan = args => Math.atan( args[ 0 ] ) ;
exports.atan.mode = mode.FN ;

exports.atan2 = args => Math.atan2( args[ 0 ] , args[ 1 ] ) ;
exports.atan2.mode = mode.FN ;

exports.cosh = args => Math.cosh( args[ 0 ] ) ;
exports.cosh.mode = mode.FN ;

exports.sinh = args => Math.sinh( args[ 0 ] ) ;
exports.sinh.mode = mode.FN ;

exports.tanh = args => Math.tanh( args[ 0 ] ) ;
exports.tanh.mode = mode.FN ;

exports.acosh = args => Math.acosh( args[ 0 ] ) ;
exports.acosh.mode = mode.FN ;

exports.asinh = args => Math.asinh( args[ 0 ] ) ;
exports.asinh.mode = mode.FN ;

exports.atanh = args => Math.atanh( args[ 0 ] ) ;
exports.atanh.mode = mode.FN ;

exports.hypot = args => Math.hypot( ... args ) ;
exports.hypot.mode = mode.FN ;

exports.avg = args => {
	if ( args.length === 1 && Array.isArray( args[ 0 ] ) ) { args = args[ 0 ] ; }

	var sum = 0 ;
	args.forEach( e => sum += + e ) ;
	return sum / args.length ;
} ;
exports.avg.mode = mode.FN ;


// Around/almost equal to: sort of equal, with a delta error rate

// String operators

// Strcat
exports['.'] = args => args.join( '' ) ;
exports['.'].mode = mode.MULTI_OP ;



// Array operators

exports.array = args => args ;
exports.array.mode = mode.LIST ;

exports.concat = args => Array.prototype.concat.call( EMPTY_ARRAY , ... args ) ;
exports.concat.mode = mode.FN ;

exports.join = args => {
	if ( ! Array.isArray( args[ 0 ] ) ) { return args[ 0 ] ; }
	return args[ 0 ].join( typeof args[ 1 ] === 'string' ? args[ 1 ] : '' ) ;
} ;
exports.join.mode = mode.FN ;


// Object operators

//exports[':'] =
exports.object = args => {
	var i , key ,
		length = args.length ,
		obj = {} ;

	//console.log( '\n\nobject args:' , args ) ;

	for ( i = 0 ; i < length ; i ++ ) {
		key = args[ i ] ;

		if ( ! key ) { return ; }

		if ( typeof key !== 'string' ) { return ; }
		obj[ key ] = args[ ++ i ] ;
	}

	return obj ;
} ;
exports.object.mode = mode.KV ;



// Type checker operators

exports['is-set?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return args[ 0 ] !== undefined ? trueVal : falseVal ;
} ;
exports['is-set?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-boolean?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return typeof args[ 0 ] === 'boolean' ? trueVal : falseVal ;
} ;
exports['is-boolean?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-number?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return typeof args[ 0 ] === 'number' ? trueVal : falseVal ;
} ;
exports['is-number?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-string?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return typeof args[ 0 ] === 'string' ? trueVal : falseVal ;
} ;
exports['is-string?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-array?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return Array.isArray( args[ 0 ] ) ? trueVal : falseVal ;
} ;
exports['is-array?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-object?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return args[ 0 ] && typeof args[ 0 ] === 'object' && ! Array.isArray( args[ 0 ] ) ? trueVal : falseVal ;
} ;
exports['is-object?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-real?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return typeof args[ 0 ] === 'number' && ! Number.isNaN( args[ 0 ] ) && args[ 0 ] !== Infinity && args[ 0 ] !== -Infinity ?
		trueVal : falseVal ;
} ;
exports['is-real?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-empty?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return ! ( args[ 0 ] && ( ! Array.isArray( args[ 0 ] ) || args[ 0 ].length ) ) ? trueVal : falseVal ;
} ;
exports['is-empty?'].mode = mode.SINGLE_OP_AFTER ;

exports['is-not-empty?'] = args => {
	var trueVal = args.length >= 2 ? args[ 1 ] : true ,
		falseVal = args.length >= 3 ? args[ 2 ] : false ;

	return args[ 0 ] && ( ! Array.isArray( args[ 0 ] ) || args[ 0 ].length ) ? trueVal : falseVal ;
} ;
exports['is-not-empty?'].mode = mode.SINGLE_OP_AFTER ;


// Misc operators

exports.has = args => {
	if ( ! args[ 0 ] || typeof args[ 0 ] !== 'object' ) { return false ; }
	else if ( Array.isArray( args[ 0 ] ) ) { return args[ 0 ].indexOf( args[ 1 ] ) !== -1 ; }
	else if ( typeof args[ 0 ].has === 'function' ) { return !! args[ 0 ].has( args[ 1 ] ) ; }
	return false ;
} ;
exports.has.mode = mode.SINGLE_OP ;

// Apply operator
exports['->'] = args => {
	if ( typeof args[ 0 ] !== 'function' ) { throw new SyntaxError( 'The apply operator needs a function as its left-hand-side operand' ) ; }
	return args[ 0 ].apply( undefined , args.slice( 1 ) ) ;
} ;
exports['->'].mode = mode.SINGLE_OP ;

exports['->'].solveArgs = function( ctx ) {
	return this.args.map( ( e , i ) => e && typeof e === 'object' && e.__isDynamic__ ? e.getFinalValue( ctx , ! i ) : e ) ;
} ;



// The function itself should know its identifier
for ( let key in exports ) {
	if ( ! exports[ key ].id ) { exports[ key ].id = key ; }
}

