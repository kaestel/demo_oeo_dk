Util.Objects["about"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.page_color = "blue";


		// resize scene
		scene.resized = function() {
			// u.bug("scene.resized:" + u.nodeId(this));
			
			if(this.quotes) {
				// keep ratio 58/65
				var i, quote;
				for(i = 0; quote = this.quotes[i]; i++) {
					if(i > 0) {
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px", false);
					}
				}
			}

			// refresh dom
			this.offsetHeight;
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))

		}

		scene.entered = function() {
//			u.bug("scene.entered:" + u.nodeId(this))

			this.resized();

//			page.setColor("blue");
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


			// video container
			this.video = u.qs(".video", this);
			this.video.scene = this;

			// center title/play bn using table structure
			this.info = u.wc(this.video, "div", {"class": "info"});
			this.va = u.wc(this.info, "div", {"class": "va"});
			this.vb = u.wc(this.va, "div", {"class": "vb"});

			this.play = u.ae(this.vb, "div", {"class": "play"});


			this.video.image = u.ae(this.video, "img", {"src":"/img/blank_16x9.png"});

			// variables for centralized play button
			this.play.video_node = this.video;
			this.play.info = this.info;
			this.play.scene = this;
			this.play.play = this.play;

			// persons placeholders
			this.persons = u.qsa("ul.people li.person", this);
			if(this.persons.length == 2) {
				this.person_1_image = u.ae(u.ie(this.persons[0], "div", {"class":"image"}), "img", {"src":"/img/blank_16x9.png"});
				this.person_2_image = u.ae(u.ie(this.persons[1], "div", {'class':'image'}), "img", {"src":"/img/blank_16x9.png"});
			}

			var quote_list = u.qs("ul.quotes", this);
			var li, quote, i;

			// add extra li's with images
			li = u.ie(quote_list, "li", {"class":"image"});
			this.quote_2_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});
//			this.quote_2_image = u.ae(li, "img", {"src":"/img/blank_16x9.png"});
			this.quote_3_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});
//			this.quote_3_image = u.ae(li, "img", {"src":"/img/blank_16x9.png"});

			li = u.ie(quote_list, "li", {"class":"image"});
			this.quote_1_image = u.ae(li, "img", {"src":"/img/blank_16x9.png"});

			li = u.ae(quote_list, "li", {"class":"image"});
			this.quote_4_image = u.ae(u.ae(li, "div", {"class":"image"}), "img", {"src":"/img/blank_8x9.png"});

			// adjust quote sizes and content structure
			this.quotes = u.qsa("li", quote_list);
			for(i = 0; quote = this.quotes[i]; i++) {

				// add class
				u.ac(quote, "i"+i);

				// set height - center in height
				if(i > 0) {

					// text nodes
					if(i == 2 || i == 3) {

						// keep aspect ratio 58/65
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px");

						// vertical center
						this.vb = u.wc(quote, "div", {"class":"vb"});
						this.va = u.we(this.vb, "div", {"class":"va"});
					}
					// image nodes
					else {
						// keep aspect ratio 58/65
						u.as(quote, "height", Math.round(quote.offsetWidth/58*65) + "px");
					}
				}
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


		// load final details - scene has come into focus
		scene.build = function() {

			if(!this.is_built) {
//				u.bug("scene.build:" + u.nodeId(this));

				this.is_built = true;

//				page.setColor("blue");

				// load video image
				this.video.loaded = function(queue) {

					this.image.src = queue[0].image.src;
					this.image.scene = this.scene;

					// set pre-state of video
					u.a.setOpacity(this.image, 0);
					u.a.scale(this.image, 1.04);

					this.image.transitioned = function() {
						u.a.transition(this, "none");

						// rendering is done
						this.scene.rendered = true;
					}

					u.a.transition(this.image, "all 1s ease-out");
					u.a.setOpacity(this.image, 1);
					u.a.scale(this.image, 1);

					// callback when page building is done
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}
				}
				u.preloader(this.video, ["/img/about_video.jpg"]);


				// enable play button
				u.ce(this.play);
				this.play.clicked = page._bn_play_clicked;
				this.play.url = "/video/about_video.mp4";

				// over play
				this.play.mouseover = function(event) {
					u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
					u.a.scale(this, 0.86);

					u.e.removeEvent(this, "mouseover", this.mouseover);
					u.e.addEvent(this, "mouseout", this.mouseout);
				}
				// out play
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

					// create svg arrow
					var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
					shape.setAttributeNS(null, "points", "0,0 4,2.5 0,5");
					shape.setAttributeNS(null, "fill", "none");
					shape.setAttributeNS(null, "stroke", "none");
					shape = svg.appendChild(shape);

					// mouseover and -out handlers
					var _over = function() {
						this.transitioned = function() {
							// reinstate color transition
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
							this.polygon.removeAttribute("style");
						}
						// overwrite color transition
						u.a.transition(this, "all 0.15s linear");
						u.a.transition(this.bn, "none");
						u.a.transition(this.polygon, "none");
						u.ac(this, "hover");
					}
					var _out = function() {
						this.transitioned = function() {
							// reinstate color transition
							this.removeAttribute("style");
							this.bn.removeAttribute("style");
							this.polygon.removeAttribute("style");
						}
						// overwrite color transition
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

						// apply appropriate event
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

				// show person images
				this.person_1_image.loaded = page._image_loaded;
				u.preloader(this.person_1_image, ["/img/about_cd.jpg"]);
				this.initPeopleLinks(this.persons[0]);

				this.person_2_image.loaded = page._image_loaded;
				u.preloader(this.person_2_image, ["/img/about_ceo.jpg"]);
				this.initPeopleLinks(this.persons[1]);


				// load quote images
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
