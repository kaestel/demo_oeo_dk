u.bug_force = true;

Util.Objects["column"] = new function() {
	this.init = function(scene) {
//		u.bug("scene init:" + u.nodeId(scene))


		scene.page_color = "red";


		// resize scene
		scene.resized = function() {
//			u.bug("scene.resized:" + u.nodeId(this));

			if(this.div_column) {

				var column_width = Math.round(this.offsetWidth*0.7);
				u.as(this.div_columns, "width", column_width+"px", false);
				u.as(this._filters, "width", (this.offsetWidth - column_width - 10) +"px", false);
				// adjust left to scene state (fixed or absolute)


				if(page.current_scene == this) {
					u.as(this._filters, "left", (column_width + page.content_offset_x + 10) +"px", false);
				}
				else {
					u.as(this._filters, "left", (column_width + 10) +"px", false);
				}

			}

			// refresh dom
			this.offsetHeight;
		}

		// check fold on scroll
		scene.scrolled = function() {
//			u.bug("scene.scrolled:" + u.nodeId(this))

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
//			this.t_scroll = u.t.setTimer(this, this.updateAfterScroll, 200);

		}

		scene.updateAfterScroll = function() {

//			u.bug("update after scroll")

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
//			u.bug("scene.entered:" + u.nodeId(this))

			// remove transform to be able to use fixed positioning
			u.a.removeTransform(this);

			// position filters correctly
			if(this._filters) {
				u.as(this._filters, "position", "fixed", false);
				u.as(this._filters, "top", this.org_offset_top+"px", false);
				u.as(this._filters, "left", (this.div_columns.offsetWidth + page.content_offset_x + 10) +"px", false);
			}

			this.resized();

//			page.setColor("red");

		}
		scene.exiting = function() {
//			u.bug("scene.exiting:" + u.nodeId(this))

			var iframes = u.qsa(".vimeo", this);
			var i, iframe;
			for(i = 0; iframe = iframes[i]; i++) {
				iframe.parentNode.removeChild(iframe);
			}

			// position filters correctly
			if(this._filters) {
				u.as(this._filters, "position", "absolute", false);
				u.as(this._filters, "top", this.scroll_offset + "px", false);
				u.as(this._filters, "left", (this.div_columns.offsetWidth + 10) +"px", false);
				this._filters.offsetHeight;
			}

			// eject video when scene is exiting
			page.ejectVideoPlayer();
		}

		scene.initColumnList = function() {
			
			// map additional nodes to avoid querying later
			this.ul_column = u.qs("ul.columns", this);
			this.ul_column.scene = this;


			// enable list
			this.items = u.qsa("ul.columns li.item", this);
			if(this.items.length) {

				var i, node;
				for(i = 0; node = this.items[i]; i++) {
					this.readyNode(node);
				}

			}
		}

		// prepare scene to become visible
		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;


//			this.tags = [];
			this.div_column = u.qs("div.column", this);


			// Dont show the column list if your on a single post page
			if(this.div_column) {

				// wrap column content
				this.div_columns = u.wc(this.div_column, "div", {"class":"columns"});
				// find filters
				this._filters = u.qs("div.filters", this.div_columns);

				// set width of column and filters
				var column_width = Math.round(this.offsetWidth*0.7);
				u.as(this.div_columns, "width", column_width+"px", false);

				u.as(this._filters, "position", "absolute", false);
				u.as(this._filters, "width", (this.offsetWidth - column_width - 10) +"px", false);
				u.as(this._filters, "top", "0px", false);
				u.as(this._filters, "left", (column_width + 10) +"px", false);


				// init column list
				this.initColumnList();

				var next = u.qs("div.pagination .next a", this);
				if(next) {
					this.next_link = next.href;
				}
				else {
					this.next_link = false;
				}

				// tags available for filter
				// create filter and filter functions
				if(this._filters) {

					// array for filter options
					this.filter_options = u.qsa("li", this._filters);

					// filter column posts
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

						// hide column while filtering
						u.a.transition(this.ul_column, "all .4s ease-out");
						u.a.setOpacity(this.ul_column, 0);


						// fadeup column after filtering
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


						// update selected state
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


					// mouseover and -out handlers
					var _over = function() {
						u.a.transition(this, "none");
						this.offsetHeight;

						this.transitioned = function() {
							// reinstate color transition
							this.removeAttribute("style");
						}

						// overwrite color transition
						u.a.transition(this, "all 0.15s linear");
						u.ac(this, "hover");
					}
					var _out = function() {
						u.a.transition(this, "none");
						this.offsetHeight;

						this.transitioned = function() {
							// reinstate color transition
							this.removeAttribute("style");
						}
						// overwrite color transition
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
						// get rid of A-tags to minimize transition effort
						var a = u.qs("a", node);
						node.innerHTML = a.innerHTML;

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



			}
			// Do single post page!
			else {


				// navigate to second level, for resetting column view after single post view
				this.navigate = function(url) {
					u.bug("scene navigation:" + url)

					this.response = function(response) {
						if(response) {

							this.transitioned = function(event) {
								u.a.transition(this, "none");

								// scroll to top
								window.scrollTo(0, 0);

								var new_scene = u.qs(".scene", response);
								this.parentNode.replaceChild(new_scene, this);

								page.nN.nodes[2]._scene = new_scene;
								page.rePositionAfterNavigation();

								new_scene.org_offset_top = new_scene.offsetTop;
								new_scene.scroll_offset = 0;
//								u.as(scene, "position", "fixed", false);

								u.as(new_scene, "width", (page.content_width-10) + "px", false);

//								page.rePositionAfterResize();
								
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

					// if exists
					if(image_format && image_variant) {

						// resize .image proportionally
//						u.as(image.img, "height", (image.offsetWidth*proportion)+"px");

						// add first image to top
						if(i == 0) {
							image.parentNode.removeChild(image);
							image = u.ie(article, "div", {"class":"image"});
							this.image = image;
						}

						// add
						image.loaded = function(queue) {
							//u.bug("loaded image");
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
						// load
						u.preloader(image, ["/images/"+ image_id +"/"+ image_variant +"/x680."+ image_format]);
					}
				}

				// add share before dl.published
				var sharing = u.qs("div.sharing", article);
				var dl = u.qs("dl", article);
				article.insertBefore(sharing, dl);

				// SHARING
				sharing.h4 = u.qs("h4", sharing);
				sharing.h4_span = u.qs("h4 span", sharing);
				sharing.ul = u.qs("ul", sharing);

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

				// mouseover and -out handlers of li's
				var _over_li = function() {
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
				var _out_li = function() {
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
				var y, li;
				for(y = 0; li = shares[y]; y++) {
					li.bn = u.qs("a", li);

					li.clicked = function(event) {
						u.e.kill(event);
						//document.open
						//u.bug(this.url);
						window.open(this.url,'_blank');
					}
					u.ce(li);

					//apply appropriate event
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(li, "mouseover", _over_li);
						u.e.addEvent(li, "mouseout", _out_li);
					}
					else {
						u.e.addEvent(li, "touchstart", _over_li);
						u.e.addEvent(li, "touchend", _out_li);
					}
				}


				// // add comma in tag list
				// this._tags = u.qsa("ul.tags li", this);
				// var i, tag;
				// for(i = 0; tag = this._tags[i]; i++) {
				// 	if (i < this._tags.length-1) {
				// 		tag.innerHTML = u.text(tag)+",";
				// 	}
				// }

				// add vimeo
				this.player_a = u.qs(".video a", article);
				if(this.player_a && this.player_a.href) {
					this.player_url = this.player_a.href;
					this.injectIframe(this.image, this.player_url);
				}
			}


			// show scene in pre-built state
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

		// load more column posts
		scene.loadMore = function() {

//			u.bug("load more")

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

					// make sure scene adjusts to new content
					this.scrolled();
				}
				u.request(this, this.next_link);
			}
		}

		// make node ready for building
		scene.readyNode = function(node) {

			node.scene = this;
			node._has_video_link = u.hc(node, "video");

			// make sure we get the correct url
			u.ce(node);

			// load first image
			node._image_id = u.cv(node, "id");
			node._proportion_x = u.cv(node, "prop_x");
			node._proportion_y = u.cv(node, "prop_y");
			node._image_format = u.cv(node, "format");
			node._image_variant = u.cv(node, "variant");
			
			// load image in build!
			node.image = u.ie(node, "div", ({"class": "image"}));
			node.image.img = u.ae(node.image, "img");
			u.as(node.image.img, "height", Math.round(node.offsetWidth/node._proportion_x * node._proportion_y) + "px", false);
			u.as(node.image, "height", Math.round(node.offsetWidth/node._proportion_x * node._proportion_y) + "px", false);

			node.sharing = u.qs("div.sharing", node);
			node.tag = u.qs("div.tags", node);

			// insert placeholders for images and text
			node._text = u.ae(node, "div", {"class":"text"});
			node.insertBefore(node._text, node.tag);
			node._images = u.ae(node, "div", {"class":"images"});

			// add sharing
			var sharing = u.qs("div.sharing", node);
			var dl = u.qs("dl", node);
			node.insertBefore(node.sharing, dl);

			// SHARING
			sharing.ul = u.qs("ul", sharing);

			node.full_stop_placeholder = u.ae(node, "div", {"class":"fullStopPlaceholder"});

			u.a.transition(node, "none");
			u.as(node, "height", (node.offsetHeight-1)+"px", false);
			node.offsetHeight;

			u.ac(node, "disabled", false);
			node.is_disabled = true;
			node.is_ready = true;
		}

		// build and show node
		scene.buildNode = function(node) {

//			u.bug("build node")

			if(!node._hidden) {

				if(!node.is_loaded && node.is_ready) {
	
					node.is_loaded = true;

					// add first image in post
					if(node.image) {

						if(node._has_video_link) {
							node.play = u.ae(node.image, "div", {"class":"play"});
							node.play.node = node;
						}

					}

					// show image
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


					// hover play bn
					if(node.play) {
						// mouseover and -out handlers
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

						// apply appropriate event
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(node.play, "mouseover", _overPlay);
							u.e.addEvent(node.play, "mouseout", _outPlay);
						}
						else {
							u.e.addEvent(node.play, "touchstart", _overPlay);
							u.e.addEvent(node.play, "touchend", _outPlay);
						}
					}



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



					// mouseover and -out handlers
					node.sharing.over = function() {
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

					var sharing_out = function() {
						this.t_close = u.t.setTimer(this, this.close, 500);
					}

					node.sharing.close = function() {
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

					var sharing_toggle = function() {
						if(this.open) {
							this.close();
						}
						else {
							this.over();
						}
					}

					// apply appropriate event
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(node.sharing, "mouseover", node.sharing.over);
						u.e.addEvent(node.sharing, "mouseout", sharing_out);
					}
					else {
						u.e.addEvent(node.sharing, "touchstart", sharing_toggle);
					}

					// mouseover and -out handlers of li's
					var _over_li = function() {
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
					var _out_li = function() {
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

					var shares = u.qsa("li", node.sharing);
					var y, li;
					for(y = 0; li = shares[y]; y++) {
					
						li.bn = u.qs("a", li);

						li.clicked = function(event) {
							u.e.kill(event);
							//document.open
							//u.bug(this.url);
							window.open(this.url,'_blank');	
						}
						u.ce(li);

						//apply appropriate event
						if(u.e.event_pref == "mouse") {
							u.e.addEvent(li, "mouseover", _over_li);
							u.e.addEvent(li, "mouseout", _out_li);
						}
						else {
							u.e.addEvent(li, "touchstart", _over_li);
							u.e.addEvent(li, "touchend", _out_li);
						}
					}

					// inject full stop
					page.injectFullStop(node.full_stop_placeholder);


					// click node - open article
					node.clicked = function(event) {

						u.ac(this, "unclickable", false);
						this.clicked = null;

						// post is loaded
						this.response = function(response) {

							// get content
							var article = u.qs("div.article", response);

							u.as(this._images, "height", 0);
							u.as(this._text, "height", 0);

							// append article body
							var article_body = u.ae(this._text, u.qs("div.article_body", article));

							// show text
							this._text.transitioned = function() {
								u.a.transition(this, "none");
								u.a.setHeight(this, "auto");
							}
							u.a.setHeight(this._text, 0);
							u.a.transition(this._text, "all 0.8s ease-in-out");
//							u.bug("article_body.offsetHeight:" + article_body.offsetHeight);
							u.a.setHeight(this._text, article_body.offsetHeight);



							// append images
							var image_list = u.qs("ul.images", article); 
							if(image_list) {

								var first_image = u.qs(".image", image_list);
								if(first_image) {
									image_list.removeChild(first_image);
								}
								
								this._images.images = u.qsa(".image", image_list);
								// only inject additional images if post has more than one image
								if(this._images.images.length) {

									image_list = u.ae(this._images, image_list);

									// load all other images
									var i, image;
									for(i = 0; image = this._images.images[i]; i++) {

										// all images, except first
										image._image_id = u.cv(image, "id");
										image._image_format = u.cv(image, "format");
										image._image_variant = u.cv(image, "variant");
							
										image._image_w = u.cv(image, "width");
										image._image_h = u.cv(image, "height");
										image._proportion = image._image_h/image._image_w;
							
										// if exists
										if(image._image_format && image._image_variant) {
											// inject image
											image.img = u.ae(image, "img", {"src":"/img/blank_16x9.png"});
											// resize .image proportionally
											u.as(image.img, "height", (image.offsetWidth*image._proportion)+"px");
										}
									}

									// show image list
									this._images.transitioned = function() {
										u.a.transition(this, "none");
										u.a.setHeight(this, "auto");

										// load images
										var i, image;
										for(i = 0; image = this.images[i]; i++) {
											// load image
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


							// add vimeo
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
//					u.bug("auto height1:" + node.offsetHeight + ", node:" + u.nodeId(node));
					u.a.transition(node, "none");

					u.rc(node, "disabled", false);
					node.offsetHeight;
					u.as(node, "height", "auto", false);

//					u.bug("auto height2:" + node.offsetHeight + ", node:" + u.nodeId(node));
					node.is_disabled = false;
				}

			}

		}

		// hide node (out of view)
		scene.deactivateNode = function(node) {

			if(!node.is_disabled && !node._hidden) {

				node.offsetHeight;
//				u.bug("disable1:" + node.offsetHeight + ", node:" + u.nodeId(node));
				u.a.transition(node, "none");

				u.as(node, "height", (node.offsetHeight-1)+"px", false);

				u.ac(node, "disabled");
				node.offsetHeight;


//				u.bug("disable2:" + node.offsetHeight + ", node:" + u.nodeId(node));
				node.is_disabled = true;
			}
		}

		// load final details - scene has come into focus
		scene.build = function() {

			if(!this.is_built) {
//				u.bug("scene.build:" + u.nodeId(this));

				this.is_built = true;
				this.is_rendered = true;


				if(typeof(this.built) == "function") {
					this.built();
				}


				// Dont show the column list if your on a single post page
				if(this.div_column) {

					// remove transform to be able to use fixed positioning
					u.a.removeTransform(this);

					u.as(this._filters, "position", "fixed", false);
					u.as(this._filters, "top", this.org_offset_top+"px", false);
					u.as(this._filters, "left", (this.div_columns.offsetWidth + page.content_offset_x + 10) +"px", false);

//					u.bug("this.div_columns.offsetWidth + page.content_offset_x:" + this.div_columns.offsetWidth + ", " + page.content_offset_x)
					// enable list
					var i, node;
					for(i = 0; node = this.items[i]; i++) {

						// add first image in post

						// load images if visible
						if(node.offsetTop < u.scrollY() + 800 && node.offsetTop + node.offsetHeight > u.scrollY() - 200) {
							this.buildNode(node);
						}

					}
				}

			}

		}

		scene.injectIframe = function(node, url) {

			// clean up iframes
			var iframes = u.qsa(".vimeo", this);
			var i, iframe;
			for(i = 0; iframe = iframes[i]; i++) {
				iframe.parentNode.removeChild(iframe);
			}

			var player_width = node.offsetWidth;
			var player_height = node.offsetWidth;
			var p_id, player_id, player_html;
			// REGEX! example urls
			// http://www.youtube.com/watch?v=zSWUWPx2VeQ
			// http://vimeo.com/9625370

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
