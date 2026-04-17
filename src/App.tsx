import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import("@/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })));
const LeadsPage = lazy(() => import("@/pages/LeadsPage").then((m) => ({ default: m.LeadsPage })));
const LeadDetailPage = lazy(() => import("@/pages/LeadDetailPage").then((m) => ({ default: m.LeadDetailPage })));
const FunnelPage = lazy(() => import("@/pages/FunnelPage").then((m) => ({ default: m.FunnelPage })));
const SourcesPage = lazy(() => import("@/pages/SourcesPage").then((m) => ({ default: m.SourcesPage })));
const EvolutionPage = lazy(() => import("@/pages/EvolutionPage").then((m) => ({ default: m.EvolutionPage })));
const LiveMetricsPage = lazy(() => import("@/pages/LiveMetricsPage").then((m) => ({ default: m.LiveMetricsPage })));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })));
const AlertsPage = lazy(() => import("@/pages/AlertsPage").then((m) => ({ default: m.AlertsPage })));
const AttendantsPage = lazy(() => import("@/pages/AttendantsPage").then((m) => ({ default: m.AttendantsPage })));
const UnitsPage = lazy(() => import("@/pages/UnitsPage").then((m) => ({ default: m.UnitsPage })));
const ReportsPage = lazy(() => import("@/pages/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import("@/pages/SettingsPage").then((m) => ({ default: m.SettingsPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RouteFallback() {
  return (
    <div className="p-6 space-y-3">
      <div className="skeleton h-8 w-64" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="skeleton h-72 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
