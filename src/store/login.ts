import { create } from "zustand";

import { createData } from "@/utils/axios";
import {
  AUTH_TOKEN_KEY,
  clearStoredToken,
  getRoleFromToken,
  getStoredToken,
  type UserRole,
} from "@/utils/auth";

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = {
  token: string;
};

export type LoginFormState = LoginPayload & {
  rememberMe: boolean;
};

type LoginStore = {
  form: LoginFormState;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setForm: (patch: Partial<LoginFormState>) => void;
  resetForm: () => void;
  clearError: () => void;
  hydrateAuth: () => void;
  login: (payload?: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
};

const initialForm: LoginFormState = {
  email: "",
  password: "",
  rememberMe: false,
};

function getStorage(rememberMe: boolean): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return rememberMe ? window.localStorage : window.sessionStorage;
}

export const useLoginStore = create<LoginStore>((set, get) => ({
  form: initialForm,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setForm: (patch) => {
    set((state) => ({
      form: {
        ...state.form,
        ...patch,
      },
    }));
  },

  resetForm: () => {
    set({ form: initialForm });
  },

  clearError: () => {
    set({ error: null });
  },

  hydrateAuth: () => {
    const token = getStoredToken();
    const role = getRoleFromToken(token);

    set({
      token,
      role,
      isAuthenticated: Boolean(token && role),
    });
  },

  login: async (payload) => {
    const { form } = get();
    const requestBody: LoginPayload = payload ?? {
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe,
    };

    set({ isLoading: true, error: null });

    try {
      const response = await createData<LoginResponse, LoginPayload>(
        "/auth/login",
        requestBody,
      );

      clearStoredToken();
      getStorage(form.rememberMe)?.setItem(AUTH_TOKEN_KEY, response.token);
      const role = getRoleFromToken(response.token);

      set({
        token: response.token,
        role,
        isAuthenticated: Boolean(role),
        isLoading: false,
      });

      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in";

      set({
        error: message,
        isLoading: false,
        role: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  logout: () => {
    clearStoredToken();

    set({
      form: initialForm,
      token: null,
      role: null,
      error: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },
}));

export default useLoginStore;
