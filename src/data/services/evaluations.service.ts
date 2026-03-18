import api from "./api";

export class EvaluationService {
    // List all evaluations
    async index() {
        try {
            const response = await api.get("/evaluations");
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch evaluations");
        }
    }

    // Create new evaluation
    async store(evaluationData: Record<string, any>) {
        try {
            const response = await api.post("/worker-performances", evaluationData);
            return response.data.data.evaluation;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to create evaluation");
        }
    }
}