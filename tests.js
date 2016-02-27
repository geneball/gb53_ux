/**
 * gb53.net ux.js test file 
 */
"use strict";
import * as QUnit from 'qunit';
import * as Log from '../log/gb53_log';
import * as Ux from '../ux/gb53_ux';

QUnit.module("gb53_ux");

QUnit.test('init and version',  function(assert) { 
	Ux.init();
	assert.ok(Ux.Version().startsWith('gb53_ux.js'), 'Version under test' );
});
QUnit.start();


