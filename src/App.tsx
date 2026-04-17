import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClinic } from "@/hooks/useClinic";

// Lazy imports
const DashboardLayout = lazy(() => import("@/components/layout/DashboardLayout"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const UnitSelectPage = lazy(() => import("@/pages/UnitSelectPage"));
const LeadsPage = lazy(() => import("@/pages/LeadsPage"));
const LeadDetailPage = lazy(() => import("@/pages/LeadDetailPage"));
const FunnelPage = lazy(() => import("@/pages/FunnelPage"));
const SourcesPage = lazy(() => import("@/pages/SourcesPage"));
const EvolutionPage = lazy(() => import("@/pages/EvolutionPage"));
const LiveMetricsPage = lazy(() => import("@/pages/LiveMetricsPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const AlertsPage = lazy(() => import("@/pages/AlertsPage"));
const AttendantsPage = lazy(() => import("@/pages/AttendantsPage"));
const UnitsPage = lazy(() => import("@/pages/UnitsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

// Loader
function RouteLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
      Carregando...
    </div>
  );
}

// Wrapper lazy
function LazyRoute({ children }: { children: ReactElement }) {
  return <Suspense fallback={<RouteLoader />}>{children}</Suspense>;
}

// Auth guard
function RequireAuth({ children }: { children: ReactElement }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Clinic guard
function RequireClinic({ children }: { children: ReactElement }) {
  const { clinicId } = useClinic();
  if (!clinicId) return <Navigate to="/select-unit" replace />;
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
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