
export const API_HOST = "http://192.168.0.145:8000";
export const BASE_URL = `${API_HOST}/api`;

export const ECOMMERCE_URL = "http://192.168.0.145:5173/";

export type VideoTopeng = {
  video_id: number;
  topeng_id: number;
  video_judul: string;
  video_file: string | null;
  video_status: string;
  video_url: string | null;
};

export type Topeng = {
  topeng_id: number;
  topeng_nama: string;
  sifat_topeng: string | null;
  topeng_deskripsi: string | null;

  // Field cerita digunakan jika memang tersedia dari backend.
  topeng_cerita?: string | null;
  topeng_kisah?: string | null;

  topeng_gambar: string | null;
  topeng_gambar_url: string | null;
  topeng_qr_url: string | null;

  videos: VideoTopeng[];
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> || {}),
  };

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(
      "Tidak dapat terhubung ke Laravel. Periksa IP laptop, Wi-Fi, dan server backend."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Server error: ${response.status}`
    );
  }

  return data as T;
}

// Mendukung respons Laravel yang dibungkus dengan properti data.
function unwrapData<T>(response: any): T {
  if (
    response &&
    typeof response === "object" &&
    "data" in response
  ) {
    return response.data as T;
  }

  return response as T;
}

// Mengubah URL gambar/video menjadi URL yang bisa diakses HP.
export function getMediaUrl(
  path: string | null | undefined
): string | null {
  if (!path) return null;

  const value = path.trim();

  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const cleanPath = value.replace(/^\/+/, "");

  return `${API_HOST}/${cleanPath}`;
}

// Khusus gambar Laravel yang tersimpan di storage.
export function getTopengImage(
  topeng: Topeng
): string | null {
  const image =
    topeng.topeng_gambar_url ||
    topeng.topeng_gambar;

  if (!image) return null;

  if (/^https?:\/\//i.test(image)) {
    return image;
  }

  const cleanPath = image
    .replace(/^\/+/, "")
    .replace(/^storage\/+/i, "");

  return `${API_HOST}/storage/${cleanPath}`;
}

// Mengambil video yang sudah selesai diproses.
export function getTopengVideo(
  topeng: Topeng
): VideoTopeng | undefined {
  const videos = topeng.videos || [];

  return videos.find(
    (video) =>
      ["selesai", "completed", "success"].includes(
        (video.video_status || "").toLowerCase()
      )
  );
}

export function getVideoUrl(
  video: VideoTopeng | undefined
): string | null {
  if (!video) return null;

  return getMediaUrl(
    video.video_url || video.video_file
  );
}

export const api = {
  // Semua data topeng.
  getTopeng: async (): Promise<Topeng[]> => {
    const response = await apiRequest<any>("/topeng");

    const data = unwrapData<any>(response);

    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : [];

    return list.map((item: any) => ({
      ...item,
      videos: Array.isArray(item.videos)
        ? item.videos
        : [],
    }));
  },

  // Detail topeng berdasarkan ID.
  getDetailTopeng: async (
    id: number | string
  ): Promise<Topeng> => {
    const response = await apiRequest<any>(
      `/topeng/${id}`
    );

    const data = unwrapData<any>(response);

    const item = data?.topeng || data;

    if (!item || !item.topeng_id) {
      throw new Error(
        "Data topeng tidak ditemukan."
      );
    }

    return {
      ...item,
      videos: Array.isArray(item.videos)
        ? item.videos
        : [],
    };
  },
};

export default api;
