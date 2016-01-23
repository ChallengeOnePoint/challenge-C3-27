var PostIt = function( datas ){
	this.title = datas.title;
	this.body = datas.body;
	this.hashtags = datas.hashtags;
	this.id = datas.id
	this.$dom = "";
}

PostIt.prototype.generateDom = function(){
	this.$dom = '<div class="post-it" data-id="' + this.id + '"><div class="title"><i class="fa fa-lock"></i><span class="t-title"><div class="title"><i class="fa fa-lock"></i><span class="t-title">' + this.title + '</span><a href="#" class="cross"><i class="fa fa-times"></i></a></div><div class="body"><p class="t-body">' + this.body + '</p></div><div class="avatar" style="background-image: url(' + this.avatar + ')"></div><div class="hashtags"><span>#toto</span><span>#test</span><span>#awesomness</span></div></div>';
}

PostIt.prototype.appendDom = function( $container ){
	$container.append( this.$dom );
}

PostIt.prototype.disable = function(){
	TweenMax.to( this.$dom, 0.5, { 'opacity': 0, ease: Expo.easeOut } );
	this.$dom.find('.fa-lock').show();
}

PostIt.prototype.enable = function(){
	TweenMax.to( this.$dom, 0.5, { 'opacity': 1, ease: Expo.easeOut } );
	this.$dom.find('.fa-lock').hide();
}

PostIt.prototype.setAvatar = function( url ){
	this.avatar = url
	TweenMax.set( this.$dom.find('.avatar'), { backgroundImage: this.avatar } );
}

PostIt.prototype.setTitle = function( title ){
	this.title = title;
	this.$dom.find('.t-title').text( this.title );
}

PostIt.prototype.setBody = function( text ){
	this.body = text;
	this.$dom.find('.t-title').text( this.body );
}

PostIt.prototype.setHashtags = function( hashs ){
	this.hashtags = hashs;
	this.$dom.find('.hashtags').text( this.hashtags );
}