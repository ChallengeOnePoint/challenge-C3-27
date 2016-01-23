/**
 * @requires jquery.min.js
 * @requires fastclick.js
 */

API.on('ready', function() {
	(function(window, document, $, undefined) {
		'use strict';

		$(function() {
			// Lancement FastClick sur Body
			window.addEventListener('load', function() {
				new FastClick(document.body);
			}, false);

			// FB connect
			$("#fb-connect-bt").bind("click", function(e) {
				e.preventDefault();
				API.login(function(data) {
                    $(".popin-login").fadeOut("slow");

                    // Get datas
                    API.get(function(data) {

                    })
				});

			});
		});

	})(window, document, jQuery);
});
