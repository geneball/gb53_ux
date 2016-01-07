/**
 * gb53.net User Experience module 
 * @module gb53_ux
 */
'use strict';

(function gb53_UX(){
	gbDefine('gb53_ux', function setVar(nm, val){ 
		  switch (nm){ case '$': $ = val; break;	case 'sprintf': sprintf = val; break;
		  case 'Log': Log = val; break;	  default: console.log('gb53UX setVar: unrecognized '+nm); return null; } } );
	var $ 		= gbImport( { as: '$', from: 'jquery' } ); // import * as $ from 'jquery'
	var sprintf = gbImport( { as: 'sprintf', from: 'sprintf' } );
	
	var Log 	= gbImport( { as: 'Log', from: 'gb53_log' } );
//	var UX 		= gbImport( { as: 'UX', from: 'gb53_ux' } );
	var UX		= exports;
	gbEndImports();
	
	var Version = 'gb53_ux.js 24-Dec-15';
	
	/** get Version string
	 * @returns {string} version as 'filename.js date'
	 */
	exports.Version = 
		function Version(){ 
			return Version; 
		};
		
	/** initialize MODULE
	 */
	exports.init = 
		function init() {
			Log.i("version: %s -- gb53.net user experience utilities", Version);
		}
	
	/** generate html for user text input
	 * @parm {string} string displayed before value
	 * @parm {string} id for input element 
	 * @parm {string} class string (_a_ for action)
	 * @parm {string} default value e.g. 'green'
	 * @returns {string} html
	 */
	exports.genText =	
		function genText(prompt, id, cls, defval){
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
	exports.genButton =	
		function genButton(prompt, id, cls){
			var html = sprintf('<button id="%s" class="%s">%s</label>', 
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
	exports.asValStr =	
		function asValStr(choices, filter, datafn, valfn){
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
exports.genMsg =	
	function genMsg(prompt, id, cls, initval){
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
exports.genRadio =	
	function genRadio(label, id, cls, valstr, defval){
		var html = sprintf('<label id="lab_%s">%s ', id, label, id, cls, id);
		var vals = valstr.split(',')
		var sel = radioVal(id);
		if (sel!=undefined) defval = sel;
		for (var i in vals){
			html += sprintf('<input type="radio" name="%s" value="%s" class="%s"%s>%s &nbsp;', id, vals[i],cls,vals[i]==defval? ' checked':'', vals[i]);
		}
		return html + '</label>';
	}

/** return current value of radio button
 * @parm {string} id for radio 
 * @parm {bool} return value as float [false]
 * @returns {string|number} currently checked value
 */
exports.radioVal =	
	function radioVal(id, asnum){ 
	    asnum = asnum || false;
		var v = $('input[name='+id+']:checked').val(); 
		if (asnum) v = parseFloat(v); 
		return v;
	}

/** return current value of radio button
 * @parm {string} id for radio 
 * @parm {bool} return value as float [false]
 * @returns {string|number} currently checked value
 */
exports.selectVal =	
	function selectVal(id, asnum){ 
	    asnum = asnum || false;
		var v = $('#'+id+' option:selected').text(); 
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
exports.genSelect =	
	function genSelect(prompt, id, cls, valstr, defval){
		var html = sprintf('<label id="lab_%s">%s <select class="%s" id="%s">', id, prompt, cls, id);
		var vals = valstr.split(',')
		var sel = UX.selectVal(id);
		if (sel!=undefined) defval = sel;
		for (var i in vals){
			var v = vals[i].split('|');
			if (v.length==1) v.push(v[0]);
			html += sprintf('<option value="%s"%s>%s</option>', v[0],v[0]==defval? ' selected':'', v[1]);
		}
		return html + '</select></label>';
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
	exports.genRange =	
		function genRange(prompt, id, cls, minv, maxv, defval ){
		return sprintf('<label id="lab_%s">%s<input type="range" id="%s" class="%s" min="%d" max="%d" value="%d"></label>', 
				id, prompt, id, cls, minv, maxv, defval );
	}
})();
