import type {
  TaskRow, BranchNodeStates, AiStates, ImageData,
  AiMedicalData, AiUnderwritingData, EmScoreData,
} from '../types';

export const allData: TaskRow[] = [
  { taskId: '69f1cc14498ec0b6e588be81', branch: '7', policyNo: '90123456', insuredNo: '05647733', insuredName: '石玉林', execCount: 2, reason: '健康告知,理赔,既往投保健康告知', status: '完成', execTime: '2026-04-28 20:18:04', cost: 12, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be80', branch: '1', policyNo: '52703328', insuredNo: '10273830', insuredName: '赵伯芳', execCount: 1, reason: '理赔', status: '失败', execTime: '2026-04-28 09:32:15', cost: 0.2, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be82', branch: '7', policyNo: '90123456', insuredNo: '05647733', insuredName: '石玉林', execCount: 3, reason: '健康告知,理赔,既往投保健康告知', status: '失败', execTime: '2026-05-07 14:30:00', cost: 8, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be7e', branch: 'R', policyNo: '40056335', insuredNo: '16634063', insuredName: '刘吉云', execCount: 1, reason: '延期,拒保', status: '失败', execTime: '2026-04-26 11:05:33', cost: 2, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be7d', branch: '3', policyNo: '76028133', insuredNo: 'D8951355', insuredName: '李静', execCount: 1, reason: '理赔', status: '失败', execTime: '2026-04-25 16:47:22', cost: 0.5, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be7c', branch: '3', policyNo: '75983743', insuredNo: 'E5399730', insuredName: '夏雅莹', execCount: 1, reason: '高风险', status: '完成', execTime: '2026-04-27 10:38:55', cost: 82, rePool: true },
  { taskId: '69f1cc14498ec0b6e588be7b', branch: 'D', policyNo: '06X35157', insuredNo: '63693927', insuredName: '陈日鑫', execCount: 1, reason: '延期,拒保', status: '失败', execTime: '2026-04-24 08:12:07', cost: 4, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be7a', branch: '2', policyNo: '86037653', insuredNo: '12843680', insuredName: '王彦平', execCount: 1, reason: '理赔', status: '完成', execTime: '2026-04-28 15:44:19', cost: 51, rePool: false },
  { taskId: '69f1cc14498ec0b6e588be79', branch: 'R', policyNo: '40056858', insuredNo: 'E4024443', insuredName: '郭凰', execCount: 1, reason: '健康告知,体检', status: '完成', execTime: '2026-04-25 20:03:48', cost: 1, rePool: true },
  { taskId: '69f1cc14498ec0b6e588be78', branch: '3', policyNo: '76005664', insuredNo: 'E3997158', insuredName: '黎苑媚', execCount: 1, reason: '健康告知,既往投保健康告知异常', status: '完成', execTime: '2026-04-29 09:56:11', cost: 1, rePool: false },
];

// Sort by execTime descending
allData.sort((a, b) => b.execTime < a.execTime ? -1 : 1);

// Group by (insuredNo, branch, policyNo) to mark rePool and final tag
const grouped: Record<string, TaskRow[]> = {};
for (const row of allData) {
  const key = `${row.insuredNo}_${row.branch}_${row.policyNo}`;
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(row);
}
for (const gk in grouped) {
  const tasks = grouped[gk];
  if (tasks.length <= 1) continue;
  tasks.sort((a, b) => a.execTime < b.execTime ? -1 : 1);
  tasks[0].rePool = false;
  for (let ti = 1; ti < tasks.length; ti++) tasks[ti].rePool = true;
}

export const finalTaskIds = new Set<string>();
for (const gk in grouped) {
  const tasks = grouped[gk];
  if (tasks.length > 1) {
    finalTaskIds.add(tasks[tasks.length - 1].taskId);
  }
}

export const flowFailureReasons: Record<string, string> = {
  ecm_claim: '理赔影像为空',
  ecm_ins: '投保影像为空',
  ocrClassify_claim: 'OCR分类失败',
  ocrClassify_ins: 'OCR分类失败',
  ocrRecognize_claim: 'OCR识别失败',
  ocrRecognize_ins: 'OCR识别失败',
  desensitize_claim: '脱敏处理失败',
  desensitize_ins: '脱敏处理失败',
  merge: '',
  aiMedical: 'AI审核失败',
  aiUnderwriting: 'AI审核失败',
  emScore: 'AI审核失败',
  complete: 'AI节点执行失败',
};

export const branchAiStates: Record<string, AiStates> = {
  '69f1cc14498ec0b6e588be81': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be80': { aiMedical: 'error', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be82': { aiMedical: 'done', aiUnderwriting: 'error', emScore: 'done' },
  '69f1cc14498ec0b6e588be7e': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'error' },
  '69f1cc14498ec0b6e588be7d': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be7c': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be7b': { aiMedical: 'error', aiUnderwriting: 'error', emScore: 'done' },
  '69f1cc14498ec0b6e588be7a': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be79': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
  '69f1cc14498ec0b6e588be78': { aiMedical: 'done', aiUnderwriting: 'done', emScore: 'done' },
};

export const branchNodeStates: Record<string, BranchNodeStates> = {
  '69f1cc14498ec0b6e588be81': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be80': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'error', desensitize_claim: 'pending' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be82': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'error', ocrClassify_ins: 'pending', ocrRecognize_ins: 'pending', desensitize_ins: 'pending' } },
  '69f1cc14498ec0b6e588be7e': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be7d': { claim: { ecm_claim: 'error', ocrClassify_claim: 'pending', ocrRecognize_claim: 'pending', desensitize_claim: 'pending' }, ins: { ecm_ins: 'error', ocrClassify_ins: 'pending', ocrRecognize_ins: 'pending', desensitize_ins: 'pending' } },
  '69f1cc14498ec0b6e588be7c': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be7b': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be7a': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be79': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
  '69f1cc14498ec0b6e588be78': { claim: { ecm_claim: 'done', ocrClassify_claim: 'done', ocrRecognize_claim: 'done', desensitize_claim: 'done' }, ins: { ecm_ins: 'done', ocrClassify_ins: 'done', ocrRecognize_ins: 'done', desensitize_ins: 'done' } },
};

export const IMG_CATEGORIES = [
  '伤残证明', '出院小结', '诊断证明', '入院记录_住院记录', '其他检查',
  '住院病案首页', '超声检查报告', '血生化检查', '血凝检查', 'PET-CT检查报告',
  '视力检查', 'X线检查报告', '乙肝五项', '心电图',
];

export const CLAIM_IMAGES: ImageData = {
  '69f1cc14498ec0b6e588be81': { '伤残证明': 3, '出院小结': 2, '诊断证明': 2, '入院记录_住院记录': 4, '其他检查': 2, '住院病案首页': 2, '超声检查报告': 2, '血生化检查': 1 },
  '69f1cc14498ec0b6e588be80': { '出院小结': 4, '诊断证明': 1, '入院记录_住院记录': 3, '超声检查报告': 2, '血生化检查': 2 },
  '69f1cc14498ec0b6e588be7e': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2, '其他检查': 1 },
  '69f1cc14498ec0b6e588be7d': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2 },
  '69f1cc14498ec0b6e588be7c': { '伤残证明': 4, '出院小结': 3, '诊断证明': 2, '入院记录_住院记录': 4, '其他检查': 4, '住院病案首页': 3, '超声检查报告': 3, '血生化检查': 3, '血凝检查': 2, 'PET-CT检查报告': 1, 'X线检查报告': 2 },
  '69f1cc14498ec0b6e588be7b': { '出院小结': 1, '入院记录_住院记录': 1 },
  '69f1cc14498ec0b6e588be7a': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '超声检查报告': 1, '心电图': 1 },
  '69f1cc14498ec0b6e588be79': { '出院小结': 3, '诊断证明': 2, '入院记录_住院记录': 4, '其他检查': 2, '住院病案首页': 1, '血生化检查': 2 },
  '69f1cc14498ec0b6e588be78': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '超声检查报告': 1, '血生化检查': 1, '心电图': 1 },
  '69f1cc14498ec0b6e588be82': { '伤残证明': 2, '出院小结': 3, '诊断证明': 2, '入院记录_住院记录': 4, '其他检查': 2, '住院病案首页': 1, '超声检查报告': 2, '血生化检查': 1, '视力检查': 1 },
  'INS202604010001': { '伤残证明': 3, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 4, '其他检查': 2, '住院病案首页': 1, '超声检查报告': 1, '血生化检查': 2, '血凝检查': 1, 'PET-CT检查报告': 1, '视力检查': 1, 'X线检查报告': 2, '乙肝五项': 1, '心电图': 1 },
};

export const HISTORY_IMAGES: ImageData = {
  '69f1cc14498ec0b6e588be81': { '伤残证明': 2, '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2, '超声检查报告': 1 },
  '69f1cc14498ec0b6e588be80': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2 },
  '69f1cc14498ec0b6e588be7e': { '出院小结': 1, '入院记录_住院记录': 1 },
  '69f1cc14498ec0b6e588be7d': { '出院小结': 1, '诊断证明': 1 },
  '69f1cc14498ec0b6e588be7c': { '伤残证明': 2, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '其他检查': 2, '住院病案首页': 1, '超声检查报告': 2 },
  '69f1cc14498ec0b6e588be7b': { '出院小结': 1 },
  '69f1cc14498ec0b6e588be7a': { '出院小结': 1, '入院记录_住院记录': 2, '心电图': 1 },
  '69f1cc14498ec0b6e588be79': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2 },
  '69f1cc14498ec0b6e588be78': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2 },
  '69f1cc14498ec0b6e588be82': { '伤残证明': 1, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2, '超声检查报告': 1 },
  'INS202604010001': { '伤残证明': 2, '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2, '其他检查': 1, '超声检查报告': 1, '血生化检查': 1, '心电图': 1 },
};

export const TAB_IMAGES_NEW: Record<string, ImageData> = {
  aiMedical: {
    '69f1cc14498ec0b6e588be81': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2 },
    '69f1cc14498ec0b6e588be80': { '出院小结': 2, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be7e': { '出院小结': 1, '诊断证明': 1 },
    '69f1cc14498ec0b6e588be7d': { '出院小结': 1 },
    '69f1cc14498ec0b6e588be7c': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2, '超声检查报告': 1 },
    '69f1cc14498ec0b6e588be7b': { '出院小结': 1 },
    '69f1cc14498ec0b6e588be7a': { '出院小结': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be79': { '出院小结': 2, '诊断证明': 1 },
    '69f1cc14498ec0b6e588be78': { '出院小结': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be82': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 2 },
    'INS202604010001': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2, '超声检查报告': 1 },
  },
  aiUnderwriting: {
    '69f1cc14498ec0b6e588be81': { '伤残证明': 2, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1 },
    '69f1cc14498ec0b6e588be80': { '出院小结': 3, '诊断证明': 1, '入院记录_住院记录': 2 },
    '69f1cc14498ec0b6e588be7e': { '出院小结': 1, '入院记录_住院记录': 1, '其他检查': 1 },
    '69f1cc14498ec0b6e588be7d': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be7c': { '伤残证明': 3, '出院小结': 2, '诊断证明': 2, '入院记录_住院记录': 3, '住院病案首页': 2, '血生化检查': 2 },
    '69f1cc14498ec0b6e588be7b': { '出院小结': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be7a': { '出院小结': 2, '入院记录_住院记录': 2, '心电图': 1 },
    '69f1cc14498ec0b6e588be79': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1 },
    '69f1cc14498ec0b6e588be78': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2, '心电图': 1 },
    '69f1cc14498ec0b6e588be82': { '伤残证明': 1, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '视力检查': 1 },
    'INS202604010001': { '伤残证明': 2, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1, '心电图': 1 },
  },
  emScore: {
    '69f1cc14498ec0b6e588be81': { '伤残证明': 2, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1 },
    '69f1cc14498ec0b6e588be80': { '出院小结': 3, '诊断证明': 1, '入院记录_住院记录': 2 },
    '69f1cc14498ec0b6e588be7e': { '出院小结': 1, '入院记录_住院记录': 1, '其他检查': 1 },
    '69f1cc14498ec0b6e588be7d': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be7c': { '伤残证明': 3, '出院小结': 2, '诊断证明': 2, '入院记录_住院记录': 3, '住院病案首页': 2, '血生化检查': 2 },
    '69f1cc14498ec0b6e588be7b': { '出院小结': 1, '入院记录_住院记录': 1 },
    '69f1cc14498ec0b6e588be7a': { '出院小结': 2, '入院记录_住院记录': 2, '心电图': 1 },
    '69f1cc14498ec0b6e588be79': { '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1 },
    '69f1cc14498ec0b6e588be78': { '出院小结': 1, '诊断证明': 1, '入院记录_住院记录': 2, '心电图': 1 },
    '69f1cc14498ec0b6e588be82': { '伤残证明': 1, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '视力检查': 1 },
    'INS202604010001': { '伤残证明': 2, '出院小结': 2, '诊断证明': 1, '入院记录_住院记录': 3, '血生化检查': 1, '心电图': 1 },
  },
};

export const TAB_IMAGES_HISTORY: Record<string, Record<string, {
  claim: { label: string; images: Record<string, number> }[];
  ins: { label: string; images: Record<string, number> }[];
}>> = {
  aiMedical: {},
  aiUnderwriting: {
    '69f1cc14498ec0b6e588be81': {
      claim: [
        { label: '理赔案件号：LP20240415001', images: { '出院小结': 1, '诊断证明': 1, '超声检查报告': 1 } },
        { label: '理赔案件号：LP20231201003', images: { '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1, '入院记录_住院记录': 1, '诊断证明': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be80': {
      claim: [
        { label: '理赔案件号：LP20250110002', images: { '出院小结': 1, '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：1 - 52703328', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7e': {
      claim: [
        { label: '理赔案件号：LP20230822001', images: { '出院小结': 1, '入院记录_住院记录': 1, '其他检查': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：R - 40056335', images: { '诊断证明': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7d': {
      claim: [
        { label: '理赔案件号：LP20241105004', images: { '出院小结': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 76028133', images: { '入院记录_住院记录': 1, '超声检查报告': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7c': {
      claim: [
        { label: '理赔案件号：LP20240220001', images: { '出院小结': 1, '血生化检查': 1, '超声检查报告': 1 } },
        { label: '理赔案件号：LP20231015002', images: { '入院记录_住院记录': 1 } },
        { label: '理赔案件号：LP20220608001', images: { '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 75983743', images: { '出院小结': 1, '入院记录_住院记录': 2 } },
      ],
    },
    '69f1cc14498ec0b6e588be7b': {
      claim: [
        { label: '理赔案件号：LP20250312001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：D - 06X35157', images: { '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7a': {
      claim: [
        { label: '理赔案件号：LP20240618002', images: { '出院小结': 1, '心电图': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：2 - 86037653', images: { '入院记录_住院记录': 1, '超声检查报告': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be79': {
      claim: [
        { label: '理赔案件号：LP20231201003', images: { '出院小结': 2, '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：R - 40056858', images: { '出院小结': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be78': {
      claim: [
        { label: '理赔案件号：LP20250201001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 76005664', images: { '诊断证明': 1, '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be82': {
      claim: [
        { label: '理赔案件号：LP20240415001', images: { '出院小结': 1, '视力检查': 1 } },
        { label: '理赔案件号：LP20230910001', images: { '诊断证明': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
    },
    'INS202604010001': {
      claim: [
        { label: '理赔案件号：LP20240101001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
        { label: '理赔案件号：LP20230615002', images: { '血生化检查': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1 } },
        { label: '分公司-保单号：7 - 90123457', images: { '诊断证明': 1 } },
      ],
    },
  },
  emScore: {
    '69f1cc14498ec0b6e588be81': {
      claim: [
        { label: '理赔案件号：LP20240415001', images: { '出院小结': 1, '诊断证明': 1, '超声检查报告': 1 } },
        { label: '理赔案件号：LP20231201003', images: { '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1, '入院记录_住院记录': 1, '诊断证明': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be80': {
      claim: [
        { label: '理赔案件号：LP20250110002', images: { '出院小结': 1, '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：1 - 52703328', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7e': {
      claim: [
        { label: '理赔案件号：LP20230822001', images: { '出院小结': 1, '入院记录_住院记录': 1, '其他检查': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：R - 40056335', images: { '诊断证明': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7d': {
      claim: [
        { label: '理赔案件号：LP20241105004', images: { '出院小结': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 76028133', images: { '入院记录_住院记录': 1, '超声检查报告': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7c': {
      claim: [
        { label: '理赔案件号：LP20240220001', images: { '出院小结': 1, '血生化检查': 1, '超声检查报告': 1 } },
        { label: '理赔案件号：LP20231015002', images: { '入院记录_住院记录': 1 } },
        { label: '理赔案件号：LP20220608001', images: { '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 75983743', images: { '出院小结': 1, '入院记录_住院记录': 2 } },
      ],
    },
    '69f1cc14498ec0b6e588be7b': {
      claim: [
        { label: '理赔案件号：LP20250312001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：D - 06X35157', images: { '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be7a': {
      claim: [
        { label: '理赔案件号：LP20240618002', images: { '出院小结': 1, '心电图': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：2 - 86037653', images: { '入院记录_住院记录': 1, '超声检查报告': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be79': {
      claim: [
        { label: '理赔案件号：LP20231201003', images: { '出院小结': 2, '诊断证明': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：R - 40056858', images: { '出院小结': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be78': {
      claim: [
        { label: '理赔案件号：LP20250201001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：3 - 76005664', images: { '诊断证明': 1, '入院记录_住院记录': 1 } },
      ],
    },
    '69f1cc14498ec0b6e588be82': {
      claim: [
        { label: '理赔案件号：LP20240415001', images: { '出院小结': 1, '视力检查': 1 } },
        { label: '理赔案件号：LP20230910001', images: { '诊断证明': 1, '入院记录_住院记录': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
      ],
    },
    'INS202604010001': {
      claim: [
        { label: '理赔案件号：LP20240101001', images: { '出院小结': 1, '入院记录_住院记录': 1 } },
        { label: '理赔案件号：LP20230615002', images: { '血生化检查': 1 } },
      ],
      ins: [
        { label: '分公司-保单号：7 - 90123456', images: { '出院小结': 1 } },
        { label: '分公司-保单号：7 - 90123457', images: { '诊断证明': 1 } },
      ],
    },
  },
};

export const OCR_TEXTS: Record<string, string[]> = {
  '出院小结': [
    '武汉大学中南医院单人，眼压：右：12mmHg,左：11mmHg;出院医嘱：一、生活指导（饮食、活动与休息、功能锻炼）1.清淡饮食，加强营养。2.注意休息，卧床休息，减少活动。',
    '二、药物应用1.可乐必妥眼水点右眼每日4次；复方妥布霉素眼膏点右眼每晚1次；百力特眼水点右眼每日4次；贝他根眼水点右眼每日2次；派立明眼水点右眼每日2次。三、定期复查的时间和项目。勿揉眼，定期检查眼压。眼压:出院医生 电话:四、定期复查天数：7天后定期复查。五、院外治疗（本院专家门诊的时间和联系电话）:1.可乐必妥眼水点右眼每日4次；目力特眼水点右眼每日2次。2.定期眼科复诊。服务QQ预约方式：1、网上预约：武汉大学中南医院官网 www.znhospital.cn',
    '武汉大学中南医院门诊二楼导医台或便民服务中心（周一至周日8:00-17:00）2、现场预约：武汉****9号。特殊检查编号：MRI号：无。病理号：无。X光号：无。CT号：无。主治医师签名：戴汉军06。定位:05。记录时间：2019-4-22。主任医师签名：18u。审阅时间：2019.4.22。第2页',
  ],
  '伤残证明': [
    '经鉴定，被保险人因右眼球挫伤、右眼前房角后退、右眼外伤性前房角劈裂、右眼虹膜损伤、右眼外伤性白内障、右眼晶状体脱位等，构成伤残。伤残等级评定：右眼视力0.1（戴镜），眼压右12mmHg左11mmHg。',
    '鉴定日期：2021年04月17日。被鉴定人：石玉林。既往史：有"癫痫"史，否认高血压、糖尿病等慢性病史。本次住院行保守治疗，包括抗炎、止血、双眼制动、半卧位休息及口服激素等。',
  ],
  '诊断证明': [
    '20190417住院：诊断为右眼球挫伤、右眼创伤性前房积血、右眼前房角后退、右眼外伤性前房角劈裂、右眼虹膜损伤、右眼外伤性白内障、右眼晶状体脱位、右眼玻璃体混浊、右眼创伤性脉络膜脱离、双眼屈光不正。',
    '既往史有"癫痫"史，否认高血压、糖尿病等慢性病史。本次住院行保守治疗。出院时视力右眼0.1（戴镜），眼压右12mmHg左11mmHg，好转出院。',
  ],
  '入院记录_住院记录': [
    '患者因"右眼外伤后视物模糊伴眼痛4天"于2023年12月27日入院。查体：右眼球结膜混合充血，角膜透明，前房深可，房水清，瞳孔约3.0mm，对光反射迟钝，晶状体轻度混浊，玻璃体轻度混浊。',
    '入院诊断：右眼外伤性前房积血、右眼前房角后退、右眼虹膜损伤。',
  ],
  '其他检查': [
    '检查项目：眼部B超。检查结果：右眼玻璃体轻度混浊，右眼脉络膜脱离，右眼视网膜脱离。建议：进一步检查。',
    '检查项目：OCT检查。检查结果：右眼黄斑区视网膜神经上皮层脱离，伴视网膜下积液。',
  ],
  '住院病案首页': [
    '姓名：石玉林。性别：男。年龄：42岁。入院日期：2023年12月27日。出院日期：2024年1月2日。',
    '入院诊断：右眼外伤性前房积血。出院诊断：右眼外伤性前房积血、右眼前房角后退、右眼虹膜损伤。',
  ],
  '超声检查报告': [
    '检查所见：右眼玻璃体腔内可见少量点状回声，后运动阳性。右眼脉络膜可见局限性隆起。',
    '诊断意见：右眼玻璃体混浊，右眼脉络膜脱离。',
  ],
  '血生化检查': [
    'ALT: 35 U/L。AST: 28 U/L。BUN: 5.2 mmol/L。Cr: 78 umol/L。GLU: 5.6 mmol/L。',
    '各项指标均在正常范围内。',
  ],
  '血凝检查': ['PT: 12.5s。APTT: 32.1s。TT: 16.8s。FIB: 2.8 g/L。', '凝血功能正常。'],
  'PET-CT检查报告': ['全身PET-CT示：未见明显代谢增高病灶。纵隔、腹膜后淋巴结未见肿大。', '结论：全身未见明显恶性肿瘤征象。'],
  '视力检查': ['右眼裸眼视力：0.05。矫正视力：0.1（戴镜）。', '左眼裸眼视力：1.0。矫正视力：1.0。'],
  'X线检查报告': ['眼眶X线平片：右眼眶内侧壁可见骨折线，右眼眶内未见异物影。', '结论：右眼眶内侧壁骨折。'],
  '乙肝五项': ['HBsAg: 阴性。HBsAb: 阳性。HBeAg: 阴性。HBeAb: 阴性。HBcAb: 阴性。', '既往接种过乙肝疫苗，具有保护性抗体。'],
  '心电图': ['窦性心律，心率78次/分。PR间期：160ms。QRS时限：90ms。', 'ST-T段无明显异常。'],
};

export const AI_MEDICAL_ANALYSIS: Record<string, AiMedicalData> = {
  '69f1cc14498ec0b6e588be81': {
    thoughtProcess: '开始分析被保险人石玉林的医疗记录。\n第一步，OCR识别理赔影像和投保影像中的医疗文书。识别到出院记录显示：右眼球挫伤、右眼外伤性前房积血、右眼前房角后退、虹膜损伤。住院期间行眼部CT和B超检查，保守抗炎治疗后好转出院，右眼视力0.1（戴镜）。\n第二步，提取关键诊断信息。主要诊断为右眼外伤相关疾病，伴随虹膜损伤和前房角后退。既往史中存在癫痫病史，需要关注与本次理赔的关联性。\n第三步，评估理赔关联性。本次理赔申请与右眼外伤直接相关，外伤导致视力严重受损，伤残等级已评定。癫痫病史为既往疾病，与本次外伤无直接关联，但在核保评估中需要综合考虑。\n第四步，整理理赔记录和病历信息。住院记录显示完整的诊疗过程和随访建议，建议定期复查右眼视力和眼底情况。',
    claimRecords: [{ date: '20260505住院', text: '入院诊断：右眼球挫伤、右眼外伤性前房积血。住院期间行眼部CT、B超检查，提示右眼前房角后退、虹膜损伤。治疗方式：保守抗炎治疗。出院情况：右眼视力0.1（戴镜），眼压正常。建议定期复查。' }],
    medicalRecords: [{ date: '20260505住院', text: '入院诊断：右眼球挫伤、右眼外伤性前房积血。住院期间行眼部CT、B超检查，提示右眼前房角后退、虹膜损伤。治疗方式：保守抗炎治疗。出院情况：右眼视力0.1（戴镜），眼压正常。建议定期复查。' }],
  },
  '69f1cc14498ec0b6e588be7e': {
    thoughtProcess: '开始分析被保险人刘吉云的医疗记录。\n第一步，OCR识别理赔影像中的出院记录。识别到主要诊断为肝硬化失代偿期，伴随食管静脉曲张。属于严重肝脏疾病，肝功能已严重受损。\n第二步，提取关键诊疗信息。住院期间行腹部CT和胃镜检查，明确食管静脉曲张诊断。治疗方式包括保肝、利尿、降门脉压药物。\n第三步，评估疾病严重程度。肝硬化失代偿期属于终末期肝病，预后差，食管静脉曲张存在破裂出血的严重并发症风险。该类疾病对承保风险评估影响极大。\n第四步，整理病历信息。出院情况为好转，但疾病本质未改变，需长期随访肝功能，建议定期复查肝功能和腹部超声。',
    claimRecords: [{ date: '20260405住院', text: '入院诊断：肝硬化失代偿期。住院期间行腹部CT、胃镜检查，提示食管静脉曲张。治疗方式：保肝、利尿、降门脉压治疗。出院情况：好转，建议定期复查肝功能。' }],
    medicalRecords: [{ date: '20260405住院', text: '入院诊断：肝硬化失代偿期。住院期间行腹部CT、胃镜检查，提示食管静脉曲张。治疗方式：保肝、利尿、降门脉压治疗。出院情况：好转，建议定期复查肝功能。' }],
  },
  '69f1cc14498ec0b6e588be7c': {
    thoughtProcess: '开始分析被保险人夏雅莹的医疗记录。\n第一步，OCR识别理赔影像中的住院记录。识别到主要诊断为肺部结节影，性质待查。行胸部CT和支气管镜检查。\n第二步，提取关键诊疗信息。右肺上叶结节性质未明确，抗感染治疗后结节较前缩小，但性质仍未确定。建议3个月后复查胸部CT。\n第三步，评估疾病风险。肺部结节性质待查，虽然抗感染治疗后缩小提示炎性可能，但不能完全排除恶性肿瘤的可能性。BI-RADS分类尚未明确，需要等待复查结果。\n第四步，整理病历信息。住院期间完成主要检查和治疗，出院情况稳定，关键风险点在于结节性质未明，建议延期承保，待复查结果明确后再行评估。',
    claimRecords: [{ date: '20260412住院', text: '入院诊断：肺部结节影。住院期间行胸部CT、支气管镜检查，提示右肺上叶结节，性质待查。治疗方式：抗感染治疗后复查。出院情况：结节较前缩小，建议3个月后复查CT。' }],
    medicalRecords: [{ date: '20260412住院', text: '入院诊断：肺部结节影。住院期间行胸部CT、支气管镜检查，提示右肺上叶结节，性质待查。治疗方式：抗感染治疗后复查。出院情况：结节较前缩小，建议3个月后复查CT。' }],
  },
  '69f1cc14498ec0b6e588be7a': {
    thoughtProcess: '开始分析被保险人王彦平的医疗记录。\n第一步，OCR识别理赔影像中的住院记录。识别到主要诊断为急性阑尾炎，已行阑尾切除术。\n第二步，提取关键诊疗信息。住院期间完成阑尾切除术，术后恢复良好，无并发症发生。出院情况显示痊愈。\n第三步，评估疾病预后。急性阑尾炎为常见外科急腹症，手术治疗效果明确。术后恢复良好，无后遗症及并发症，对长期健康影响极小。\n第四步，整理病历信息。疾病已完全治愈，预后良好，无额外承保风险因素。该病例属于低风险情况，建议标准体承保。',
    claimRecords: [{ date: '20260418住院', text: '入院诊断：急性阑尾炎。住院期间行阑尾切除术。术后恢复良好，无并发症。出院情况：痊愈。' }],
    medicalRecords: [{ date: '20260418住院', text: '入院诊断：急性阑尾炎。住院期间行阑尾切除术。术后恢复良好，无并发症。出院情况：痊愈。' }],
  },
  '69f1cc14498ec0b6e588be79': {
    thoughtProcess: '开始分析被保险人郭凰的体检记录。\n第一步，OCR识别投保影像中的体检报告。识别到主要异常指标：血脂异常（总胆固醇6.8mmol/L，LDL-C 4.2mmol/L），轻度脂肪肝。\n第二步，提取关键指标数据。总胆固醇参考值应<5.2mmol/L，当前6.8mmol/L偏高。LDL-C参考值应<3.4mmol/L，当前4.2mmol/L偏高。脂肪肝程度为轻度。\n第三步，评估代谢风险。血脂异常属于代谢性问题，总胆固醇和LDL-C均高于正常值上限，长期可能增加心血管疾病风险。轻度脂肪肝与血脂异常相关联，目前程度较轻。\n第四步，综合评估。血脂异常和轻度脂肪肝风险整体可控，建议生活方式干预和定期复查，当前不构成严重承保风险。',
    claimRecords: [{ date: '20260401体检', text: '体检发现：血脂异常（总胆固醇6.8mmol/L，LDL-C 4.2mmol/L）、轻度脂肪肝。建议控制饮食、增加运动，3个月后复查血脂。' }],
    medicalRecords: [{ date: '20260401体检', text: '体检发现：血脂异常（总胆固醇6.8mmol/L，LDL-C 4.2mmol/L）、轻度脂肪肝。建议控制饮食、增加运动，3个月后复查血脂。' }],
  },
  '69f1cc14498ec0b6e588be78': {
    thoughtProcess: '开始分析被保险人黎苑媚的医疗记录。\n第一步，OCR识别理赔影像和投保影像中的医疗文书。识别到主要诊断为乳腺结节，BI-RADS分类为3类。\n第二步，提取关键检查信息。住院期间行乳腺超声和钼靶检查，BI-RADS 3类提示良性可能性大，恶性风险<2%。治疗方式为定期随访观察。\n第三步，评估乳腺结节风险。BI-RADS 3类结节恶性概率较低但不为零，需要定期随访监测。6个月后复查乳腺超声是标准随访方案。如果结节稳定或缩小，可继续观察；如有变化，可能需要穿刺活检。\n第四步，综合评估。乳腺结节存在不确定性的风险因素，建议在核保中对乳腺相关疾病设置除外责任。',
    claimRecords: [{ date: '20260408住院', text: '入院诊断：乳腺结节（BI-RADS 3类）。住院期间行乳腺超声、钼靶检查。治疗方式：定期随访观察。出院情况：稳定，建议6个月后复查。' }],
    medicalRecords: [{ date: '20260408住院', text: '入院诊断：乳腺结节（BI-RADS 3类）。住院期间行乳腺超声、钼靶检查。治疗方式：定期随访观察。出院情况：稳定，建议6个月后复查。' }],
  },
  '69f1cc14498ec0b6e588be7b': {
    thoughtProcess: '开始分析被保险人陈日鑫的医疗记录。\n第一步，OCR识别理赔影像中的住院记录。识别到主要诊断为慢性肾功能不全，CKD 4期。\n第二步，提取关键诊疗信息。住院期间行肾功能和肾脏B超检查。治疗方式包括透析准备、降压、纠正贫血。CKD 4期表示肾功能已严重受损，接近终末期。\n第三步，评估疾病严重程度。慢性肾脏病4期（GFR 15-29ml/min）属于严重慢性肾脏疾病，预后差。需透析准备提示疾病已进展到需要肾脏替代治疗阶段，承保风险极高。\n第四步，综合评估。该疾病属于严重慢性病，长期预后不良，治疗成本高，建议拒保。',
    claimRecords: [{ date: '20260320住院', text: '入院诊断：慢性肾功能不全（CKD 4期）。住院期间行肾功能、肾脏B超检查。治疗方式：透析准备、降压、纠正贫血。出院情况：稳定，建议定期随访肾功能。' }],
    medicalRecords: [{ date: '20260320住院', text: '入院诊断：慢性肾功能不全（CKD 4期）。住院期间行肾功能、肾脏B超检查。治疗方式：透析准备、降压、纠正贫血。出院情况：稳定，建议定期随访肾功能。' }],
  },
  '69f1cc14498ec0b6e588be82': {
    thoughtProcess: '开始分析被保险人石玉林的复查医疗记录。注意该被保人存在同被保人多任务，需与任务69f1cc14498ec0b6e588be81的病历信息综合考量。\n第一步，OCR识别理赔影像中的复查记录。识别到主要诊断为右眼球挫伤复查，眼部超声提示右眼玻璃体混浊、脉络膜脱离。\n第二步，提取关键复查信息。右眼视力0.1，与上次记录一致。新增发现玻璃体混浊和脉络膜脱离，提示外伤后遗症有进一步发展。\n第三步，评估外伤后遗症进展。相比首次就诊记录，本次复查显示右眼存在玻璃体混浊和脉络膜脱离，这些是眼外伤的常见后遗症，可能影响长期视力和眼部健康。\n第四步，综合评估。右眼外伤后遗症风险较高且存在进展趋势，建议在核保中对外伤相关眼部责任设置除外。',
    claimRecords: [{ date: '20260507住院', text: '入院诊断：右眼球挫伤复查。住院期间行眼部超声检查，提示右眼玻璃体混浊、脉络膜脱离。治疗方式：保守治疗。出院情况：右眼视力0.1，建议定期复查。' }],
    medicalRecords: [{ date: '20260507住院', text: '入院诊断：右眼球挫伤复查。住院期间行眼部超声检查，提示右眼玻璃体混浊、脉络膜脱离。治疗方式：保守治疗。出院情况：右眼视力0.1，建议定期复查。' }],
  },
  '69f1cc14498ec0b6e588be80': {
    thoughtProcess: '开始分析被保险人赵伯芳的门诊记录。\n第一步，OCR识别理赔影像中的门诊记录。识别到就诊科室为内分泌科，主诉为血糖升高3个月，诊断为2型糖尿病。\n第二步，提取关键诊疗信息。病历资料较少，仅有本次门诊记录。未提供具体血糖检测数据（如空腹血糖、糖化血红蛋白等），缺乏并发症评估信息。\n第三步，评估信息完整性。2型糖尿病属于慢性代谢性疾病，需要长期管理。但当前仅有门诊诊断记录，缺少实验室检查数据、用药情况、并发症筛查等关键信息，不足以进行全面风险评估。\n第四步，综合评估。现有资料有限，需要补充更多医疗记录才能做出准确的核保判断。',
    claimRecords: [{ date: '20260420门诊', text: '就诊科室：内分泌科。主诉：血糖升高3月。诊断：2型糖尿病。建议控制饮食、规律运动，定期复查糖化血红蛋白。' }],
    medicalRecords: [{ date: '20260420门诊', text: '就诊科室：内分泌科。主诉：血糖升高3月。诊断：2型糖尿病。建议控制饮食、规律运动，定期复查糖化血红蛋白。' }],
  },
  '69f1cc14498ec0b6e588be7d': {
    thoughtProcess: '开始分析被保险人李静的门诊记录。\n第一步，OCR识别理赔影像中的门诊记录。识别到就诊科室为骨科，主诉为右肩疼痛2周，X线检查提示右肩袖损伤。\n第二步，提取关键诊疗信息。X线检查确认右肩袖损伤。建议休息和物理治疗，必要时行MRI进一步检查。当前为门诊级别诊疗，未住院。\n第三步，评估损伤风险。肩袖损伤属于骨骼肌肉系统损伤，多数情况下通过保守治疗或手术修复可以恢复良好。但需要MRI确认损伤程度（部分撕裂还是完全撕裂），这直接影响预后和承保风险。\n第四步，综合评估。当前资料仅有X线结果，建议补充MRI检查以明确损伤程度。在核保中建议对右肩相关疾病设置除外责任。',
    claimRecords: [{ date: '20260328门诊', text: '就诊科室：骨科。主诉：右肩疼痛2周。X线检查提示：右肩袖损伤。建议休息、物理治疗，必要时行MRI进一步检查。' }],
    medicalRecords: [{ date: '20260328门诊', text: '就诊科室：骨科。主诉：右肩疼痛2周。X线检查提示：右肩袖损伤。建议休息、物理治疗，必要时行MRI进一步检查。' }],
  },
};

// ===== 疾病关键词（从OCR影像资料中提取的疾病名称） =====
export const DISEASE_KEYWORDS: Record<string, string[]> = {
  '69f1cc14498ec0b6e588be81': ['右眼球挫伤', '右眼外伤性前房积血', '右眼前房角后退', '右眼虹膜损伤', '右眼外伤性白内障', '右眼晶状体脱位', '右眼玻璃体混浊', '右眼创伤性脉络膜脱离', '双眼屈光不正', '癫痫', '视力障碍'],
  '69f1cc14498ec0b6e588be7e': ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭'],
  '69f1cc14498ec0b6e588be7c': ['肺部结节影', '右肺上叶结节', '肺部肿瘤待排'],
  '69f1cc14498ec0b6e588be7a': ['急性阑尾炎'],
  '69f1cc14498ec0b6e588be79': ['血脂异常', '轻度脂肪肝', '高胆固醇血症'],
  '69f1cc14498ec0b6e588be78': ['乳腺结节', 'BI-RADS 3类', '乳腺恶性肿瘤待排'],
  '69f1cc14498ec0b6e588be7b': ['慢性肾功能不全', 'CKD 4期', '尿毒症', '肾衰竭', '贫血'],
  '69f1cc14498ec0b6e588be82': ['右眼球挫伤复查', '右眼玻璃体混浊', '脉络膜脱离', '右眼视力障碍'],
  '69f1cc14498ec0b6e588be80': ['2型糖尿病', '血糖升高'],
  '69f1cc14498ec0b6e588be7d': ['右肩袖损伤', '骨骼肌肉系统损伤'],
};

// ===== OCR抽取疾病（从病历资料中通过OCR识别抽取出来的疾病名称） =====
export const OCR_DISEASES: Record<string, string[]> = {
  '69f1cc14498ec0b6e588be81': ['右眼球挫伤', '右眼外伤性前房积血', '右眼前房角后退', '右眼虹膜损伤', '右眼外伤性白内障', '右眼晶状体脱位', '右眼玻璃体混浊', '右眼创伤性脉络膜脱离', '双眼屈光不正', '癫痫', '右眼视力障碍'],
  '69f1cc14498ec0b6e588be7e': ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭'],
  '69f1cc14498ec0b6e588be7c': ['肺部结节影', '右肺上叶结节', '肺部肿瘤待排'],
  '69f1cc14498ec0b6e588be7a': ['急性阑尾炎'],
  '69f1cc14498ec0b6e588be79': ['血脂异常', '轻度脂肪肝', '高胆固醇血症'],
  '69f1cc14498ec0b6e588be78': ['乳腺结节', 'BI-RADS 3类', '乳腺恶性肿瘤待排'],
  '69f1cc14498ec0b6e588be7b': ['慢性肾功能不全', 'CKD 4期', '尿毒症', '肾衰竭', '贫血'],
  '69f1cc14498ec0b6e588be82': ['右眼球挫伤复查', '右眼玻璃体混浊', '脉络膜脱离', '右眼视力障碍'],
  '69f1cc14498ec0b6e588be80': ['2型糖尿病', '血糖升高'],
  '69f1cc14498ec0b6e588be7d': ['右肩袖损伤', '骨骼肌肉系统损伤'],
};

// ===== 别名映射疾病（将OCR抽取的疾病名称根据规则转化为标准疾病名称） =====
export const ALIAS_MAPPED_DISEASES: Record<string, { original: string; standard: string }[]> = {
  '69f1cc14498ec0b6e588be81': [
    { original: '右眼球挫伤', standard: '眼球挫伤' },
    { original: '右眼外伤性前房积血', standard: '前房积血' },
    { original: '右眼前房角后退', standard: '前房角后退' },
    { original: '右眼外伤性白内障', standard: '外伤性白内障' },
    { original: '右眼玻璃体混浊', standard: '玻璃体混浊' },
    { original: '双眼屈光不正', standard: '屈光不正' },
  ],
  '69f1cc14498ec0b6e588be7e': [
    { original: '肝硬化失代偿期', standard: '肝硬化（失代偿期）' },
    { original: '食管静脉曲张', standard: '食管静脉曲张' },
  ],
  '69f1cc14498ec0b6e588be7c': [
    { original: '肺部结节影', standard: '肺结节' },
    { original: '右肺上叶结节', standard: '肺结节' },
  ],
  '69f1cc14498ec0b6e588be7a': [
    { original: '急性阑尾炎', standard: '急性阑尾炎' },
  ],
  '69f1cc14498ec0b6e588be79': [
    { original: '血脂异常', standard: '高脂血症' },
    { original: '高胆固醇血症', standard: '高胆固醇血症' },
  ],
  '69f1cc14498ec0b6e588be78': [
    { original: '乳腺结节', standard: '乳腺结节' },
    { original: 'BI-RADS 3类', standard: '乳腺结节（BI-RADS 3类）' },
  ],
  '69f1cc14498ec0b6e588be7b': [
    { original: '慢性肾功能不全', standard: '慢性肾脏病' },
    { original: 'CKD 4期', standard: '慢性肾脏病4期' },
  ],
  '69f1cc14498ec0b6e588be82': [
    { original: '右眼球挫伤复查', standard: '眼球挫伤' },
    { original: '右眼玻璃体混浊', standard: '玻璃体混浊' },
    { original: '右眼视力障碍', standard: '视力障碍' },
  ],
  '69f1cc14498ec0b6e588be80': [
    { original: '2型糖尿病', standard: '2型糖尿病' },
  ],
  '69f1cc14498ec0b6e588be7d': [
    { original: '右肩袖损伤', standard: '肩袖损伤' },
  ],
};

// ===== AI判断疾病（未能映射的疾病使用大模型+RAG的方式检索出相似疾病） =====
export const AI_JUDGE_DISEASES: Record<string, { original: string; aiResult: string; confidence: string }[]> = {
  '69f1cc14498ec0b6e588be81': [
    { original: '右眼虹膜损伤', aiResult: '虹膜损伤', confidence: '高' },
    { original: '右眼晶状体脱位', aiResult: '晶状体脱位', confidence: '高' },
    { original: '右眼创伤性脉络膜脱离', aiResult: '脉络膜脱离', confidence: '高' },
    { original: '右眼视力障碍', aiResult: '视力障碍', confidence: '高' },
    { original: '癫痫', aiResult: '癫痫', confidence: '高' },
  ],
  '69f1cc14498ec0b6e588be7e': [
    { original: '肝功能衰竭', aiResult: '肝功能衰竭', confidence: '高' },
  ],
  '69f1cc14498ec0b6e588be7c': [
    { original: '肺部肿瘤待排', aiResult: '肺占位性病变', confidence: '中' },
  ],
  '69f1cc14498ec0b6e588be7a': [],
  '69f1cc14498ec0b6e588be79': [
    { original: '轻度脂肪肝', aiResult: '脂肪肝（轻度）', confidence: '高' },
  ],
  '69f1cc14498ec0b6e588be78': [
    { original: '乳腺恶性肿瘤待排', aiResult: '乳腺占位性病变', confidence: '中' },
  ],
  '69f1cc14498ec0b6e588be7b': [
    { original: '尿毒症', aiResult: '尿毒症', confidence: '高' },
    { original: '肾衰竭', aiResult: '肾功能衰竭', confidence: '高' },
    { original: '贫血', aiResult: '贫血', confidence: '高' },
  ],
  '69f1cc14498ec0b6e588be82': [
    { original: '脉络膜脱离', aiResult: '脉络膜脱离', confidence: '高' },
  ],
  '69f1cc14498ec0b6e588be80': [
    { original: '血糖升高', aiResult: '高血糖症', confidence: '中' },
  ],
  '69f1cc14498ec0b6e588be7d': [
    { original: '骨骼肌肉系统损伤', aiResult: '骨骼肌肉系统损伤', confidence: '中' },
  ],
};

export const AI_UNDERWRITING_ANALYSIS: Record<string, AiUnderwritingData> = {
  '69f1cc14498ec0b6e588be81': {
    thoughtProcess: '综合理赔影像和投保影像的OCR识别结果，被保险人石玉林右眼外伤病史明确，右眼视力0.1（戴镜），伤残等级已评定。既往有癫痫病史。本次核保需重点关注：1）右眼外伤后遗症的承保风险评估；2）癫痫病史对长期承保的影响；3）既往投保记录中是否存在未如实告知的情况。\n核保结论：建议对右眼相关疾病及癫痫相关并发症设置除外责任，其余标准体承保。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '右眼外伤后遗症明确，右眼视力0.1（戴镜），伤残等级已评定。既往癫痫病史。右眼相关疾病及癫痫相关并发症风险明确，建议除外。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼白内障', '青光眼', '视网膜病变', '癫痫及其并发症'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病（含右眼白内障、青光眼、视网膜病变等）及癫痫及其并发症，本公司不承担保险金给付责任。', supplementarySuggestions: ['建议补充近6个月右眼复查报告', '建议提供癫痫用药及控制情况证明'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '延期', basis: '右眼外伤导致伤残等级已评定，存在永久性视力障碍。医疗保险中眼部伤残相关风险需评估，建议延期至伤残等级稳定后重新评估。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼视力障碍', '眼部残疾补偿'], delayedDiseases: ['右眼外伤相关疾病', '右眼视力障碍', '眼部残疾补偿'], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病及眼部残疾补偿，本公司不承担医疗保险金给付责任。', supplementarySuggestions: ['建议提供近6个月右眼复查报告'] },
    ],
  },
  '69f1cc14498ec0b6e588be7e': {
    thoughtProcess: '被保险人刘吉云肝硬化失代偿期，食管静脉曲张。肝功能严重受损，属于极高风险病例。核保建议：拒保。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '拒保', basis: '被保险人因肝硬化失代偿期、食管静脉曲张、肝功能衰竭导致肝功能严重受损，承保风险极高，本公司不承担保险金给付责任。', rejectedDiseases: ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '拒保', basis: '被保险人因肝硬化失代偿期属于终末期肝病，肝功能严重受损，食管静脉曲张存在破裂出血的严重并发症风险，医疗保险承保风险极高，本公司不承担医疗保险金给付责任。', rejectedDiseases: ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭', '门静脉高压症'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    ],
  },
  '69f1cc14498ec0b6e588be7c': {
    thoughtProcess: '被保险人夏雅莹肺部结节性质待查，BI-RADS分类尚未明确。抗感染治疗后结节缩小但性质未定。核保建议：延期承保，待复查结果明确后再行评估。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '延期', basis: '肺部结节性质尚未明确，存在恶性可能。抗感染治疗后结节缩小但仍需复查确认性质。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: ['肺部结节影', '右肺上叶结节', '肺部肿瘤待排'], exclusionWording: '', supplementarySuggestions: ['建议3个月后复查胸部CT', '提供复查结果后重新评估'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '延期', basis: '肺部结节性质未明，虽然抗感染治疗后缩小提示炎性可能，但不能完全排除恶性肿瘤的可能性，需等待复查结果。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: ['肺部结节影', '右肺上叶结节', '肺部肿瘤待排'], exclusionWording: '', supplementarySuggestions: ['建议3个月后复查胸部CT', '提供病理活检结果（如有）'] },
    ],
  },
  '69f1cc14498ec0b6e588be7a': {
    thoughtProcess: '被保险人王彦平急性阑尾炎已行手术治疗，术后恢复良好无并发症。疾病已治愈，预后良好。核保建议：标准体承保。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '标准体', basis: '急性阑尾炎已完全治愈，无后遗症及并发症，预后良好，不影响承保风险。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '标准体', basis: '急性阑尾炎已完全治愈，术后恢复良好，无并发症及后遗症，不影响医疗保险承保。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    ],
  },
  '69f1cc14498ec0b6e588be79': {
    thoughtProcess: '被保险人郭凰体检发现血脂异常、轻度脂肪肝。总胆固醇6.8mmol/L偏高，LDL-C 4.2mmol/L偏高。属于代谢性问题，风险可控。核保建议：大概率标准体承保。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率标准体', basis: '血脂异常及轻度脂肪肝风险整体可控，总胆固醇6.8mmol/L、LDL-C 4.2mmol/L偏高但不构成除外或延期标准。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: ['建议关注3个月后复查血脂结果', '建议关注体重及血压变化'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '大概率标准体', basis: '血脂异常和轻度脂肪肝属于代谢性问题，目前程度较轻，整体承保风险较低。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: ['建议关注3个月后复查血脂结果'] },
    ],
  },
  '69f1cc14498ec0b6e588be78': {
    thoughtProcess: '被保险人黎苑媚乳腺结节BI-RADS 3类，恶性风险<2%。定期随访观察中。核保建议：对乳腺相关疾病设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '乳腺结节BI-RADS 3类，恶性风险<2%但不为零。建议乳腺相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['乳腺结节', '乳腺恶性肿瘤', '乳腺增生', '乳腺炎'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的乳腺结节及相关疾病（含乳腺恶性肿瘤、乳腺增生、乳腺炎等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议6个月后复查乳腺超声'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '大概率除外', basis: '乳腺结节BI-RADS 3类，存在恶性可能但不高。建议乳腺相关重疾设置除外责任。', rejectedDiseases: [], excludedDiseases: ['乳腺结节', '乳腺恶性肿瘤', '乳腺原位癌'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的乳腺结节及相关疾病（含乳腺恶性肿瘤、乳腺原位癌等），本公司不承担医疗保险金给付责任。', supplementarySuggestions: ['建议6个月后复查乳腺超声', '提供乳腺钼靶检查结果（如40岁以上）'] },
    ],
  },
  '69f1cc14498ec0b6e588be7b': {
    thoughtProcess: '被保险人陈日鑫慢性肾功能不全CKD 4期，需透析准备。属于严重慢性肾脏疾病，核保建议：拒保。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '拒保', basis: '被保险人因慢性肾功能不全（CKD 4期）、尿毒症、肾衰竭导致肾功能严重受损，需透析准备，预后极差，承保风险极高，本公司不承担保险金给付责任。', rejectedDiseases: ['慢性肾功能不全（CKD 4期）', '尿毒症', '肾衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '拒保', basis: '被保险人因慢性肾功能不全4期属于严重慢性肾脏疾病，需透析准备，医疗保险承保风险极高，本公司不承担医疗保险金给付责任。', rejectedDiseases: ['慢性肾功能不全（CKD 4期）', '尿毒症', '肾衰竭', '透析治疗'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    ],
  },
  '69f1cc14498ec0b6e588be82': {
    thoughtProcess: '被保险人石玉林右眼外伤后遗症复查，右眼玻璃体混浊、脉络膜脱离。同被保人多任务核保，需综合评估整体风险。核保建议：除外右眼相关责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '右眼外伤后遗症风险明确，右眼玻璃体混浊、脉络膜脱离，且为同被保人二次入池复查。建议对右眼相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼玻璃体混浊', '脉络膜脱离', '右眼视力障碍'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病（含右眼玻璃体混浊、脉络膜脱离、右眼视力障碍等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议提供近3个月右眼复查报告', '建议提供首次任务（69f1cc14498ec0b6e588be81）核保结论记录'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '大概率除外', basis: '右眼外伤后遗症风险明确，且存在同被保人多任务历史，需综合评估右眼及全身整体承保风险。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼白内障', '青光眼', '视网膜病变', '右眼视力障碍'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病（含右眼白内障、青光眼、视网膜病变、右眼视力障碍等），本公司不承担医疗保险金给付责任。', supplementarySuggestions: ['建议提供近3个月右眼复查报告'] },
    ],
  },
  '69f1cc14498ec0b6e588be80': {
    thoughtProcess: '被保险人赵伯芳2型糖尿病，门诊就诊。资料较少，需补充更多医疗记录。核保建议：大概率除外。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '2型糖尿病需关注并发症风险，现有资料较少，建议对内分泌系统相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['糖尿病及其并发症', '糖尿病肾病', '糖尿病视网膜病变', '糖尿病足'], delayedDiseases: [], exclusionWording: '被保险人投保前已确诊的2型糖尿病及其并发症（含糖尿病肾病、糖尿病视网膜病变、糖尿病足等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议补充糖化血红蛋白检测报告', '建议补充近6个月糖尿病随访记录'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '大概率除外', basis: '2型糖尿病属于慢性代谢性疾病，需长期管理。现有资料较少，缺乏并发症评估，建议对糖尿病及相关并发症设置除外责任。', rejectedDiseases: [], excludedDiseases: ['糖尿病及其并发症', '糖尿病肾病', '糖尿病视网膜病变', '糖尿病足', '糖尿病神经病变'], delayedDiseases: [], exclusionWording: '被保险人投保前已确诊的2型糖尿病及其并发症（含糖尿病肾病、糖尿病视网膜病变、糖尿病足、糖尿病神经病变等），本公司不承担医疗保险金给付责任。', supplementarySuggestions: ['建议补充糖化血红蛋白检测报告', '建议补充眼底检查报告', '建议补充肾功能及尿微量白蛋白检测'] },
    ],
  },
  '69f1cc14498ec0b6e588be7d': {
    thoughtProcess: '被保险人李静右肩袖损伤，门诊诊断。骨骼肌肉系统损伤。核保建议：对右肩相关疾病设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '右肩袖损伤，骨骼肌肉系统损伤。建议对右肩相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['右肩袖损伤', '右肩关节疾病', '右肩功能障碍'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的右肩袖损伤及右肩相关疾病（含右肩关节疾病、右肩功能障碍等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议补充右肩MRI检查报告'] },
      { productName: '泰康e生保长期医疗保险', productConclusion: '大概率标准体', basis: '右肩袖损伤属于骨骼肌肉系统损伤，多数情况下通过保守治疗或手术修复可以恢复良好，对医疗保险承保影响较小。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: ['建议补充右肩MRI检查报告以明确损伤程度'] },
    ],
  },
};

// ===== 人工核保结论（与AI结论对照） =====
export const MANUAL_UNDERWRITING: Record<string, Array<{
  productName: string;
  productConclusion: string;
  basis: string;
  rejectedDiseases: string[];
  excludedDiseases: string[];
  delayedDiseases: string[];
  exclusionWording: string;
  supplementarySuggestions: string[];
}>> = {
  '69f1cc14498ec0b6e588be81': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '除外', basis: '右眼外伤后遗症明确，伤残等级已评定，癫痫病史需关注。除外右眼及癫痫相关疾病后其余标准体承保。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼白内障', '青光眼', '视网膜病变', '癫痫及其并发症'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病及癫痫及其并发症，本公司不承担保险金给付责任。', supplementarySuggestions: ['建议提供近6个月右眼复查报告', '建议提供癫痫用药记录'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '拒保', basis: '被保险人因右眼外伤导致伤残等级已评定，存在永久性视力障碍，医疗保险承保风险极高，本公司不承担医疗保险金给付责任。', rejectedDiseases: ['右眼外伤相关疾病', '右眼视力障碍'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
  ],
  '69f1cc14498ec0b6e588be7e': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '拒保', basis: '被保险人因肝硬化失代偿期、食管静脉曲张、肝功能衰竭导致肝功能严重受损，承保风险极高，本公司不承担保险金给付责任。', rejectedDiseases: ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '拒保', basis: '被保险人因肝硬化失代偿期属于终末期肝病，肝功能严重受损，食管静脉曲张存在破裂出血风险，医疗保险承保风险极高，本公司不承担医疗保险金给付责任。', rejectedDiseases: ['肝硬化失代偿期', '食管静脉曲张', '肝功能衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
  ],
  '69f1cc14498ec0b6e588be7c': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '延期', basis: '肺部结节性质未明，需等待复查结果确认性质后再行评估。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: ['肺部结节影', '右肺上叶结节'], exclusionWording: '', supplementarySuggestions: ['建议3个月后复查胸部CT', '提供复查结果后重新评估'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '大概率除外', basis: '肺部结节性质未明，在复查结果明确前建议对肺部相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['肺部结节', '肺部肿瘤', '肺占位性病变'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的肺部结节及相关疾病（含肺部肿瘤、肺占位性病变等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议3个月后复查胸部CT'] },
  ],
  '69f1cc14498ec0b6e588be7a': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '标准体', basis: '急性阑尾炎已完全治愈，无后遗症及并发症，预后良好。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '标准体', basis: '急性阑尾炎已治愈，术后恢复良好，不影响医疗保险承保。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
  ],
  '69f1cc14498ec0b6e588be79': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '标准体', basis: '血脂异常及轻度脂肪肝风险可控，不构成除外或延期标准。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '标准体', basis: '血脂异常和轻度脂肪肝属于代谢性问题，目前程度较轻，不影响医疗保险承保。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
  ],
  '69f1cc14498ec0b6e588be78': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '除外', basis: '乳腺结节BI-RADS 3类，恶性风险<2%。建议乳腺相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['乳腺结节', '乳腺恶性肿瘤', '乳腺增生', '乳腺炎'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的乳腺结节及相关疾病（含乳腺恶性肿瘤、乳腺增生、乳腺炎等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议6个月后复查乳腺超声'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '除外', basis: '乳腺结节BI-RADS 3类，恶性风险较低但不为零。建议乳腺相关重疾设置除外责任。', rejectedDiseases: [], excludedDiseases: ['乳腺结节', '乳腺恶性肿瘤', '乳腺原位癌'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的乳腺结节及相关疾病（含乳腺恶性肿瘤、乳腺原位癌等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议6个月后复查乳腺超声'] },
  ],
  '69f1cc14498ec0b6e588be7b': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '拒保', basis: '被保险人因慢性肾功能不全（CKD 4期）、尿毒症、肾衰竭导致肾功能严重受损，需透析准备，预后极差，承保风险极高，本公司不承担保险金给付责任。', rejectedDiseases: ['慢性肾功能不全（CKD 4期）', '尿毒症', '肾衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '拒保', basis: '被保险人因慢性肾功能不全4期属于严重慢性肾脏疾病，需透析准备，医疗保险承保风险极高，本公司不承担医疗保险金给付责任。', rejectedDiseases: ['慢性肾功能不全（CKD 4期）', '尿毒症', '肾衰竭'], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: [] },
  ],
  '69f1cc14498ec0b6e588be82': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '除外', basis: '右眼外伤后遗症风险明确，右眼玻璃体混浊、脉络膜脱离。建议对右眼相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼玻璃体混浊', '脉络膜脱离', '右眼视力障碍'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病（含右眼玻璃体混浊、脉络膜脱离、右眼视力障碍等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议提供近3个月右眼复查报告'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '大概率除外', basis: '右眼外伤后遗症风险明确，建议对右眼相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['右眼外伤相关疾病', '右眼白内障', '青光眼', '视网膜病变'], delayedDiseases: [], exclusionWording: '被保险人因右眼外伤导致的右眼相关疾病，本公司不承担保险金给付责任。', supplementarySuggestions: ['建议提供近3个月右眼复查报告'] },
  ],
  '69f1cc14498ec0b6e588be80': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '除外', basis: '2型糖尿病需关注并发症风险，建议对内分泌系统相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['糖尿病及其并发症', '糖尿病肾病', '糖尿病视网膜病变', '糖尿病足'], delayedDiseases: [], exclusionWording: '被保险人投保前已确诊的2型糖尿病及其并发症（含糖尿病肾病、糖尿病视网膜病变、糖尿病足等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议补充糖化血红蛋白检测报告'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '除外', basis: '2型糖尿病属于慢性代谢性疾病，建议对糖尿病及相关并发症设置除外责任。', rejectedDiseases: [], excludedDiseases: ['糖尿病及其并发症', '糖尿病肾病', '糖尿病视网膜病变', '糖尿病足', '糖尿病神经病变'], delayedDiseases: [], exclusionWording: '被保险人投保前已确诊的2型糖尿病及其并发症（含糖尿病肾病、糖尿病视网膜病变、糖尿病足、糖尿病神经病变等），本公司不承担医疗保险金给付责任。', supplementarySuggestions: ['建议补充糖化血红蛋白检测报告', '建议补充眼底检查报告'] },
  ],
  '69f1cc14498ec0b6e588be7d': [
    { productName: '泰康健康有约终身重疾险', productConclusion: '大概率除外', basis: '右肩袖损伤，骨骼肌肉系统损伤。建议对右肩相关疾病设置除外责任。', rejectedDiseases: [], excludedDiseases: ['右肩袖损伤', '右肩关节疾病', '右肩功能障碍'], delayedDiseases: [], exclusionWording: '被保险人投保前已存在的右肩袖损伤及右肩相关疾病（含右肩关节疾病、右肩功能障碍等），本公司不承担保险金给付责任。', supplementarySuggestions: ['建议补充右肩MRI检查报告'] },
    { productName: '泰康e生保长期医疗保险', productConclusion: '标准体', basis: '右肩袖损伤属于骨骼肌肉系统损伤，多数情况下通过保守治疗或手术修复可以恢复良好，对医疗保险承保影响较小。', rejectedDiseases: [], excludedDiseases: [], delayedDiseases: [], exclusionWording: '', supplementarySuggestions: ['建议补充右肩MRI检查报告以明确损伤程度'] },
  ],
};

export const EM_SCORE_ANALYSIS: Record<string, EmScoreData> = {
  '69f1cc14498ec0b6e588be81': {
    thoughtProcess: '基于被保险人石玉林的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）右眼外伤后遗症（+30%）：右眼视力0.1（戴镜），伤残等级已评定。出院记录显示右眼球挫伤、外伤性前房积血、前房角后退、虹膜损伤、外伤性白内障、晶状体脱位等多重眼部损伤。视觉功能障碍明确，属于中等程度身体机能损伤。\n\n（2）癫痫病史（+20%）：既往癫痫病史，存在复发风险及并发症可能。癫痫发作可能导致意外伤害，增加意外伤残和意外身故风险。同时，癫痫长期用药可能对肝肾功能产生影响。\n\n（3）复查新增发现（+5%）：复查显示右眼玻璃体混浊加重和脉络膜脱离新发现，外伤后遗症存在进展趋势，提示眼部健康状况可能继续恶化。\n\n三、综合计算。基础EM值100 + 右眼外伤后遗症30 + 癫痫病史20 + 复查进展5 = EM = 155。风险等级中等偏高。\n\n四、承保建议。建议在标准费率基础上增加EM值调整，或对外伤相关眼部责任和癫痫相关责任设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 150, scoreBasis: '右眼外伤后遗症（+30%）：右眼视力0.1（戴镜），伤残等级已评定，视觉功能障碍明确。癫痫病史（+20%）：既往癫痫病史，存在复发风险及并发症可能。综合评估风险等级中等偏高。' },
      { productName: '泰康e生保长期医疗保险', emScore: 150, scoreBasis: '右眼外伤后遗症（+30%）：右眼视力0.1（戴镜），伤残等级已评定。癫痫病史（+20%）：既往癫痫病史，存在复发风险。综合评估风险等级中等偏高。' },
    ],
  },
  '69f1cc14498ec0b6e588be7e': {
    thoughtProcess: '基于被保险人刘吉云的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）肝硬化失代偿期（+100%）：肝功能严重受损，Child-Pugh分级B级，属于极高风险因素。肝硬化失代偿期意味着肝脏已失去正常代偿能力，预后差，5年生存率显著降低。\n\n（2）食管静脉曲张（+75%）：门静脉高压导致食管中重度静脉曲张，存在破裂出血风险。食管静脉曲张破裂出血是肝硬化最危险的并发症之一，出血量大、死亡率高，可能危及生命。\n\n（3）脾功能亢进（+25%）：门脉高压导致脾大和脾功能亢进，血细胞减少增加感染和出血风险。\n\n三、综合计算。基础EM值100 + 肝硬化失代偿期100 + 食管静脉曲张75 + 脾功能亢进25 = EM = 300。风险等级极高。\n\n四、承保建议。建议拒保或加费至EM值300以上。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 275, scoreBasis: '肝硬化失代偿期（+100%）：肝功能严重受损，预后差，属于极高风险因素。食管静脉曲张（+75%）：存在破裂出血风险，危及生命。综合评估风险等级极高。' },
      { productName: '泰康e生保长期医疗保险', emScore: 275, scoreBasis: '肝硬化失代偿期（+100%）：肝功能严重受损，预后差。食管静脉曲张（+75%）：存在破裂出血风险。综合评估风险等级极高。' },
    ],
  },
  '69f1cc14498ec0b6e588be7c': {
    thoughtProcess: '基于被保险人夏雅莹的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）肺部结节性质待查（+40%）：右肺上叶结节约1.2cm×1.0cm，边缘不规则，性质尚未明确。虽然抗感染治疗后缩小约20%提示炎性可能增加，但不能完全排除恶性肿瘤的可能性。\n\n（2）随访不确定性（+10%）：3个月后复查CT的结果存在不确定性。如果结节继续缩小或消失，风险将显著降低；如果结节稳定或增大，恶性风险将上升。在复查结果明确前，承保决策存在较大不确定性。\n\n三、综合计算。基础EM值100 + 肺部结节待查40 + 随访不确定性10 = EM = 150。风险等级中等偏高。\n\n四、承保建议。建议延期承保，待3个月后复查胸部CT结果明确后再行评估。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 140, scoreBasis: '肺部结节性质待查（+40%）：结节抗感染治疗后缩小，但性质尚未明确，存在恶性可能，需等待复查结果。综合评估风险等级中等。' },
      { productName: '泰康e生保长期医疗保险', emScore: 140, scoreBasis: '肺部结节性质待查（+40%）：结节抗感染治疗后缩小，但性质尚未明确。综合评估风险等级中等。' },
    ],
  },
  '69f1cc14498ec0b6e588be7a': {
    thoughtProcess: '基于被保险人王彦平的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）急性阑尾炎已治愈（+0%）：腹腔镜下阑尾切除术治疗效果明确，术后恢复良好，无并发症发生。切口愈合良好，血生化检查正常，心电图正常。疾病已完全治愈，无后遗症及并发症，不影响长期健康和承保风险。\n\n三、综合计算。基础EM值100 + 0 = EM = 100。风险等级低。\n\n四、承保建议。建议标准体承保，无需加费或设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 100, scoreBasis: '急性阑尾炎已治愈（+0%）：疾病已完全治愈，无后遗症及并发症，不影响承保风险。综合评估风险等级低。' },
      { productName: '泰康e生保长期医疗保险', emScore: 100, scoreBasis: '急性阑尾炎已治愈（+0%）：疾病已完全治愈，无后遗症及并发症，不影响医疗保险承保。综合评估风险等级低。' },
    ],
  },
  '69f1cc14498ec0b6e588be79': {
    thoughtProcess: '基于被保险人郭凰的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）血脂异常（+10%）：总胆固醇6.8mmol/L（偏高30.8%），LDL-C 4.2mmol/L（偏高23.5%），甘油三酯2.1mmol/L（偏高23.5%），属于代谢性问题。长期血脂异常可能增加动脉粥样硬化、冠心病、脑卒中等心血管疾病风险。\n\n（2）轻度脂肪肝（+5%）：超声提示肝内脂肪浸润，程度为轻度。目前肝功能（ALT、AST）正常，提示尚未造成明显肝细胞损伤。脂肪肝与血脂异常相关联，属于代谢综合征的组成部分。\n\n（3）超重（+3%）：BMI 26.6（超重），体重管理需要改善。超重与血脂异常和脂肪肝存在因果关系。\n\n三、综合计算。基础EM值100 + 血脂异常10 + 轻度脂肪肝5 + 超重3 = EM = 118。风险等级较低。\n\n四、承保建议。建议标准体或轻度加费承保，同时建议生活方式干预（低脂饮食、增加运动、控制体重）。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 110, scoreBasis: '血脂异常（+10%）：总胆固醇6.8mmol/L偏高，LDL-C 4.2mmol/L偏高，属于代谢性问题。轻度脂肪肝（+5%）：程度轻微，风险可控。综合评估风险等级较低。' },
      { productName: '泰康e生保长期医疗保险', emScore: 110, scoreBasis: '血脂异常（+10%）：总胆固醇6.8mmol/L偏高，LDL-C 4.2mmol/L偏高。轻度脂肪肝（+5%）：程度轻微，风险可控。综合评估风险等级较低。' },
    ],
  },
  '69f1cc14498ec0b6e588be78': {
    thoughtProcess: '基于被保险人黎苑媚的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）乳腺结节BI-RADS 3类（+20%）：右侧乳腺外上象限结节，1.5cm×1.2cm，BI-RADS 3类表示良性可能性大（恶性风险<2%），但恶性概率不为零。结节边界清晰、形态规则是良性特征，肿瘤标志物CA15-3、CA125正常是积极信号。\n\n（2）随访不确定性（+5%）：需要6个月后复查乳腺超声，观察结节变化。如果结节稳定或缩小可继续观察，如有增大或形态改变可能需要穿刺活检。\n\n三、综合计算。基础EM值100 + 乳腺结节20 + 随访不确定性5 = EM = 125。风险等级中等偏低。\n\n四、承保建议。建议在标准费率基础上增加EM值调整，或对乳腺相关疾病设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 120, scoreBasis: '乳腺结节BI-RADS 3类（+20%）：恶性风险<2%，定期随访观察中，风险较低但存在不确定性。综合评估风险等级中等偏低。' },
      { productName: '泰康e生保长期医疗保险', emScore: 120, scoreBasis: '乳腺结节BI-RADS 3类（+20%）：恶性风险<2%，定期随访观察中。综合评估风险等级中等偏低。' },
    ],
  },
  '69f1cc14498ec0b6e588be7b': {
    thoughtProcess: '基于被保险人陈日鑫的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）慢性肾功能不全CKD 4期（+100%）：eGFR约22ml/min/1.73m²（正常值>90ml/min/1.73m²），属于严重慢性肾脏疾病。双肾萎缩、皮质变薄提示病程较长且不可逆。预后差，5年内进展到终末期肾病（ESRD）的概率超过80%。\n\n（2）需透析准备（+80%）：疾病已进展到接近需要肾脏替代治疗阶段。透析治疗费用高（每年约10-15万元），生活质量显著下降，透析相关并发症风险增加。\n\n（3）多系统并发症（+50%）：高血压（160/95mmHg）、肾性贫血（Hb 85g/L）、高磷血症（1.9mmol/L）、低钙血症（2.0mmol/L）、甲状旁腺激素升高（320pg/ml）。多系统受累提示疾病已进入晚期阶段。\n\n三、综合计算。基础EM值100 + CKD 4期100 + 透析准备80 + 多系统并发症50 = EM = 330。风险等级极高。\n\n四、承保建议。建议拒保。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 280, scoreBasis: '慢性肾功能不全4期（+100%）：预后差，属于严重慢性肾脏疾病。需透析准备（+80%）：透析治疗风险高，预后不良。综合评估风险等级极高。' },
      { productName: '泰康e生保长期医疗保险', emScore: 280, scoreBasis: '慢性肾功能不全4期（+100%）：预后差。需透析准备（+80%）：透析治疗风险高。综合评估风险等级极高。' },
    ],
  },
  '69f1cc14498ec0b6e588be82': {
    thoughtProcess: '基于被保险人石玉林的复查医疗健康记录进行EM值评分。注意该被保人存在同被保人多任务，需与任务69f1cc14498ec0b6e588be81的病历信息综合考量。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）右眼外伤后遗症（+30%）：右眼视力0.1（戴镜），伤残等级已评定。首次就诊显示右眼球挫伤、外伤性前房积血、前房角后退、虹膜损伤、外伤性白内障、晶状体脱位等多重眼部损伤。\n\n（2）复查新增发现（+10%）：复查显示右眼玻璃体混浊（较前加重）和脉络膜脱离（新发现）。相比首次就诊记录，本次复查显示外伤后遗症存在明显进展趋势，提示眼部健康状况可能继续恶化。\n\n（3）多任务综合风险（+5%）：同被保人存在两次理赔记录，外伤后遗症持续进展，提示该被保人眼部健康状况存在持续恶化的趋势。\n\n三、综合计算。基础EM值100 + 右眼外伤后遗症30 + 复查进展10 + 多任务综合风险5 = EM = 145。风险等级中等偏高。\n\n四、承保建议。建议在标准费率基础上增加EM值调整，或对外伤相关眼部责任设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 140, scoreBasis: '右眼外伤后遗症（+30%）：右眼玻璃体混浊、脉络膜脱离，外伤后遗症风险明确。综合评估风险等级中等。' },
      { productName: '泰康e生保长期医疗保险', emScore: 140, scoreBasis: '右眼外伤后遗症（+30%）：右眼玻璃体混浊、脉络膜脱离，外伤后遗症风险明确。综合评估风险等级中等。' },
    ],
  },
  '69f1cc14498ec0b6e588be80': {
    thoughtProcess: '基于被保险人赵伯芳的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）2型糖尿病（+25%）：空腹血糖8.2mmol/L（偏高34.4%），糖化血红蛋白7.5%（偏高），糖尿病确诊3个月。当前处方二甲双胍500mg tid口服降糖治疗。糖化血红蛋白7.5%提示血糖控制欠佳（理想值<7.0%）。\n\n（2）资料不完整（+10%）：现有资料有限，缺少并发症筛查（糖尿病视网膜病变、糖尿病肾病、糖尿病神经病变）、用药随访数据、家族史等关键信息。资料不完整导致风险评估存在不确定性。\n\n（3）代谢综合征倾向（+5%）：糖尿病患者常伴随其他代谢问题（血脂异常、高血压等），虽然当前未提供相关数据，但存在潜在风险。\n\n三、综合计算。基础EM值100 + 2型糖尿病25 + 资料不完整10 + 代谢综合征倾向5 = EM = 140。风险等级中等偏高。\n\n四、承保建议。建议补充并发症筛查和用药随访数据后重新评估EM值。在资料完整前，建议轻度加费承保或延期。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 125, scoreBasis: '2型糖尿病（+25%）：需关注并发症风险（糖尿病肾病、视网膜病变、糖尿病足等），现有资料较少，建议补充更多医疗记录。综合评估风险等级中等。' },
      { productName: '泰康e生保长期医疗保险', emScore: 125, scoreBasis: '2型糖尿病（+25%）：需关注并发症风险（糖尿病肾病、视网膜病变等），现有资料较少。综合评估风险等级中等。' },
    ],
  },
  '69f1cc14498ec0b6e588be7d': {
    thoughtProcess: '基于被保险人李静的医疗健康记录进行EM值评分。\n\n一、基础EM值设定。采用标准体基础EM值100作为评分基准。\n\n二、风险因素逐项评估。\n\n（1）右肩袖损伤（+15%）：X线检查提示右肩袖损伤，肩峰下间隙变窄。属于骨骼肌肉系统损伤，多数情况下通过保守治疗（休息、理疗、药物治疗）可以恢复良好。但当前仅有X线结果，无法明确肩袖撕裂程度（X线对软组织损伤诊断有限）。\n\n（2）资料不完整（+5%）：缺少MRI检查结果，无法明确肩袖损伤的具体程度（部分撕裂还是完全撕裂）。MRI是评估肩袖损伤的金标准，需要补充MRI以全面评估预后。\n\n三、综合计算。基础EM值100 + 右肩袖损伤15 + 资料不完整5 = EM = 120。风险等级中等偏低。\n\n四、承保建议。建议补充MRI检查后重新评估EM值。在核保中建议对右肩相关疾病设置除外责任。',
    products: [
      { productName: '泰康健康有约终身重疾险', emScore: 115, scoreBasis: '右肩袖损伤（+15%）：骨骼肌肉系统损伤，预后良好。综合评估风险等级较低。' },
      { productName: '泰康e生保长期医疗保险', emScore: 115, scoreBasis: '右肩袖损伤（+15%）：骨骼肌肉系统损伤，预后良好。综合评估风险等级较低。' },
    ],
  },
};

export const REASON_OPTIONS = ['健康告知', '体检', '理赔', '高风险', '病历', '健康问题', '医疗数据', '保单状态', '除外', '延期', '拒保', '既往投保健康告知异常', '特别约定', '健康风险', '异常核保标记', '空'];
