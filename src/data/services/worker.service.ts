// src/services/WorkerService.ts
import { api } from "./api";

export class WorkerService {
  // List all workers
  // List all workers
async index(active?: boolean) {
  try {
    const response = await api.get("/workers", {
      params: active !== undefined ? { active } : {},
    });

    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch workers"
    );
  }
}


  // List workers with incomplete steps
  async pendingWorkers() {
    try {
      const response = await api.get("/workers/pending");
      return response.data.pending_workers;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch pending workers");
    }
  }

  // List of removed workers
  async removedWorkers() {
    try {
      const response = await api.get("/removed-workers");
      return response.data.removed_workers;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch pending workers");
    }
  }

  // Remove a worker
  async removedWorker(workerData: Record<string, any>) {
    try {
      const response = await api.post("/removed-workers", workerData);
      return response.data.removed_worker;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create worker");
    }
  }

  // Create new worker
  async store(workerData: Record<string, any>) {
    try {
      const response = await api.post("/workers", workerData);
      return response.data.data.worker;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create worker");
    }
  }


  // update worker
  async update(workerId: number, workerData: Record<string, any>) {
    try {
      const response = await api.put(`/workers/${workerId}/update`, workerData);
      return response.data.data.worker;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create worker");
    }
  }

  // Store company data for a worker
  async storeCompanyData(workerId: number | string, companyData: Record<string, any>) {
    try {
      const response = await api.post(`/workers/${workerId}/company-data`, companyData);
      return response.data.data.worker;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to save company data");
    }
  }

  // Upload worker documents
  async uploadWorkerDocuments(workerId: number | string, files: Record<string, File>) {
    try {
      const formData = new FormData();
      for (const key in files) {
        formData.append(key, files[key]);
      }

      const response = await api.post(`/workers/${workerId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload documents");
    }
  }

  // Get worker by ID
  async show(workerId: number | string) {
    try {
      const response = await api.get(`/workers/show/${workerId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Worker not found");
    }
  }

  
  // Get worker by ID
  async approveWorker(workerId: number | string) {
    try {
      const response = await api.post(`/workers/approve/${workerId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Worker not found");
    }
  }


  // Update worker steps
  async updateSteps(workerId: number | string, steps: Record<string, boolean>) {
    try {
      const response = await api.put(`/workers/${workerId}/steps`, steps);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update steps");
    }
  }
}
