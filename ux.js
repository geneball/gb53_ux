/**
 * gb53.net User Experience utilities module 
 * @module gb53_ux
 */
'use strict';
import $ from 'jquery';
import sprintf from 'sprintf';
//import Log from 'gb53_log';
	
var Version = 'gb53_ux.js 8-Feb-16';
	
/** get Version string
 * @returns {string} version as 'filename.js date'
 */
export function Version(){ 
	return Version; 
};
	
/** initialize UX
 */
export function init() {
	//Log.i(
	console.log("version: %s -- gb53.net user experience utilities", Version);
}

/** set #gb53_status with message (sprintf arguments)
 */
export function msg(){
	var s = sprintf.apply(null, arguments);
	$('#gb53_status').text(s);
}

/** generate html for user text input
 * @parm {string} string displayed before value
 * @parm {string} id for input element 
 * @parm {string} class string (_a_ for action)
 * @parm {string} default value e.g. 'green'
 * @returns {string} html
 */
export function genText(prompt, id, cls, defval){
	var html = sprintf('<label id="lab_%s">%s <input type="text" id="%s" class="%s" value="%s" size="%d"></label>', 
			id, prompt, id, cls, defval, defval.length);
	return html;
}

/** generate html for a button
 * @parm {string} string displayed in button
 * @parm {string} id for button 
 * @parm {string} class string (_a_ for action)
 * @returns {string} html
 */
export function genButton(prompt, id, cls){
	var html = sprintf('<button id="%s" class="%s">%s</button>', 
			id, cls, prompt);
	return html;
}

/** generate html for message display
 * @parm {array} array of potential choice values
 * @parm {string} filter keywords to be found in datafn(choice)
 * @parm {function} datafn(choice) returns str
 * @parm {function} valfn(choice) returns str to be displayed
 * @returns {string} comma separated items
 */
export function asValStr(choices, filter, datafn, valfn){
	filter = filter || '';
	var f = [ filter ];
	if (filter.indexOf(',')>=0)
		f = filter.split(',');
	if (typeof choices == 'string')
		choices = choices.split(',');
	var res = '';
	for (var i in choices){
		var v = datafn==undefined? choices[i].toString() : datafn(choices[i]);
		var incl = true;
		for (var j in f)
			if (v.indexOf(f[j])<0) 
				incl = false;
		if (incl)
			res += (res!=''? ',':'') + (valfn==undefined? v : valfn(choices[i]));
	}
	return res;
}


/** generate html for message display
 * @parm {string} string displayed before value
 * @parm {string} id for span 
 * @parm {string} class string (_a_ for action)
 * @parm {string} initial value 
 * @returns {string} html
 */
export function genMsg(prompt, id, cls, initval){
	var html = sprintf('<label id="lab_%s">%s <span id="%s" class="%s">%s</span></label>', 
			id, prompt, id, cls, initval);
	return html;
}


/** generate html for user choice as radio buttons
 * @parm {string} id for radio 
 * @parm {string} class string (_a_ for action)
 * @parm {string} comma sep values e.g. 'red,green,blue'
 * @parm {string} default value e.g. 'green'
 * @returns {string} html
 */
export function genRadio(label, id, cls, valstr, defval){
	var html = sprintf('<label id="lab_%s">%s ', id, label, id, cls, id);
	var vals = valstr.split(',')
	var sel = UX.radioVal(id);
	if (sel!=undefined) defval = sel;
	for (var i in vals){
		var v = vals[i].split('|');
		if (v.length==1) v.push(v[0]);
		html += sprintf('<input type="radio" name="%s" value="%s" class="%s"%s>%s &nbsp;', id, v[1],cls,v[0]==defval? ' checked':'', v[0]);
	}
	return html + '</label>';
}

/** return current value of radio button
 * @parm {string} id for radio 
 * @parm {bool} return value as float [false]
 * @returns {string|number} currently checked value
 */
export function radioVal(id, asnum){ 
    asnum = asnum || false;
	var v = $('input[name='+id+']:checked');
	v = v.val(); 
	if (asnum) v = parseFloat(v); 
	return v;
}

/** return current value of radio button
 * @parm {string} id for radio 
 * @parm {bool} return value as float [false]
 * @returns {string|number} currently checked value
 */
export function selectVal(id, asnum){ 
    asnum = asnum || false;
	var v = $('#'+id+' option');
	v = v.filter(':selected');
	v = v.val(); 
	if (asnum) v = parseFloat(v); 
	return v;
}

/** generate html for selection drop-down
 * @parm {string} string displayed before value
 * @parm {string} id for selection 
 * @parm {string} class string (_a_ for action)
 * @parm {string} comma sep values e.g. 'red,green,blue'
 * @parm {string} default value e.g. 'green'
 * @returns {string} html
 */
export function genSelect(prompt, id, cls, valstr, defval){
	var html = sprintf('<label id="lab_%s">%s <select class="%s" id="%s">', id, prompt, cls, id);
	var vals = valstr.split(',')
	var sel = UX.selectVal(id);
	if (sel!='') defval = sel;	// if regenerating html, don't change current selection
	for (var i in vals){
		var v = vals[i].split('|');
		if (v.length==1) v.push(v[0]);
		html += sprintf('<option value="%s"%s>%s</option>', v[0],v[0]==defval? ' selected':'', v[1]);
	}
	return html + '</select></label>';
}

export function setSelect(id, val){
	$('#'+id).val( val ).change();
}

/** generate html for range input
 * @parm {string} string displayed before value
 * @parm {string} id for input value 
 * @parm {string} class string (_a_ for action)
 * @parm {number} mininum allowed value
 * @parm {number} maximum allowed value
 * @parm {string} default value
 * @returns {string} html for range control
 */
export function genRange(prompt, id, cls, minv, maxv, defval ){
	return sprintf('<label id="lab_%s">%s<input type="range" id="%s" class="%s" min="%d" max="%d" value="%d"></label>', 
			id, prompt, id, cls, minv, maxv, defval );
}

