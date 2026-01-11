// src/services/AuthService.ts
import { api } from "./api";

export class AuthService {
    private tokenKey: string;

    constructor(tokenKey: string = "token") {
        this.tokenKey = tokenKey;
    }

    // Pegar token
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    // Salvar token
    setToken(token: string) {
        localStorage.setItem(this.tokenKey, token);
    }

    // Remover token
    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    // Login
    async login(email: string, password: string) {
        try {
            const response = await api.post("/auth/login", { email, password });
            const { access_token } = response.data.data;
            this.setToken(access_token);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Login failed"
            );
        }
    }

    // Logout
    async logout() {
        try {
            await api.post("/auth/logout");
            this.removeToken();
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Logout failed"
            );
        }
    }

    // Refresh token
    async refresh() {
        try {
            const response = await api.post("/refresh");
            const { access_token } = response.data.data;
            this.setToken(access_token);
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Token refresh failed"
            );
        }
    }

    // Usuário autenticado
    async me() {
        try {
            const response = await api.post("/auth/me");
            return response.data.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    }
}
