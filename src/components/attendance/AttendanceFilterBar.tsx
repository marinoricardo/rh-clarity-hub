import { Calendar, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceStatusOptions } from "./attendance.constants";

interface AttendanceFilterBarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedDate: string;
  onSelectedDateChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  onOpenDialog: () => void;
}

const AttendanceFilterBar = ({
  searchTerm,
  onSearchTermChange,
  selectedDate,
  onSelectedDateChange,
  filterStatus,
  onFilterStatusChange,
  onOpenDialog,
}: AttendanceFilterBarProps) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-between">
    <div className="flex flex-1 gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => onSelectedDateChange(e.target.value)}
          className="w-44"
        />
      </div>
      <Select value={filterStatus} onValueChange={onFilterStatusChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {attendanceStatusOptions.map((item) => (
            <SelectItem key={item.value} value={item.value}> {item.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <Button onClick={onOpenDialog}>
      <Plus className="w-4 h-4 mr-2" />
      Registrar Presença
    </Button>
  </div>
);

export default AttendanceFilterBar;
