import {supabase} from './supabase';

export async function getInvoices(params: any) {
    const {start, end, sort, filter} = params;

    let query = supabase
        .from('invoices')
        .select('*', {count: 'exact'});

    if (sort && sort.length > 0) {
        sort.forEach((s: any) => {
            query = query.order(s.colId, {ascending: s.sort === 'asc'});
        });
    }

    if (filter) {
        Object.keys(filter).forEach((key) => {
            const details = filter[key];
            if (details.filterType === 'text') {
                query = query.ilike(key, `%${details.filter}%`);
            }
        });
    }

    const {data, count, error} = await query.range(start, end);

    if (error) throw error;


    console.log("data", data);

    return {
        data: data || [],
        totalCount: count || 0,
    };
}

export async function getOrders(params: any) {
    const {start, end, sort, filter} = params;
    let query = supabase.from('orders').select('*', {count: 'exact'});

    // Sorting va Filtering logikasi (Invoices bilan bir xil)
    if (sort && sort.length > 0) {
        sort.forEach((s: any) => query = query.order(s.colId, {ascending: s.sort === 'asc'}));
    }

    const {data, count, error} = await query.range(start, end);
    if (error) throw error;
    return {data: data || [], totalCount: count || 0};
}