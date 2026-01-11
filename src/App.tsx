import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import AddWorker from "./pages/AddWorker";
import WorkerDetails from "./pages/WorkerDetails";
import PendingWorkers from "./pages/PendingWorkers";
import Attendance from "./pages/Attendance";
import Contracts from "./pages/Contracts";
import Evaluations from "./pages/Evaluations";
import Financial from "./pages/Financial";
import RemovedWorkers from "./pages/RemovedWorkers";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import WorkerDetailsHist from "./pages/WorkerDetailsHist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/workers/add" element={<AddWorker />} />
          <Route path="/workers/edit/:id" element={<AddWorker />} />
          <Route path="/workers/:id" element={<WorkerDetails />} />
          <Route path="/pending-workers" element={<PendingWorkers />} />
          <Route path="/pending-workers/edit/:id" element={<AddWorker />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/removed-workers" element={<RemovedWorkers />} />
          <Route path="/removed-workers/:id/history" element={<WorkerDetailsHist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
