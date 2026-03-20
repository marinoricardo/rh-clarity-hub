import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { getAbsentismoClass, getAbsentismoLabel } from "./attendance.constants";
import { Button } from "@/components/ui/button";

interface AttendanceRecord {
  id: string | number;
  worker: { full_name: string };
  start_date: string;
  end_date?: string;
  status: string;
  reason?: string;
  attachment?: string;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const AttendanceTable = ({ records }: AttendanceTableProps) => (
  <div className="bg-card rounded-xl border border-border overflow-hidden">
    <div className="px-4 py-3 border-b border-border">
      <h3 className="font-semibold text-foreground">Registros de Presença</h3>
    </div>
    <Table>
      <TableHeader>
        <TableRow className="table-header">
          <TableHead>Nome do Trabalhador</TableHead>
          <TableHead>Data Início</TableHead>
          <TableHead>Data Fim</TableHead>
          <TableHead>Absentismo</TableHead>
          <TableHead>Observações</TableHead>
          <TableHead>Anexo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((item) => (
          <TableRow key={item.id} className="table-row">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {item.worker.full_name
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium">{item.worker.full_name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{item.start_date}</TableCell>
            <TableCell className="text-muted-foreground">{item.end_date || "-"}</TableCell>
            <TableCell>
              <span className={getAbsentismoClass(item.status)}>{getAbsentismoLabel(item.status)}</span>
            </TableCell>
            <TableCell className="text-muted-foreground max-w-[200px] truncate">{item.reason || "-"}</TableCell>
            <TableCell>
              {item.attachment ? (
                <Button variant="ghost" size="sm" onClick={() => window.open(item.attachment!, "_blank")}>
                  <Download className="w-4 h-4 mr-1" />
                </Button>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default AttendanceTable;
