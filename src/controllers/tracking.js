import { Tracking as clientTracking } from "sajari";

import { Listener } from "./";

export const trackingResetEvent = "tracking-reset";

const events = [trackingResetEvent];

class Tracking {
  constructor() {
    this.listeners = {
      [trackingResetEvent]: new Listener()
      // [resultClickedEvent]: new Listener()
    };
  }

  /**
   * Register a listener for a specific event.
   * @param {string} event Event to listen for
   * @param {function()} callback Callback to run when the event happens.
   * @return {function()} The unregister function to remove the callback from the listener.
   */
  listen(event, callback) {
    if (events.indexOf(event) === -1) {
      throw new Error(`unknown event type "${event}"`);
    }
    return this.listeners[event].listen(callback);
  }

  /**
   * Emits a tracking reset event to the tracking reset event listener.
   * @private
   */
  _emitTrackingReset(queryValues) {
    this.listeners[trackingResetEvent].notify(listener => {
      listener(queryValues);
    });
  }

  /**
   * Reset the tracking.
   * @param {Object} values Key-value parameters for pipeline request.
   */
  reset(values) {
    throw new Error("method 'reset' unimplemented");
  }

  /**
   * Tracking returns the tracking data to be attached to the pipeline request.
   * @param {Object} values The key-value pairs of parameters to use in the
   * pipeline search.
   * @return {clientTracking} Tracking values to be used in the search request.
   */
  tracking(values) {
    throw new Error("method 'tracking' unimplemented");
  }
}

class ClickTracking extends Tracking {
  /**
   * Construct a ClickTracking instance.
   * 
   * @param {string} field Field to use for click token generation.
   * @param {string="q"} qParam Value to use for full-text query param.
   */
  constructor(field = "url", qParam = "q") {
    super();

    /** @private */
    this.field = field;
    /** @private */
    this.qParam = qParam;

    const tracking = new clientTracking();
    tracking.clickTokens(field);
    /** @private */
    this.clientTracking = tracking;

    /** @private */
    this.prevQ = "";
  }

  /**
   * Reset the tracking.
   * @param {Object} values Key-value parameters for pipeline request.
   */
  reset(values) {
    this.clientTracking.reset();
    this._emitTrackingReset(values);
  }

  /**
   * Construct a tracking session to be used in a search.
   * 
   * @param {Object} values Key-value pairs to use in query.
   */
  tracking(values) {
    const newQ = values[this.qParam];
    const first3CharactersChanged = !newQ.startsWith(
      this.prevQ.substr(0, Math.min(newQ.length, 3))
    );
    const queryCleared = this.prevQ.length > 0 && newQ.length === 0;
    if (first3CharactersChanged || queryCleared) {
      this.reset(values);
    }
    this.prevQ = newQ;
    return this.clientTracking;
  }
}

export { ClickTracking };