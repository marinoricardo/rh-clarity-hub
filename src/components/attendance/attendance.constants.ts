import { ReactNode } from "react";

export const attendanceStatusOptions = [
  { value: "all", label: "Todos" },
  { value: "Presente", label: "Presente" },
  { value: "Ausente", label: "Ausente" },
  { value: "Falta", label: "Falta" },
  { value: "Licenca", label: "Licença" },
  { value: "Doenca", label: "Doença" },
  { value: "Nojo", label: "Nojo" },
  { value: "Dispensa", label: "Dispensa" },
  { value: "Folga", label: "Folga" },
  { value: "Ferias", label: "Férias" },
  { value: "Nao aplicavel", label: "Não aplicável" },
];

export const getAbsentismoClass = (status: string): string => {
  const classes = {
    Presente: "badge-success",
    Ausente: "badge-error",
    Falta: "badge-error",
    Licenca: "badge-warning",
    Doenca: "badge-warning",
    Nojo: "badge-warning",
    Dispensa: "badge-info",
    Folga: "badge-info",
    Ferias: "badge-info",
    "Nao aplicavel": "badge-secondary",
  } as Record<string, string>;

  return classes[status] || "badge";
};

export const getAbsentismoLabel = (status: string): string => {
  return attendanceStatusOptions.find((item) => item.value === status)?.label || status;
};
