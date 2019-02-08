"use strict" ;

// Borrowed from Feross: https://github.com/feross/fromentries
// Object.fromEntries() is a new ES2019 feature, not supported by Node v10

if ( ! Object.fromEntries ) {
	Object.fromEntries = iterable =>
		[ ... iterable ].reduce(
			( object , { 0: key, 1: value } ) => Object.assign( object , { [ key ]: value } ) ,
			{}
		) ;
}
