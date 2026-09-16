import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientsApi, quotesApi, prospectsApi, tasksApi, meetingsApi } from "@/lib/baserow";

type Row = Record<string, unknown>;

// Generic hook factory
const createHooks = (key: string, api: any) => {
  return () => {
    const queryClient = useQueryClient();

    const list = useQuery({ queryKey: [key], queryFn: api.fetchAll });

    const create = useMutation({
      mutationFn: api.create,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });

    const update = useMutation({
      mutationFn: ({ id, data }: { id: number; data: Row }) => api.update(id, data),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });

    const remove = useMutation({
      mutationFn: (id: number) => api.remove(id),
      onSuccess: () => queryClient.invalidateQueries({ queryKey: [key] }),
    });

    return { list, create, update, remove };
  };
};

export const useClients   = createHooks("clients",   clientsApi);
export const useQuotes    = createHooks("quotes",    quotesApi);
export const useProspects = createHooks("prospects", prospectsApi);
export const useTasks     = createHooks("tasks",     tasksApi);
export const useMeetings  = createHooks("meetings",  meetingsApi);
