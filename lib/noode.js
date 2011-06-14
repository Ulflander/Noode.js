
/*

File: noode.js

Based on John Resig Simple JavaScript Inheritance: http://ejohn.org/ with some nice additions

Check out http://ejohn.org/blog/simple-javascript-inheritance/ 
for discussion about the first implementation

Both John Resig work and Noode.js are MIT licensed.


	
*/


/*
  	Class: Class
  	
  	The base class
*/
var EventEmitter = require( "events" ).EventEmitter,
	Class = function () {},
	initializing = false, 
	fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

/*
  	Function: Class.extend
  	
  	Create a new class that inherits from the base Class object
  	
  	Parameters:
  		prop - [object] Methods to add to the new class
  		
  	Returns:
  	The subclass
*/
Class.extend = function(prop, origin)
{
	var _super = origin ? origin.prototype : this.prototype ,
		name ;
	
	if ( !origin ) 
	{
		origin = this ;
	}

	// Instantiate a base class (but only create the instance,
	// don't run the init constructor)
	initializing = true;
	
	prototype = new origin();
	
	initializing = false;
	
	

	// Copy the properties over onto the new prototype
	for (name in prop)
	{
		
		// Check if we're overwriting an existing function
		prototype[name] = typeof prop[name] == "function" && 
		typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				
			(function(name, fn){
				return function() {
					var tmp = this._super,
						ret ;
					
					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];
					
					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					ret = fn.apply(this, arguments);    
					
					this._super = tmp;
					
					return ret;
				};
			})(name, prop[name]) :
				
			prop[name];
	}
	
	// The dummy class constructor
	function Class() {
		// All construction is actually done in the init method
		if ( !initializing )
		{
			if ( typeof this.construct == 'function' ) {
				this.construct.apply(this, arguments);
			}
		} 
	}
	
	// Populate our constructed prototype object
	Class.prototype = Object.create( prototype );

	// And make this class extendable
	Class.extend = arguments.callee;
	
	return Class ;
};


/*
	Class: Event
	
*/
var Event = Class.extend({
	/*
		Constructor: construct
		
		Parameters:
			name - [string] Name of the event to dispatch
			parameters - [object] Parameters of the new event
			emitter - [object] Emitter object
			
	*/
	construct: function ( name , parameters , emitter )
	{
		if ( typeof(name) != 'string' )
		{
			throw 'Noode - Event - name param must be a string' ;
		}
		if ( parameters && typeof(parameters) != 'object' )
		{
			throw 'Noode - Event - '+ name +' - parameters param must be an object, ' +typeof(parameters)+ ' given.' ;
		}

		var p = parameters || {} ;
		
		for ( k in p )
		{
			this[k] = p[k] ;
		}

		this.prevented_ = false ;
		
		this.name_ = name ;
		
		this.emitter_ = emitter ;
		
	},

	/*
		Function: getName
		
		Get the name of the event
		
		Returns:
		The name of the event
	*/
	getName: function ()
	{
		return this.name_ ;
	},

	/*
		Function: getEmitter
		
		Get the object that dispatched the event
		
		Returns:
		The object that dispatched the event
	*/
	getEmitter: function ()
	{
		return this.emitter_ ;
	},

	/*
		Function: prevent
		
		Prevent the default action of the event
	*/
	prevent: function ()
	{
		this.prevented_ = true ;
	},

	/*
		Function: isPrevented
		
		Get current prevented state of the event
		
		Returns:
		True is the event has been prevented by a listener, false otherwise
	*/
	isPrevented: function ()
	{
		return this.prevented_ ;
	}
});

/*
	Class: AbstractEventDispatcher
	
*/
var AbstractEventDispatcher = Class.extend({
	
	
	construct: function ()
	{
		// Call the super constructor.
		EventEmitter.call( this );
	},
	
	/*
		Function: dispatch
		
		Parameters:
			event - [Event|string] Name of the event to dispatch
			parameters - [object] Event parameters object to dispatch to listeners, optional: only if a string given as first parameters
			
		Returns:
		False if a listener has returned false (event has been prevented), true otherwise 
	*/
	emit: function ( event , parameters )
	{
		var evt ;
		
		
		if ( event == 'newListener' )
		{
			parameters = {
					event: parameters,
					callback: arguments[2]
				};
		}
		

		if ( typeof(event) == 'string' )
		{
			evt = new Event( event , parameters , this ) ;
			
			this._super(event, evt );
			
		} else if ( event instanceof Event )
		{
			evt = event ;
			
			this._super( event.getName(), event );
		} else {

			throw 'Noode - AbstractEventDispatcher - event param must be a string or an Event object' ;
		}
		
		return evt.isPrevented () !== true ;
	}

}, EventEmitter);



exports.Event = Event ;
exports.Class = Class ;
exports.AbstractEventDispatcher = AbstractEventDispatcher ;
