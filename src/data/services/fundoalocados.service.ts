import api from "./api";

export class FundoAlocadosService {
  // List all fundos alocados
  async index() {
    try {
      const response = await api.get("/fundos-alocados");
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch fundos alocados");
    }
  }

  // Create new fundo alocado
  async store(fundoData: Record<string, any>) {
    try {
      const response = await api.post("/fundos-alocados", fundoData);
      return response.data.data.fundo_alocado;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create fundo alocado");
    }
  }
}