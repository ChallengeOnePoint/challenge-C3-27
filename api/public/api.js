(function(window) {
    var API = function API() {
        this._path = '/';
        this._ready = false;
        this._user = null;
        this._events = [];
        this._setup();
    };

    /**
     * Setup API
     */
    API.prototype._setup = function() {
        var self = this;

        // Facebook
        window.fbAsyncInit = function() {
            FB.init({
                appId: '1543718169272296',
                version: 'v2.5'
            });

            // Socket.io
            var s = document.createElement("script");
            s.type = 'text/javascript';
            s.src = self._path+'socket.io/socket.io.js';
            s.onload = function() {
                self.socket = io.connect('http://localhost:1664');

                // Events
                ['get', 'login', 'update', 'remove'].forEach(function(id) {
                    self.socket.on(id, function(data) {
                        self.dispatch(id, data);
                    });
                });

                self.socket.on('connect', function () {
                    // Ready
                    self._ready = true;
                    self.dispatch('ready');
                });
            };
            document.head.appendChild(s);

        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js"; // TODO: locale
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    /**
     * Add an event
     * @param {string} eventName
     * @param {function} callback
     */
    API.prototype.on = function(eventName, callback) {
        this._events.push({
            name: eventName,
            callback: callback
        });
    };

    /**
     * Remove an event
     * @param {string} eventName
     * @param {function} callback
     */
    API.prototype.off = function(eventName, callback) {
        var events = [];
        this._events.forEach(function(event) {
            if(event.name !== eventName || event.callback !== callback) {
                events.push(event);
            }
        });
        this._events = events;
    };


    /**
     * Dispatch event
     * @param {string} eventName
     * @param {Object} [data]
     */
    API.prototype.dispatch = function(eventName, data) {
        this._events.forEach(function(event) {
            if(eventName === event.name) {
                event.callback(data);
            }
        });
    };

    /**
     * Login
     * @param {function} callback
     */
    API.prototype.login = function(callback) {
        var self = this;
        if(this._ready) {
            FB.login(function(data){
                if(data.status === 'connected') {
                    FB.api('/me', {
                        fields: 'id,name,picture'
                    }, function(response) {
                        self._user = {
                            id: response.id,
                            name: response.name,
                            picture: response.picture.data.url
                        };

                        // Login
                        var __callback = function() {
                            console.log('callback !!!');
                            self.off('login', __callback);
                            callback(self._user);
                        };
                        self.on('login', __callback);
                        self.socket.emit('login', self._user);
                    });
                }
                else {
                    callback({
                        success: false,
                        error: 'Facebook error'
                    });
                }
            }, {
                // TODO: scope
            });
        }
        else {
            callback({
                success: false,
                error: 'API nor ready'
            });
        }
    };

    /**
     * Get all tickets
     * @param {function} callback
     */
    API.prototype.get = function(callback) {
        var self = this,
            __callback = function(data) {
                self.off('get', __callback);
                callback(data);
            };
        this.on('get', __callback);
        this.socket.emit('get');
    };

    API.prototype.add = function(postit) {
        this.socket.emit('add', postit);
    };

    API.prototype.lock = function(postit) {
        this.socket.emit('lock', postit);
    };

    API.prototype.unlock = function(postit) {
        this.socket.emit('unlock', postit);
    };

    API.prototype.remove = function(postit) {
        this.socket.emit('remove', postit);
    };

    // Set
    window.API = new API();
})(window);