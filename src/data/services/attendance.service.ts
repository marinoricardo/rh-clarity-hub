import api from "./api";

export class AttendanceService {
  // List all attendances
  async index() {
    try {
      const response = await api.get("/attendances");
      console.log(response.data.attendances);
      return response.data.attendances;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch attendances");
    }
  }

  // Create new attendance
  async store(attendanceData: Record<string, any>) {
    try {
      const response = await api.post("/attendances", attendanceData);
      console.log(response);
      return response.data.attendance;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create attendance");
    }
  }
}