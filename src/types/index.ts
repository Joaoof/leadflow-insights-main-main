export type ConversationState = "bot" | "queue" | "service" | "concluido";

export interface Lead {
  id: string;
  externalId?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  source?: string | null;
  currentStage?: string | null;
  conversationState?: ConversationState | null;
  tags?: string[] | string | null;
  clinicId?: string | null;
  unitId?: string | null;
  attendantId?: string | null;
  attendantName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  firstAttendanceAt?: string | null;
  concludedAt?: string | null;
  [key: string]: any;
}

export interface StageCount {
  stage: string;
  count: number;
}

export interface SourceCount {
  source: string;
  count: number;
}

export interface OrigemAgrupada {
  origem: string;
  quantidade: number;
  porcentagem?: number;
}

export interface StateCount {
  bot: number;
  queue: number;
  service: number;
  concluido: number;
  total: number;
}

export interface TimeSeriesPoint {
  periodo: string;
  total: number;
}

export interface LeadMetrics {
  leadId: string;
  name?: string | null;
  currentState?: ConversationState;
  timeInBot?: number;
  timeInQueue?: number;
  timeInService?: number;
  totalTime?: number;
  timeToFirstAttendance?: number | null;
  timeToResolution?: number | null;
  alerts?: string[];
  transitions?: Array<{
    from: ConversationState;
    to: ConversationState;
    at: string;
  }>;
  interactions?: Array<{
    id: string;
    type: string;
    content?: string;
    at: string;
  }>;
  [key: string]: any;
}

export interface UnitSummary {
  totalLeads: number;
  totals: Partial<Record<ConversationState, number>>;
  averages: Partial<Record<ConversationState, number>> & {
    firstAttendance?: number;
    resolution?: number;
  };
  alertsCount?: number;
  topAttendants?: Array<{
    attendantName: string;
    conversions: number;
    total: number;
  }>;
  [key: string]: any;
}

export interface Attendant {
  id: string;
  name: string;
  email?: string | null;
  totalAssignments?: number;
  conversions?: number;
}

export interface AttendantRanking {
  attendantId: string;
  name: string;
  total: number;
  conversions?: number;
}

export interface Unit {
  id: string;
  clinicId: string;
  name?: string | null;
  leadsCount?: number;
}

export interface LiveMetrics {
  atendentes?: Array<{
    name: string;
    status?: string;
    emAtendimento?: number;
    naFila?: number;
    tempoMedio?: number;
  }>;
  fila?: Array<{
    name: string;
    phone?: string;
    waitingSince?: string;
    waitingMinutes?: number;
  }>;
  totalEmAtendimento?: number;
  totalNaFila?: number;
  tempoMedio?: number;
  [key: string]: any;
}
