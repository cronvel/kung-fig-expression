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



class ObjectEntry extends Array {
	constructor( ... args ) {
		super( ... args ) ;
	}

	getFinalValue( ctx ) {
		return this.map( e => e && typeof e === 'object' && e.__isDynamic__ ? e.getFinalValue( ctx ) : e ) ;
	}

	// Commented out because we DO WANT that .map() from .getFinalValue() DO return an ObjectEntry
	// This allow stack.map()/.slice()/etc to return an Array, not a Stack
	//static get [Symbol.species]() { return Array ; }
}

module.exports = ObjectEntry ;

ObjectEntry.prototype.__isDynamic__ = true ;
ObjectEntry.serializerFnId = 'Expression.ObjectEntry' ;

ObjectEntry.serializer = function( object ) {
	return {
		args: object.args ,
		overideKeys: [ '__isDynamic__' , '__isApplicable__' ]
	} ;
} ;

ObjectEntry.unserializer = function( ... args ) {
	return new ObjectEntry( ... args ) ;
} ;

