import http from "../../../../shared/api/http";

export async function fetchWithAuth<T>(url: string, options?: any): Promise<T> {
    const response = await http({
        url,
        method: options?.method || "GET",
        data: options?.body || undefined,
        headers: options?.headers || {},
    });
    return response.data;
}