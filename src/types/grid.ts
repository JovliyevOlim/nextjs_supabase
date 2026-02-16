import type {ColumnState, SortModelItem} from 'ag-grid-community';

export type GridType = 'invoices' | 'orders';

export interface TextFilterModel {
  filterType: 'text';
  filter: string;
}

export interface NumberFilterModel {
  filterType: 'number';
  type: 'equals' | 'notEqual' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual';
  filter: number;
}

export interface DateFilterModel {
  filterType: 'date';
  type: 'equals' | 'greaterThan' | 'lessThan';
  dateFrom: string;
}

export type GridFilterModel = Record<string, TextFilterModel | NumberFilterModel | DateFilterModel>;

export interface GridViewConfig {
  columnState: ColumnState[];
  filterModel: GridFilterModel | null;
}

export interface GridView {
  id: string;
  user_id: string;
  view_name: string;
  grid_type: GridType;
  config: GridViewConfig;
  is_default: boolean;
}

export interface FetchParams {
  start: number;
  end: number;
  sort?: SortModelItem[];
  filter?: GridFilterModel;
}

export interface FetchResponse<T> {
  data: T[];
  totalCount: number;
}
