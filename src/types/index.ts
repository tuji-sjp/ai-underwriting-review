export interface TaskRow {
  taskId: string;
  branch: string;
  policyNo: string;
  insuredNo: string;
  insuredName: string;
  execCount: number;
  reason: string;
  status: '处理中' | '完成' | '失败';
  execTime: string;
  cost: number | null;
  rePool: boolean;
}

export interface FlowStep {
  key: string;
  label: string;
  branch: 'claim' | 'ins' | 'merge' | 'ai' | 'end';
  layer: number;
}

export type NodeState = 'done' | 'error' | 'pending';

export interface BranchNodeStates {
  claim: Record<string, NodeState>;
  ins: Record<string, NodeState>;
}

export interface AiStates {
  aiMedical: NodeState;
  aiUnderwriting: NodeState;
  emScore: NodeState;
}

export interface ClaimRecord {
  date: string;
  text: string;
}

export interface MedicalRecord {
  date: string;
  text: string;
}

export interface AiMedicalData {
  thoughtProcess: string;
  claimRecords: ClaimRecord[];
  medicalRecords: MedicalRecord[];
}

export interface ProductResult {
  productName: string;
  productConclusion: string;
  basis: string;
  rejectedDiseases: string[];
  excludedDiseases: string[];
  delayedDiseases: string[];
  exclusionWording: string;
  supplementarySuggestions: string[];
}

export interface AiUnderwritingData {
  thoughtProcess: string;
  products: ProductResult[];
}

export interface EmScoreProduct {
  productName: string;
  emScore: number;
  scoreBasis: string;
}

export interface EmScoreData {
  thoughtProcess: string;
  products: EmScoreProduct[];
}

export type ImageData = Record<string, Record<string, number>>;

export interface HistoryImageGroup {
  label: string;
  images: Record<string, number>;
}

export type HistoryImageData = Record<string, Record<string, {
  claim: HistoryImageGroup[];
  ins: HistoryImageGroup[];
}>>;

export interface ImgCategory {
  cat: string;
  index: number;
}
