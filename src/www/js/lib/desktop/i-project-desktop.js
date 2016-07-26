Util.Objects["project"] = new function() {
	this.init = function(project) {
		// u.bug("init:" + u.nodeId(scene))

		project.resized = function() {
			//u.bug("scene.resized:" + u.nodeId(this));

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


			// load i1
			var image_i1 = u.qs(".image.i1", this);
			var image_i2 = u.qs(".image.i2", this);
			var image_i3 = u.qs(".image.i3", this);
			var image_i4 = u.qs(".image.i4", this);
			var image_i5 = u.qs(".image.i5", this);
			var image_i6 = u.qs(".image.i6", this);
			var video = u.qs(".video", this);

			var img, node, vb, va, i, svg, shape;


			// add share before H1
			var sharing = u.qs("div.sharing", this);
			var h1 = u.qs("h1", this);
			this.insertBefore(sharing, h1);

			// ref grid
			var ref_grid = u.qs("ul.grid", this);

			// create new media grid
			var grid = u.ae(this, "ul", {"class":"media"});
			this.insertBefore(grid, ref_grid);


			// SHARING
			sharing.h4 = u.qs("h4", sharing);
			sharing.h4_span = u.qs("h4 span", sharing);
			sharing.ul = u.qs("ul", sharing);

			// create svg arrow
			// svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			// shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			// shape.setAttributeNS(null, "points", "0,0 6,0 3,5");
			// shape.setAttributeNS(null, "fill", "none");
			// shape.setAttributeNS(null, "stroke", "none");
			// svg.appendChild(shape);
			// sharing.h4.appendChild(svg);

			// sharing.polygon = u.qs("polygon", sharing);


			// mouseover and -out handlers
			sharing.over = function() {
				u.t.resetTimer(this.t_close);

				this.open = true;
				this.ul.transitioned = function() {
					// reinstate color transition
					this.removeAttribute("style");
				}
				// overwrite color transition
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
					// reinstate color transition
					this.removeAttribute("style");
				}
				// overwrite color transition
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


			// apply appropriate event
			if(u.e.event_pref == "mouse") {
				u.e.addEvent(sharing, "mouseover", sharing.over);
				u.e.addEvent(sharing, "mouseout", sharing.out);
			}
			else {
				u.e.addEvent(sharing, "touchstart", sharing.toggle);
			}

			// create svg arrow
			// svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			// shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
			// shape.setAttributeNS(null, "points", "0,0 5,3 0,6");
			// shape.setAttributeNS(null, "fill", "none");
			// shape.setAttributeNS(null, "stroke", "none");
			// svg.appendChild(shape);

			// mouseover and -out handlers of li's
			var _over = function() {
				this.transitioned = function() {
					// reinstate color transition
					this.removeAttribute("style");
					this.bn.removeAttribute("style");
				}
				// overwrite color transition
				u.a.transition(this, "all 0.15s linear");
				u.a.transition(this.bn, "none");
				u.ac(this, "hover");
			}
			var _out = function() {
				this.transitioned = function() {
					// reinstate color transition
					this.removeAttribute("style");
					this.bn.removeAttribute("style");
				}
				// overwrite color transition
				u.a.transition(this, "all 0.15s linear");
				u.a.transition(this.bn, "none");
				u.rc(this, "hover");
			}

			var shares = u.qsa("li", sharing);
			for(i = 0; node = shares[i]; i++) {

				
				node.bn = u.qs("a", node);

				node.clicked = function() {
					//document.open
					u.bug(this.url);
					window.open(this.url,'_blank');	
				}
				u.ce(node);

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


			// IMAGES
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


				// wrapper for scope, credit - needs image_i2 + image_i3
				var text_mask = u.ae(u.ae(grid, "li", {"class": "text_box"}), "div", {"class":"text_mask"});

				// add scope, credit to text_box
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

				// variables for centralized play button
				node.play.video_node = node;
				node.play.info = node.info;
				node.play.scene = page.cN.scene;
				node.play.play = node.play;
				node.play.url = "/videos/"+video._id+"/video/960x."+video._video_format

				u.ce(node.play);
				node.play.clicked = page._bn_play_clicked;

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

		// callback to scene ready
		project.ready();
	}
}
