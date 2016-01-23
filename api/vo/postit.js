var _ = require('lodash');

/**
 * PostIt
 * @param {User} author
 * @param {string} [title]
 * @param {string} [body]
 * @param {User} [editor]
 * @constructor
 */
var PostIt = function PostIt(author, title, body, editor) {
    this.id = _.uniqueId('postit_');
    this.title = title;
    this.body = body;
    this.author = author;
    this.editor = editor === void(0)?null:editor;
};

/**
 * Return object representation of the current postit
 * @return {object}
 */
PostIt.prototype.toObject = function() {
    return {
        id: this.id,
        title: this.title,
        body: this.body,
        author: this.author,
        editor: this.editor
    };
};

exports.PostIt = PostIt;