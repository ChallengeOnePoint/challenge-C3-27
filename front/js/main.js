/**
 * @requires jquery.min.js
 * @requires fastclick.js
 */

(function(window, document, $, undefined) {
    'use strict';

    $(document).on('ready', function() {
		// Lancement FastClick sur Body
		window.addEventListener('load', function() {
			new FastClick(document.body);
		}, false);

		console.log('ready');
    });

})(window, document, jQuery);