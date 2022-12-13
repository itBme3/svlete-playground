import type { ColumnConfig, SortOrder, Row, SortFnParams } from "./types";

export function updateSortingAttrs(sortingVars: SortingParams): SortingParams {
  if (!sortingVars.column.sortable) {
    return sortingVars;
  }
  if (sortingVars.sortBy === sortingVars.column.key) {
    return {
      ...sortingVars,
      sortOrder: sortingVars.sortOrder === "ascending" ? "descending" : "ascending"
    };
  } else {
    return {
      ...sortingVars,
      sortBy: sortingVars.column.key,
      coloredColumnTitle: true
    };
  }
}

export function determineIfScrolled(isScrolled: boolean, scrollAmount: number): boolean {
  return scrollAmount > 0;
}

interface SortingParams {
  column: ColumnConfig;
  sortBy: string;
  sortOrder: SortOrder;
  coloredColumnTitle: boolean;
}

export const defaultSort = (rows: Row[], params: SortFnParams): Row[] => {
  const { sortBy, sortOrder = "descending", dataType } = params;
  if (!sortBy) {
    return rows;
  }
  return rows.sort((a: Row, b: Row) => {
    const sortDataType = dataType || "strings";
    const _a =
      sortOrder === "descending"
        ? sortDataType === "strings"
          ? `${a[sortBy]}`.toUpperCase()
          : sortDataType === "dates"
          ? new Date(a[sortBy]).getTime()
          : parseInt(`${a[sortBy]}`)
        : sortDataType === "strings"
        ? `${b[sortBy]}`.toUpperCase()
        : sortDataType === "dates"
        ? new Date(b[sortBy]).getTime()
        : parseInt(`${b[sortBy]}`);
    const _b =
      sortOrder === "descending"
        ? sortDataType === "strings"
          ? `${b[sortBy]}`.toUpperCase()
          : sortDataType === "dates"
          ? new Date(b[sortBy]).getTime()
          : parseInt(`${b[sortBy]}`)
        : sortDataType === "strings"
        ? `${a[sortBy]}`.toUpperCase()
        : sortDataType === "dates"
        ? new Date(a[sortBy]).getTime()
        : parseInt(`${a[sortBy]}`);
    if (_b < _a) {
      return -1;
    }
    if (_b > _a) {
      return 1;
    }
    return 0;
  });
};
