"use strict";
import $ from 'jquery';
import * as Ux from './ux';

Ux.msg('gb53.net module %s', Ux.Version());

describe("gb53_ux",  function() {    
	mod.init();  // writes version to Log
    describe("Version",  function() {    
    	verify(" Version( ) => 'gb53_ux.js DD-MMM-YY' ", mod.Verson );
    });
    
    describe('mod.classname', function(){
    	var o1 = mod.classname();
    	verify(" o1=mod.classname() => '[object]' ", mod.classname );
    	verify(" o1.toString() => 'classname{ f1:undefined, f2:default, f3:undefined, f4:undefined }' ", o1.toString() );
    	
    	var o2 = mod.classname(1,'two');
    	verify(" o2=mod.classname(1, 'two') => 'classname{ f1:1, f2:two, f3:undefined, f4:undefined }' ", o2.toString() );
    	verify(" o2.method(3, 'four') => 'whatever' ", o2.method(3,'four'));
    	verify(" o2.toString() => 'classname{ f1:1, f2:two, f3:3, f4:four }' "), o2.toString());
    	verify(" o2.method(5) => 'whatever' ", o2.method(5));
    	verify(" o2.toString() => 'classname{ f1:1, f2:two, f3:5, f4:default2 }' "), o2.toString());
    });
});

