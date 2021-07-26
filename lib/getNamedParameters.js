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



const ObjectEntry = require( './ObjectEntry.js' ) ;



// .getNamedParameters( parameters, paramToNamedMapping , defaultNamedParameters )
module.exports = ( params , mapping , named = {} ) => {
	var firstNamed = null ;

	params.forEach( ( element , index ) => {
		if ( element instanceof ObjectEntry ) {
			if ( firstNamed === null ) { firstNamed = index ; }
			named[ element[ 0 ] ] = element[ 1 ] ;
		}
	} ) ;

	// Regular parameter MUST comes before the first named
	if ( firstNamed !== null ) { params.length = firstNamed ; }

	if ( mapping ) {
		for ( let i = 0 , iMax = Math.min( params.length , mapping.length ) ; i < iMax ; i ++ ) {
			named[ mapping[ i ] ] = params[ i ] ;
		}

		params.length = 0 ;
	}

	return named ;
} ;

