import api from "./api";

export class CommonService {
  // Fetch all common Data
  async fetchCommonData() {
    try {
      const response = await api.get("/common");
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch common data");
    }
  }
}