import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { AttendanceService } from "@/data/services/attendance.service";
import { WorkerService } from "@/data/services/worker.service";
import { NotificationService } from "@/data/services/notification.service";
import { toast } from "@/hooks/use-toast";
import AttendanceFilterBar from "@/components/attendance/AttendanceFilterBar";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceFormDialog, { AttendanceFormState } from "@/components/attendance/AttendanceFormDialog";

const Attendance = () => {
  const attendanceService = new AttendanceService();
  const workerService = new WorkerService();
  const notificationService = new NotificationService();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<AttendanceFormState>({
    worker_id: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    status: "",
    reason: "",
    attachment: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [workersData, setWorkersData] = useState<any[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.index();
      const res = await workerService.index();
      setWorkersData(res);
      setAttendanceData(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Falha ao carregar dados de assiduidade");
      toast({ title: "Erro", description: "Falha ao carregar dados de assiduidade", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    setFormData({
      worker_id: "",
      start_date: new Date().toISOString().split("T")[0],
      end_date: "",
      status: "",
      reason: "",
      attachment: null,
    });
    setDialogOpen(true);
  };

  const handleSaveAttendance = async () => {
    if (!formData.worker_id || !formData.start_date || !formData.status) {
      toast({ title: "Campos obrigat�rios", description: "Trabalhador, data e status s�o obrigat�rios", variant: "warning" });
      return;
    }

    try {
      const data = new FormData();
      data.append("worker_id", formData.worker_id);
      data.append("start_date", formData.start_date);
      data.append("end_date", formData.end_date);
      data.append("status", formData.status);
      data.append("reason", formData.reason);

      if (formData.attachment) {
        data.append("attachment", formData.attachment);
      }

      await attendanceService.store(data);
      setDialogOpen(false);
      toast({ title: "Sucesso", description: "Presen�a registrada com sucesso", variant: "success" });

      const workerName = workersData.find((w) => String(w.id) === formData.worker_id)?.full_name || "Trabalhador";
      await notificationService.sendPlatformNotification({
        title: "Registro de Assiduidade",
        message: `${workerName} registrado com status ${formData.status}`,
        type: "success",
      });

      fetchAllData();
    } catch (err: any) {
      console.error("Erro ao salvar presen�a:", err);
      toast({ title: "Erro", description: err?.message || "Erro ao salvar presen�a", variant: "destructive" });
      setDialogOpen(false);
    }
  };

  const filteredData = attendanceData.filter((item) => {
    const matchesSearch = item.worker?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="Gest�o de Presen�as" subtitle="Controle de presen�as e faltas">
      <div className="space-y-6 animate-fade-in">
        {loading && <p>Carregando assiduidade...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <AttendanceFilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          onOpenDialog={handleOpenForm}
        />

        <AttendanceTable records={filteredData} />

        <AttendanceFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          state={formData}
          onStateChange={setFormData}
          onSave={handleSaveAttendance}
          workers={workersData}
        />
      </div>
    </AppLayout>
  );
};

export default Attendance;
