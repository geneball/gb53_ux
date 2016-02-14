/**
 * gb53.net ux.js test file 
 */
"use strict";
import * as Log from '../log/log';
import * as QUnit from 'qunit';
import * as Ux from '../ux/ux';

QUnit.module("gb53_ux");

QUnit.test('init and version',  function(assert) { 
	Ux.init();
//    describe("failures",  function() {    
//    	//Log.i('+verify: ENABLE');
//    	//Log.i('+extract: ENABLE');
//    	//Log.i('+qindexOf: ENABLE');
//    	//Log.i('+qsplit: ENABLE');
//		verify(" extract( ' fn( a, b, c) => 0  ', '(', ')' ) => 'a, b, c' ",extract); 
//		verify(" extract( ' fn( a, b, c) => 0  ',   0, '(' ) => 'fn' ",		extract); 
//		verify(" extract( ' fn ( a, b, c) => 0 ',   0, '(' ) => 'fn' ",		extract); 
//    	Log.i('-verify: DISABLE');
//    	Log.i('-extract: DISABLE');
//    	Log.i('-qindexOf: ENABLE');
//    	Log.i('-qsplit: ENABLE');
//	});
	assert.equal(2,3, 'Failure Works');
	assert.equal(Ux.Version(), 'gb53_ux.js DD-MMM-YY', 'Version under test' );
});

QUnit.test('class cls',  function(assert) { 

	var o1 = Ux.cls();
	verify(" o1=Ux.cls() => '[object]' ", o1 );
	verify(" o1.toString() => 'classname{ f1:undefined, f2:default, f3:undefined, f4:undefined }' ", o1.toString() );
	
	var o2 = mod.classname(1,'two');
	verify(" o2=mod.classname(1, 'two') => 'classname{ f1:1, f2:two, f3:undefined, f4:undefined }' ", o2.toString() );
	verify(" o2.method(3, 'four') => 'whatever' ", o2.method(3,'four'));
	verify(" o2.toString() => 'classname{ f1:1, f2:two, f3:3, f4:four }' "), o2.toString());
	verify(" o2.method(5) => 'whatever' ", o2.method(5));
	verify(" o2.toString() => 'classname{ f1:1, f2:two, f3:5, f4:default2 }' "), o2.toString());
});

