'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {ModuleRegistry, AllCommunityModule} from 'ag-grid-community';
import {supabase} from '@/lib/supabase';
import {Save, RotateCcw, PlusCircle, Layout, Loader2} from 'lucide-react';

import {themeQuartz} from 'ag-grid-community';
import toast from "react-hot-toast";
import {GridView} from "@/types/grid";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props {
    gridType: 'invoices' | 'orders';
    initialColumnDefs: any[];
    fetchData: (params: any) => Promise<{ data: any[], totalCount: number }>;
}

export default function AGGridTable({gridType, initialColumnDefs, fetchData}: Props) {
    const gridRef = useRef<AgGridReact>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [views, setViews] = useState<GridView[]>([]);
    const [selectedViewId, setSelectedViewId] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const loadViews = useCallback(async () => {
        const {data: {session}} = await supabase.auth.getSession();
        if (!session) return;

        const {data} = await supabase
            .from('grid_views')
            .select('*')
            .eq('grid_type', gridType)
            .eq('user_id', session.user.id);

        if (data) setViews(data);
    }, [gridType]);

    useEffect(() => {
        loadViews();
    }, [loadViews]);

    const applyView = (viewId: string) => {
        setSelectedViewId(viewId);
        const view = views.find(v => v.id === viewId);

        if (!gridRef.current?.api) return;

        if (view && view.config) {
            gridRef.current.api.applyColumnState({
                state: view.config.columnState,
                applyOrder: true
            });
            gridRef.current.api.setFilterModel(view.config.filterModel || null);
            setIsDirty(false);
            toast.success(`${view.view_name} yuklandi`);
        } else if (viewId === '') {
            const initialOrder = initialColumnDefs.map((col, index) => ({
                colId: col.field || col.colId,
                sort: null,
                hide: false,
                pinned: null,
                width: col.width || undefined
            }));
            gridRef.current.api.applyColumnState({
                state: initialOrder,
                applyOrder: true
            });
            gridRef.current.api.setFilterModel(null);
            setIsDirty(false);
            toast.success("Standart holatga qaytarildi");
        }
    };

    const saveView = async (isNew: boolean = false) => {
        if (loading) return;

        const {data: {session}} = await supabase.auth.getSession();
        if (!session) return toast.error("Avval tizimga kiring!");

        const config = {
            columnState: gridRef.current?.api.getColumnState(),
            filterModel: gridRef.current?.api.getFilterModel(),
        };

        setLoading(true);
        try {
            if (isNew) {
                const name = prompt("Yangi View nomini kiriting:");
                if (!name) {
                    setLoading(false);
                    return;
                }
                const {error} = await supabase.from('grid_views').insert({
                    user_id: session.user.id,
                    view_name: name,
                    grid_type: gridType,
                    config
                });
                if (error) throw error;
                toast.success("Yangi view yaratildi");
            } else if (selectedViewId) {
                const {error} = await supabase.from('grid_views').update({config}).eq('id', selectedViewId);
                if (error) throw error;
                toast.success("View yangilandi");
            }
            setIsDirty(false);
            await loadViews();
        } catch (e: any) {
            toast.error(e.message || "Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    const onGridReady = useCallback((params: any) => {
        const dataSource = {
            getRows: async (rowParams: any) => {
                params.api.showLoadingOverlay();
                try {
                    const result = await fetchData({
                        start: rowParams.startRow,
                        end: rowParams.endRow,
                        sort: rowParams.sortModel,
                        filter: rowParams.filterModel
                    });

                    rowParams.successCallback(result.data, result.totalCount);

                    if (result.data.length === 0 && rowParams.startRow === 0) {
                        params.api.showNoRowsOverlay();
                    } else {
                        params.api.hideOverlay();
                    }
                } catch (error) {
                    rowParams.failCallback();
                    params.api.hideOverlay();
                    toast.error("Ma'lumotlarni yuklashda xatolik");
                }
            }
        };
        params.api.setGridOption('datasource', dataSource);
    }, [fetchData]);


    const deleteView = async () => {
        if (!selectedViewId) return;
        if (!confirm("Haqiqatan ham bu viewni o'chirmoqchimisiz?")) return;

        setLoading(true);
        const {error} = await supabase.from('grid_views').delete().eq('id', selectedViewId);

        if (error) toast.error("O'chirishda xatolik");
        else {
            toast.success("View o'chirildi");
            setSelectedViewId('');
            loadViews();
            applyView('');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-4">
            {loading && (
                <div
                    className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                    <Loader2 size={16} className="animate-spin text-blue-600"/>
                    <span className="text-xs font-medium text-gray-600">Processing...</span>
                </div>
            )}
            <div
                className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Layout size={18}/>
                        <span className="text-sm font-medium">Views:</span>
                    </div>
                    <select
                        className="bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
                        value={selectedViewId}
                        onChange={(e) => applyView(e.target.value)}
                    >
                        <option value="">Standard View</option>
                        {views.map(v => (
                            <option key={v.id} value={v.id}>{v.view_name}</option>
                        ))}
                    </select>

                    {isDirty && !loading && (
                        <span
                            className="text-[10px] uppercase tracking-wider font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            Unsaved Changes
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => applyView('')}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        <RotateCcw size={16}/> Reset
                    </button>
                    <button
                        onClick={() => saveView(false)}
                        disabled={!selectedViewId || !isDirty}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-all shadow-md"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
                        Save
                    </button>
                    <button
                        onClick={() => saveView(true)}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-md"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin"/> : <PlusCircle size={16}/>}
                        Save As New
                    </button>
                    {selectedViewId && (
                        <button
                            onClick={deleteView}
                            disabled={loading}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100"
                        >
                            <span className="sr-only">Delete View</span>
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            <div
                className="ag-theme-alpine w-full h-[650px] rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <AgGridReact
                    ref={gridRef}
                    columnDefs={initialColumnDefs}
                    theme={themeQuartz}
                    rowModelType="infinite"
                    onGridReady={onGridReady}
                    onColumnMoved={() => setIsDirty(true)}
                    onColumnResized={() => setIsDirty(true)}
                    onSortChanged={() => setIsDirty(true)}
                    onFilterChanged={() => setIsDirty(true)}
                    pagination={true}
                    paginationPageSize={20}
                    cacheBlockSize={20}
                    overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Ma\'lumot yuklanmoqda...</span>'}
                />
            </div>
        </div>
    );
}