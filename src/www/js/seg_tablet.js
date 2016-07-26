
/*seg_tablet_include.js*/

/*seg_tablet.js*/
if(!u || !Util) {
	var u, Util = u = new function() {};
	u.version = 0.8;
	u.bug = function() {};
	u.nodeId = function() {};
	u.stats = new function() {this.pageView = function(){};this.event = function(){};this.customVar = function(){};}
}
Util.debugURL = function(url) {
	if(u.bug_force) {
		return true;
	}
	return document.domain.match(/.local$/);
}
Util.nodeId = function(node, include_path) {
		if(!include_path) {
			return node.id ? node.nodeName+"#"+node.id : (node.className ? node.nodeName+"."+node.className : (node.name ? node.nodeName + "["+node.name+"]" : node.nodeName));
		}
		else {
			if(node.parentNode && node.parentNode.nodeName != "HTML") {
				return u.nodeId(node.parentNode, include_path) + "->" + u.nodeId(node);
			}
			else {
				return u.nodeId(node);
			}
		}
	return "Unindentifiable node!";
}
Util.bug = function(message, corner, color) {
	if(u.debugURL()) {
		if(!u.bug_console_only) {
			var option, options = new Array([0, "auto", "auto", 0], [0, 0, "auto", "auto"], ["auto", 0, 0, "auto"], ["auto", "auto", 0, 0]);
			if(isNaN(corner)) {
				color = corner;
				corner = 0;
			}
			if(typeof(color) != "string") {
				color = "black";
			}
			option = options[corner];
			if(!document.getElementById("debug_id_"+corner)) {
				var d_target = u.ae(document.body, "div", {"class":"debug_"+corner, "id":"debug_id_"+corner});
				d_target.style.position = u.bug_position ? u.bug_position : "absolute";
				d_target.style.zIndex = 16000;
				d_target.style.top = option[0];
				d_target.style.right = option[1];
				d_target.style.bottom = option[2];
				d_target.style.left = option[3];
				d_target.style.backgroundColor = u.bug_bg ? u.bug_bg : "#ffffff";
				d_target.style.color = "#000000";
				d_target.style.textAlign = "left";
				if(d_target.style.maxWidth) {
					d_target.style.maxWidth = u.bug_max_width ? u.bug_max_width+"px" : "auto";
				}
				d_target.style.padding = "3px";
			}
			if(typeof(message) != "string") {
				message = message.toString();
			}
			var debug_div = document.getElementById("debug_id_"+corner);
			message = message ? message.replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/&lt;br&gt;/g, "<br>") : "Util.bug with no message?";
			u.ae(debug_div, "div", {"style":"color: " + color, "html": message});
		}
		if(typeof(console) == "object") {
			console.log(message);
		}
	}
}
Util.xInObject = function(object) {
	if(u.debugURL()) {
		var x, s = "--- start object ---<br>";
		for(x in object) {
			if(object[x] && typeof(object[x]) == "object" && typeof(object[x].nodeName) == "string") {
				s += x + "=" + object[x]+" -> " + u.nodeId(object[x], 1) + "<br>";
			}
			else if(object[x] && typeof(object[x]) == "function") {
				s += x + "=function<br>";
			}
			else {
				s += x + "=" + object[x]+"<br>";
			}
		}
		s += "--- end object ---"
		u.bug(s);
	}
}
Util.Animation = u.a = new function() {
	this.support3d = function() {
		if(this._support3d === undefined) {
			var node = document.createElement("div");
			try {
				var test = "translate3d(10px, 10px, 10px)";
				node.style[this.variant() + "Transform"] = test;
				if(node.style[this.variant() + "Transform"] == test) {
					this._support3d = true;
				}
				else {
					this._support3d = false;
				}
			}
			catch(exception) {
				this._support3d = false;
			}
		}
		return this._support3d;
	}
	this.variant = function() {
		if(this._variant === undefined) {
			if(document.body.style.webkitTransform != undefined) {
				this._variant = "webkit";
			}
			else if(document.body.style.MozTransform != undefined) {
				this._variant = "Moz";
			}
			else if(document.body.style.oTransform != undefined) {
				this._variant = "o";
			}
			else if(document.body.style.msTransform != undefined) {
				this._variant = "ms";
			}
			else {
				this._variant = "";
			}
		}
		return this._variant;
	}
	this.transition = function(node, transition) {
		try {		
			node.style[this.variant() + "Transition"] = transition;
			if(this.variant() == "Moz") {
				u.e.addEvent(node, "transitionend", this._transitioned);
			}
			else {
				u.e.addEvent(node, this.variant() + "TransitionEnd", this._transitioned);
			}
			var duration = transition.match(/[0-9.]+[ms]+/g);
			if(duration) {
				node.duration = duration[0].match("ms") ? parseFloat(duration[0]) : (parseFloat(duration[0]) * 1000);
			}
			else {
				node.duration = false;
				if(transition.match(/none/i)) {
					node.transitioned = null;
				}
			}
		}
		catch(exception) {
			u.bug("Exception ("+exception+") in u.a.transition(" + node + "), called from: "+arguments.callee.caller);
		}
	}
	this._transitioned = function(event) {
		if(event.target == this && typeof(this.transitioned) == "function") {
			this.transitioned(event);
		}
	}
	this.removeTransform = function(node) {
		node.style[this.variant() + "Transform"] = "none";
	}
	this.translate = function(node, x, y) {
		if(this.support3d()) {
			node.style[this.variant() + "Transform"] = "translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			node.style[this.variant() + "Transform"] = "translate("+x+"px, "+y+"px)";
		}
		node._x = x;
		node._y = y;
		node.offsetHeight;
	}
	this.rotate = function(node, deg) {
		node.style[this.variant() + "Transform"] = "rotate("+deg+"deg)";
		node._rotation = deg;
		node.offsetHeight;
	}
	this.scale = function(node, scale) {
		node.style[this.variant() + "Transform"] = "scale("+scale+")";
		node._scale = scale;
		node.offsetHeight;
	}
	this.setOpacity = function(node, opacity) {
		node.style.opacity = opacity;
		node._opacity = opacity;
		node.offsetHeight;
	}
	this.setWidth = function(node, width) {
		width = width.toString().match(/\%|auto|px/) ? width : (width + "px");
		node.style.width = width;
		node._width = width;
		node.offsetHeight;
	}
	this.setHeight = function(node, height) {
		height = height.toString().match(/\%|auto|px/) ? height : (height + "px");
		node.style.height = height;
		node._height = height;
		node.offsetHeight;
	}
	this.setBgPos = function(node, x, y) {
		x = x.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? x : (x + "px");
		y = y.toString().match(/\%|auto|px|center|top|left|bottom|right/) ? y : (y + "px");
		node.style.backgroundPosition = x + " " + y;
		node._bg_x = x;
		node._bg_y = y;
		node.offsetHeight;
	}
	this.setBgColor = function(node, color) {
		node.style.backgroundColor = color;
		node._bg_color = color;
		node.offsetHeight;
	}
	this.rotateScale = function(node, deg, scale) {
		node.style[this.variant() + "Transform"] = "rotate("+deg+"deg) scale("+scale+")";
		node._rotation = deg;
		node._scale = scale;
		node.offsetHeight;
	}
	this.scaleRotateTranslate = function(node, scale, deg, x, y) {
		if(this.support3d()) {
			node.style[this.variant() + "Transform"] = "scale("+scale+") rotate("+deg+"deg) translate3d("+x+"px, "+y+"px, 0)";
		}
		else {
			node.style[this.variant() + "Transform"] = "scale("+scale+") rotate("+deg+"deg) translate("+x+"px, "+y+"px)";
		}
		node._rotation = deg;
		node._scale = scale;
		node._x = x;
		node._y = y;
		node.offsetHeight;
	}
}
Util.saveCookie = function(name, value, options) {
	expiry = false;
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "expiry"	: expiry	= (typeof(options[argument]) == "string" ? options[argument] : "Mon, 04-Apr-2020 05:00:00 GMT"); break;
				case "path"		: path		= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) +";" + (path ? "path="+path+";" : "") + (expiry ? "expires="+expiry+";" : "")
}
Util.getCookie = function(name) {
	var matches;
	return (matches = document.cookie.match(encodeURIComponent(name) + "=([^;]+)")) ? decodeURIComponent(matches[1]) : false;
}
Util.deleteCookie = function(name, options) {
	path = false;
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "path"	: path	= options[argument]; break;
			}
		}
	}
	document.cookie = encodeURIComponent(name) + "=;" + (path ? "path="+path+";" : "") + "expires=Thu, 01-Jan-70 00:00:01 GMT";
}
Util.saveNodeCookie = function(node, name, value) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(!mem) {
		mem = {};
	}
	if(!mem[ref]) {
		mem[ref] = {};
	}
	mem[ref][name] = (value !== false && value !== undefined) ? value : "";
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.getNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			return mem[ref][name] ? mem[ref][name] : "";
		}
		else {
			return mem[ref];
		}
	}
	return false;
}
Util.deleteNodeCookie = function(node, name) {
	var ref = u.cookieReference(node);
	var mem = JSON.parse(u.getCookie("man_mem"));
	if(mem && mem[ref]) {
		if(name) {
			delete mem[ref][name];
		}
		else {
			delete mem[ref];
		}
	}
	u.saveCookie("man_mem", JSON.stringify(mem), {"path":"/"});
}
Util.cookieReference = function(node) {
	var ref;
	if(node.id) {
		ref = node.nodeName + "#" + node.id;
	}
	else {
		var id_node = node;
		while(!id_node.id) {
			id_node = id_node.parentNode;
		}
		if(id_node.id) {
			ref = id_node.nodeName + "#"+id_node.id + " " + (node.name ? (node.nodeName + "["+node.name+"]") : (node.className ? (node.nodeName+"."+node.className) : node.nodeName));
		}
	}
	return ref;
}
Util.date = function(format, timestamp, months) {
	var date = timestamp ? new Date(timestamp) : new Date();
	if(isNaN(date.getTime())) {
		if(!timestamp.match(/[A-Z]{3}\+[0-9]{4}/)) {
			if(timestamp.match(/ \+[0-9]{4}/)) {
				date = new Date(timestamp.replace(/ (\+[0-9]{4})/, " GMT$1"));
			}
		}
		if(isNaN(date.getTime())) {
			date = new Date();
		}
	}
	var tokens = /d|j|m|n|F|Y|G|H|i|s/g;
	var chars = new Object();
	chars.j = date.getDate();
	chars.d = (chars.j > 9 ? "" : "0") + chars.j;
	chars.n = date.getMonth()+1;
	chars.m = (chars.n > 9 ? "" : "0") + chars.n;
	chars.F = months ? months[date.getMonth()] : "";
	chars.Y = date.getFullYear();
	chars.G = date.getHours();
	chars.H = (chars.G > 9 ? "" : "0") + chars.G;
	var i = date.getMinutes();
	chars.i = (i > 9 ? "" : "0") + i;
	var s = date.getSeconds();
	chars.s = (s > 9 ? "" : "0") + s;
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
Util.querySelector = u.qs = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelector(query);
}
Util.querySelectorAll = u.qsa = function(query, scope) {
	scope = scope ? scope : document;
	return scope.querySelectorAll(query);
}
Util.getElement = u.ge = function(identifier, scope) {
	var node, i, regexp;
	if(document.getElementById(identifier)) {
		return document.getElementById(identifier);
	}
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			return node;
		}
	}
	return scope.getElementsByTagName(identifier).length ? scope.getElementsByTagName(identifier)[0] : false;
}
Util.getElements = u.ges = function(identifier, scope) {
	var node, i, regexp;
	var nodes = new Array();
	scope = scope ? scope : document;
	regexp = new RegExp("(^|\\s)" + identifier + "(\\s|$|\:)");
	for(i = 0; node = scope.getElementsByTagName("*")[i]; i++) {
		if(regexp.test(node.className)) {
			nodes.push(node);
		}
	}
	return nodes.length ? nodes : scope.getElementsByTagName(identifier);
}
Util.parentNode = u.pn = function(node, node_type) {
	if(node_type) {
		if(node.parentNode) {
			var parent = node.parentNode;
		}
		while(parent.nodeName.toLowerCase() != node_type.toLowerCase()) {
			if(parent.parentNode) {
				parent = parent.parentNode;
			}
			else {
				return false;
			}
		}
		return parent;
	}
	else {
		return node.parentNode;
	}
}
Util.previousSibling = u.ps = function(node, exclude) {
	node = node.previousSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.previousSibling;
	}
	return node;
}
Util.nextSibling = u.ns = function(node, exclude) {
	node = node.nextSibling;
	while(node && (node.nodeType == 3 || node.nodeType == 8 || exclude && (u.hc(node, exclude) || node.nodeName.toLowerCase().match(exclude)))) {
		node = node.nextSibling;
	}
	return node;
}
Util.childNodes = u.cn = function(node, exclude) {
	var i, child;
	var children = new Array();
	for(i = 0; child = node.childNodes[i]; i++) {
		if(child && child.nodeType != 3 && child.nodeType != 8 && (!exclude || (!u.hc(child, exclude) && !child.nodeName.toLowerCase().match(exclude) ))) {
			children.push(child);
		}
	}
	return children;
}
Util.appendElement = u.ae = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.appendChild(node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ae, called from: "+arguments.callee.caller.name);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.insertElement = u.ie = function(parent, node_type, attributes) {
	try {
		var node = (typeof(node_type) == "object") ? node_type : document.createElement(node_type);
		node = parent.insertBefore(node, parent.firstChild);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				if(attribute == "html") {
					node.innerHTML = attributes[attribute];
				}
				else {
					node.setAttribute(attribute, attributes[attribute]);
				}
			}
		}
		return node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.ie, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(parent, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.wrapElement = u.we = function(node, node_type, attributes) {
	try {
		var wrapper_node = node.parentNode.insertBefore(document.createElement(node_type), node);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		wrapper_node.appendChild(node);
		return wrapper_node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.we, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(node, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.wrapContent = u.wc = function(node, node_type, attributes) {
	try {
		var wrapper_node = document.createElement(node_type);
		if(attributes) {
			var attribute;
			for(attribute in attributes) {
				wrapper_node.setAttribute(attribute, attributes[attribute]);
			}
		}	
		while(node.childNodes.length) {
			wrapper_node.appendChild(node.childNodes[0]);
		}
		node.appendChild(wrapper_node);
		return wrapper_node;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.wc, called from: "+arguments.callee.caller);
		u.bug("node:" + u.nodeId(node, 1));
		u.xInObject(attributes);
	}
	return false;
}
Util.textContent = u.text = function(node) {
	return node.textContent;
}
Util.clickableElement = u.ce = function(node, options) {
	var a = (node.nodeName.toLowerCase() == "a" ? node : u.qs("a", node));
	if(a) {
		u.ac(node, "link");
		if(a.getAttribute("href") !== null) {
			node.url = a.href;
			a.removeAttribute("href");
		}
	}
	else {
		u.ac(node, "clickable");
	}
	if(typeof(u.e.click) == "function") {
		u.e.click(node);
		if(typeof(options) == "object") {
			var argument;
			for(argument in options) {
				switch(argument) {
					case "type"			: node._click_type		= options[argument]; break;
					case "method"		: node._click_method	= options[argument]; break;
				}
			}
			if(node._click_type == "link") {
				node.clicked = function(event) {
					if(event.metaKey || event.ctrlKey) {
						window.open(this.url);
					}
					else {
						if(typeof(page.navigate) == "function") {
							page.navigate(this.url);
						}
						else {
							location.href = this.url;
						}
					}
				}
			}
		}
	}
	return node;
}
Util.classVar = u.cv = function(node, var_name) {
	try {
		var regexp = new RegExp(var_name + ":[?=\\w/\\#~:.?+=?&%@!\\-]*");
		if(node.className.match(regexp)) {
			return node.className.match(regexp)[0].replace(var_name + ":", "");
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.cv, called from: "+arguments.callee.caller);
	}
	return false;
}
u.getIJ = u.cv;
Util.setClass = u.sc = function(node, classname) {
	try {
		var old_class = node.className;
		node.className = classname;
		node.offsetTop;
		return old_class;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.setClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.hasClass = u.hc = function(node, classname) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)(" + classname + ")(\\s|$)");
			if(regexp.test(node.className)) {
				return true;
			}
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.hasClass("+u.nodeId(node)+"), called from: "+arguments.callee.caller);
	}
	return false;
}
Util.addClass = u.ac = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$)");
			if(!regexp.test(node.className)) {
				node.className += node.className ? " " + classname : classname;
				dom_update === false ? false : node.offsetTop;
			}
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.addClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.removeClass = u.rc = function(node, classname, dom_update) {
	try {
		if(classname) {
			var regexp = new RegExp("(\\b)" + classname + "(\\s|$)", "g");
			node.className = node.className.replace(regexp, " ").trim().replace(/[\s]{2}/g, " ");
			dom_update === false ? false : node.offsetTop;
			return node.className;
		}
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.removeClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.toggleClass = u.tc = function(node, classname, _classname, dom_update) {
	try {
		var regexp = new RegExp("(^|\\s)" + classname + "(\\s|$|\:)");
		if(regexp.test(node.className)) {
			u.rc(node, classname, false);
			if(_classname) {
				u.ac(node, _classname, false);
			}
		}
		else {
			u.ac(node, classname, false);
			if(_classname) {
				u.rc(node, _classname, false);
			}
		}
		dom_update === false ? false : node.offsetTop;
		return node.className;
	}
	catch(exception) {
		u.bug("Exception ("+exception+") in u.toggleClass, called from: "+arguments.callee.caller);
	}
	return false;
}
Util.applyStyle = u.as = function(node, property, value, dom_update) {
	node.style[property] = value;
	dom_update === false ? false : node.offsetTop;
}
Util.applyStyles = u.ass = function(node, styles, dom_update) {
	if(styles) {
		var style;
		for(style in styles) {
			node.style[style] = styles[style];
		}
	}
	dom_update === false ? false : node.offsetTop;
}
Util.getComputedStyle = u.gcs = function(node, property) {
	node.offsetHeight;
	if(document.defaultView && document.defaultView.getComputedStyle) {
		return document.defaultView.getComputedStyle(node, null).getPropertyValue(property);
	}
	return false;
}
Util.hasFixedParent = u.hfp = function(node) {
	while(node.nodeName.toLowerCase() != "body") {
		if(u.gcs(node.parentNode, "position").match("fixed")) {
			return true;
		}
		node = node.parentNode;
	}
	return false;
}
Util.Events = u.e = new function() {
	this.event_pref = typeof(document.ontouchmove) == "undefined" || navigator.maxTouchPoints > 1 ? "mouse" : "touch";
	this.kill = function(event) {
		if(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
	this.addEvent = function(node, type, action) {
		try {
			node.addEventListener(type, action, false);
		}
		catch(exception) {
			alert("exception in addEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.removeEvent = function(node, type, action) {
		try {
			node.removeEventListener(type, action, false);
		}
		catch(exception) {
			u.bug("exception in removeEvent:" + node + "," + type + ":" + exception);
		}
	}
	this.addStartEvent = this.addDownEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.removeStartEvent = this.removeDownEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchstart" : "mousedown"), action);
	}
	this.addMoveEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.removeMoveEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchmove" : "mousemove"), action);
	}
	this.addEndEvent = this.addUpEvent = function(node, action) {
		u.e.addEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.addEvent(node, "mouseout", this._snapback);
		}
	}
	this.removeEndEvent = this.removeUpEvent = function(node, action) {
		u.e.removeEvent(node, (this.event_pref == "touch" ? "touchend" : "mouseup"), action);
		if(node.snapback && u.e.event_pref == "mouse") {
			u.e.removeEvent(node, "mouseout", this._snapback);
		}
	}
	this.resetClickEvents = function(node) {
		u.t.resetTimer(node.t_held);
		u.t.resetTimer(node.t_clicked);
		this.removeEvent(node, "mouseup", this._dblclicked);
		this.removeEvent(node, "touchend", this._dblclicked);
		this.removeEvent(node, "mousemove", this._cancelClick);
		this.removeEvent(node, "touchmove", this._cancelClick);
		this.removeEvent(node, "mouseout", this._cancelClick);
		this.removeEvent(node, "mousemove", this._move);
		this.removeEvent(node, "touchmove", this._move);
	}
	this.resetEvents = function(node) {
		this.resetClickEvents(node);
		if(typeof(this.resetDragEvents) == "function") {
			this.resetDragEvents(node);
		}
	}
	this.resetNestedEvents = function(node) {
		while(node && node.nodeName != "HTML") {
			this.resetEvents(node);
			node = node.parentNode;
		}
	}
	this._inputStart = function(event) {
		this.event_var = event;
		this.input_timestamp = event.timeStamp;
		this.start_event_x = u.eventX(event);
		this.start_event_y = u.eventY(event);
		this.current_xps = 0;
		this.current_yps = 0;
		this.swiped = false;
		if(this.e_click || this.e_dblclick || this.e_hold) {
			var node = this;
			while(node) {
				if(node.e_drag || node.e_swipe) {
					u.e.addMoveEvent(this, u.e._cancelClick);
					break;
				}
				else {
					node = node.parentNode;
				}
			}
			u.e.addMoveEvent(this, u.e._move);
			if(u.e.event_pref == "touch") {
				u.e.addMoveEvent(this, u.e._cancelClick);
			}
			u.e.addEndEvent(this, u.e._dblclicked);
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(this, "mouseout", u.e._cancelClick);
			}
		}
		if(this.e_hold) {
			this.t_held = u.t.setTimer(this, u.e._held, 750);
		}
		if(this.e_drag || this.e_swipe) {
			u.e.addMoveEvent(this, u.e._pick);
			u.e.addEndEvent(this, u.e._drop);
		}
		if(this.e_scroll) {
			u.e.addMoveEvent(this, u.e._scrollStart);
			u.e.addEndEvent(this, u.e._scrollEnd);
		}
		if(typeof(this.inputStarted) == "function") {
			this.inputStarted(event);
		}
	}
	this._cancelClick = function(event) {
		u.e.resetClickEvents(this);
		if(typeof(this.clickCancelled) == "function") {
			this.clickCancelled(event);
		}
	}
	this._move = function(event) {
		if(typeof(this.moved) == "function") {
			this.moved(event);
		}
	}
	this.hold = function(node) {
		node.e_hold = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._held = function(event) {
		u.stats.event(this, "held");
		u.e.resetNestedEvents(this);
		if(typeof(this.held) == "function") {
			this.held(event);
		}
	}
	this.click = this.tap = function(node) {
		node.e_click = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._clicked = function(event) {
		u.stats.event(this, "clicked");
		u.e.resetNestedEvents(this);
		if(typeof(this.clicked) == "function") {
			this.clicked(event);
		}
	}
	this.dblclick = this.doubletap = function(node) {
		node.e_dblclick = true;
		u.e.addStartEvent(node, this._inputStart);
	}
	this._dblclicked = function(event) {
		if(u.t.valid(this.t_clicked) && event) {
			u.stats.event(this, "dblclicked");
			u.e.resetNestedEvents(this);
			if(typeof(this.dblclicked) == "function") {
				this.dblclicked(event);
			}
			return;
		}
		else if(!this.e_dblclick) {
			this._clicked = u.e._clicked;
			this._clicked(event);
		}
		else if(!event) {
			this._clicked = u.e._clicked;
			this._clicked(this.event_var);
		}
		else {
			u.e.resetNestedEvents(this);
			this.t_clicked = u.t.setTimer(this, u.e._dblclicked, 400);
		}
	}
}
u.e.addDOMReadyEvent = function(action) {
	if(document.readyState && document.addEventListener) {
		if((document.readyState == "interactive" && !u.browser("ie")) || document.readyState == "complete" || document.readyState == "loaded") {
			action();
		}
		else {
			var id = u.randomString();
			window["DOMReady_" + id] = action;
			eval('window["_DOMReady_' + id + '"] = function() {window["DOMReady_'+id+'"](); u.e.removeEvent(document, "DOMContentLoaded", window["_DOMReady_' + id + '"])}');
			u.e.addEvent(document, "DOMContentLoaded", window["_DOMReady_" + id]);
		}
	}
	else {
		u.e.addOnloadEvent(action);
	}
}
u.e.addOnloadEvent = function(action) {
	if(document.readyState && (document.readyState == "complete" || document.readyState == "loaded")) {
		action();
	}
	else {
		var id = u.randomString();
		window["Onload_" + id] = action;
		eval('window["_Onload_' + id + '"] = function() {window["Onload_'+id+'"](); u.e.removeEvent(window, "load", window["_Onload_' + id + '"])}');
		u.e.addEvent(window, "load", window["_Onload_" + id]);
	}
}
u.e.addResizeEvent = function(node, action) {
}
u.e.removeResizeEvent = function(node, action) {
}
u.e.addScrollEvent = function(node, action) {
}
u.e.removeScrollEvent = function(node, action) {
}
u.e.resetDragEvents = function(node) {
	this.removeEvent(node, "mousemove", this._pick);
	this.removeEvent(node, "touchmove", this._pick);
	this.removeEvent(node, "mousemove", this._drag);
	this.removeEvent(node, "touchmove", this._drag);
	this.removeEvent(node, "mouseup", this._drop);
	this.removeEvent(node, "touchend", this._drop);
	this.removeEvent(node, "mouseout", this._drop_mouse);
	this.removeEvent(node, "mousemove", this._scrollStart);
	this.removeEvent(node, "touchmove", this._scrollStart);
	this.removeEvent(node, "mousemove", this._scrolling);
	this.removeEvent(node, "touchmove", this._scrolling);
	this.removeEvent(node, "mouseup", this._scrollEnd);
	this.removeEvent(node, "touchend", this._scrollEnd);
}
u.e.overlap = function(node, boundaries, strict) {
	if(boundaries.constructor.toString().match("Array")) {
		var boundaries_start_x = Number(boundaries[0]);
		var boundaries_start_y = Number(boundaries[1]);
		var boundaries_end_x = Number(boundaries[2]);
		var boundaries_end_y = Number(boundaries[3]);
	}
	else if(boundaries.constructor.toString().match("HTML")) {
		var boundaries_start_x = u.absX(boundaries) - u.absX(node);
		var boundaries_start_y =  u.absY(boundaries) - u.absY(node);
		var boundaries_end_x = Number(boundaries_start_x + boundaries.offsetWidth);
		var boundaries_end_y = Number(boundaries_start_y + boundaries.offsetHeight);
	}
	var node_start_x = Number(node._x);
	var node_start_y = Number(node._y);
	var node_end_x = Number(node_start_x + node.offsetWidth);
	var node_end_y = Number(node_start_y + node.offsetHeight);
	if(strict) {
		if(node_start_x >= boundaries_start_x && node_start_y >= boundaries_start_y && node_end_x <= boundaries_end_x && node_end_y <= boundaries_end_y) {
			return true;
		}
		else {
			return false;
		}
	} 
	else if(node_end_x < boundaries_start_x || node_start_x > boundaries_end_x || node_end_y < boundaries_start_y || node_start_y > boundaries_end_y) {
		return false;
	}
	return true;
}
u.e.drag = function(node, boundaries, settings) {
	node.e_drag = true;
	if(node.childNodes.length < 2 && node.innerHTML.trim() == "") {
		node.innerHTML = "&nbsp;";
	}
	node.drag_strict = true;
	node.drag_elastica = 0;
	node.drag_dropout = true;
	node.show_bounds = false;
	node.callback_picked = "picked";
	node.callback_moved = "moved";
	node.callback_dropped = "dropped";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "strict"			: node.drag_strict			= settings[argument]; break;
				case "elastica"			: node.drag_elastica		= Number(settings[argument]); break;
				case "dropout"			: node.drag_dropout			= settings[argument]; break;
				case "show_bounds"		: node.show_bounds			= settings[argument]; break; 
				case "vertical_lock"	: node.vertical_lock		= settings[argument]; break;
				case "horizontal_lock"	: node.horizontal_lock		= settings[argument]; break;
				case "callback_picked"	: node.callback_picked		= settings[argument]; break;
				case "callback_moved"	: node.callback_moved		= settings[argument]; break;
				case "callback_dropped"	: node.callback_dropped		= settings[argument]; break;
			}
		}
	}
	if((boundaries.constructor && boundaries.constructor.toString().match("Array")) || (boundaries.scopeName && boundaries.scopeName != "HTML")) {
		node.start_drag_x = Number(boundaries[0]);
		node.start_drag_y = Number(boundaries[1]);
		node.end_drag_x = Number(boundaries[2]);
		node.end_drag_y = Number(boundaries[3]);
	}
	else if((boundaries.constructor && boundaries.constructor.toString().match("HTML")) || (boundaries.scopeName && boundaries.scopeName == "HTML")) {
		node.start_drag_x = u.absX(boundaries) - u.absX(node);
		node.start_drag_y = u.absY(boundaries) - u.absY(node);
		node.end_drag_x = node.start_drag_x + boundaries.offsetWidth;
		node.end_drag_y = node.start_drag_y + boundaries.offsetHeight;
	}
	if(node.show_bounds) {
		var debug_bounds = u.ae(document.body, "div", {"class":"debug_bounds"})
		debug_bounds.style.position = "absolute";
		debug_bounds.style.background = "red"
		debug_bounds.style.left = (u.absX(node) + node.start_drag_x - 1) + "px";
		debug_bounds.style.top = (u.absY(node) + node.start_drag_y - 1) + "px";
		debug_bounds.style.width = (node.end_drag_x - node.start_drag_x) + "px";
		debug_bounds.style.height = (node.end_drag_y - node.start_drag_y) + "px";
		debug_bounds.style.border = "1px solid white";
		debug_bounds.style.zIndex = 9999;
		debug_bounds.style.opacity = .5;
		if(document.readyState && document.readyState == "interactive") {
			debug_bounds.innerHTML = "WARNING - injected on DOMLoaded"; 
		}
		u.bug("node: "+u.nodeId(node)+" in (" + u.absX(node) + "," + u.absY(node) + "), (" + (u.absX(node)+node.offsetWidth) + "," + (u.absY(node)+node.offsetHeight) +")");
		u.bug("boundaries: (" + node.start_drag_x + "," + node.start_drag_y + "), (" + node.end_drag_x + ", " + node.end_drag_y + ")");
	}
	node._x = node._x ? node._x : 0;
	node._y = node._y ? node._y : 0;
	node.locked = ((node.end_drag_x - node.start_drag_x == node.offsetWidth) && (node.end_drag_y - node.start_drag_y == node.offsetHeight));
	node.only_vertical = (node.vertical_lock || (!node.locked && node.end_drag_x - node.start_drag_x == node.offsetWidth));
	node.only_horizontal = (node.horizontal_lock || (!node.locked && node.end_drag_y - node.start_drag_y == node.offsetHeight));
	u.e.addStartEvent(node, this._inputStart);
}
u.e._pick = function(event) {
	var init_speed_x = Math.abs(this.start_event_x - u.eventX(event));
	var init_speed_y = Math.abs(this.start_event_y - u.eventY(event));
	if((init_speed_x > init_speed_y && this.only_horizontal) || 
	   (init_speed_x < init_speed_y && this.only_vertical) ||
	   (!this.only_vertical && !this.only_horizontal)) {
		u.e.resetNestedEvents(this);
	    u.e.kill(event);
		this.move_timestamp = event.timeStamp;
		this.move_last_x = this._x;
		this.move_last_y = this._y;
		if(u.hasFixedParent(this)) {
			this.start_input_x = u.eventX(event) - this._x - u.scrollX(); 
			this.start_input_y = u.eventY(event) - this._y - u.scrollY();
		}
		else {
			this.start_input_x = u.eventX(event) - this._x; 
			this.start_input_y = u.eventY(event) - this._y;
		}
		this.current_xps = 0;
		this.current_yps = 0;
		u.a.transition(this, "none");
		u.e.addMoveEvent(this, u.e._drag);
		u.e.addEndEvent(this, u.e._drop);
		if(typeof(this[this.callback_picked]) == "function") {
			this[this.callback_picked](event);
		}
	}
	if(this.drag_dropout && u.e.event_pref == "mouse") {
		u.e.addEvent(this, "mouseout", u.e._drop_mouse);
	}
}
u.e._drag = function(event) {
	if(u.hasFixedParent(this)) {
		this.current_x = u.eventX(event) - this.start_input_x - u.scrollX();
		this.current_y = u.eventY(event) - this.start_input_y - u.scrollY();
	}
	else {
		this.current_x = u.eventX(event) - this.start_input_x;
		this.current_y = u.eventY(event) - this.start_input_y;
	}
	this.current_xps = Math.round(((this.current_x - this.move_last_x) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.current_yps = Math.round(((this.current_y - this.move_last_y) / (event.timeStamp - this.move_timestamp)) * 1000);
	this.move_timestamp = event.timeStamp;
	this.move_last_x = this.current_x;
	this.move_last_y = this.current_y;
	if(!this.locked && this.only_vertical) {
		this._y = this.current_y;
	}
	else if(!this.locked && this.only_horizontal) {
		this._x = this.current_x;
	}
	else if(!this.locked) {
		this._x = this.current_x;
		this._y = this.current_y;
	}
	if(this.e_swipe) {
		if(this.current_xps && (Math.abs(this.current_xps) > Math.abs(this.current_yps) || this.only_horizontal)) {
			if(this.current_xps < 0) {
				this.swiped = "left";
			}
			else {
				this.swiped = "right";
			}
		}
		else if(this.current_yps && (Math.abs(this.current_xps) < Math.abs(this.current_yps) || this.only_vertical)) {
			if(this.current_yps < 0) {
				this.swiped = "up";
			}
			else {
				this.swiped = "down";
			}
		}
	}
	if(!this.locked) {
		if(u.e.overlap(this, [this.start_drag_x, this.start_drag_y, this.end_drag_x, this.end_drag_y], true)) {
			u.a.translate(this, this._x, this._y);
		}
		else if(this.drag_elastica) {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			var offset = false;
			if(!this.only_vertical && this._x < this.start_drag_x) {
				offset = this._x < this.start_drag_x - this.drag_elastica ? - this.drag_elastica : this._x - this.start_drag_x;
				this._x = this.start_drag_x;
				this.current_x = this._x + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.only_vertical && this._x + this.offsetWidth > this.end_drag_x) {
				offset = this._x + this.offsetWidth > this.end_drag_x + this.drag_elastica ? this.drag_elastica : this._x + this.offsetWidth - this.end_drag_x;
				this._x = this.end_drag_x - this.offsetWidth;
				this.current_x = this._x + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_x = this._x;
			}
			if(!this.only_horizontal && this._y < this.start_drag_y) {
				offset = this._y < this.start_drag_y - this.drag_elastica ? - this.drag_elastica : this._y - this.start_drag_y;
				this._y = this.start_drag_y;
				this.current_y = this._y + offset + (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else if(!this.horizontal && this._y + this.offsetHeight > this.end_drag_y) {
				offset = (this._y + this.offsetHeight > this.end_drag_y + this.drag_elastica) ? this.drag_elastica : (this._y + this.offsetHeight - this.end_drag_y);
				this._y = this.end_drag_y - this.offsetHeight;
				this.current_y = this._y + offset - (Math.round(Math.pow(offset, 2)/this.drag_elastica));
			}
			else {
				this.current_y = this._y;
			}
			if(offset) {
				u.a.translate(this, this.current_x, this.current_y);
			}
		}
		else {
			this.swiped = false;
			this.current_xps = 0;
			this.current_yps = 0;
			if(this._x < this.start_drag_x) {
				this._x = this.start_drag_x;
			}
			else if(this._x + this.offsetWidth > this.end_drag_x) {
				this._x = this.end_drag_x - this.offsetWidth;
			}
			if(this._y < this.start_drag_y) {
				this._y = this.start_drag_y;
			}
			else if(this._y + this.offsetHeight > this.end_drag_y) { 
				this._y = this.end_drag_y - this.offsetHeight;
			}
			u.a.translate(this, this._x, this._y);
		}
	}
	if(typeof(this[this.callback_moved]) == "function") {
		this[this.callback_moved](event);
	}
}
u.e._drop = function(event) {
	u.e.resetEvents(this);
	if(this.e_swipe && this.swiped) {
		if(this.swiped == "left" && typeof(this.swipedLeft) == "function") {
			this.swipedLeft(event);
		}
		else if(this.swiped == "right" && typeof(this.swipedRight) == "function") {
			this.swipedRight(event);
		}
		else if(this.swiped == "down" && typeof(this.swipedDown) == "function") {
			this.swipedDown(event);
		}
		else if(this.swiped == "up" && typeof(this.swipedUp) == "function") {
			this.swipedUp(event);
		}
	}
	else if(!this.drag_strict && !this.locked) {
		this.current_x = Math.round(this._x + (this.current_xps/2));
		this.current_y = Math.round(this._y + (this.current_yps/2));
		if(this.only_vertical || this.current_x < this.start_drag_x) {
			this.current_x = this.start_drag_x;
		}
		else if(this.current_x + this.offsetWidth > this.end_drag_x) {
			this.current_x = this.end_drag_x - this.offsetWidth;
		}
		if(this.only_horizontal || this.current_y < this.start_drag_y) {
			this.current_y = this.start_drag_y;
		}
		else if(this.current_y + this.offsetHeight > this.end_drag_y) {
			this.current_y = this.end_drag_y - this.offsetHeight;
		}
		this.transitioned = function() {
			this.transitioned = null;
			u.a.transition(this, "none");
			if(typeof(this.projected) == "function") {
				this.projected(event);
			}
		}
		if(this.current_xps || this.current_yps) {
			u.a.transition(this, "all 1s cubic-bezier(0,0,0.25,1)");
		}
		else {
			u.a.transition(this, "all 0.2s cubic-bezier(0,0,0.25,1)");
		}
		u.a.translate(this, this.current_x, this.current_y);
	}
	if(typeof(this[this.callback_dropped]) == "function") {
		this[this.callback_dropped](event);
	}
}
u.e._drop_mouse = function(event) {
	if(event.target == this) {
		this._drop = u.e._drop;
		this._drop(event);
	}
}
u.e.swipe = function(node, boundaries, settings) {
	node.e_swipe = true;
	u.e.drag(node, boundaries, settings);
}
Util.flashDetection = function(version) {
	var flash_version = false;
	var flash = false;
	if(navigator.plugins && navigator.plugins["Shockwave Flash"] && navigator.plugins["Shockwave Flash"].description && navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"]) {
		flash = true;
		var Pversion = navigator.plugins["Shockwave Flash"].description.match(/\b([\d]+)\b/);
		if(Pversion.length > 1 && !isNaN(Pversion[1])) {
			flash_version = Pversion[1];
		}
	}
	else if(window.ActiveXObject) {
		try {
			var AXflash, AXversion;
			AXflash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			if(AXflash) {
				flash = true;
				AXversion = AXflash.GetVariable("$version").match(/\b([\d]+)\b/);
				if(AXversion.length > 1 && !isNaN(AXversion[1])) {
					flash_version = AXversion[1];
				}
			}
		}
		catch(exception) {}
	}
	if(flash_version || (flash && !version)) {
		if(!version) {
			return true;
		}
		else {
			if(!isNaN(version)) {
				return flash_version == version;
			}
			else {
				return eval(flash_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.flash = function(node, url, settings) {
	var width = "100%";
	var height = "100%";
	var background = "transparent";
	var id = "flash_" + new Date().getHours() + "_" + new Date().getMinutes() + "_" + new Date().getMilliseconds();
	var allowScriptAccess = "always";
	var menu = "false";
	var scale = "showall";
	var wmode = "transparent";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "id"					: id				= settings[argument]; break;
				case "width"				: width				= Number(settings[argument]); break;
				case "height"				: height			= Number(settings[argument]); break;
				case "background"			: background		= settings[argument]; break;
				case "allowScriptAccess"	: allowScriptAccess = settings[argument]; break;
				case "menu"					: menu				= settings[argument]; break;
				case "scale"				: scale				= settings[argument]; break;
				case "wmode"				: wmode				= settings[argument]; break;
			}
		}
	}
	html = '<object';
	html += ' id="'+id+'"';
	html += ' width="'+width+'"';
	html += ' height="'+height+'"';
	if(u.browser("explorer")) {
		html += ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"';
	}
	else {
		html += ' type="application/x-shockwave-flash"';
		html += ' data="'+url+'"';
	}
	html += '>';
	html += '<param name="allowScriptAccess" value="'+allowScriptAccess+'" />';
	html += '<param name="movie" value="'+url+'" />';
	html += '<param name="quality" value="high" />';
	html += '<param name="bgcolor" value="'+background+'" />';
	html += '<param name="play" value="true" />';
	html += '<param name="wmode" value="'+wmode+'" />';
	html += '<param name="menu" value="'+menu+'" />';
	html += '<param name="scale" value="'+scale+'" />';
	html += '</object>';
	var temp_node = document.createElement("div");
	temp_node.innerHTML = html;
	node.insertBefore(temp_node.firstChild, node.firstChild);
	var flash_object = u.qs("#"+id, node);
	return flash_object;
}
Util.Form = u.f = new function() {
	this.customInit = {};
	this.customValidate = {};
	this.customSend = {};
	this.init = function(form, settings) {
		var i, j, field, action, input;
		form.form_send = "params";
		form.ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: form.ignore_inputs	= settings[argument]; break;
					case "form_send"		: form.form_send		= settings[argument]; break;
				}
			}
		}
		form.onsubmit = function(event) {return false;}
		form.setAttribute("novalidate", "novalidate");
		form._submit = this._submit;
		form.fields = {};
		form.tab_order = [];
		form.actions = {};
		var fields = u.qsa(".field", form);
		for(i = 0; field = fields[i]; i++) {
			var abbr = u.qs("abbr", field);
			if(abbr) {
				abbr.parentNode.removeChild(abbr);
			}
			var error_message = field.getAttribute("data-error");
			if(error_message) {
				u.ae(field, "div", {"class":"error", "html":error_message})
			}
			field._indicator = u.ae(field, "div", {"class":"indicator"});
			field._help = u.qs(".help", field);
			field._hint = u.qs(".hint", field);
			field._error = u.qs(".error", field);
			var not_initialized = true;
			var custom_init;
			for(custom_init in this.customInit) {
				if(field.className.match(custom_init)) {
					this.customInit[custom_init](field);
					not_initialized = false;
				}
			}
			if(not_initialized) {
				if(u.hc(field, "string|email|tel|number|integer|password")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "text")) {
					field._input = u.qs("textarea", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
					if(u.hc(field, "autoexpand")) {
						this.autoExpand(field._input)
					}
				}
				else if(u.hc(field, "select")) {
					field._input = u.qs("select", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "checkbox|boolean")) {
					field._input = u.qs("input[type=checkbox]", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "radio|radio_buttons")) {
					field._input = u.qsa("input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						input._label = u.qs("label[for="+input.id+"]", field);
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "date|datetime")) {
					field._input = u.qsa("select,input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						input._label = u.qs("label[for="+input.id+"]", field);
						this.formIndex(form, input);
					}
				}
				else if(u.hc(field, "tags")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					field._input._label = u.qs("label\[for\="+field._input.id+"\]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "prices")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "files")) {
					field._input = u.qs("input", field);
					field._input.field = field;
					field._input._label = u.qs("label[for="+field._input.id+"]", field);
					this.formIndex(form, field._input);
				}
				else if(u.hc(field, "location")) {
					field._input = u.qsa("input", field);
					for(j = 0; input = field._input[j]; j++) {
						input.field = field;
						input._label = u.qs("label[for="+input.id+"]", field);
						this.formIndex(form, input);
					}
					if(navigator.geolocation) {
						this.geoLocation(field);
					}
				}
			}
		}
		var hidden_fields = u.qsa("input[type=hidden]", form);
		for(i = 0; hidden_field = hidden_fields[i]; i++) {
			if(!form.fields[hidden_field.name]) {
				form.fields[hidden_field.name] = hidden_field;
				hidden_field.val = this._value;
			}
		}
		var actions = u.qsa(".actions li, .actions", form);
		for(i = 0; action = actions[i]; i++) {
			action._input = u.qs("input,a", action);
			if(action._input.type && action._input.type == "submit") {
				action._input.onclick = function(event) {
					u.e.kill(event ? event : window.event);
				}
			}
			u.ce(action._input);
			action._input.clicked = function(event) {
				u.e.kill(event);
				if(!u.hc(this, "disabled")) {
					if(this.type && this.type.match(/submit/i)) {
						this.form._submit_button = this;
						this.form._submit_input = false;
						this.form._submit(event, this);
					}
				}
			}
			this.buttonOnEnter(action._input);
			this.activateButton(action._input);
			var action_name = action._input.name ? action._input.name : action.className;
				form.actions[action_name] = action._input;
			if(typeof(u.k) == "object" && u.hc(action._input, "key:[a-z0-9]+")) {
				u.k.addKey(u.cv(action._input, "key"), action._input);
			}
		}
		if(!actions.length) {
			var p_ul = u.pn(form, "ul");
			if(u.hc(p_ul, "actions")) {
				u.bug("valid pure button form found")
				var input = u.qs("input,a", form);
				if(input.type && input.type == "submit") {
					input.onclick = function(event) {
						u.e.kill(event ? event : window.event);
					}
				}
				u.ce(input);
				input.clicked = function(event) {
					u.e.kill(event);
					if(!u.hc(this, "disabled")) {
						if(this.type && this.type.match(/submit/i)) {
							this.form._submit_button = this;
							this.form._submit_input = false;
							this.form._submit(event, this);
						}
					}
				}
				this.buttonOnEnter(input);
				this.activateButton(input);
				if(input.name) {
					form.actions[input.name] = input;
				}
				if(typeof(u.k) == "object" && u.hc(input, "key:[a-z0-9]+")) {
					u.k.addKey(u.cv(input, "key"), input);
				}
			}
		}
	}
	this._value = function(value) {
		if(value !== undefined) {
			this.value = value;
			u.f.validate(this);
		}
		return this.value;
	}
	this._value_radio = function(value) {
		if(value) {
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.value == value) {
					option.checked = true;
					u.f.validate(this);
				}
			}
		}
		else {
			var i, option;
			for(i = 0; option = this.form[this.name][i]; i++) {
				if(option.checked) {
					return option.value;
				}
			}
		}
		return false;
	}
	this._value_checkbox = function(value) {
		if(value) {
			this.checked = true
			u.f.validate(this);
		}
		else {
			if(this.checked) {
				return this.value;
			}
		}
		return false;
	}
	this._value_select = function(value) {
		if(value !== undefined) {
			var i, option;
			for(i = 0; option = this.options[i]; i++) {
				if(option.value == value) {
					this.selectedIndex = i;
					u.f.validate(this);
					return i;
				}
			}
			return false;
		}
		else {
			return this.options[this.selectedIndex].value;
		}
	}
	this.inputOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(this.nodeName.match(/input/i) && (event.keyCode == 40 || event.keyCode == 38)) {
				this._submit_disabled = true;
			}
			else if(this.nodeName.match(/input/i) && this._submit_disabled && (
				event.keyCode == 46 || 
				(event.keyCode == 39 && u.browser("firefox")) || 
				(event.keyCode == 37 && u.browser("firefox")) || 
				event.keyCode == 27 || 
				event.keyCode == 13 || 
				event.keyCode == 9 ||
				event.keyCode == 8
			)) {
				this._submit_disabled = false;
			}
			else if(event.keyCode == 13 && !this._submit_disabled) {
				u.e.kill(event);
				this.blur();
				this.form.submitInput = this;
				this.form.submitButton = false;
				this.form._submit(event, this);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.buttonOnEnter = function(node) {
		node.keyPressed = function(event) {
			if(event.keyCode == 13 && !u.hc(this, "disabled")) {
				u.e.kill(event);
				this.form.submit_input = false;
				this.form.submit_button = this;
				this.form._submit(event);
			}
		}
		u.e.addEvent(node, "keydown", node.keyPressed);
	}
	this.formIndex = function(form, iN) {
		iN.tab_index = form.tab_order.length;
		form.tab_order[iN.tab_index] = iN;
		if(iN.field && iN.name) {
			form.fields[iN.name] = iN;
			if(iN.nodeName.match(/input/i) && iN.type && iN.type.match(/text|email|tel|number|password|datetime|date/)) {
				iN.val = this._value;
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
				this.inputOnEnter(iN);
			}
			else if(iN.nodeName.match(/textarea/i)) {
				iN.val = this._value;
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
			}
			else if(iN.nodeName.match(/select/i)) {
				iN.val = this._value_select;
				u.e.addEvent(iN, "change", this._updated);
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
			}
			else if(iN.type && iN.type.match(/checkbox/)) {
				iN.val = this._value_checkbox;
				if(u.browser("explorer", "<=8")) {
					iN.pre_state = iN.checked;
					iN._changed = u.f._changed;
					iN._updated = u.f._updated;
					iN._clicked = function(event) {
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						this.pre_state = this.checked;
					}
					u.e.addEvent(iN, "click", iN._clicked);
				}
				else {
					u.e.addEvent(iN, "change", this._updated);
					u.e.addEvent(iN, "change", this._changed);
				}
				this.inputOnEnter(iN);
			}
			else if(iN.type && iN.type.match(/radio/)) {
				iN.val = this._value_radio;
				if(u.browser("explorer", "<=8")) {
					iN.pre_state = iN.checked;
					iN._changed = u.f._changed;
					iN._updated = u.f._updated;
					iN._clicked = function(event) {
						var i, input;
						if(this.checked != this.pre_state) {
							this._changed(window.event);
							this._updated(window.event);
						}
						for(i = 0; input = this.field._input[i]; i++) {
							input.pre_state = input.checked;
						}
					}
					u.e.addEvent(iN, "click", iN._clicked);
				}
				else {
					u.e.addEvent(iN, "change", this._updated);
					u.e.addEvent(iN, "change", this._changed);
				}
				this.inputOnEnter(iN);
			}
			else if(iN.type && iN.type.match(/file/)) {
				iN.val = function(value) {
					if(value !== undefined) {
						alert('adding values manually to input type="file" is not supported')
					}
					else {
						var i, file, files = [];
						for(i = 0; file = this.files[i]; i++) {
							files.push(file);
						}
						return files.join(",");
					}
				}
				u.e.addEvent(iN, "keyup", this._updated);
				u.e.addEvent(iN, "change", this._changed);
			}
			this.activateField(iN);
			this.validate(iN);
		}
	}
	this._changed = function(event) {
		this.used = true;
		if(typeof(this.changed) == "function") {
			this.changed(this);
		}
		if(typeof(this.form.changed) == "function") {
			this.form.changed(this);
		}
	}
	this._updated = function(event) {
		if(event.keyCode != 9 && event.keyCode != 13 && event.keyCode != 16 && event.keyCode != 17 && event.keyCode != 18) {
			if(this.used || u.hc(this.field, "error")) {
				u.f.validate(this);
			}
			if(typeof(this.updated) == "function") {
				this.updated(this);
			}
			if(typeof(this.form.updated) == "function") {
				this.form.updated(this);
			}
		}
	}
	this._validate = function() {
		u.f.validate(this);
	}
	this._submit = function(event, iN) {
		for(name in this.fields) {
			if(this.fields[name].field) {
				this.fields[name].used = true;
				u.f.validate(this.fields[name]);
			}
		}
		if(u.qs(".field.error", this)) {
			if(typeof(this.validationFailed) == "function") {
				this.validationFailed();
			}
		}
		else {
			if(typeof(this.submitted) == "function") {
				this.submitted(iN);
			}
			else {
				this.submit();
			}
		}
	}
	this._focus = function(event) {
		this.field.focused = true;
		u.ac(this.field, "focus");
		u.ac(this, "focus");
		u.as(this.field, "zIndex", 99);
		if(this.field._help) {
			var f_h =  this.field.offsetHeight;
			var f_p_t = parseInt(u.gcs(this.field, "padding-top"));
			var f_p_b = parseInt(u.gcs(this.field, "padding-bottom"));
			var f_h_h = this.field._help.offsetHeight;
			u.as(this.field._help, "top", (((f_h - (f_p_t + f_p_b)) / 2) + 2) - (f_h_h / 2) + "px");
		}
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		if(typeof(this.form.focused) == "function") {
			this.form.focused(this);
		}
	}
	this._blur = function(event) {
		this.field.focused = false;
		u.rc(this.field, "focus");
		u.rc(this, "focus");
		u.as(this.field, "zIndex", 90);
		if(this.field._help) {
			u.as(this.field._help, "top", ((this.offsetTop + this.offsetHeight/2 + 2) - (this.field._help.offsetHeight/2)) + "px")
		}
		this.used = true;
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		if(typeof(this.form.blurred) == "function") {
			this.form.blurred(this);
		}
	}
	this._button_focus = function(event) {
		u.ac(this, "focus");
		if(typeof(this.focused) == "function") {
			this.focused();
		}
		if(typeof(this.form.focused) == "function") {
			this.form.focused(this);
		}
	}
	this._button_blur = function(event) {
		u.rc(this, "focus");
		if(typeof(this.blurred) == "function") {
			this.blurred();
		}
		if(typeof(this.form.blurred) == "function") {
			this.form.blurred(this);
		}
	}
	this._default_value_focus = function() {
		u.rc(this, "default");
		if(this.val() == this.default_value) {
			this.val("");
		}
	}
	this._default_value_blur = function() {
		if(this.val() == "") {
			u.ac(this, "default");
			this.val(this.default_value);
		}
	}
	this.activateField = function(iN) {
		u.e.addEvent(iN, "focus", this._focus);
		u.e.addEvent(iN, "blur", this._blur);
		u.e.addEvent(iN, "blur", this._validate);
		if(iN.form.labelstyle || u.hc(iN.form, "labelstyle:[a-z]+")) {
			iN.form.labelstyle = iN.form.labelstyle ? iN.form.labelstyle : u.cv(iN.form, "labelstyle");
			if(iN.form.labelstyle == "inject" && (!iN.type || !iN.type.match(/file|radio|checkbox/))) {
				iN.default_value = iN._label.innerHTML;
				u.e.addEvent(iN, "focus", this._default_value_focus);
				u.e.addEvent(iN, "blur", this._default_value_blur);
				if(iN.val() == "") {
					iN.val(iN.default_value);
					u.ac(iN, "default");
				}
			}
		}
	}
	this.activateButton = function(button) {
		u.e.addEvent(button, "focus", this._button_focus);
		u.e.addEvent(button, "blur", this._button_blur);
	}
 	this.isDefault = function(iN) {
		if(iN.default_value && iN.val() == iN.default_value) {
			return true;
		}
		return false;
	}
	this.fieldError = function(iN) {
		u.rc(iN, "correct");
		u.rc(iN.field, "correct");
		if(iN.used || !this.isDefault(iN) && iN.val()) {
			u.ac(iN, "error");
			u.ac(iN.field, "error");
			if(iN.field._help) {
				u.as(iN.field._help, "top", ((iN.offsetTop + iN.offsetHeight/2 + 2) - (iN.field._help.offsetHeight/2)) + "px")
			}
			if(typeof(iN.validationFailed) == "function") {
				iN.validationFailed();
			}
		}
	}
	this.fieldCorrect = function(iN) {
		if(!this.isDefault(iN) && iN.val()) {
			u.ac(iN, "correct");
			u.ac(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
		else {
			u.rc(iN, "correct");
			u.rc(iN.field, "correct");
			u.rc(iN, "error");
			u.rc(iN.field, "error");
		}
	}
	this.autoExpand = function(iN) {
		var current_height = parseInt(u.gcs(iN, "height"));
		var current_value = iN.val();
		iN.val("");
		u.as(iN, "overflow", "hidden");
		iN.autoexpand_offset = 0;
		if(parseInt(u.gcs(iN, "height")) != iN.scrollHeight) {
			iN.autoexpand_offset = iN.scrollHeight - parseInt(u.gcs(iN, "height"));
		}
		iN.val(current_value);
		iN.setHeight = function() {
			u.bug("iN.setHeight:" + u.nodeId(this));
			var textarea_height = parseInt(u.gcs(this, "height"));
			if(this.val()) {
				if(u.browser("webkit") || u.browser("firefox", ">=29")) {
					if(this.scrollHeight - this.autoexpand_offset > textarea_height) {
						u.a.setHeight(this, this.scrollHeight);
					}
				}
				else if(u.browser("opera") || u.browser("explorer")) {
					if(this.scrollHeight > textarea_height) {
						u.a.setHeight(this, this.scrollHeight);
					}
				}
				else {
					u.a.setHeight(this, this.scrollHeight);
				}
			}
		}
		u.e.addEvent(iN, "keyup", iN.setHeight);
		iN.setHeight();
	}
	this.geoLocation = function(field) {
		u.ac(field, "geolocation");
		var bn_geolocation = u.ae(field, "div", {"class":"geolocation"});
		bn_geolocation.field = field;
		u.ce(bn_geolocation);
		bn_geolocation.clicked = function() {
			window._geoLocationField = this.field;
			window._foundLocation = function(position) {
				var lat = position.coords.latitude;
				var lon = position.coords.longitude;
				var lat_input = u.qs("div.latitude input", window._geolocationField);
				var lon_input = u.qs("div.longitude input", window._geolocationField);
				lat_input.val(lat);
				lat_input.focus();
				lon_input.val(lon);
				lon_input.focus();
			}
			window._noLocation = function() {
				alert('Could not find location');
			}
			navigator.geolocation.getCurrentPosition(window._foundLocation, window._noLocation);
		}
	}
	this.validate = function(iN) {
		var min, max, pattern;
		var not_validated = true;
		if(!u.hc(iN.field, "required") && (iN.val() == "" || this.isDefault(iN))) {
			this.fieldCorrect(iN);
			return true;
		}
		else if(u.hc(iN.field, "required") && (iN.val() == "" || this.isDefault(iN))) {
			this.fieldError(iN);
			return false;
		}
		var custom_validate;
		for(custom_validate in u.f.customValidate) {
			if(u.hc(iN.field, custom_validate)) {
				u.f.customValidate[custom_validate](iN);
				not_validated = false;
			}
		}
		if(not_validated) {
			if(u.hc(iN.field, "password")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 8;
				max = max ? max : 20;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "number")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "integer")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 0;
				max = max ? max : 99999999999999999999999999999;
				pattern = iN.getAttribute("pattern");
				if(
					!isNaN(iN.val()) && 
					Math.round(iN.val()) == iN.val() && 
					iN.val() >= min && 
					iN.val() <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tel")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\+0-9\-\.\s\(\)]){5,18}$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "email")) {
				if(
					!pattern && iN.val().match(/^([^<>\\\/%$])+\@([^<>\\\/%$])+\.([^<>\\\/%$]{2,20})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "text")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 10000000;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min && 
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "select")) {
				if(iN.val()) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "checkbox|boolean|radio|radio_buttons")) {
				if(iN.val()) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "string")) {
				min = Number(u.cv(iN.field, "min"));
				max = Number(u.cv(iN.field, "max"));
				min = min ? min : 1;
				max = max ? max : 255;
				pattern = iN.getAttribute("pattern");
				if(
					iN.val().length >= min &&
					iN.val().length <= max && 
					(!pattern || iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "date")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2})$/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "datetime")) {
				pattern = iN.getAttribute("pattern");
				if(
					!pattern && iN.val().match(/^([\d]{4}[\-\/\ ]{1}[\d]{2}[\-\/\ ][\d]{2} [\d]{2}[\-\/\ \:]{1}[\d]{2}[\-\/\ \:]{0,1}[\d]{0,2})$/) ||
					(pattern && iN.val().match(pattern))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "tags")) {
				if(
					!pattern && iN.val().match(/\:/) ||
					(pattern && iN.val().match("^"+pattern+"$"))
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "prices")) {
				if(
					!isNaN(iN.val())
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
			else if(u.hc(iN.field, "location")) {
				if(u.hc(iN, "location")) {
					min = min ? min : 1;
					max = max ? max : 255;
					if(
						iN.val().length >= min &&
						iN.val().length <= max
					) {
						this.fieldCorrect(iN);
					}
					else {
						this.fieldError(iN);
					}
				}
				if(u.hc(iN, "latitude")) {
					min = min ? min : -90;
					max = max ? max : 90;
					if(
						!isNaN(iN.val()) && 
						iN.val() >= min && 
						iN.val() <= max
					) {
						this.fieldCorrect(iN);
					}
					else {
						this.fieldError(iN);
					}
				}
				if(u.hc(iN, "longitude")) {
					min = min ? min : -180;
					max = max ? max : 180;
					if(
						!isNaN(iN.val()) && 
						iN.val() >= min && 
						iN.val() <= max
					) {
						this.fieldCorrect(iN);
					}
					else {
						this.fieldError(iN);
					}
				}
				if(u.qsa(".correct", iN.field).length != 3) {
					u.rc(iN.field, "correct");
					u.ac(iN.field, "error");
				}
			}
			else if(u.hc(iN.field, "files")) {
				u.bug("files:" + iN.files.length);
				if(
					1
				) {
					this.fieldCorrect(iN);
				}
				else {
					this.fieldError(iN);
				}
			}
		}
		if(u.hc(iN.field, "error")) {
			return false;
		}
		else {
			return true;
		}
	}
	this.getParams = function(form, settings) {
		var send_as = "params";
		var ignore_inputs = "ignoreinput";
		if(typeof(settings) == "object") {
			var argument;
			for(argument in settings) {
				switch(argument) {
					case "ignore_inputs"	: ignore_inputs		= settings[argument]; break;
					case "send_as"			: send_as			= settings[argument]; break;
				}
			}
		}
		var i, input, select, textarea, param;
			var params = new Object();
		if(form._submit_button && form._submit_button.name) {
			params[form._submit_button.name] = form._submit_button.value;
		}
		var inputs = u.qsa("input", form);
		var selects = u.qsa("select", form)
		var textareas = u.qsa("textarea", form)
		for(i = 0; input = inputs[i]; i++) {
			if(!u.hc(input, ignore_inputs)) {
				if((input.type == "checkbox" || input.type == "radio") && input.checked) {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
				}
				else if(input.type == "file") {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
				}
				else if(!input.type.match(/button|submit|reset|file|checkbox|radio/i)) {
					if(!this.isDefault(input)) {
						params[input.name] = input.value;
					}
					else {
						params[input.name] = "";
					}
				}
			}
		}
		for(i = 0; select = selects[i]; i++) {
			if(!u.hc(select, ignore_inputs)) {
				if(!this.isDefault(select)) {
					params[select.name] = select.options[select.selectedIndex].value;
				}
			}
		}
		for(i = 0; textarea = textareas[i]; i++) {
			if(!u.hc(textarea, ignore_inputs)) {
				if(!this.isDefault(textarea)) {
					params[textarea.name] = textarea.value;
				}
				else {
					params[textarea.name] = "";
				}
			}
		}
		if(send_as && typeof(this.customSend[send_as]) == "function") {
			return this.customSend[send_as](params, form);
		}
		else if(send_as == "json") {
			return u.f.convertNamesToJsonObject(params);
		}
		else if(send_as == "object") {
			return params;
		}
		else {
			var string = "";
			for(param in params) {
					string += (string ? "&" : "") + param + "=" + encodeURIComponent(params[param]);
			}
			return string;
		}
	}
}
u.f.convertNamesToJsonObject = function(params) {
 	var indexes, root, indexes_exsists, param;
	var object = new Object();
	for(param in params) {
	 	indexes_exsists = param.match(/\[/);
		if(indexes_exsists) {
			root = param.split("[")[0];
			indexes = param.replace(root, "");
			if(typeof(object[root]) == "undefined") {
				object[root] = new Object();
			}
			object[root] = this.recurseName(object[root], indexes, params[param]);
		}
		else {
			object[param] = params[param];
		}
	}
	return object;
}
u.f.recurseName = function(object, indexes, value) {
	var index = indexes.match(/\[([a-zA-Z0-9\-\_]+)\]/);
	var current_index = index[1];
	indexes = indexes.replace(index[0], "");
 	if(indexes.match(/\[/)) {
		if(object.length !== undefined) {
			var i;
			var added = false;
			for(i = 0; i < object.length; i++) {
				for(exsiting_index in object[i]) {
					if(exsiting_index == current_index) {
						object[i][exsiting_index] = this.recurseName(object[i][exsiting_index], indexes, value);
						added = true;
					}
				}
			}
			if(!added) {
				temp = new Object();
				temp[current_index] = new Object();
				temp[current_index] = this.recurseName(temp[current_index], indexes, value);
				object.push(temp);
			}
		}
		else if(typeof(object[current_index]) != "undefined") {
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
		else {
			object[current_index] = new Object();
			object[current_index] = this.recurseName(object[current_index], indexes, value);
		}
	}
	else {
		object[current_index] = value;
	}
	return object;
}
u.f.addForm = function(node, settings) {
	var form_name = "js_form";
	var form_action = "#";
	var form_method = "post";
	var form_class = "";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "name"			: form_name				= settings[argument]; break;
				case "action"		: form_action			= settings[argument]; break;
				case "method"		: form_method			= settings[argument]; break;
				case "class"		: form_class			= settings[argument]; break;
			}
		}
	}
	var form = u.ae(node, "form", {"class":form_class, "name": form_name, "action":form_action, "method":form_method});
	return form;
}
u.f.addFieldset = function(node) {
	return u.ae(node, "fieldset");
}
u.f.addField = function(node, settings) {
	var field_type = "string";
	var field_label = "Value";
	var field_name = "js_name";
	var field_value = "";
	var field_class = "";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "type"			: field_type			= settings[argument]; break;
				case "label"		: field_label			= settings[argument]; break;
				case "name"			: field_name			= settings[argument]; break;
				case "value"		: field_value			= settings[argument]; break;
				case "class"		: field_class			= settings[argument]; break;
			}
		}
	}
	var input_id = "input_"+field_type+"_"+field_name;
	var field = u.ae(node, "div", {"class":"field "+field_type+" "+field_class});
	if(field_type == "string") {
		var label = u.ae(field, "label", {"for":input_id, "html":field_label});
		var input = u.ae(field, "input", {"id":input_id, "value":field_value, "name":field_name, "type":"text"});
	}
	else if(field_type == "email" || field_type == "number" || field_type == "tel") {
		var label = u.ae(field, "label", {"for":input_id, "html":field_label});
		var input = u.ae(field, "input", {"id":input_id, "value":field_value, "name":field_name, "type":field_type});
	}
	else if(field_type == "select") {
		u.bug("Select not implemented yet")
	}
	else {
		u.bug("input type not implemented yet")
	}
	return field;
}
u.f.addAction = function(node, settings) {
	var action_type = "submit";
	var action_name = "js_name";
	var action_value = "";
	var action_class = "";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "type"			: action_type			= settings[argument]; break;
				case "name"			: action_name			= settings[argument]; break;
				case "value"		: action_value			= settings[argument]; break;
				case "class"		: action_class			= settings[argument]; break;
			}
		}
	}
	var p_ul = node.nodeName.toLowerCase() == "ul" ? node : u.pn(node, "ul");
	if(!u.hc(p_ul, "actions")) {
		p_ul = u.ae(node, "ul", {"class":"actions"});
	}
	var p_li = node.nodeName.toLowerCase() == "li" ? node : u.pn(node, "li");
	if(p_ul != p_li.parentNode) {
		p_li = u.ae(p_ul, "li", {"class":action_name});
	}
	else {
		p_li = node;
	}
	var action = u.ae(p_li, "input", {"type":action_type, "class":action_class, "value":action_value, "name":action_name})
	return action;
}
Util.absoluteX = u.absX = function(node) {
	if(node.offsetParent) {
		return node.offsetLeft + u.absX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.absoluteY = u.absY = function(node) {
	if(node.offsetParent) {
		return node.offsetTop + u.absY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.relativeX = u.relX = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetLeft + u.relX(node.offsetParent);
	}
	return node.offsetLeft;
}
Util.relativeY = u.relY = function(node) {
	if(u.gcs(node, "position").match(/absolute/) == null && node.offsetParent && u.gcs(node.offsetParent, "position").match(/relative|absolute|fixed/) == null) {
		return node.offsetTop + u.relY(node.offsetParent);
	}
	return node.offsetTop;
}
Util.actualWidth = u.actualW = function(node) {
	return parseInt(u.gcs(node, "width"));
}
Util.actualHeight = u.actualH = function(node) {
	return parseInt(u.gcs(node, "height"));
}
Util.eventX = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageX : event.pageX);
}
Util.eventY = function(event){
	return (event.targetTouches ? event.targetTouches[0].pageY : event.pageY);
}
Util.browserWidth = u.browserW = function() {
	return document.documentElement.clientWidth;
}
Util.browserHeight = u.browserH = function() {
	return document.documentElement.clientHeight;
}
Util.htmlWidth = u.htmlW = function() {
	return document.body.offsetWidth + parseInt(u.gcs(document.body, "margin-left")) + parseInt(u.gcs(document.body, "margin-right"));
}
Util.htmlHeight = u.htmlH = function() {
	return document.body.offsetHeight + parseInt(u.gcs(document.body, "margin-top")) + parseInt(u.gcs(document.body, "margin-bottom"));
}
Util.pageScrollX = u.scrollX = function() {
	return window.pageXOffset;
}
Util.pageScrollY = u.scrollY = function() {
	return window.pageYOffset;
}
Util.History = u.h = new function() {
	this.popstate = ("onpopstate" in window);
	this.catchEvent = function(node, callback) {
		this.node = node;
		this.node.callback = callback;
		var hashChanged = function(event) {
			if(!location.hash || !location.hash.match(/^#\//)) {
				location.hash = "#/"
				return;
			}
			var url = u.h.getCleanHash(location.hash);
			u.h.node.callback(url);
		}
		var urlChanged = function(event) {
			var url = u.h.getCleanUrl(location.href);
			u.h.node.callback(url);
		}
		if(this.popstate) {
			window.onpopstate = urlChanged;
		}
		else if("onhashchange" in window && !u.browser("explorer", "<=7")) {
			window.onhashchange = hashChanged;
		}
		else {
			u.current_hash = window.location.hash;
			window.onhashchange = hashChanged;
			setInterval(
				function() {
					if(window.location.hash !== u.current_hash) {
						u.current_hash = window.location.hash;
						window.onhashchange();
					}
				}, 200
			);
		}
	}
	this.getCleanUrl = function(string, levels) {
		string = string.replace(location.protocol+"//"+document.domain, "").match(/[^#$]+/)[0];
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var path = string.split("/");
			levels = levels > path.length-1 ? path.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + path[i];
			}
			return return_string;
		}
	}
	this.getCleanHash = function(string, levels) {
		string = string.replace("#", "");
		if(!levels) {
			return string;
		}
		else {
			var i, return_string = "";
			var hash = string.split("/");
			levels = levels > hash.length-1 ? hash.length-1 : levels;
			for(i = 1; i <= levels; i++) {
				return_string += "/" + hash[i];
			}
			return return_string;
		}
	}
}
Util.Objects = u.o = new Object();
Util.init = function(scope) {
	var i, node, nodes, object;
	scope = scope && scope.nodeName ? scope : document;
	nodes = u.ges("i\:([_a-zA-Z0-9])+");
	for(i = 0; node = nodes[i]; i++) {
		while((object = u.cv(node, "i"))) {
			u.rc(node, "i:"+object);
			if(object && typeof(u.o[object]) == "object") {
				u.o[object].init(node);
			}
		}
	}
}
Util.random = function(min, max) {
	return Math.round((Math.random() * (max - min)) + min);
}
Util.numToHex = function(num) {
	return num.toString(16);
}
Util.hexToNum = function(hex) {
	return parseInt(hex,16);
}
Util.round = function(number, decimals) {
	var round_number = number*Math.pow(10, decimals);
	return Math.round(round_number)/Math.pow(10, decimals);
}
u.navigation = function(options) {
	page._nav_path = page._nav_path ? page._nav_path : u.h.getCleanUrl(location.href, 1);
	page._nav_history = page._nav_history ? page._nav_history : [];
	page._navigate = function(url) {
		url = u.h.getCleanUrl(url);
		page._nav_history.unshift(url);
		u.stats.pageView(url);
		if(!this._nav_path || ((this._nav_path != u.h.getCleanHash(location.hash, 1) && !u.h.popstate) || (this._nav_path != u.h.getCleanUrl(location.href, 1) && u.h.popstate))) {
			if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		else {
			if(this.cN.scene && this.cN.scene.parentNode && typeof(this.cN.scene.navigate) == "function") {
				this.cN.scene.navigate(url);
			}
			else if(this.cN && typeof(this.cN.navigate) == "function") {
				this.cN.navigate(url);
			}
		}
		if(!u.h.popstate) {
			this._nav_path = u.h.getCleanHash(location.hash, 1);
		}
		else {
			this._nav_path = u.h.getCleanUrl(location.href, 1);
		}
	}
	page.navigate = function(url, node) {
		this.history_node = node ? node : false;
		if(u.h.popstate) {
			history.pushState({}, url, url);
			page._navigate(url);
		}
		else {
			location.hash = u.h.getCleanUrl(url);
		}
	}
	if(location.hash.length && location.hash.match(/^#!/)) {
		location.hash = location.hash.replace(/!/, "");
	}
	if(!u.h.popstate) {
		if(location.hash.length < 2) {
			page.navigate(location.href, page);
			page._nav_path = u.h.getCleanUrl(location.href);
			u.init(page.cN);
		}
		else if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href) && location.hash.match(/^#\//)) {
			page._nav_path = u.h.getCleanUrl(location.href);
			page._navigate();
		}
		else {
			u.init(page.cN);
		}
	}
	else {
		if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href) && location.hash.match(/^#\//)) {
			page._nav_path = u.h.getCleanHash(location.hash);
			page.navigate(u.h.getCleanHash(location.hash), page);
		}
		else {
			u.init(page.cN);
		}
	}
	page._initHistory = function() {
		u.h.catchEvent(page, page._navigate);
	}
	u.t.setTimer(page, page._initHistory, 100);
	page.historyBack = function() {
		if(this._nav_history.length > 1) {
			this._nav_history.shift();
			return this._nav_history.shift();
		}
		else {
			return "/";
		}
	}
}
Util.period = function(format, time) {
	var seconds = 0;
	if(typeof(time) == "object") {
		var argument;
		for(argument in time) {
			switch(argument) {
				case "seconds"		: seconds = time[argument]; break;
				case "milliseconds" : seconds = Number(time[argument])/1000; break;
				case "minutes"		: seconds = Number(time[argument])*60; break;
				case "hours"		: seconds = Number(time[argument])*60*60 ; break;
				case "days"			: seconds = Number(time[argument])*60*60*24; break;
				case "months"		: seconds = Number(time[argument])*60*60*24*(365/12); break;
				case "years"		: seconds = Number(time[argument])*60*60*24*365; break;
			}
		}
	}
	var tokens = /y|n|o|O|w|W|c|d|e|D|g|h|H|l|m|M|r|s|S|t|T|u|U/g;
	var chars = new Object();
	chars.y = 0; 
	chars.n = 0; 
	chars.o = (chars.n > 9 ? "" : "0") + chars.n; 
	chars.O = 0; 
	chars.w = 0; 
	chars.W = 0; 
	chars.c = 0; 
	chars.d = 0; 
	chars.e = 0; 
	chars.D = Math.floor(((seconds/60)/60)/24);
	chars.g = Math.floor((seconds/60)/60)%24;
	chars.h = (chars.g > 9 ? "" : "0") + chars.g;
	chars.H = Math.floor((seconds/60)/60);
	chars.l = Math.floor(seconds/60)%60;
	chars.m = (chars.l > 9 ? "" : "0") + chars.l;
	chars.M = Math.floor(seconds/60);
	chars.r = Math.floor(seconds)%60;
	chars.s = (chars.r > 9 ? "" : "0") + chars.r;
	chars.S = Math.floor(seconds);
	chars.t = Math.round((seconds%1)*10);
	chars.T = Math.round((seconds%1)*100);
	chars.T = (chars.T > 9 ? "": "0") + Math.round(chars.T);
	chars.u = Math.round((seconds%1)*1000);
	chars.u = (chars.u > 9 ? chars.u > 99 ? "" : "0" : "00") + Math.round(chars.u);
	chars.U = Math.round(seconds*1000);
	return format.replace(tokens, function (_) {
		return _ in chars ? chars[_] : _.slice(1, _.length - 1);
	});
};
u.preloader = function(node, files, options) {
	var callback, callback_min_delay
	if(typeof(options) == "object") {
		var argument;
		for(argument in options) {
			switch(argument) {
				case "callback"				: callback				= options[argument]; break;
				case "callback_min_delay"	: callback_min_delay	= options[argument]; break;
			}
		}
	}
	if(!u._preloader_queue) {
		u._preloader_queue = document.createElement("div");
		u._preloader_processes = 0;
		if(u.e && u.e.event_pref == "touch") {
			u._preloader_max_processes = 1;
		}
		else {
			u._preloader_max_processes = 1;
		}
	}
	if(node && files) {
		var entry, file;
		var new_queue = u.ae(u._preloader_queue, "ul");
		new_queue._callback = callback;
		new_queue._node = node;
		new_queue._files = files;
		new_queue.nodes = new Array();
		new_queue._start_time = new Date().getTime();
		for(i = 0; file = files[i]; i++) {
			entry = u.ae(new_queue, "li", {"class":"waiting"});
			entry.i = i;
			entry._queue = new_queue
			entry._file = file;
		}
		u.ac(node, "waiting");
		if(typeof(node.waiting) == "function") {
			node.waiting();
		}
	}
	u._queueLoader();
	return u._preloader_queue;
}
u._queueLoader = function() {
	if(u.qs("li.waiting", u._preloader_queue)) {
		while(u._preloader_processes < u._preloader_max_processes) {
			var next = u.qs("li.waiting", u._preloader_queue);
			if(next) {
				if(u.hc(next._queue._node, "waiting")) {
					u.rc(next._queue._node, "waiting");
					u.ac(next._queue._node, "loading");
					if(typeof(next._queue._node.loading) == "function") {
						next._node._queue.loading();
					}
				}
				u._preloader_processes++;
				u.rc(next, "waiting");
				u.ac(next, "loading");
				next.loaded = function(event) {
					this.image = event.target;
					this._image = this.image;
					this._queue.nodes[this.i] = this;
					u.rc(this, "loading");
					u.ac(this, "loaded");
					u._preloader_processes--;
					if(!u.qs("li.waiting,li.loading", this._queue)) {
						u.rc(this._queue._node, "loading");
						if(typeof(this._queue._callback) == "function") {
							this._queue._node._callback = this._queue._callback;
							this._queue._node._callback(this._queue.nodes);
						}
						else if(typeof(this._queue._node.loaded) == "function") {
							this._queue._node.loaded(this._queue.nodes);
						}
					}
					u._queueLoader();
				}
				u.loadImage(next, next._file);
			}
			else {
				break
			}
		}
	}
}
u.loadImage = function(node, src) {
	var image = new Image();
	image.node = node;
	u.ac(node, "loading");
    u.e.addEvent(image, 'load', u._imageLoaded);
	u.e.addEvent(image, 'error', u._imageLoadError);
	image.src = src;
}
u._imageLoaded = function(event) {
	u.rc(this.node, "loading");
	if(typeof(this.node.loaded) == "function") {
		this.node.loaded(event);
	}
}
u._imageLoadError = function(event) {
	u.rc(this.node, "loading");
	u.ac(this.node, "error");
	if(typeof(this.node.loaded) == "function" && typeof(this.node.failed) != "function") {
		this.node.loaded(event);
	}
	else if(typeof(this.node.failed) == "function") {
		this.node.failed(event);
	}
}
u._imageLoadProgress = function(event) {
	u.bug("progress")
	if(typeof(this.node.progress) == "function") {
		this.node.progress(event);
	}
}
u._imageLoadDebug = function(event) {
	u.bug("event:" + event.type);
	u.xInObject(event);
}
Util.createRequestObject = u.createRequestObject = function() {
	return new XMLHttpRequest();
}
Util.request = u.request = function(node, url, settings) {
	var request_id = u.randomString(6);
	node[request_id] = {};
	node[request_id].request_url = url;
	node[request_id].request_method = "GET";
	node[request_id].request_async = true;
	node[request_id].request_params = "";
	node[request_id].request_headers = false;
	node[request_id].response_callback = "response";
	if(typeof(settings) == "object") {
		var argument;
		for(argument in settings) {
			switch(argument) {
				case "method"		: node[request_id].request_method		= settings[argument]; break;
				case "params"		: node[request_id].request_params		= settings[argument]; break;
				case "async"		: node[request_id].request_async		= settings[argument]; break;
				case "headers"		: node[request_id].request_headers		= settings[argument]; break;
				case "callback"		: node[request_id].response_callback	= settings[argument]; break;
			}
		}
	}
	if(node[request_id].request_method.match(/GET|POST|PUT|PATCH/i)) {
		node[request_id].HTTPRequest = this.createRequestObject();
		node[request_id].HTTPRequest.node = node;
		node[request_id].HTTPRequest.request_id = request_id;
		if(node[request_id].request_async) {
			node[request_id].HTTPRequest.onreadystatechange = function() {
				if(this.readyState == 4) {
					u.validateResponse(this);
				}
			}
		}
		try {
			if(node[request_id].request_method.match(/GET/i)) {
				var params = u.JSONtoParams(node[request_id].request_params);
				node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node[request_id].HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node[request_id].request_headers) == "object") {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send("");
			}
			else if(node[request_id].request_method.match(/POST|PUT|PATCH/i)) {
				var params;
				if(typeof(node[request_id].request_params) == "object" && !node[request_id].request_params.constructor.toString().match(/FormData/i)) {
					params = JSON.stringify(node[request_id].request_params);
				}
				else {
					params = node[request_id].request_params;
				}
				node[request_id].HTTPRequest.open(node[request_id].request_method, node[request_id].request_url, node[request_id].request_async);
				node[request_id].HTTPRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				var csfr_field = u.qs('meta[name="csrf-token"]');
				if(csfr_field && csfr_field.content) {
					node[request_id].HTTPRequest.setRequestHeader("X-CSRF-Token", csfr_field.content);
				}
				if(typeof(node[request_id].request_headers) == "object") {
					var header;
					for(header in node[request_id].request_headers) {
						node[request_id].HTTPRequest.setRequestHeader(header, node[request_id].request_headers[header]);
					}
				}
				node[request_id].HTTPRequest.send(params);
			}
		}
		catch(exception) {
			node[request_id].HTTPRequest.exception = exception;
			u.validateResponse(node[request_id].HTTPRequest);
			return;
		}
		if(!node[request_id].request_async) {
			u.validateResponse(node[request_id].HTTPRequest);
		}
	}
	else if(node[request_id].request_method.match(/SCRIPT/i)) {
		var key = u.randomString();
		document[key] = new Object();
		document[key].node = node;
		document[key].request_id = request_id;
		document[key].responder = function(response) {
			var response_object = new Object();
			response_object.node = this.node;
			response_object.request_id = this.request_id;
			response_object.responseText = response;
			u.validateResponse(response_object);
		}
		var params = u.JSONtoParams(node[request_id].request_params);
		node[request_id].request_url += params ? ((!node[request_id].request_url.match(/\?/g) ? "?" : "&") + params) : "";
		node[request_id].request_url += (!node[request_id].request_url.match(/\?/g) ? "?" : "&") + "callback=document."+key+".responder";
		u.ae(u.qs("head"), "script", ({"type":"text/javascript", "src":node[request_id].request_url}));
	}
	return request_id;
}
Util.JSONtoParams = function(json) {
	if(typeof(json) == "object") {
		var params = "", param;
		for(param in json) {
			params += (params ? "&" : "") + param + "=" + json[param];
		}
		return params
	}
	var object = u.isStringJSON(json);
	if(object) {
		return u.JSONtoParams(object);
	}
	return json;
}
Util.isStringJSON = function(string) {
	if(string.trim().substr(0, 1).match(/[\{\[]/i) && string.trim().substr(-1, 1).match(/[\}\]]/i)) {
		try {
			var test = JSON.parse(string);
			if(typeof(test) == "object") {
				test.isJSON = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.isStringHTML = function(string) {
	if(string.trim().substr(0, 1).match(/[\<]/i) && string.trim().substr(-1, 1).match(/[\>]/i)) {
		try {
			var test = document.createElement("div");
			test.innerHTML = string;
			if(test.childNodes.length) {
				var body_class = string.match(/<body class="([a-z0-9A-Z_: ]+)"/);
				test.body_class = body_class ? body_class[1] : "";
				var head_title = string.match(/<title>([^$]+)<\/title>/);
				test.head_title = head_title ? head_title[1] : "";
				test.isHTML = true;
				return test;
			}
		}
		catch(exception) {}
	}
	return false;
}
Util.evaluateResponseText = function(responseText) {
	var object;
	if(typeof(responseText) == "object") {
		responseText.isJSON = true;
		return responseText;
	}
	else {
		var response_string;
		if(responseText.trim().substr(0, 1).match(/[\"\']/i) && responseText.trim().substr(-1, 1).match(/[\"\']/i)) {
			response_string = responseText.trim().substr(1, responseText.trim().length-2);
		}
		else {
			response_string = responseText;
		}
		var json = u.isStringJSON(response_string);
		if(json) {
			return json;
		}
		var html = u.isStringHTML(response_string);
		if(html) {
			return html;
		}
		return responseText;
	}
}
Util.validateResponse = function(response){
	var object = false;
	if(response) {
		try {
			if(response.status && !response.status.toString().match(/403|404|500/)) {
				object = u.evaluateResponseText(response.responseText);
			}
			else if(response.responseText) {
				object = u.evaluateResponseText(response.responseText);
			}
		}
		catch(exception) {
			response.exception = exception;
		}
	}
	if(object) {
		if(typeof(response.node[response.node[response.request_id].response_callback]) == "function") {
			response.node[response.node[response.request_id].response_callback](object, response.request_id);
		}
	}
	else {
		if(typeof(response.node.ResponseError) == "function") {
			response.node.ResponseError(response);
		}
		if(typeof(response.node.responseError) == "function") {
			response.node.responseError(response);
		}
	}
}
Util.cutString = function(string, length) {
	var matches, match, i;
	if(string.length <= length) {
		return string;
	}
	else {
		length = length-3;
	}
	matches = string.match(/\&[\w\d]+\;/g);
	if(matches) {
		for(i = 0; match = matches[i]; i++){
			if(string.indexOf(match) < length){
				length += match.length-1;
			}
		}
	}
	return string.substring(0, length) + (string.length > length ? "..." : "");
}
Util.prefix = function(string, length, prefix) {
	string = string.toString();
	prefix = prefix ? prefix : "0";
	while(string.length < length) {
		string = prefix + string;
	}
	return string;
}
Util.randomString = function(length) {
	var key = "", i;
	length = length ? length : 8;
	var pattern = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
	for(i = 0; i < length; i++) {
		key += pattern[u.random(0,35)];
	}
	return key;
}
Util.uuid = function() {
	var chars = '0123456789abcdef'.split('');
	var uuid = [], rnd = Math.random, r, i;
	uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	uuid[14] = '4';
	for(i = 0; i < 36; i++) {
		if(!uuid[i]) {
			r = 0 | rnd()*16;
			uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
		}
 	}
	return uuid.join('');
}
Util.stringOr = u.eitherOr = function(value, replacement) {
	if(value !== undefined && value !== null) {
		return value;
	}
	else {
		return replacement ? replacement : "";
	}	
}
Util.browser = function(model, version) {
	var current_version = false;
	if(model.match(/\bexplorer\b|\bie\b/i)) {
		if(window.ActiveXObject && navigator.userAgent.match(/(MSIE )(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/(MSIE )(\d+.\d)/i)[2];
		}
		else if(navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)) {
			current_version = navigator.userAgent.match(/Trident\/[\d+]\.\d[^$]+rv:(\d+.\d)/i)[1];
		}
	}
	else if(model.match(/\bfirefox\b|\bgecko\b/i)) {
		if(window.navigator.mozIsLocallyAvailable) {
			current_version = navigator.userAgent.match(/(Firefox\/)(\d+\.\d+)/i)[2];
		}
	}
	else if(model.match(/\bwebkit\b/i)) {
		if(document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(AppleWebKit\/)(\d+.\d)/i)[2];
		}
	}
	else if(model.match(/\bchrome\b/i)) {
		if(window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Chrome\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bsafari\b/i)) {
		if(!window.chrome && document.body.style.webkitTransform != undefined) {
			current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
		}
	}
	else if(model.match(/\bopera\b/i)) {
		if(window.opera) {
			if(navigator.userAgent.match(/Version\//)) {
				current_version = navigator.userAgent.match(/(Version\/)(\d+)(.\d)/i)[2];
			}
			else {
				current_version = navigator.userAgent.match(/(Opera[\/ ]{1})(\d+)(.\d)/i)[2];
			}
		}
	}
	if(current_version) {
		if(!version) {
			return current_version;
		}
		else {
			if(!isNaN(version)) {
				return current_version == version;
			}
			else {
				return eval(current_version + version);
			}
		}
	}
	else {
		return false;
	}
}
Util.segment = function(segment) {
	if(!u.current_segment) {
		var scripts = document.getElementsByTagName("script");
		var script, i, src;
		for(i = 0; script = scripts[i]; i++) {
			seg_src = script.src.match(/\/seg_([a-z_]+)/);
			if(seg_src) {
				u.current_segment = seg_src[1];
			}
		}
	}
	if(segment) {
		return segment == u.current_segment;
	}
	return u.current_segment;
}
Util.system = function(os, version) {
}
Util.support = function(property) {
	if(document.documentElement) {
		property = property.replace(/(-\w)/g, function(word){return word.replace(/-/, "").toUpperCase()});
		return property in document.documentElement.style;
	}
	return false;
}
Util.windows = function() {
	return (navigator.userAgent.indexOf("Windows") >= 0) ? true : false;
}
Util.osx = function() {
	return (navigator.userAgent.indexOf("OS X") >= 0) ? true : false;
}
Util.Timer = u.t = new function() {
	this._timers = new Array();
	this.setTimer = function(node, action, timeout) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_t":setTimeout("u.t._executeTimer("+id+")", timeout)};
		return id;
	}
	this.resetTimer = function(id) {
		if(this._timers[id]) {
			clearTimeout(this._timers[id]._t);
			this._timers[id] = false;
		}
	}
	this._executeTimer = function(id) {
		var node = this._timers[id]._n;
		node._timer_action = this._timers[id]._a;
		node._timer_action();
		node._timer_action = null;
		this._timers[id] = false;
	}
	this.setInterval = function(node, action, interval) {
		var id = this._timers.length;
		this._timers[id] = {"_a":action, "_n":node, "_i":setInterval("u.t._executeInterval("+id+")", interval)};
		return id;
	}
	this.resetInterval = function(id) {
		if(this._timers[id]) {
			clearInterval(this._timers[id]._i);
			this._timers[id] = false;
		}
	}
	this._executeInterval = function(id) {
		var node = this._timers[id]._n;
		node._interval_action = this._timers[id]._a;
		node._interval_action();
		node._timer_action = null;
	}
	this.valid = function(id) {
		return this._timers[id] ? true : false;
	}
	this.resetAllTimers = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._t) {
				this.resetTimer(i);
			}
		}
	}
	this.resetAllIntervals = function() {
		var i, t;
		for(i = 0; i < this._timers.length; i++) {
			if(this._timers[i] && this._timers[i]._i) {
				this.resetInterval(i);
			}
		}
	}
}
Util.getVar = function(param, url) {
	var string = url ? url.split("#")[0] : location.search;
	var regexp = new RegExp("[\&\?\b]{1}"+param+"\=([^\&\b]+)");
	var match = string.match(regexp);
	if(match && match.length > 1) {
		return match[1];
	}
	else {
		return "";
	}
}


/*beta-u-textscaler.js*/
u.textscaler = function(node, settings) {
	if(typeof(settings) != "object") {
		settings = {
			"*":{
				"unit":"rem",
				"min_size":1,
				"min_width":200,
				"max_size":40,
				"max_width":3000
			}
		};
	}
	node.text_key = u.randomString(8);
	u.ac(node, node.text_key);
	node.text_settings = JSON.parse(JSON.stringify(settings));
	node.scaleText = function() {
		var tag;
		for(tag in this.text_settings) {
			var settings = this.text_settings[tag];
			if(settings.min_width <= window._man_text._width && settings.max_width >= window._man_text._width) {
				var font_size = settings.min_size + (settings.size_factor * (window._man_text._width - settings.min_width) / settings.width_factor);
				settings.css_rule.style.setProperty("font-size", font_size + settings.unit, "important");
			}
			else if(settings.max_width < window._man_text._width) {
				settings.css_rule.style.setProperty("font-size", settings.max_size + settings.unit, "important");
			}
			else if(settings.min_width > window._man_text._width) {
				settings.css_rule.style.setProperty("font-size", settings.min_size + settings.unit, "important");
			}
		}
	}
	node.cancelTextScaling = function() {
		u.e.removeEvent(window, "resize", window._man_text.scale);
	}
	if(!window._man_text) {
		var man_text = {};
		man_text.nodes = [];
		var style_tag = document.createElement("style");
		style_tag.setAttribute("media", "all")
		style_tag.setAttribute("type", "text/css")
		man_text.style_tag = u.ae(document.head, style_tag);
		man_text.style_tag.appendChild(document.createTextNode(""))
		window._man_text = man_text;
		window._man_text._width = u.browserW();
		window._man_text.scale = function() {
			window._man_text._width = u.browserW();
			var i, node;
			for(i = 0; node = window._man_text.nodes[i]; i++) {
				if(node.parentNode) { 
					node.scaleText();
				}
				else {
					window._man_text.nodes.splice(window._man_text.nodes.indexOf(node), 1);
					if(!window._man_text.nodes.length) {
						u.e.removeEvent(window, "resize", window._man_text.scale);
					}
				}
			}
		}
		u.e.addEvent(window, "resize", window._man_text.scale);
		window._man_text.precalculate = function() {
			var i, node, tag;
			for(i = 0; node = window._man_text.nodes[i]; i++) {
				if(node.parentNode) { 
					var settings = node.text_settings;
					for(tag in settings) {
						settings[tag].width_factor = settings[tag].max_width-settings[tag].min_width;
						settings[tag].size_factor = settings[tag].max_size-settings[tag].min_size;
					}
				}
			}
		}
	}
	var tag;
	for(tag in node.text_settings) {
		selector = "."+node.text_key + ' ' + tag + ' ';
		node.css_rules_index = window._man_text.style_tag.sheet.insertRule(selector+'{}', 0);
		node.text_settings[tag].css_rule = window._man_text.style_tag.sheet.cssRules[0];
	}
	window._man_text.nodes.push(node);
	window._man_text.precalculate();
	node.scaleText();
}

/*beta-u-video.js*/
Util.videoPlayer = function(_options) {
	var player;
	// 
		player = document.createElement("div");
		u.ac(player, "videoplayer");
	player.ff_skip = 2;
	player.rw_skip = 2;
	player._default_playpause = false;
	player._default_zoom = false;
	player._default_volume = false;
	player._default_search = false;
	if(typeof(_options) == "object") {
		var argument;
		for(argument in _options) {
			switch(argument) {
				case "playpause"	: player._default_playpause		= _options[argument]; break;
			}
		}
	}
	player.flash = false;
	player.video = u.ae(player, "video");
	if(typeof(player.video.play) == "function") {
		player.load = function(src, _options) {
			player._controls_playpause = player._default_playpause;
			player._controls_zoom = player._default_zoom;
			player._controls_volume = player._default_volume;
			player._controls_search = player._default_search;
			if(typeof(_options) == "object") {
				var argument;
				for(argument in _options) {
					switch(argument) {
						case "playpause"	: player._controls_playpause	= _options[argument]; break;
					}
				}
			}
			this.setup();
			if(this.className.match("/playing/")) {
				this.stop();
			}
			if(src) {
				this.video.src = this.correctSource(src);
				this.video.load();
				this.video.controls = false;
			}
		}
		player.play = function(position) {
			if(this.video.currentTime && position !== undefined) {
				this.video.currentTime = position;
			}
			if(this.video.src) {
				this.video.play();
			}
		}
		player.loadAndPlay = function(src, _options) {
			var position = 0;
			if(typeof(_options) == "object") {
				var argument;
				for(argument in _options) {
					switch(argument) {
						case "position"		: position		= _options[argument]; break;
					}
				}
			}
			this.load(src, _options);
			this.play(position);
		}
		player.pause = function() {
			this.video.pause();
		}
		player.stop = function() {
			this.video.pause();
			if(this.video.currentTime) {
				this.video.currentTime = 0;
			}
		}
		player.ff = function() {
			if(this.video.src && this.video.currentTime && this.videoLoaded) {
				this.video.currentTime = (this.video.duration - this.video.currentTime >= this.ff_skip) ? (this.video.currentTime + this.ff_skip) : this.video.duration;
				this.video._timeupdate();
			}
		}
		player.rw = function() {
			if(this.video.src && this.video.currentTime && this.videoLoaded) {
				this.video.currentTime = (this.video.currentTime >= this.rw_skip) ? (this.video.currentTime - this.rw_skip) : 0;
				this.video._timeupdate();
			}
		}
		player.togglePlay = function() {
			if(this.className.match(/playing/g)) {
				this.pause();
			}
			else {
				this.play();
			}
		}
		player.setup = function() {
			if(u.qs("video", this)) {
				var video = this.removeChild(this.video);
			}
			this.video = u.ie(this, "video");
			this.video.player = this;
			this.setControls();
			this.currentTime = 0;
			this.duration = 0;
			this.videoLoaded = false;
			this.metaLoaded = false;
			this.video._loadstart = function(event) {
				u.ac(this.player, "loading");
				if(typeof(this.player.loading) == "function") {
					this.player.loading(event);
				}
			}
			u.e.addEvent(this.video, "loadstart", this._loadstart);
			this.video._canplaythrough = function(event) {
				u.rc(this.player, "loading");
				if(typeof(this.player.canplaythrough) == "function") {
					this.player.canplaythrough(event);
				}
			}
			u.e.addEvent(this.video, "canplaythrough", this.video._canplaythrough);
			this.video._playing = function(event) {
				u.rc(this.player, "loading|paused");
				u.ac(this.player, "playing");
				if(typeof(this.player.playing) == "function") {
					this.player.playing(event);
				}
			}
			u.e.addEvent(this.video, "playing", this.video._playing);
			this.video._paused = function(event) {
				u.rc(this.player, "playing|loading");
				u.ac(this.player, "paused");
				if(typeof(this.player.paused) == "function") {
					this.player.paused(event);
				}
			}
			u.e.addEvent(this.video, "pause", this.video._paused);
			this.video._stalled = function(event) {
				u.rc(this.player, "playing|paused");
				u.ac(this.player, "loading");
				if(typeof(this.player.stalled) == "function") {
					this.player.stalled(event);
				}
			}
			u.e.addEvent(this.video, "stalled", this.video._paused);
			this.video._ended = function(event) {
				u.rc(this.player, "playing|paused");
				if(typeof(this.player.ended) == "function") {
					this.player.ended(event);
				}
			}
			u.e.addEvent(this.video, "ended", this.video._ended);
			this.video._loadedmetadata = function(event) {
				this.player.duration = this.duration;
				this.player.currentTime = this.currentTime;
				this.player.metaLoaded = true;
				if(typeof(this.player.loadedmetadata) == "function") {
					this.player.loadedmetadata(event);
				}
			}
			u.e.addEvent(this.video, "loadedmetadata", this.video._loadedmetadata);
			this.video._loadeddata = function(event) {
				this.player.videoLoaded = true;
				if(typeof(this.player.loadeddata) == "function") {
					this.player.loadeddata(event);
				}
			}
			u.e.addEvent(this.video, "loadeddata", this.video._loadeddata);
			this.video._timeupdate = function(event) {
				this.player.currentTime = this.currentTime;
				if(typeof(this.player.timeupdate) == "function") {
					this.player.timeupdate(event);
				}
			}
			u.e.addEvent(this.video, "timeupdate", this.video._timeupdate);
		}
	}
	else if(typeof(u.videoPlayerFallback) == "function") {
		player.removeChild(player.video);
		player = u.videoPlayerFallback(player);
	}
	player.correctSource = function(src) {
		src = src.replace(/\?[^$]+/, "");
		src = src.replace(/\.m4v|\.mp4|\.webm|\.ogv|\.3gp|\.mov/, "");
		if(this.flash) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/mp4")) {
			return src+".mp4";
		}
		else if(this.video.canPlayType("video/ogg")) {
			return src+".ogv";
		}
		else if(this.video.canPlayType("video/3gpp")) {
			return src+".3gp";
		}
		else {
			return src+".mov";
		}
	}
	player.setControls = function() {
		if(this.showControls) {
			u.e.removeEvent(this, "mousemove", this.showControls);
		}
		if(this._controls_playpause || this._controls_zoom || this._controls_volume || this._controls_search) {
			if(!this.controls) {
				this.controls = u.ae(this, "div", {"class":"controls"});
				this.hideControls = function() {
					this.t_controls = u.t.resetTimer(this.t_controls);
					u.a.transition(this.controls, "all 0.3s ease-out");
					u.a.setOpacity(this.controls, 0);
				}
				this.showControls = function() {
					if(this.t_controls) {
						this.t_controls = u.t.resetTimer(this.t_controls);
					}
					else {
						u.a.transition(this.controls, "all 0.5s ease-out");
						u.a.setOpacity(this.controls, 1);
					}
					this.t_controls = u.t.setTimer(this, this.hideControls, 1500);
				}
			}
			else {
				u.as(this.controls, "display", "block");
			}
			if(this._controls_playpause) {
				if(!this.controls.playpause) {
					this.controls.playpause = u.ae(this.controls, "a", {"class":"playpause"});
					this.controls.playpause.player = this;
					u.e.click(this.controls.playpause);
					this.controls.playpause.clicked = function(event) {
						this.player.togglePlay();
					}
				}
				else {
					u.as(this.controls.playpause, "display", "block");
				}
			}
			else if(this.controls.playpause) {
				u.as(this.controls.playpause, "display", "none");
			}
			if(this._controls_zoom && !this.controls.zoom) {}
			else if(this.controls.zoom) {}
			if(this._controls_volume && !this.controls.volume) {}
			else if(this.controls.volume) {}
			if(this._controls_search && !this.controls.search) {}
			else if(this.controls.search) {}
			u.e.addEvent(this, "mousemove", this.showControls);
		}
		else if(this.controls) {
			u.as(this.controls, "display", "none");
		}
	}
	return player;
}

/*i-page-tablet.js*/
u.bug_console_only = true;
Util.Objects["page"] = new function() {
	this.init = function(page) {
		if(u.hc(page, "i:page")) {
			page.hN = u.qs("#header");
			page.cN = u.qs("#content");
			page.scenes = 0;
			page.nN = u.qs("#navigation");
			page.nN = u.ie(page.hN, page.nN);
			page.fN = u.qs("#footer");
			page.videoPlayer = u.videoPlayer();
			page.videoPlayer.video.poster = "/img/blank_16x9.png";
			page.orientationchanged = function() {
				u.as(page, "display", "none");
				u.t.setTimer(page, function() {location.reload();}, 500);
			}
			page.resized = function() {
				page.content_width = u.browserW()-10;
				u.as(page.cN, "width", (page.content_width-10)+"px", false);
				u.as(page.hN, "width", (page.content_width-10)+"px", false); 
				u.as(page.current_scene, "width", (page.content_width-10)+"px", false);
				page.content_offset_x = page.cN.offsetLeft;
				u.as(page.current_scene, "left", 0, false);
				u.as(page.hN, "left", (page.content_offset_x)+"px", false);
				if(page.intro) {
					u.as(page.intro, "left", Math.round((u.browserW()-page.intro.offsetWidth) / 2)+"px", false);
				}
				if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
					page.cN.scene.resized();
				}
				if(page.nN.nodes) {
					page.nN.node_width = Math.round((page.content_width-10)/5); 
					u.as(page.nN.cropped_menu, "width", (page.nN.node_width+2)+"px", false);
					var left = Math.floor((((page.content_width-10)/2) - (page.nN.node_width/2)));
					u.as(page.nN.cropped_menu, "left",  left+ "px", false);
					u.as(page.nN.c_list, "marginLeft", -left +"px", false);
					var i, node;
					for(i = 0; node = page.nN.nodes[i]; i++) {
						u.as(node, "width", page.nN.node_width+ "px", false);
						u.as(page.nN.c_nodes[i], "width", page.nN.node_width+"px", false);
					}
				}
				page.offsetHeight;
			}
			page.scrolled = function() {
				page.scrolled_y = u.scrollY();
				if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
					page.cN.scene.scrolled();
				}
				page.offsetHeight;
			}
			page.ready = function() {
				if(!u.hc(this, "ready")) {
					u.ac(this, "ready");
					this.initIntro();
					this.content_width = u.browserW()-10;
					this.current_scene = u.qs(".scene", this.cN);
					this.cN.scene = u.qs(".scene", this.cN);
					this.current_scene.org_offset_top = this.current_scene.offsetTop;
					this.initNavigation();
					this.initFooter(this.current_scene)
					u.e.addEvent(window, "orientationchange", page.orientationchanged);
					u.e.addEvent(window, "resize", page.resized);
					u.e.addEvent(window, "scroll", page.scrolled);
					this.resized();
					this.scrolled();
					u.navigation(page);
					u.init(this.current_scene);
				}
			}
			page.cN.ready = function() {
				if(!page.intro && u.hc(page, "ready") && u.hc(page.current_scene, "ready") && !u.hc(this, "ready")) {
					u.ac(this, "ready");
					u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");
					page.current_scene.built = function() {
						page.current_scene.built = null;
					}
					page.current_scene.scroll_offset = u.scrollY();
					page.current_scene.build();
				}
				var i, node;
				page.scenes = 0;
				for(i = 0; node = page.nN.nodes[i]; i++) {
					if(!node._scene && node._org_node) {
						node._scene = u.qs(".scene."+node._org_node.className, page.cN);
					}
					if(node._scene) {
						page.scenes++;
					}
				}
				if(page._delayed_navigation && !page.navigating && page.scenes == 5) {
					page.cN.navigate(page._delayed_navigation);
					page._delayed_navigation = false;
				}
			}
			page.cN.navigate = function(url) {
				if(!page.navigating && page.scenes == 5) {
					var i, node;
					for(i = 0; node = page.nN.nodes[i]; i++) {
						if(u.h.getCleanUrl(node.url) == url && node._i != 2) {
							page.cN.scene.scroll_offset = u.scrollY();
							if(typeof(page.cN.scene.exiting) == "function") {
								page.cN.scene.exiting();
							}
							page.navigating = true;
							u.a.transition(page.cN, "none");
							u.a.transition(page.nN, "none");
							u.a.transition(page.nN.c_list, "none");
							page._distance = node._i-2;
							var duration = 0.4 + (Math.abs(page._distance)*0.4);
							page.nN.nodes = u.qsa("li", page.nN.list);
							page.preFixScenes();
							if(page._distance > 0) {
								node = page.nN.nodes[0]._org_node.cloneNode(true);
								u.as(node, "width", page.nN.node_width+"px", false);
								u.ae(page.nN.list, node);
								var node_out = page.nN.nodes[0];
								if(page._distance > 1) {
									node = page.nN.nodes[1]._org_node.cloneNode(true);
									u.as(node, "width", page.nN.node_width+"px", false);
									u.ae(page.nN.list, node);
									node_out = page.nN.nodes[1];
									u.as(page.nN.nodes[0]._scene, "left", (page.content_width*3)+"px", false);
								}
							}
							else if(page._distance < 0) {
								node = page.nN.nodes[4]._org_node.cloneNode(true);
								u.as(node, "width", page.nN.node_width+"px", false);
								u.ie(page.nN.list, node);
								node_out = page.nN.nodes[4];
								if(page._distance < -1) {
									node = page.nN.nodes[3]._org_node.cloneNode(true);
									u.as(node, "width", page.nN.node_width+"px", false);
									u.ie(page.nN.list, node);
									node_out = page.nN.nodes[3];
									u.as(page.nN.nodes[4]._scene, "left", -(page.content_width*3)+"px", false);
								}
								var offset = page.nN.node_width*page._distance;
								u.as(page.nN, "width", page.content_width + Math.abs(offset), false);
								u.a.translate(page.nN, offset, 0);
							}
							page.offsetHeight;
							page.cN.transitioned = function() {
								u.a.transition(this, "none");
								page.rePositionAfterNavigation();
							}
							u.a.transition(page.cN, "all "+duration+"s ease-in-out");
							u.a.transition(page.nN, "all "+duration+"s ease-in-out");
							u.a.transition(page.nN.c_list, "all "+duration+"s ease-in-out");
							u.a.translate(page.cN, -(page.content_width*page._distance), 0);
							if(page._distance < 0) {
								u.a.translate(page.nN, 0, 0);
								u.a.translate(page.nN.c_list, Math.abs(offset), 0);
							}
							else {
								u.a.translate(page.nN, -(page.nN.node_width*page._distance), 0);
								u.a.translate(page.nN.c_list, -(page.nN.node_width*page._distance), 0);
							}
						}
					}
				}
				else {
					page._delayed_navigation = url;
				}
			}
			page.preFixScenes = function() {
				var node;
				node = page.nN.nodes[0]._scene;
				if(page._distance == -2) {
					u.as(node, "display", "block", false);
				}
				u.as(node, "left", -(page.content_width*2)+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);
				node = page.nN.nodes[1]._scene;
				if(page._distance <= -1) {
					u.as(node, "display", "block", false);
				}
				u.as(node, "left", -page.content_width+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);
				node = page.nN.nodes[2]._scene;
				u.as(node, "left", 0, false);
				node = page.nN.nodes[3]._scene;
				if(page._distance >= 1) {
					u.as(node, "display", "block", false);
				}
				u.as(node, "left", page.content_width+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);
				node = page.nN.nodes[4]._scene;
				if(page._distance == 2) {
					u.as(node, "display", "block", false);
				}
				u.as(node, "left", (page.content_width*2)+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);
				u.as(document.body, "overflow", "hidden", false);
				page.offsetHeight;
			}
			page.postFixScenes = function() {
				var node;
				u.a.removeTransform(page.cN);
				node = page.nN.nodes[0]._scene;
				u.as(node, "display", "none", false);
				node = page.nN.nodes[1]._scene;
				u.as(node, "display", "none", false);
				node = page.nN.nodes[2]._scene;
				u.as(node, "left", 0, false);
				u.as(node, "top", node.org_offset_top+"px", false);
				node = page.nN.nodes[3]._scene;
				u.as(node, "display", "none", false);
				node = page.nN.nodes[4]._scene;
				u.as(node, "display", "none", false);
				u.as(page.cN, "height", page.nN.nodes[2]._scene.offsetHeight + page.nN.nodes[2]._scene.org_offset_top + "px", false);
				u.as(document.body, "overflow", "scroll", false);
				page.offsetHeight;
				window.scrollTo(0, page.nN.nodes[2]._scene.scroll_offset);
			}
			page.rePositionAfterNavigation = function() {
				u.a.transition(page.cN, "none");
				u.a.transition(page.nN, "none");
				u.a.transition(page.nN.c_list, "none");
				var nav_nodes = u.qsa("li", page.nN.list);
				var c_nav_nodes = u.qsa("li", page.nN.c_list);
				if(page._distance == 1) {
					page.nN.list.removeChild(nav_nodes[0]);
					u.ae(page.nN.c_list, c_nav_nodes[0]);
				}
				else if(page._distance == 2) {
					page.nN.list.removeChild(nav_nodes[0]);
					page.nN.list.removeChild(nav_nodes[1]);
					u.ae(page.nN.c_list, c_nav_nodes[0]);
					u.ae(page.nN.c_list, c_nav_nodes[1]);
				}
				else if(page._distance == -1) {
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-1]);
					u.ie(page.nN.c_list, c_nav_nodes[4]);
				}
				else if(page._distance == -2) {
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-1]);
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-2]);
					u.ie(page.nN.c_list, c_nav_nodes[4]);
					u.ie(page.nN.c_list, c_nav_nodes[3]);
				}
				u.a.translate(page.nN, 0, 0);
				u.a.setWidth(page.nN, "auto");
				page.nN.nodes = u.qsa("li", page.nN.list);
				u.a.translate(page.nN.c_list, 0, 0);
				var i, node;
				for(i = 0; node = page.nN.nodes[i]; i++) {
					if(!node._org_node) {
						node._org_node = node.cloneNode(true);
					}
					if(!node._scene) {
						node._scene = u.qs(".scene."+node._org_node.className, page.cN);
					}
					node._i = i;
					u.ce(node, {"type":"link"});
				}
				page.current_scene = page.nN.nodes[2]._scene;
				page.cN.scene = page.nN.nodes[2]._scene;
				u.as(page.nN.nodes[0]._scene, "left", -(page.content_width*2)+"px", false);
				u.as(page.nN.nodes[1]._scene, "left", -page.content_width+"px", false);
				u.as(page.nN.nodes[2]._scene, "left", 0, false);
				u.as(page.nN.nodes[3]._scene, "left", page.content_width+"px", false);
				u.as(page.nN.nodes[4]._scene, "left", (page.content_width*2)+"px", false);
				u.a.translate(page.cN, 0, 0);
				page.postFixScenes();
				u.t.resetTimer(page.t_color);
				page.colorTransitioned = function() {
					if(typeof(page.nN.nodes[2]._scene.build) == "function") {
						page.nN.nodes[2]._scene.build();
					}
					if(typeof(page.nN.nodes[2]._scene.entered) == "function") {
						page.nN.nodes[2]._scene.entered();
					}
				}
				page.setColor(page.current_scene.page_color);
				page.t_color = u.t.setTimer(page, page.colorTransitioned, 1000);
				page.navigating = false;
			}
			page.initNavigation = function() {
				this.nN.list = u.qs("ul", this.nN);
				this.nN.nodes = u.qsa("li", this.nN.list);
				var i, node;
				for(i = 0; node = this.nN.nodes[i]; i++) {
					if(u.hc(document.body, node.className)) {
						var current_i = i;
					}
				}
				this.nN.cropped_menu = u.ae(this.hN, "div", ({"class": "cropped"}));
				this.nN.c_list = this.nN.list.cloneNode(true);
				this.nN.c_list = u.ae(this.nN.cropped_menu, this.nN.c_list);
				this.nN.c_nodes = u.qsa("li", this.nN.c_list);
				if(current_i == 0) {
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-1]);
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-2]);
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-1]);
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-2]);
				}
				else if(current_i == 1) {
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-1]);
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-1]);
				}
				else if(current_i == 3) {
					u.ae(this.nN.list, this.nN.nodes[0]);
					u.ae(this.nN.c_list, this.nN.c_nodes[0]);
				}
				else if(current_i == 4) {
					u.ae(this.nN.list, this.nN.nodes[0]);
					u.ae(this.nN.list, this.nN.nodes[1]);
					u.ae(this.nN.c_list, this.nN.c_nodes[0]);
					u.ae(this.nN.c_list, this.nN.c_nodes[1]);
				}
				this.nN.nodes = u.qsa("li", this.nN.list);
				for(i = 0; node = this.nN.nodes[i]; i++) {
					node._org_node = node.cloneNode(true);
					node._i = i;
					u.ce(node, {"type":"link"});
				}
				this.nN.c_nodes = u.qsa("li", this.nN.c_list);
				for(i = 0; node = this.nN.c_nodes[i]; i++) {
					u.ce(node, {"type":"link"});
				}
				// 
				// 
			}
			page.initFooter = function(scene) {
				var offices, node, sharing, i;
				var svg, shape;
				svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				shape.setAttributeNS(null, "points", "0,0 4,2.5 0,5");
				shape.setAttributeNS(null, "fill", "none");
				shape.setAttributeNS(null, "stroke", "none");
				shape = svg.appendChild(shape);
				var _over = function() {
					this.transitioned = function() {
						this.removeAttribute("style");
						this.a.removeAttribute("style");
						this.polygon.removeAttribute("style");
					}
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.a, "none");
					u.a.transition(this.polygon, "none");
					u.ac(this, "hover");
				}
				var _out = function() {
					this.transitioned = function() {
						this.removeAttribute("style");
						this.a.removeAttribute("style");
						this.polygon.removeAttribute("style");
					}
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.a, "none");
					u.a.transition(this.polygon, "none");
					u.rc(this, "hover");
				}
				sharing = u.qsa("ul.social li", scene);
				for(i = 0; node = sharing[i]; i++) {
					u.ae(node, svg.cloneNode(true));
					node.a = u.qs("a", node);
					node.polygon = u.qs("polygon", node);
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(node, "mouseover", _over);
						u.e.addEvent(node, "mouseout", _out);
					}
					else {
						u.e.addEvent(node, "touchstart", _over);
						u.e.addEvent(node, "touchend", _out);
					}
					node.clicked = function() {
						window.open(this.url,'_blank');
					}
					u.ce(node);
				}
				offices = u.qsa("div.offices li.vcard", scene);
				u.ie(offices[0], "img", {"src": "/img/footer_cph.jpg"});
				u.ie(offices[1], "img", {"src": "/img/footer_kyoto.jpg"});
				u.ie(offices[2], "img", {"src": "/img/footer_tokyo.jpg"});
				page.injectFullStop(scene);
			}
			page.initIntro = function() {
				page.intro = u.ae(document.body, "div", {"id":"intro"});
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
				p.setAttributeNS(null, "d", "M76,0C34.1,0,0,34.1,0,76c0,41.9,34.1,76,76,76c41.9,0,76-34.1,76-76C152,34.1,117.9,0,76,0z");
				p.setAttributeNS(null, "class", "logo_stroke");
				svg.appendChild(p);
				p = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
				p.setAttributeNS(null, "d", "M131.5,65.3c2.8,3.3,4.4,7.6,4.4,12c0,10.2-8.3,18.5-18.5,18.5c-10.2,0-18.5-8.3-18.5-18.5c0-10.2,8.3-18.5,18.5-18.5c3.4,0,6.8,0.9,9.9,2.8");
				p.setAttribute("class", "logo_stroke");  
				svg.appendChild(p);
				p = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
				p.setAttributeNS(null, "d", "M20.5,89.4c-2.8-3.3-4.4-7.5-4.4-12c0-10.2,8.3-18.5,18.5-18.5c10.2,0,18.5,8.3,18.5,18.5c0,10.2-8.3,18.5-18.5,18.5c-3.4,0-6.8-0.9-9.8-2.8");
				p.setAttribute("class", "logo_stroke");
				svg.appendChild(p);
				p = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
				p.setAttributeNS(null, "d", "M72.7,77.3c-5.1,0-9.3,4.1-9.3,9.3c0,5.1,4.1,9.3,9.3,9.3c3.2,0,6.1-1.6,7.7-4.2");
				p.setAttribute("class", "logo_stroke");
				svg.appendChild(p);
				p = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
				p.setAttributeNS(null, "d", "M91.3,77.3c-2.9,0-18.6,0-18.6,0c-5.1,0-9.3-4.1-9.3-9.3c0-5.1,4.1-9.3,9.3-9.3c3.2,0,6.1,1.6,7.7,4.2");
				p.setAttribute("class", "logo_stroke");
				svg.appendChild(p);
				p = document.createElementNS('http://www.w3.org/2000/svg',"line"); 
				p.setAttributeNS(null, "x1", "85");
				p.setAttributeNS(null, "y1", "71.4");
				p.setAttributeNS(null, "x2", "85");
				p.setAttributeNS(null, "y2", "83.2");
				p.setAttribute("class", "logo_stroke");
				svg.appendChild(p);
				page.intro.appendChild(svg);
				page.intro.div = u.ae(page.intro, "div", {"html":"Loading "});
				page.intro.span = u.ae(page.intro.div, "span", {"html":"0%"});
				page.intro.load_counter = 0;
				u.as(page.intro, "top", ((u.browserH()-page.intro.offsetHeight) / 2)+"px", false);
				u.as(page.intro, "left", ((u.browserW()-page.intro.offsetWidth) / 2)+"px", false);
				page.intro.offsetHeight;
				page.preload_state = 20;
				page.intro.endIntro = function() {
					this.transitioned = function() {
						u.a.transition(this, "none");
						page.intro.parentNode.removeChild(page.intro);
						page.intro = null;
						page.transitioned = function() {
							u.a.transition(page, "none");
							page.colorTransitioned = function() {
								page.cN.ready();
							}
							page.setColor(page.current_scene.page_color);
							u.t.setTimer(page, page.colorTransitioned, 1000);
						}
						u.a.transition(page, "all 0.6s ease-in");
						u.a.setOpacity(page, 1);
					}
					u.a.transition(this, "all 0.4s ease-in");
					u.a.setOpacity(this, 0);
				}
				page.intro.loader = function() {
					if(this.load_counter < 100) {
						if(this.load_counter <= page.preload_state) {
							this.load_counter += 2;
						}
						this.span.innerHTML = this.load_counter + "%"
						u.t.setTimer(this, this.loader, 30); 
					}
					else {
						u.t.setTimer(this, this.endIntro, 200); 
					}
				}
				page.intro.transitioned = function() {
					u.a.transition(this, "none");
					if(!this.start_preloading_scenes) {
						this.start_preloading_scenes = true;
						u.t.setTimer(this, this.loader, 200); 
						page.preloadScenes();
					}
				}
				page.intro.preloads = {
					"front":["/img/front_poster.jpg"],
					"about":["/img/about_video.jpg"],
					"expertise":["/img/expertise1.jpg", "/img/expertise2.jpg"]
				}
				if(u.gcs(page.intro, "opacity") != 1) {
					u.a.transition(page.intro, "all 0.4s ease-in");
					u.a.setOpacity(page.intro, 1);
				}
				else {
					page.intro.transitioned();
				}
				if(u.browser("safari")) {
					page.intro.extrSafariCheck = function() {
					if(this.transitioned) {
							this.transitioned();
						}
					}
					u.t.setTimer(page.intro, page.intro.extrSafariCheck, 500);
				}
				// 
			}
			page.preloadScenes = function() {
				page.nN.nodes[1].response = function(response) {
					var scene = u.qs(".scene", response);
					u.ie(page.cN, scene);
					u.as(scene, "left", (page.content_width)+"px");
					scene.org_offset_top = scene.offsetTop;
					scene.scroll_offset = 0;
					u.as(scene, "width", (page.content_width-10) + "px");
					u.init(scene);
					page.initFooter(scene);
					this._scene = scene;
					page.preload_state += 20;
					page.intro.span.innerHTML = page.preload_state + "%";
					page.intro.load_counter = page.preload_state;
					page.nN.nodes[3].response = function(response) {
						var scene = u.qs(".scene", response);
						u.ae(page.cN, scene);
						u.as(scene, "left", (page.content_width)+"px");
						scene.org_offset_top = scene.offsetTop;
						scene.scroll_offset = 0;
						u.as(scene, "width", (page.content_width-10) + "px");
						u.init(scene);
						page.initFooter(scene);
						this._scene = scene;
						page.preload_state += 20;
						page.intro.span.innerHTML = page.preload_state + "%";
						page.intro.load_counter = page.preload_state;
						page.nN.nodes[0].response = function(response) {
							var scene = u.qs(".scene", response);
							u.ie(page.cN, scene);
							u.as(scene, "left", Math.round(page.content_width*2)+"px", false);
							scene.org_offset_top = scene.offsetTop;
							scene.scroll_offset = 0;
							u.as(scene, "width", (page.content_width-10) + "px", false);
							scene.offsetHeight;
							u.init(scene);
							page.initFooter(scene);
							this._scene = scene;
							page.preload_state += 20;
							page.intro.span.innerHTML = page.preload_state + "%";
							page.intro.load_counter = page.preload_state;
							page.nN.nodes[4].response = function(response) {
								var scene = u.qs(".scene", response);
								u.ae(page.cN, scene);
								u.as(scene, "left", Math.round(page.content_width*2)+"px");
								scene.org_offset_top = scene.offsetTop;
								scene.scroll_offset = 0;
								u.as(scene, "width", (page.content_width-10) + "px");
								u.init(scene);
								page.initFooter(scene);
								this._scene = scene;
								page.preload_state += 20;
								page.intro.span.innerHTML = page.preload_state + "%";
								page.intro.load_counter = page.preload_state;
							}
							u.request(page.nN.nodes[4], page.nN.nodes[4].url);
						}
						u.request(page.nN.nodes[0], page.nN.nodes[0].url);
					}
					u.request(page.nN.nodes[3], page.nN.nodes[3].url);
				}
				u.request(page.nN.nodes[1], page.nN.nodes[1].url);
			}
			page.setColor = function(color) {
				if(!u.hc(document.body, color)) {
					u.rc(document.body, "bordeaux|green|red|blue|brown", false);
					u.ac(document.body, color, false);
				}
				page.offsetHeight;
			}
			page.injectFullStop = function(node) {
				if(!this.fullStopSvg) {
					var svg, shape;
					this.fullStopSvg = document.createElement("div");
					this.fullStopSvg.className = "fullstop";
					svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					shape.setAttributeNS(null, "cx", 8);
					shape.setAttributeNS(null, "cy", 8);
					shape.setAttributeNS(null, "r", 6);
					shape.setAttribute("fill", "none");
					shape.setAttribute("stroke", "none");
					svg.appendChild(shape);
					this.fullStopSvg.appendChild(svg);
				}
				u.ae(node, this.fullStopSvg.cloneNode(true));
			}
			page.ejectVideoPlayer = function() {
				if(page.videoPlayer && page.videoPlayer.parentNode) {
					page.videoPlayer.parentNode.removeChild(page.videoPlayer);
					u.a.transition(page.videoPlayer, "none");
					page.videoPlayer.removeAttribute("style");
					if(page.videoPlayer.node && page.videoPlayer.node.play && page.videoPlayer.node.info) {
						page.videoPlayer.node.info.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.setOpacity(page.videoPlayer.node.info, 0);
						u.a.transition(page.videoPlayer.node.info, "opacity 0.3s ease-in");
						u.a.setOpacity(page.videoPlayer.node.info, 1);
						u.e.addEvent(page.videoPlayer.node.play, "mouseover", page.videoPlayer.node.play.mouseover);
						page.videoPlayer.node.play.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.scale(page.videoPlayer.node.play, 1.2);
						u.a.setOpacity(page.videoPlayer.node.play, 0);
						u.a.transition(page.videoPlayer.node.play, "all 0.2s ease-in 0.2s");
						u.a.scale(page.videoPlayer.node.play, 1);
						u.a.setOpacity(page.videoPlayer.node.play, 1);
					}
				}
			}
			page._image_loaded = function(queue) {
				this.src = queue[0].image.src;
				this.transitioned = function() {
					u.a.transition(this, "none");
					if(typeof(this.pageImageLoaded) == "function") {
						this.pageImageLoaded();
					}
				}
				u.a.transition(this, "opacity 0.2s ease-in");
				u.a.setOpacity(this, 1);
			}
			page._bn_play_clicked = function() {
				var play_bn = this;
				u.e.removeEvent(this, "mouseout", this.mouseout);
				this.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(this, "all 0.4s ease-in");
				u.a.scale(this, 3);
				u.a.setOpacity(this, 0);
				page.ejectVideoPlayer();
				u.ae(this.video_node, page.videoPlayer);
				page.videoPlayer.loadAndPlay(this.url);
				page.videoPlayer.video.controls = "controls";
				page.videoPlayer.node = this;
				page.videoPlayer.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.as(page.videoPlayer, "display", "block");
				u.a.setOpacity(page.videoPlayer, 0);
				u.a.transition(page.videoPlayer, "all 0.3s ease-in");
				u.a.setOpacity(page.videoPlayer, 1);
				page.videoPlayer.ended = function(event) {
					u.e.addEvent(this.node.play, "mouseover", this.mouseover);
					u.a.scale(this.node.play, 1);
					u.a.setOpacity(this.node.play, 1);
					page.videoPlayer.transitioned = function() {
						u.a.transition(this, "none");
						u.as(this, "display", "none");
					}
					u.a.transition(page.videoPlayer, "opacity 0.2s ease-in");
					u.a.setOpacity(page.videoPlayer, 0);
				}
			}
			page.ready();
		}
	}
}
function static_init() {
	u.o.page.init(u.qs("#page"));
}
u.e.addDOMReadyEvent(static_init);


/*i-column-tablet.js*/
u.bug_force = true;
Util.Objects["column"] = new function() {
	this.init = function(scene) {
		scene.page_color = "red";
		scene.resized = function() {
			if(this.div_column) {
				var column_width = Math.round(this.offsetWidth*0.7);
				u.as(this.div_columns, "width", column_width+"px", false);
				u.as(this._filters, "width", (this.offsetWidth - column_width - 10) +"px", false);
				if(page.current_scene == this) {
					u.as(this._filters, "left", (column_width + page.content_offset_x + 10) +"px", false);
				}
				else {
					u.as(this._filters, "left", (column_width + 10) +"px", false);
				}
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
			if(this._filters) {
				var boundary = (this.div_columns.offsetHeight - this._filters.offsetHeight) - page.scrolled_y;
				if(boundary < 200) {
					u.a.setOpacity(this._filters, boundary/200);
				}
				else {
					u.a.setOpacity(this._filters, 1);
				}
			}
			if(this.is_ready && this.items && !this.is_loading_more) {
				if(this.ul_column.offsetTop + this.ul_column.offsetHeight < page.scrolled_y + u.browserH() + 800) {
					this.loadMore();
				}
			}
			u.t.resetTimer(this.t_scroll);
			this.updateAfterScroll();
		}
		scene.updateAfterScroll = function() {
			u.t.resetTimer(this.t_scroll);
			if(this.is_ready && this.items) {
				var i, node;
				for(i = 0; node = this.items[i]; i++) {
					if(node.offsetTop < page.scrolled_y + u.browserH() + 800 && node.offsetTop+node.offsetHeight + 800 > page.scrolled_y) {
						this.buildNode(node);
					}
					else {
						this.deactivateNode(node);
					}
				}
			}
		}
		scene.entered = function() {
			u.a.removeTransform(this);
			if(this._filters) {
				u.as(this._filters, "position", "fixed", false);
				u.as(this._filters, "top", this.org_offset_top+"px", false);
				u.as(this._filters, "left", (this.div_columns.offsetWidth + page.content_offset_x + 10) +"px", false);
			}
			this.resized();
		}
		scene.exiting = function() {
			var iframes = u.qsa(".vimeo", this);
			var i, iframe;
			for(i = 0; iframe = iframes[i]; i++) {
				iframe.parentNode.removeChild(iframe);
			}
			if(this._filters) {
				u.as(this._filters, "position", "absolute", false);
				u.as(this._filters, "top", this.scroll_offset + "px", false);
				u.as(this._filters, "left", (this.div_columns.offsetWidth + 10) +"px", false);
				this._filters.offsetHeight;
			}
			page.ejectVideoPlayer();
		}
		scene.initColumnList = function() {
			this.ul_column = u.qs("ul.columns", this);
			this.ul_column.scene = this;
			this.items = u.qsa("ul.columns li.item", this);
			if(this.items.length) {
				var i, node;
				for(i = 0; node = this.items[i]; i++) {
					this.readyNode(node);
				}
			}
		}
		scene.ready = function() {
			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;
			this.div_column = u.qs("div.column", this);
			if(this.div_column) {
				this.div_columns = u.wc(this.div_column, "div", {"class":"columns"});
				this._filters = u.qs("div.filters", this.div_columns);
				var column_width = Math.round(this.offsetWidth*0.7);
				u.as(this.div_columns, "width", column_width+"px", false);
				u.as(this._filters, "position", "absolute", false);
				u.as(this._filters, "width", (this.offsetWidth - column_width - 10) +"px", false);
				u.as(this._filters, "top", "0px", false);
				u.as(this._filters, "left", (column_width + 10) +"px", false);
				this.initColumnList();
				var next = u.qs("div.pagination .next a", this);
				if(next) {
					this.next_link = next.href;
				}
				else {
					this.next_link = false;
				}
				if(this._filters) {
					this.filter_options = u.qsa("li", this._filters);
					this.filter = function(url) {
						this.ul_column.filter_url = url;
						this.ul_column.transitioned = function() {
							u.a.transition(this, "none");
							this.response = function(response) {
								window.scrollTo(0, 0);
								var ul_column = u.qs("ul.columns", response);
								var next = u.qs("div.pagination .next a", response);
								u.a.setOpacity(ul_column, 0);
								this.parentNode.replaceChild(ul_column, this);
								this.scene.is_loading_more = false;
								this.scene.initColumnList();
								if(next) {
									this.scene.next_link = next.href;
								}
								else {
									this.scene.next_link = false;
								}
								u.t.setTimer(this.scene, this.scene.columnFadeUp, 500);
							}
							u.request(this, this.filter_url);
						}
						u.a.transition(this.ul_column, "all .4s ease-out");
						u.a.setOpacity(this.ul_column, 0);
						this.columnFadeUp = function() {
							this.ul_column.transitioned = function(event) {
								u.a.transition(this, "none");
								u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");
								this.scene.updateAfterScroll();
							}
							u.a.setOpacity(this.ul_column, 0);
							u.a.transition(this.ul_column, "all 1.4s ease-out");
							u.a.setOpacity(this.ul_column, 1);
						}
						for(i = 0; option = this.filter_options[i]; i++) {
							if(this.ul_column.filter_url == option.url) {
								option.transitioned = function(event) {
									this.removeAttribute("style");
								}
								u.a.transition(option, "all 0.15s linear");
								u.ac(option, "selected");
							}
							else if(u.hc(option, "selected")) {
								option.transitioned = function(event) {
									this.removeAttribute("style");
								}
								u.a.transition(option, "all 0.15s linear");
								u.rc(option, "selected");
							}
						}
					}
					var _over = function() {
						u.a.transition(this, "none");
						this.offsetHeight;
						this.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.ac(this, "hover");
					}
					var _out = function() {
						u.a.transition(this, "none");
						this.offsetHeight;
						this.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.rc(this, "hover", false);
					}
					var i, node;
					for(i = 0; node = this.filter_options[i]; i++) {
						u.ce(node);
						node.scene = this;
						node.clicked = function(event) {
							this.scene.filter(this.url);
						}
						var a = u.qs("a", node);
						node.innerHTML = a.innerHTML;
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(node, "mouseover", _over);
							u.e.addEvent(node, "mouseout", _out);
						}
						else {
							u.e.addEvent(node, "touchstart", _over);
							u.e.addEvent(node, "touchend", _out);
						}
					}
				}
			}
			else {
				this.navigate = function(url) {
					u.bug("scene navigation:" + url)
					this.response = function(response) {
						if(response) {
							this.transitioned = function(event) {
								u.a.transition(this, "none");
								window.scrollTo(0, 0);
								var new_scene = u.qs(".scene", response);
								this.parentNode.replaceChild(new_scene, this);
								page.nN.nodes[2]._scene = new_scene;
								page.rePositionAfterNavigation();
								new_scene.org_offset_top = new_scene.offsetTop;
								new_scene.scroll_offset = 0;
								u.as(new_scene, "width", (page.content_width-10) + "px", false);
								u.init(new_scene);
								page.initFooter(scene);
								page.setColor(this.page_color)
							}
							u.a.transition(this, "all 0.4s ease-in-out");
							u.a.setOpacity(this, 0);
						}
					}
					u.request(this, url);
				}
				var article = u.qs(".article", this);
				this._images = u.qsa(".image", article);
				var i, image;
				for (i = 0; image = this._images[i]; i++) {
					image_id = u.cv(image, "id");
					image_format = u.cv(image, "format");
					image_variant = u.cv(image, "variant");
					image_w = u.cv(image, "width");
					image_h = u.cv(image, "height");
					proportion = image_h/image_w;
					if(image_format && image_variant) {
						if(i == 0) {
							image.parentNode.removeChild(image);
							image = u.ie(article, "div", {"class":"image"});
							this.image = image;
						}
						image.loaded = function(queue) {
							this.img = u.ae(this, "img", {"src": queue[0].image.src});
							u.as(this.img, "height", "auto");
							this.img.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.setOpacity(this.img, 0);
							u.a.scale(this.img, 1.04);
							u.a.transition(this.img, "all 1s ease-out");
							u.a.setOpacity(this.img, 1);
							u.a.scale(this.img, 1);
						}
						u.preloader(image, ["/images/"+ image_id +"/"+ image_variant +"/x680."+ image_format]);
					}
				}
				var sharing = u.qs("div.sharing", article);
				var dl = u.qs("dl", article);
				article.insertBefore(sharing, dl);
				sharing.h4 = u.qs("h4", sharing);
				sharing.h4_span = u.qs("h4 span", sharing);
				sharing.ul = u.qs("ul", sharing);
				sharing.over = function() {
					u.t.resetTimer(this.t_close);
					this.open = true;
					this.ul.transitioned = function() {
						this.removeAttribute("style");
					}
					u.a.transition(this.ul, "all 0.3s ease-in-out");
					u.ac(this, "hover");
				}
				sharing.out = function() {
					this.t_close = u.t.setTimer(this, this.close, 500);
				}
				sharing.close = function() {
					this.open = false;
					u.t.resetTimer(this.t_close);
					this.ul.transitioned = function() {
						this.removeAttribute("style");
					}
					u.a.transition(this.ul, "all 0.15s linear");
					u.rc(this, "hover");
				}
				sharing.toggle = function() {
					if(this.open) {
						this.close();
					}
					else {
						this.over();
					}
				}
				if(u.e.event_pref == "mouse") {
					u.e.addEvent(sharing, "mouseover", sharing.over);
					u.e.addEvent(sharing, "mouseout", sharing.out);
				}
				else {
					u.e.addEvent(sharing, "touchstart", sharing.toggle);
				}
				var _over_li = function() {
					this.transitioned = function() {
						this.removeAttribute("style");
						this.bn.removeAttribute("style");
					}
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.bn, "none");
					u.ac(this, "hover");
				}
				var _out_li = function() {
					this.transitioned = function() {
						this.removeAttribute("style");
						this.bn.removeAttribute("style");
					}
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.bn, "none");
					u.rc(this, "hover");
				}
				var shares = u.qsa("li", sharing);
				var y, li;
				for(y = 0; li = shares[y]; y++) {
					li.bn = u.qs("a", li);
					li.clicked = function(event) {
						u.e.kill(event);
						window.open(this.url,'_blank');
					}
					u.ce(li);
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(li, "mouseover", _over_li);
						u.e.addEvent(li, "mouseout", _out_li);
					}
					else {
						u.e.addEvent(li, "touchstart", _over_li);
						u.e.addEvent(li, "touchend", _out_li);
					}
				}
				// 
				this.player_a = u.qs(".video a", article);
				if(this.player_a && this.player_a.href) {
					this.player_url = this.player_a.href;
					this.injectIframe(this.image, this.player_url);
				}
			}
			this.transitioned = function() {
				u.a.transition(this, "none");
				this.is_ready = true;
				u.ac(this, "ready");
				page.cN.ready();
			}
			if(this == page.current_scene) {
				u.a.transition(this, "opacity 0.6s ease-in");
				u.a.setOpacity(this, 1);
			}
			else {
				u.as(this, "display", "none");
				u.a.setOpacity(this, 1);
				this.transitioned();
			}
		}
		scene.loadMore = function() {
			this.is_loading_more = true;
			if(this.next_link) {
				this.response = function(response) {
					var items = u.qsa(".scene li.item", response);
					var i, node;
					for(i = 0; node = items[i]; i++) {
						u.ae(this.ul_column, node);
						this.readyNode(node);
					}
					var next = u.qs(".scene div.pagination .next a", response);
					if(next) {
						this.next_link = next.href;
					}
					else {
						this.next_link = false;
					}
					this.items = u.qsa("li.item", this.ul_column);
					this.is_loading_more = false;
					u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");
					this.scrolled();
				}
				u.request(this, this.next_link);
			}
		}
		scene.readyNode = function(node) {
			node.scene = this;
			node._has_video_link = u.hc(node, "video");
			u.ce(node);
			node._image_id = u.cv(node, "id");
			node._proportion_x = u.cv(node, "prop_x");
			node._proportion_y = u.cv(node, "prop_y");
			node._image_format = u.cv(node, "format");
			node._image_variant = u.cv(node, "variant");
			node.image = u.ie(node, "div", ({"class": "image"}));
			node.image.img = u.ae(node.image, "img");
			u.as(node.image.img, "height", Math.round(node.offsetWidth/node._proportion_x * node._proportion_y) + "px", false);
			u.as(node.image, "height", Math.round(node.offsetWidth/node._proportion_x * node._proportion_y) + "px", false);
			node.sharing = u.qs("div.sharing", node);
			node.tag = u.qs("div.tags", node);
			node._text = u.ae(node, "div", {"class":"text"});
			node.insertBefore(node._text, node.tag);
			node._images = u.ae(node, "div", {"class":"images"});
			var sharing = u.qs("div.sharing", node);
			var dl = u.qs("dl", node);
			node.insertBefore(node.sharing, dl);
			sharing.ul = u.qs("ul", sharing);
			node.full_stop_placeholder = u.ae(node, "div", {"class":"fullStopPlaceholder"});
			u.a.transition(node, "none");
			u.as(node, "height", (node.offsetHeight-1)+"px", false);
			node.offsetHeight;
			u.ac(node, "disabled", false);
			node.is_disabled = true;
			node.is_ready = true;
		}
		scene.buildNode = function(node) {
			if(!node._hidden) {
				if(!node.is_loaded && node.is_ready) {
					node.is_loaded = true;
					if(node.image) {
						if(node._has_video_link) {
							node.play = u.ae(node.image, "div", {"class":"play"});
							node.play.node = node;
						}
					}
					node.loaded = function(queue) {
						u.a.setOpacity(this.image.img, 0);
						u.a.scale(this.image.img, 1.04);
						this.image.img.src = queue[0].image.src;
						u.as(this.image.img, "height", "100%");
						this.image.img.transitioned = function() {
							u.a.removeTransform(this);
							u.a.transition(this, "none");
						}
						u.a.transition(this.image.img, "all 1s ease-out");
						u.a.setOpacity(this.image.img, 1);
						u.a.scale(this.image.img, 1);
					}
					u.preloader(node, ["/images/"+ node._image_id +"/"+ node._image_variant +"/665x."+ node._image_format]);
					if(node.play) {
						var _overPlay = function() {
							this.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
							u.a.scale(this, 0.86);
						}
						var _outPlay = function() {
							this.transitioned = function() {
								u.a.transition(this, "none");
							}
							u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
							u.a.scale(this, 1);
						}
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(node.play, "mouseover", _overPlay);
							u.e.addEvent(node.play, "mouseout", _outPlay);
						}
						else {
							u.e.addEvent(node.play, "touchstart", _overPlay);
							u.e.addEvent(node.play, "touchend", _outPlay);
						}
					}
					var _over = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.ac(this, "hover");
					}
					var _out = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.rc(this, "hover");
					}
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(node, "mouseover", _over);
						u.e.addEvent(node, "mouseout", _out);
					}
					else {
						u.e.addEvent(node, "touchstart", _over);
						u.e.addEvent(node, "touchend", _out);
					}
					node.sharing.over = function() {
						u.t.resetTimer(this.t_close);
						this.open = true;
						this.ul.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this.ul, "all 0.3s ease-in-out");
						u.ac(this, "hover");
					}
					var sharing_out = function() {
						this.t_close = u.t.setTimer(this, this.close, 500);
					}
					node.sharing.close = function() {
						this.open = false;
						u.t.resetTimer(this.t_close);
						this.ul.transitioned = function() {
							this.removeAttribute("style");
						}
						u.a.transition(this.ul, "all 0.15s linear");
						u.rc(this, "hover");
					}
					var sharing_toggle = function() {
						if(this.open) {
							this.close();
						}
						else {
							this.over();
						}
					}
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(node.sharing, "mouseover", node.sharing.over);
						u.e.addEvent(node.sharing, "mouseout", sharing_out);
					}
					else {
						u.e.addEvent(node.sharing, "touchstart", sharing_toggle);
					}
					var _over_li = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.a.transition(this.bn, "none");
						u.ac(this, "hover");
					}
					var _out_li = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.a.transition(this.bn, "none");
						u.rc(this, "hover");
					}
					var shares = u.qsa("li", node.sharing);
					var y, li;
					for(y = 0; li = shares[y]; y++) {
						li.bn = u.qs("a", li);
						li.clicked = function(event) {
							u.e.kill(event);
							window.open(this.url,'_blank');	
						}
						u.ce(li);
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(li, "mouseover", _over_li);
							u.e.addEvent(li, "mouseout", _out_li);
						}
						else {
							u.e.addEvent(li, "touchstart", _over_li);
							u.e.addEvent(li, "touchend", _out_li);
						}
					}
					page.injectFullStop(node.full_stop_placeholder);
					node.clicked = function(event) {
						u.ac(this, "unclickable", false);
						this.clicked = null;
						this.response = function(response) {
							var article = u.qs("div.article", response);
							u.as(this._images, "height", 0);
							u.as(this._text, "height", 0);
							var article_body = u.ae(this._text, u.qs("div.article_body", article));
							this._text.transitioned = function() {
								u.a.transition(this, "none");
								u.a.setHeight(this, "auto");
							}
							u.a.setHeight(this._text, 0);
							u.a.transition(this._text, "all 0.8s ease-in-out");
							u.a.setHeight(this._text, article_body.offsetHeight);
							var image_list = u.qs("ul.images", article); 
							if(image_list) {
								var first_image = u.qs(".image", image_list);
								if(first_image) {
									image_list.removeChild(first_image);
								}
								this._images.images = u.qsa(".image", image_list);
								if(this._images.images.length) {
									image_list = u.ae(this._images, image_list);
									var i, image;
									for(i = 0; image = this._images.images[i]; i++) {
										image._image_id = u.cv(image, "id");
										image._image_format = u.cv(image, "format");
										image._image_variant = u.cv(image, "variant");
										image._image_w = u.cv(image, "width");
										image._image_h = u.cv(image, "height");
										image._proportion = image._image_h/image._image_w;
										if(image._image_format && image._image_variant) {
											image.img = u.ae(image, "img", {"src":"/img/blank_16x9.png"});
											u.as(image.img, "height", (image.offsetWidth*image._proportion)+"px");
										}
									}
									this._images.transitioned = function() {
										u.a.transition(this, "none");
										u.a.setHeight(this, "auto");
										var i, image;
										for(i = 0; image = this.images[i]; i++) {
											image.loaded = function(queue) {
												this.img.src = queue[0].image.src;
												u.as(this.img, "height", "auto");
												this.img.transitioned = function() {
													u.a.transition(this, "none");
												}
												u.a.setOpacity(this.img, 0);
												u.a.transition(this.img, "all 0.5s ease-out");
												u.a.setOpacity(this.img, 1);
											}
											u.preloader(image, ["/images/"+ image._image_id +"/"+ image._image_variant +"/x675."+ image._image_format]);
										}
									}
									u.a.setHeight(this._images, 0);
									u.a.transition(this._images, "all 0.8s ease-in-out");
									u.a.setHeight(this._images, image_list.offsetHeight);
								}
							}
							this.player_a = u.qs(".video a", article);
							if(this.player_a && this.player_a.href) {
								u.ce(this.play);
								this.play.clicked = function() {
									this.node.scene.injectIframe(this.node.image, this.node.player_a.href)
								}
								this.player_url = this.player_a.href;
								this.scene.injectIframe(this.image, this.player_url);
							}
							u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");
						}
						u.request(this, this.url);
					}
				}
				if(node.is_disabled) {
					u.a.transition(node, "none");
					u.rc(node, "disabled", false);
					node.offsetHeight;
					u.as(node, "height", "auto", false);
					node.is_disabled = false;
				}
			}
		}
		scene.deactivateNode = function(node) {
			if(!node.is_disabled && !node._hidden) {
				node.offsetHeight;
				u.a.transition(node, "none");
				u.as(node, "height", (node.offsetHeight-1)+"px", false);
				u.ac(node, "disabled");
				node.offsetHeight;
				node.is_disabled = true;
			}
		}
		scene.build = function() {
			if(!this.is_built) {
				this.is_built = true;
				this.is_rendered = true;
				if(typeof(this.built) == "function") {
					this.built();
				}
				if(this.div_column) {
					u.a.removeTransform(this);
					u.as(this._filters, "position", "fixed", false);
					u.as(this._filters, "top", this.org_offset_top+"px", false);
					u.as(this._filters, "left", (this.div_columns.offsetWidth + page.content_offset_x + 10) +"px", false);
					var i, node;
					for(i = 0; node = this.items[i]; i++) {
						if(node.offsetTop < u.scrollY() + 800 && node.offsetTop + node.offsetHeight > u.scrollY() - 200) {
							this.buildNode(node);
						}
					}
				}
			}
		}
		scene.injectIframe = function(node, url) {
			var iframes = u.qsa(".vimeo", this);
			var i, iframe;
			for(i = 0; iframe = iframes[i]; i++) {
				iframe.parentNode.removeChild(iframe);
			}
			var player_width = node.offsetWidth;
			var player_height = node.offsetWidth;
			var p_id, player_id, player_html;
			if(url.match(/youtube/i)) {
				var p_id = url.match(/watch\?v\=([a-zA-Z0-9_-]+)/);
				if(p_id) {
					player_id = p_id[1];
					player_html = '<iframe width="'+player_width+'" height="'+player_height+'" src="//www.youtube.com/embed/'+player_id+'?autoplay=1" frameborder="0" allowfullscreen></iframe>'
				}
			}
			else if(url.match(/vimeo/i)) {
				var p_id = url.match(/com\/([a-zA-Z0-9]+)/);
				if(p_id) {
					player_id = p_id[1];
					player_html = '<iframe src="http://player.vimeo.com/video/'+player_id+'?byline=0&amp;portrait=0" width="'+player_width+'" height="'+player_height+'" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>'
				}
			}
			if(player_html) {
				u.ie(node, "div", {"class": "vimeo", "html": player_html});
			}
		}
		scene.destroy = function() {
			this.destroy = null;
		}
		scene.ready();
	}
}


/*i-front-tablet.js*/
Util.Objects["front"] = new function() {
	this.init = function(scene) {
		scene.page_color = "bordeaux";
		scene.resized = function() {
			if(this.video) {
				u.as(this.video, "height", Math.round(this.video.offsetWidth/16*9) + "px", false);
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.entered = function() {
			if(this.is_rendered) {
			}
			this.resized();
		}
		scene.exiting = function() {
			page.ejectVideoPlayer();
		}
		scene.ready = function() {
			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;
			var scale = {
				"h1":{
					"unit":"px",
					"min_size":30,
					"min_width":600,
					"max_size":46,
					"max_width":960
				},
				"p.en":{
					"unit":"px",
					"min_size":14,
					"min_width":600,
					"max_size":20,
					"max_width":960
				},
				"p.ja":{
					"unit":"px",
					"min_size":11,
					"min_width":600,
					"max_size":16,
					"max_width":960
				}
			};
			u.textscaler(this, scale);
			this.video = u.ie(this, "div", {"class": "video"});
			this.video.scene = this;
			u.as(this.video, "height", Math.round(this.video.offsetWidth/16*9) + "px");
			this.transitioned = function() {
				u.a.transition(this, "none");
				this.is_ready = true;
				u.ac(this, "ready");
				page.cN.ready();
			}
			if(this == page.current_scene) {
				u.a.transition(this, "opacity 0.6s ease-in");
				u.a.setOpacity(this, 1);
			}
			else {
				u.as(this, "display", "none");
				u.a.setOpacity(this, 1);
				this.transitioned();
			}
		}
		scene.build = function() {
			if(!this.is_built) {
				this.is_built = true;
				this.video.loaded = function(queue) {
					this.image = u.ae(this, "img", {"src":queue[0].image.src});
					this.image.scene = this.scene;
					u.a.setOpacity(this.image, 0);
					u.a.scale(this.image, 1.04);
					this.image.transitioned = function() {
						u.a.removeTransform(this);
						u.a.transition(this, "none");
						this.scene.is_rendered = true;
						this.scene.logo = u.ie(this.scene, "div", {"class":"logo"});
						var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
						svg.setAttributeNS(null, "viewBox", "-1, -1, 154, 154");
						svg.setAttributeNS(null, "width", "50%");
						var p = document.createElementNS("http://www.w3.org/2000/svg", "path");
						p.setAttributeNS(null, "d", "M76,0C34.1,0,0,34.1,0,76c0,41.9,34.1,76,76,76c41.9,0,76-34.1,76-76C152,34.1,117.9,0,76,0z");
						p.setAttributeNS(null, "class", "logo_stroke");
						svg.appendChild(p);
						p = document.createElementNS('http://www.w3.org/2000/svg',"path");
						p.setAttributeNS(null, "d", "M131.5,65.3c2.8,3.3,4.4,7.6,4.4,12c0,10.2-8.3,18.5-18.5,18.5c-10.2,0-18.5-8.3-18.5-18.5c0-10.2,8.3-18.5,18.5-18.5c3.4,0,6.8,0.9,9.9,2.8");
						p.setAttribute("class", "logo_stroke");
						svg.appendChild(p);
						p = document.createElementNS('http://www.w3.org/2000/svg',"path");
						p.setAttributeNS(null, "d", "M20.5,89.4c-2.8-3.3-4.4-7.5-4.4-12c0-10.2,8.3-18.5,18.5-18.5c10.2,0,18.5,8.3,18.5,18.5c0,10.2-8.3,18.5-18.5,18.5c-3.4,0-6.8-0.9-9.8-2.8");
						p.setAttribute("class", "logo_stroke");
						svg.appendChild(p);
						p = document.createElementNS('http://www.w3.org/2000/svg',"path");
						p.setAttributeNS(null, "d", "M72.7,77.3c-5.1,0-9.3,4.1-9.3,9.3c0,5.1,4.1,9.3,9.3,9.3c3.2,0,6.1-1.6,7.7-4.2");
						p.setAttribute("class", "logo_stroke");
						svg.appendChild(p);
						p = document.createElementNS('http://www.w3.org/2000/svg',"path");
						p.setAttributeNS(null, "d", "M91.3,77.3c-2.9,0-18.6,0-18.6,0c-5.1,0-9.3-4.1-9.3-9.3c0-5.1,4.1-9.3,9.3-9.3c3.2,0,6.1,1.6,7.7,4.2");
						p.setAttribute("class", "logo_stroke");
						svg.appendChild(p);
						p = document.createElementNS('http://www.w3.org/2000/svg',"line");
						p.setAttributeNS(null, "x1", "85");
						p.setAttributeNS(null, "y1", "71.4");
						p.setAttributeNS(null, "x2", "85");
						p.setAttributeNS(null, "y2", "83.2");
						p.setAttribute("class", "logo_stroke");
						svg.appendChild(p);
						this.scene.logo.appendChild(svg);
						this.scene.logo.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.setOpacity(this.scene.logo, 0);
						u.a.transition(this.scene.logo, "all 0.6s ease-in-out 0.6s");
						u.a.setOpacity(this.scene.logo, 1);
						// 
					}
					u.a.transition(this.image, "all 1s ease-out");
					u.a.setOpacity(this.image, 1);
					u.a.scale(this.image, 1);
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}
				}
				u.preloader(this.video, ["/img/front_poster.jpg"]);
				// 	
				// 		
			}
		}
		scene.destroy = function() {
			this.destroy = null;
		}
		scene.ready();
	}
}


/*i-work-tablet.js*/
Util.Objects["work"] = new function() {
	this.init = function(scene) {
		scene.page_color = "green";
		scene.resized = function() {
			if(this.project && typeof(this.project.resized) == "function") {
				this.project.resized();
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
			if(this.projects) {
				var i, node;
				for(i = 0; node = this.projects[i]; i++) {
					if(!node.is_loaded && node.offsetTop < page.scrolled_y + 600) {
						this.loadImage(node);
					}
				}
			}
		}
		scene.entered = function() {
			this.resized();
		}
		scene.exiting = function() {
			page.ejectVideoPlayer();
		}
		scene.ready = function() {
			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;
			this.project = u.qs(".project");
			if(this.project) {
				page.nN.nodes[2].url = u.h.getCleanUrl(location.href);
			}
			var i, node;
			this.projects = u.qsa(".item", scene);
			for(i = 0; node = this.projects[i]; i++) {
				node._image_available = u.cv(node, "format");
				node._image_version = u.cv(node, "variant");
				node._image_id = u.cv(node, "id");
				node.image = u.ie(node, "div", ({"class": "image"}));
				node.image.img = u.ae(node.image, "img", ({"src":"/img/blank_16x9.png"}));
				u.ce(node, {"type":"link"});
			}
			this.transitioned = function() {
				u.a.transition(this, "none");
				this.is_ready = true;
				u.ac(this, "ready");
				page.cN.ready();
			}
			if(this == page.current_scene) {
				u.a.transition(this, "opacity 0.6s ease-in");
				u.a.setOpacity(this, 1);
			}
			else {
				u.as(this, "display", "none");
				u.a.setOpacity(this, 1);
				this.transitioned();
			}
		}
		scene.navigate = function(url) {
			this.response = function(response) {
				if(response) {
					this.project = u.qs(".project", response);
					this.transitioned = function(event) {
						u.a.transition(this, "none");
						window.scrollTo(0, 0);
						var existing_project = u.qs(".project", this);
						if(existing_project) {
							this.removeChild(existing_project);
						}
						if(this.project) {
							this.project = u.ie(this, this.project);
							u.init(this);
						}
						this.transitioned = function(event) {
							u.a.transition(this, "none");
						}
						u.a.transition(this, "all 0.4s ease-in-out");
						u.a.setOpacity(this, 1);
					}
					u.a.transition(this, "all 0.4s ease-in-out");
					u.a.setOpacity(this, 0);
				}
			}
			if(url.match(/work\/(.+)/)) {
				u.request(this, url);
				page.nN.nodes[2].url = url;
			}
			else if(u.qs(".project", this)) {
				this.response(document.createElement("div"));
				page.nN.nodes[2].url = url;
			}
		}
		scene.loadImage = function(node) {
			node.is_loaded = true;
			node.image.loaded = function(queue) {
				u.a.setOpacity(this.img, 0);
				u.a.scale(this.img, 1.04);
				this.img.src = queue[0].image.src;
				this.img.transitioned = function() {
					u.a.removeTransform(this);
					u.a.transition(this, "none");
				}
				u.a.transition(this.img, "all 1s ease-out");
				u.a.setOpacity(this.img, 1);
				u.a.scale(this.img, 1);
			}
			u.preloader(node.image, ["/images/"+node._image_id+"/"+ node._image_version +"/480x."+node._image_available])
		}
		scene.build = function() {
			if(!this.is_built) {
				this.is_built = true;
				if(typeof(this.built) == "function") {
					this.built();
				}
				var node, i;
				for(i = 0; node = this.projects[i]; i++) {
					if(node._image_available) {
						if(!node.is_loaded && node.offsetTop < u.scrollY() + 600) {
							this.loadImage(node);
						}
						var _over = function() {
							this.transitioned = function() {
								this.removeAttribute("style");
							}
							u.a.transition(this, "all 0.15s linear");
							u.ac(this, "hover");
						}
						var _out = function() {
							this.transitioned = function() {
								this.removeAttribute("style");
							}
							u.a.transition(this, "all 0.15s linear");
							u.rc(this, "hover");
						}
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(node, "mouseover", _over);
							u.e.addEvent(node, "mouseout", _out);
						}
						else {
							u.e.addEvent(node, "touchstart", _over);
							u.e.addEvent(node, "touchend", _out);
						}
					}
				}
				this.resized();
				this.is_rendered = true;
			}
		}
		scene.destroy = function() {
			this.destroy = null;
		}
		scene.ready();
	}
}


/*i-about-tablet.js*/
Util.Objects["about"] = new function() {
	this.init = function(scene) {
		scene.page_color = "blue";
		scene.resized = function() {
			if(this.quotes) {
				var i, quote;
				for(i = 0; quote = this.quotes[i]; i++) {
					if(i > 0) {
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px", false);
					}
				}
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.entered = function() {
			this.resized();
		}
		scene.exiting = function() {
			page.ejectVideoPlayer();
		}
		scene.ready = function() {
			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;
			var scale = {
				" > div > p":{
					"unit":"px",
					"min_size": 14,
					"min_width":600,
					"max_size": 20,
					"max_width":960
				},
				" > div.ja > p":{
					"unit":"px",
					"min_size": 11,
					"min_width":600,
					"max_size": 16,
					"max_width":960
				},
				" .quote h3":{
					"unit":"px",
					"min_size": 16,
					"min_width":600,
					"max_size": 22,
					"max_width":960
				},
				" .quote p":{
					"unit":"px",
					"min_size": 12,
					"min_width":600,
					"max_size": 16,
					"max_width":960
				},
				".quote dd":{
					"unit":"px",
					"min_size": 12,
					"min_width":600,
					"max_size": 16,
					"max_width":960
				},
				".video dd":{
					"unit":"px",
					"min_size": 16,
					"min_width":600,
					"max_size": 22,
					"max_width":960
				}
			};
			u.textscaler(this, scale);
			this.video = u.qs(".video", this);
			this.video.scene = this;
			this.info = u.wc(this.video, "div", {"class": "info"});
			this.va = u.wc(this.info, "div", {"class": "va"});
			this.vb = u.wc(this.va, "div", {"class": "vb"});
			this.play = u.ae(this.vb, "div", {"class": "play"});
			this.video.image = u.ae(this.video, "img", {"src":"/img/blank_16x9.png"});
			this.play.video_node = this.video;
			this.play.info = this.info;
			this.play.scene = this;
			this.play.play = this.play;
			this.persons = u.qsa("ul.people li.person", this);
			if(this.persons.length == 2) {
				this.person_1_image = u.ae(u.ie(this.persons[0], "div", {"class":"image"}), "img", {"src":"/img/blank_16x9.png"});
				this.person_2_image = u.ae(u.ie(this.persons[1], "div", {'class':'image'}), "img", {"src":"/img/blank_16x9.png"});
			}
			var quote_list = u.qs("ul.quotes", this);
			var li, quote, i;
			li = u.ie(quote_list, "li", {"class":"image"});
			this.quote_2_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});
			this.quote_3_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});
			li = u.ie(quote_list, "li", {"class":"image"});
			this.quote_1_image = u.ae(li, "img", {"src":"/img/blank_16x9.png"});
			li = u.ae(quote_list, "li", {"class":"image"});
			this.quote_4_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});
			this.quotes = u.qsa("li", quote_list);
			for(i = 0; quote = this.quotes[i]; i++) {
				u.ac(quote, "i"+i);
				if(i > 0) {
					if(i == 2 || i == 3) {
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px");
						this.vb = u.wc(quote, "div", {"class":"vb"});
						this.va = u.we(this.vb, "div", {"class":"va"});
					}
					else {
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px");
					}
				}
			}
			this.transitioned = function() {
				u.a.transition(this, "none");
				this.is_ready = true;
				u.ac(this, "ready");
				page.cN.ready();
			}
			if(this == page.current_scene) {
				u.a.transition(this, "opacity 0.6s ease-in");
				u.a.setOpacity(this, 1);
			}
			else {
				u.as(this, "display", "none");
				u.a.setOpacity(this, 1);
				this.transitioned();
			}
		}
		scene.build = function() {
			if(!this.is_built) {
				this.is_built = true;
				this.video.loaded = function(queue) {
					this.image.src = queue[0].image.src;
					this.image.scene = this.scene;
					u.a.setOpacity(this.image, 0);
					u.a.scale(this.image, 1.04);
					this.image.transitioned = function() {
						u.a.transition(this, "none");
						u.a.removeTransform(this);
						this.scene.rendered = true;
					}
					u.a.transition(this.image, "all 1s ease-out");
					u.a.setOpacity(this.image, 1);
					u.a.scale(this.image, 1);
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}
				}
				u.preloader(this.video, ["/img/about_video.jpg"]);
				u.ce(this.play);
				this.play.clicked = page._bn_play_clicked;
				this.play.url = "/video/about_video.mp4";
				this.play.mouseover = function(event) {
					u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
					u.a.scale(this, 0.86);
					u.e.removeEvent(this, "mouseover", this.mouseover);
					u.e.addEvent(this, "mouseout", this.mouseout);
				}
				this.play.mouseout = function(event) {
					this.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.scale(this, 1);
					u.e.addEvent(this, "mouseover", this.mouseover);
					u.e.removeEvent(this, "mouseout", this.mouseout);
				}
				u.e.addEvent(this.play, "mouseover", this.play.mouseover);
				this.initPeopleLinks = function(person) {
					var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
					shape.setAttributeNS(null, "points", "0,0 4,2.5 0,5");
					shape.setAttributeNS(null, "fill", "none");
					shape.setAttributeNS(null, "stroke", "none");
					shape = svg.appendChild(shape);
					var _over = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
							this.polygon.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.a.transition(this.bn, "none");
						u.a.transition(this.polygon, "none");
						u.ac(this, "hover");
					}
					var _out = function() {
						this.transitioned = function() {
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
							this.polygon.removeAttribute("style");
						}
						u.a.transition(this, "all 0.15s linear");
						u.a.transition(this.bn, "none");
						u.a.transition(this.polygon, "none");
						u.rc(this, "hover");
					}
					var i, action;
					var actions = u.qsa(".contact dd.email,.contact dd.linkedin", person);
					for(i = 0; action = actions[i]; i++) {
						u.ae(action, svg.cloneNode(true));
						action.polygon = u.qs("polygon", action);
						action.bn = u.qs("a", action);
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(action, "mouseover", _over);
							u.e.addEvent(action, "mouseout", _out);
						}
						else {
							u.e.addEvent(action, "touchstart", _over);
							u.e.addEvent(action, "touchend", _out);
						}
					}
				}
				this.person_1_image.loaded = page._image_loaded;
				u.preloader(this.person_1_image, ["/img/about_cd.jpg"]);
				this.initPeopleLinks(this.persons[0]);
				this.person_2_image.loaded = page._image_loaded;
				u.preloader(this.person_2_image, ["/img/about_ceo.jpg"]);
				this.initPeopleLinks(this.persons[1]);
				this.quote_1_image.loaded = page._image_loaded;
				u.preloader(this.quote_1_image, ["/img/about_quote1.jpg"]);
				this.quote_2_image.loaded = page._image_loaded;
				u.preloader(this.quote_2_image, ["/img/about_quote2.jpg"]);
				this.quote_3_image.loaded = page._image_loaded;
				u.preloader(this.quote_3_image, ["/img/about_quote3.jpg"]);
				this.quote_4_image.loaded = page._image_loaded;
				u.preloader(this.quote_4_image, ["/img/about_quote4.jpg"]);
			}
		}
		scene.destroy = function() {
			this.destroy = null;
		}
		scene.ready();
	}
}


/*i-expertise-tablet.js*/
Util.Objects["expertise"] = new function() {
	this.init = function(scene) {
		scene.page_color = "brown";
		scene.resized = function() {
			if(this.service_text) {
				u.as(this.service_text, "height", this.service_image.img.offsetHeight + "px", false);
			}
			this.offsetHeight;
		}
		scene.scrolled = function() {
		}
		scene.entered = function() {
			this.resized();
		}
		scene.exiting = function() {
			page.ejectVideoPlayer();
		}
		scene.ready = function() {
			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;
			var scale = {
				" > div > p":{
					"unit":"px",
					"min_size": 14,
					"min_width":600,
					"max_size": 20,
					"max_width":960
				},
				" > div.ja > p":{
					"unit":"px",
					"min_size": 12,
					"min_width":600,
					"max_size": 16,
					"max_width":960
				},
				" .service h2":{
					"unit":"px",
					"min_size": 16,
					"min_width":600,
					"max_size": 22,
					"max_width":960
				},
				" .service p":{
					"unit":"px",
					"min_size": 12,
					"min_width":600,
					"max_size": 16,
					"max_width":960
				},
				".video dd":{
					"unit":"px",
					"min_size": 16,
					"min_width":600,
					"max_size": 22,
					"max_width":960
				}
			};
			u.textscaler(this, scale);
			var i, tags, tag, va, vb, node, p = [];
			this.image = u.ie(this, "div", {'class':'image'});
			this.image.img = u.ae(this.image, "img", {"src":"/img/blank_16x9.png"});
			this.image.scene = this;
			this.image.img.scene = this;
			this.service = u.qs(".service", this);
			this.service_text = u.wc(this.service, "div", {"class": "text"});
			va = u.wc(this.service_text, "div", ({"class": "va"}));
			vb = u.wc(va, "div", ({"class": "vb"}));
			tags = u.qsa("ul.tags li", this.service);
			for(i = 0; tag = tags[i]; i++) {
				p.push(u.text(tag));
			}
			u.ae(vb, "p", {"html":p.join(", ")});
			this.service_image = u.ae(this.service, "div", {'class':'image'});
			this.service_image_mask = u.ae(this.service_image, "div", {"class":"mask"});
			this.service_image.img = u.ae(this.service_image_mask, "img");
			this.service_image.img.service_text = this.service_text;
			this.service_image.img.loaded = function(queue) {
				this.src = queue[0].image.src;
				u.as(this.service_text, "height", this.offsetHeight + "px", false);
			}
			u.preloader(this.service_image.img, ["/img/blank_8x9.png"]);
			this.videos = u.qsa(".video", this);
			for(i = 0; node = this.videos[i]; i++) {
				if(i == 0) {
					u.as(node, "marginTop", "50px");
				}
				node.info = u.wc(node, "div", {"class": "info"});
				va = u.wc(node.info, "div", {"class": "va"});
				vb = u.wc(va, "div", {"class": "vb"});
				node.play = u.ae(vb, "div", {"class": "play"});
				node.play.video_node = node;
				node.play.info = node.info;
				node.play.play = node.play;
				node.play.scene = this;
			}
			this.transitioned = function() {
				u.a.transition(this, "none");
				this.is_ready = true;
				u.ac(this, "ready");
				page.cN.ready();
			}
			if(this == page.current_scene) {
				u.a.transition(this, "opacity 0.6s ease-in");
				u.a.setOpacity(this, 1);
			}
			else {
				u.as(this, "display", "none");
				u.a.setOpacity(this, 1);
				this.transitioned();
			}
		}
		scene.build = function() {
			if(!this.is_built) {
				this.is_built = true;
				this.image.loaded = function(queue) {
					this.img.src = queue[0].image.src;
					u.a.setOpacity(this.img, 0);
					u.a.scale(this.img, 1.04);
					this.img.transitioned = function() {
						u.a.transition(this, "none");
						u.a.removeTransform(this);
						this.scene.rendered = true;
					}
					u.a.transition(this.img, "all 1s ease-out");
					u.a.setOpacity(this.img, 1);
					u.a.scale(this.img, 1);
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}
				}
				u.preloader(this.image, ["/img/expertise1.jpg"]);
				this.service_image.img.loaded = page._image_loaded;
				u.preloader(this.service_image.img, ["/img/expertise2.jpg"]);
				var i, node;
				for(i = 0; node = this.videos[i]; i++) {
					node.loaded = function(queue) {
						u.as(this, "backgroundImage", "url("+ queue[0].image.src +")");
					}
					u.preloader(node, ["/img/expertise_video_"+(i+1)+".jpg"]);
					u.ce(node.play);
					node.play.clicked = page._bn_play_clicked;
					node.play.url = "/video/expertise_video_"+(i+1)+".mp4";
					node.play.mouseover = function(event) {
						u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
						u.a.scale(this, 0.86);
						u.e.removeEvent(this, "mouseover", this.mouseover);
						u.e.addEvent(this, "mouseout", this.mouseout);
					}
					node.play.mouseout = function(event) {
						this.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.scale(this, 1);
						u.e.addEvent(this, "mouseover", this.mouseover);
						u.e.removeEvent(this, "mouseout", this.mouseout);
					}
					u.e.addEvent(node.play, "mouseover", node.play.mouseover);
				}
			}
		}
		scene.destroy = function() {
			this.destroy = null;
		}
		scene.ready();
	}
}


/*i-project-desktop.js*/
Util.Objects["project"] = new function() {
	this.init = function(project) {
		project.resized = function() {
			if(this.text_mask && this.i1) {
				u.as(this.text_mask, "height", this.i1.offsetHeight+"px", false);
			}
		}
		project.ready = function() {
			var scale = {
				"h1":{
					"unit":"px",
					"min_size":30,
					"min_width":600,
					"max_size":46,
					"max_width":960
				},
				"h2":{
					"unit":"px",
					"min_size":14,
					"min_width":600,
					"max_size":20,
					"max_width":960
				},
				"h3":{
					"unit":"px",
					"min_size":14,
					"min_width":600,
					"max_size":20,
					"max_width":960
				},
				".en p":{
					"unit":"px",
					"min_size":14,
					"min_width":600,
					"max_size":20,
					"max_width":960
				},
				".ja p":{
					"unit":"px",
					"min_size":12,
					"min_width":600,
					"max_size":16,
					"max_width":960
				}
			};
			u.textscaler(this, scale);
			var image_i1 = u.qs(".image.i1", this);
			var image_i2 = u.qs(".image.i2", this);
			var image_i3 = u.qs(".image.i3", this);
			var image_i4 = u.qs(".image.i4", this);
			var image_i5 = u.qs(".image.i5", this);
			var image_i6 = u.qs(".image.i6", this);
			var video = u.qs(".video", this);
			var img, node, vb, va, i, svg, shape;
			var sharing = u.qs("div.sharing", this);
			var h1 = u.qs("h1", this);
			this.insertBefore(sharing, h1);
			var ref_grid = u.qs("ul.grid", this);
			var grid = u.ae(this, "ul", {"class":"media"});
			this.insertBefore(grid, ref_grid);
			sharing.h4 = u.qs("h4", sharing);
			sharing.h4_span = u.qs("h4 span", sharing);
			sharing.ul = u.qs("ul", sharing);
			sharing.over = function() {
				u.t.resetTimer(this.t_close);
				this.open = true;
				this.ul.transitioned = function() {
					this.removeAttribute("style");
				}
				u.a.transition(this.ul, "all 0.3s ease-in-out");
				u.ac(this, "hover");
			}
			sharing.out = function() {
				this.t_close = u.t.setTimer(this, this.close, 500);
			}
			sharing.close = function() {
				this.open = false;
				u.t.resetTimer(this.t_close);
				this.ul.transitioned = function() {
					this.removeAttribute("style");
				}
				u.a.transition(this.ul, "all 0.15s linear");
				u.rc(this, "hover");
			}
			sharing.toggle = function() {
				if(this.open) {
					this.close();
				}
				else {
					this.over();
				}
			}
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(sharing, "mouseover", sharing.over);
				u.e.addEvent(sharing, "mouseout", sharing.out);
			}
			else {
				u.e.addEvent(sharing, "touchstart", sharing.toggle);
			}
			var _over = function() {
				this.transitioned = function() {
					this.removeAttribute("style");
					this.bn.removeAttribute("style");
				}
				u.a.transition(this, "all 0.15s linear");
				u.a.transition(this.bn, "none");
				u.ac(this, "hover");
			}
			var _out = function() {
				this.transitioned = function() {
					this.removeAttribute("style");
					this.bn.removeAttribute("style");
				}
				u.a.transition(this, "all 0.15s linear");
				u.a.transition(this.bn, "none");
				u.rc(this, "hover");
			}
			var shares = u.qsa("li", sharing);
			for(i = 0; node = shares[i]; i++) {
				node.bn = u.qs("a", node);
				node.clicked = function() {
					u.bug(this.url);
					window.open(this.url,'_blank');	
				}
				u.ce(node);
				if(u.e.event_pref == "mouse") {
					u.e.addEvent(node, "mouseover", _over);
					u.e.addEvent(node, "mouseout", _out);
				}
				else {
					u.e.addEvent(node, "touchstart", _over);
					u.e.addEvent(node, "touchend", _out);
				}
			}
			if(image_i1) {
				img = u.ae(image_i1, "img", {"src":"/img/blank_16x9.png"});
				image_i1._id = u.cv(image_i1, "item_id");
				image_i1._variant = u.cv(image_i1, "variant");
				image_i1._format = u.cv(image_i1, "format");
				img.loaded = function(queue) {
					u.a.setOpacity(this, 0);
					u.a.scale(this, 1.04);
					this.src = queue[0].image.src;
					this.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.transition(this, "all 1s ease-out");
					u.a.setOpacity(this, 1);
					u.a.scale(this, 1);
				}
				u.preloader(img, ["/images/"+image_i1._id+"/"+image_i1._variant+"/960x."+image_i1._format]);
			}
			if(image_i2 && image_i3) {
				image_i2._id = u.cv(image_i2, "item_id");
				image_i2._variant = u.cv(image_i2, "variant");
				image_i2._format = u.cv(image_i2, "format");
				image_i3._id = u.cv(image_i3, "item_id");
				image_i3._variant = u.cv(image_i3, "variant");
				image_i3._format = u.cv(image_i3, "format");
				node = u.ae(u.ae(grid, "li", {"class":"i2"}), "div", {"class":"image_mask"});
				img = u.ae(node, "img", {"src":"/img/blank_16x9.png"});
				img._node = node;
				img._text_mask = text_mask;
				img.pageImageLoaded = function() {
					u.as(this._text_mask, "height", this._node.offsetHeight+ "px");
				}
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+image_i2._id+"/"+image_i2._variant+"/480x."+image_i2._format]);
				img = u.ae(node, "img", {"src":"/img/blank_16x9.png"});
				img._node = node;
				img._text_mask = text_mask;
				img.pageImageLoaded = function() {
					u.as(this._text_mask, "height", this._node.offsetHeight+ "px");
				}
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+image_i3._id+"/"+image_i3._variant+"/480x."+image_i3._format]);
				var text_mask = u.ae(u.ae(grid, "li", {"class": "text_box"}), "div", {"class":"text_mask"});
				var scope = u.qs("div.scope", this);
				if(scope) {
					u.ae(text_mask, scope);
				}
				var credit = u.qs("div.credits", this);
				if(credit) {
					credit = u.ae(text_mask, credit);
				}
				vb = u.wc(text_mask, "div", {"class": "vb"});
				va = u.we(vb, "div", {"class": "va"});
				u.as(text_mask, "height", node.offsetHeight+ "px");
				this.i1 = node;
				this.text_mask = text_mask;
			}
			if(video) {
				video._id = u.cv(video, "item_id");
				video._poster_format = u.cv(video, "poster_format");
				video._video_format = u.cv(video, "video_format");
				node = u.ae(grid, "li", {"class":"video"});
				node.info = u.ae(node, "div", {"class": "info"});
				va = u.wc(node.info, "div", {"class": "va"});
				vb = u.wc(va, "div", {"class": "vb"});
				node.play = u.ae(vb, "div", {"class": "play"});
				node.play.video_node = node;
				node.play.info = node.info;
				node.play.scene = page.cN.scene;
				node.play.play = node.play;
				node.play.url = "/videos/"+video._id+"/video/960x."+video._video_format
				u.ce(node.play);
				node.play.clicked = page._bn_play_clicked;
				node.play.mouseover = function(event) {
					u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
					u.a.scale(this, 0.86);
					u.e.removeEvent(this, "mouseover", this.mouseover);
					u.e.addEvent(this, "mouseout", this.mouseout);
				}
				node.play.mouseout = function(event) {
					this.transitioned = function() {
						u.a.transition(this, "none");
					}
					u.a.scale(this, 1);
					u.e.addEvent(this, "mouseover", this.mouseover);
					u.e.removeEvent(this, "mouseout", this.mouseout);
				}
				u.e.addEvent(node.play, "mouseover", node.play.mouseover);
				img = u.ae(node, "img", {"src":"/img/blank_16x9.png"});
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+video._id+"/poster/960x."+video._poster_format]);
			}
			if(image_i4 && image_i5) {
				image_i4._id = u.cv(image_i4, "item_id");
				image_i4._variant = u.cv(image_i4, "variant");
				image_i4._format = u.cv(image_i4, "format");
				image_i5._id = u.cv(image_i5, "item_id");
				image_i5._variant = u.cv(image_i5, "variant");
				image_i5._format = u.cv(image_i5, "format");
				node = u.ae(u.ae(grid, "li", {"class":"i4"}), "div", {"class":"image_mask"});
				img = u.ae(node, "img", {"src":"/img/blank_16x9.png"});
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+image_i4._id+"/"+image_i4._variant+"/960x."+image_i4._format]);
				node = u.ae(u.ae(grid, "li", {"class":"i5"}), "div", {"class":"image_mask"});
				img = u.ae(node, "img", {"src":"/img/blank_16x9.png"});
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+image_i5._id+"/"+image_i5._variant+"/960x."+image_i5._format]);
			}
			if(image_i6) {
				img = u.ae(image_i6, "img", {"src":"/img/blank_16x9.png"});
				image_i6._id = u.cv(image_i6, "item_id");
				image_i6._variant = u.cv(image_i6, "variant");
				image_i6._format = u.cv(image_i6, "format");
				img.loaded = page._image_loaded;
				u.preloader(img, ["/images/"+image_i6._id+"/"+image_i6._variant+"/960x."+image_i6._format]);
			}
			page.injectFullStop(this);
		}
		project.ready();
	}
}


/*i-newsletter-desktop.js*/
Util.Objects["newsletter"] = new function() {
	this.init = function(div) {
		div.form = u.qs("form", div);
		div.form.div = div;
		u.f.init(div.form);
		div.form._email = u.qs(".field.email input", div.form);
		div.form._name = u.qs(".field.string input", div.form);
		var actions = u.qs(".actions", div.form);
		actions.bn = u.qs("input", actions);
		var _over = function() {
			this.transitioned = function() {
				this.removeAttribute("style");
				this.bn.removeAttribute("style");
			}
			u.a.transition(this, "all 0.15s linear");
			u.a.transition(this.bn, "none");
			u.ac(this, "hover");
		}
		var _out = function() {
			this.transitioned = function() {
				this.removeAttribute("style");
				this.bn.removeAttribute("style");
			}
			u.a.transition(this, "all 0.15s linear");
			u.a.transition(this.bn, "none");
			u.rc(this, "hover");
		}
		if(u.e.event_pref == "mouse") {
			u.e.addEvent(actions, "mouseover", _over);
			u.e.addEvent(actions, "mouseout", _out);
		}
		else {
			u.e.addEvent(actions, "touchstart", _over);
			u.e.addEvent(actions, "touchend", _out);
		}
		div.form.submitted = function() {
			this.div.response = function(response) {
				u.t.resetTimer(this.t_timeout_error);
				this.receipt = u.ae(this, "div", {"class":"receipt"});
				if(response && response.Status && response.Status == 200) {
					u.ae(this.receipt, "h2", {"html":"Thank you for signing up to our newsletter. You'll hear from us soon."});
					this.form._email.used = false;
					this.form._email.val(this.form._email.default_value);
					this.form._name.used = false;
					this.form._name.val(this.form._name.default_value);
				}
				else {
					u.ae(this.receipt, "h2", {"html":"An error occured. Please check your information."});
				}
				this.receipt.form = this.form;
				u.a.setOpacity(this.receipt, 0);
				u.a.transition(this.receipt, "opacity 0.4s linear 0.3s");
				u.a.setOpacity(this.receipt, 1);
				this.restoreForm = function() {
					this.receipt.transitioned = function() {
						this.parentNode.removeChild(this);
					}
					u.a.transition(this.receipt, "opacity 0.3s");
					u.a.setOpacity(this.receipt, 0);
					u.a.transition(this.form, "opacity 0.3s linear 0.4s");
					u.a.setOpacity(this.form, 1);
				}
				u.t.setTimer(this, this.restoreForm, 5000);
			}
			this.div.response({"Status":200});
//			u.request(this.div, this.action, {"params":u.f.getParams(this), "method":"script"});
			this.div.t_timeout_error = u.t.setTimer(this.div, this.div.response, 5000);
			this.transitioned = function() {
				u.a.transition(this, "none");
			}
			u.a.transition(this, "opacity 0.3s");
			u.a.setOpacity(this, 0);
		}
	}
}


/*ga.js*/
u.ga_account = 'UA-20279967-1';
u.ga_domain = 'oeo.dk';


/*u-googleanalytics.js*/
if(u.ga_account) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
    ga('create', u.ga_account, u.ga_domain);
    ga('send', 'pageview');
	u.stats = new function() {
		this.pageView = function(url) {
			ga('send', 'pageview', url);
		}
		this.event = function(node, action, label) {
			ga('_trackEvent', location.href.replace(document.location.protocol + "//" + document.domain, ""), action, (label ? label : this.nodeSnippet(node)));
		}
		this.customVar = function(slot, name, value, scope) {
			//       slot,		
			//       name,		
			//       value,	
			//       scope		
		}
		this.nodeSnippet = function(e) {
			if(e.textContent != undefined) {
				return u.cutString(e.textContent.trim(), 20) + "(<"+e.nodeName+">)";
			}
			else {
				return u.cutString(e.innerText.trim(), 20) + "(<"+e.nodeName+">)";
			}
		}
	}
}

