Util.Objects["about"] = new function() {
	this.init = function(scene) {
		//u.bug("about");
		window.location.href = window.location.protocol + "//" + window.location.host;
	}
}

Util.Objects["column"] = new function() {
	this.init = function(scene) {
		//u.bug("column");
		window.location.href = window.location.protocol + "//" + window.location.host;
	}
}

Util.Objects["work"] = new function() {
	this.init = function(scene) {
		//u.bug("work");
		window.location.href = window.location.protocol + "//" + window.location.host;
	}
}

Util.Objects["expertise"] = new function() {
	this.init = function(scene) {
		//u.bug("expertise");
		window.location.href = window.location.protocol + "//" + window.location.host;
	}
}


// Controlled initialization
// function static_init() {
// 	u.o.page.init(u.qs("#page"));
// }
// u.e.addDOMReadyEvent(static_init);

u.e.addDOMReadyEvent(u.init);
