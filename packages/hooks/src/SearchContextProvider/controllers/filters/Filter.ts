/* eslint-disable no-param-reassign */
import { EVENT_OPTIONS_UPDATED, EVENT_SELECTION_UPDATED } from '../../events';
import { Listener } from '../listener';
import { FilterOptions, JoinOperator, Options } from './types';

const events = [EVENT_SELECTION_UPDATED, EVENT_OPTIONS_UPDATED];

/**
 * Filter is a helper class for building filters from UI components.
 */
export default class Filter {
  private current: string[];

  private initial: string[];

  private name: string;

  private field: string | undefined;

  private options: Options;

  private multi: boolean;

  private count: boolean;

  private repeated: boolean;

  private joinOperator: JoinOperator;

  private listeners: { [k: string]: Listener };

  /**
   * Constructs an instance of Filter.
   *
   * @example
   * const filter = new Filter({});
   */
  constructor({
    initial = [],
    joinOperator = 'OR',
    multi = false,
    options = {},
    repeated = false,
    name,
    field,
    count = false,
  }: FilterOptions) {
    if (typeof initial === 'string') {
      initial = [initial];
    }

    /** @private */
    this.current = initial;
    /** @private */
    this.initial = initial;
    /** @private */
    this.name = name;
    /** @private */
    this.field = field;
    /** @private */
    this.count = count;
    /** @private */
    this.options = options;
    /** @private */
    this.multi = multi;
    /** @private */
    this.repeated = repeated;
    /** @private */
    this.joinOperator = joinOperator;
    /** @private */
    this.listeners = {
      [EVENT_SELECTION_UPDATED]: new Listener(),
      [EVENT_OPTIONS_UPDATED]: new Listener(),
    };
  }

  /**
   * Register a listener for a specific event.
   */
  public listen(event: string, callback: (filter: Filter) => void): () => void {
    if (events.indexOf(event) === -1) {
      throw new Error(`unknown event type "${event}"`);
    }
    return this.listeners[event].listen(callback);
  }

  /**
   * Set the state of the filter.
   */
  public set(values: string[], merge: boolean = false) {
    if (merge) {
      const nonDuplicate = values.filter((v) => !this.current.includes(v));
      this.current = [...this.current, ...nonDuplicate];
    } else {
      this.current = values;
    }

    this.emitSelectionUpdated();
  }

  /**
   * Remove a list of values from the current state
   */
  public remove(values: string[]) {
    this.current = this.current.filter((v) => !values.includes(v));
    this.emitSelectionUpdated();
  }

  /**
   * returns whether the filter is set or not.
   */
  public isSet(name: string): boolean {
    return this.current.indexOf(name) !== -1;
  }

  /**
   * Set or merge filter options.
   */
  public setOptions(options: Options, merge: boolean = false) {
    if (merge) {
      this.options = { ...this.options, ...options };
    } else {
      this.options = options;
    }

    this.emitOptionsUpdated();
  }

  public getName() {
    return this.name;
  }

  public getField() {
    return this.field;
  }

  public getCount() {
    return this.count;
  }

  public getOptions() {
    return this.options;
  }

  public get() {
    return this.current;
  }

  public isRepeated() {
    return this.repeated;
  }

  public isMulti() {
    return this.multi;
  }

  /**
   * Builds up the filter string from the current filter and it's children.
   */
  public filter() {
    return this.current
      .map((c) => {
        let f = this.options[c];
        if (typeof f === 'function') {
          f = f();
        }
        if (f !== undefined && f !== '') {
          f = `(${f})`;
        }
        return f;
      })
      .filter(Boolean)
      .join(` ${this.joinOperator} `);
  }

  public getBuckets() {
    return Object.entries(this.options)
      .map(([key, value]) => `${this.name}_${key}:${value}`)
      .join(',');
  }

  /**
   * Reset the current filter to the initial one
   */
  public reset() {
    this.current = [...this.initial];
    this.emitSelectionUpdated();
  }

  /**
   * Emits a selection updated event to the selection updated listener.
   * @private
   */
  protected emitSelectionUpdated() {
    this.listeners[EVENT_SELECTION_UPDATED].notify((listener) => {
      listener();
    });
  }

  /**
   * Emits an options updated event to the options updated listener.
   * @private
   */
  protected emitOptionsUpdated() {
    this.listeners[EVENT_OPTIONS_UPDATED].notify((listener) => {
      listener();
    });
  }
}