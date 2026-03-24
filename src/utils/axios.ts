import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.BASE_URL ?? "http://event-portal-server.vercel.app/api";
const AUTH_TOKEN_KEY = "token";

function getStoredToken(): string | null {
	if (typeof window === "undefined") {
		return null;
	}

	return (
		window.localStorage.getItem(AUTH_TOKEN_KEY) ||
		window.sessionStorage.getItem(AUTH_TOKEN_KEY)
	);
}

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	if (typeof window === "undefined") {
		return config;
	}

	const token = getStoredToken();
	if (!token) {
		return config;
	}

	const headers = AxiosHeaders.from(config.headers);
	headers.set("Authorization", `Bearer ${token}`);
	config.headers = headers;

	return config;
});

const normalizeError = (error: unknown): never => {
	if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
		const message =
			error.response?.data?.error ||
			error.response?.data?.message ||
			error.message ||
			"Request failed";

		throw new Error(message);
	}

	if (error instanceof Error) {
		throw error;
	}

	throw new Error("Unexpected request error");
};

export async function fetchData<T>(
	url: string,
	config?: AxiosRequestConfig,
): Promise<T> {
	try {
		const response = await api.get<T>(url, config);
		return response.data;
	} catch (error) {
		return normalizeError(error);
	}
}

export async function createData<TResponse, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	try {
		const response = await api.post<TResponse>(url, payload, config);
		return response.data;
	} catch (error) {
		return normalizeError(error);
	}
}

export async function updateData<TResponse, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	try {
		const response = await api.put<TResponse>(url, payload, config);
		return response.data;
	} catch (error) {
		return normalizeError(error);
	}
}

export async function patchData<TResponse, TPayload = unknown>(
	url: string,
	payload?: TPayload,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	try {
		const response = await api.patch<TResponse>(url, payload, config);
		return response.data;
	} catch (error) {
		return normalizeError(error);
	}
}

export async function deleteData<TResponse>(
	url: string,
	config?: AxiosRequestConfig,
): Promise<TResponse> {
	try {
		const response = await api.delete<TResponse>(url, config);
		return response.data;
	} catch (error) {
		return normalizeError(error);
	}
}

export { API_BASE_URL, api };

export default api;
