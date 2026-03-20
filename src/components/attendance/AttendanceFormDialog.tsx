import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { attendanceStatusOptions } from "./attendance.constants";

export interface AttendanceFormState {
  worker_id: string;
  start_date: string;
  end_date: string;
  status: string;
  reason: string;
  attachment: File | null;
}

interface WorkerOption { id: number | string; full_name: string; }

interface AttendanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: AttendanceFormState;
  onStateChange: (newState: AttendanceFormState) => void;
  onSave: () => void;
  workers: WorkerOption[];
}

const AttendanceFormDialog = ({ open, onOpenChange, state, onStateChange, onSave, workers }: AttendanceFormDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inAbsence = ["Falta", "Licenca", "Doenca", "Nojo", "Dispensa", "Folga", "Ferias"].includes(state.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Registrar Presença</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Trabalhador</Label>
            <Select value={state.worker_id} onValueChange={(value) => onStateChange({ ...state, worker_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o trabalhador" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((w) => (
                  <SelectItem key={w.id} value={String(w.id)}>{w.id} - {w.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={state.start_date}
                onChange={(e) => onStateChange({ ...state, start_date: e.target.value })}
              />
            </div>
            {inAbsence && (
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={state.end_date}
                  onChange={(e) => onStateChange({ ...state, end_date: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Absentismo</Label>
            <Select value={state.status} onValueChange={(value) => onStateChange({ ...state, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {attendanceStatusOptions
                  .filter((item) => item.value !== "all")
                  .map((item) => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Descreva observações adicionais..."
              value={state.reason}
              onChange={(e) => onStateChange({ ...state, reason: e.target.value })}
            />
          </div>

          {inAbsence && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Anexar documento (opcional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <p className="text-sm text-muted-foreground">
                  {state.attachment ? `📎 ${state.attachment.name}` : "Clique para anexar (atestado, justificativa, etc.)"}
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => onStateChange({ ...state, attachment: e.target.files?.[0] || null })}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button onClick={onSave}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceFormDialog;
