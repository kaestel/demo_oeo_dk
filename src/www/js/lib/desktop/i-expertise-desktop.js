Util.Objects["expertise"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.page_color = "brown";


		// resize scene
		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));
			
			// resize height
			if(this.service_text) {
//				u.bug("this.service_image.img.offsetheight:" + this.service_image.img.offsetHeight)
				u.as(this.service_text, "height", this.service_image.img.offsetHeight + "px", false);
//				u.as(this.service_text, "height", Math.round(this.service_text.offsetWidth/58*65) + "px", false);
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

//			page.setColor("brown");
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

			// primary image
			this.image = u.ie(this, "div", {'class':'image'});
			this.image.img = u.ae(this.image, "img", {"src":"/img/blank_16x9.png"});
			this.image.scene = this;
			this.image.img.scene = this;

			// Service (make 2 columns)
			this.service = u.qs(".service", this);

			// Service tags - create divs to center text
			this.service_text = u.wc(this.service, "div", {"class": "text"});
			va = u.wc(this.service_text, "div", ({"class": "va"}));
			vb = u.wc(va, "div", ({"class": "vb"}));
			// render text
			tags = u.qsa("ul.tags li", this.service);
			for(i = 0; tag = tags[i]; i++) {
				p.push(u.text(tag));
			}
			u.ae(vb, "p", {"html":p.join(", ")});
//			u.as(this.service_text, "height", Math.round(this.service_text.offsetWidth/58*65) + "px");


			// Service image 
			this.service_image = u.ae(this.service, "div", {'class':'image'});
			this.service_image_mask = u.ae(this.service_image, "div", {"class":"mask"});

			this.service_image.img = u.ae(this.service_image_mask, "img");
			this.service_image.img.service_text = this.service_text;
			this.service_image.img.loaded = function(queue) {
				this.src = queue[0].image.src;
				u.as(this.service_text, "height", this.offsetHeight + "px", false);
			}
			u.preloader(this.service_image.img, ["/img/blank_8x9.png"]);
//			u.as(this.service_image, "height", Math.round(this.service_text.offsetWidth/58*65) + "px");


			// Videos
			this.videos = u.qsa(".video", this);
			for(i = 0; node = this.videos[i]; i++) {

				// adjust first node margin
				if(i == 0) {
					u.as(node, "marginTop", "50px");
				}

				// center title/play bn
				node.info = u.wc(node, "div", {"class": "info"});
				va = u.wc(node.info, "div", {"class": "va"});
				vb = u.wc(va, "div", {"class": "vb"});
				node.play = u.ae(vb, "div", {"class": "play"});

				// variables for centralized play button
				node.play.video_node = node;
				node.play.info = node.info;
				node.play.play = node.play;
				node.play.scene = this;
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

//				page.setColor("brown");


				// load main image
				this.image.loaded = function(queue) {

					this.img.src = queue[0].image.src;

					// set pre-state of video
					u.a.setOpacity(this.img, 0);
					u.a.scale(this.img, 1.04);

					this.img.transitioned = function() {
						u.a.transition(this, "none");

						// rendering is done
						this.scene.rendered = true;
					}

					u.a.transition(this.img, "all 1s ease-out");
					u.a.setOpacity(this.img, 1);
					u.a.scale(this.img, 1);

					// callback when page building is done
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}
				}
				u.preloader(this.image, ["/img/expertise1.jpg"]);


				// load service image
				this.service_image.img.loaded = page._image_loaded;
				u.preloader(this.service_image.img, ["/img/expertise2.jpg"]);


				var i, node;
				for(i = 0; node = this.videos[i]; i++) {

					//load video cover
					node.loaded = function(queue) {
						u.as(this, "backgroundImage", "url("+ queue[0].image.src +")");
					}
					u.preloader(node, ["/img/expertise_video_"+(i+1)+".jpg"]);


					u.ce(node.play);
					node.play.clicked = page._bn_play_clicked;
					//node.play.url = "/video/test_video.mp4";
					node.play.url = "/video/expertise_video_"+(i+1)+".mp4";

					// over play
					node.play.mouseover = function(event) {
						u.a.transition(this, "all 0.15s cubic-bezier(0.710, 0.000, 0.200, 0.995)");
						u.a.scale(this, 0.86);

						u.e.removeEvent(this, "mouseover", this.mouseover);
						u.e.addEvent(this, "mouseout", this.mouseout);
					}
					// out play
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
