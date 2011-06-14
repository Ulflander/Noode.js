## Noode

A javascript class-based system with inheritance and events handling for Node.js.

Event system is a little more complex than node one : Events are 'noode.Event' object instances.

However the API remains the same as Node.js. Check out node docs to know more about EventEmitter. 

Documentation available for noode at http://www.aenoa-systems.com/docs/noode/
		
Based on John Resig Simple JavaScript Inheritance: http://ejohn.org/blog/simple-javascript-inheritance/ for the base Class

Both John Resig work and Noode.js part are MIT licensed.


## Install

Noode is available through npm

```
npm install noode -g
```


## Example


Run node with example.js to see result of this example 

```

// We require the noode module
var noode = require('noode');




// A very basic class
var Basic = noode.Class.extend({
	
	// That say hello
	sayHello: function () {
		console.log('Hello') ;
	}
	
});

var basic = new Basic () ;
basic.sayHello () ; // => 'Hello'





// Another basic class with inheritance
var BasicChild = Basic.extend({

	// That say hello too
	sayHello: function () {
		console.log('Hello world') ;
		
		// We call super method
		this._super () ;
	}
	
});

var basicChild = new BasicChild () ;
basicChild.sayHello () ; // => 'Hello world', 'Hello'



// An exemple of some class extending AbstractEventDispatcher to dispatch events
var Foo = noode.AbstractEventDispatcher.extend({
	construct: function( content ){

		this.content = content;
		
	},
	// Here we will dispatch an event
	getContent: function(){
		// An easy way to dispatch events without creating an Event object, AbstractEventDispatcher will do it for you
		if ( this.dispatch('getContent', {content: this.content} ) )
		{
			return this.content ;
		}
	},
	
	getOddContent: function ()
	{
		// The common way to dispatch event
		if ( this.dispatch( new noode.Event ( 'getContent', {content: this.content} ) ) )
		{
			return this.content ;
		}
	}
});


var foo = new Foo( 'test' );
console.log ( foo.getContent() ) ; // => 'test'
console.log ( foo.getOddContent() ) ; // => 'test'



// Inheritance again
var Bar = Foo.extend({
	construct: function( content ){
		// Call the super constructor
		this._super('Bar-' + content ) ;
	}
});



var bar = new Bar( 'test' );
console.log ( bar.getContent() ) ; // => 'Bar-test'



// Lets add some listeners

// Here is a callback used for our listeners
var callback = function ( event )
{
	// If event parameters dont pleased us
	if ( event.content == 'test' )
	{
		// We prevent the default action
		event.prevent () ;
	}
};

// We attach our listeners
bar.on( 'getContent' , callback);
foo.on( 'getContent' , callback );

// Lets try our listeners
console.log ( bar.getContent() ) ; // => 'Bar-test'
console.log ( foo.getContent() ) ; // => undefined






//Lets create our own event
var OddEvent = noode.Event.extend({
	
	construct: function ( parameters )
	{
		this._super ( 'oddEvent' , parameters ) ;
	},
	
	getOddEventThing: function ()
	{
		return 'That\'s odd' ;
	}
	
});

// The class that will dispatch the OddEvent
var OddClass = noode.AbstractEventDispatcher.extend ({
	
	dispatchOddEvent: function ()
	{
		this.dispatch ( new OddEvent() ) ;
	}
	
});


var odd = new OddClass () ;

// We listen to our event
odd.on('oddEvent', function ( event )
{
	// Test event
	console.log ( event.getOddEventThing () ) ;
});

// and dispatch it
odd.dispatchOddEvent () ; // => 'That's odd'


```
