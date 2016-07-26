u.bug_console_only = true;

Util.Objects["page"] = new function() {
	this.init = function(page) {
		
		if(u.hc(page, "i:page")) {
			
			// header reference
			page.hN = u.qs("#header");

			// content reference
			page.cN = u.qs("#content");
			page.scenes = 0;

			// navigation reference
			page.nN = u.qs("#navigation");
			page.nN = u.ie(page.hN, page.nN);

			// footer reference
			page.fN = u.qs("#footer");

			// video player
			page.videoPlayer = u.videoPlayer({"playpause":true});
			page.videoPlayer.video.poster = "/img/blank_16x9.png";


			// global resize handler 
			page.resized = function() {
//				u.bug("page.resized");

				// reset resize redraw
				u.t.resetTimer(page.t_resize);

				// go to resizing mode
				if(!page.resizing) {
					page.resizing = true;
//					u.bug("go to resizing mode");

					// hide side navigation while resizing
					u.as(page.bn_nav_left, "display", "none", false);
					u.as(page.bn_nav_right, "display", "none", false);

//					page.scenes = u.qsa(".scene", page.cN);
					var i, node, scene;
					for(i = 0; node = page.nN.nodes[i]; i++) {
//						u.bug("resize scene node:" + u.nodeId(node))
//						u.bug("resize scene node:" + node)
						scene = node._scene;
//						u.bug("resize scene:" + scene && scene.is_ready)
						if(scene && scene != page.current_scene && scene.is_ready) {
							u.a.transition(scene, "opacity 0.2s linear");
							u.a.setOpacity(scene, 0);
						}
					}
				}
				page.t_resize = u.t.setTimer(page, page.rePositionAfterResize, 500);


				// find content width
				if(u.browserW() >= 960) {
					page.content_width = 960;
				}
				else if(u.browserW() <= 600) {
					// oversize to compensate for missing margin
					page.content_width = 590;
				}
				else {
					page.content_width = u.browserW()-10;
				}


				// set element widths
				u.as(page.cN, "width", (page.content_width-10)+"px", false);
				u.as(page.hN, "width", (page.content_width-10)+"px", false); // 1px border in menu
				u.as(page.current_scene, "width", (page.content_width-10)+"px", false);

				// get value for offset calculations
				page.content_offset_x = page.cN.offsetLeft;

				// center current scene (the rest are hidden)
				u.as(page.current_scene, "left", (page.content_offset_x)+"px", false);

				// center header
				u.as(page.hN, "left", (page.content_offset_x)+"px", false);


				// reposition intro
				if(page.intro) {
					u.as(page.intro, "left", Math.round((u.browserW()-page.intro.offsetWidth) / 2)+"px", false);
				}

				// callback to scene
				if(page.cN && page.cN.scene && typeof(page.cN.scene.resized) == "function") {
					page.cN.scene.resized();
				}




				// update navigation item width
				if(page.nN.nodes) {
					page.nN.node_width = Math.round((page.content_width-10)/5); // 10px margin

					// cropped nav (add two pixels to be sure it always covers borders)
					u.as(page.nN.cropped_menu, "width", (page.nN.node_width+2)+"px", false);

					var left = Math.floor((((page.content_width-10)/2) - (page.nN.node_width/2)));
					u.as(page.nN.cropped_menu, "left",  left+ "px", false);
					u.as(page.nN.c_list, "marginLeft", -left +"px", false);

					for(i = 0; node = page.nN.nodes[i]; i++) {
						u.as(node, "width", page.nN.node_width+ "px", false);

						// cropped nav
						u.as(page.nN.c_nodes[i], "width", page.nN.node_width+"px", false);
					}
				}

				page.offsetHeight;

			}

			// reposition scenes when resizing is done
			page.rePositionAfterResize = function() {
//				u.bug("rePositionAfterResize");

				var i, node, scene;

				page.resizing = false;
				u.t.resetTimer(page.t_resize);

				// only reposition if all scenes are loaded
				node = page.nN.nodes[0]._scene;
				if(node) {
					u.as(node, "left", (page.content_offset_x - (page.content_width*2))+"px", false);
					u.as(node, "top", node.org_offset_top + node.scroll_offset+"px", false);
					u.as(node, "width", page.content_width-10+"px", false);
					node.resized();
				}

				node = page.nN.nodes[1]._scene;
				if(node) {
					u.as(node, "left", (page.content_offset_x - page.content_width)+"px", false);
					u.as(node, "top", node.org_offset_top + node.scroll_offset +"px", false);
					u.as(node, "width", page.content_width-10+"px", false);
					node.resized();
				}

				node = page.nN.nodes[3]._scene;
				if(node) {
					u.as(node, "left", (page.content_offset_x + (page.content_width))+"px", false);
					u.as(node, "top", node.org_offset_top + node.scroll_offset+"px", false);
					u.as(node, "width", page.content_width-10+"px", false);
					node.resized();
				}

				node = page.nN.nodes[4]._scene;
				if(node) {
					u.as(node, "left", (page.content_offset_x + (page.content_width*2))+"px", false);
					u.as(node, "top", node.org_offset_top + node.scroll_offset+"px", false);
					u.as(node, "width", page.content_width-10+"px", false);
					node.resized();
				}

				// show all scenes again
				for(i = 0; node = page.nN.nodes[i]; i++) {
					scene = node._scene;
					if(node._scene && node._scene != page.current_scene && node._scene.is_ready) {
						node._scene.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.transition(node._scene, "opacity 0.6s ease-in");
						u.a.setOpacity(node._scene, 1);
					}
				}


				// show side navigation after repositioning
				u.as(page.bn_nav_left, "display", "block", false);
				u.as(page.bn_nav_right, "display", "block", false);

				u.as(page.bn_nav_left, "width", page.content_offset_x+"px", false);
				u.as(page.bn_nav_right, "width", page.content_offset_x+"px", false);

				// set height of #content based on current scene
				u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top)+"px", false);

				// update dom
				page.offsetHeight;
			}


			// global scroll handler 
			page.scrolled = function() {
//				u.bug("page.scrolled");

				page.scrolled_y = u.scrollY();

				if(page.cN && page.cN.scene && typeof(page.cN.scene.scrolled) == "function") {
					page.cN.scene.scrolled();
				}

				page.offsetHeight;
			}

			// Page is ready - called from several places, evaluates when page is ready to be shown
			page.ready = function() {
//				u.bug("page ready")

				// page is ready to be shown - only initalize if not already shown
				if(!u.hc(this, "ready")) {

					// page is ready
					u.ac(this, "ready");

					// inject intro
					this.initIntro();


					// find content width
					if(u.browserW() >= 960) {
						this.content_width = 960;
					}
					else if(u.browserW() <= 600) {
						// oversize to compensate for missing margin
						this.content_width = 600;
					}
					else {
						this.content_width = u.browserW()-10;
					}



					// get current scene
					this.current_scene = u.qs(".scene", this.cN);
					this.cN.scene = u.qs(".scene", this.cN);
					// 
					// // set up element widths and positions
					// u.as(this.cN, "width", (this.content_width-10)+"px", false);
					// u.as(this.hN, "width", (this.content_width-10)+"px", false);
					// u.as(this.current_scene, "width", (this.content_width-10)+"px", false);
					// 
					// this.content_offset_x = this.cN.offsetLeft;
					// 
					// u.as(this.current_scene, "left", (this.content_offset_x)+"px", false);
					this.current_scene.org_offset_top = this.current_scene.offsetTop;
					
					// // center header
					// u.as(this.hN, "left", (this.content_offset_x)+"px", false);
					// 
					// // update dom
					// page.offsetHeight;


					// build navigation
					this.initNavigation();


					// init footer
					this.initFooter(this.current_scene)

					// set resize handler
					u.e.addEvent(window, "resize", page.resized);
					// set scroll handler
					u.e.addEvent(window, "scroll", page.scrolled);

					// resize / scroll straight away to adjust widths before loading init
					this.resized();
					this.scrolled();


					// enable ajax navigation
					u.navigation(page);

					// init scene
					u.init(this.current_scene);
				}
			}

			// Content is ready - called from page.ready and scenes
			page.cN.ready = function() {

//				u.bug("page.cN ready:" + (!page.intro || page.intro.start_y) + ", " + u.hc(page, "ready") + ", " + u.hc(this, "ready") + ", " + u.hc(page.current_scene, "ready"));
//				u.bug("delayed navigation:" + page._delayed_navigation + ", " + page.navigating + ", " + typeof(page.scenes) + ", " + (page.scenes ? page.scenes.length : "unknown"));

				if(!page.intro && u.hc(page, "ready") && u.hc(page.current_scene, "ready") && !u.hc(this, "ready")) {

//					u.bug("page.cN ready")

					u.ac(this, "ready");
					u.as(page.cN, "height", (page.current_scene.offsetHeight + page.current_scene.org_offset_top) + "px");


					// load remaining pages once current scene is shown
					page.current_scene.built = function() {

						// only ever run this once
						page.current_scene.built = null;

					}

					// build primary scene
					page.current_scene.scroll_offset = u.scrollY();
					page.current_scene.build();


				}
				

				// update scene -> navigation references
				// get updated nodelist
				var i, node;
				// counting scenes
				page.scenes = 0;

//				page.nN.nodes = u.qsa("li", page.nN.list);
				for(i = 0; node = page.nN.nodes[i]; i++) {

					if(!node._scene && node._org_node) {
						node._scene = u.qs(".scene."+node._org_node.className, page.cN);
					}

					// counting scenes
					if(node._scene) {
						page.scenes++;
					}
				}

				if(page._delayed_navigation && !page.navigating && page.scenes == 5) {
//					u.bug("execute delayed navigation")

					page.cN.navigate(page._delayed_navigation);
					page._delayed_navigation = false;
				}
			}

			// navigation controller
			page.cN.navigate = function(url) {
//				u.bug("cN.navigate:" + url)

				// ready for navigation 
				if(!page.navigating && page.scenes == 5) {

					var i, node;

					// find node in navigation with matching url
					for(i = 0; node = page.nN.nodes[i]; i++) {

						// valid node found
						if(u.h.getCleanUrl(node.url) == url && node._i != 2) {

							// set new scroll offset for reposition calculations
							page.cN.scene.scroll_offset = u.scrollY();

							if(typeof(page.cN.scene.exiting) == "function") {
								page.cN.scene.exiting();
							}

							// enter navigating state
							page.navigating = true;


							// start animation preparation
							u.a.transition(page.cN, "none");
							u.a.transition(page.nN, "none");
							u.a.transition(page.nN.c_list, "none");

							// calculate distance and duration
							page._distance = node._i-2;
							var duration = 0.4 + (Math.abs(page._distance)*0.4);


//							u.bug("navigation transition to:" + u.nodeId(node) + ", " + node._i + ", " + distance);



							// get updated nodelist
							page.nN.nodes = u.qsa("li", page.nN.list);

							// fix scenes before navigating
							page.preFixScenes();
//							u.bug("after preFixScenes");

							// right of center navigation
							if(page._distance > 0) {

								node = page.nN.nodes[0]._org_node.cloneNode(true);
								u.as(node, "width", page.nN.node_width+"px", false);
								u.ae(page.nN.list, node);

								node_out = page.nN.nodes[0];

								// two items right
								if(page._distance > 1) {
									node = page.nN.nodes[1]._org_node.cloneNode(true);
									u.as(node, "width", page.nN.node_width+"px", false);
									u.ae(page.nN.list, node);

									node_out = page.nN.nodes[1];

									// reposition first scene
									u.as(page.nN.nodes[0]._scene, "left", (page.content_width*3)+"px", false);
								}
							}

							// left of center navigation
							else if(page._distance < 0) {

								node = page.nN.nodes[4]._org_node.cloneNode(true);
								u.as(node, "width", page.nN.node_width+"px", false);
								u.ie(page.nN.list, node);

								node_out = page.nN.nodes[4];

								// two items left
								if(page._distance < -1) {
									node = page.nN.nodes[3]._org_node.cloneNode(true);
									u.as(node, "width", page.nN.node_width+"px", false);
									u.ie(page.nN.list, node);

									node_out = page.nN.nodes[3];

									// reposition last scene
									u.as(page.nN.nodes[4]._scene, "left", -(page.content_width*3)+"px", false);

								}

								var offset = page.nN.node_width*page._distance;
								u.as(page.nN, "width", page.content_width + Math.abs(offset), false);

								// move navigation acording to node shuffle
								u.a.translate(page.nN, offset, 0);
							}

							// update dom
							page.offsetHeight;

							// invoke reposition once transition is done
							page.cN.transitioned = function() {
								u.a.transition(this, "none");
								page.rePositionAfterNavigation();
							}
				
							// execute transition
							u.a.transition(page.cN, "all "+duration+"s ease-in-out");
							u.a.transition(page.nN, "all "+duration+"s ease-in-out");
							u.a.transition(page.nN.c_list, "all "+duration+"s ease-in-out");

							// move content
							u.a.translate(page.cN, -(page.content_width*page._distance), 0);
							if(page._distance < 0) {
								u.a.translate(page.nN, 0, 0);

								// move cropped nav
								u.a.translate(page.nN.c_list, Math.abs(offset), 0);
							}
							else {
								u.a.translate(page.nN, -(page.nN.node_width*page._distance), 0);

								// move cropped nav
								u.a.translate(page.nN.c_list, -(page.nN.node_width*page._distance), 0);
							}

							// save distance for use when transition is done
//							page._distance = distance;
						}

					}

				}
				else {
					page._delayed_navigation = url;
//					u.bug("delayed navigation")
				}

			}

			// adjust positioning of scenes before navigational transition
			page.preFixScenes = function() {

				var node;


				// TODO: safari flicker could be solved by moving content without scrolling
				// - requires top coordinated to be set differently - in both prefix and postfix
				// it seems to be window.scroll causing flicker

				
				node = page.nN.nodes[0]._scene;
//				u.bug("node:" + u.nodeId(node));
				u.as(node, "display", "block", false);
				u.as(node, "position", "absolute", false);
				u.as(node, "left", -(page.content_width*2)+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[1]._scene;
				u.as(node, "display", "block", false);
				u.as(node, "position", "absolute", false);
				u.as(node, "left", -page.content_width+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[2]._scene;
//				u.bug("node:" + u.nodeId(node));
				u.as(node, "display", "block", false);
				u.as(node, "position", "absolute", false);
				u.as(node, "left", 0, false);
//				u.a.translate(node, 0, -node.scroll_offset);
//				u.as(node, "top", -node.scroll_offset+"px", false);
//				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[3]._scene;
//				u.bug("node:" + u.nodeId(node));
				u.as(node, "display", "block", false);
				u.as(node, "position", "absolute", false);
				u.as(node, "left", page.content_width+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[4]._scene;
//				u.bug("node:" + u.nodeId(node));
				u.as(node, "display", "block", false);
				u.as(node, "position", "absolute", false);
				u.as(node, "left", (page.content_width*2)+"px", false);
				u.as(node, "top", (page.scrolled_y + node.org_offset_top - node.scroll_offset)+"px", false);


				u.as(page.cN, "position", "relative", false);

//				node = page.nN.nodes[2]._scene;
//				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);
//				document.body.scrollTop = 0;
//				u.a.translate(node, 0, -node.scroll_offset);
//				window.scroll(0,0);

				u.as(document.body, "overflow", "hidden", false);


				// update dom
				page.offsetHeight;

			}

			// adjust positioning of scenes after navigational transition
			page.postFixScenes = function() {

				var node;

				// remove transform to be able to use fixed positioning
				u.a.removeTransform(page.cN);

				u.as(page.cN, "position", "static", false);

				node = page.nN.nodes[0]._scene;
				u.as(node, "display", "none", false);
				u.as(node, "position", "fixed", false);
				u.as(node, "left", (page.content_offset_x-(page.content_width*2))+"px", false);
				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[1]._scene;
				u.as(node, "position", "fixed", false);
				u.as(node, "left", (page.content_offset_x - page.content_width)+"px", false);
				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[2]._scene;
				u.as(node, "position", "absolute", false);
				u.as(node, "left", page.content_offset_x+"px", false);
				u.as(node, "top", node.org_offset_top+"px", false);

				node = page.nN.nodes[3]._scene;
				u.as(node, "position", "fixed", false);
				u.as(node, "left", (page.content_offset_x + (page.content_width))+"px", false);
				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);

				node = page.nN.nodes[4]._scene;
				u.as(node, "display", "none", false);
				u.as(node, "position", "fixed", false);
				u.as(node, "left", (page.content_offset_x + (page.content_width*2))+"px", false);
				u.as(node, "top", (node.org_offset_top - node.scroll_offset)+"px", false);

				u.as(page.cN, "height", page.nN.nodes[2]._scene.offsetHeight + page.nN.nodes[2]._scene.org_offset_top + "px", false);

				u.as(document.body, "overflow", "scroll", false);

				// update dom
				page.offsetHeight;

//				u.a.translate(page.nN.nodes[2]._scene, 0, 0);
				window.scrollTo(0, page.nN.nodes[2]._scene.scroll_offset);
			}
			

			// reposition all scenes and navigation elements to appropiate position
			page.rePositionAfterNavigation = function() {

				// disable transitions first
				u.a.transition(page.cN, "none");
				u.a.transition(page.nN, "none");
				u.a.transition(page.nN.c_list, "none");


				// Reset Navigation element first
				// correct offset correctly
				// var restore = page.nN._x/page.nN.nodes[0].offsetWidth;

				var nav_nodes = u.qsa("li", page.nN.list);
				var c_nav_nodes = u.qsa("li", page.nN.c_list);

				// u.bug("clean after transition:" + nav_nodes.length + ", " + page._distance)


				if(page._distance == 1) {

					// u.bug("remove -1:" + u.nodeId(nav_nodes[0]));
					page.nN.list.removeChild(nav_nodes[0]);

					// cropped nav
					u.ae(page.nN.c_list, c_nav_nodes[0]);

				}
				else if(page._distance == 2) {
					//u.bug("remove -2:" + u.nodeId(nav_nodes[0]));
					//u.bug("remove -2:" + u.nodeId(nav_nodes[1]));
					page.nN.list.removeChild(nav_nodes[0]);
					page.nN.list.removeChild(nav_nodes[1]);

					// cropped nav
					u.ae(page.nN.c_list, c_nav_nodes[0]);
					u.ae(page.nN.c_list, c_nav_nodes[1]);

				}
				else if(page._distance == -1) {
					//u.bug("remove 1:" + u.nodeId(nav_nodes.length-1));
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-1]);
					
					// cropped nav
					u.ie(page.nN.c_list, c_nav_nodes[4]);

				}
				else if(page._distance == -2) {
					// u.bug("remove 2:" + u.nodeId(nav_nodes[nav_nodes.length-1]));
					// u.bug("remove 2:" + u.nodeId(nav_nodes[nav_nodes.length-2]));
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-1]);
					page.nN.list.removeChild(nav_nodes[nav_nodes.length-2]);

					// cropped nav
					u.ie(page.nN.c_list, c_nav_nodes[4]);
					u.ie(page.nN.c_list, c_nav_nodes[3]);
				}



				// nav
				u.a.translate(page.nN, 0, 0);
				u.a.setWidth(page.nN, "auto");
				page.nN.nodes = u.qsa("li", page.nN.list);

				// cropped nav
				u.a.translate(page.nN.c_list, 0, 0);


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

				// remember current scene for calculations
				page.current_scene = page.nN.nodes[2]._scene;

				// set new scene for navigation controller
				page.cN.scene = page.nN.nodes[2]._scene;

				// Reset scenes
				u.as(page.nN.nodes[0]._scene, "left", -(page.content_width*2)+"px", false);
				u.as(page.nN.nodes[1]._scene, "left", -page.content_width+"px", false);
				u.as(page.nN.nodes[2]._scene, "left", 0, false);
				u.as(page.nN.nodes[3]._scene, "left", page.content_width+"px", false);
				u.as(page.nN.nodes[4]._scene, "left", (page.content_width*2)+"px", false);

				u.a.translate(page.cN, 0, 0);


//				u.bug("current scene:" + u.nodeId(page.nN.nodes[2]._scene))

				// adjust scenes for interaction
				page.postFixScenes();

				u.t.resetTimer(page.t_color);

				page.colorTransitioned = function() {

//					u.bug("get ready to build")

					// build new scene
					if(typeof(page.nN.nodes[2]._scene.build) == "function") {
						page.nN.nodes[2]._scene.build();
					}

					if(typeof(page.nN.nodes[2]._scene.entered) == "function") {
						page.nN.nodes[2]._scene.entered();
					}

				}
//				u.bug("page.current_scene.page_color:" + page.current_scene.page_color)
				page.setColor(page.current_scene.page_color);
				page.t_color = u.t.setTimer(page, page.colorTransitioned, 1000);


				// leave navigating state
				page.navigating = false;

			}


			// setup and activate Navigation
			page.initNavigation = function() {
//				u.bug("initNavigation")

				// navigation list
				this.nN.list = u.qs("ul", this.nN);

				// get all li
				this.nN.nodes = u.qsa("li", this.nN.list);
				var i, node;
				for(i = 0; node = this.nN.nodes[i]; i++) {

					// find current page -> navigation relation
					if(u.hc(document.body, node.className)) {
						//u.bug("current_i: " + current_i);
						var current_i = i;
					}
				}

				// Duplication of navigation - cropped/center
				// Add crop div
				this.nN.cropped_menu = u.ae(this.hN, "div", ({"class": "cropped"}));
				// Clone menu
				this.nN.c_list = this.nN.list.cloneNode(true);
				// Append cloned menu into crop div
				this.nN.c_list = u.ae(this.nN.cropped_menu, this.nN.c_list);
				// Get cropped li's
				this.nN.c_nodes = u.qsa("li", this.nN.c_list);


				// Adjust menu to current view
				if(current_i == 0) {
					// nav
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-1]);
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-2]);

					// cropped nav
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-1]);
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-2]);
				}
				else if(current_i == 1) {
					u.ie(this.nN.list, this.nN.nodes[this.nN.nodes.length-1]);

					// cropped nav
					u.ie(this.nN.c_list, this.nN.c_nodes[this.nN.c_nodes.length-1]);
				}
				else if(current_i == 3) {
					u.ae(this.nN.list, this.nN.nodes[0]);

					// cropped nav
					u.ae(this.nN.c_list, this.nN.c_nodes[0]);
				}
				else if(current_i == 4) {
					u.ae(this.nN.list, this.nN.nodes[0]);
					u.ae(this.nN.list, this.nN.nodes[1]);

					// cropped nav
					u.ae(this.nN.c_list, this.nN.c_nodes[0]);
					u.ae(this.nN.c_list, this.nN.c_nodes[1]);

				}

				// get updated node list efter restructuring
				this.nN.nodes = u.qsa("li", this.nN.list);

				// index navigation buttons
				for(i = 0; node = this.nN.nodes[i]; i++) {
//					u.bug("nav node:" + u.nodeId(node));
					node._org_node = node.cloneNode(true);
					node._i = i;

					u.ce(node, {"type":"link"});
				}

				// CROPPED: get updated node list efter restructuring
				this.nN.c_nodes = u.qsa("li", this.nN.c_list);

				// CROPPED: index navigation buttons
				for(i = 0; node = this.nN.c_nodes[i]; i++) {
					u.ce(node, {"type":"link"});
				}

				// inject navigation blocks for left and right
				page.bn_nav_left = u.ae(document.body, "div", {"class":"bn_nav_left"});
				page.bn_nav_right = u.ae(document.body, "div", {"class":"bn_nav_right"});
				u.ce(page.bn_nav_left);
				page.bn_nav_left.clicked = function(event) {
					page.nN.nodes[1].clicked(event);
				}
				u.ce(page.bn_nav_right);
				page.bn_nav_right.clicked = function(event) {
					page.nN.nodes[3].clicked(event);
				}

				page.keynav = function(event) {
					event = event ? event : window.event;
//					u.bug("key:" + event.keyCode)
					if(event.keyCode == 37) {
						u.e.kill(event);

						page.nN.nodes[1].clicked(event);
					}
					else if(event.keyCode == 39) {
						u.e.kill(event);

						page.nN.nodes[3].clicked(event);
					}
					
				}
				u.e.addEvent(document.body, "keyup", page.keynav);
				

				// // mouseover and -out handlers
				// var _over = function() {
				// 	this.transitioned = function() {
				// 		u.a.transition(this, "none");
				// 	}
				// 	u.a.transition(this, "all 0.15s linear");
				// 	u.ac(this, "hover");
				// }
				// var _out = function() {
				// 	this.transitioned = function() {
				// 		u.a.transition(this, "none");
				// 	}
				// 	u.a.transition(this, "all 0.15s linear");
				// 	u.rc(this, "hover");
				// }
				// 
				// // apply appropriate event
				// if(u.e.event_pref == "mouse") {
				// 	u.e.addEvent(page.hN, "mouseover", _over);
				// 	u.e.addEvent(page.hN, "mouseout", _out);
				// }
				// else {
				// 	u.e.addEvent(page.hN, "touchstart", _over);
				// 	u.e.addEvent(page.hN, "touchend", _out);
				// }

			}

			// setup and activate Footer
			page.initFooter = function(scene) {
//				u.bug("initFooter: " + u.nodeId(scene));

				var offices, node, sharing, i;

				var svg, shape;
				// create svg arrow
				svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
				shape.setAttributeNS(null, "points", "0,0 4,2.5 0,5");
				shape.setAttributeNS(null, "fill", "none");
				shape.setAttributeNS(null, "stroke", "none");
				shape = svg.appendChild(shape);

				// mouseover and -out handlers
				var _over = function() {
					this.transitioned = function() {
						// reinstate color transition
						this.removeAttribute("style");
						this.a.removeAttribute("style");
						this.polygon.removeAttribute("style");
					}
					// overwrite color transition
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.a, "none");
					u.a.transition(this.polygon, "none");
					u.ac(this, "hover");
				}
				var _out = function() {
					this.transitioned = function() {
						// reinstate color transition
						this.removeAttribute("style");
						this.a.removeAttribute("style");
						this.polygon.removeAttribute("style");
					}
					// overwrite color transition
					u.a.transition(this, "all 0.15s linear");
					u.a.transition(this.a, "none");
					u.a.transition(this.polygon, "none");
					u.rc(this, "hover");
				}

				// sharing buttons
				sharing = u.qsa("ul.social li", scene);
				for(i = 0; node = sharing[i]; i++) {
					u.ae(node, svg.cloneNode(true));
					node.a = u.qs("a", node);
					node.polygon = u.qs("polygon", node);

					// apply appropriate event
					if(u.e.event_pref == "mouse") {
						u.e.addEvent(node, "mouseover", _over);
						u.e.addEvent(node, "mouseout", _out);
					}
					else {
						u.e.addEvent(node, "touchstart", _over);
						u.e.addEvent(node, "touchend", _out);
					}

					// click footer links
					node.clicked = function() {
						window.open(this.url,'_blank');
					}
					u.ce(node);
				}


				// load office images
				offices = u.qsa("div.offices li.vcard", scene);
				u.ie(offices[0], "img", {"src": "/img/footer_cph.jpg"});
				u.ie(offices[1], "img", {"src": "/img/footer_kyoto.jpg"});
				u.ie(offices[2], "img", {"src": "/img/footer_tokyo.jpg"});

				page.injectFullStop(scene);

			}

			// init intro flow
			page.initIntro = function() {
//				u.bug("init intro")

				page.intro = u.ae(document.body, "div", {"id":"intro"});
				//u.ae(page.intro, "img", {"src":"/img/logo.svg"});
				
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

				// update dom
				page.intro.offsetHeight;
				page.preload_state = 20;


				// end intro sequence
				page.intro.endIntro = function() {

					// intro is hidden
					this.transitioned = function() {
						u.a.transition(this, "none");

						page.intro.parentNode.removeChild(page.intro);
						page.intro = null;


						page.transitioned = function() {
							u.a.transition(page, "none");

							page.colorTransitioned = function() {

								page.cN.ready();

							}
//							u.bug("page.current_scene.page_color:" + page.current_scene.page_color)
							page.setColor(page.current_scene.page_color);
							u.t.setTimer(page, page.colorTransitioned, 1000);

						}


						// show page
						u.a.transition(page, "all 0.6s ease-in");
						//u.a.transition(page, "none");
						u.a.setOpacity(page, 1);

					}

					// hide intro
					u.a.transition(this, "all 0.4s ease-in");
					u.a.setOpacity(this, 0);
				}

				page.intro.loader = function() {
					if(this.load_counter < 100) {
//					if(this.load_counter < 1) {
//						u.bug("loader:" + this.load_counter + ", " + page.preload_state)

						if(this.load_counter <= page.preload_state) {
							this.load_counter += 2;
						}
						this.span.innerHTML = this.load_counter + "%"
						u.t.setTimer(this, this.loader, 30); // 2000
					}
					else {
						u.t.setTimer(this, this.endIntro, 200); // 2000
					}
				}
				// intro is shown
				page.intro.transitioned = function() {
					u.a.transition(this, "none");

					u.bug("start loading called")
					if(!this.start_preloading_scenes) {

						u.bug("start loading executed")
						this.start_preloading_scenes = true;

						// hide intro after delay
						u.t.setTimer(this, this.loader, 200); // 2000

						page.preloadScenes();

					}
				}

				// show intro
				if(u.gcs(page.intro, "opacity") != 1) {
					u.a.transition(page.intro, "all 0.4s ease-in");
					u.a.setOpacity(page.intro, 1);
				}
				else {
					page.intro.transitioned();
				}


				// safari proloading bug
				// force additional preload start
				if(u.browser("safari")) {

					page.intro.extrSafariCheck = function() {
					if(this.transitioned) {
							this.transitioned();
						}
					}
					u.t.setTimer(page.intro, page.intro.extrSafariCheck, 500);
				}

			}

			// start scene preloading sequence
			page.preloadScenes = function() {

				// response from first left scene
				page.nN.nodes[1].response = function(response) {
					var scene = u.qs(".scene", response);
					u.ie(page.cN, scene);

					u.as(scene, "left", (page.content_offset_x-page.content_width)+"px");
					scene.org_offset_top = scene.offsetTop;
					scene.scroll_offset = 0;
					u.as(scene, "position", "fixed");
					u.as(scene, "width", (page.content_width-10) + "px");

					u.init(scene);

					//init footer
					page.initFooter(scene);

					this._scene = scene;
					page.preload_state += 20;

					page.intro.span.innerHTML = page.preload_state + "%";
					page.intro.load_counter = page.preload_state;


					// response from first right scene
					page.nN.nodes[3].response = function(response) {
						var scene = u.qs(".scene", response);
						u.ae(page.cN, scene);

						u.as(scene, "left", (page.content_offset_x + page.content_width)+"px");
						scene.org_offset_top = scene.offsetTop;
						scene.scroll_offset = 0;
						u.as(scene, "position", "fixed");
						u.as(scene, "width", (page.content_width-10) + "px");

						u.init(scene);

						//init footer
						page.initFooter(scene);

						this._scene = scene;
						page.preload_state += 20;

						page.intro.span.innerHTML = page.preload_state + "%";
						page.intro.load_counter = page.preload_state;


						// response from second left scene
						page.nN.nodes[0].response = function(response) {
							var scene = u.qs(".scene", response);
							u.ie(page.cN, scene);

							u.as(scene, "left", Math.round(page.content_offset_x-(page.content_width*2))+"px", false);
							scene.org_offset_top = scene.offsetTop;
							scene.scroll_offset = 0;
							u.as(scene, "position", "fixed", false);
							u.as(scene, "width", (page.content_width-10) + "px", false);

							u.init(scene);

							//init footer
							page.initFooter(scene);

							this._scene = scene;
							page.preload_state += 20;

							page.intro.span.innerHTML = page.preload_state + "%";
							page.intro.load_counter = page.preload_state;


							// response from second right scene
							page.nN.nodes[4].response = function(response) {
								var scene = u.qs(".scene", response);
								u.ae(page.cN, scene);

								u.as(scene, "left", Math.round(page.content_offset_x + (page.content_width*2))+"px");
								scene.org_offset_top = scene.offsetTop;
								scene.scroll_offset = 0;
								u.as(scene, "position", "fixed");
								u.as(scene, "width", (page.content_width-10) + "px");

								u.init(scene);

								//init footer
								page.initFooter(scene);

								this._scene = scene;
								page.preload_state += 20;

								page.intro.span.innerHTML = page.preload_state + "%";
								page.intro.load_counter = page.preload_state;
							}

							// request second right scene
							u.request(page.nN.nodes[4], page.nN.nodes[4].url);
						}

						// request second left scene
						u.request(page.nN.nodes[0], page.nN.nodes[0].url);
					}

					// request first right
					u.request(page.nN.nodes[3], page.nN.nodes[3].url);
				}

				// request first left
				u.request(page.nN.nodes[1], page.nN.nodes[1].url);
			}


			// set theme color
			page.setColor = function(color) {

				if(!u.hc(document.body, color)) {
					u.rc(document.body, "bordeaux|green|red|blue|brown", false);
					u.ac(document.body, color, false);
				}
				page.offsetHeight;
			}

			// inject full stop SVG
			page.injectFullStop = function(node) {

				if(!this.fullStopSvg) {

					var svg, shape;
					// create svg arrow
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


			// video player ejection
			page.ejectVideoPlayer = function() {
//				u.bug("eject videoplayer:" + page.videoPlayer.parentNode + ", " + (page.videoPlayer.parentNode ? u.nodeId(page.videoPlayer.parentNode) : "none"));

				if(page.videoPlayer && page.videoPlayer.parentNode) {
					page.videoPlayer.parentNode.removeChild(page.videoPlayer);

					// reset video player visual state
					u.a.transition(page.videoPlayer, "none");
					page.videoPlayer.removeAttribute("style");

//					u.bug("page.videoPlayer.node.info:" + page.videoPlayer.node.info);

					// show play bn again
					if(page.videoPlayer.node && page.videoPlayer.node.play && page.videoPlayer.node.info) {
						
						//u.a.transition(page.videoPlayer.node.info, "opacity 0.2s ease-in");
						//u.a.setOpacity(page.videoPlayer.node.info, 1);
						
						page.videoPlayer.node.info.transitioned = function() {
							u.a.transition(this, "none");
						}
						u.a.setOpacity(page.videoPlayer.node.info, 0);
						u.a.transition(page.videoPlayer.node.info, "opacity 0.3s ease-in");
						u.a.setOpacity(page.videoPlayer.node.info, 1);
						

						// prepare play bn
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


			// generic image fade up
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

			// generic play button
			page._bn_play_clicked = function() {

				// refs
				var play_bn = this;

				// Play button - remove mouseout, scale
				u.e.removeEvent(this, "mouseout", this.mouseout);
				this.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.a.transition(this, "all 0.4s ease-in");
				u.a.scale(this, 3);
				u.a.setOpacity(this, 0);

				// add video
				page.ejectVideoPlayer();
				u.ae(this.video_node, page.videoPlayer);
				page.videoPlayer.loadAndPlay(this.url);
				page.videoPlayer.node = this;

				// player - done anim
				page.videoPlayer.transitioned = function() {
					u.a.transition(this, "none");
				}
				u.as(page.videoPlayer, "display", "block");
				u.a.setOpacity(page.videoPlayer, 0);
				u.a.transition(page.videoPlayer, "all 0.3s ease-in");
				u.a.setOpacity(page.videoPlayer, 1);

				// player - done playing
				page.videoPlayer.ended = function(event) {
					// prepare play bn
					u.e.addEvent(this.node.play, "mouseover", this.mouseover);
					u.a.scale(this.node.play, 1);
					u.a.setOpacity(this.node.play, 1);
					
					page.videoPlayer.transitioned = function() {
						u.a.transition(this, "none");
						u.as(this, "display", "none");
					}
					// hide video
					u.a.transition(page.videoPlayer, "opacity 0.2s ease-in");
					u.a.setOpacity(page.videoPlayer, 0);
				}

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
