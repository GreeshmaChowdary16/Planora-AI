import React from 'react';
import type { ProjectPlan } from '../data/mockPlans';

interface ExportProjectPDFProps {
  plan: ProjectPlan;
  completedTasks: Record<string, boolean>;
}

export const ExportProjectPDF: React.FC<ExportProjectPDFProps> = ({ plan, completedTasks }) => {
  const isHardware = plan.projectType === 'hardware';
  const accentColor = isHardware ? '#06B6D4' : '#F97316'; // Cyan vs Orange
  const accentLight = isHardware ? '#ECFEFF' : '#FFF7ED';
  const accentBorder = isHardware ? '#CFFAFE' : '#FFEDD5';
  
  const totalTasks = plan.roadmap?.reduce((acc, p) => acc + (p.tasks?.length || 0), 0) || 0;
  const completedCount = plan.roadmap?.reduce((acc, p) => {
    return acc + (p.tasks?.filter(t => completedTasks[t.id]).length || 0);
  }, 0) || 0;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      id="project-report"
      style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px', 
        width: '794px', 
        display: 'block',
        pointerEvents: 'none',
        backgroundColor: '#ffffff',
        color: '#09090b',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '40px'
      }}
    >
      {/* ================================================== */}
      {/* SECTION 1: COVER PAGE                              */}
      {/* ================================================== */}
      <div 
        style={{ 
          minHeight: '960px', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          padding: '60px 40px'
        }}
      >
        {/* Header Logo */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '6px', 
              backgroundColor: accentColor, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 'bold', 
              color: '#ffffff', 
              fontSize: '15px' 
            }}>
              P
            </div>
            <span style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '-0.5px', color: '#09090b' }}>
              PlanoraAI
            </span>
          </div>
          <span style={{ 
            fontSize: '9px', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            fontWeight: 'bold', 
            color: accentColor, 
            border: `1px solid ${accentBorder}`, 
            padding: '4px 10px', 
            borderRadius: '4px', 
            backgroundColor: accentLight 
          }}>
            {isHardware ? 'Electronics & IoT Engineering Blueprint' : 'Software SaaS Project Plan'}
          </span>
        </div>

        {/* Title Block */}
        <div style={{ margin: 'auto 0' }}>
          <div style={{ width: '60px', height: '4px', backgroundColor: accentColor, marginBottom: '24px' }}></div>
          <h1 style={{ 
            fontSize: '38px', 
            fontWeight: '800', 
            color: '#09090b', 
            lineHeight: '1.2', 
            margin: '0 0 16px 0', 
            letterSpacing: '-1.5px' 
          }}>
            {plan.title}
          </h1>
          <p style={{ 
            fontSize: '14px', 
            color: '#52525b', 
            lineHeight: '1.6', 
            margin: '0 0 32px 0', 
            fontWeight: 'normal', 
            maxWidth: '580px' 
          }}>
            {plan.description}
          </p>
          
          {/* Cover Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '40px' }}>
            <div style={{ padding: '14px', border: '1.5px solid #f4f4f5', borderRadius: '10px', backgroundColor: '#fafafa' }}>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                paradigm
              </span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#18181b' }}>
                {isHardware ? 'Hardware IoT' : 'Software SaaS'}
              </span>
            </div>
            <div style={{ padding: '14px', border: '1.5px solid #f4f4f5', borderRadius: '10px', backgroundColor: '#fafafa' }}>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                difficulty
              </span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#18181b' }}>
                {plan.skillLevel}
              </span>
            </div>
            <div style={{ padding: '14px', border: '1.5px solid #f4f4f5', borderRadius: '10px', backgroundColor: '#fafafa' }}>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                duration
              </span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#18181b' }}>
                {plan.duration}
              </span>
            </div>
            <div style={{ padding: '14px', border: '1.5px solid #f4f4f5', borderRadius: '10px', backgroundColor: '#fafafa' }}>
              <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#71717a', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                {isHardware ? 'est. budget' : 'uniqueness'}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#18181b' }}>
                {isHardware ? (plan.estimatedCost || '₹3,500') : `${plan.uniquenessAnalysis?.score || 85}/100`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px', color: '#71717a', borderTop: '1px solid #f4f4f5', paddingTop: '20px' }}>
            <div>
              <span style={{ display: 'block', fontWeight: 'bold', color: '#27272a', marginBottom: '4px' }}>Author Signature</span>
              <span style={{ fontStyle: 'italic' }}>PlanoraAI Engineering Assistant</span>
            </div>
            <div>
              <span style={{ display: 'block', textAlign: 'right', fontWeight: 'bold', color: '#27272a', marginBottom: '4px' }}>Date Generated</span>
              <span>{currentDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break" />

      {/* ================================================== */}
      {/* SECTION 2: EXECUTIVE SYNOPSIS & EXTRA NOTES       */}
      {/* ================================================== */}
      <div style={{ padding: '40px 20px', minHeight: '900px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          borderBottom: `2.5px solid ${accentColor}`, 
          paddingBottom: '10px', 
          color: '#09090b', 
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          01. System Synopsis & Objectives
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Description */}
          <div style={{ padding: '20px', border: '1px solid #e4e4e7', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', margin: '0 0 10px 0' }}>
              Project Narrative
            </h3>
            <p style={{ fontSize: '12px', color: '#27272a', lineHeight: '1.6', margin: 0 }}>
              {plan.description}
            </p>
          </div>

          {/* Uniqueness or Hardware specific sections */}
          {!isHardware && plan.uniquenessAnalysis && (
            <div style={{ padding: '20px', border: `1px solid ${accentBorder}`, borderRadius: '8px', backgroundColor: accentLight }}>
              <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#18181b', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                AI Innovation & Market Analysis
              </h3>
              <p style={{ fontSize: '12px', color: '#3f3f46', lineHeight: '1.6', margin: 0 }}>
                {plan.uniquenessAnalysis.summary}
              </p>
            </div>
          )}

          {isHardware && (
            <>
              {plan.hardwareComplexity && (
                <div style={{ padding: '20px', border: `1px solid ${accentBorder}`, borderRadius: '8px', backgroundColor: accentLight }}>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#18181b', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                    Microcontroller & Hardware Complexity Review
                  </h3>
                  <p style={{ fontSize: '12px', color: '#3f3f46', lineHeight: '1.6', margin: 0 }}>
                    {plan.hardwareComplexity}
                  </p>
                </div>
              )}

              {plan.codingRequirement && (
                <div style={{ padding: '20px', border: '1px solid #e4e4e7', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <h3 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', margin: '0 0 10px 0' }}>
                    Boilerplate Code & Firmware Requirements
                  </h3>
                  <p style={{ fontSize: '12px', color: '#27272a', lineHeight: '1.6', margin: 0 }}>
                    {plan.codingRequirement}
                  </p>
                </div>
              )}

              {plan.realWorldApplications && plan.realWorldApplications.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '15px 0 10px 0' }}>
                    Real-World / Industrial Applications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {plan.realWorldApplications.map((app, idx) => (
                      <div key={idx} style={{ border: '1px solid #f4f4f5', padding: '12px', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#18181b', display: 'block', marginBottom: '4px' }}>
                          Application #{idx + 1}
                        </span>
                        <span style={{ fontSize: '10px', color: '#71717a', lineHeight: '1.4' }}>
                          {app}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="page-break" />

      {/* ================================================== */}
      {/* SECTION 3: TECH STACK OR BILL OF MATERIALS (BOM)  */}
      {/* ================================================== */}
      <div style={{ padding: '40px 20px', minHeight: '900px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          borderBottom: `2.5px solid ${accentColor}`, 
          paddingBottom: '10px', 
          color: '#09090b', 
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {isHardware ? '02. Bill of Materials (BOM) & Budget' : '02. Recommended Technology Stack'}
        </h2>

        {!isHardware ? (
          /* Software Tech Stack */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p style={{ fontSize: '12px', color: '#52525b', lineHeight: '1.6', margin: 0 }}>
              The following software stack has been chosen specifically for scalability, maintainability, and quick prototype deployments.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {plan.techStack?.map((t, idx) => (
                <div key={idx} style={{ border: '1.5px solid #f4f4f5', padding: '16px', borderRadius: '8px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#18181b' }}>{t.name}</span>
                      <span style={{ fontSize: '9px', color: accentColor, fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: accentLight, padding: '2px 6px', borderRadius: '4px', border: `1px solid ${accentBorder}` }}>
                        {t.category}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#71717a', display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                      Role: {t.role}
                    </span>
                    <p style={{ fontSize: '10.5px', color: '#52525b', margin: 0, lineHeight: '1.4' }}>
                      {t.whyChosen}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Hardware BOM Table & Budget */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Target Budget limits */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ border: '1px solid #e4e4e7', padding: '16px', borderRadius: '8px', backgroundColor: '#fafafa', textAlign: 'center' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#71717a', fontWeight: 'bold', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  Target Budget Limit
                </span>
                <span style={{ fontSize: '24px', fontWeight: 'extrabold', color: accentColor }}>
                  {plan.budgetRange || 'N/A'}
                </span>
              </div>
              <div style={{ border: `1px solid ${accentBorder}`, padding: '16px', borderRadius: '8px', backgroundColor: accentLight, textAlign: 'center' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#0f766e', fontWeight: 'bold', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                  Estimated BOM Total Cost
                </span>
                <span style={{ fontSize: '24px', fontWeight: 'extrabold', color: '#0d9488' }}>
                  {plan.estimatedCost || 'N/A'}
                </span>
              </div>
            </div>

            {/* BOM Procurement list */}
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 12px 0', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                Procurement Component Directory
              </h3>
              <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a' }}>Component</th>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a', width: '70px' }}>QTY</th>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a', width: '100px' }}>Unit Est</th>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a', width: '90px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.hardwareComponents?.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < (plan.hardwareComponents?.length || 0) - 1 ? '1px solid #f4f4f5' : 'none' }}>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                          <span style={{ fontWeight: 'bold', color: '#18181b', display: 'block' }}>{c.component}</span>
                          <span style={{ fontSize: '9.5px', color: '#71717a', display: 'block', marginTop: '2px' }}>{c.purpose}</span>
                          {c.wiringRole && (
                            <span style={{ fontSize: '9px', color: '#0891B2', display: 'block', marginTop: '4px', fontFamily: 'monospace' }}>
                              Wiring: {c.wiringRole}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', fontFamily: 'monospace' }}>
                          {c.quantity || 1}
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', fontFamily: 'monospace', color: '#0d9488', fontWeight: 'bold' }}>
                          {c.estimatedPrice || '₹250'}
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                          <span style={{ 
                            fontSize: '8px', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontWeight: 'bold', 
                            textTransform: 'uppercase',
                            backgroundColor: c.required ? '#ecfeff' : '#f4f4f5',
                            color: c.required ? '#0891b2' : '#71717a',
                            border: c.required ? '1px solid #cffafe' : '1px solid #e4e4e7'
                          }}>
                            {c.required ? 'Required' : 'Optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="page-break" />

      {/* ================================================== */}
      {/* SECTION 4: DEVELOPMENT ROADMAP                     */}
      {/* ================================================== */}
      <div style={{ padding: '40px 20px', minHeight: '900px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          borderBottom: `2.5px solid ${accentColor}`, 
          paddingBottom: '10px', 
          color: '#09090b', 
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          03. Implementation Roadmap & Milestones
        </h2>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', border: '1px solid #e4e4e7', borderRadius: '8px', backgroundColor: '#fafafa', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#09090b' }}>Project Progress Verification Scoreboard</span>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: accentColor, fontFamily: 'monospace' }}>
            {completedCount} / {totalTasks} Tasks Completed ({progressPercent}%)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {plan.roadmap?.map((phase, pIdx) => (
            <div key={pIdx} style={{ border: '1.5px solid #f4f4f5', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #f4f4f5', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', margin: 0 }}>
                  {phase.phaseName}
                </h4>
                <span style={{ fontSize: '9px', color: '#71717a', fontFamily: 'monospace', backgroundColor: '#fafafa', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e4e4e7' }}>
                  Phase Duration: {phase.tasks?.reduce((sum, t) => sum + parseInt(t.duration || '0'), 0) || 3} Days
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {phase.tasks?.map((task, tIdx) => {
                  const isDone = !!completedTasks[task.id];
                  return (
                    <div key={tIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11px', paddingBottom: '8px', borderBottom: tIdx < (phase.tasks?.length || 0) - 1 ? '1px solid #fafafa' : 'none' }}>
                      <span style={{ fontSize: '13px', cursor: 'default', userSelect: 'none', color: isDone ? accentColor : '#a1a1aa', fontWeight: 'bold', fontFamily: 'monospace' }}>
                        {isDone ? '[x]' : '[ ]'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 'bold', color: isDone ? '#a1a1aa' : '#18181b', textDecoration: isDone ? 'line-through' : 'none' }}>
                            {task.title}
                          </span>
                          <span style={{ fontSize: '9px', color: '#71717a', fontFamily: 'monospace' }}>{task.duration}</span>
                        </div>
                        <p style={{ margin: 0, color: '#71717a', fontSize: '10px', fontWeight: 'normal', lineHeight: '1.4' }}>
                          {task.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-break" />

      {/* ================================================== */}
      {/* SECTION 5: ARCHITECTURE MAP & CODE STACK          */}
      {/* ================================================== */}
      <div style={{ padding: '40px 20px', minHeight: '900px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          borderBottom: `2.5px solid ${accentColor}`, 
          paddingBottom: '10px', 
          color: '#09090b', 
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          04. System Topology & Development Architecture
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Architecture Map rendering */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 12px 0' }}>
              {isHardware ? 'Circuit Signal Track & Telemetry Flow' : 'System Architecture Block Map'}
            </h3>
            
            <div className="svg-wrapper" style={{ border: '1.5px solid #f4f4f5', borderRadius: '10px', backgroundColor: '#fafafa', padding: '16px', display: 'flex', justifyContent: 'center' }}>
              <svg width="600" height="260" viewBox="0 0 850 360" className="overflow-visible" style={{ maxWidth: '100%', height: 'auto', background: '#ffffff' }}>
                {plan.architecture?.edges.map((edge, idx) => {
                  const fromNode = plan.architecture.nodes.find(n => n.id === edge.from);
                  const toNode = plan.architecture.nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  if (isHardware) {
                    // Right-angled path for hardware
                    const midX = (fromNode.x + toNode.x) / 2;
                    return (
                      <g key={idx}>
                        <path
                          d={`M ${fromNode.x} ${fromNode.y} L ${midX} ${fromNode.y} L ${midX} ${toNode.y} L ${toNode.x} ${toNode.y}`}
                          fill="none"
                          stroke="#06B6D4"
                          strokeWidth="2"
                          strokeDasharray={edge.dashed ? "4,4" : "0"}
                        />
                        {edge.label && (
                          <g>
                            <rect
                              x={midX - 45}
                              y={(fromNode.y + toNode.y) / 2 - 8}
                              width="90"
                              height="16"
                              rx="3"
                              fill="#ffffff"
                              stroke="#06B6D4"
                              strokeWidth="0.5"
                            />
                            <text
                              x={midX}
                              y={(fromNode.y + toNode.y) / 2 + 3}
                              fill="#0891B2"
                              fontSize="9"
                              textAnchor="middle"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {edge.label}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  } else {
                    // Straight line for software
                    return (
                      <g key={idx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="#a1a1aa"
                          strokeWidth="2"
                          strokeDasharray={edge.dashed ? "4,4" : "0"}
                        />
                        {edge.label && (
                          <g>
                            <rect
                              x={(fromNode.x + toNode.x) / 2 - 45}
                              y={(fromNode.y + toNode.y) / 2 - 8}
                              width="90"
                              height="16"
                              rx="3"
                              fill="#ffffff"
                              stroke="#a1a1aa"
                              strokeWidth="0.5"
                            />
                            <text
                              x={(fromNode.x + toNode.x) / 2}
                              y={(fromNode.y + toNode.y) / 2 + 3}
                              fill="#71717a"
                              fontSize="9"
                              textAnchor="middle"
                              fontWeight="bold"
                              fontFamily="monospace"
                            >
                              {edge.label}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  }
                })}

                {plan.architecture?.nodes.map((node) => {
                  let color = '#71717a';
                  let typeLabel = '';
                  if (isHardware) {
                    const isSensor = node.type === 'client' || node.type === 'external_api';
                    const isController = node.type === 'server' || node.type === 'iot_device';
                    const isActuator = node.type === 'database';
                    typeLabel = isSensor ? 'SENSOR' : isController ? 'CONTROLLER/MCU' : isActuator ? 'ACTUATOR' : 'HARDWARE NODE';
                    color = isSensor ? '#06B6D4' : isController ? '#0891B2' : isActuator ? '#0e7490' : '#71717a';
                  } else {
                    const nodeColors = {
                      client: '#3b82f6',
                      server: '#8b5cf6',
                      database: '#10b981',
                      external_api: '#f43f5e',
                      iot_device: '#eab308'
                    };
                    color = nodeColors[node.type] || '#71717a';
                    typeLabel = node.type.toUpperCase().replace('_', ' ');
                  }

                  return (
                    <g key={node.id}>
                      <rect
                        x={node.x - 65}
                        y={node.y - 25}
                        width="130"
                        height="50"
                        rx="8"
                        fill="#ffffff"
                        stroke={color}
                        strokeWidth="2.5"
                      />
                      <text
                        x={node.x}
                        y={node.y - 2}
                        fill="#18181b"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 12}
                        fill={color}
                        fontSize="8.5"
                        textAnchor="middle"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {typeLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Development Configuration Tools or Firmware Stack */}
          {!isHardware ? (
            /* Software Deployment configuration */
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 12px 0' }}>
                Tool Configuration & Deployment Architecture
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div style={{ border: '1px solid #e4e4e7', padding: '14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>IDE / Coding Environment</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#09090b', display: 'block' }}>VS Code / JetBrains</span>
                  <span style={{ fontSize: '10px', color: '#71717a', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>Standard Technical Editor</span>
                </div>
                <div style={{ border: '1px solid #e4e4e7', padding: '14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Cloud Hosting</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#09090b', display: 'block' }}>
                    {plan.toolsAndDeployment?.deployment?.frontend?.platform || 'Vercel'} / {plan.toolsAndDeployment?.deployment?.backend?.platform || 'Render'}
                  </span>
                  <span style={{ fontSize: '10px', color: '#71717a', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>Deployment environments chosen</span>
                </div>
                <div style={{ border: '1px solid #e4e4e7', padding: '14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', color: accentColor, fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Repository Control</span>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#09090b', display: 'block' }}>Git & GitHub</span>
                  <span style={{ fontSize: '10px', color: '#71717a', marginTop: '4px', display: 'block', lineHeight: '1.4' }}>Remote Version Storage</span>
                </div>
              </div>
            </div>
          ) : (
            /* Hardware Firmware stack */
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 12px 0' }}>
                Firmware Stack & Microcontroller Headers
              </h3>
              <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#fafafa', padding: '10px 16px', borderBottom: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#71717a', fontFamily: 'monospace' }}>firmware_config.ino</span>
                  <span style={{ fontSize: '9px', color: '#0891b2', fontWeight: 'bold', fontFamily: 'monospace' }}>C++ / Arduino IDE</span>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#ffffff', fontFamily: 'monospace', fontSize: '11px', color: '#3f3f46', lineHeight: '1.6' }}>
                  <div style={{ color: '#0891b2', marginBottom: '8px' }}>// Auto-generated library import headers</div>
                  {plan.firmwareStack && plan.firmwareStack.length > 0 ? (
                    plan.firmwareStack.map((fw, idx) => {
                      const match = fw.match(/^([^\s\(]+)(?:\s+\((.+)\))?/);
                      const lib = match ? match[1] : fw;
                      const comment = match && match[2] ? ` // ${match[2]}` : '';
                      return (
                        <div key={idx} style={{ display: 'flex' }}>
                          <span style={{ color: '#a1a1aa', width: '25px', display: 'inline-block', userSelect: 'none' }}>{idx + 1}</span>
                          <div>
                            <span style={{ color: '#ec4899', fontWeight: 'bold' }}>#include</span>{' '}
                            <span style={{ color: '#0f766e' }}>&lt;{lib}&gt;</span>
                            {comment && <span style={{ color: '#9a3412', fontStyle: 'italic', fontSize: '10px' }}>{comment}</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ fontStyle: 'italic', color: '#a1a1aa' }}>No libraries required. Standard MCU registry.</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isHardware && plan.hardwareTools && plan.hardwareTools.length > 0 && (
        <>
          <div className="page-break" />
          {/* ================================================== */}
          {/* SECTION 6: HARDWARE TOOLS (HARDWARE ONLY)          */}
          {/* ================================================== */}
          <div style={{ padding: '40px 20px', minHeight: '900px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              borderBottom: `2.5px solid ${accentColor}`, 
              paddingBottom: '10px', 
              color: '#09090b', 
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              05. Required Laboratory Engineering Tools
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {plan.hardwareTools.map((tool, idx) => (
                <div key={idx} style={{ border: '1px solid #e4e4e7', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accentColor, fontWeight: 'bold' }}>
                      🛠️
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#18181b', margin: 0 }}>{tool.tool}</h4>
                      <p style={{ fontSize: '11px', color: '#71717a', margin: '2px 0 0 0' }}>{tool.purpose}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', borderTop: '1px solid #f4f4f5', paddingTop: '10px', fontSize: '10px' }}>
                    {tool.whyNeeded && (
                      <div>
                        <span style={{ fontWeight: 'bold', color: accentColor, display: 'block', textTransform: 'uppercase', fontSize: '8px', marginBottom: '2px' }}>Why Needed</span>
                        <span style={{ color: '#52525b' }}>{tool.whyNeeded}</span>
                      </div>
                    )}
                    {tool.whereUsed && (
                      <div>
                        <span style={{ fontWeight: 'bold', color: accentColor, display: 'block', textTransform: 'uppercase', fontSize: '8px', marginBottom: '2px' }}>Where Used</span>
                        <span style={{ color: '#52525b' }}>{tool.whereUsed}</span>
                      </div>
                    )}
                    {tool.beginnerFriendliness && (
                      <div>
                        <span style={{ fontWeight: 'bold', color: accentColor, display: 'block', textTransform: 'uppercase', fontSize: '8px', marginBottom: '2px' }}>Learning Curve</span>
                        <span style={{ color: '#52525b' }}>{tool.beginnerFriendliness}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="page-break" />

      {/* ================================================== */}
      {/* SECTION 7: RESEARCH & SAFETY NOTES                */}
      {/* ================================================== */}
      <div style={{ padding: '40px 20px', minHeight: '900px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 'bold', 
          borderBottom: `2.5px solid ${accentColor}`, 
          paddingBottom: '10px', 
          color: '#09090b', 
          margin: '0 0 24px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {isHardware ? '06. Literature Survey & Safety Precautions' : '05. Literature Survey & Deployment steps'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Prior Art Analysis */}
          {plan.researchAnalysis && (
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 12px 0' }}>
                Prior Art Analysis (Literature Survey Comparison)
              </h3>
              <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10.5px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a', width: '220px' }}>Reference Project</th>
                      <th style={{ padding: '10px 12px', fontWeight: 'bold', color: '#71717a' }}>Key Technical Limitations & Gaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.researchAnalysis.existingProjects?.map((project, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < (plan.researchAnalysis?.existingProjects?.length || 0) - 1 ? '1px solid #f4f4f5' : 'none' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#18181b', verticalAlign: 'top' }}>{project.name}</td>
                        <td style={{ padding: '10px 12px', color: '#52525b', verticalAlign: 'top', lineHeight: '1.4' }}>
                          {project.limitations?.join('; ') || 'High computational latency or expensive cost barriers.'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Academic Discussion Viva Topics */}
          {plan.researchAnalysis?.researchTopics && plan.researchAnalysis.researchTopics.length > 0 && (
            <div>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 10px 0' }}>
                Academic Research Viva Paper Topics
              </h3>
              <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#3f3f46', lineHeight: '1.8' }}>
                  {plan.researchAnalysis.researchTopics.map((topic, idx) => (
                    <li key={idx}>{topic}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Safety Notes (Hardware) or Deployment Steps (Software) */}
          {isHardware ? (
            plan.safetyNotes && plan.safetyNotes.length > 0 && (
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#d97706', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚠️</span> Electrical Wiring & Laboratory Safety Precautions
                </h3>
                <div style={{ border: '1px solid #fef3c7', borderRadius: '8px', padding: '16px', backgroundColor: '#fffbeb' }}>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#92400e', lineHeight: '1.7' }}>
                    {plan.safetyNotes.map((note, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ) : (
            plan.toolsAndDeployment?.deploymentSteps && plan.toolsAndDeployment.deploymentSteps.length > 0 && (
              <div>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#09090b', margin: '0 0 10px 0' }}>
                  Production Deployment & Staging Workflows
                </h3>
                <div style={{ border: '1px solid #e4e4e7', borderRadius: '8px', padding: '16px', backgroundColor: '#fafafa' }}>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '11px', color: '#3f3f46', lineHeight: '1.8' }}>
                    {plan.toolsAndDeployment.deploymentSteps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>
                        <strong>{step.step}</strong>: {step.description}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
