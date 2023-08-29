Util.Objects["front"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.page_color = "bordeaux";


		// resize scene
		scene.resized = function() {
			// u.bug("scene.resized:" + u.nodeId(this));

			if(this.video) {
				u.as(this.video, "height", Math.round(this.video.offsetWidth/16*9) + "px", false);
			}

			// refresh dom
			this.offsetHeight;
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))


			if(this.logo) {
				var opacity = (200-page.scrolled_y) / 200;

//				u.bug("logo_y:" + logo_y)

				if(300 > page.scrolled_y) {
					u.as(this.logo, "top", 120+page.scrolled_y+"px", false);
					u.a.setOpacity(this.logo, opacity, false);
				}
				else {
					u.a.setOpacity(this.logo, 0, false);
				}

			}

		}

		scene.entered = function() {
//			u.bug("scene.entered:" + u.nodeId(this) + ", " + this.is_rendered)

			if(this.is_rendered) {
				u.ae(this.video, page.videoPlayer);
				u.as(page.videoPlayer, "display", "none");
				page.videoPlayer.loadedmetadata = function() {
					u.as(page.videoPlayer, "display", "block");
				}
				page.videoPlayer.loadAndPlay("/video/front_video.mp4");
			}

			this.resized();

//			page.setColor("bordeaux");
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


			// add video container
			this.video = u.ie(this, "div", {"class": "video"});
			this.video.scene = this;
			u.as(this.video, "height", Math.round(this.video.offsetWidth/16*9) + "px");


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

//				page.setColor("bordeaux");

				// inject video pre-screen

				this.video.loaded = function(queue) {
					this.image = u.ae(this, "img", {"src":queue[0].image.src});
					this.image.scene = this.scene;

					// set pre-state of video
					u.a.setOpacity(this.image, 0);
					u.a.scale(this.image, 1.04);


					this.image.transitioned = function() {
						u.a.transition(this, "none");

						// rendering is done
						this.scene.is_rendered = true;

						// logo
						this.scene.logo = u.ie(this.scene, "div", {"class":"logo"});
						// u.ae(this.scene.logo, "img", {"src":"/img/logo.svg"});
						
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


						// inject video
						page.ejectVideoPlayer();
						u.ae(this.scene.video, page.videoPlayer);
						u.as(page.videoPlayer, "display", "none");
						page.videoPlayer.loadedmetadata = function() {
							u.as(page.videoPlayer, "display", "block");
						}
						page.videoPlayer.loadAndPlay("/video/front_video.mp4");

						// endless loop video
						page.videoPlayer.ended = function(event) {
							this.play();
						}
					}

					// show page content
					u.a.transition(this.image, "all 1s ease-out");
					u.a.setOpacity(this.image, 1);
					u.a.scale(this.image, 1);


					// callback when page building is done
					if(typeof(this.scene.built) == "function") {
						u.t.setTimer(this.scene, this.scene.built, 1100);
					}

				}
				u.preloader(this.video, ["/img/front_poster.jpg"]);
				page.videoPlayer.load("/video/front_video.mp4");

				page.videoPlayer.loadeddata = function() {
					scene.playVideo();
				}

				this.playVideo = function() {
					//u.bug("playing: " + page.videoPlayer.videoLoaded + "     poster done: " + this.poster_loaded);
					if (page.videoPlayer.videoLoaded && this.poster_loaded) {

						page.ejectVideoPlayer();
						u.ae(scene.video, page.videoPlayer);
						page.videoPlayer.play();

						// endless loop video
						page.videoPlayer.ended = function(event) {
							this.play();
						}
					}
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
