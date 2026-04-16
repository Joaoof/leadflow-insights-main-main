import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LeadsPage } from "@/pages/LeadsPage";
import { LeadDetailPage } from "@/pages/LeadDetailPage";
import { FunnelPage } from "@/pages/FunnelPage";
import { SourcesPage } from "@/pages/SourcesPage";
import { EvolutionPage } from "@/pages/EvolutionPage";
import { LiveMetricsPage } from "@/pages/LiveMetricsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { AlertsPage } from "@/pages/AlertsPage";
import { AttendantsPage } from "@/pages/AttendantsPage";
import { UnitsPage } from "@/pages/UnitsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/:id" element={<LeadDetailPage />} />
        <Route path="/funnel" element={<FunnelPage />} />
        <Route path="/sources" element={<SourcesPage />} />
        <Route path="/evolution" element={<EvolutionPage />} />
        <Route path="/live" element={<LiveMetricsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/attendants" element={<AttendantsPage />} />
        <Route path="/units" element={<UnitsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
