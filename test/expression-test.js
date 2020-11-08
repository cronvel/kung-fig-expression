/*
	Kung Fig Expression

	Copyright (c) 2015 - 2020 Cédric Ronvel

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



/*
const string = require( 'string-kit' ) ;
function deb( v ) {
	console.log( string.inspect( { style: 'color' , depth: 15 , funcDetails: true } , v ) ) ;
}
//*/



describe( "Expression" , () => {

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

		it( "parse/exec an expression with the explicit array operator" , () => {
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

			parsed = Expression.parse( '[ 1 , 2 + 3 , 4 * 5 ]' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 5 , 20 ] ) ;

			parsed = Expression.parse( '[ 1 , [[2 + 3]] ]' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , [ [ 5 ] ] ] ) ;
		} ) ;

		it( "parse/exec an expression with the explicit object operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'object( key: "value" )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object( key : "value" )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object( key   :    "value" )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object(key:"value")' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object( "key": "value" )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object( "key" : "value" )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( 'object( key1: "value1", key2  :2 )' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;
		} ) ;

		it( "parse/exec an expression with the object syntax" , () => {
			var parsed ;

			parsed = Expression.parse( '{}' ) ;
			expect( parsed.getFinalValue() ).to.equal( {} ) ;

			parsed = Expression.parse( '{ "key" : "value" }' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key: 'value' } ) ;

			parsed = Expression.parse( '{ "key1": "value1" , "key2": 2 }' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;

			parsed = Expression.parse( '{ key1: "value1" , key2: 2 }' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 'value1' , key2: 2 } ) ;
		} ) ;

		it( "object syntax: direct expression in property" , () => {
			var parsed ;

			parsed = Expression.parse( '{ key1: 2 + 3 }' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 5 } ) ;

			parsed = Expression.parse( '{ key1: 2 + 3 , key2: 3 / 5 }' ) ;
			expect( parsed.getFinalValue() ).to.equal( { key1: 5 , key2: 0.6 } ) ;
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

			parsed = Expression.parse( 'to-lower-case (trim $local.a)' ) ;
			expect( parsed.getFinalValue( { local: { a: "  aZErTy " } } ) ).to.be( "azerty" ) ;
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

			parsed = Expression.parse( '[ 3, 4, 5 ] has 4' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '[ 3, 4, 5 ] has 6' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '[ 3 , "str" , 5 ] has "str"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '[ 3 "str" 5 ] has "str2"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec .. (double-dot) strcat operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"one" .. "two"' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwo" ) ;

			parsed = Expression.parse( '"one" .. "two" .. "three"' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwothree" ) ;

			parsed = Expression.parse( 'false .. "one" .. 2 .. "three" true' ) ;
			expect( parsed.getFinalValue() ).to.be( "falseone2threetrue" ) ;
		} ) ;

		it( "parse/exec trim/ltrim/rtrim operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'trim " one  "' ) ;
			expect( parsed.getFinalValue() ).to.be( "one" ) ;

			parsed = Expression.parse( 'ltrim " one  "' ) ;
			expect( parsed.getFinalValue() ).to.be( "one  " ) ;

			parsed = Expression.parse( 'rtrim " one  "' ) ;
			expect( parsed.getFinalValue() ).to.be( " one" ) ;
		} ) ;

		it( "parse/exec itrim operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'itrim "  one two  three   four  "' ) ;
			expect( parsed.getFinalValue() ).to.be( "one two three four" ) ;
		} ) ;

		it( "parse/exec starts-with operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" starts-with "az"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '"azerty" starts-with "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec ends-with operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" ends-with "ty"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '"azerty" ends-with "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec pad-start/pad-end operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" pad-start 3' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-start 6' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-start 9' ) ;
			expect( parsed.getFinalValue() ).to.be( '   azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-start 9 "-+"' ) ;
			expect( parsed.getFinalValue() ).to.be( '-+-azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-end 3' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-end 6' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty' ) ;

			parsed = Expression.parse( '"azerty" pad-end 9' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty   ' ) ;

			parsed = Expression.parse( '"azerty" pad-end 9 "-+"' ) ;
			expect( parsed.getFinalValue() ).to.be( 'azerty-+-' ) ;
		} ) ;

		it( "parse/exec slice operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" slice 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 'erty' ) ;

			parsed = Expression.parse( '"azerty" slice 2 4' ) ;
			expect( parsed.getFinalValue() ).to.be( 'er' ) ;

			parsed = Expression.parse( '"azerty" slice -2' ) ;
			expect( parsed.getFinalValue() ).to.be( 'ty' ) ;
		} ) ;

		it( "parse/exec includes operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" includes "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '"azerty" includes "rez"' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;

			parsed = Expression.parse( '"azerty" includes "zer" 1' ) ;
			expect( parsed.getFinalValue() ).to.be( true ) ;

			parsed = Expression.parse( '"azerty" includes "zer" 2' ) ;
			expect( parsed.getFinalValue() ).to.be( false ) ;
		} ) ;

		it( "parse/exec index-of operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" index-of "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerty" index-of "rez"' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '"azerty" index-of "zer" 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerty" index-of "zer" 2' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '"azerzerty" index-of "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerzerty" index-of "zer" 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;
		} ) ;

		it( "parse/exec last-index-of operator" , () => {
			var parsed ;

			parsed = Expression.parse( '"azerty" last-index-of "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerty" last-index-of "rez"' ) ;
			expect( parsed.getFinalValue() ).to.be( -1 ) ;

			parsed = Expression.parse( '"azerty" last-index-of "zer" 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerty" last-index-of "zer" 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;

			parsed = Expression.parse( '"azerzerty" last-index-of "zer"' ) ;
			expect( parsed.getFinalValue() ).to.be( 4 ) ;

			parsed = Expression.parse( '"azerzerty" last-index-of "zer" 2' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;
		} ) ;

		it( "parse/exec to-lower-case operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'to-lower-case "aZerTy"' ) ;
			expect( parsed.getFinalValue() ).to.be( "azerty" ) ;
		} ) ;

		it( "parse/exec to-upper-case operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'to-upper-case "aZerTy"' ) ;
			expect( parsed.getFinalValue() ).to.be( "AZERTY" ) ;
		} ) ;

		it( "parse/exec concat operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'concat 3 4 5' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 ] ) ;

			parsed = Expression.parse( 'concat [ 3 , 4 ] [ 5 , 6 ]' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 , 6 ] ) ;

			parsed = Expression.parse( 'concat( [ 3 , 4 ] , [ 5 , 6 ] , [ 7 , 8 ] )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 3 , 4 , 5 , 6 , 7 , 8 ] ) ;
		} ) ;

		it( "parse/exec join operator" , () => {
			var parsed ;

			parsed = Expression.parse( 'join ( "one" )' ) ;
			expect( parsed.getFinalValue() ).to.be( "one" ) ;

			parsed = Expression.parse( 'join "one"' ) ;
			expect( parsed.getFinalValue() ).to.be( "one" ) ;

			parsed = Expression.parse( 'join [ "one" , "two" , "three" ]' ) ;
			expect( parsed.getFinalValue() ).to.be( "onetwothree" ) ;

			parsed = Expression.parse( 'join [ "one" , "two" , "three" ] ", "' ) ;
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

			// With the spread operator
			parsed = Expression.parse( 'avg ( ... $array )' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 4 ) ;
		} ) ;

		it( "parse/exec lerp" , () => {
			var parsed ;

			parsed = Expression.parse( 'lerp 10 110 0' ) ;
			expect( parsed.getFinalValue() ).to.be( 10 ) ;

			parsed = Expression.parse( 'lerp 10 110 0.5' ) ;
			expect( parsed.getFinalValue() ).to.be( 60 ) ;

			parsed = Expression.parse( 'lerp 10 110 1' ) ;
			expect( parsed.getFinalValue() ).to.be( 110 ) ;

			parsed = Expression.parse( 'lerp 10 110 0.2' ) ;
			expect( parsed.getFinalValue() ).to.be( 30 ) ;

			parsed = Expression.parse( 'lerp 10 110 0.95' ) ;
			expect( parsed.getFinalValue() ).to.be( 105 ) ;
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

		it( "parse/exec null coalescing" , () => {
			var parsed ;

			parsed = Expression.parse( '$a.b.c ?? "default"' ) ;
			expect( parsed.getFinalValue( {} ) ).to.be( 'default' ) ;
			expect( parsed.getFinalValue( { a: {} } ) ).to.be( 'default' ) ;
			expect( parsed.getFinalValue( { a: { b: {} } } ) ).to.be( 'default' ) ;
			expect( parsed.getFinalValue( { a: { b: { c: 'value' } } } ) ).to.be( 'value' ) ;
			expect( parsed.getFinalValue( { a: { b: { c: 0 } } } ) ).to.be( 0 ) ;
			expect( parsed.getFinalValue( { a: { b: { c: false } } } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { a: { b: { c: '' } } } ) ).to.be( '' ) ;
			expect( parsed.getFinalValue( { a: { b: { c: [] } } } ) ).to.equal( [] ) ;
			expect( parsed.getFinalValue( { a: { b: { c: null } } } ) ).to.be( 'default' ) ;
			expect( parsed.getFinalValue( { a: { b: { c: undefined } } } ) ).to.be( 'default' ) ;
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

		it( "parse/exec string (cast) operator" , () => {
			var parsed = Expression.parse( 'string $a' ) ;

			expect( parsed.getFinalValue( { a: 3.2 } ) ).to.be( "3.2" ) ;
			expect( parsed.getFinalValue( { a: "3.2" } ) ).to.be( "3.2" ) ;
			expect( parsed.getFinalValue( { a: "aaa" } ) ).to.be( "aaa" ) ;
			expect( parsed.getFinalValue( { a: Infinity } ) ).to.be( "Infinity" ) ;
			expect( parsed.getFinalValue( { a: NaN } ) ).to.be( "NaN" ) ;
		} ) ;

		it( "parse/exec int (cast) operator" , () => {
			var parsed = Expression.parse( 'int $a' ) ;

			expect( parsed.getFinalValue( { a: 3.2 } ) ).to.be( 3 ) ;
			expect( parsed.getFinalValue( { a: "3.2" } ) ).to.be( 3 ) ;
			expect( parsed.getFinalValue( { a: "3.2e2" } ) ).to.be( 320 ) ;
			expect( parsed.getFinalValue( { a: "aaa" } ) ).to.be( NaN ) ;
			expect( parsed.getFinalValue( { a: 3.7 } ) ).to.be( 4 ) ;
			expect( parsed.getFinalValue( { a: Infinity } ) ).to.be( NaN ) ;
			expect( parsed.getFinalValue( { a: NaN } ) ).to.be( NaN ) ;
		} ) ;

		it( "parse/exec float (cast) operator" , () => {
			var parsed = Expression.parse( 'float $a' ) ;

			expect( parsed.getFinalValue( { a: 3.2 } ) ).to.be( 3.2 ) ;
			expect( parsed.getFinalValue( { a: "3.2" } ) ).to.be( 3.2 ) ;
			expect( parsed.getFinalValue( { a: "3.2e2" } ) ).to.be( 320 ) ;
			expect( parsed.getFinalValue( { a: "aaa" } ) ).to.be( NaN ) ;
			expect( parsed.getFinalValue( { a: 3.7 } ) ).to.be( 3.7 ) ;
			expect( parsed.getFinalValue( { a: Infinity } ) ).to.be( Infinity ) ;
			expect( parsed.getFinalValue( { a: NaN } ) ).to.be( NaN ) ;
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

			parsed = Expression.parse( '$v is-empty?' ) ;
			expect( parsed.getFinalValue( { v: undefined } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: null } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: false } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: true } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: 0 } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: 1 } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: '' } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: 'bob' } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: [] } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: [1,2,3] } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: {} } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: {a:1,b:2} } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: new Set() } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: new Set([1,2,3]) } ) ).to.be( false ) ;
			expect( parsed.getFinalValue( { v: new Map() } ) ).to.be( true ) ;
			expect( parsed.getFinalValue( { v: new Map([['a',1],['b',2]]) } ) ).to.be( false ) ;

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

		it( "parse/exec . (dot) navigation operator" , () => {
			var parsed ;

			var ctx = {
				object: {
					path: { to: { nested: { property: "value" } } }
				} ,
				array: [ 0 , [ [ 1 , [ [ 2 ] ] ] ] ]
			} ;

			parsed = Expression.parse( '$object . "path"' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.object.path ) ;

			parsed = Expression.parse( '$object . "path" . "to"' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.object.path.to ) ;

			parsed = Expression.parse( '$object . "path" . "to" . "nested"' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.object.path.to.nested ) ;

			parsed = Expression.parse( '$object . "path" . "to" . "nested" . "property"' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( "value" ) ;

			parsed = Expression.parse( '$object . "path" . "to" . ( "nest" .. "ed" ) . "property"' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( "value" ) ;

			parsed = Expression.parse( '$array . 0' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 0 ) ;

			parsed = Expression.parse( '$array . 1' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.array[ 1 ] ) ;

			parsed = Expression.parse( '$array . 1 . 0 . 0' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 1 ) ;

			parsed = Expression.parse( '$array . 1 . 0 . 1 . 0' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.array[ 1 ][ 0 ][ 1 ][ 0 ] ) ;

			parsed = Expression.parse( '$array . 1 . 0 . 1 . 0 . 0' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 2 ) ;

			parsed = Expression.parse( '$array . ( 3 - 2 )' ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( ctx.array[ 1 ] ) ;
		} ) ;

		it( "parse/exec the spread operator" , () => {
			var parsed , r ;

			parsed = Expression.parse( '... [1,2,3]' ) ;
			expect( parsed.getFinalValue() ).to.be.an( Expression.Stack ) ;
			expect( parsed.getFinalValue() ).to.be.like( [ 1 , 2 , 3 ] ) ;

			parsed = Expression.parse( '... {a:1,b:2,c:3}' ) ;
			r = parsed.getFinalValue() ;
			expect( r ).to.be.an( Expression.Stack ) ;
			expect( r ).to.be.like( [ [ 'a' , 1 ] , [ 'b' , 2 ] , [ 'c' , 3 ] ] ) ;
			expect( r[ 0 ] ).to.be.an( Expression.ObjectEntry ) ;
			expect( r[ 1 ] ).to.be.an( Expression.ObjectEntry ) ;
			expect( r[ 2 ] ).to.be.an( Expression.ObjectEntry ) ;

			parsed = Expression.parse( 'max( [1,2,3] )' ) ;
			expect( parsed.getFinalValue() ).to.be( NaN ) ;

			parsed = Expression.parse( 'max( ... [1,2,3] )' ) ;
			expect( parsed.getFinalValue() ).to.be( 3 ) ;

			parsed = Expression.parse( 'min( ... [1,2,3] )' ) ;
			expect( parsed.getFinalValue() ).to.be( 1 ) ;
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
			var parsed , operators , v ;

			operators = {
				D: ( dices , faces ) => {
					var sum = 0 ;
					for ( ; dices > 0 ; dices -- ) { sum += 1 + Math.floor( Math.random() * faces ) ; }
					return sum ;
				}
			} ;

			parsed = Expression.parse( '3 D 6' , operators ) ;
			//deb( parsed ) ;
			v = parsed.getFinalValue() ;
			//deb( v ) ;
			expect( v ).to.be.within( 1 , 18 ) ;
		} ) ;

		it( "parse/exec custom operator with named parameters" , () => {
			var parsed , operators ;

			operators = {
				avgD: ( ... args ) => {
					var {
						base , dices , faces
					} = Expression.getNamedParameters( args , [ 'base' , 'dices' , 'faces' ] , {
						base: 0 , dices: 1 , faces: 4
					} ) ;
					//console.log( base , dices , faces ) ;
					return base + ( dices + dices * faces ) / 2 ;
				}
			} ;

			parsed = Expression.parse( 'avgD()' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 2.5 ) ;

			parsed = Expression.parse( 'avgD( 3 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 5.5 ) ;

			parsed = Expression.parse( 'avgD( 3 , 2 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 8 ) ;

			parsed = Expression.parse( 'avgD( 3 , 2 , 6 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 10 ) ;

			parsed = Expression.parse( 'avgD( 3 , 2 , faces: 6 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 10 ) ;

			parsed = Expression.parse( 'avgD( dices: 2 , faces: 6 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 7 ) ;

			parsed = Expression.parse( 'avgD( faces: 6 , dices: 2 , base: 3 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 10 ) ;

			parsed = Expression.parse( 'avgD( 3 , dices: 2 , faces: 6 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 10 ) ;

			// 3 is ignored here
			parsed = Expression.parse( 'avgD( dices: 2 , 3 , faces: 6 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 7 ) ;

			// 3 is ignored here
			parsed = Expression.parse( 'avgD( dices: 2 , faces: 6 , 3 )' , operators ) ;
			expect( parsed.getFinalValue() ).to.be( 7 ) ;

			// Using the spread operator
			var ctx = {
				object: {
					base: 5 , dices: 2 , faces: 8
				}
			} ;
			parsed = Expression.parse( 'avgD( ... $object )' , operators ) ;
			expect( parsed.getFinalValue( ctx ) ).to.be( 14 ) ;

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
			expect( Expression.parse( 'max 1 2 3' ).stringify() ).to.be( 'max( 1 , 2 , 3 )' ) ;
			expect( Expression.parse( '- 1' ).stringify() ).to.be( '- 1' ) ;
			expect( Expression.parse( '$my.var - 1' ).stringify() ).to.be( '$my.var - 1' ) ;
			expect( Expression.parse( '! $my.var' ).stringify() ).to.be( '! $my.var' ) ;
			expect( Expression.parse( '$my.var is-real?' ).stringify() ).to.be( '$my.var is-real?' ) ;
			expect( Expression.parse( '"some" .. "concat" .. "string"' ).stringify() ).to.be( '"some" .. "concat" .. "string"' ) ;
			expect( Expression.parse( '[]' ).stringify() ).to.be( '[]' ) ;
			expect( Expression.parse( '[ "value1" ]' ).stringify() ).to.be( '[ "value1" ]' ) ;
			expect( Expression.parse( '[ "value1" , "value2" ]' ).stringify() ).to.be( '[ "value1" , "value2" ]' ) ;
			expect( Expression.parse( '{}' ).stringify() ).to.be( '{}' ) ;
			expect( Expression.parse( '{ "key1": "value1" }' ).stringify() ).to.be( '{ "key1": "value1" }' ) ;
			expect( Expression.parse( '{ "key1": "value1" , "key2": "value2" }' ).stringify() ).to.be( '{ "key1": "value1" , "key2": "value2" }' ) ;
		} ) ;

		it( "stringify an expression with sub-expression" , () => {
			expect( Expression.parse( '1 + ( 2 * 3 )' ).stringify() ).to.be( '1 + ( 2 * 3 )' ) ;
			expect( Expression.parse( '1 + ( 2 * ( exp 3 ) )' ).stringify() ).to.be( '1 + ( 2 * ( exp( 3 ) ) )' ) ;
		} ) ;
	} ) ;



	describe( ".toJs()" , () => {

		it( "transform to JS a simple expression" , () => {
			expect( Expression.parse( 'true && true' ).toJs() ).to.be( 'true && true' ) ;
			expect( Expression.parse( 'true || false' ).toJs() ).to.be( 'true || false' ) ;
			expect( Expression.parse( 'null and false' ).toJs() ).to.be( 'op.and( null , false )' ) ;
			expect( Expression.parse( 'NaN or Infinity' ).toJs() ).to.be( 'op.or( NaN , Infinity )' ) ;
			expect( Expression.parse( 'Infinity or -Infinity' ).toJs() ).to.be( 'op.or( Infinity , -Infinity )' ) ;
			expect( Expression.parse( '( e * pi ) + phi' ).toJs() ).to.be( '( 2.718281828459045 * 3.141592653589793 ) + 1.618033988749895' ) ;
			expect( Expression.parse( '1 + 2' ).toJs() ).to.be( '1 + 2' ) ;
			expect( Expression.parse( 'add 1 2' ).toJs() ).to.be( '1 + 2' ) ;
			expect( Expression.parse( 'add 1 2 3' ).toJs() ).to.be( '1 + 2 + 3' ) ;
			expect( Expression.parse( 'max 1 2 3' ).toJs() ).to.be( 'Math.max( 1 , 2 , 3 )' ) ;
			expect( Expression.parse( '$my.var - 1' ).toJs() ).to.be( 'ctx.my.var - 1' ) ;
			expect( Expression.parse( '! $my.var' ).toJs() ).to.be( '! ctx.my.var' ) ;
			expect( Expression.parse( '"some" .. "concat" .. "string"' ).toJs() ).to.be( '"some" + "concat" + "string"' ) ;
			expect( Expression.parse( '[]' ).toJs() ).to.be( '[]' ) ;
			expect( Expression.parse( '[ "value1" ]' ).toJs() ).to.be( '[ "value1" ]' ) ;
			expect( Expression.parse( '[ "value1" , "value2" ]' ).toJs() ).to.be( '[ "value1" , "value2" ]' ) ;
			expect( Expression.parse( '{}' ).toJs() ).to.be( '{}' ) ;
			expect( Expression.parse( '{ "key1": "value1" }' ).toJs() ).to.be( '{ "key1": "value1" }' ) ;
			expect( Expression.parse( '{ "key1": "value1" , "key2": "value2" }' ).toJs() ).to.be( '{ "key1": "value1" , "key2": "value2" }' ) ;
			expect( Expression.parse( 'min( 1 , 2 , 3 )' ).toJs() ).to.be( 'Math.min( 1 , 2 , 3 )' ) ;
			expect( Expression.parse( 'min( 1 , 2 , 0 )' ).toJs() ).to.be( 'Math.min( 1 , 2 , 0 )' ) ;
			
			// Operators with a fancy funciton name
			expect( Expression.parse( '$my.var is-real?' ).toJs() ).to.be( 'op["is-real?"]( ctx.my.var )' ) ;
			expect( Expression.parse( '$a.b.c ?? "default"' ).toJs() ).to.be( 'op["??"]( ctx.a.b.c , "default" )' ) ;
		} ) ;

		it( "transform to JS using native JS function" , () => {
			expect( Expression.parse( 'sin $my.var' ).toJs() ).to.be( 'Math.sin( ctx.my.var )' ) ;
		} ) ;
		
		it( "transform to JS using native JS method" , () => {
			expect( Expression.parse( 'starts-with $my.str $my.var' ).toJs() ).to.be( "( '' + ctx.my.str ).startsWith( ctx.my.var )" ) ;
			expect( Expression.parse( 'starts-with $my.str "start"' ).toJs() ).to.be( "( '' + ctx.my.str ).startsWith( \"start\" )" ) ;
			expect( Expression.parse( 'starts-with "string" $my.str' ).toJs() ).to.be( '"string".startsWith( ctx.my.str )' ) ;
			expect( Expression.parse( 'starts-with 12.34 "start"' ).toJs() ).to.be( "( '' + 12.34 ).startsWith( \"start\" )" ) ;

			expect( Expression.parse( 'includes $my.str $my.var 12' ).toJs() ).to.be( "( '' + ctx.my.str ).includes( ctx.my.var , 12 )" ) ;

			expect( Expression.parse( 'slice $my.str 2 4' ).toJs() ).to.be( "( '' + ctx.my.str ).slice( 2 , 4 )" ) ;
			expect( Expression.parse( 'slice "some string" 2 4' ).toJs() ).to.be( '"some string".slice( 2 , 4 )' ) ;

			expect( Expression.parse( 'to-upper-case $my.str' ).toJs() ).to.be( "( '' + ctx.my.str ).toUpperCase()" ) ;
			expect( Expression.parse( 'to-upper-case "bob"' ).toJs() ).to.be( '"bob".toUpperCase()' ) ;
		} ) ;
		
		it( "transform to JS custom operators using native JS function" , () => {
			var operators = { inv: x => 1 / x } ;
			operators.inv.id = 'inv' ;
			expect( Expression.parse( 'inv 2' , operators ).toJs() ).to.be( 'op.inv( 2 )' ) ;
		} ) ;

		it( "transform to JS an expression with object navigation" , () => {
			expect( Expression.parse( '$var . ( "one" .. "two" ) . "three"' ).toJs() ).to.be( 'ctx.var["one" + "two"]["three"]' ) ;
		} ) ;

		it( "transform to JS an expression with a ternary operator" , () => {
			expect( Expression.parse( '$var ? "one" "two"' ).toJs() ).to.be( 'ctx.var ? "one" : "two"' ) ;
		} ) ;

		it( "transform to JS an expression with a call operator" , () => {
			expect( Expression.parse( '$var ->' ).toJs() ).to.be( 'ctx.var()' ) ;
			expect( Expression.parse( '$var -> "one"' ).toJs() ).to.be( 'ctx.var( "one" )' ) ;
			expect( Expression.parse( '$var -> "one" "two"' ).toJs() ).to.be( 'ctx.var( "one" , "two" )' ) ;
			expect( Expression.parse( '$var -> "one" "two" 3' ).toJs() ).to.be( 'ctx.var( "one" , "two" , 3 )' ) ;
		} ) ;

		it( "transform to JS an expression with a spread operator" , () => {
			expect( Expression.parse( 'max( ... $array )' ).toJs() ).to.be( 'Math.max( ... ctx.array )' ) ;
		} ) ;

		it( "transform to JS an expression with sub-expression" , () => {
			expect( Expression.parse( '1 + ( 2 * 3 )' ).toJs() ).to.be( '1 + ( 2 * 3 )' ) ;
			expect( Expression.parse( '1 + ( 2 * ( exp 3 ) )' ).toJs() ).to.be( '1 + ( 2 * ( Math.exp( 3 ) ) )' ) ;
		} ) ;
	} ) ;



	describe( ".compile()" , () => {

		it( "compile a simple expression" , () => {
			var context = {
				my: { 'var': 7 }
			} ;

			expect( Expression.parse( 'true && true' ).compile()( context ) ).to.be( true ) ;
			expect( Expression.parse( 'true || false' ).compile()( context ) ).to.be( true ) ;
			expect( Expression.parse( 'null and false' ).compile()( context ) ).to.be( false ) ;
			expect( Expression.parse( 'NaN or Infinity' ).compile()( context ) ).to.be( true ) ;
			expect( Expression.parse( 'Infinity or -Infinity' ).compile()( context ) ).to.be( true ) ;
			expect( Expression.parse( '( e * pi ) + phi' ).compile()( context ) ).to.be( 10.15776821142346 ) ;
			expect( Expression.parse( '1 + 2' ).compile()( context ) ).to.be( 3 ) ;
			expect( Expression.parse( 'add 1 2' ).compile()( context ) ).to.be( 3 ) ;
			expect( Expression.parse( 'add 1 2 3' ).compile()( context ) ).to.be( 6 ) ;
			expect( Expression.parse( 'max 1 2 3' ).compile()( context ) ).to.be( 3 ) ;
			expect( Expression.parse( '$my.var - 1' ).compile()( context ) ).to.be( 6 ) ;
			expect( Expression.parse( '! $my.var' ).compile()( context ) ).to.be( false ) ;
			expect( Expression.parse( '$my.var is-real?' ).compile()( context ) ).to.be( true ) ;
			expect( Expression.parse( '"some" .. "concat" .. "string"' ).compile()( context ) ).to.be( "someconcatstring" ) ;
			expect( Expression.parse( '[]' ).compile()( context ) ).to.equal( [] ) ;
			expect( Expression.parse( '[ "value1" ]' ).compile()( context ) ).to.equal( [ "value1" ] ) ;
			expect( Expression.parse( '[ "value1" , "value2" ]' ).compile()( context ) ).to.equal( [ "value1" , "value2" ] ) ;
			expect( Expression.parse( '{}' ).compile()( context ) ).to.equal( {} ) ;
			expect( Expression.parse( '{ "key1": "value1" }' ).compile()( context ) ).to.equal( { "key1": "value1" } ) ;
			expect( Expression.parse( '{ "key1": "value1" , "key2": "value2" }' ).compile()( context ) ).to.equal( { "key1": "value1" , "key2": "value2" } ) ;
		} ) ;

		it( "compile an expression with object navigation" , () => {
			var context = {
				'var': { 'onetwo': { three: 4 } }
			} ;

			expect( Expression.parse( '$var . ( "one" .. "two" ) . "three"' ).compile()( context ) ).to.be( 4 ) ;
		} ) ;

		it( "compile an expression with a ternary operator" , () => {
			var context = {
				'var': true
			} ;

			expect( Expression.parse( '$var ? "one" "two"' ).compile()( context ) ).to.be( "one" ) ;
		} ) ;

		it( "compile an expression with a call operator" , () => {
			var context = {
				'var': ( ... args ) => args.join( '-' )
			} ;

			expect( Expression.parse( '$var ->' ).compile()( context ) ).to.be( '' ) ;
			expect( Expression.parse( '$var -> "one"' ).compile()( context ) ).to.be( "one" ) ;
			expect( Expression.parse( '$var -> "one" "two"' ).compile()( context ) ).to.be( "one-two" ) ;
			expect( Expression.parse( '$var -> "one" "two" 3' ).compile()( context ) ).to.be( "one-two-3" ) ;
		} ) ;

		it( "compile an expression with a spread operator" , () => {
			var context = {
				array: [ 1 , 2 , 5 , 3 ]
			} ;

			expect( Expression.parse( 'max( ... $array )' ).compile()( context ) ).to.be( 5 ) ;
		} ) ;

		it( "compile an expression with sub-expression" , () => {
			var context = {
				array: [ 1 , 2 , 5 , 3 ]
			} ;

			expect( Expression.parse( '1 + ( 2 * 3 )' ).compile()( context ) ).to.be( 7 ) ;
			expect( Expression.parse( '1 + ( 2 * ( exp 3 ) )' ).compile()( context ) ).to.be( 41.171073846375336 ) ;
		} ) ;
	} ) ;



	describe( "Historical bugs" , () => {

		// may check object multi-reference too
		it( "array multi-reference to the same array" , () => {
			var parsed ;

			parsed = Expression.parse( '[ 1, 2 , [ 3, 4 ] ]' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , [ 3 , 4 ] ] ) ;
			expect( parsed.getFinalValue() === parsed.getFinalValue() ).to.be( false ) ;
			expect( parsed.getFinalValue()[ 2 ] === parsed.getFinalValue()[ 2 ] , false ) ;

			parsed = Expression.parse( 'array( 1 , 2 , array( 3 , 4 ) )' ) ;
			expect( parsed.getFinalValue() ).to.equal( [ 1 , 2 , [ 3 , 4 ] ] ) ;
			expect( parsed.getFinalValue() === parsed.getFinalValue() ).to.be( false ) ;
			expect( parsed.getFinalValue()[ 2 ] === parsed.getFinalValue()[ 2 ] , false ) ;
		} ) ;

		it( "extra spaces parse bug" , () => {
			var parsed = Expression.parse( '0 ? ' ) ;
			expect( parsed.args ).to.equal( [ 0 ] ) ;
		} ) ;

		it( "new syntax as of Kung-Fig v0.47" , () => {
			var parsed ;

			parsed = Expression.parse( '1 + 2' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 3 ) ;

			parsed = Expression.parse( '1' ) ;
			//deb( parsed ) ;
			expect( parsed ).to.be( 1 ) ;

			parsed = Expression.parse( '1 , 2 , 3' ) ;
			//deb( parsed ) ;
			expect( parsed ).to.be( 1 ) ;

			parsed = Expression.parse( '( 1 , 2 , 3 )' ) ;
			//deb( parsed ) ;
			expect( parsed ).to.equal( 1 ) ;

			parsed = Expression.parse( '1 + ( 2 * 3 )' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 7 ) ;

			parsed = Expression.parse( '1 + 2 , 3 , 4' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 3 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 , 3 , 4 )' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 10 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 * 3 , 4 )' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 11 ) ;

			parsed = Expression.parse( 'add ( 1 , 2 * 3 , 4 / 2 )' ) ;
			//deb( parsed ) ;
			expect( parsed.getFinalValue() ).to.equal( 9 ) ;
		} ) ;
		
		it( "parser and falsy values filtered out" , () => {
			expect( Expression.parse( 'min( 1 , 0 , 2 )' ).args ).to.equal( [ 1 , 0 , 2 ] ) ;
			expect( Expression.parse( 'min( 1 , 2 , 0 )' ).args ).to.equal( [ 1 , 2 , 0 ] ) ;
		} ) ;

		it( "Stack constructor with only one argument bug" , () => {
			expect( new Expression.Stack() ).to.be.like( [] ) ;
			expect( new Expression.Stack( 1 ) ).to.be.like( [ 1 ] ) ;
			expect( new Expression.Stack( 1.2 ) ).to.be.like( [ 1.2 ] ) ;
			expect( new Expression.Stack( 1 , 2 , 3 ) ).to.be.like( [ 1 , 2 , 3 ] ) ;

			expect( new Expression.Stack( 1 ) ).to.be.an( Array ) ;
			expect( new Expression.Stack( 1.2 ) ).to.be.an( Array ) ;
			expect( new Expression.Stack( 1 ) ).to.be.a( Expression.Stack ) ;
			expect( new Expression.Stack( 1.2 ) ).to.be.a( Expression.Stack ) ;
			expect( new Expression.Stack( 1 ) ).to.have.a.length.of( 1 ) ;
			expect( new Expression.Stack( 1.2 ) ).to.have.a.length.of( 1 ) ;
		} ) ;
	} ) ;
} ) ;

