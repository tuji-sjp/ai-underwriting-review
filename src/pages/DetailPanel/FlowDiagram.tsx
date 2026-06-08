import React from 'react';

interface FlowDiagramProps {
  nodeStates: Record<string, string>;
}

const FLOW_FAILURE_REASONS: Record<string, string> = {
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

const FlowDiagram: React.FC<FlowDiagramProps> = ({ nodeStates }) => {
  const ns = nodeStates;
  const cK = ['ecm_claim', 'ocrClassify_claim', 'ocrRecognize_claim', 'desensitize_claim'];
  const iK = ['ecm_ins', 'ocrClassify_ins', 'ocrRecognize_ins', 'desensitize_ins'];
  const aK = ['aiMedical', 'aiUnderwriting', 'emScore'];
  const aL = ['AI看病历', 'AI核保评估', 'EM值评分'];
  const lb = ['获取影像', 'OCR分类', 'OCR识别', '脱敏'];

  const R = 12;
  const PAD = 10;
  const hGap = 110;
  const vGap = 72;
  const topY = PAD + R;
  const botY = topY + vGap;
  const startX = PAD + R + 89;
  const mergeX = startX + 4 * hGap;
  const midY = (topY + botY) / 2;
  const aiX = mergeX + hGap;
  const aiMidY = midY;
  const completeX = aiX + hGap;

  const pos: Record<string, { x: number; y: number }> = {};
  for (let i = 0; i < 4; i++) {
    pos[cK[i]] = { x: startX + i * hGap, y: topY };
    pos[iK[i]] = { x: startX + i * hGap, y: botY };
  }
  pos['merge'] = { x: mergeX, y: midY };
  for (let ai = 0; ai < 3; ai++) {
    pos[aK[ai]] = { x: aiX, y: aiMidY + (ai - 1) * 60 };
  }
  pos['complete'] = { x: completeX, y: aiMidY };

  const allY = [topY, botY, midY, aiMidY - 60, aiMidY + 60];
  const maxY = Math.max(...allY);
  const svgW = completeX + R + PAD;
  const svgH = maxY + R + PAD;
  const nodeBottomH = Math.max(aiMidY + 60 + R, botY + R) + 26;
  const totalH = Math.max(svgH, nodeBottomH) + 20;

  const YO = 30;

  function bezier(x1: number, y1: number, x2: number, y2: number) {
    const cpx = Math.max((x2 - x1) * 0.45, 18);
    return `M${x1} ${y1 + YO} C${x1 + cpx} ${y1 + YO},${x2 - cpx} ${y2 + YO},${x2} ${y2 + YO}`;
  }

  function pathColor(state: string) {
    return state === 'done' ? '#52c41a' : state === 'error' ? '#ff4d4f' : '#d9d9d9';
  }

  function connPath(x1: number, y1: number, x2: number, y2: number, state: string) {
    if (state !== 'done' && state !== 'error') {
      return `<path d="${bezier(x1, y1, x2 + 16, y2)}" stroke="#d9d9d9" stroke-width="2" fill="none" stroke-dasharray="5,4"/>`;
    }
    return `<path d="${bezier(x1, y1, x2 + 16, y2)}" stroke="${pathColor(state)}" stroke-width="2" fill="none"/>`;
  }

  const iconDone = '&#10003;';
  const iconError = '&#10007;';
  const iconPending = '&bull;';

  function nodeDiv(key: string, label: string, state: string) {
    const icon = state === 'done' ? iconDone : state === 'error' ? iconError : iconPending;
    const tip = state === 'error'
      ? `<div class="node-tooltip">${FLOW_FAILURE_REASONS[key] || '节点执行失败'}</div>`
      : '';
    const left = pos[key].x - R;
    const top = pos[key].y - R + YO;
    return `<div class="flow-node" style="left:${left}px;top:${top}px;">` +
      `<div class="flow-node-circle ${state}">${icon}</div>` +
      `<div class="flow-node-label ${state}">${label}</div>` +
      tip +
      `</div>`;
  }

  let svg = `<svg width="${svgW}" height="${totalH}" style="top:0;left:0;">`;
  svg += `<text x="4" y="${topY + YO + 5}" style="font-size:14px;font-weight:bold;fill:#000">理赔审核流程</text>`;
  svg += `<text x="4" y="${botY + YO + 5}" style="font-size:14px;font-weight:bold;fill:#000">投保审核流程</text>`;

  for (let ci = 0; ci < 3; ci++) {
    const s1 = pos[cK[ci]], s2 = pos[cK[ci + 1]];
    svg += connPath(s1.x + R, s1.y, s2.x - R, s2.y, ns[cK[ci]]);
  }
  svg += connPath(pos['desensitize_claim'].x + R, pos['desensitize_claim'].y, pos['merge'].x - R, pos['merge'].y, ns['desensitize_claim']);

  for (let ii = 0; ii < 3; ii++) {
    const s3 = pos[iK[ii]], s4 = pos[iK[ii + 1]];
    svg += connPath(s3.x + R, s3.y, s4.x - R, s4.y, ns[iK[ii]]);
  }
  svg += connPath(pos['desensitize_ins'].x + R, pos['desensitize_ins'].y, pos['merge'].x - R, pos['merge'].y, ns['desensitize_ins']);

  for (let aj = 0; aj < 3; aj++) {
    svg += connPath(pos['merge'].x + R, pos['merge'].y, pos[aK[aj]].x - R, pos[aK[aj]].y, ns['merge']);
  }

  for (let ak = 0; ak < 3; ak++) {
    svg += connPath(pos[aK[ak]].x + R, pos[aK[ak]].y, pos['complete'].x - R, pos['complete'].y, ns[aK[ak]]);
  }

  svg += '</svg>';

  let html = `<div class="flow-wrapper" style="height:${totalH}px;width:100%;">`;
  html += svg;
  html += nodeDiv(cK[0], lb[0], ns[cK[0]]);
  html += nodeDiv(cK[1], lb[1], ns[cK[1]]);
  html += nodeDiv(cK[2], lb[2], ns[cK[2]]);
  html += nodeDiv(cK[3], lb[3], ns[cK[3]]);
  html += nodeDiv(iK[0], lb[0], ns[iK[0]]);
  html += nodeDiv(iK[1], lb[1], ns[iK[1]]);
  html += nodeDiv(iK[2], lb[2], ns[iK[2]]);
  html += nodeDiv(iK[3], lb[3], ns[iK[3]]);
  html += nodeDiv('merge', '汇总', ns['merge']);
  for (let a = 0; a < 3; a++) html += nodeDiv(aK[a], aL[a], ns[aK[a]]);
  html += nodeDiv('complete', '完成', ns['complete']);
  html += '</div>';

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default FlowDiagram;
