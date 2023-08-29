u.bug_console_only = true;

Util.Objects["page"] = new function() {
	this.init = function(page) {
		
		if(u.hc(page, "i:page")) {
			
			// header reference
			page.hN = u.qs("#header");

			// content reference
			page.cN = u.qs("#content");

			// navigation reference
			page.nN = u.qs("#navigation");
			//page.nN = u.ie(page.hN, page.nN);

			// footer reference
			page.fN = u.qs("#footer");

			// global resize handler 
			page.resized = function() {

			}



			// global scroll handler 
			page.scrolled = function() {

			}

			// Page is ready - called from several places, evaluates when page is ready to be shown
			page.ready = function() {
//				u.bug("page ready")

				// page is ready to be shown - only initalize if not already shown
				if(!u.hc(this, "ready")) {

					// page is ready
					u.addClass(this, "ready");


					// get current scene
					this.current_scene = u.qs(".scene", this.cN);


					// build navigation
					// this.initNavigation();

					// u.navigation(page);

					// init front
					this.initFront();

					// init footer
					this.initFooter();

					//u.init(this.current_scene);

					u.ae(this.current_scene, "div", ({"id": "logo"}));

					// set resize handler
					//u.e.addEvent(window, "resize", page.resized);
					// set scroll handler
					//u.e.addEvent(window, "scroll", page.scrolled);

					// resize / scroll straight away!
					//this.resized();
					//this.scrolled();
				}
			}

			// setup and activate Footer
			page.initFront = function() {
				// this.current_scene
				u.bug("init front");


				// top image
				this.image = u.ie(this.current_scene, "div", {"class": "image"});
				u.ae(this.image, "img", ({"src": "/img/front_poster.jpg"}))

				// link to desktop
				// this.desktop_link = u.ie(this.current_scene, "a", {"class": "desktop", "html": "Full desktop version"});
				// //this.desktop_link.href = window.location.protocol + "//" + window.location.host + "&segment=desktop";
				// this.desktop_link.href = "http://oeo.dk?segment=desktop";
				// this.desktop_link.clicked = function() {
				// 	window.open(this.url);
				// }
				// u.ce(this.desktop_link);
				
			}
			
			// setup and activate Footer
			page.initFooter = function() {

				// Load images to .offices
				// this.offices = u.qs("div.offices");
				
				// this.offices.li = u.qsa("li.vcard", this.offices);
				// var i, li;
				// for (i = 0; li = this.offices.li[i]; i++) {
				// 	// insert image
				// 	u.ie(li, "img", ({"src": "/img/temp_about_person.jpg"}));
				// }
				
			}


			// ready to start page builing process
			page.ready();

		}
	}
}


// Controlled initialization
function static_init() {
	u.o.page.init(u.qs("#page"));
}
u.e.addDOMReadyEvent(static_init);
