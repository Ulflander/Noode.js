## Noode

A class and basic event system for Node.js

Documentation available at http://www.aenoa-systems.com/docs/noode/
		
Based on John Resig Simple JavaScript Inheritance: http://ejohn.org/blog/simple-javascript-inheritance/ 

Both John Resig work and Noode.js part are MIT licensed.


## Example


```
var noode = require('noode');


var Foo = noode.AbstractEventDispatcher.extend({
	construct: function( content ){
		this.content = content;
	},
	getContent: function(){
	
		if ( this.dispatch('getContent', {content: this.content} ) )
		{
			return this.content ;
		}
	}
});




var Bar = Foo.extend({
	construct: function( content ){
		this._super('Bar-' + content ) ;
	}
});



var foo = new Foo( 'test' );
console.log ( foo.getContent() ) ; // => 'test'

var bar = new Bar( 'test' );
console.log ( bar.getContent() ) ; // => 'Bar-test'

var callback = function ( event )
{
	if ( event.content == 'test' )
	{
		return true ;
	}
	return false ;
};

bar.addListener( 'getContent' , callback);
foo.addListener( 'getContent' , callback );


console.log ( foo.getContent() ) ; // => undefined
console.log ( bar.getContent() ) ; // => 'Bar-test

```
