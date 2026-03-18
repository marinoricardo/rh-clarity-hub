import api from "./api";

export class ContractService {
  // List all contracts
  async index() {
    try {
      const response = await api.get("/contracts");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch contracts");
    }
  }
}