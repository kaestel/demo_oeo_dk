Util.Objects["work"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.page_color = "green";


		// resize scene
		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			if(this.project && typeof(this.project.resized) == "function") {
				this.project.resized();
			}
			// refresh dom
			this.offsetHeight;
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))

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
//			u.bug("scene.entered:" + u.nodeId(this))
			
			this.resized();

//			page.setColor("green");
		}
		scene.exiting = function() {
//			u.bug("scene.exiting:" + u.nodeId(this))

			// eject video when scene is exiting
			page.ejectVideoPlayer();
		}

		// prepare scene to become visible
		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;

			// update navigation url for primary work link to reflect existing project
			this.project = u.qs(".project");
			if(this.project) {
				page.nN.nodes[2].url = u.h.getCleanUrl(location.href);
			}

			// enable project linking
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


			// show scene in pre-built state
			this.transitioned = function() {
				u.a.transition(this, "none");

				this.is_ready = true;

				u.ac(this, "ready");
				page.cN.ready();
			}
			u.a.transition(this, "opacity 0.6s ease-in");
			u.a.setOpacity(this, 1);
		}


		// navigate to second level
		scene.navigate = function(url) {
//			u.bug("scene navigation:" + url)

			this.response = function(response) {
				if(response) {

					// get project from response
					this.project = u.qs(".project", response);

					this.transitioned = function(event) {
						u.a.transition(this, "none");

						// scroll to top
						window.scrollTo(0, 0);

						// remove existing project
						var existing_project = u.qs(".project", this);
						if(existing_project) {
							this.removeChild(existing_project);
						}

						if(this.project) {
							// add new project
							this.project = u.ie(this, this.project);
							u.init(this);

						}


						// show
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

//			u.bug("view: " + url + ", " + url.match(/work\/(.+)/))
			if(url.match(/work\/(.+)/)) {
				u.request(this, url);

				// update navigation url for primary work link
				page.nN.nodes[2].url = url;
			}
			else if(u.qs(".project", this)) {
				this.response(document.createElement("div"));

				// update navigation url for primary work link
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
					u.a.transition(this, "none");
				}
				u.a.transition(this.img, "all 1s ease-out");
				u.a.setOpacity(this.img, 1);
				u.a.scale(this.img, 1);
			}
			u.preloader(node.image, ["/images/"+node._image_id+"/"+ node._image_version +"/x480."+node._image_available])
			
		}

		// load final details - scene has come into focus
		scene.build = function() {
//			u.bug("scene.build:" + u.nodeId(this));

			if(!this.is_built) {

				this.is_built = true;

//				page.setColor("green");


				if(typeof(this.built) == "function") {
					this.built();
				}

				var node, i;

				// load images
				for(i = 0; node = this.projects[i]; i++) {
					if(node._image_available) {
						// load image


						// load images if visible
						if(node.offsetTop < u.scrollY() + 600) {
							this.loadImage(node);
						}

						// apply hover to entire action element
						// var action = u.qs(".actions li", node);
						// action.bn = u.qs("a", action);

						// mouseover and -out handlers
						var _over = function() {
							this.transitioned = function() {
								// reinstate color transition
								this.removeAttribute("style");
//								this.bn.removeAttribute("style");
							}
							// overwrite color transition
							u.a.transition(this, "all 0.15s linear");
//							u.a.transition(this.bn, "none");
							u.ac(this, "hover");
						}
						var _out = function() {
							this.transitioned = function() {
								// reinstate color transition
								this.removeAttribute("style");
//								this.bn.removeAttribute("style");
							}
							// overwrite color transition
							u.a.transition(this, "all 0.15s linear");
//							u.a.transition(this.bn, "none");
							u.rc(this, "hover");
						}

						// apply appropriate event
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


		// destroy scene - scene no longer has focus
		scene.destroy = function() {
//			u.bug("scene.destroy:" + u.nodeId(this))

			// destruction is a one time, oneway street
			this.destroy = null;

		}


		// callback to scene ready
		scene.ready();

	}
}
