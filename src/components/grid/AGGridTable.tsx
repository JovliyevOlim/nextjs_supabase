'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {AgGridReact} from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ColumnState,
  type GridReadyEvent,
  type IGetRowsParams,
  type IDatasource,
} from 'ag-grid-community';
import {supabase} from '@/lib/supabase';
import {Save, RotateCcw, PlusCircle, Layout, Loader2, Trash2} from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import TextInputDialog from '@/components/ui/TextInputDialog';
import type {FetchResponse, GridType, GridView, GridViewConfig} from '@/types/grid';

ModuleRegistry.registerModules([AllCommunityModule]);

interface AGGridTableProps<T extends object> {
  gridType: GridType;
  initialData: T[];
  totalCount: number;
  columnDefs: ColDef<T>[];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

export default function AGGridTable<T extends object>({
  gridType,
  initialData,
  totalCount,
  columnDefs,
}: AGGridTableProps<T>) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const initialDataServedRef = useRef(false);

  const [isDirty, setIsDirty] = useState(false);
  const [views, setViews] = useState<GridView[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const loadViews = useCallback(async () => {
    const {
      data: {session},
    } = await supabase.auth.getSession();

    if (!session) {
      return;
    }

    const {data, error} = await supabase
      .from('grid_views')
      .select('*')
      .eq('grid_type', gridType)
      .eq('user_id', session.user.id)
      .order('view_name', {ascending: true});

    if (error) {
      toast.error('Failed to load saved views.');
      return;
    }

    setViews((data ?? []) as GridView[]);
  }, [gridType]);

  useEffect(() => {
    void loadViews();
  }, [loadViews]);

  const applyView = (viewId: string) => {
    setSelectedViewId(viewId);
    const view = views.find((item) => item.id === viewId);

    if (!gridRef.current?.api) {
      return;
    }

    if (view && view.config) {
      gridRef.current.api.applyColumnState({
        state: view.config.columnState,
        applyOrder: true,
      });
      gridRef.current.api.setFilterModel(view.config.filterModel ?? null);
      setIsDirty(false);
      toast.success(`Loaded view: ${view.view_name}`);
      return;
    }

    const defaultState: ColumnState[] = columnDefs
      .map((columnDef) => ({
        colId: columnDef.field ?? columnDef.colId ?? '',
        sort: undefined,
        hide: Boolean(columnDef.hide),
        pinned: undefined,
        width: typeof columnDef.width === 'number' ? columnDef.width : undefined,
      }))
      .filter((columnState) => columnState.colId.length > 0);

    gridRef.current.api.applyColumnState({
      state: defaultState,
      applyOrder: true,
    });
    gridRef.current.api.setFilterModel(null);
    setIsDirty(false);
    toast.success('Reset to default view.');
  };

  const readGridConfig = (): GridViewConfig => ({
    columnState: gridRef.current?.api.getColumnState() ?? [],
    filterModel: (gridRef.current?.api.getFilterModel() as GridViewConfig['filterModel']) ?? null,
  });

  const saveNewView = async () => {
    if (loading) {
      return;
    }

    const trimmed = newViewName.trim();
    if (!trimmed) {
      toast.error('Please enter a view name.');
      return;
    }

    const {
      data: {session},
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error('Please sign in first.');
      return;
    }

    setLoading(true);
    try {
      const {data, error} = await supabase
        .from('grid_views')
        .insert({
          user_id: session.user.id,
          view_name: trimmed,
          grid_type: gridType,
          config: readGridConfig(),
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      setSelectedViewId(data.id);
      setCreateModalOpen(false);
      setNewViewName('');
      setIsDirty(false);
      await loadViews();
      toast.success('View created.');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const updateView = async () => {
    if (!selectedViewId || loading) {
      return;
    }

    setLoading(true);
    try {
      const {error} = await supabase
        .from('grid_views')
        .update({config: readGridConfig()})
        .eq('id', selectedViewId);

      if (error) {
        throw error;
      }

      setIsDirty(false);
      toast.success('View updated.');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const deleteView = async () => {
    if (!selectedViewId || loading) {
      return;
    }

    setLoading(true);
    try {
      const {error} = await supabase.from('grid_views').delete().eq('id', selectedViewId);

      if (error) {
        throw error;
      }

      setSelectedViewId('');
      setDeleteModalOpen(false);
      setIsDirty(false);
      await loadViews();
      applyView('');
      toast.success('View deleted.');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchGridData = useCallback(
    async (params: IGetRowsParams): Promise<FetchResponse<T>> => {
      const query = new URLSearchParams({
        start: String(params.startRow),
        end: String(params.endRow),
        sort: JSON.stringify(params.sortModel ?? []),
        filter: JSON.stringify(params.filterModel ?? {}),
      });

      const response = await fetch(`/api/${gridType}?${query.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${gridType}.`);
      }

      return (await response.json()) as FetchResponse<T>;
    },
    [gridType],
  );

  const onGridReady = useCallback(
    (event: GridReadyEvent<T>) => {
      const dataSource: IDatasource = {
        getRows: async (params: IGetRowsParams) => {
          event.api.showLoadingOverlay();

          const hasSort = (params.sortModel ?? []).length > 0;
          const hasFilter = Object.keys(params.filterModel ?? {}).length > 0;
          const isInitialRequest = params.startRow === 0 && !hasSort && !hasFilter;

          try {
            if (isInitialRequest && !initialDataServedRef.current) {
              initialDataServedRef.current = true;
              params.successCallback(initialData, totalCount);
              if (initialData.length === 0) {
                event.api.showNoRowsOverlay();
              } else {
                event.api.hideOverlay();
              }
              return;
            }

            const result = await fetchGridData(params);
            params.successCallback(result.data, result.totalCount);

            if (result.data.length === 0 && params.startRow === 0) {
              event.api.showNoRowsOverlay();
            } else {
              event.api.hideOverlay();
            }
          } catch {
            params.failCallback();
            event.api.hideOverlay();
            toast.error('Failed to load data.');
          }
        },
      };

      event.api.setGridOption('datasource', dataSource);
    },
    [fetchGridData, initialData, totalCount],
  );

  return (
    <div className="flex flex-col gap-4">
      {loading && (
        <div className="absolute right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <Loader2 size={16} className="animate-spin text-blue-600"/>
          <span className="text-xs font-medium text-gray-600">Processing...</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Layout size={18}/>
            <span className="text-sm font-medium">Views:</span>
          </div>

          <select
            className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedViewId}
            onChange={(event) => applyView(event.target.value)}
          >
            <option value="">Standard View</option>
            {views.map((view) => (
              <option key={view.id} value={view.id}>
                {view.view_name}
              </option>
            ))}
          </select>

          {isDirty && !loading && (
            <span className="rounded border border-amber-100 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
              Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => applyView('')}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100"
          >
            <RotateCcw size={16}/>
            Reset to Default
          </button>

          <button
            onClick={() => void updateView()}
            disabled={!selectedViewId || !isDirty || loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-40"
          >
            {loading ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
            Save View
          </button>

          <button
            onClick={() => setCreateModalOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-600 disabled:opacity-40"
          >
            <PlusCircle size={16}/>
            Save As New View
          </button>

          {selectedViewId && (
            <button
              onClick={() => setDeleteModalOpen(true)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-1.5 text-sm font-medium text-red-600 transition-all hover:border-red-100 hover:bg-red-50"
              aria-label="Delete view"
            >
              <Trash2 size={16}/>
            </button>
          )}
        </div>
      </div>

      <div className="ag-theme-alpine h-[650px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <AgGridReact<T>
          ref={gridRef}
          columnDefs={columnDefs}
          theme={themeQuartz}
          rowModelType="infinite"
          onGridReady={onGridReady}
          onColumnMoved={() => setIsDirty(true)}
          onColumnResized={() => setIsDirty(true)}
          onSortChanged={() => setIsDirty(true)}
          onFilterChanged={() => setIsDirty(true)}
          pagination
          paginationPageSize={20}
          cacheBlockSize={20}
          overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Loading data...</span>'}
        />
      </div>

      <TextInputDialog
        open={createModalOpen}
        title="Create New View"
        label="View name"
        placeholder="e.g. Finance Team View"
        value={newViewName}
        confirmLabel="Create"
        isLoading={loading}
        onChange={setNewViewName}
        onConfirm={() => void saveNewView()}
        onClose={() => setCreateModalOpen(false)}
      />

      <ConfirmDialog
        open={deleteModalOpen}
        title="Delete View"
        description="Are you sure you want to delete this saved view?"
        confirmLabel="Delete"
        isLoading={loading}
        onConfirm={() => void deleteView()}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}
