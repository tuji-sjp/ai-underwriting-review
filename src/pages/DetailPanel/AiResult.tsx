import React, { useState, useRef, useEffect } from 'react';
import { AI_MEDICAL_ANALYSIS, AI_UNDERWRITING_ANALYSIS, EM_SCORE_ANALYSIS, OCR_DISEASES, ALIAS_MAPPED_DISEASES, AI_JUDGE_DISEASES, MANUAL_UNDERWRITING } from '../../data/mockData';

interface AiResultProps {
  tabId: string;
  taskId: string;
  nodeState: string;
  showOnly?: 'middleResult' | 'conclusionCompare';
  hideCard?: boolean;
}

// 通用可收展文本组件，按实际容器宽度测量行数
const CollapsibleText: React.FC<{ text: string; maxLines: number }> = ({ text, maxLines }) => {
  const [expanded, setExpanded] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    // 获取当前容器的实际宽度
    const containerWidth = el.offsetWidth;
    // 创建隐藏测量元素，使用相同容器宽度
    const measure = document.createElement('div');
    measure.style.cssText = `position:absolute;visibility:hidden;height:auto;width:${containerWidth}px;font-size:12px;line-height:1.7;white-space:pre-wrap;word-break:break-word;padding:0;`;
    measure.textContent = text;
    document.body.appendChild(measure);
    const lineH = 12 * 1.7;
    const totalLines = Math.ceil(measure.scrollHeight / lineH);
    document.body.removeChild(measure);
    setShowBtn(totalLines > maxLines);
  }, [text, maxLines]);

  if (!text || text === '—') return <span style={{ fontSize: 12, color: '#333' }}>{text || '—'}</span>;

  return (
    <div style={{ position: 'relative' }}>
      {showBtn && (
        <span
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'absolute', top: 0, right: 0,
            color: '#1890ff', cursor: 'pointer', fontSize: 12, userSelect: 'none', whiteSpace: 'nowrap',
            width: 20, textAlign: 'right',
            lineHeight: '24px',
            zIndex: 1,
          }}
        >
          {expanded ? '收起' : '展开'}
        </span>
      )}
      <div
        ref={measureRef}
        style={{
          fontSize: 12, color: '#333', lineHeight: 1.7,
          paddingRight: showBtn ? 24 : 0,
          overflow: expanded ? 'visible' : 'hidden',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : maxLines,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const ExclusionWording: React.FC<{ text: string }> = ({ text }) => {
  return <CollapsibleText text={text} maxLines={2} />;
};

const ThoughtProcess: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = measureRef.current;
    if (!el || !text) return;
    // 获取当前容器的实际宽度
    const containerWidth = el.offsetWidth;
    // 创建隐藏测量元素，使用相同容器宽度
    const measure = document.createElement('div');
    measure.style.cssText = `position:absolute;visibility:hidden;height:auto;width:${containerWidth}px;font-size:12px;line-height:1.2;white-space:pre-wrap;word-break:break-word;padding:0;`;
    measure.textContent = text;
    document.body.appendChild(measure);
    const lineH = 12 * 1.2;
    const totalLines = Math.ceil(measure.scrollHeight / lineH);
    document.body.removeChild(measure);
    setShowBtn(totalLines > 2);
  }, [text]);

  return (
    <div style={{ position: 'relative' }}>
      {showBtn && (
        <span
          onClick={() => setExpanded(!expanded)}
          style={{
            position: 'absolute', top: 0, right: 0,
            color: '#1890ff', cursor: 'pointer', fontSize: 12, userSelect: 'none', whiteSpace: 'nowrap',
            width: 20, textAlign: 'right',
            lineHeight: '24px',
            zIndex: 1,
          }}
        >
          {expanded ? '收起' : '展开'}
        </span>
      )}
      <div
        ref={measureRef}
        style={{
          fontSize: 12, color: '#666', lineHeight: 1.2, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          paddingRight: showBtn ? 24 : 0,
          overflow: expanded ? 'visible' : 'hidden',
          display: expanded ? 'block' : '-webkit-box',
          WebkitLineClamp: expanded ? 'unset' : 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const AiResult: React.FC<AiResultProps> = ({ tabId, taskId, nodeState, showOnly, hideCard }) => {
  const [diffReasons, setDiffReasons] = useState<Record<number, string>>({});
  const [savedReasons, setSavedReasons] = useState<Record<number, string>>({});

  if (nodeState === 'error') return <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>AI节点执行失败</div>;
  if (nodeState === 'pending') return <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>AI节点尚未执行，暂无数据</div>;

  let data: any = null;
  if (tabId === 'aiMedical') data = AI_MEDICAL_ANALYSIS[taskId] || null;
  else if (tabId === 'aiUnderwriting') data = AI_UNDERWRITING_ANALYSIS[taskId] || null;
  else data = EM_SCORE_ANALYSIS[taskId] || null;

  if (!data) return <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>暂无AI分析结果</div>;

  const ocrDiseases = OCR_DISEASES[taskId] || [];
  const aliasMapped = ALIAS_MAPPED_DISEASES[taskId] || [];
  const aiJudge = AI_JUDGE_DISEASES[taskId] || [];

  // 标题组件：首个无分隔线，其余有上分隔线
  const SectionTitle: React.FC<{ label: string; isFirst?: boolean }> = ({ label, isFirst }) => (
    <div style={{ ...(isFirst ? {} : { paddingTop: 8, borderTop: '1px solid #e8e8e8' }), marginBottom: 8 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{label}</div>
    </div>
  );

  return (
    <div style={showOnly || hideCard ? {
      fontSize: 13, color: '#333',
    } : {
      background: '#fafbfc', border: '1px solid #f0f0f0', borderRadius: 10, padding: 18,
      fontSize: 13, color: '#333', lineHeight: 1.8,
    }}>
      {/* ===== 中间结果：OCR抽取疾病、别名映射疾病、AI判断疾病、思考过程 ===== */}
      {tabId === 'aiUnderwriting' && (!showOnly || showOnly === 'middleResult') && (
        <>
          {/* 疾病识别 - 原表格样式已注释，改为段落展示 */}
          {/*
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 12 }}>
              • 疾病识别
            </div>
            <div style={{
              background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px 16px', marginBottom: 12,
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
                <colgroup>
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12 }}>OCR抽取疾病</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12, borderLeft: '1px solid #e8e8e8' }}>别名映射疾病</th>
                    <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12, borderLeft: '1px solid #e8e8e8' }}>AI判断疾病</th>
                  </tr>
                </thead>
                <tbody>
                  {ocrDiseases.length > 0 ? ocrDiseases.map((ocrDisease, i) => {
                    const mapped = aliasMapped.find(a => a.original === ocrDisease);
                    const judged = aiJudge.find(a => a.original === ocrDisease);
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top' }}>{ocrDisease}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>
                          {mapped ? <span>{mapped.standard}</span> : '—'}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>
                          {judged ? judged.aiResult : '—'}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td colSpan={3} style={{ padding: '8px 12px', color: '#999', textAlign: 'center', verticalAlign: 'top' }}>暂无数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          */}

          {/* 疾病识别 - 段落展示 */}
          <div style={{ marginBottom: 16 }}>
            <SectionTitle label="• 疾病识别" isFirst />
            <div style={{ fontSize: 12, color: '#333', lineHeight: 1.8 }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: '#000' }}>OCR抽取疾病：</span>{ocrDiseases.length > 0 ? ocrDiseases.join('、') : '暂无数据'}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: '#000' }}>非别名映射疾病：</span>{aliasMapped.length > 0 ? aliasMapped.map(m => m.standard).join('、') : '暂无数据'}
              </div>
              <div>
                <span style={{ fontWeight: 700, color: '#000' }}>AI判断疾病：</span>{aiJudge.length > 0 ? aiJudge.map(j => j.aiResult).join('、') : '暂无数据'}
              </div>
            </div>
          </div>

          {/* 思考过程 */}
          <div style={{ marginBottom: 16 }}>
            <SectionTitle label="• 思考过程" />
            <ThoughtProcess text={data.thoughtProcess} />
          </div>
        </>
      )}

      {/* ===== 结论比对：AI结论 VS 人工结论 ===== */}
      {tabId === 'aiUnderwriting' && (!showOnly || showOnly === 'conclusionCompare') && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 12 }}>
            • AI结论 VS 人工结论
          </div>
          {data.products && data.products.length > 0
            ? data.products.map((prod: any, p: number) => {
              const manualProducts = MANUAL_UNDERWRITING[taskId] || [];
              const manualProd = manualProducts[p] || null;
              const normalizedConclusion = (conclusion: string) => {
                if (conclusion === '大概率标准体') return '标准体';
                if (conclusion === '大概率除外') return '除外';
                return conclusion;
              };
              const isSame = manualProd && normalizedConclusion(prod.productConclusion) === normalizedConclusion(manualProd.productConclusion);
              return (
                <div key={p} style={{
                  background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px 16px', marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1890ff' }}>
                      {prod.productName}
                    </span>
                    {manualProd && (
                      <>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 26,
                        padding: '10px 10px 10px 10px', borderRadius: 16, fontSize: 12, fontWeight: 600,
                        background: isSame ? 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)' : 'linear-gradient(135deg, #fff2f0 0%, #ffccc7 100%)',
                        color: isSame ? '#52c41a' : '#ff4d4f',
                        border: `1px solid ${isSame ? '#b7eb8f' : '#ffccc7'}`,
                        marginLeft: 10, marginRight: 16,
                      }}>
                        {isSame ? '一致' : '不一致'}
                      </span>
                      {!isSame && (
                        <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 auto' }}>
                          <input
                            type="text"
                            placeholder="请填写不一致原因"
                            value={diffReasons[p] || ''}
                            onChange={e => setDiffReasons(prev => ({ ...prev, [p]: e.target.value }))}
                            style={{
                              height: 26, flex: '0 1 280px', padding: '0 10px', border: '1px solid #d9d9d9',
                              borderRadius: 4, fontSize: 12, outline: 'none', background: '#fff',
                              color: '#333', transition: 'border-color 0.2s',
                            }}
                            onFocus={e => e.target.style.borderColor = '#1890ff'}
                            onBlur={e => e.target.style.borderColor = '#d9d9d9'}
                          />
                          <button
                            onClick={() => {
                              setSavedReasons(prev => ({ ...prev, [p]: diffReasons[p] || '' }));
                            }}
                            style={{
                              height: 26, padding: '0 12px', border: '1px solid #1890ff', borderRadius: 4,
                              background: '#1890ff', color: '#fff', fontSize: 12, fontWeight: 500,
                              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                              lineHeight: 'normal',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#40a9ff'; e.currentTarget.style.borderColor = '#40a9ff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#1890ff'; e.currentTarget.style.borderColor = '#1890ff'; }}
                          >
                            保存
                          </button>
                          {savedReasons[p] && (
                            <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 500 }}>
                              已保存：{savedReasons[p]}
                            </span>
                          )}
                        </div>
                        </>
                      )}
                      </>
                    )}
                  </div>
                  {/* 表格布局：字段名 | AI结论 | 人工结论 */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
                    <colgroup>
                      <col style={{ width: 100 }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: 'auto' }} />
                    </colgroup>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12 }}></th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12, borderLeft: '1px solid #e8e8e8' }}>AI结论</th>
                        <th style={{ padding: '8px 12px', fontWeight: 700, color: '#333', textAlign: 'center', fontSize: 12, borderLeft: '1px solid #e8e8e8' }}>人工结论</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000' }}>核保结论</td>
                        <td style={{ padding: '8px 12px', color: '#000', borderLeft: '1px solid #e8e8e8', position: 'relative' }}>
                          <span style={{ marginRight: 4 }}>{prod.productConclusion || '—'}</span>
                          {prod.productName === '泰康健康有约终身重疾险' && (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: 16, height: 16, borderRadius: 4,
                              background: '#1890ff', color: '#fff',
                              fontSize: 9, fontWeight: 700, lineHeight: 1,
                              verticalAlign: 'super',
                            }}>AI</span>
                          )}
                        </td>
                        <td style={{ padding: '8px 12px', color: '#000', borderLeft: '1px solid #e8e8e8' }}>{manualProd?.productConclusion || '—'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000' }}>结论依据</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', lineHeight: 1.7, borderLeft: '1px solid #e8e8e8' }}>{prod.basis || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', lineHeight: 1.7, borderLeft: '1px solid #e8e8e8' }}>{manualProd?.productConclusion === '拒保' ? (manualProd.basis || '—') : '—'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000' }}>除外疾病</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{prod.excludedDiseases?.join('、') || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{manualProd?.excludedDiseases?.join('、') || '—'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000', verticalAlign: 'top' }}>除外话术</td>
                        <td style={{ padding: '8px 12px', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}><ExclusionWording text={prod.exclusionWording || '—'} /></td>
                        <td style={{ padding: '8px 12px', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}><ExclusionWording text={manualProd?.exclusionWording || '—'} /></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000', verticalAlign: 'top' }}>延期疾病</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{prod.delayedDiseases?.join('、') || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{manualProd?.delayedDiseases?.join('、') || '—'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000', verticalAlign: 'top' }}>拒保疾病</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{prod.rejectedDiseases?.join('、') || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{manualProd?.rejectedDiseases?.join('、') || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: '#000', verticalAlign: 'top' }}>补充资料建议</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>{prod.supplementarySuggestions?.join('；') || '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#333', verticalAlign: 'top', borderLeft: '1px solid #e8e8e8' }}>—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
            : <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>暂无核保结论</div>}
        </div>
      )}

      {/* AI看病历 */}
      {tabId === 'aiMedical' && (!showOnly) && (
        <>
          <div style={{ marginBottom: 16 }}>
            <SectionTitle label="• 理赔记录" isFirst />
            {data.claimRecords && data.claimRecords.length > 0
              ? data.claimRecords.map((rec: any, j: number) => (
                <div key={j} style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: '#333' }}>{rec.date}：</span>
                  {rec.text}
                </div>
              ))
              : <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>暂无理赔记录</div>}
          </div>
          <div>
            <SectionTitle label="• 体检及病历记录" />
            {data.medicalRecords && data.medicalRecords.length > 0
              ? data.medicalRecords.map((mr: any, k: number) => (
                <div key={k} style={{ fontSize: 12, color: '#666', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, color: '#333' }}>{mr.date}：</span>
                  {mr.text}
                </div>
              ))
              : <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>暂无体检及病历记录</div>}
          </div>
        </>
      )}

      {/* EM值评分 */}
      {tabId === 'emScore' && (!showOnly) && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <SectionTitle label="• 评分结果" isFirst />
            {data.products && data.products.length > 0
              ? data.products.map((ep: any, q: number) => (
                <div key={q} style={{
                  background: '#fff', border: '1px solid #e8e8e8', borderRadius: 8, padding: '12px 16px', marginBottom: 12,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1890ff', marginBottom: 10 }}>
                    {ep.productName}
                  </div>
                  <div style={{ marginBottom: 8, display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>EM值评分：</span>
                    <span style={{ fontSize: 12, color: '#333', lineHeight: 1.7 }}>EM = {ep.emScore}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>评分依据：</span>
                    <span style={{ fontSize: 12, color: '#333', lineHeight: 1.7 }}>{ep.scoreBasis || '—'}</span>
                  </div>
                </div>
              ))
              : <div style={{ color: '#999', textAlign: 'center', padding: 20, fontSize: 13 }}>暂无评分结果</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiResult;
