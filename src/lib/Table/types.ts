import type { AnySvelteComponent, DoNotCare } from "$lib/types";

export interface ColumnConfig {
  key: string;
  title?: string;
  sortable?: boolean;
  /**
   * Some columns aren't tied to a sortable key and this
   * allows them to set a sortBy field.
   */
  sortBy?: string;
  /**
   * Value is used to figure out the value to show on a generic
   * non-key based column. Usually this would be used to calculated
   * a string or show a "hard coded" value
   * @param row is the current row being rendered
   * @return string to be shown.
   */
  value?: (row: DoNotCare) => string;
  width?: string;
  /**
   * if width is defined (and is not auto),
   * set to tell how cell should handle overflow
   * default: "ellipsis"
   */
  overflow?: "ellipsis" | "auto" | "hidden" | "wrap";
  default?: string;
  render?: ColumnRender;
  stringify?: (row: DoNotCare) => Promise<string>;
  isInteractive?: boolean;
}

export interface DateTableColumnConfig extends ColumnConfig {
  sortDataType?: "strings" | "numbers" | "dates";
}

export type SortOrder = "ascending" | "descending";

export interface SortFnParams {
  sortBy: string;
  sortOrder?: SortOrder;
  dataType?: "strings" | "numbers" | "dates";
}

interface ColumnRender {
  component: AnySvelteComponent;
  /**
   * generateProperties is a method that will allow custom
   * params to be passed to a SvelteComponent dynamicly based
   * on the current row being rendered.
   * @param row is the data for the current row being rendered.
   * @param update is a method that allows a custom config component to make call
   * backs when data in that row has been changed, ie a date picker for end date
   * @return it returns a Map of params to be passed to the component.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateProperties?: (row: any, update: (data) => void) => Record<string, any>;
}

export type Row = {
  [key: string | number]: DoNotCare;
};

export interface SelectableRowsConfig {
  /**
   * if false, selectedIds will only include rows visible to component
   * if true, selectedIds will persist after row is no longer visible to component
   * @type {boolean} — default: false
   */
  persist?: boolean;
  /**
   * function that determines if row checkbox should be disabled
   * default: (row) => false
   * @param {Row} row
   * @returns {boolean}
   */
  disabled?: (row: Row) => boolean;
  /**
   * function that determines if row checkbox should be indeterminate
   * default: (row) => false
   * @param {Row} row
   * @returns {boolean}
   */
  indeterminate?: (row: Row) => boolean;
}
