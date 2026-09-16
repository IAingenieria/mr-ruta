import axios from "axios";

const BASE_URL = "https://api.baserow.io/api";
const TOKEN = import.meta.env.VITE_BASEROW_TOKEN as string;

if (!TOKEN) {
  console.error("❌ VITE_BASEROW_TOKEN no está definido");
  console.log("Variables disponibles:", Object.keys(import.meta.env));
} else {
  console.log("✅ VITE_BASEROW_TOKEN cargado correctamente");
}

export const baserow = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Token ${TOKEN}`,
  },
});

// Endpoints
const listEndpoint = (tableId: number) =>
  `/database/rows/table/${tableId}/?user_field_names=true&size=200`;
const rowEndpoint = (tableId: number, rowId: number) =>
  `/database/rows/table/${tableId}/${rowId}/?user_field_names=true`;

// Table IDs — CRM Mr. Ruta (database 422751)
export const TABLE_IDS = {
  clients:   941359,
  quotes:    941362,
  prospects: 941364,
  tasks:     941365,
  meetings:  941366,
} as const;

// Fetches all pages from Baserow (handles pagination automatically)
const fetchAllPages = async (tableId: number): Promise<{ count: number; results: unknown[] }> => {
  let results: unknown[] = [];
  let nextPath: string | null = listEndpoint(tableId);

  while (nextPath) {
    const { data } = await baserow.get(nextPath);
    results = results.concat(data.results);
    if (data.next) {
      // data.next is an absolute URL — strip the base to get a relative path
      // Force HTTPS to avoid Mixed Content errors
      const nextUrl = data.next.replace("http://", "https://");
      nextPath = nextUrl.replace(BASE_URL, "");
    } else {
      nextPath = null;
    }
  }

  return { count: results.length, results };
};

// Generic CRUD
const crud = (tableId: number) => ({
  fetchAll: () => fetchAllPages(tableId),
  create:   (data: unknown) => baserow.post(listEndpoint(tableId), data).then((r) => r.data),
  update:   (rowId: number, data: unknown) =>
    baserow.patch(rowEndpoint(tableId, rowId), data).then((r) => r.data),
  remove:   (rowId: number) =>
    baserow.delete(`/database/rows/table/${tableId}/${rowId}/`).then((r) => r.data),
});

// File upload
export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await baserow.post("/user-files/upload-file/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getFileUrl = (fileId: string) =>
  `${baserow.defaults.baseURL}/user-files/file/${fileId}`;

export const clientsApi   = crud(TABLE_IDS.clients);
export const quotesApi    = crud(TABLE_IDS.quotes);
export const prospectsApi = crud(TABLE_IDS.prospects);
export const tasksApi     = crud(TABLE_IDS.tasks);
export const meetingsApi  = crud(TABLE_IDS.meetings);
