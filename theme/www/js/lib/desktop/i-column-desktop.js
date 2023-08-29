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

			if(this.items) {
				var i, node;
				for(i = 0; node = this.items[i]; i++) {
					if(!node.is_loaded && node.offsetTop < page.scrolled_y + 800) {
						this.loadImage(node);
					}
				}
			}

		}

		scene.entered = function() {
//			u.bug("scene.entered:" + u.nodeId(this))

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

		// prepare scene to become visible
		scene.ready = function() {
//			u.bug("scene.ready:" + u.nodeId(this));

			this.is_built = false;
			this.is_rendered = false;
			this.is_ready = false;


			this.tags = [];
			this.div_column = u.qs("div.column", this);


			// Dont show the column list if your on a single post page
			if(this.div_column) {

				// wrap column content
				this.div_columns = u.wc(this.div_column, "div", {"class":"columns"});
				// inject filters
				this._filters = u.ae(this.div_column, "div", {"class":"filters"});


				// set width of column and filters
				var column_width = Math.round(this.offsetWidth*0.7);
				u.as(this.div_columns, "width", column_width+"px", false);

				u.as(this._filters, "position", "absolute", false);
				u.as(this._filters, "width", (this.offsetWidth - column_width - 10) +"px", false);
				u.as(this._filters, "top", "0px", false);
				u.as(this._filters, "left", (column_width + 10) +"px", false);


				// map additional nodes to avoid querying later
//				this.h2_column = u.qs("h2", this.div_column);
				this.ul_column = u.qs("ul.columns", this);
				this.ul_column.scene = this;

				// enable list
				this.items = u.qsa("ul.columns li.item", this);
				if(this.items.length) {

					var i, node;
					for(i = 0; node = this.items[i]; i++) {

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
						node.image.img = u.ae(node.image, "img", {"src":"/img/blank_16x9.png"});
						u.as(node.image.img, "height", Math.round(node.offsetWidth/node._proportion_x * node._proportion_y) + "px", false);

						// index tag list
						node.tags = [];
						node.tag = u.qs("ul.tags", node);
						var tags = u.qsa("li", node.tag);
						var t, tag;
						for(t = 0; tag = tags[t]; t++) {
							node.tags.push(u.text(tag));
							if(this.tags.indexOf(u.text(tag)) == -1) {
								this.tags.push(u.text(tag));
							}

							// add comma (!not to side list)
							if(t < tags.length-1) {
								tag.innerHTML = u.text(tag)+",";
							}

						}

						// insert placeholders for images and text
						node._text = u.ae(node, "div", {"class":"text"});
						node.insertBefore(node._text, node.tag);
						node._images = u.ae(node, "div", {"class":"images"});

						// add sharing
						var sharing = u.qs("div.sharing", node);
						var dl = u.qs("dl", node);
						node.insertBefore(sharing, dl);

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

						// inject full stop
						page.injectFullStop(node);
					}

				}

				// tags available for filter
				// create filter and filter functions
				if(this.tags.length) {

					// array for filter options
					this.filter_options = [];

					// filter column posts
					this.filter = function(tag) {

						this.ul_column.transitioned = function() {

							u.a.transition(this, "none");

							// scroll to appropriate top
//							if(u.scrollY() > this.scene.h2_column.offsetHeight) {
							// 	window.scrollTo(0, this.scene.h2_column.offsetHeight);
							// }
							window.scrollTo(0, 0);

							var i, node;
							for(i = 0; node = this.scene.items[i]; i++) {
								if(tag == "all") {
									if(node._hidden) {
										u.as(node, "display", "block");
										node._hidden = false;
									}
								}
								else if(node.tags.indexOf(tag) != -1) {
									if(node._hidden) {
										u.as(node, "display", "block");
										node._hidden = false;
									}
								}
								else {
									if(!node._hidden) {
										u.as(node, "display", "none");
										node._hidden = true;
									}
								}
							}

							// delay fade up a little bit
							u.t.setTimer(this, this.fadeUp, 500);

						}
						
						// hide column while filtering
						u.a.transition(this.ul_column, "all .4s ease-out");
						u.a.setOpacity(this.ul_column, 0);


						// fadeup column after filtering
						this.ul_column.fadeUp = function() {
							this.transitioned = function(event) {
								u.a.transition(this, "none");

								u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");
							}
							u.a.transition(this, "all 1.4s ease-out");
							u.a.setOpacity(this, 1);
						}


						// update selected state
						for(i = 0; option = this.filter_options[i]; i++) {
							if(tag == option.tag) {
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


					// inject filter header and list
					u.ae(this._filters, "h2", {"html":"Our daily log of inspiration, thoughts and news"});
					this._filters.ul = u.ae(this._filters, "ul");

					var li;

					// all button
					li = u.ae(this._filters.ul, "li", {"class":"all selected", "html":"View all"});
					li.scene = this;
					li.tag = "all";
					this.filter_options.push(li);

					// generate options based on available tags
					for(t = 0; tag = this.tags[t]; t++) {
						li = u.ae(this._filters.ul, "li", {"html":tag});
						li.scene = this;
						li.tag = tag;
						this.filter_options.push(li);
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

//					this.options = u.qsa("li", this._filters.ul);
					for(i = 0; node = this.filter_options[i]; i++) {

						u.ce(node);
						node.clicked = function(event) {
							this.scene.filter(this.tag);
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



			}
			// Do single post page!
			else {

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


				// add comma in tag list
				this._tags = u.qsa("ul.tags li", this);
				var i, tag;
				for(i = 0; tag = this._tags[i]; i++) {
					if (i < this._tags.length-1) {
						tag.innerHTML = u.text(tag)+",";
					}
				}

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
			u.a.transition(this, "opacity 0.6s ease-in");
			u.a.setOpacity(this, 1);
		}

		scene.loadImage = function(node) {

//			u.bug("load image")

			node.is_loaded = true;
			// show image
			node.loaded = function(queue) {


				u.a.setOpacity(this.image.img, 0);
				u.a.scale(this.image.img, 1.04);
				this.image.img.src = queue[0].image.src;
				u.as(this.image.img, "height", "auto");

				this.image.img.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(this.image.img, "all 1s ease-out");
				u.a.setOpacity(this.image.img, 1);
				u.a.scale(this.image.img, 1);
			}
			u.preloader(node, ["/images/"+ node._image_id +"/"+ node._image_variant +"/x680."+ node._image_format]);

		}

		// load final details - scene has come into focus
		scene.build = function() {

			if(!this.is_built) {
//				u.bug("scene.build:" + u.nodeId(this));

				this.is_built = true;
				this.is_rendered = true;


//				page.setColor("red");


				if(typeof(this.built) == "function") {
					this.built();
				}


				// Dont show the column list if your on a single post page
				if(this.div_column) {

					u.as(this._filters, "position", "fixed", false);
					u.as(this._filters, "top", this.org_offset_top+"px", false);
					u.as(this._filters, "left", (this.div_columns.offsetWidth + page.content_offset_x + 10) +"px", false);

					// enable list
					var i, node;
					for(i = 0; node = this.items[i]; i++) {

						// add first image in post
						if(node.image) {

							if(node._has_video_link) {
								node.play = u.ae(node.image, "div", {"class":"play"});
								node.play.node = node;
							}

							// load images if visible
							if(node.offsetTop < u.scrollY() + 800) {
								this.loadImage(node);
							}


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

						// hover play bn
						if (node.play) {
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
