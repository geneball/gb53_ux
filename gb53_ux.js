/**
 * gb53.net User Experience utilities module 
 * @module gb53_ux
 */

// for use with jspm & nwjs

'use strict';
import $ from 'jquery';
import sprintf from 'sprintf';
import * as Log from 'gb53_log';
import * as Ux from 'gb53_ux';
	
var sVersion = 'gb53_ux.js 17-Apr-16';
console.log('[ %s ...', sVersion);
	
/** get Version string
 * @returns {string} version as 'filename.js date'
 */
export function Version(){ 
	return sVersion; 
};
	
/** initialize UX
 */
export function init() {
	Log.i("version: %s", sVersion);
}

/** set #gb53_status with message (sprintf arguments)
 */
export function msg(){
	var s = sprintf.apply(null, arguments);
	$('#gb53_status').text(s);
}

/* Usage: fmt string markers: [txt:name=defval] [btn:label] [sel] [rad] [msg] [rng]
	Ux.newForm('Compositor', [   // ordered list of command definitions
		{ cmdNm: newSprites, 
			cmdFmt: 'name: [txt:name=test] [btn]<br>', 
			cmdFn: onNewSprites },
		'name: [txt:name=test] [btn:newSprites]<br>', onNewSprites,		// equivalent to previous
		{ cmdNm: addSprites, 
			cmdFmt: 'file pattern: [txt:filepatt] name pattern: [txt:namepatt] xMax: [txt:xMax=3] yMax: [txt:yMax=3] [btn] <br>',
			filepatt: { defval: 'compositor/pixel_flow/pixel_flow_gray108_X%dY%d.png' },
			namepatt: { defval: 'X%dY%d' },
			cmdFn: onAddSprites
		},
		{ cmdNm: saveSprites,
			cmdFmt: 'filePath: [txt:path]<br>', 
			cmdFn: onSaveSprites }
	]);
 */

/**
 * Create a uxForm (creates object, no 'new' required)
 * @name newForm
 * @parm {string} name of uxForm
 * @parm {Array} command descriptor array
 * @returns {uxForm} interface form object
 */
export function newForm( formName, commands, options ){	
	var obj = new uxForm();  // allocate object
	obj.nm = formName; 
	obj.cmdCls = 'a_'+formName;
	var opts = options || { };
	obj.cmdPrefix = opts.cmdPrefix || '<div class="uxCmd">';
	obj.cmdSuffix = opts.cmdSuffix || '</div>';
	obj.formPrefix = opts.formPrefix || '';
	obj.formSuffix = opts.formSuffix || '';
	obj.cmds = [];
	for (var i=0; i<commands.length; i++)
		if ( typeof commands[i]==='object')
			obj.addCmd( commands[i] );
		else if (typeof commands[i]==='string'){
			var cmd = { cmdFmt: commands[i] };
			if (typeof commands[i+1]==='function'){
				cmd.cmdFn = commands[i+1];
				i++;
			}
			obj.addCmd( cmd );
		}
	uxForms[formName] = obj;
	return obj;
}
function uxForm(){ } 

uxForm.prototype.deactivate = function deactivate(){ this.activate(true); }

uxForm.prototype.activate = function activate( deact ){
	if (deact)
		$('.'+this.cmdCls).off('click', '', onCmdClick);
	else
		$('.'+this.cmdCls).on('click', '', onCmdClick);
}
var uxForms = {};	// gets a field for each Form name
var uxFormBtns = {};	// gets a field for each btn id
function onCmdClick(ev){
	var id = $(ev.target).attr('id');
	var cmd = uxFormBtns[id], args = {};
	for (var i in cmd.flds){
		var fld = cmd.flds[i];
		args[fld.nm] = getFieldValue(fld);
	}
	if (cmd.cmdFn!==undefined)
		cmd.cmdFn(args);
	else
		Ux.msg('No function for cmd %s', cmd.cmdNm);
}

/**
 * define a new form command-- button plus parameters
 * @memberof gb53_ux.uxForm
 * @parm {string|object} prototype string for command, e.g. 'name: [text:name=test] [btn]<br>' or 
 * 		{ cmdNm: newSprites, cmdFmt: 'name: [text:name=test] [btn]<br>', cmdFn: onNewSprites }
 * @returns {uxForm} for chaining 
 */
uxForm.prototype.addCmd = function addCmd( proto ){
	var cmd = { cmdNm: proto.cmdNm || 'cmd', 
				cmdFmt: proto.cmdFmt || '[btn]', 
				cmdFn: proto.cmdFn || null };	
	
	var re = /\[(btn|txt|sel|rad|msg|rng)(?::([^=\]]+))?(?:=([^\]]*))?\]/;
	var fmt = cmd.cmdFmt;
	cmd.cmdFmt = '';
	cmd.fields = [];
	while (true){	// extract field descriptors and replace with %s
		var m = re.exec(fmt);
		if (m!==null){
			cmd.cmdFmt += fmt.substr(0,m.index) + '%s';	// text before match
			fmt = fmt.substr(m.index+m[0].length); // text after match
			cmd.fields.push( { typ: m[1], nm: m[2], defval: m[3] || '', id: nextId(), cls: '' } );
		} else {
			cmd.cmdFmt += fmt; 
			break;
		}
	}
	for (var i=0; i<cmd.fields.length; i++){
		var fld = cmd.fields[i];
		if (fld.typ=='btn') {
			if (cmd.cmdNm==='cmd' && fld.nm!==undefined) // button label is default command name
				cmd.cmdNm = fld.nm;
			if (fld.nm===undefined) fld.nm = cmd.cmdNm;
			fld.cls = this.cmdCls; 	// a_'Form'
			fld.id = nextId();
			uxFormBtns[ fld.id ] = cmd;
		}
		var fproto = proto[ fld.nm ];
		if (fproto!==undefined){	// additional options
			for (var f in fproto)
				fld[f] = fproto[f];
		}
		if (fld.len===undefined)
			fld.len = fld.defval===undefined? 5 : fld.defval.length;
	}

	while (this.cmds[cmd.cmdNm]!==undefined) // already have a command with this name?
		cmd.cmdNm = nextId(cmd.cmdNm);
	cmd.html = this.cmdPrefix + this.cmdHtml(cmd) + this.cmdSuffix;
	this.cmds.push( cmd );
	return this;
}
var lastId = 'uxid1';
function nextId(s){ // return next in sequence 'sym', 'sym1', 'sym2', ...
	if (s===undefined) { lastId = nextId(lastId); return lastId; }
	var lch = s.substr(s.length-1);
	var v = parseInt(lch, 10);
	if (isNaN(v)) return s + '1';
	if (v===9) return nextId(s.substr(0,s.length-1))+'0';
	return s.substr(0,s.length-1)+(v+1).toString();
}

/**
 * @memberof gb53_ux.uxForm
 * @returns {string} html definition of interface 
 */
uxForm.prototype.asHtml = function asHtml( ){
	var html = this.formPrefix;
	for (var i=0; i<this.cmds.length; i++){
		html += this.cmds[i].html;
	}
	return html + this.formSuffix;
}

/**
 * @memberof gb53_ux.uxForm
 * @returns {string} html definition of a command 
 */
uxForm.prototype.cmdHtml = function cmdHtml( cmd ){
	var args = [ cmd.cmdFmt ];
	for (var i = 0; i<cmd.fields.length; i++)
		args.push( genField( cmd.fields[i] ) );
	return sprintf.apply(null, args);
}

function genField(fld){
	var fmt = 'unknown field type';
	switch (fld.typ){
	case 'btn': fmt = '<button id="%2$s" class="%3$s">%1$s</button>'; break; 
	case 'txt': fmt = '<input type="text" id="%2$s" class="%3$s" value="%4$s" size="%5$s">'; break; 
	case 'sel': fmt = 'TODO'; break; 
	case 'rad': fmt = 'TODO'; break; 
	case 'msg': fmt = 'TODO'; break; 
	case 'rng': fmt = 'TODO'; break; 
	}
	return sprintf(fmt, fld.nm, fld.id, fld.cls, fld.defval, fld.len);
}

function getFieldValue(fld){
	switch (fld.typ){
	case 'btn': return null; 
	case 'txt': return $('#'+fld.id).val(); 
	case 'sel': return 'TODO';  
	case 'rad': return 'TODO'; 
	case 'msg': return 'TODO';  
	case 'rng': return 'TODO';  
	}
	return 'BAD FIELD TYPE';
}

/** generate html for user text input
 * @parm {string} string displayed before value
 * @parm {string} optional id for input element [ txt_PROMPT ]
 * @parm {string} optional class string [ a_ID ]
 * @parm {string} optional default value [ 'value' ]
 * @returns {string} html
 */
export function genText(prompt, id, cls, defval){
	if (id===undefined || id===null) id = 'txt_'+prompt;
	if (cls===undefined || cls===null) cls = 'a_'+id;
	if (defval===undefined || defval===null) defval = 'value';
	var html = sprintf('<label id="lab_%s">%s <input type="text" id="%s" class="%s" value="%s" size="%d"></label>', 
			id, prompt, id, cls, defval, defval.length);
	return html;
}

/** generate html for a button
 * @parm {string} string displayed in button
 * @parm {string} optional id for button [ btn_PROMPT ]
 * @parm {string} optional class string [ a_ID ]
 * @returns {string} html
 */
export function genButton(prompt, id, cls){
	if (id===undefined || id===null) id = 'btn_'+prompt;
	if (cls===undefined || cls===null) cls = 'a_'+id;
	var html = sprintf('<button id="%s" class="%s">%s</button>', 
			id, cls, prompt);
	return html;
}

export function genCmdBtn(prompt){ 
	return genButton(prompt, null, 'a_cmd'); 
}

/**  
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
	var sel = Ux.radioVal(id);
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
	var sel = Ux.selectVal(id);
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

/** 
 * @parm {string} id for div, or comma separated list of ids
 * @parm {string} class string
 * @parm {string} [content of div]
 * @returns {string} html for div (or divs)
 */
export function genDivs(ids,cls, body){
	body = body || '';
	if (cls===undefined)
		cls = '';
	else
		cls = sprintf(' class="%s"', cls);
	var idlst = ids.split(',');
	var html = '';
	for (var i in idlst)
		html += sprintf('<div id="%s"%s> %s </div>', idlst[i], cls, body);
	return html;
}
console.log('gb53_ux.js ]');

