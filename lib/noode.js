
	/*
		Noode.js
		
		Based on John Resig Simple JavaScript Inheritance: http://ejohn.org/ with some nice additions
		
		Check out http://ejohn.org/blog/simple-javascript-inheritance/ 
		for discussion about the first implementation
		
		Both John Resig work and Noode.js are MIT licensed.
		
		
		Copyright (c) 2011 Xavier Laumonier

		Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
		to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
		and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
		
		The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
		
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
		IN THE SOFTWARE.
		
		
	*/


	var initializing = false, 
		fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/,
	/*
	  	Class: Class
	*/
		Class = function () {},
		AbstractEventDispatcher ;

	/*
	  	Function: Class.extend
	  	
	  	Create a new class that inherits from the base Class object
	  	
	  	Parameters:
	  		prop - [object] Methods to add to the new class
	  		
	  	Returns:
	  	The subclass
	*/
	Class.extend = function(prop)
	{
		
		var _super = this.prototype,
			name ;
		
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		
		prototype = new this();
		
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
		Class.prototype = prototype;

		/*
			Function: construct
			
			Does nothing, so it is not required to call this._super in direct subclass
			
		 */
		Class.prototype.construct = function ()
		{
			
		},
		/*
			Function: delegate
			
			Method for easy delegation to the current instance
			
			Parameters:
				fn - [string] The name of the function 
			
		 */
		Class.prototype.delegate = function ( fn )
		{
			var a = this[fn],
				b = this ;
			
			return function () {
				context.__caller = this ;
				return a.apply ( b , arguments );
			};
		};
		
		// Enforce the constructor to be what we expect
		Class.constructor = Class;
		
		// And make this class extendable
		Class.extend = arguments.callee;
		
		return Class;
	};

	

	/*
		Class: AbstractEventDispatcher
		
	*/
	AbstractEventDispatcher = Class.extend({
		
		
		/*
			Function: dispatch
			
			Parameters:
				event - [string] Name of the event to dispatch
				parameters - [object] Event parameters object to dispatch to listeners
				
			Returns:
			False if a listener has returned false (event has been prevented), true otherwise 
		*/
		dispatch: function ( event , parameters )
		{
			if (!this.listeners__)
			{
				return;
			}
		
			if ( !typeof(event) == 'string' )
			{
				throw 'Noode - AbstractEventDispatcher - event param must be a string' ;
			}
			
			if (!parameters)
			{
				parameters = {};
			}
			
		
			var ret = true,
				k ;
		
			if ( typeof(this.listeners__[event])=='object' )
			{
				for ( k in this.listeners__[event] )
				{
					if ( this.listeners__[event][k] ( parameters ) == false )
					{
						ret = false ;
					}
				}
			}
		
			return ret ;
		},
		/*
			Function: on
			
			Adds an event listener
			
			Parameters:
				event - [string] Name of the event to listen
				callback - [function] Function to call when event is dispatched
				
			Returns:
			Current instance for chained commands on this element
		*/
		on: function ( event , callback )
		{
			if (!this.listeners__)
			{
				this.listeners__ = {} ;
			}
			
			if ( !typeof(event) == 'string' )
			{
				throw 'Noode - AbstractEventDispatcher - event param must be a string' ;
			}
			if ( !typeof(callback) == 'function' )
			{
				throw 'Noode - AbstractEventDispatcher - callback param must be a function' ;
			}
			
			if ( typeof(this.listeners__[event]) !== 'object' )
			{
				this.listeners__[event] = [] ;
			}
			
			this.listeners__[event].push(callback);
			
			return this;
		},
		/*
			Function: addListener
			
			Alias of AbstractEventDispatcher.on
		*/
		addListener: function ( event, callback ) 
		{
			return this.on(event, callback);
		},
		/*
			Function: off
			
			Removes an event listener
			
			Parameters:
				event - [string] Name of the event to listen
				callback - [function] Function to call when event is dispatched
				
			Returns:
			Current instance for chained commands on this element
		*/
		off: function ( event , callback )
		{
			if (!this.listeners__)
			{
				return; ;
			}
			
			if ( !typeof(event) == 'string' )
			{
				throw 'Noode - AbstractEventDispatcher - event param must be a string' ;
			}
			if ( !typeof(callback) == 'function' )
			{
				throw 'Noode - AbstractEventDispatcher - callback param must be a function' ;
			}
			
			if ( typeof(this.listeners__[event]) == 'object' )
			{
				for ( var k in this.listeners__[event] )
				{
					if ( this.listeners__[event][k] == callback )
					{
						delete(this.listeners__[event][k]);
						break;
					}
				}
			}
			
			return this;
		},
		/*
			Function: remListener
			
			Alias of AbstractEventDispatcher.off
		*/
		remListener: function ( event, callback ) 
		{
			return this.off(event, callback);
		}
	
	});
	
	

	exports.Class = Class ;
	exports.AbstractEventDispatcher = AbstractEventDispatcher ;
	