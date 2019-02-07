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

/* global describe, it, expect */

"use strict" ;



const Expression = require( '..' ) ;
//const Dynamic = require( 'kung-fig-dynamic' ) ;



const string = require( 'string-kit' ) ;
function deb( v ) {
	console.log( string.inspect( { style: 'color' , depth: 15 , funcDetails: true } , v ) ) ;
}

/*
function debfn( v ) {
	console.log( string.inspect( { style: 'color' , depth: 5 , proto: true , funcDetails: true } , v ) ) ;
}
*/



describe( "Expression" , () => {

	describe( "zzz New syntax" , () => {

		it( "base" , () => {
			var parsed ;
			
			parsed = Expression.parse( '1 + 2' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 3 ) ;
			
			parsed = Expression.parse( '1' ) ;
			deb( parsed ) ;
			expect( parsed ).to.be( 1 ) ;
			
			parsed = Expression.parse( '1 , 2 , 3' ) ;
			deb( parsed ) ;
			expect( parsed ).to.be( 1 ) ;
			
			parsed = Expression.parse( '( 1 , 2 , 3 )' ) ;
			deb( parsed ) ;
			expect( parsed ).to.equal( 1 ) ;

			parsed = Expression.parse( '1 + ( 2 * 3 )' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 7 ) ;

			parsed = Expression.parse( '1 + 2 , 3 , 4' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 3 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 , 3 , 4 )' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 10 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 * 3 , 4 )' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 11 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 * 3 , 4 / 2 )' ) ;
			deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 9 ) ;
		} ) ;
		
		/*
		it( "1" , () => {
			var parsed ;
			parsed = Expression.parse( '1 + 2 , 2 / 3 , 7 * 2' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 2/3 , 14 ] ) ;
		} ) ;

		it( "2" , () => {
			var parsed ;
			parsed = Expression.parse( '( ceil 1.2 , floor 1.2 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 2 , 1 ] ) ;
		} ) ;
		*/
	} ) ;

	describe( "Syntax" , () => {

		it( "parse/exec a simple expression" , () => {
			var parsed ;
			parsed = Expression.parse( '1 + 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;
		} ) ;

		it( "parse/exec an expression with constant operands" , () => {
			var parsed ;

			parsed = Expression.parse( 'true && true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'null && true' ) ;
			expect( parsed.getFinalValue() ).to.be( null ) ;

			parsed = Expression.parse( 'null || false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true && false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true || false' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1 + Infinity' ) ;
			expect( parsed.getFinalValue() ).to.be( Infinity ) ;
		} ) ;

		it( "parse/exec a simple expression of expression" , () => {
			var parsed ;

			parsed = Expression.parse( '1 + ( 2 + 3 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( '( 2 + 3 ) + 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( '( ( 5 + 1 ) + 6 ) + ( 2 + ( 3 + 4 ) )' ) ;
			expect( parsed.getFinalValue() ).to.be( 21 ) ;
		} ) ;

		it( "parse/exec an expression with operator repetition" , () => {
			var parsed ;

			parsed = Expression.parse( '1 + 2 + 3' ) ;
			expect( parsed.args ).to.equal( [ 1 , 2 , 3 ] ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( '1 + 2 + 3 + -4' ) ;
			expect( parsed.args ).to.equal( [ 1 , 2 , 3 , -4 ] ) ;
			expect( parsed.getFinalValue() ).to.be( 2 ) ;
		} ) ;

		it( "parse/exec an expression with explicit array operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'array' ) ;
			expect( parsed.args ).to.equal( [] ) ;
			expect( parsed.getFinalValue() ).to.equal( [] ) ;

			parsed = Expression.parse( 'array 1' ) ;
			expect( parsed.args ).to.equal( [ 1 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 ] ) ;

			parsed = Expression.parse( 'array 1 2 3' ) ;
			expect( parsed.args ).to.equal( [ 1 , 2 , 3 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( 'array ( 1 , 2 , 3 )' ) ;
			expect( parsed.args ).to.equal( [ 1 , 2 , 3 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;
		} ) ;

		it( "parse/exec an expression with the array syntax" , () => {
			var parsed ;

			parsed = Expression.parse( '[]' ) ;
			expect( parsed.args ).to.be.like( [] ) ;
			expect( parsed.getFinalValue() ).to.equal( [] ) ;

			parsed = Expression.parse( '[ 1 ]' ) ;
			expect( parsed.args ).to.be.like( [ 1 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 ] ) ;

			parsed = Expression.parse( '[ 1 , 2 ]' ) ;
			expect( parsed.args ).to.be.like( [ 1 , 2 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 ] ) ;

			parsed = Expression.parse( '[ 1 , 2 , 3 ]' ) ;
			expect( parsed.args ).to.be.like( [ 1 , 2 , 3 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( '[1,2,3]' ) ;
			expect( parsed.args ).to.be.like( [ 1 , 2 , 3 ] ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;
		} ) ;

		it( "parse/exec an expression with explicit object operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'object key: "value"' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;

			parsed = Expression.parse( 'object( key1: "value1", key2: 2 )' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;
		} ) ;

		it( "parse/exec an expression with implicit object creation" , () => {
			var parsed ;

			parsed = Expression.parse( '"key" : "value"' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( '"key1": "value1" "key2": 2' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;

			parsed = Expression.parse( '"key1": "value1" , "key2": 2' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;
		} ) ;

		it( "parse/exec implicit object with quoteless keys" , () => {
			var parsed ;

			parsed = Expression.parse( 'key: "value"' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'key1: "value1" key2: 2' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;

			parsed = Expression.parse( 'key1: "value1" , key2: 2' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;
		} ) ;

		it( "object syntax: direct expression in property" , () => {
			var parsed ;

			parsed = Expression.parse( 'key1: 2 + 3' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 5 } ) ;

			parsed = Expression.parse( 'key1: 2 + 3 , key2: 3 / 5' ) ;
			//console.log( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 5 , key2: 0.6 } ) ;
		} ) ;

		it( "ambiguous object syntax" , () => {
			var parsed ;

			expect( () => Expression.parse( 'array key: "value"' ) ).to.throw() ;
			expect( () => Expression.parse( 'add key: "value"' ) ).to.throw() ;

			parsed = Expression.parse( 'array ( key1: "value1", key2: 2 )' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( [ { key1: 'value1' , key2: 2 } ] ) ;

			parsed = Expression.parse( 'array ( key1: "value1" )' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( [ { key1: 'value1' } ] ) ;

			parsed = Expression.parse( 'array ( key1: "value1" ) ( key2: 2 )' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( [ { key1: 'value1' } , { key2: 2 } ] ) ;

			parsed = Expression.parse( 'array ( key1: "value1" ) , ( key2: 2 )' ) ;
			//parsed = Expression.parse( 'key1: "value1", key2: 2' ) ;
			//console.log( '\n\n' , parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( [ { key1: 'value1' } , { key2: 2 } ] ) ;
		} ) ;

		it( "parse/exec an expression featuring the comma separator syntax" , () => {
			var parsed ;

			parsed = Expression.parse( 'add( 1 , 2 , 3 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( 'add( 2 * 4 , 3 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 11 ) ;

			parsed = Expression.parse( 'add( 2 , 4 * 2 , 3 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 13 ) ;

			parsed = Expression.parse( 'add( 2 , 4 , 3 * 2 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 12 ) ;

			parsed = Expression.parse( 'add( 2 * 4 , 3 * 5 , 2 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 25 ) ;

			parsed = Expression.parse( 'add( 2 * 4 , 3 * 5 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 23 ) ;

			parsed = Expression.parse( 'add( 1 , 2 * 4 , 3 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 12 ) ;

			parsed = Expression.parse( 'add( 1 + 3 , 2 * 4 , 3 ^ 2 )' ) ;
			expect( parsed.getFinalValue() ).to.be( 21 ) ;
		} ) ;

		it( "optional spaces around commas" , () => {
			var parsed ;

			parsed = Expression.parse( 'array(1 , 2 , 3)' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( 'array(1 ,2 ,3)' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( 'array(1, 2, 3)' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( 'array(1,2,3)' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( 'array("one","two","three")' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ "one" , "two" , "three" ] ) ;
		} ) ;

		it( "optional spaces around parenthesis" , () => {
			var parsed ;

			parsed = Expression.parse( 'array(1,2,3,4)5' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , 3 , 4 , 5 ] ) ;
		} ) ;
	} ) ;



	describe( "Operators" , () => {

		it( "parse/exec the integer division '\\' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '0 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '3 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '7 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '6 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '8 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 2 ) ;

			parsed = Expression.parse( '17 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( '-1 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '-7 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '-8 \\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -2 ) ;
		} ) ;

		it( "parse/exec the floored integer division '\\\\' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '0 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '3 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '7 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '6 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '8 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 2 ) ;

			parsed = Expression.parse( '17 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( '-1 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '-7 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -2 ) ;

			parsed = Expression.parse( '-8 \\\\ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -2 ) ;
		} ) ;

		it( "parse/exec the modulo '%' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '0 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '3 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( '7 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( '6 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 2 ) ;

			parsed = Expression.parse( '8 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '17 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '-1 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '-7 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( -3 ) ;

			parsed = Expression.parse( '-8 % 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;
		} ) ;

		it( "parse/exec the positive modulo '%+' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '0 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '3 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( '7 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( '6 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 2 ) ;

			parsed = Expression.parse( '8 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;

			parsed = Expression.parse( '17 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '-1 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( '-7 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '-8 %+ 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;
		} ) ;

		it( "parse/exec the greater than '>' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 > 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 > 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '4 > 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 > 3 > 2' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 > 2 > 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '4 > 4 > 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '6 > 4 > 3 > 1' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the greater than '>=' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 >= 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 >= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 >= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 >= 3 >= 2' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 >= 2 >= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '4 >= 4 >= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '6 >= 4 >= 3 >= 1' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the greater than '<' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 < 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 < 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '4 < 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '2 < 3 < 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 < 2 < 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 < 4 < 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '1 < 3 < 4 < 5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the greater than '<=' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 <= 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 <= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 <= 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '2 <= 3 <= 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 <= 2 <= 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 <= 4 <= 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1 <= 4 <= 6 <= 7' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the greater than '=' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 = 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 = 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 = 3 = 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 = 3 = 3' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the greater than '!=' operator" , () => {
			var parsed ;

			parsed = Expression.parse( '3 != 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '3 != 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			// Not much sens, but well...
			parsed = Expression.parse( '3 != 3 != 4' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '3 != 3 != 3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '4 != 3 != 5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '4 != 3 != 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
		} ) ;

		it( "parse/exec the 'and' operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'true and true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'true and false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false and true' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false and false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true and 1 and "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'true and 1 and null and "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec the guard operator &&" , () => {
			var parsed ;

			parsed = Expression.parse( 'true && true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'true && false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false && true' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false && false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true && 1 && "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( "hey" ) ;

			parsed = Expression.parse( 'true && 1 && null && "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( null ) ;
		} ) ;

		it( "parse/exec the 'or' operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'true or true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'true or false' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false or true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false or false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '"hey" or 2 or true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'null or 4 or false or "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'null or false or 0' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec the default operator ||" , () => {
			var parsed ;

			parsed = Expression.parse( 'true || true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'true || false' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false || true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false || false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '"hey" || 2 || true' ) ;
			expect( parsed.getFinalValue() ).to.be( "hey" ) ;

			parsed = Expression.parse( 'null || 4 || false || "hey"' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'null || false || 0' ) ;
			expect( parsed.getFinalValue() ).to.be( 0 ) ;
		} ) ;

		it( "parse/exec the 'xor' operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'true xor true' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true xor false' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false xor true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( 'false xor false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			/* iterative XOR variant
			parsed = Expression.parse( 'true xor true xor true' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
			//*/

			//* true exclusive XOR variant: should have one and only one truthy operand
			parsed = Expression.parse( 'true xor true xor true' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'true xor true xor true xor true' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false xor false xor false xor false' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'false xor true xor false xor false' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;
			//*/
		} ) ;

		it( "parse/exec has operator" , () => {
			var parsed ;

			parsed = Expression.parse( '( 3 4 5 ) has 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '( 3 4 5 ) has 6' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '( 3 "str" 5 ) has "str"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '( 3 "str" 5 ) has "str2"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec . (dot) operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"one" . "two"' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwo" ) ;

			parsed = Expression.parse( '"one" . "two" . "three"' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwothree" ) ;

			parsed = Expression.parse( 'false . "one" . 2 . "three" true' ) ;
			expect( parsed.getFinalValue() ).to.be( "falseone2threetrue" ) ;
		} ) ;

		it( "parse/exec concat operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'concat 3 4 5' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 ] ) ;

			parsed = Expression.parse( 'concat ( 3 4 ) ( 5 6 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 , 6 ] ) ;

			parsed = Expression.parse( 'concat ( array 3 , 4 ) , ( array 5 , 6 ) , ( array 7 , 8 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 , 6 , 7 , 8 ] ) ;
		} ) ;

		it( "parse/exec join operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'join ( "one" )' ) ;
			expect( parsed.getFinalValue() ).to.be( "one" ) ;

			parsed = Expression.parse( 'join "one"' ) ;
			expect( parsed.getFinalValue() ).to.be( "one" ) ;

			parsed = Expression.parse( 'join ( "one" "two" "three" )' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwothree" ) ;

			parsed = Expression.parse( 'join ( "one" "two" "three" ) ", "' ) ;
			expect( parsed.getFinalValue() ).to.be( "one, two, three" ) ;
		} ) ;

		it( "parse/exec hypot operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'hypot 3 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'hypot 3 4 5' ) ;
			expect( parsed.getFinalValue() ).to.be( 7.0710678118654755 ) ;
		} ) ;

		it( "parse/exec avg" , () => {
			var parsed ;

			var ctx = {
				array: [ 2 , 3 , 7 ]
			} ;

			parsed = Expression.parse( 'avg 3 5 7' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'avg -4  10 27 3' ) ;
			expect( parsed.getFinalValue() ).to.be( 9 ) ;

			parsed = Expression.parse( 'avg $array' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 4 ) ;
		} ) ;

		it( "parse/exec the '%=' (around) operator" , () => {
			var parsed ;

			parsed = Expression.parse( '70 %= 50 1.3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '50 %= 70 1.3' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '70 %= 50 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '50 %= 70 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '-50 %= -70 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '50 %= -70 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '0 %= 0 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '0 %= 0.001 1.5' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '30 %= 40 2' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '20 %= 40 2' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '19 %= 40 2' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec three-way" , () => {
			var parsed ;

			parsed = Expression.parse( '1 ??? 4 5 6' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( '-1 ??? 4 5 6' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( '0 ??? 4 5 6' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;
		} ) ;

		it( "parse/exec round/floor/ceil operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'round 4.3' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 4.3' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'ceil 4.3' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'round 4.7' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'floor 4.7' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'ceil 4.7' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;
		} ) ;

		it( "parse/exec round/floor/ceil operator with precision" , () => {
			var parsed ;

			parsed = Expression.parse( 'round 4.3 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'round 4.2 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'round 4.3 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4.5 ) ;

			parsed = Expression.parse( 'round 4.3 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'round 5 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;


			parsed = Expression.parse( 'floor 4.3 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 4.2 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 4.3 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 4.8 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4.5 ) ;

			parsed = Expression.parse( 'floor 4.3 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 5 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( 'floor 5.5 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;


			parsed = Expression.parse( 'ceil 4.3 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'ceil 4.2 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4.5 ) ;

			parsed = Expression.parse( 'ceil 4.3 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 4.5 ) ;

			parsed = Expression.parse( 'ceil 4.6 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 5 ) ;

			parsed = Expression.parse( 'ceil 4.3 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( 'ceil 5 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 6 ) ;

			parsed = Expression.parse( 'ceil 6.1 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 8 ) ;
		} ) ;

		it( "parse/exec the '?' ternary operators" , () => {
			var parsed ;

			parsed = Expression.parse( '0 ?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '1 ?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			// True ternary mode
			parsed = Expression.parse( '0 ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;

			parsed = Expression.parse( '1 ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "great" ) ;

			parsed = Expression.parse( 'null ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;

			parsed = Expression.parse( 'false ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;

			parsed = Expression.parse( 'true ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "great" ) ;

			parsed = Expression.parse( '"" ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;

			parsed = Expression.parse( '"something" ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "great" ) ;

			parsed = Expression.parse( '$unknown ? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;
		} ) ;

		it( "parse/exec is-set? operators" , () => {
			var parsed ;

			parsed = Expression.parse( '$unknown is-set?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '0 is-set?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1 is-set?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			// Ternary mode
			parsed = Expression.parse( '1 is-set? "great"' ) ;
			expect( parsed.getFinalValue() ).to.be( "great" ) ;

			parsed = Expression.parse( '1 is-set? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "great" ) ;

			parsed = Expression.parse( '$unknown is-set? "great"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '$unknown is-set? "great" "bad"' ) ;
			expect( parsed.getFinalValue() ).to.be( "bad" ) ;
		} ) ;

		it( "parse/exec is-empty? operators" , () => {
			var parsed ;

			parsed = Expression.parse( '$unknown is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '0 is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1 is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '( array ) is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '( array 1 ) is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '( array 1 2 3 ) is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '( array 0 ) is-empty?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			// Ternary mode
			parsed = Expression.parse( '0 is-empty? "empty"' ) ;
			expect( parsed.getFinalValue() ).to.be( "empty" ) ;

			parsed = Expression.parse( '1 is-empty? "empty" "not-empty"' ) ;
			expect( parsed.getFinalValue() ).to.be( "not-empty" ) ;
		} ) ;

		it( "parse/exec is-real? operators" , () => {
			var parsed ;

			parsed = Expression.parse( '0 is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1 is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '1.5 is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '-1.5 is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '-1.5 is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '( 1 / 0 ) is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( 'Infinity is-real?' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			// Ternary mode
			parsed = Expression.parse( '-1.5 is-real? "real"' ) ;
			expect( parsed.getFinalValue() ).to.be( "real" ) ;

			parsed = Expression.parse( '( 1 / 0 ) is-real? "real" "not-real"' ) ;
			expect( parsed.getFinalValue() ).to.be( "not-real" ) ;
		} ) ;

		it( "parse/exec the 'pi'/π constant" , () => {
			var parsed ;

			parsed = Expression.parse( 'π' ) ;
			expect( parsed ).to.be( Math.PI ) ;

			parsed = Expression.parse( 'π + 0' ) ;
			expect( parsed.getFinalValue() ).to.be( Math.PI ) ;

			parsed = Expression.parse( 'pi + 0' ) ;
			expect( parsed.getFinalValue() ).to.be( Math.PI ) ;
		} ) ;

		it( "parse/exec the 'e' constant" , () => {
			var parsed ;

			parsed = Expression.parse( 'e' ) ;
			expect( parsed ).to.be( Math.E ) ;

			parsed = Expression.parse( 'e + 0' ) ;
			expect( parsed.getFinalValue() ).to.be( Math.E ) ;
		} ) ;

		it( "parse/exec apply operator" , () => {
			var parsed , ctx , object ;

			object = { a: 3 , b: 5 } ;
			object.fn = function( v ) { return this.a * v + this.b ; } ;

			ctx = {
				fn: function( v ) { return v * 2 + 1 ; } ,
				object: object
			} ;

			parsed = Expression.parse( '$fn -> 3' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 7 ) ;

			parsed = Expression.parse( '$object.fn -> 3' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 14 ) ;
		} ) ;

		it( "parse/exec custom operator" , () => {
			var parsed , ctx , operators , object , v ;

			object = { a: 3 , b: 5 } ;
			object.fn = function( v_ ) { return this.a * v_ + this.b ; } ;

			ctx = {
				fn: function( v_ ) { return v_ * 2 + 1 ; } ,
				object: object
			} ;

			operators = {
				D: function( args ) {
					var sum = 0 , n = args[ 0 ] , faces = args[ 1 ] ;
					for ( ; n > 0 ; n -- ) { sum += 1 + Math.floor( Math.random() * faces ) ; }
					return sum ;
				}
			} ;

			parsed = Expression.parse( '3 D 6' , operators ) ;
			//deb( parsed ) ;
			v = parsed.getFinalValue( ctx ) ;
			//deb( v ) ;
			expect( v >= 1 && v <= 18 , true ) ;
		} ) ;
	} ) ;



	describe( "Stringify" , () => {

		it( "stringify a simple expression" , () => {
			expect( Expression.parse( 'true && true' ).stringify() ).to.be( 'true && true' ) ;
			expect( Expression.parse( 'true || false' ).stringify() ).to.be( 'true || false' ) ;
			expect( Expression.parse( 'null and false' ).stringify() ).to.be( 'null and false' ) ;
			expect( Expression.parse( 'NaN or Infinity' ).stringify() ).to.be( 'NaN or Infinity' ) ;
			expect( Expression.parse( 'Infinity or -Infinity' ).stringify() ).to.be( 'Infinity or -Infinity' ) ;
			expect( Expression.parse( '( e * pi ) + phi' ).stringify() ).to.be( '( e * pi ) + phi' ) ;
			expect( Expression.parse( '1 + 2' ).stringify() ).to.be( '1 + 2' ) ;
			expect( Expression.parse( 'add 1 2' ).stringify() ).to.be( '1 + 2' ) ;
			expect( Expression.parse( 'add 1 2 3' ).stringify() ).to.be( '1 + 2 + 3' ) ;
			expect( Expression.parse( 'max 1 2 3' ).stringify() ).to.be( 'max 1 , 2 , 3' ) ;
			expect( Expression.parse( '- 1' ).stringify() ).to.be( '- 1' ) ;
			expect( Expression.parse( '$my.var - 1' ).stringify() ).to.be( '$my.var - 1' ) ;
			expect( Expression.parse( '! $my.var' ).stringify() ).to.be( '! $my.var' ) ;
			expect( Expression.parse( '$my.var is-real?' ).stringify() ).to.be( '$my.var is-real?' ) ;
			expect( Expression.parse( '"some" . "concat" . "string"' ).stringify() ).to.be( '"some" . "concat" . "string"' ) ;
			expect( Expression.parse( '"key1": "value1"' ).stringify() ).to.be( '"key1": "value1"' ) ;
			expect( Expression.parse( '"key1": "value1" "key2": "value2"' ).stringify() ).to.be( '"key1": "value1" , "key2": "value2"' ) ;
		} ) ;

		it( "stringify an expression with sub-expression" , () => {
			expect( Expression.parse( '1 + ( 2 * 3 )' ).stringify() ).to.be( '1 + ( 2 * 3 )' ) ;
			expect( Expression.parse( '1 + ( 2 * ( exp 3 ) )' ).stringify() ).to.be( '1 + ( 2 * ( exp 3 ) )' ) ;
		} ) ;
	} ) ;



	describe( "Historical bugs" , () => {

		// may check object multi-reference too
		it( "array multi-reference to the same array" , () => {
			var parsed ;

			parsed = Expression.parse( 'array 1 2 ( array 3 4 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , [ 3 , 4 ] ] ) ;
			expect( parsed.getFinalValue() === parsed.getFinalValue() ).to.be( false ) ;
			expect( parsed.getFinalValue()[ 2 ] === parsed.getFinalValue()[ 2 ] , false ) ;

			parsed = Expression.parse( 'array 1 2 ( 3 4 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , [ 3 , 4 ] ] ) ;
			expect( parsed.getFinalValue() === parsed.getFinalValue() ).to.be( false ) ;
			expect( parsed.getFinalValue()[ 2 ] === parsed.getFinalValue()[ 2 ] , false ) ;

			parsed = Expression.parse( '1 2 ( 3 4 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , [ 3 , 4 ] ] ) ;
			expect( parsed.getFinalValue() === parsed.getFinalValue() ).to.be( false ) ;
			expect( parsed.getFinalValue()[ 2 ] === parsed.getFinalValue()[ 2 ] , false ) ;
		} ) ;

		it( "extra spaces parse bug" , () => {
			var parsed = Expression.parse( '0 ? ' ) ;
		} ) ;
	} ) ;
} ) ;


