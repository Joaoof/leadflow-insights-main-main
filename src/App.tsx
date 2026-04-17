import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { useClinic } from "@/hooks/useClinic";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { UnitSelectPage } from "@/pages/UnitSelectPage";

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
    <div className="min-h-[60vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function LazyRoute({ children }: { children: JSX.Element }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireClinic({ children }: { children: JSX.Element }) {
  const { clinicId } = useClinic();
  if (!clinicId) return <Navigate to="/select-unit" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/select-unit"
        element={
          <RequireAuth>
            <UnitSelectPage />
          </RequireAuth>
        }
      />
      <Route
        element={
          <RequireAuth>
            <RequireClinic>
              <DashboardLayout />
            </RequireClinic>
          </RequireAuth>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/leads" element={<LazyRoute><LeadsPage /></LazyRoute>} />
        <Route
          path="/leads/:id"
          element={
            <LazyRoute>
              <LeadDetailPage />
            </LazyRoute>
          }
        />
        <Route path="/funnel" element={<LazyRoute><FunnelPage /></LazyRoute>} />
        <Route path="/sources" element={<LazyRoute><SourcesPage /></LazyRoute>} />
        <Route path="/evolution" element={<LazyRoute><EvolutionPage /></LazyRoute>} />
        <Route path="/live" element={<LazyRoute><LiveMetricsPage /></LazyRoute>} />
        <Route path="/analytics" element={<LazyRoute><AnalyticsPage /></LazyRoute>} />
        <Route path="/alerts" element={<LazyRoute><AlertsPage /></LazyRoute>} />
        <Route
          path="/attendants"
          element={<LazyRoute><AttendantsPage /></LazyRoute>}
        />
        <Route path="/units" element={<LazyRoute><UnitsPage /></LazyRoute>} />
        <Route path="/reports" element={<LazyRoute><ReportsPage /></LazyRoute>} />
        <Route path="/settings" element={<LazyRoute><SettingsPage /></LazyRoute>} />
        <Route path="*" element={<LazyRoute><NotFoundPage /></LazyRoute>} />
      </Route>
    </Routes>
  );
}
