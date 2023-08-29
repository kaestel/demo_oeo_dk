Util.Objects["newsletter"] = new function() {
	this.init = function(div) {
//		u.bug("newsletter init:" + u.nodeId(div, 1))
//		alert("bajs")
		div.form = u.qs("form", div);
		div.form.div = div;
		u.f.init(div.form);

		// get form fields manually (don't want to hardcode campaign monitor names in JS)
		div.form._email = u.qs(".field.email input", div.form);
		div.form._name = u.qs(".field.string input", div.form);

		// apply hover to entire actions element
		var actions = u.qs(".actions", div.form);
		actions.bn = u.qs("input", actions);

		// mouseover and -out handlers
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

		// apply appropriate event
		if(u.e.event_pref == "mouse") {
			u.e.addEvent(actions, "mouseover", _over);
			u.e.addEvent(actions, "mouseout", _out);
		}
		else {
			u.e.addEvent(actions, "touchstart", _over);
			u.e.addEvent(actions, "touchend", _out);
		}


		div.form.submitted = function() {

			this.div.response = function(response) {
				u.t.resetTimer(this.t_timeout_error);

				// fade IN receipt
				this.receipt = u.ae(this, "div", {"class":"receipt"});
				if(response && response.Status && response.Status == 200) {
					u.ae(this.receipt, "h2", {"html":"Thank you for signing up to our newsletter. You'll hear from us soon."});
					this.form._email.used = false;
					this.form._email.val(this.form._email.default_value);
					this.form._name.used = false;
					this.form._name.val(this.form._name.default_value);
				}
				else {
					u.ae(this.receipt, "h2", {"html":"An error occured. Please check your information."});
				}
				this.receipt.form = this.form;

				u.a.setOpacity(this.receipt, 0);
				u.a.transition(this.receipt, "opacity 0.4s linear 0.3s");
				u.a.setOpacity(this.receipt, 1);


				// fade IN form AGAIN after 4s
				this.restoreForm = function() {

					// face OUT and remove receipt
					this.receipt.transitioned = function() {
						this.parentNode.removeChild(this);
					}
					u.a.transition(this.receipt, "opacity 0.3s");
					u.a.setOpacity(this.receipt, 0);

					// restore form
					u.a.transition(this.form, "opacity 0.3s linear 0.4s");
					u.a.setOpacity(this.form, 1);

				}
				// set form restore timer
//				u.t.setTimer(this, this.restoreForm, 5000);
			}

			this.div.response({"Status":200});
//			u.request(this.div, this.action, {"params":u.f.getParams(this), "method":"script"});
			this.div.t_timeout_error = u.t.setTimer(this.div, this.div.response, 5000);

			// fade OUT form
			this.transitioned = function() {
				u.a.transition(this, "none");
			}
			u.a.transition(this, "opacity 0.3s");
			u.a.setOpacity(this, 0);

		}

	}
}
