/*eslint-disable*/
/**
 * @author RubaXa <trash@rubaxa.org>
 * @license MIT
 */
(function (){
  "use strict";

  var _rspace = /\s+/;


  function _getListeners(obj, name){
    var list = obj.__emList;

    name = name.toLowerCase();

    if( list === void 0 ){
      list = obj.__emList = {};
      list[name] = [];
    }
    else if( list[name] === void 0 ){
      list[name] = [];
    }

    return list[name];
  }



  /**
   * @class Event
   * @param {String} type
   * @constructor
   */
  function Event(type){
    this.type = type.toLowerCase();
  }
  Event.fn = Event.prototype = {
    constructor: Event,

    isDefaultPrevented: function (){
    },

    preventDefault: function (){
      this.isDefaultPrevented = function (){
        return true;
      };
    }
  };


  /**
   * @class EventEmitter
   * @constructor
   */
  var EventEmitter = function (){};
  EventEmitter.fn = EventEmitter.prototype = {
    constructor: EventEmitter,

    __lego: function (){
      /* dummy */
    },


    /**
     * Attach an event handler function for one or more events to the selected elements.
     * @param {String}    events  One or more space-separated event types.
     * @param {Function}  fn      A function to execute when the event is triggered.
     * @returns {EventEmitter}
     */
    on: function (events, fn){
      events = events.split(_rspace);
      var n = events.length, list;
      while( n-- ){
        list = _getListeners(this, events[n]);
        list.push(fn);
      }
      return this;
    },


    /**
     * Remove an event handler.
     * @param {String}    [events]  One or more space-separated event types.
     * @param {Function}  [fn]      A handler function previously attached for the event(s).
     * @returns {EventEmitter}
     */
    off: function (events, fn){
      if( events === void 0 ){
        this.__emList = void 0;
      }
      else {
        events = events.split(_rspace);
        var n = events.length;
        while( n-- ){
          var list = _getListeners(this, events[n]), i = list.length, idx = -1;

          if( arguments.length === 1 ){
            list.splice(0, 1e5); // dirty hack
          } else {
            if( list.indexOf ){
              idx = list.indexOf(fn);
            } else {
              while( i-- ){
                if( list[i] === fn ){
                  idx = i;
                  break;
                }
              }
            }

            if( idx !== -1 ){
              list.splice(idx, 1);
            }
          }
        }
      }

      return this;
    },


    /**
     * Execute all handlers attached to an element for an event
     * @param {String}  type    One event types
     * @param {Array}   [args]  An array of parameters to pass along to the event handler.
     */
    emit: function (type, args){
      var list = _getListeners(this, type), i = list.length;
      type = 'on'+type.charAt(0).toUpperCase()+type.substr(1);

      if( typeof this[type] === 'function' ){
        this[type].apply(this, args);
      }

      if( i > 0 ){
        args = [].concat(args);

        while( i-- ){
          list[i].apply(this, args);
        }
      }
    },


    /**
     * Execute all handlers attached to an element for an event
     * @param {String}  type    One event types
     * @param {Array}   [args]  An array of additional parameters to pass along to the event handler.
     * @returns {EventEmitter}
     */
    trigger: function (type, args){
      var evt = new Event(type);
      evt.target = this;
      this.emit(type, [evt].concat(args));
      return this;
    }
  };


  EventEmitter.apply = function (target){
    target.on = EventEmitter.fn.on;
    target.off = EventEmitter.fn.off;
    target.emit = EventEmitter.fn.emit;
    target.trigger = EventEmitter.fn.trigger;
  };


  // exports
  EventEmitter.Event = Event;

  module.exports = EventEmitter

})();
