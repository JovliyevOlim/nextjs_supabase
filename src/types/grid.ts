export interface GridViewConfig {
    columnState: any[];
    filterModel: any;
    sortModel: any;
}

export interface GridView {
    id: string;
    user_id: string;
    view_name: string;
    grid_type: 'invoices' | 'orders';
    config: GridViewConfig;
    is_default: boolean;
}