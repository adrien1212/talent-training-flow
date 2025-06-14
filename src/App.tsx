
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Departments from "./pages/Departments";
import DepartmentDetail from "./pages/DepartmentDetail";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import Trainings from "./pages/Trainings";
import TrainingDetail from "./pages/TrainingDetail";
import Sessions from "./pages/Sessions";
import SessionDetail from "./pages/SessionDetail";
import Feedback from "./pages/Feedback";
import Statistics from "./pages/Statistics";
import GiveFeedback from "./pages/GiveFeedback";
import SessionSignature from "./pages/SessionSignature";
import TrainerSpace from "./pages/TrainerSpace";
import StudentSpace from "./pages/StudentSpace";
import SkillsManagement from "./pages/SkillsManagement";
import BudgetManagement from "./pages/BudgetManagement";
import NotificationsManagement from "./pages/NotificationsManagement";
import TrainersManagement from "./pages/TrainersManagement";
import Planning from "./pages/Planning";
import Certificates from "./pages/Certificates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/:id" element={<DepartmentDetail />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:id" element={<EmployeeDetail />} />
          <Route path="/trainings" element={<Trainings />} />
          <Route path="/trainings/:id" element={<TrainingDetail />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/give-feedback" element={<GiveFeedback />} />
          <Route path="/signature/:accessToken" element={<SessionSignature />} />
          <Route path="/espace-formateur/:trainingAccessToken" element={<TrainerSpace />} />
          <Route path="/espace-etudiants" element={<StudentSpace />} />
          <Route path="/skills-management" element={<SkillsManagement />} />
          <Route path="/budget-management" element={<BudgetManagement />} />
          <Route path="/notifications-management" element={<NotificationsManagement />} />
          <Route path="/trainers-management" element={<TrainersManagement />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/certificates" element={<Certificates />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
