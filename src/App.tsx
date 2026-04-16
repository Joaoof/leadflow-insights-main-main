import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const DashboardLayout = lazy(() =>
  import("@/components/layout/DashboardLayout").then((module) => ({
    default: module.DashboardLayout,
  }))
);

const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((module) => ({ default: module.LoginPage }))
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
);
const LeadsPage = lazy(() =>
  import("@/pages/LeadsPage").then((module) => ({ default: module.LeadsPage }))
);
const LeadDetailPage = lazy(() =>
  import("@/pages/LeadDetailPage").then((module) => ({
    default: module.LeadDetailPage,
  }))
);
const FunnelPage = lazy(() =>
  import("@/pages/FunnelPage").then((module) => ({ default: module.FunnelPage }))
);
const SourcesPage = lazy(() =>
  import("@/pages/SourcesPage").then((module) => ({
    default: module.SourcesPage,
  }))
);
const EvolutionPage = lazy(() =>
  import("@/pages/EvolutionPage").then((module) => ({
    default: module.EvolutionPage,
  }))
);
const LiveMetricsPage = lazy(() =>
  import("@/pages/LiveMetricsPage").then((module) => ({
    default: module.LiveMetricsPage,
  }))
);
const AnalyticsPage = lazy(() =>
  import("@/pages/AnalyticsPage").then((module) => ({
    default: module.AnalyticsPage,
  }))
);
const AlertsPage = lazy(() =>
  import("@/pages/AlertsPage").then((module) => ({ default: module.AlertsPage }))
);
const AttendantsPage = lazy(() =>
  import("@/pages/AttendantsPage").then((module) => ({
    default: module.AttendantsPage,
  }))
);
const UnitsPage = lazy(() =>
  import("@/pages/UnitsPage").then((module) => ({ default: module.UnitsPage }))
);
const ReportsPage = lazy(() =>
  import("@/pages/ReportsPage").then((module) => ({
    default: module.ReportsPage,
  }))
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  }))
);

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-center text-sm text-slate-300">
      Carregando módulo…
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
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
    </Suspense>
  );
}
