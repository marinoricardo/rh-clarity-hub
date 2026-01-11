import api from "./api";

export class UserService {
  // List all users
  async index() {
    try {
      const response = await api.get("/users");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch users");
    }
  }

  // Get user by ID
  async show(userId: number | string) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "User not found");
    }
  }

  // Create new user
  async store(userData: Record<string, any>) {
    try {
      const response = await api.post("/users", userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create user");
    }
  }

  // Update user
  async update(userId: number | string, userData: Record<string, any>) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update user");
    }
  }

  // Delete user
  async delete(userId: number | string) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to delete user");
    }
  }
}
