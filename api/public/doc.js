// Data
var ticket = {
    id,
    title,
    body,
    author,
    editor,
    hashtags
}

var user = {
    id,
    name,
    picture,
    color
}

// API
API.on('ready', function() {

});

API.login({
    facebook,
    google // TODO
}, function(data) {
    // data.user
});

API.add({
    title,
    body
});

API.on('update', function(data) {
    // data.ticket
});

API.remove({
    postit
}, function(data) {
    // data.ticket
});

API.get({
    from,
    to,
    hashtags
}, function(data) {
    // data.tickets
})

API.lock(postit);