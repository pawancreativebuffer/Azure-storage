import React, { useState, useMemo, useEffect } from 'react';
import {
  Database,
  Download,
  Globe,
  Cpu,
  Layers,
  Settings,
  LogOut,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle2,
  CreditCard,
  Plus,
  Sparkles,
  Activity,
  Calendar,
  Home,
  Info,
  DollarSign,
  User,
  Sliders,
  Send,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import './App.css';

// Initial Customer Mock Database
const INITIAL_CUSTOMERS = [
  {
    id: 'acme',
    name: 'Acme Corporation',
    planName: 'Store Plan (30 Stores)',
    monthlyFee: 900,
    stores: 30,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 357, // Internal cost to us
    overages: 2231, // Extra charges customer pays
    quotaScore: 25,
    usageDetails: {
      storage: { current: 850, limit: 60, unit: 'GB' },
      downloads: { current: 450000, limit: 150000, unit: '' },
      bandwidth: { current: 4.2, limit: 0.3, unit: 'TB' },
      apiRequests: { current: 8.2, limit: 1.5, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '60 GB', current: '850 GB', remaining: '0 GB', overage: '790 GB', cost: 1580 },
      { service: 'CDN Bandwidth', included: '0.3 TB', current: '4.2 TB', remaining: '0 TB', overage: '3.9 TB', cost: 390 },
      { service: 'API Requests', included: '1.5 M', current: '8.2 M', remaining: '0 M', overage: '6.7 M', cost: 201 },
      { service: 'Downloads', included: '150k', current: '450k', remaining: '0k', overage: '300k', cost: 60 }
    ],
    moduleCostSplit: { dam: 420, downloads: 480, api: 242 },
    azureCostSplit: { storage: 135, cdn: 108, api: 63, downloads: 36 },
    costTrend: [1100, 1150, 1120, 1220, 1250, 1280, 1310, 1340, 1320, 1390, 1410, 3131],
    costTrendPreviousYear: [950, 980, 1010, 990, 1020, 1050, 1080, 1110, 1090, 1120, 1140, 1150],
    storageTrend: [620, 640, 660, 690, 710, 730, 760, 780, 800, 810, 830, 850],
    forecast: {
      storage: '920 GB',
      downloads: '495,000',
      bandwidth: '4.6 TB',
      invoice: '$3,131',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '45%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 100% of allocated plan limit.' },
      { id: 2, type: 'critical', msg: 'Downloads approaching limit (300% utilized).' },
      { id: 3, type: 'warning', msg: 'Bandwidth usage is nearing its quota.' },
      { id: 4, type: 'warning', msg: 'Additional Azure consumption overage charges of $2,231 expected this month.' }
    ]
  },
  {
    id: 'globetech',
    name: 'GlobeTech Solutions',
    planName: 'Store Plan (20 Stores)',
    monthlyFee: 600,
    stores: 20,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 243,
    overages: 749,
    quotaScore: 35,
    usageDetails: {
      storage: { current: 310, limit: 40, unit: 'GB' },
      downloads: { current: 155000, limit: 100000, unit: '' },
      bandwidth: { current: 1.55, limit: 0.2, unit: 'TB' },
      apiRequests: { current: 3.1, limit: 1.0, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '40 GB', current: '310 GB', remaining: '0 GB', overage: '270 GB', cost: 540 },
      { service: 'CDN Bandwidth', included: '0.2 TB', current: '1.55 TB', remaining: '0 TB', overage: '1.35 TB', cost: 135 },
      { service: 'API Requests', included: '1.0 M', current: '3.1 M', remaining: '0 M', overage: '2.1 M', cost: 63 },
      { service: 'Downloads', included: '100k', current: '155k', remaining: '0k', overage: '55k', cost: 11 }
    ],
    moduleCostSplit: { dam: 180, downloads: 220, api: 90 },
    azureCostSplit: { storage: 90, cdn: 72, api: 42, downloads: 24 },
    costTrend: [350, 360, 340, 355, 370, 365, 380, 375, 360, 380, 390, 1349],
    costTrendPreviousYear: [310, 315, 320, 330, 325, 335, 340, 345, 330, 340, 350, 345],
    storageTrend: [250, 255, 260, 270, 275, 280, 290, 295, 300, 305, 308, 310],
    forecast: {
      storage: '325 GB',
      downloads: '170,000',
      bandwidth: '1.7 TB',
      invoice: '$1,349',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '40%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 100% of your base plan limit.' },
      { id: 2, type: 'warning', msg: 'Additional Azure consumption overage charges of $749 expected this month.' }
    ]
  },
  {
    id: 'nova',
    name: 'Nova Creative Agency',
    planName: 'Store Plan (10 Stores)',
    monthlyFee: 300,
    stores: 10,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 129,
    overages: 550,
    quotaScore: 30,
    usageDetails: {
      storage: { current: 230, limit: 20, unit: 'GB' },
      downloads: { current: 95000, limit: 50000, unit: '' },
      bandwidth: { current: 0.92, limit: 0.1, unit: 'TB' },
      apiRequests: { current: 1.8, limit: 0.5, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '20 GB', current: '230 GB', remaining: '0 GB', overage: '210 GB', cost: 420 },
      { service: 'CDN Bandwidth', included: '0.1 TB', current: '0.92 TB', remaining: '0 TB', overage: '0.82 TB', cost: 82 },
      { service: 'API Requests', included: '0.5 M', current: '1.8 M', remaining: '0 M', overage: '1.3 M', cost: 39 },
      { service: 'Downloads', included: '50k', current: '95k', remaining: '0k', overage: '45k', cost: 9 }
    ],
    moduleCostSplit: { dam: 180, downloads: 140, api: 80 },
    azureCostSplit: { storage: 45, cdn: 36, api: 21, downloads: 12 },
    costTrend: [380, 395, 410, 420, 430, 445, 450, 460, 455, 470, 480, 850],
    costTrendPreviousYear: [320, 330, 340, 345, 350, 360, 355, 365, 370, 375, 380, 375],
    storageTrend: [110, 120, 125, 130, 142, 150, 155, 160, 168, 172, 175, 180],
    forecast: {
      storage: '205 GB',
      downloads: '105,000',
      bandwidth: '1.05 TB',
      invoice: '$850',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '35%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 100% of your plan limit.' },
      { id: 2, type: 'warning', msg: 'Azure resources cost exceeds your subscription plan price.' }
    ]
  },
  {
    id: 'apex',
    name: 'Apex Retailers',
    planName: 'Store Plan (40 Stores)',
    monthlyFee: 1200,
    stores: 40,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 471,
    overages: 1854,
    quotaScore: 32,
    usageDetails: {
      storage: { current: 740, limit: 80, unit: 'GB' },
      downloads: { current: 360000, limit: 200000, unit: '' },
      bandwidth: { current: 3.8, limit: 0.4, unit: 'TB' },
      apiRequests: { current: 7.4, limit: 2.0, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '80 GB', current: '740 GB', remaining: '0 GB', overage: '660 GB', cost: 1320 },
      { service: 'CDN Bandwidth', included: '0.4 TB', current: '3.8 TB', remaining: '0 TB', overage: '3.4 TB', cost: 340 },
      { service: 'API Requests', included: '2.0 M', current: '7.4 M', remaining: '0 M', overage: '5.4 M', cost: 162 },
      { service: 'Downloads', included: '200k', current: '360k', remaining: '0k', overage: '160k', cost: 32 }
    ],
    moduleCostSplit: { dam: 310, downloads: 180, api: 120 },
    azureCostSplit: { storage: 180, cdn: 144, api: 84, downloads: 48 },
    costTrend: [780, 790, 810, 800, 820, 830, 840, 835, 840, 845, 860, 3054],
    costTrendPreviousYear: [680, 700, 710, 720, 730, 740, 750, 745, 755, 760, 770, 765],
    storageTrend: [610, 625, 630, 642, 660, 675, 690, 705, 715, 722, 735, 740],
    forecast: {
      storage: '780 GB',
      downloads: '390,000',
      bandwidth: '4.1 TB',
      invoice: '$3,054',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '42%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 100% of your plan limit.' },
      { id: 2, type: 'warning', msg: 'Azure resources cost exceeds your subscription plan price.' }
    ]
  },
  {
    id: 'summit',
    name: 'Summit Health Group',
    planName: 'Store Plan (20 Stores)',
    monthlyFee: 600,
    stores: 20,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 243,
    overages: 1247,
    quotaScore: 28,
    usageDetails: {
      storage: { current: 480, limit: 40, unit: 'GB' },
      downloads: { current: 240000, limit: 100000, unit: '' },
      bandwidth: { current: 2.45, limit: 0.2, unit: 'TB' },
      apiRequests: { current: 4.8, limit: 1.0, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '40 GB', current: '480 GB', remaining: '0 GB', overage: '440 GB', cost: 880 },
      { service: 'CDN Bandwidth', included: '0.2 TB', current: '2.45 TB', remaining: '0 TB', overage: '2.25 TB', cost: 225 },
      { service: 'API Requests', included: '1.0 M', current: '4.8 M', remaining: '0 M', overage: '3.8 M', cost: 114 },
      { service: 'Downloads', included: '100k', current: '240k', remaining: '0k', overage: '140k', cost: 28 }
    ],
    moduleCostSplit: { dam: 390, downloads: 310, api: 170 },
    azureCostSplit: { storage: 90, cdn: 72, api: 42, downloads: 24 },
    costTrend: [920, 950, 970, 990, 1010, 1050, 1070, 1090, 1110, 1120, 1140, 1847],
    costTrendPreviousYear: [800, 820, 830, 850, 860, 880, 890, 910, 895, 920, 915, 930],
    storageTrend: [380, 395, 410, 420, 430, 440, 450, 455, 462, 470, 475, 480],
    forecast: {
      storage: '515 GB',
      downloads: '255,000',
      bandwidth: '2.6 TB',
      invoice: '$1,847',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '50%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Customer is generating a loss due to high Azure costs.' },
      { id: 2, type: 'critical', msg: 'Storage usage has reached 1200% of current limits.' }
    ]
  },
  {
    id: 'starlight',
    name: 'Starlight Entertainment',
    planName: 'Store Plan (70 Stores)',
    monthlyFee: 2100,
    stores: 70,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 813,
    overages: 7731,
    quotaScore: 22,
    usageDetails: {
      storage: { current: 2850, limit: 140, unit: 'GB' },
      downloads: { current: 1450000, limit: 350000, unit: '' },
      bandwidth: { current: 14.2, limit: 0.7, unit: 'TB' },
      apiRequests: { current: 28.2, limit: 3.5, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '140 GB', current: '2850 GB', remaining: '0 GB', overage: '2710 GB', cost: 5420 },
      { service: 'CDN Bandwidth', included: '0.7 TB', current: '14.2 TB', remaining: '0 TB', overage: '13.5 TB', cost: 1350 },
      { service: 'API Requests', included: '3.5 M', current: '28.2 M', remaining: '0 M', overage: '24.7 M', cost: 741 },
      { service: 'Downloads', included: '350k', current: '1.45M', remaining: '0k', overage: '1100k', cost: 220 }
    ],
    moduleCostSplit: { dam: 1100, downloads: 900, api: 300 },
    azureCostSplit: { storage: 315, cdn: 252, api: 147, downloads: 84 },
    costTrend: [2600, 2700, 2750, 2800, 2900, 2950, 3000, 3050, 3020, 3080, 3120, 9831],
    costTrendPreviousYear: [2100, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2480, 2550, 2580, 2600],
    storageTrend: [2100, 2150, 2200, 2300, 2400, 2480, 2550, 2600, 2680, 2750, 2800, 2850],
    forecast: {
      storage: '3,050 GB',
      downloads: '1,520,000',
      bandwidth: '15.1 TB',
      invoice: '$9,831',
      daysUntilExhaustion: '0 Days',
      planUpgradeDiscount: '55%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Customer is generating a loss due to high Azure costs relative to subscription fee.' },
      { id: 2, type: 'critical', msg: 'Storage usage has reached 2035% of current limits.' }
    ]
  }
];

function SvgLineChart({ data, labels, height = 180, strokeColor = '#2563eb', fullWidth = false }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data) * 1.15 || 100;
  const minVal = 0;
  const paddingLeft = 75;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 1000;

  const points = data.map((val, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val, label: labels[index] };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const fillD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`
    : '';

  const gradId = `gradient-${strokeColor.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%', height: fullWidth ? 'auto' : '100%' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid Lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = paddingTop + ratio * chartHeight;
        const val = Math.round(maxVal - ratio * maxVal);
        return (
          <g key={i}>
            <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} className="chart-grid-line" stroke="#f1f5f9" strokeWidth="1" />
            <text x={paddingLeft - 8} y={y + 4} className="chart-axis-text" textAnchor="end" style={{ fill: '#94a3b8', fontSize: '10px' }}>${val.toLocaleString()}</text>
          </g>
        );
      })}

      {/* Axis line */}
      <line x1={paddingLeft} y1={height - paddingBottom} x2={chartWidth - paddingRight} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth="1" />

      {/* Area Fill */}
      {fillD && <path d={fillD} fill={`url(#${gradId})`} />}

      {/* Line Curve */}
      {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

      {/* Dots and Labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth="2"
            className="chart-dot"
          />
          <text x={p.x} y={height - 8} className="chart-axis-text" textAnchor="middle" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 500 }}>
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function SvgDonutChart({ data, colors }) {
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);
  const r = 38;
  const circ = 2 * Math.PI * r; // ~238.76

  let accumulatedPercent = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r={r} fill="transparent" stroke="#f1f5f9" strokeWidth="11" />
          {data.map((item, index) => {
            const percentage = item.value / total;
            const strokeLength = percentage * circ;
            const strokeOffset = circ - strokeLength + (accumulatedPercent * circ);
            accumulatedPercent += percentage;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke={colors[index] || '#cbd5e1'}
                strokeWidth="11"
                strokeDasharray={circ}
                strokeDashoffset={strokeOffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>
            {total >= 1000 ? `$${(total / 1000).toFixed(1)}k` : `$${total}`}
          </span>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Total</span>
        </div>
      </div>
      <div className="donut-legend" style={{ gridTemplateColumns: '1fr', marginTop: '16px' }}>
        {data.map((item, index) => (
          <div key={index} className="legend-item" style={{ justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="legend-color" style={{ backgroundColor: colors[index], width: '10px', height: '10px' }} />
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#334155' }}>{item.name}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>
              ${item.value.toLocaleString()} <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>({Math.round((item.value / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SvgBarChart({ data, height = 180, colors = ['#2563eb'], isHorizontal = false, suffix = '' }) {
  if (!data || data.length === 0) return null;
  const values = data.map(d => d.value);
  const maxVal = Math.max(...values) * 1.15 || 100;
  const paddingLeft = isHorizontal ? 150 : 55;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = isHorizontal ? 20 : 40;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 1000;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      {isHorizontal ? (
        <>
          {data.map((item, index) => {
            const barWidth = ((item.value) / maxVal) * (chartWidth - paddingLeft - paddingRight);
            const barHeight = Math.min(24, (chartHeight / data.length) * 0.6);
            const y = paddingTop + index * (chartHeight / data.length) + (chartHeight / data.length - barHeight) / 2;
            const barColor = colors[index % colors.length] || colors[0];

            return (
              <g key={index}>
                <text x={paddingLeft - 10} y={y + barHeight / 2 + 4} textAnchor="end" style={{ fill: '#334155', fontSize: '10px', fontWeight: 600 }}>
                  {item.name}
                </text>
                <rect x={paddingLeft} y={y} width={chartWidth - paddingLeft - paddingRight} height={barHeight} rx={barHeight / 2} fill="#f1f5f9" />
                <rect x={paddingLeft} y={y} width={Math.max(barHeight, barWidth)} height={barHeight} rx={barHeight / 2} fill={barColor} />
                <text x={paddingLeft + barWidth + 8} y={y + barHeight / 2 + 4} style={{ fill: '#0f172a', fontSize: '10px', fontWeight: 700 }}>
                  {item.value.toLocaleString()}{suffix}
                </text>
              </g>
            );
          })}
          <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" />
        </>
      ) : (
        <>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + ratio * chartHeight;
            const val = Math.round(maxVal - ratio * maxVal);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={paddingLeft - 8} y={y + 4} textAnchor="end" style={{ fill: '#94a3b8', fontSize: '10px' }}>{val}</text>
              </g>
            );
          })}
          {data.map((item, index) => {
            const barHeight = (item.value / maxVal) * chartHeight;
            const barWidth = Math.min(32, (chartWidth - paddingLeft - paddingRight) / data.length * 0.5);
            const x = paddingLeft + index * ((chartWidth - paddingLeft - paddingRight) / data.length) + ((chartWidth - paddingLeft - paddingRight) / data.length - barWidth) / 2;
            const y = height - paddingBottom - barHeight;
            const barColor = colors[index % colors.length] || colors[0];

            return (
              <g key={index}>
                <rect x={x} y={y} width={barWidth} height={Math.max(4, barHeight)} rx={4} fill={barColor} />
                <text x={x + barWidth / 2} y={height - paddingBottom + 18} textAnchor="middle" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 600 }}>
                  {item.name}
                </text>
                <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" style={{ fill: '#0f172a', fontSize: '10px', fontWeight: 700 }}>
                  {item.value.toLocaleString()}{suffix}
                </text>
              </g>
            );
          })}
          <line x1={paddingLeft} y1={height - paddingBottom} x2={chartWidth - paddingRight} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
}

function SvgComparisonBarChart({ data, height = 220 }) {
  if (!data || data.length === 0) return null;

  const paddingLeft = 150;
  const paddingRight = 200;
  const paddingTop = 15;
  const paddingBottom = 35;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 800; // Also widen this to 800!

  const rowHeight = chartHeight / data.length;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      {data.map((item, index) => {
        const y = paddingTop + index * rowHeight;
        const maxVal = Math.max(item.limit, item.current) * 1.1;
        const limitWidth = (item.limit / maxVal) * (chartWidth - paddingLeft - paddingRight);
        const currentWidth = (item.current / maxVal) * (chartWidth - paddingLeft - paddingRight);

        const isExceeded = item.current > item.limit;
        const barColor = isExceeded ? '#f43f5e' : '#10b981';

        return (
          <g key={index}>
            <text x={paddingLeft - 10} y={y + rowHeight / 2 - 2} textAnchor="end" style={{ fill: '#334155', fontSize: '14px', fontWeight: 700 }}>
              {item.name}
            </text>

            {/* Allowance Bar (Grey) */}
            <rect x={paddingLeft} y={y + 2} width={limitWidth} height={8} rx={4} fill="#e2e8f0" />

            {/* Consumption Bar */}
            <rect x={paddingLeft} y={y + 12} width={currentWidth} height={8} rx={4} fill={barColor} />

            {/* Legend info or current usage text */}
            <text x={paddingLeft + Math.max(limitWidth, currentWidth) + 10} y={y + rowHeight / 2 + 2} style={{ fill: isExceeded ? '#f43f5e' : '#0f172a', fontSize: '14px', fontWeight: 700 }}>
              {item.current.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(${paddingLeft}, ${height - 10})`}>
        <rect x="0" y="-8" width="12" height="6" rx="3" fill="#e2e8f0" />
        <text x="16" y="-2" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 600 }}>Allowance</text>

        <rect x="120" y="-8" width="12" height="6" rx="3" fill="#10b981" />
        <text x="136" y="-2" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 600 }}>Within Limit</text>

        <rect x="250" y="-8" width="12" height="6" rx="3" fill="#f43f5e" />
        <text x="266" y="-2" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 600 }}>Exceeded</text>
      </g>
    </svg>
  );
}

function SvgPredictiveChart({ historical, projected, limit, limitLabel, height = 200, strokeColor = '#2563eb', unit = 'GB' }) {
  const allData = [...historical, ...projected.slice(1)];
  const maxVal = Math.max(...allData, limit) * 1.15;
  const minVal = 0;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 35;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 1000;

  const histPoints = historical.map((val, index) => {
    const x = paddingLeft + (index / (allData.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val };
  });

  const projPoints = projected.map((val, index) => {
    const overallIndex = historical.length - 1 + index;
    const x = paddingLeft + (overallIndex / (allData.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val };
  });

  const histPathD = histPoints.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const projPathD = projPoints.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  const limitY = height - paddingBottom - ((limit - minVal) / (maxVal - minVal)) * chartHeight;

  let intersectionPoint = null;
  for (let i = 0; i < projPoints.length; i++) {
    if (projPoints[i].val >= limit) {
      intersectionPoint = projPoints[i];
      break;
    }
  }

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      <defs>
        <linearGradient id={`grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = paddingTop + ratio * chartHeight;
        const val = Math.round(maxVal - ratio * maxVal);
        return (
          <g key={i}>
            <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
            <text x={paddingLeft - 8} y={y + 4} className="chart-axis-text" textAnchor="end" style={{ fill: '#94a3b8', fontSize: '10px' }}>{val}</text>
          </g>
        );
      })}

      <line x1={paddingLeft} y1={limitY} x2={chartWidth - paddingRight} y2={limitY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="5 3" />
      <text x={chartWidth - paddingRight - 5} y={limitY - 8} textAnchor="end" style={{ fill: '#f43f5e', fontSize: '10px', fontWeight: 700 }}>
        LIMIT: {limit} {unit}
      </text>

      {histPoints.length > 0 && (
        <path
          d={`${histPathD} L ${histPoints[histPoints.length - 1].x} ${height - paddingBottom} L ${histPoints[0].x} ${height - paddingBottom} Z`}
          fill={`url(#grad-${strokeColor.replace('#', '')})`}
        />
      )}

      {projPoints.length > 0 && (
        <path
          d={`${projPathD} L ${projPoints[projPoints.length - 1].x} ${height - paddingBottom} L ${projPoints[0].x} ${height - paddingBottom} Z`}
          fill={`url(#grad-${strokeColor.replace('#', '')})`}
          opacity="0.08"
        />
      )}

      <path d={histPathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
      <path d={projPathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" />

      {intersectionPoint && (
        <g>
          <circle cx={intersectionPoint.x} cy={intersectionPoint.y} r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          <line x1={intersectionPoint.x} y1={intersectionPoint.y} x2={intersectionPoint.x} y2={height - paddingBottom} stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" />
          <rect x={intersectionPoint.x - 70} y={intersectionPoint.y - 36} width="140" height="28" rx="4" fill="#0f172a" />
          <text x={intersectionPoint.x} y={intersectionPoint.y - 18} textAnchor="middle" style={{ fill: '#ffffff', fontSize: '10px', fontWeight: 700 }}>
            Exhaustion Day
          </text>
        </g>
      )}

      <text x={paddingLeft + ((historical.length - 1) / (allData.length - 1)) * (chartWidth - paddingLeft - paddingRight)} y={height - 8} textAnchor="middle" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 700 }}>
        Today
      </text>
      <text x={paddingLeft} y={height - 8} textAnchor="middle" style={{ fill: '#94a3b8', fontSize: '10px' }}>
        12M Ago
      </text>
      <text x={chartWidth - paddingRight} y={height - 8} textAnchor="middle" style={{ fill: '#94a3b8', fontSize: '10px' }}>
        +30D Forecast
      </text>

      <g transform={`translate(${paddingLeft + 10}, 10)`}>
        <line x1="0" y1="5" x2="20" y2="5" stroke={strokeColor} strokeWidth="2" />
        <text x="25" y="9" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 600 }}>Historical</text>
        <line x1="120" y1="5" x2="140" y2="5" stroke={strokeColor} strokeWidth="2" strokeDasharray="3 3" />
        <text x="145" y="9" style={{ fill: '#64748b', fontSize: '10px', fontWeight: 600 }}>Projected</text>
      </g>
    </svg>
  );
}

function SvgSavingsChart({ currentPlanCost, upgradePlanCost, months = 6, height = 200 }) {
  const currentTrend = [];
  const upgradeTrend = [];
  let currentSum = 0;
  let upgradeSum = 0;

  for (let i = 1; i <= months; i++) {
    currentSum += currentPlanCost;
    upgradeSum += upgradePlanCost;
    currentTrend.push(currentSum);
    upgradeTrend.push(upgradeSum);
  }

  const maxVal = Math.max(...currentTrend) * 1.1;
  const paddingLeft = 55;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 800;

  const currentPoints = currentTrend.map((val, index) => {
    const x = paddingLeft + (index / (months - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - (val / maxVal) * chartHeight;
    return { x, y, val };
  });

  const upgradePoints = upgradeTrend.map((val, index) => {
    const x = paddingLeft + (index / (months - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - (val / maxVal) * chartHeight;
    return { x, y, val };
  });

  const currentPath = currentPoints.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const upgradePath = upgradePoints.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  const savings = currentSum - upgradeSum;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = paddingTop + ratio * chartHeight;
        const val = Math.round(maxVal - ratio * maxVal);
        return (
          <g key={i}>
            <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={paddingLeft - 8} y={y + 5} textAnchor="end" style={{ fill: '#94a3b8', fontSize: '14px' }}>${val}</text>
          </g>
        );
      })}

      <path d={currentPath} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
      <path d={upgradePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

      {currentPoints.map((p, i) => (
        <circle key={`c-${i}`} cx={p.x} cy={p.y} r="3" fill="#f43f5e" />
      ))}
      {upgradePoints.map((p, i) => (
        <circle key={`u-${i}`} cx={p.x} cy={p.y} r="3" fill="#10b981" />
      ))}

      <path
        d={`${currentPath} L ${upgradePoints[upgradePoints.length - 1].x} ${upgradePoints[upgradePoints.length - 1].y} ${[...upgradePoints].reverse().map(p => `L ${p.x} ${p.y}`).join(' ')} Z`}
        fill="#10b981"
        opacity="0.08"
      />

      <g transform={`translate(${chartWidth - paddingRight - 150}, ${paddingTop + 5})`}>
        <rect width="140" height="40" rx="6" fill="#0f172a" />
        <text x="70" y="15" textAnchor="middle" style={{ fill: '#94a3b8', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>6-Month Savings</text>
        <text x="70" y="32" textAnchor="middle" style={{ fill: '#10b981', fontSize: '15px', fontWeight: 800 }}>${savings.toLocaleString()}</text>
      </g>

      {Array.from({ length: months }).map((_, i) => {
        const d = new Date(2026, 5 + i, 1);
        const label = d.toLocaleString('default', { month: 'short' });
        return (
          <text key={i} x={paddingLeft + (i / (months - 1)) * (chartWidth - paddingLeft - paddingRight)} y={height - 8} textAnchor="middle" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 500 }}>
            {label}
          </text>
        );
      })}

      <g transform={`translate(${paddingLeft + 10}, 10)`}>
        <line x1="0" y1="5" x2="20" y2="5" stroke="#f43f5e" strokeWidth="2.5" />
        <text x="25" y="9" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 600 }}>Current (with Overages)</text>
        <line x1="220" y1="5" x2="240" y2="5" stroke="#10b981" strokeWidth="2.5" />
        <text x="245" y="9" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 600 }}>Upgraded Plan</text>
      </g>
    </svg>
  );
}

function SvgProfitMarginChart({ data, height = 240 }) {
  if (!data || data.length === 0) return null;

  const margins = data.map(d => d.margin);
  const maxMargin = Math.max(...margins, 10);
  const minMargin = Math.min(...margins, -10);

  const paddingLeft = 160;
  const paddingRight = 45;
  const paddingTop = 15;
  const paddingBottom = 15;

  const chartWidth = 800;
  const chartHeight = height - paddingTop - paddingBottom;
  const plotWidth = chartWidth - paddingLeft - paddingRight;

  const range = maxMargin - minMargin;
  const zeroRatio = minMargin < 0 ? (-minMargin / range) : 0;
  const zeroX = paddingLeft + zeroRatio * plotWidth;

  const rowHeight = chartHeight / data.length;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      <line x1={zeroX} y1={paddingTop} x2={zeroX} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />

      {data.map((item, index) => {
        const y = paddingTop + index * rowHeight;
        const barHeight = Math.min(18, rowHeight * 0.6);
        const barY = y + (rowHeight - barHeight) / 2;

        const barWidth = (Math.abs(item.margin) / range) * plotWidth;

        const isNegative = item.margin < 0;
        const barX = isNegative ? (zeroX - barWidth) : zeroX;
        const barColor = isNegative ? '#f43f5e' : '#10b981';

        return (
          <g key={index}>
            <text x={paddingLeft - 15} y={y + rowHeight / 2 + 5} textAnchor="end" style={{ fill: '#334155', fontSize: '14px', fontWeight: 700 }}>
              {item.name}
            </text>

            <rect x={paddingLeft} y={barY} width={plotWidth} height={barHeight} rx={barHeight / 2} fill="#f8fafc" opacity="0.5" stroke="#e2e8f0" strokeWidth="0.5" />
            <rect x={barX} y={barY} width={barWidth} height={barHeight} rx={barHeight / 2} fill={barColor} />

            <text
              x={isNegative ? (zeroX + 8) : (barX + barWidth + 8)}
              y={y + rowHeight / 2 + 5}
              textAnchor="start"
              style={{ fill: barColor, fontSize: '14px', fontWeight: 800 }}
            >
              {item.margin.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SvgDualLineChart({ line1, line2, labels, line1Label, line2Label, line1Color = '#2563eb', line2Color = '#e91e63', height = 220 }) {
  if (!line1 || line1.length === 0) return null;

  const max1 = Math.max(...line1) * 1.15 || 100;
  const max2 = Math.max(...line2) * 1.15 || 100;

  const paddingLeft = 45;
  const paddingRight = 45;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 800;

  const points1 = line1.map((val, index) => {
    const x = paddingLeft + (index / (line1.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - (val / max1) * chartHeight;
    return { x, y, val };
  });

  const points2 = line2.map((val, index) => {
    const x = paddingLeft + (index / (line2.length - 1)) * (chartWidth - paddingLeft - paddingRight);
    const y = height - paddingBottom - (val / max2) * chartHeight;
    return { x, y, val };
  });

  const path1 = points1.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  const path2 = points2.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = paddingTop + ratio * chartHeight;
        const val1 = Math.round(max1 - ratio * max1);
        const val2 = Math.round(max2 - ratio * max2);
        return (
          <g key={i}>
            <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={paddingLeft - 8} y={y + 5} textAnchor="end" style={{ fill: line1Color, fontSize: '14px', fontWeight: 600 }}>{val1}</text>
            <text x={chartWidth - paddingRight + 8} y={y + 5} textAnchor="start" style={{ fill: line2Color, fontSize: '14px', fontWeight: 600 }}>{val2}</text>
          </g>
        );
      })}

      <path d={path1} fill="none" stroke={line1Color} strokeWidth="2" strokeLinecap="round" />
      <path d={path2} fill="none" stroke={line2Color} strokeWidth="2" strokeLinecap="round" />

      {points1.map((p, i) => (
        <circle key={`l1-${i}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke={line1Color} strokeWidth="1.5" />
      ))}
      {points2.map((p, i) => (
        <circle key={`l2-${i}`} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke={line2Color} strokeWidth="1.5" />
      ))}

      {points1.map((p, i) => (
        <text key={`lbl-${i}`} x={p.x} y={height - 8} textAnchor="middle" style={{ fill: '#64748b', fontSize: '14px', fontWeight: 500 }}>
          {labels[i]}
        </text>
      ))}

      <g transform={`translate(${paddingLeft}, 10)`}>
        <circle cx="6" cy="7" r="5" fill={line1Color} />
        <text x="16" y="12" style={{ fill: '#334155', fontSize: '14px', fontWeight: 700 }}>{line1Label}</text>

        <circle cx="180" cy="7" r="5" fill={line2Color} />
        <text x="190" y="12" style={{ fill: '#334155', fontSize: '14px', fontWeight: 700 }}>{line2Label}</text>
      </g>
    </svg>
  );
}

function SvgDualBarChart({ line1, line2, labels, line1Label, line2Label, line1Color = '#2563eb', line2Color = '#e91e63', height = 220, fontSize = 11 }) {
  if (!line1 || line1.length === 0) return null;

  const max1 = Math.max(...line1) * 1.15 || 100;
  const max2 = Math.max(...line2) * 1.15 || 100;

  const paddingLeft = 65;
  const paddingRight = 65;
  const paddingTop = 25;
  const paddingBottom = 30;

  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 800;

  const colWidth = (chartWidth - paddingLeft - paddingRight) / line1.length;
  const barWidth = 14;
  const gap = 4;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%' }}>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = paddingTop + ratio * chartHeight;
        const val1 = Math.round(max1 - ratio * max1);
        const val2 = Math.round(max2 - ratio * max2);
        return (
          <g key={i}>
            <line x1={paddingLeft} y1={y} x2={chartWidth - paddingRight} y2={y} stroke="#f1f5f9" strokeWidth="1" />
            <text x={paddingLeft - 8} y={y + 5} textAnchor="end" style={{ fill: line1Color, fontSize: `${fontSize}px`, fontWeight: 600 }}>{'$' + val1.toLocaleString()}</text>
            <text x={chartWidth - paddingRight + 8} y={y + 5} textAnchor="start" style={{ fill: line2Color, fontSize: `${fontSize}px`, fontWeight: 600 }}>{'$' + val2.toLocaleString()}</text>
          </g>
        );
      })}

      {/* Bars */}
      {line1.map((val1, index) => {
        const val2 = line2[index];
        const xCenter = paddingLeft + index * colWidth + colWidth / 2;

        const bar1Height = (val1 / max1) * chartHeight;
        const bar2Height = (val2 / max2) * chartHeight;

        const x1 = xCenter - barWidth - gap / 2;
        const x2 = xCenter + gap / 2;

        const y1 = height - paddingBottom - bar1Height;
        const y2 = height - paddingBottom - bar2Height;

        return (
          <g key={index}>
            {/* Bar 1 */}
            <rect
              x={x1}
              y={y1}
              width={barWidth}
              height={Math.max(3, bar1Height)}
              rx="3"
              fill={line1Color}
            />
            {/* Bar 2 */}
            <rect
              x={x2}
              y={y2}
              width={barWidth}
              height={Math.max(3, bar2Height)}
              rx="3"
              fill={line2Color}
            />
            {/* X Axis Label */}
            <text
              x={xCenter}
              y={height - 8}
              textAnchor="middle"
              style={{ fill: '#64748b', fontSize: `${fontSize}px`, fontWeight: 500 }}
            >
              {labels[index]}
            </text>
          </g>
        );
      })}

      <line x1={paddingLeft} y1={height - paddingBottom} x2={chartWidth - paddingRight} y2={height - paddingBottom} stroke="#cbd5e1" strokeWidth="1.5" />

      {/* Legend */}
      <g transform={`translate(${paddingLeft}, 10)`}>
        <rect x="0" y="2" width="12" height="10" rx="2" fill={line1Color} />
        <text x="18" y="11" style={{ fill: '#334155', fontSize: `${fontSize}px`, fontWeight: 700 }}>{line1Label}</text>

        <rect x="180" y="2" width="12" height="10" rx="2" fill={line2Color} />
        <text x="198" y="11" style={{ fill: '#334155', fontSize: `${fontSize}px`, fontWeight: 700 }}>{line2Label}</text>
      </g>
    </svg>
  );
}

function SvgGaugeChart({ healthy, warning, critical, loss, height = 185 }) {
  const total = healthy + warning + critical + loss;
  if (total === 0) return null;

  const healthyPct = healthy / total;
  const warningPct = warning / total;
  const criticalPct = critical / total;
  const lossPct = loss / total;

  const r = 65;
  const circ = Math.PI * r; // ~204.2

  const strokeWidth = 16;

  const healthyLen = healthyPct * circ;
  const warningLen = warningPct * circ;
  const criticalLen = criticalPct * circ;
  const lossLen = lossPct * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{ position: 'relative', width: '220px', height: '130px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <svg width="220" height="120" viewBox="0 0 150 85">
          <path d="M 10 75 A 65 65 0 0 1 140 75" fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" />

          <path
            d="M 10 75 A 65 65 0 0 1 140 75"
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${healthyLen} 300`}
            strokeDashoffset="0"
            strokeLinecap="round"
          />
          <path
            d="M 10 75 A 65 65 0 0 1 140 75"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${warningLen} 300`}
            strokeDashoffset={`-${healthyLen}`}
            strokeLinecap={warningLen > 0 ? "round" : "butt"}
          />
          <path
            d="M 10 75 A 65 65 0 0 1 140 75"
            fill="none"
            stroke="#f43f5e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${criticalLen} 300`}
            strokeDashoffset={`-${healthyLen + warningLen}`}
            strokeLinecap={criticalLen > 0 ? "round" : "butt"}
          />
          <path
            d="M 10 75 A 65 65 0 0 1 140 75"
            fill="none"
            stroke="#be123c"
            strokeWidth={strokeWidth}
            strokeDasharray={`${lossLen} 300`}
            strokeDashoffset={`-${healthyLen + warningLen + criticalLen}`}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: 'absolute', bottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b' }}>{total}</span>
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Total Tenants</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', marginTop: '16px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Healthy</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{healthy}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Warning</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{warning}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f43f5e' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Critical</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{critical}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#be123c' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Loss-Making</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{loss}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('client'); // 'client' or 'admin'
  const [clientActiveSection, setClientActiveSection] = useState('billing'); // 'billing', 'forecast', 'infrastructure'
  const [adminActiveSection, setAdminActiveSection] = useState('profitability'); // 'profitability', 'invoices'
  const [customers, setCustomers] = useState(() => {
    return INITIAL_CUSTOMERS.map(c => {
      const storageUsedPct = (c.usageDetails.storage.current / c.usageDetails.storage.limit) * 100;
      const downloadsUsedPct = (c.usageDetails.downloads.current / c.usageDetails.downloads.limit) * 100;
      const bandwidthUsedPct = (c.usageDetails.bandwidth.current / c.usageDetails.bandwidth.limit) * 100;
      const maxUsedPct = Math.max(storageUsedPct, downloadsUsedPct, bandwidthUsedPct);
      const usagePercent = Math.round((storageUsedPct + downloadsUsedPct + bandwidthUsedPct) / 3);

      const profit = (c.monthlyFee + c.overages) - c.azureCost;
      const margin = (profit / (c.monthlyFee + c.overages)) * 100;

      let status = 'healthy';
      if (margin < 0) {
        status = 'loss';
      } else if (maxUsedPct >= 90) {
        status = 'critical';
      } else if (maxUsedPct >= 80) {
        status = 'warning';
      }

      return {
        ...c,
        status,
        usagePercent
      };
    });
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState('acme');
  const [drawerCustomerId, setDrawerCustomerId] = useState(null);

  // Company Registration & Cost Calculator State
  const [regStores, setRegStores] = useState(10);
  const [regStorageUpgrade, setRegStorageUpgrade] = useState(0); // extra GB
  const [regBandwidthUpgrade, setRegBandwidthUpgrade] = useState(0); // extra GB
  const [regApiUpgrade, setRegApiUpgrade] = useState(0); // extra API calls
  const [regDownloadsUpgrade, setRegDownloadsUpgrade] = useState(0); // extra downloads

  const openUpgradeModal = () => {
    const activeCust = customers.find(c => c.id === selectedCustomerId) || customers[0];
    if (!activeCust) return;

    const sCount = activeCust.stores || 10;

    setRegStores(sCount);
    setRegStorageUpgrade(0);
    setRegBandwidthUpgrade(0);
    setRegApiUpgrade(0);
    setRegDownloadsUpgrade(0);

    setUpgradeModalOpen(true);
  };

  const handleUpgradePlan = (e) => {
    if (e) e.preventDefault();

    const activeCust = customers.find(c => c.id === selectedCustomerId) || customers[0];
    if (!activeCust) return;

    const storesCount = parseInt(regStores) || 1;

    // Price calculations
    const basePrice = storesCount * 30;
    const storageCost = regStorageUpgrade * 2;
    const bandwidthCost = regBandwidthUpgrade * 0.1;
    const apiCost = (regApiUpgrade / 100000) * 3;
    const downloadsCost = (regDownloadsUpgrade / 10000) * 2;
    const totalMonthlyFee = Math.round(basePrice + storageCost + bandwidthCost + apiCost + downloadsCost);

    // Dynamic limits
    const storageLimit = (storesCount * 2) + regStorageUpgrade;
    const bandwidthLimit = (storesCount * 10) + regBandwidthUpgrade;
    const apiLimit = (storesCount * 50000) + regApiUpgrade;
    const downloadsLimit = (storesCount * 5000) + regDownloadsUpgrade;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const updatedStorage = {
          ...c.usageDetails.storage,
          limit: storageLimit
        };
        const updatedDownloads = {
          ...c.usageDetails.downloads,
          limit: downloadsLimit
        };
        const updatedBandwidth = {
          ...c.usageDetails.bandwidth,
          limit: Math.round((bandwidthLimit / 1000) * 100) / 100
        };
        const updatedPublishedAssets = {
          ...c.usageDetails.publishedAssets,
          limit: storesCount * 500
        };
        const updatedApiRequests = {
          ...c.usageDetails.apiRequests,
          limit: Math.round((apiLimit / 1000000) * 10) / 10
        };

        // Recalculate overages
        let storageOverageCost = 0;
        let storageOverageQty = 0;
        if (c.usageDetails.storage.current > storageLimit) {
          storageOverageQty = c.usageDetails.storage.current - storageLimit;
          storageOverageCost = Math.round(storageOverageQty * 2);
        }

        let bandwidthOverageCost = 0;
        let bandwidthOverageQty = 0;
        const currentBandwidthGB = c.usageDetails.bandwidth.current * 1000;
        if (currentBandwidthGB > bandwidthLimit) {
          bandwidthOverageQty = currentBandwidthGB - bandwidthLimit;
          bandwidthOverageCost = Math.round(bandwidthOverageQty * 0.1);
        }

        let apiOverageCost = 0;
        let apiOverageQty = 0;
        const currentApiRequests = c.usageDetails.apiRequests.current * 1000000;
        if (currentApiRequests > apiLimit) {
          apiOverageQty = currentApiRequests - apiLimit;
          apiOverageCost = Math.round((apiOverageQty / 100000) * 3);
        }

        let downloadsOverageCost = 0;
        let downloadsOverageQty = 0;
        if (c.usageDetails.downloads.current > downloadsLimit) {
          downloadsOverageQty = c.usageDetails.downloads.current - downloadsLimit;
          downloadsOverageCost = Math.round((downloadsOverageQty / 10000) * 2);
        }

        const totalOverages = storageOverageCost + bandwidthOverageCost + apiOverageCost + downloadsOverageCost;

        // Build updated breakdown
        const updatedBreakdown = c.breakdown.map(item => {
          if (item.service === 'Blob Storage') {
            return {
              ...item,
              included: `${Math.round(storageLimit)} GB`,
              remaining: `${Math.max(0, Math.round(storageLimit - c.usageDetails.storage.current))} GB`,
              overage: `${Math.round(storageOverageQty)} GB`,
              cost: storageOverageCost
            };
          }
          if (item.service === 'CDN Bandwidth') {
            return {
              ...item,
              included: `${Math.round((bandwidthLimit / 1000) * 100) / 100} TB`,
              remaining: `${Math.max(0, Math.round(((bandwidthLimit - currentBandwidthGB) / 1000) * 100) / 100)} TB`,
              overage: `${Math.round((bandwidthOverageQty / 1000) * 100) / 100} TB`,
              cost: bandwidthOverageCost
            };
          }
          if (item.service === 'API Requests') {
            return {
              ...item,
              included: `${Math.round((apiLimit / 1000000) * 10) / 10} M`,
              remaining: `${Math.max(0, Math.round(((apiLimit - currentApiRequests) / 1000000) * 10) / 10)} M`,
              overage: `${Math.max(0, Math.round((apiOverageQty / 1000000) * 10) / 10)} M`,
              cost: apiOverageCost
            };
          }
          if (item.service === 'Downloads') {
            return {
              ...item,
              included: `${Math.round(downloadsLimit / 1000)}k`,
              remaining: `${Math.max(0, Math.round((downloadsLimit - c.usageDetails.downloads.current) / 1000))}k`,
              overage: `${Math.round(downloadsOverageQty / 1000)}k`,
              cost: downloadsOverageCost
            };
          }
          return item;
        });

        // Recalculate quota score
        const sPct = (c.usageDetails.storage.current / storageLimit) * 100;
        const dPct = (c.usageDetails.downloads.current / downloadsLimit) * 100;
        const bPct = (currentBandwidthGB / bandwidthLimit) * 100;
        const maxUsedPct = Math.max(sPct, dPct, bPct);
        const quotaScore = Math.max(0, Math.round(100 - maxUsedPct * 0.25));

        // Build updated alerts
        const updatedAlerts = [];
        if (storageOverageQty > 0) {
          updatedAlerts.push({ id: 1, type: 'critical', msg: `Storage usage has exceeded allocated limit by ${Math.round(storageOverageQty)} GB.` });
        }
        if (downloadsOverageQty > 0) {
          updatedAlerts.push({ id: 2, type: 'critical', msg: `Downloads usage has exceeded allocated limit by ${Math.round(downloadsOverageQty)}.` });
        }
        if (bandwidthOverageQty > 0) {
          updatedAlerts.push({ id: 3, type: 'warning', msg: `Bandwidth usage has exceeded allocated limit by ${Math.round(bandwidthOverageQty)} GB.` });
        }
        if (updatedAlerts.length === 0) {
          updatedAlerts.push({ id: 1, type: 'healthy', msg: 'All metrics are performing inside optimal quota boundaries.' });
        }

        return {
          ...c,
          planName: `Store Plan (${storesCount} Stores${(regStorageUpgrade > 0 || regBandwidthUpgrade > 0 || regApiUpgrade > 0 || regDownloadsUpgrade > 0) ? ' + Upgrades' : ''})`,
          monthlyFee: totalMonthlyFee,
          overages: totalOverages,
          quotaScore,
          stores: storesCount,
          usageDetails: {
            storage: updatedStorage,
            downloads: updatedDownloads,
            bandwidth: updatedBandwidth,
            apiRequests: updatedApiRequests
          },
          breakdown: updatedBreakdown,
          alerts: updatedAlerts,
          azureCost: Math.round(totalMonthlyFee * 0.38 + 15),
          moduleCostSplit: {
            dam: Math.round(totalMonthlyFee * 0.35),
            downloads: Math.round(totalMonthlyFee * 0.40),
            api: Math.round(totalMonthlyFee * 0.25)
          },
          azureCostSplit: {
            storage: Math.round(totalMonthlyFee * 0.15),
            cdn: Math.round(totalMonthlyFee * 0.12),
            api: Math.round(totalMonthlyFee * 0.07),
            downloads: Math.round(totalMonthlyFee * 0.04)
          }
        };
      }
      return c;
    }));

    setUpgradeModalOpen(false);
    setToastMsg(`Successfully upgraded plan for ${activeCust.name}! New monthly rate: $${totalMonthlyFee}`);
  };

  // Filters & Page Size
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [invoiceMonthFilter, setInvoiceMonthFilter] = useState('all');
  const [chartYearFilter, setChartYearFilter] = useState('2026');
  const [clientChartYearFilter, setClientChartYearFilter] = useState('thisYear');
  const [invoicePageSize, setInvoicePageSize] = useState(5);
  const [invoiceCurrentPage, setInvoiceCurrentPage] = useState(1);

  const [adminAzureInvoices, setAdminAzureInvoices] = useState([
    // 2026 Invoices
    { id: 'AZ-INV-2026-06', month: 'June 2026', date: 'Jun 01, 2026', azureCost: 8572, clientRevenue: 10320, status: 'Paid', fileName: 'azure_invoice_june_2026.pdf' },
    { id: 'AZ-INV-2026-05', month: 'May 2026', date: 'May 01, 2026', azureCost: 9210, clientRevenue: 10210, status: 'Paid', fileName: 'azure_invoice_may_2026.pdf' },
    { id: 'AZ-INV-2026-04', month: 'April 2026', date: 'Apr 01, 2026', azureCost: 8990, clientRevenue: 9850, status: 'Paid', fileName: 'azure_invoice_apr_2026.pdf' },
    { id: 'AZ-INV-2026-03', month: 'March 2026', date: 'Mar 01, 2026', azureCost: 9120, clientRevenue: 9940, status: 'Paid', fileName: 'azure_invoice_mar_2026.pdf' },
    { id: 'AZ-INV-2026-02', month: 'February 2026', date: 'Feb 01, 2026', azureCost: 8750, clientRevenue: 9680, status: 'Paid', fileName: 'azure_invoice_feb_2026.pdf' },
    { id: 'AZ-INV-2026-01', month: 'January 2026', date: 'Jan 01, 2026', azureCost: 8300, clientRevenue: 9400, status: 'Paid', fileName: 'azure_invoice_jan_2026.pdf' },

    // 2025 Invoices
    { id: 'AZ-INV-2025-12', month: 'December 2025', date: 'Dec 01, 2025', azureCost: 7900, clientRevenue: 9100, status: 'Paid', fileName: 'azure_invoice_dec_2025.pdf' },
    { id: 'AZ-INV-2025-11', month: 'November 2025', date: 'Nov 01, 2025', azureCost: 7800, clientRevenue: 9000, status: 'Paid', fileName: 'azure_invoice_nov_2025.pdf' },
    { id: 'AZ-INV-2025-10', month: 'October 2025', date: 'Oct 01, 2025', azureCost: 7700, clientRevenue: 8900, status: 'Paid', fileName: 'azure_invoice_oct_2025.pdf' },
    { id: 'AZ-INV-2025-09', month: 'September 2025', date: 'Sep 01, 2025', azureCost: 7600, clientRevenue: 8800, status: 'Paid', fileName: 'azure_invoice_sep_2025.pdf' },
    { id: 'AZ-INV-2025-08', month: 'August 2025', date: 'Aug 01, 2025', azureCost: 8100, clientRevenue: 9300, status: 'Paid', fileName: 'azure_invoice_aug_2025.pdf' },
    { id: 'AZ-INV-2025-07', month: 'July 2025', date: 'Jul 01, 2025', azureCost: 8000, clientRevenue: 9200, status: 'Paid', fileName: 'azure_invoice_jul_2025.pdf' },
    { id: 'AZ-INV-2025-06', month: 'June 2025', date: 'Jun 01, 2025', azureCost: 7850, clientRevenue: 9100, status: 'Paid', fileName: 'azure_invoice_june_2025.pdf' },
    { id: 'AZ-INV-2025-05', month: 'May 2025', date: 'May 01, 2025', azureCost: 7700, clientRevenue: 8950, status: 'Paid', fileName: 'azure_invoice_may_2025.pdf' },
    { id: 'AZ-INV-2025-04', month: 'April 2025', date: 'Apr 01, 2025', azureCost: 7600, clientRevenue: 8800, status: 'Paid', fileName: 'azure_invoice_apr_2025.pdf' },
    { id: 'AZ-INV-2025-03', month: 'March 2025', date: 'Mar 01, 2025', azureCost: 7500, clientRevenue: 8700, status: 'Paid', fileName: 'azure_invoice_mar_2025.pdf' },
    { id: 'AZ-INV-2025-02', month: 'February 2025', date: 'Feb 01, 2025', azureCost: 7400, clientRevenue: 8600, status: 'Paid', fileName: 'azure_invoice_feb_2025.pdf' },
    { id: 'AZ-INV-2025-01', month: 'January 2025', date: 'Jan 01, 2025', azureCost: 7300, clientRevenue: 8500, status: 'Paid', fileName: 'azure_invoice_jan_2025.pdf' },
  ]);

  const availableYears = useMemo(() => {
    const years = new Set();
    adminAzureInvoices.forEach(inv => {
      const match = inv.month.match(/\b(20\d{2})\b/);
      if (match) {
        years.add(match[1]);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [adminAzureInvoices]);

  const chartData = useMemo(() => {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearInvoices = adminAzureInvoices.filter(inv => {
      const match = inv.month.match(/\b(20\d{2})\b/);
      return match && match[1] === chartYearFilter;
    });

    const sortedInvoices = [...yearInvoices].sort((a, b) => {
      const aMonth = monthOrder.findIndex(m => a.month.includes(m));
      const bMonth = monthOrder.findIndex(m => b.month.includes(m));
      return aMonth - bMonth;
    });

    const labels = sortedInvoices.map(inv => {
      const match = inv.month.match(/^([A-Za-z]+)/);
      return match ? match[1].substring(0, 3) : inv.month;
    });
    const line1 = sortedInvoices.map(inv => inv.azureCost);
    const line2 = sortedInvoices.map(inv => inv.clientRevenue);

    return { labels, line1, line2 };
  }, [adminAzureInvoices, chartYearFilter]);

  const filteredInvoices = useMemo(() => {
    return invoiceMonthFilter === 'all'
      ? adminAzureInvoices
      : adminAzureInvoices.filter(inv => inv.month === invoiceMonthFilter);
  }, [adminAzureInvoices, invoiceMonthFilter]);

  const paginatedInvoices = useMemo(() => {
    const start = (invoiceCurrentPage - 1) * invoicePageSize;
    return filteredInvoices.slice(start, start + invoicePageSize);
  }, [filteredInvoices, invoiceCurrentPage, invoicePageSize]);

  const totalInvoicePages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredInvoices.length / invoicePageSize));
  }, [filteredInvoices, invoicePageSize]);

  const handleDownloadAzureInvoice = (invoice) => {
    const element = document.createElement("a");
    let file;
    if (invoice.fileUrl) {
      element.href = invoice.fileUrl;
    } else {
      file = new Blob([
        `MICROSOFT AZURE ENTERPRISE INVOICE\n=================================\nInvoice ID: ${invoice.id}\nPeriod: ${invoice.month}\nDate Issued: ${invoice.date}\nDirect Azure Infrastructure Spend: $${invoice.azureCost.toLocaleString()}\nTotal Collected Client Billings: $${invoice.clientRevenue.toLocaleString()}\nNet Profit: $${(invoice.clientRevenue - invoice.azureCost).toLocaleString()} (${((invoice.clientRevenue - invoice.azureCost) / invoice.clientRevenue * 100).toFixed(1)}%)\nStatus: ${invoice.status}\n\nThis is a verified cost auditing report.`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
    }
    element.download = invoice.fileName || `${invoice.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setToastMsg(`Downloaded invoice: ${invoice.fileName || invoice.id}`);
  };

  const handleUploadAzureInvoice = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const nextId = `AZ-INV-2026-${Math.floor(Math.random() * 90 + 10)}`;
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const monthStr = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' (Uploaded)';
    const fileUrl = URL.createObjectURL(file);

    const newInv = {
      id: nextId,
      month: monthStr,
      date: dateStr,
      azureCost: adminKPIs.azureCost,
      clientRevenue: adminKPIs.monthlyRevenue,
      status: 'Paid',
      fileName: file.name,
      fileUrl: fileUrl
    };

    setAdminAzureInvoices(prev => [newInv, ...prev]);
    setInvoiceCurrentPage(1);
    setToastMsg(`Uploaded Azure Invoice: ${file.name}`);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  // Current Selected Customer Object for Client portal
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || customers[0];
  }, [customers, selectedCustomerId]);

  // Drawer Customer Object for admin quota editing
  const drawerCustomer = useMemo(() => {
    if (!drawerCustomerId) return null;
    return customers.find(c => c.id === drawerCustomerId) || null;
  }, [customers, drawerCustomerId]);

  // Dynamic calculations for Admin Overview KPIs
  const adminKPIs = useMemo(() => {
    const totalCustomers = customers.length;
    let totalRevenue = 0; // Subscription Fees + Overage charges
    let totalAzureCost = 0; // Internal infra cost
    let totalOverageRev = 0;

    customers.forEach(c => {
      totalRevenue += (c.monthlyFee + c.overages);
      totalAzureCost += c.azureCost;
      totalOverageRev += c.overages;
    });

    const grossProfit = totalRevenue - totalAzureCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const activeOrgs = customers.length; // all mock are active

    return {
      totalCustomers,
      monthlyRevenue: totalRevenue,
      azureCost: totalAzureCost,
      grossProfit,
      profitMargin,
      overageRevenue: totalOverageRev,
      activeOrgs
    };
  }, [customers]);

  // Sorted & Filtered customers for Admin Table
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.planName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Paginated customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(startIndex, startIndex + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  // Dynamic lists for Admin Usage metrics
  const topConsumers = useMemo(() => {
    return {
      storage: [...customers].sort((a, b) => b.usageDetails.storage.current - a.usageDetails.storage.current).slice(0, 3),
      downloads: [...customers].sort((a, b) => b.usageDetails.downloads.current - a.usageDetails.downloads.current).slice(0, 3),
      bandwidth: [...customers].sort((a, b) => b.usageDetails.bandwidth.current - a.usageDetails.bandwidth.current).slice(0, 3),
      azureCost: [...customers].sort((a, b) => b.azureCost - a.azureCost).slice(0, 3),

      dam: [...customers].sort((a, b) => b.moduleCostSplit.dam - a.moduleCostSplit.dam).slice(0, 3),
    };
  }, [customers]);

  // Aggregate Infrastructure Cost split for admin donut charts
  const adminAzureSplit = useMemo(() => {
    let storage = 0, cdn = 0, api = 0, downloads = 0;
    customers.forEach(c => {
      storage += c.azureCostSplit.storage || 0;
      cdn += c.azureCostSplit.cdn || 0;
      api += c.azureCostSplit.api || 0;
      downloads += c.azureCostSplit.downloads || 0;
    });
    return [
      { name: 'Blob Storage', value: storage },
      { name: 'CDN Bandwidth', value: cdn },
      { name: 'API Calls', value: api },
      { name: 'Downloads', value: downloads }
    ];
  }, [customers]);

  // Aggregate Trends & Status Counts for Admin Charts
  const globalStorageTrend = useMemo(() => {
    const trend = Array(12).fill(0);
    customers.forEach(c => {
      c.storageTrend.forEach((val, idx) => {
        trend[idx] += val;
      });
    });
    return trend;
  }, [customers]);

  const globalCostTrend = useMemo(() => {
    const trend = Array(12).fill(0);
    customers.forEach(c => {
      c.costTrend.forEach((val, idx) => {
        trend[idx] += val;
      });
    });
    return trend;
  }, [customers]);

  const statusCounts = useMemo(() => {
    let healthy = 0, warning = 0, critical = 0, loss = 0;
    customers.forEach(c => {
      if (c.status === 'healthy') healthy++;
      else if (c.status === 'warning') warning++;
      else if (c.status === 'critical') critical++;
      else if (c.status === 'loss') loss++;
    });
    return { healthy, warning, critical, loss };
  }, [customers]);

  // Edit/Modify Quotas inside Drawer
  const handleUpdateQuota = (field, newLimit) => {
    if (!drawerCustomerId) return;
    setCustomers(prev => prev.map(c => {
      if (c.id !== drawerCustomerId) return c;

      // Deep copy usageDetails
      const updatedDetails = { ...c.usageDetails };
      updatedDetails[field] = { ...updatedDetails[field], limit: parseFloat(newLimit) || 1 };

      // Calculate new percentage of usage
      const storageUsedPct = (updatedDetails.storage.current / updatedDetails.storage.limit) * 100;
      const downloadsUsedPct = (updatedDetails.downloads.current / updatedDetails.downloads.limit) * 100;
      const bandwidthUsedPct = (updatedDetails.bandwidth.current / updatedDetails.bandwidth.limit) * 100;

      const maxUsedPct = Math.max(storageUsedPct, downloadsUsedPct, bandwidthUsedPct);

      // Recalculate overage costs based on limits
      // Let's adjust Acme overages dynamically. Let's make a mock recalculation
      let overageSum = 0;
      const updatedBreakdown = c.breakdown.map(item => {
        let overageAmt = '0';
        let cost = 0;

        if (item.service === 'Blob Storage') {
          const limitGb = updatedDetails.storage.limit;
          const currentGb = 1300; // Fixed current for Acme in breakdown
          const overage = Math.max(0, currentGb - limitGb);
          overageAmt = `${overage} GB`;
          cost = Math.round(overage * 0.04);
          overageSum += cost;
          return { ...item, included: `${limitGb} GB`, overage: overageAmt, cost };
        }
        if (item.service === 'CDN Bandwidth') {
          const limitTb = updatedDetails.bandwidth.limit;
          const currentTb = 7; // Fixed current for Acme in breakdown
          const overage = Math.max(0, currentTb - limitTb);
          overageAmt = `${overage} TB`;
          cost = Math.round(overage * 12.5); // Overage charge rate
          overageSum += cost;
          return { ...item, included: `${limitTb} TB`, overage: overageAmt, cost };
        }
        if (item.service === 'API Requests') {
          const limitM = updatedDetails.apiRequests.limit;
          const currentM = 12; // Fixed current for Acme in breakdown
          const overage = Math.max(0, currentM - limitM);
          overageAmt = `${overage.toFixed(1)} M`;
          cost = Math.round(overage * 4); // Overage charge rate
          overageSum += cost;
          return { ...item, included: `${limitM} M`, overage: overageAmt, cost };
        }
        if (item.service === 'Downloads') {
          const limitK = updatedDetails.downloads.limit / 1000;
          const currentK = 450; // Fixed current for Acme in breakdown
          const overage = Math.max(0, currentK - limitK);
          overageAmt = `${Math.round(overage)}k`;
          cost = Math.round((overage / 10) * 2); // Overage charge rate
          overageSum += cost;
          return { ...item, included: `${Math.round(limitK)}k`, overage: overageAmt, cost };
        }
        overageSum += item.cost;
        return item;
      });

      // Update status based on profitability and quota exhaustion
      let newStatus = 'healthy';
      const profit = (c.monthlyFee + overageSum) - c.azureCost;
      const margin = ((profit) / (c.monthlyFee + overageSum)) * 100;

      if (margin < 0) {
        newStatus = 'loss';
      } else if (maxUsedPct >= 90) {
        newStatus = 'critical';
      } else if (maxUsedPct >= 80) {
        newStatus = 'warning';
      }

      // Generate dynamic warnings
      const newAlerts = [];
      if (storageUsedPct >= 85) {
        newAlerts.push({ id: 1, type: 'critical', msg: `Storage usage has exceeded 85% of allocated plan limit.` });
      }
      if (downloadsUsedPct >= 90) {
        newAlerts.push({ id: 2, type: 'critical', msg: `Downloads approaching limit (${Math.round(downloadsUsedPct)}% utilized).` });
      }
      if (bandwidthUsedPct >= 80) {
        newAlerts.push({ id: 3, type: 'warning', msg: `Bandwidth usage is nearing its quota (${Math.round(bandwidthUsedPct)}% used).` });
      }
      if (overageSum > 0) {
        newAlerts.push({ id: 4, type: 'warning', msg: `Additional Azure consumption overage charges of $${overageSum} expected this month.` });
      }
      if ((c.monthlyFee + overageSum) > c.monthlyFee) {
        newAlerts.push({ id: 5, type: 'warning', msg: `Estimated invoice of $${c.monthlyFee + overageSum} exceeds subscription plan amount.` });
      }
      if (newAlerts.length === 0) {
        newAlerts.push({ id: 9, type: 'healthy', msg: 'All resource usage thresholds are within acceptable plan parameters.' });
      }

      return {
        ...c,
        usageDetails: updatedDetails,
        breakdown: updatedBreakdown,
        overages: overageSum,
        status: newStatus,
        alerts: newAlerts,
        quotaScore: Math.round(100 - (maxUsedPct / 5)), // mock score
        usagePercent: Math.round((storageUsedPct + downloadsUsedPct + bandwidthUsedPct) / 3)
      };
    }));

    setToastMsg(`Quota limit updated to ${newLimit}!`);
  };

  // Switch view from Admin Drawer to Customer Dashboard
  const actAsCustomer = (customerId) => {
    setSelectedCustomerId(customerId);
    setActiveTab('client');
    setDrawerCustomerId(null);
    setToastMsg(`Now viewing portal as ${customers.find(c => c.id === customerId)?.name}`);
  };

  // Helper for progress bar color states
  const getProgressColorClass = (percent) => {
    if (percent >= 90) return 'critical';
    if (percent >= 80) return 'warning';
    return 'healthy';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy':
        return <span className="status-badge healthy"><CheckCircle2 size={12} /> Healthy</span>;
      case 'warning':
        return <span className="status-badge warning"><AlertTriangle size={12} /> Warning</span>;
      case 'critical':
        return <span className="status-badge critical"><AlertTriangle size={12} /> Critical</span>;
      case 'loss':
        return <span className="status-badge loss"><TrendingDown size={12} /> Loss Making</span>;
      default:
        return null;
    }
  };

  const getRecommendation = (c) => {
    if (!c) return { nextPlan: null, text: '' };

    // Suggest upgrading stores or adding add-ons if usage is high
    const maxUsedPct = Math.max(
      (c.usageDetails.storage.current / c.usageDetails.storage.limit) * 100,
      (c.usageDetails.downloads.current / c.usageDetails.downloads.limit) * 100,
      (c.usageDetails.bandwidth.current / c.usageDetails.bandwidth.limit) * 100
    );

    if (maxUsedPct >= 90) {
      const nextStores = c.stores + 10;
      const fee = nextStores * 30 + (c.monthlyFee - c.stores * 30);
      return {
        nextPlan: `Store Plan (${nextStores} Stores)`,
        fee: fee,
        text: `Tenant is near resource exhaustion (${maxUsedPct.toFixed(0)}% limit reached). Upgrading stores count to ${nextStores} (+10 stores, $${fee}/mo) will scale default quotas and reduce overage risk.`
      };
    } else if (c.overages > 100) {
      const fee = c.monthlyFee + 50;
      return {
        nextPlan: `${c.planName} + 100GB Bundle`,
        fee: fee,
        text: `Tenant has generated high overage charges ($${c.overages}). Applying a resource upgrade package will reduce total monthly cost.`
      };
    } else {
      return {
        nextPlan: null,
        text: `Tenant usage is healthy and well-optimized within current store allocations. No action required.`
      };
    }
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#1e293b',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1100,
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} className="text-green" />
          {toastMsg}
        </div>
      )}

      {/* TOP PINK BRANDING HEADER */}
      <header className="ticket-header">
        <div className="header-left">
          <button className="home-btn" onClick={() => actAsCustomer('acme')} title="Reset Workspace">
            <Home size={18} />
          </button>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeTab === 'client' ? 'active' : ''}`}
              onClick={() => setActiveTab('client')}
            >
              User Dashboard
            </li>
            <li
              className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Cost Management
            </li>
          </ul>
        </div>

        <div className="header-center">
          <div className="brand-logo">
            <span>Ticket</span>
            <span className="it-badge">IT</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">
                {activeTab === 'client' ? 'StandardStoreSetup' : 'PlatformAdmin'}
              </span>
              <span className="user-role">
                {activeTab === 'client' ? 'HeadOffice' : 'System Admin'}
              </span>
            </div>
            <div className="user-avatar">
              <User size={16} />
            </div>
          </div>
          <button className="header-icon-btn" onClick={() => setToastMsg('Settings drawer is simulator only')} title="System Settings">
            <Settings size={18} />
          </button>
          <button className="header-icon-btn" onClick={() => setToastMsg('Logging out...')} title="Log Out">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* SUB-HEADER TOOLBAR WITH SEARCH / FILTERS / ACTIONS */}
      <div className="sub-header">
        <div className="toolbar-left">
          {activeTab === 'client' ? (
            <>
              <div className="active-customer-label" style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#1e293b',
                backgroundColor: '#f1f5f9',
                padding: '6px 12px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <span className="bullet" style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }} />
                {currentCustomer.name}
              </div>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                Plan: <strong style={{ color: '#1e293b' }}>{currentCustomer.planName}</strong>
              </span>
            </>
          ) : (
            <>
              <div className="search-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search organizations or plans..."
                  className="toolbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="select-wrapper">
                <select
                  className="toolbar-select"
                  value={drawerCustomerId || ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setDrawerCustomerId(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>

              <div className="select-wrapper">
                <select
                  className="toolbar-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="loss">Loss Making</option>
                </select>
                <ChevronDown size={14} className="select-arrow" />
              </div>
            </>
          )}
        </div>

        <div className="toolbar-right">
          {activeTab === 'client' ? (
            <>
              <button className="btn btn-outline" onClick={() => setToastMsg('Exporting usage audit reports...')}>
                <FileSpreadsheet size={14} /> Export Report
              </button>
              <button className="btn btn-green" onClick={openUpgradeModal}>
                <Sparkles size={14} /> Calculate / Increase Budget
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      {/* SIDEBAR + MAIN CONTENT LAYOUT */}
      <div className="dashboard-layout">

        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          {activeTab === 'client' ? (
            <>
              <div className="sidebar-menu-title">Client Portal</div>
              <button
                className={`sidebar-item ${clientActiveSection === 'billing' ? 'active' : ''}`}
                onClick={() => setClientActiveSection('billing')}
              >
                <CreditCard size={15} />
                <span>Billing & Consumption</span>
              </button>
            </>
          ) : (
            <>
              <div className="sidebar-menu-title">Admin Cost Portal</div>
              <button
                className={`sidebar-item ${adminActiveSection === 'profitability' ? 'active' : ''}`}
                onClick={() => setAdminActiveSection('profitability')}
              >
                <DollarSign size={15} />
                <span>Profitability Overview</span>
              </button>
              <button
                className={`sidebar-item ${adminActiveSection === 'invoices' ? 'active' : ''}`}
                onClick={() => setAdminActiveSection('invoices')}
              >
                <FileSpreadsheet size={15} />
                <span>Azure Invoices</span>
              </button>
            </>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="main-content animate-fade-in" key={`${activeTab}-${activeTab === 'client' ? clientActiveSection : adminActiveSection}`}>

          {/* PAGE 1: CLIENT USAGE PORTAL */}
          {activeTab === 'client' && (
            <div>
              {/* Section 1: Billing & Consumption Overview */}
              {clientActiveSection === 'billing' && (
                <div>
                  {/* Title & Metadata Row */}
                  <div className="dashboard-header-row">
                    <div>
                      <h1 className="page-title">Billing & Consumption Overview</h1>
                      <p className="page-subtitle">Granular resource analysis and actual Azure cloud consumption metrics.</p>
                    </div>

                    <div className="meta-details">
                      <div className="meta-item">
                        <span className="meta-label">Billing Period</span>
                        <span className="meta-value">{currentCustomer.billingPeriod}</span>
                      </div>
                      <div className="meta-item" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                        <span className="meta-label">Next Invoice Date</span>
                        <span className="meta-value">{currentCustomer.nextInvoiceDate}</span>
                      </div>
                      <div className="meta-item" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '20px' }}>
                        <span className="meta-label">Active Quota Status</span>
                        <span className="meta-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span className="status-badge healthy" style={{ padding: '2px 6px', fontSize: '10px' }}>ACTIVE</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KPI Cards Grid */}
                  <div className="kpi-grid">
                    <div className="card kpi-card">
                      <div className="kpi-header">
                        <span>Monthly Plan Fee</span>
                        <CreditCard size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">${currentCustomer.monthlyFee}</span>
                      <div className="kpi-footer">
                        <span className="text-muted">Subscription base cost</span>
                      </div>
                    </div>

                    <div className="card kpi-card pink">
                      <div className="kpi-header">
                        <span>Current Usage Cost</span>
                        <DollarSign size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">${currentCustomer.monthlyFee + currentCustomer.overages}</span>
                      <div className="kpi-footer">
                        <span className="text-muted">Plan fee + Azure overages</span>
                      </div>
                    </div>
                  </div>

                  {/* Layout: Progress list (Left) & Alerts list (Right) */}
                  <div className="dashboard-grid-2-1">
                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><Sliders size={16} className="text-blue" /> Plan Resource Allocation & Usage</span>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Warning thresholds apply at 80% and 90%</span>
                      </div>

                      <div className="progress-list">
                        {Object.entries(currentCustomer.usageDetails)
                          .filter(([key]) => ['storage', 'bandwidth', 'apiRequests', 'downloads'].includes(key))
                          .map(([key, detail]) => {
                            const percentage = Math.round((detail.current / detail.limit) * 100);
                            const colorClass = getProgressColorClass(percentage);

                            let displayName = '';
                            if (key === 'storage') displayName = 'Storage';
                            else if (key === 'bandwidth') displayName = 'CDN Bandwidth';
                            else if (key === 'apiRequests') displayName = 'API Calls';
                            else if (key === 'downloads') displayName = 'Downloads';

                            return (
                              <div className="progress-item" key={key}>
                                <div className="progress-label-row">
                                  <span className="progress-name">
                                    {displayName}
                                  </span>
                                  <span className="progress-stats">
                                    {detail.current.toLocaleString()} / {detail.limit.toLocaleString()} {detail.unit}
                                    <span style={{ marginLeft: '10px' }} className={`progress-percentage text-${colorClass}`}>
                                      {percentage}% Used
                                    </span>
                                  </span>
                                </div>
                                <div className="progress-bar-bg">
                                  <div
                                    className={`progress-bar-fill ${colorClass}`}
                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div className="section-title-bar">
                          <span className="section-title"><AlertTriangle size={16} className="text-pink" /> Billing & Usage Alerts</span>
                        </div>
                        <div className="alerts-list">
                          {currentCustomer.alerts.map((alert) => (
                            <div className={`alert-card ${alert.type}`} key={alert.id}>
                              <AlertTriangle size={16} className="alert-icon" />
                              <span className="alert-message">{alert.msg}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Service-by-Service Billing Details */}
                  <div className="card" style={{ marginBottom: '24px', marginTop: '24px' }}>
                    <div className="section-title-bar">
                      <span className="section-title"><Layers size={16} className="text-blue" /> Service-by-Service Billing Details</span>
                    </div>
                    <div className="table-responsive">
                      <table className="ticket-table">
                        <thead>
                          <tr>
                            <th>Service Resource</th>
                            <th>Included Monthly Allowance</th>
                            <th>Current Billing Consumption</th>
                            <th>Remaining Units</th>
                            <th>Overage Quantity</th>
                            <th className="text-right"> Overage Charge</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentCustomer.breakdown.map((row, index) => (
                            <tr key={index}>
                              <td className="bold-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {row.service.includes('Storage') && <Database size={13} className="text-muted" />}
                                {row.service.includes('Bandwidth') && <Globe size={13} className="text-muted" />}
                                {row.service.includes('API') && <Cpu size={13} className="text-muted" />}
                                {row.service.includes('Downloads') && <Activity size={13} className="text-muted" />}
                                {row.service}
                              </td>
                              <td>{row.included}</td>
                              <td className="bold-value">{row.current}</td>
                              <td>{row.remaining}</td>
                              <td className={parseInt(row.overage) > 0 ? "text-critical font-medium" : ""}>{row.overage}</td>
                              <td className="text-right bold-value">
                                {row.cost > 0 ? (
                                  <span className="text-pink">${row.cost}</span>
                                ) : (
                                  <span className="text-muted">$0</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Monthly Cost Trend (Full Width) */}
                  <div style={{ display: 'block', marginTop: '24px' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="section-title-bar">
                        <span className="section-title">
                          <TrendingUp size={16} className="text-blue" /> Monthly Cost Trend (12 Months)
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Select Year:</span>
                          <select
                            className="toolbar-select"
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', minWidth: '120px', height: '28px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                            value={clientChartYearFilter}
                            onChange={(e) => setClientChartYearFilter(e.target.value)}
                          >
                            <option value="thisYear">This Year (2026)</option>
                            <option value="prevYear">Previous Year (2025)</option>
                          </select>
                        </div>
                      </div>
                      <div className="chart-container" style={{ height: '300px', marginTop: '10px', paddingBottom: '40px' }}>
                        <SvgLineChart
                          data={clientChartYearFilter === 'thisYear' ? currentCustomer.costTrend : (currentCustomer.costTrendPreviousYear || [])}
                          labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                          strokeColor="#e91e63"
                          fullWidth={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* PAGE 2: ADMIN PORTAL */}
          {activeTab === 'admin' && (
            <div>
              {/* Section 1: Profitability Overview */}
              {adminActiveSection === 'profitability' && (
                <div>
                  <div className="dashboard-header-row">
                    <div>
                      <h1 className="page-title">Admin Profitability Overview</h1>
                      <p className="page-subtitle">Monitor customer profitability margins and optimize Azure resource deployment costs.</p>
                    </div>
                  </div>

                  {/* KPI Cards Grid */}
                  <div className="kpi-grid">
                    <div className="card kpi-card">
                      <div className="kpi-header">
                        <span>Total Customers</span>
                        <User size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">{adminKPIs.totalCustomers}</span>
                      <div className="kpi-footer">
                        <span className="text-green font-medium">+1 new organization</span>
                      </div>
                    </div>

                    <div className="card kpi-card pink">
                      <div className="kpi-header">
                        <span>Monthly Billing Revenue</span>
                        <DollarSign size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">${adminKPIs.monthlyRevenue.toLocaleString()}</span>
                      <div className="kpi-footer">
                        <span className="text-muted">Subscription fees + overages</span>
                      </div>
                    </div>

                    <div className="card kpi-card green">
                      <div className="kpi-header">
                        <span>Monthly Profit</span>
                        <TrendingUp size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value text-green">
                        {adminKPIs.grossProfit > 0 ? `+$${adminKPIs.grossProfit.toLocaleString()}` : '$0'}
                      </span>
                      <div className="kpi-footer">
                        <span className="text-green font-medium">
                          {adminKPIs.grossProfit > 0 ? `Margin: +${adminKPIs.profitMargin.toFixed(1)}%` : 'No profit this month'}
                        </span>
                      </div>
                    </div>

                    <div className="card kpi-card coral">
                      <div className="kpi-header">
                        <span>Monthly Loss</span>
                        <AlertTriangle size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value text-pink">
                        {adminKPIs.grossProfit < 0 ? `-$${Math.abs(adminKPIs.grossProfit).toLocaleString()}` : '$0'}
                      </span>
                      <div className="kpi-footer">
                        <span className={`font-medium ${adminKPIs.grossProfit < 0 ? 'text-pink' : 'text-muted'}`}>
                          {adminKPIs.grossProfit < 0 ? `Loss Margin: ${adminKPIs.profitMargin.toFixed(1)}%` : 'No loss this month'}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* Customer Profitability Analysis Table */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="section-title-bar">
                      <span className="section-title"><User size={16} className="text-blue" /> Customer Profitability Analysis</span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>Click on any customer row to open details drawer and adjust quotas</span>
                    </div>
                    <div className="table-responsive">
                      <table className="ticket-table">
                        <thead>
                          <tr>
                            <th>Customer Organization Name</th>
                            <th>Plan Type</th>
                            <th>Monthly Fee</th>
                            <th>Azure Cost</th>
                            <th>Profit margin</th>
                            <th>Usage Avg</th>
                            <th>Overage charges</th>
                            <th>Profitability Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedCustomers.map((c) => {
                            const totalRev = c.monthlyFee + c.overages;
                            const profit = totalRev - c.azureCost;
                            const margin = totalRev > 0 ? (profit / totalRev) * 100 : 0;

                            return (
                              <tr key={c.id} onClick={() => setDrawerCustomerId(c.id)} style={{ cursor: 'pointer' }}>
                                <td className="bold-value">{c.name}</td>
                                <td>{c.planName}</td>
                                <td className="bold-value">${c.monthlyFee}</td>
                                <td>${c.azureCost}</td>
                                <td className={`bold-value ${margin < 0 ? 'text-critical' : 'text-healthy'}`}>
                                  {margin.toFixed(1)}%
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{c.usagePercent}%</span>
                                    <div className="progress-bar-bg" style={{ width: '60px', height: '6px' }}>
                                      <div
                                        className={`progress-bar-fill ${getProgressColorClass(c.usagePercent)}`}
                                        style={{ width: `${c.usagePercent}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                                <td className="bold-value text-pink">${c.overages}</td>
                                <td>{getStatusBadge(c.status)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Table pagination */}
                    <div className="pagination-container">
                      <div className="pagination-select-wrapper">
                        <span>Rows Per Page:</span>
                        <select
                          className="pagination-select"
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(parseInt(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={5}>5 Rows</option>
                          <option value={10}>10 Rows</option>
                          <option value={20}>20 Rows</option>
                        </select>
                      </div>
                      <span>
                        {filteredCustomers.length === 0 ? '0' : (currentPage - 1) * pageSize + 1}-
                        {Math.min(filteredCustomers.length, currentPage * pageSize)} of {filteredCustomers.length}
                      </span>
                      <div className="pagination-nav">
                        <button
                          className="pagination-btn"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                          &lt;
                        </button>
                        <button
                          className="pagination-btn"
                          disabled={currentPage >= totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Top Consumers Grid (3 Columns) */}
                  <div className="dashboard-grid-3" style={{ marginBottom: '24px' }}>
                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><Database size={15} className="text-blue" /> Top Storage Consumers</span>
                      </div>
                      <div className="top-consumers-list">
                        {topConsumers.storage.map((c, i) => (
                          <div className="top-consumer-item" key={c.id}>
                            <div className="top-consumer-meta">
                              <span className="consumer-name">{i + 1}. {c.name}</span>
                              <span className="consumer-value">{c.usageDetails.storage.current} GB</span>
                            </div>
                            <div className="consumer-bar-container">
                              <div
                                className="consumer-bar-fill pink"
                                style={{ width: `${(c.usageDetails.storage.current / 3000) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><Download size={15} className="text-blue" /> Top Download Consumers</span>
                      </div>
                      <div className="top-consumers-list">
                        {topConsumers.downloads.map((c, i) => (
                          <div className="top-consumer-item" key={c.id}>
                            <div className="top-consumer-meta">
                              <span className="consumer-name">{i + 1}. {c.name}</span>
                              <span className="consumer-value">{(c.usageDetails.downloads.current / 1000).toFixed(0)}k Operations</span>
                            </div>
                            <div className="consumer-bar-container">
                              <div
                                className="consumer-bar-fill blue"
                                style={{ width: `${(c.usageDetails.downloads.current / 1500000) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><Globe size={15} className="text-blue" /> Top Bandwidth Egress</span>
                      </div>
                      <div className="top-consumers-list">
                        {topConsumers.bandwidth.map((c, i) => (
                          <div className="top-consumer-item" key={c.id}>
                            <div className="top-consumer-meta">
                              <span className="consumer-name">{i + 1}. {c.name}</span>
                              <span className="consumer-value">{c.usageDetails.bandwidth.current} TB</span>
                            </div>
                            <div className="consumer-bar-container">
                              <div
                                className="consumer-bar-fill green"
                                style={{ width: `${(c.usageDetails.bandwidth.current / 15) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Risk & Abuse Detection and Quota Status Distribution */}
                  <div className="dashboard-grid-2-1" style={{ marginBottom: '24px' }}>
                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><AlertTriangle size={16} className="text-pink" /> Admin Risk & Abuse Detection</span>
                      </div>
                      <div className="alerts-list">
                        <div className="alert-card critical">
                          <AlertTriangle size={16} className="alert-icon" />
                          <div>
                            <strong>Loss Making Organization:</strong> Acme Marketing Corp ($1,750 cost vs $1,452 revenue).
                          </div>
                        </div>
                        <div className="alert-card critical">
                          <AlertTriangle size={16} className="alert-icon" />
                          <div>
                            <strong>Bandwidth abuse alert:</strong> Starlight Entertainment triggered 3.4 TB overage bandwidth request.
                          </div>
                        </div>
                        <div className="alert-card warning">
                          <AlertTriangle size={16} className="alert-icon" />
                          <div>
                            <strong>Rapid Growth Warning:</strong> Summit Health Group has exceeded 96% storage limit.
                          </div>
                        </div>
                        <div className="alert-card warning">
                          <AlertTriangle size={16} className="alert-icon" />
                          <div>
                            <strong>High Risk of Quota Exhaustion:</strong> Nova Creative Agency has 4 days remaining.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div className="section-title-bar" style={{ width: '100%' }}>
                        <span className="section-title"><Activity size={15} className="text-blue" /> Quota Status Distribution</span>
                      </div>
                      <div style={{ marginTop: '10px', width: '100%' }}>
                        <SvgGaugeChart
                          healthy={statusCounts.healthy}
                          warning={statusCounts.warning}
                          critical={statusCounts.critical}
                          loss={statusCounts.loss}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights Profitability Charts */}
                  <div className="dashboard-grid-1-1">
                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><TrendingUp size={15} className="text-green" /> Margin Analysis by Organization</span>
                        <span className="badge badge-green">Profitability Leaderboard</span>
                      </div>
                      <div className="chart-container" style={{ height: '260px', marginTop: '10px' }}>
                        <SvgProfitMarginChart
                          data={customers.map(c => {
                            const totalRev = c.monthlyFee + c.overages;
                            const profit = totalRev - c.azureCost;
                            const margin = totalRev > 0 ? (profit / totalRev) * 100 : 0;
                            return {
                              name: c.name.split(' ')[0], // short name
                              margin: margin
                            };
                          }).sort((a, b) => b.margin - a.margin)}
                        />
                      </div>
                    </div>

                    <div className="card">
                      <div className="section-title-bar">
                        <span className="section-title"><Cpu size={15} className="text-pink" /> Aggregate Cost Over Time</span>
                        <span className="badge badge-pink">12M cloud growth</span>
                      </div>
                      <div className="chart-container" style={{ height: '220px', marginTop: '15px' }}>
                        <SvgLineChart
                          data={[4500, 4800, 4900, 5200, 5600, 6000, 6200, 6500, 6800, 7100, 7400, adminKPIs.azureCost]}
                          labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                          strokeColor="#e91e63"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: Azure Infrastructure Invoices */}
              {adminActiveSection === 'invoices' && (
                <div>
                  <div className="dashboard-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h1 className="page-title">Azure Infrastructure Invoices</h1>
                      <p className="page-subtitle">Track and audit Microsoft Azure direct subscription costs against client collected revenue.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Filter:</span>
                      <input
                        type="month"
                        className="toolbar-select"
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 500, color: '#1e293b', cursor: 'pointer', minWidth: '170px' }}
                        value={invoiceMonthFilter === 'all' ? '' : invoiceMonthFilter}
                        onChange={(e) => {
                          if (!e.target.value) {
                            setInvoiceMonthFilter('all');
                          } else {
                            // Convert 2026-06 to "June 2026"
                            const [y, m] = e.target.value.split('-');
                            const monthName = new Date(y, parseInt(m) - 1).toLocaleString('en-US', { month: 'long' });
                            setInvoiceMonthFilter(`${monthName} ${y}`);
                          }
                        }}
                      />
                      {invoiceMonthFilter !== 'all' && (
                        <button
                          className="btn btn-outline"
                          style={{ padding: '5px 10px', fontSize: '11px' }}
                          onClick={() => setInvoiceMonthFilter('all')}
                        >
                          Clear
                        </button>
                      )}
                      <div style={{ borderLeft: '1px solid #e2e8f0', height: '20px', margin: '0 4px' }}></div>
                      <label className="btn btn-navy" style={{ cursor: 'pointer', display: 'inline-flex', margin: 0 }}>
                        <Plus size={14} /> Upload Azure Invoice
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.xlsx,.xls,.txt"
                          style={{ display: 'none' }}
                          onChange={handleUploadAzureInvoice}
                        />
                      </label>
                    </div>
                  </div>

                  {/* KPI Cards (small, 4-col grid like profitability) */}
                  <div className="kpi-grid">
                    <div className="card kpi-card">
                      <div className="kpi-header">
                        <span>This Month Azure Billing</span>
                        <Database size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">${(adminAzureInvoices.length > 0 ? adminAzureInvoices[0].azureCost : 0).toLocaleString()}</span>
                      <div className="kpi-footer">
                        <span className="text-pink font-medium">{adminAzureInvoices.length > 0 ? adminAzureInvoices[0].month : 'N/A'}</span>
                      </div>
                    </div>

                    <div className="card kpi-card green">
                      <div className="kpi-header">
                        <span>Monthly Subscriptions</span>
                        <DollarSign size={14} className="kpi-icon" />
                      </div>
                      <span className="kpi-value">${(adminAzureInvoices.length > 0 ? adminAzureInvoices[0].clientRevenue : 0).toLocaleString()}</span>
                      <div className="kpi-footer">
                        <span className="text-green font-medium">
                          {adminAzureInvoices.length > 0
                            ? `Net: $${(adminAzureInvoices[0].clientRevenue - adminAzureInvoices[0].azureCost).toLocaleString()}`
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px' }}></div>

                  {/* Full-width Invoice Audit Log Table */}
                  <div className="card" style={{ marginBottom: '24px' }}>
                    <div className="section-title-bar">
                      <span className="section-title"><Layers size={16} className="text-blue" /> Azure Invoice Audit Log</span>
                      {invoiceMonthFilter !== 'all' && (
                        <span className="badge badge-blue">{invoiceMonthFilter}</span>
                      )}
                    </div>
                    <div className="table-responsive">
                      <table className="ticket-table">
                        <thead>
                          <tr>
                            <th>Invoice ID</th>
                            <th>Billing Period</th>
                            <th>Date Received</th>
                            <th>Azure Direct Cost</th>
                            <th>Client Total Revenue</th>
                            <th>Audited Margin</th>
                            <th>Status</th>
                            <th className="text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedInvoices.map((inv) => {
                            const profit = inv.clientRevenue - inv.azureCost;
                            const margin = inv.clientRevenue > 0 ? (profit / inv.clientRevenue * 100).toFixed(1) : 0;
                            return (
                              <tr key={inv.id} style={{ cursor: 'default' }}>
                                <td className="bold-value">{inv.id}</td>
                                <td>{inv.month}</td>
                                <td>{inv.date}</td>
                                <td className="bold-value text-pink">${inv.azureCost.toLocaleString()}</td>
                                <td className="bold-value text-green">${inv.clientRevenue.toLocaleString()}</td>
                                <td>
                                  <span className={`status-badge ${parseFloat(margin) > 0 ? 'healthy' : 'loss'}`}>
                                    {parseFloat(margin) > 0 ? `+${margin}%` : `${margin}%`}
                                  </span>
                                </td>
                                <td>
                                  <span className="status-badge healthy">
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <button
                                    className="btn btn-outline"
                                    style={{ padding: '4px 8px', fontSize: '11px' }}
                                    onClick={() => handleDownloadAzureInvoice(inv)}
                                  >
                                    <Download size={12} /> Download
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredInvoices.length === 0 && (
                            <tr>
                              <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                                No invoices found {invoiceMonthFilter !== 'all' ? `for ${invoiceMonthFilter}` : ''}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table pagination */}
                    <div className="pagination-container">
                      <div className="pagination-select-wrapper">
                        <span>Rows Per Page:</span>
                        <select
                          className="pagination-select"
                          value={invoicePageSize}
                          onChange={(e) => {
                            setInvoicePageSize(parseInt(e.target.value));
                            setInvoiceCurrentPage(1);
                          }}
                        >
                          <option value={5}>5 Rows</option>
                          <option value={10}>10 Rows</option>
                          <option value={20}>20 Rows</option>
                        </select>
                      </div>
                      <span>
                        {filteredInvoices.length === 0 ? '0' : (invoiceCurrentPage - 1) * invoicePageSize + 1}-
                        {Math.min(filteredInvoices.length, invoiceCurrentPage * invoicePageSize)} of {filteredInvoices.length}
                      </span>
                      <div className="pagination-nav">
                        <button
                          className="pagination-btn"
                          disabled={invoiceCurrentPage === 1}
                          onClick={() => setInvoiceCurrentPage(prev => prev - 1)}
                        >
                          &lt;
                        </button>
                        <button
                          className="pagination-btn"
                          disabled={invoiceCurrentPage >= totalInvoicePages}
                          onClick={() => setInvoiceCurrentPage(prev => prev + 1)}
                        >
                          &gt;
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Full-width Monthly Azure Cost vs Revenue Chart */}
                  <div className="card">
                    <div className="section-title-bar">
                      <span className="section-title">
                        <TrendingUp size={16} className="text-blue" />
                        Monthly Azure Cost vs Revenue
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Select Year:</span>
                        <select
                          className="toolbar-select"
                          style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', minWidth: '80px', height: '28px', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                          value={chartYearFilter}
                          onChange={(e) => setChartYearFilter(e.target.value)}
                        >
                          {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      {chartData.labels.length > 0 ? (
                        <SvgDualBarChart
                          line1={chartData.line1}
                          line2={chartData.line2}
                          labels={chartData.labels}
                          line1Label="Direct Azure Spend"
                          line2Label="Collected Billings"
                          line1Color="#8b5cf6"
                          line2Color="#e91e63"
                          height={220}
                          fontSize={8}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                          No chart data available for the year {chartYearFilter}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL DRAWER COMPONENT (SLIDES OUT IN ADMIN VIEW) */}
      {drawerCustomer && (
        <div className="drawer-backdrop" onClick={() => setDrawerCustomerId(null)}>
          <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-group">
                <span className="drawer-title">{drawerCustomer.name}</span>
                <span className="drawer-subtitle">Tenant Administration Panel</span>
              </div>
              <button className="drawer-close-btn" onClick={() => setDrawerCustomerId(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-body">

              {/* Profitability Panel */}
              <div className="drawer-section">
                <span className="drawer-section-title">Financial Analysis</span>
                <div className="drawer-info-grid">
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Current Revenue</span>
                    <span className="drawer-info-value">${drawerCustomer.monthlyFee + drawerCustomer.overages}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Azure Infra Cost</span>
                    <span className="drawer-info-value text-coral">${drawerCustomer.azureCost}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Overage Revenue</span>
                    <span className="drawer-info-value text-pink">${drawerCustomer.overages}</span>
                  </div>
                  <div className="drawer-info-item">
                    <span className="drawer-info-label">Profit margin</span>
                    <span className={`drawer-info-value ${((drawerCustomer.monthlyFee + drawerCustomer.overages - drawerCustomer.azureCost) < 0) ? 'text-critical' : 'text-green'}`}>
                      {(((drawerCustomer.monthlyFee + drawerCustomer.overages - drawerCustomer.azureCost) / (drawerCustomer.monthlyFee + drawerCustomer.overages)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable limits form */}
              <div className="drawer-section">
                <span className="drawer-section-title">Modify Quota Allowances</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                  {/* Storage Slider/Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Storage Capacity Limit (Current Used: {drawerCustomer.usageDetails.storage.current} GB)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="range"
                        min="200"
                        max="4000"
                        step="50"
                        value={drawerCustomer.usageDetails.storage.limit}
                        onChange={(e) => handleUpdateQuota('storage', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        className="toolbar-search"
                        style={{ width: '100px', padding: '6px 8px' }}
                        value={drawerCustomer.usageDetails.storage.limit}
                        onChange={(e) => handleUpdateQuota('storage', e.target.value)}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>GB</span>
                    </div>
                  </div>

                  {/* Bandwidth Slider/Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      CDN Bandwidth Limit (Current Used: {drawerCustomer.usageDetails.bandwidth.current} TB)
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={drawerCustomer.usageDetails.bandwidth.limit}
                        onChange={(e) => handleUpdateQuota('bandwidth', e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <input
                        type="number"
                        className="toolbar-search"
                        style={{ width: '100px', padding: '6px 8px' }}
                        value={drawerCustomer.usageDetails.bandwidth.limit}
                        onChange={(e) => handleUpdateQuota('bandwidth', e.target.value)}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>TB</span>
                    </div>
                  </div>

                  {/* Downloads Limit Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Downloads Limit Operations (Current Used: {drawerCustomer.usageDetails.downloads.current.toLocaleString()})
                    </label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="number"
                        className="toolbar-search"
                        style={{ width: '180px', padding: '6px 8px' }}
                        value={drawerCustomer.usageDetails.downloads.limit}
                        onChange={(e) => handleUpdateQuota('downloads', e.target.value)}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 600 }}>Operations</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Resource Split list */}
              <div className="drawer-section">
                <span className="drawer-section-title">Azure Infrastructure Consumption split</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(drawerCustomer.azureCostSplit).map(([key, val]) => (
                    <div key={key} style={{ display: 'flex', justify: 'space-between', fontSize: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                      <span style={{ textTransform: 'capitalize', color: '#64748b', fontWeight: 500 }}>{key} cost</span>
                      <strong style={{ color: '#1e293b' }}>${val}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              {(() => {
                const rec = getRecommendation(drawerCustomer);
                return (
                  <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.25)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #e91e63, #ff6090)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Sparkles size={14} color="#fff" />
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '0.3px'
                      }}>
                        Recommended Action
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12.5px',
                      margin: 0,
                      color: '#cbd5e1',
                      lineHeight: '1.55'
                    }}>
                      {rec.text}
                    </p>
                    {rec.nextPlan && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <button
                          className="btn btn-pink"
                          style={{
                            flex: 1,
                            padding: '9px 0',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '8px',
                            letterSpacing: '0.3px'
                          }}
                          onClick={() => {
                            setCustomers(prev => prev.map(c => {
                              if (c.id === drawerCustomer.id) {
                                return { ...c, planName: rec.nextPlan, monthlyFee: rec.fee };
                              }
                              return c;
                            }));
                            setToastMsg(`Successfully upgraded ${drawerCustomer.name} to ${rec.nextPlan}!`);
                          }}
                        >
                          Upgrade to {rec.nextPlan}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

            </div>

            <div className="drawer-footer">
              <button className="btn btn-outline" onClick={() => setDrawerCustomerId(null)}>Close</button>
              <button
                className="btn btn-green"
                onClick={() => {
                  setToastMsg('Invoice Warning Alert notification sent successfully to customer!');
                  setDrawerCustomerId(null);
                }}
              >
                Send Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPANY REGISTRATION & COST CALCULATOR MODAL */}
      {upgradeModalOpen && (
        <div className="calculator-modal-backdrop" onClick={() => setUpgradeModalOpen(false)}>
          <form
            className="calculator-modal-container"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleUpgradePlan}
          >
            <div className="calculator-modal-header">
              <h3>
                <Sparkles size={20} /> Calculate / Increase Budget
              </h3>
              <button
                type="button"
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ffffff' }}
                onClick={() => setUpgradeModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="calculator-modal-body">
              {/* Left Panel: Form Inputs */}
              <div className="calculator-form-section">
                <div className="calculator-card-light highlight">
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#e91e63', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Store Configuration
                  </span>
                  <div className="slider-container">
                    <div className="slider-header-row">
                      <span className="slider-title">Number of Stores ($30 / store / mo)</span>
                      <span className="slider-upgrade-badge" style={{ backgroundColor: '#fce7f3', color: '#db2777' }}>
                        Base Cost: ${regStores * 30}/mo
                      </span>
                    </div>
                    <div className="slider-control-row">
                      <input
                        type="range"
                        min="1"
                        max="200"
                        step="1"
                        value={regStores}
                        onChange={(e) => setRegStores(parseInt(e.target.value))}
                      />
                      <input
                        type="number"
                        className="toolbar-search"
                        style={{ width: '80px', padding: '6px 8px', textAlign: 'right' }}
                        min="1"
                        max="500"
                        value={regStores}
                        onChange={(e) => setRegStores(Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', width: '45px' }}>Stores</span>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        Resource Limits Breakdown (Includes Base + Upgrades)
                      </span>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '12px',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff'
                      }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b' }}>Resource</th>
                            <th style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b' }}>Per Store</th>
                            <th style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b' }}>Default Base ({regStores})</th>
                            <th style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b' }}>Upgrades</th>
                            <th style={{ padding: '8px 10px', fontWeight: 700, color: '#1e293b', textAlign: 'right' }}>Final Limit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>Storage</td>
                            <td style={{ padding: '8px 10px' }}>2 GB</td>
                            <td style={{ padding: '8px 10px' }}>{regStores * 2} GB</td>
                            <td style={{ padding: '8px 10px', color: regStorageUpgrade > 0 ? '#e91e63' : '#64748b', fontWeight: regStorageUpgrade > 0 ? 600 : 400 }}>
                              {regStorageUpgrade > 0 ? `+${regStorageUpgrade} GB` : 'None'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#e91e63', textAlign: 'right' }}>
                              {regStores * 2 + regStorageUpgrade} GB
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>CDN Bandwidth</td>
                            <td style={{ padding: '8px 10px' }}>10 GB</td>
                            <td style={{ padding: '8px 10px' }}>{regStores * 10} GB</td>
                            <td style={{ padding: '8px 10px', color: regBandwidthUpgrade > 0 ? '#e91e63' : '#64748b', fontWeight: regBandwidthUpgrade > 0 ? 600 : 400 }}>
                              {regBandwidthUpgrade > 0 ? `+${regBandwidthUpgrade} GB` : 'None'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#e91e63', textAlign: 'right' }}>
                              {regStores * 10 + regBandwidthUpgrade} GB
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>API Calls</td>
                            <td style={{ padding: '8px 10px' }}>50k</td>
                            <td style={{ padding: '8px 10px' }}>{(regStores * 50).toLocaleString()}k</td>
                            <td style={{ padding: '8px 10px', color: regApiUpgrade > 0 ? '#e91e63' : '#64748b', fontWeight: regApiUpgrade > 0 ? 600 : 400 }}>
                              {regApiUpgrade > 0 ? `+${(regApiUpgrade / 1000).toFixed(0)}k` : 'None'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#e91e63', textAlign: 'right' }}>
                              {((regStores * 50000 + regApiUpgrade) / 1000000).toFixed(2)}M
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 10px', fontWeight: 600, color: '#0f172a' }}>Downloads</td>
                            <td style={{ padding: '8px 10px' }}>5k</td>
                            <td style={{ padding: '8px 10px' }}>{(regStores * 5).toLocaleString()}k</td>
                            <td style={{ padding: '8px 10px', color: regDownloadsUpgrade > 0 ? '#e91e63' : '#64748b', fontWeight: regDownloadsUpgrade > 0 ? 600 : 400 }}>
                              {regDownloadsUpgrade > 0 ? `+${(regDownloadsUpgrade / 1000).toFixed(0)}k` : 'None'}
                            </td>
                            <td style={{ padding: '8px 10px', fontWeight: 700, color: '#e91e63', textAlign: 'right' }}>
                              {((regStores * 5000 + regDownloadsUpgrade) / 1000).toFixed(0)}k
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="calculator-card-light">
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Resource Upgrades (Optional Add-ons)
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Storage Upgrade */}
                    <div className="slider-container">
                      <div className="slider-header-row">
                        <span className="slider-title">Additional Storage (+ $2 / GB)</span>
                        {regStorageUpgrade > 0 && (
                          <span className="slider-upgrade-badge">
                            + ${regStorageUpgrade * 2}/mo
                          </span>
                        )}
                      </div>
                      <div className="slider-control-row">
                        <input
                          type="range"
                          min="0"
                          max="500"
                          step="5"
                          value={regStorageUpgrade}
                          onChange={(e) => setRegStorageUpgrade(parseInt(e.target.value))}
                        />
                        <span className="slider-value-display">
                          + {regStorageUpgrade} GB
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                        <span>Default Base: <strong style={{ color: '#334155' }}>{regStores * 2} GB</strong> (2 GB / Store)</span>
                        <span>Total Allocated: <strong style={{ color: '#0f172a' }}>{regStores * 2 + regStorageUpgrade} GB</strong></span>
                      </div>
                    </div>

                    {/* Bandwidth Upgrade */}
                    <div className="slider-container">
                      <div className="slider-header-row">
                        <span className="slider-title">Additional CDN Bandwidth (+ $1 / 10 GB)</span>
                        {regBandwidthUpgrade > 0 && (
                          <span className="slider-upgrade-badge">
                            + ${(regBandwidthUpgrade * 0.1).toFixed(1)}/mo
                          </span>
                        )}
                      </div>
                      <div className="slider-control-row">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          step="10"
                          value={regBandwidthUpgrade}
                          onChange={(e) => setRegBandwidthUpgrade(parseInt(e.target.value))}
                        />
                        <span className="slider-value-display">
                          + {regBandwidthUpgrade} GB
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                        <span>Default Base: <strong style={{ color: '#334155' }}>{regStores * 10} GB</strong> (10 GB / Store)</span>
                        <span>Total Allocated: <strong style={{ color: '#0f172a' }}>{regStores * 10 + regBandwidthUpgrade} GB</strong></span>
                      </div>
                    </div>

                    {/* API Upgrade */}
                    <div className="slider-container">
                      <div className="slider-header-row">
                        <span className="slider-title">Additional API Calls (+ $3 / 100k calls)</span>
                        {regApiUpgrade > 0 && (
                          <span className="slider-upgrade-badge">
                            + ${(regApiUpgrade / 100000 * 3).toFixed(1)}/mo
                          </span>
                        )}
                      </div>
                      <div className="slider-control-row">
                        <input
                          type="range"
                          min="0"
                          max="5000000"
                          step="100000"
                          value={regApiUpgrade}
                          onChange={(e) => setRegApiUpgrade(parseInt(e.target.value))}
                        />
                        <span className="slider-value-display">
                          + {(regApiUpgrade / 1000).toFixed(0)}k calls
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                        <span>Default Base: <strong style={{ color: '#334155' }}>{(regStores * 50).toLocaleString()}k calls</strong> (50k / Store)</span>
                        <span>Total Allocated: <strong style={{ color: '#0f172a' }}>{((regStores * 50000 + regApiUpgrade) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k calls</strong></span>
                      </div>
                    </div>

                    {/* Downloads Upgrade */}
                    <div className="slider-container">
                      <div className="slider-header-row">
                        <span className="slider-title">Additional Downloads (+ $2 / 10k downloads)</span>
                        {regDownloadsUpgrade > 0 && (
                          <span className="slider-upgrade-badge">
                            + ${(regDownloadsUpgrade / 10000 * 2).toFixed(1)}/mo
                          </span>
                        )}
                      </div>
                      <div className="slider-control-row">
                        <input
                          type="range"
                          min="0"
                          max="500000"
                          step="10000"
                          value={regDownloadsUpgrade}
                          onChange={(e) => setRegDownloadsUpgrade(parseInt(e.target.value))}
                        />
                        <span className="slider-value-display">
                          + {(regDownloadsUpgrade / 1000).toFixed(0)}k dls
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                        <span>Default Base: <strong style={{ color: '#334155' }}>{(regStores * 5).toLocaleString()}k dls</strong> (5k / Store)</span>
                        <span>Total Allocated: <strong style={{ color: '#0f172a' }}>{((regStores * 5000 + regDownloadsUpgrade) / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })}k dls</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel: Pricing & Plan Summary */}
              <div className="pricing-summary-card">
                <div>
                  <div className="summary-header">
                    <span className="summary-title">
                      <CreditCard size={18} className="text-pink" /> Cost Structure Summary
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="summary-item-row active">
                      <span>Stores Base Plan ({regStores} Stores)</span>
                      <span>${regStores * 30}</span>
                    </div>

                    <div className="summary-item-row">
                      <span>Additional Storage (+ {regStorageUpgrade} GB)</span>
                      <span>+ ${regStorageUpgrade * 2}</span>
                    </div>

                    <div className="summary-item-row">
                      <span>Additional CDN (+ {regBandwidthUpgrade} GB)</span>
                      <span>+ ${(regBandwidthUpgrade * 0.1).toFixed(1)}</span>
                    </div>

                    <div className="summary-item-row">
                      <span>Additional APIs (+ {(regApiUpgrade / 1000).toFixed(0)}k)</span>
                      <span>+ ${(regApiUpgrade / 100000 * 3).toFixed(1)}</span>
                    </div>

                    <div className="summary-item-row">
                      <span>Additional Downloads (+ {(regDownloadsUpgrade / 1000).toFixed(0)}k)</span>
                      <span>+ ${(regDownloadsUpgrade / 10000 * 2).toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="summary-resources-grid">
                    <div className="summary-resource-box">
                      <span className="summary-resource-lbl">Total Storage</span>
                      <span className="summary-resource-val">{(regStores * 2 + regStorageUpgrade)} GB</span>
                    </div>
                    <div className="summary-resource-box">
                      <span className="summary-resource-lbl">Total CDN</span>
                      <span className="summary-resource-val">{(regStores * 10 + regBandwidthUpgrade)} GB</span>
                    </div>
                    <div className="summary-resource-box">
                      <span className="summary-resource-lbl">Total API Limit</span>
                      <span className="summary-resource-val">{((regStores * 50000 + regApiUpgrade) / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="summary-resource-box">
                      <span className="summary-resource-lbl">Total Downloads</span>
                      <span className="summary-resource-val">{((regStores * 5000 + regDownloadsUpgrade) / 1000).toFixed(0)}k</span>
                    </div>
                  </div>

                  <div className="summary-item-row total">
                    <span>Total Monthly Fee</span>
                    <span className="summary-total-price">${Math.round(regStores * 30 + regStorageUpgrade * 2 + regBandwidthUpgrade * 0.1 + regApiUpgrade / 100000 * 3 + regDownloadsUpgrade / 10000 * 2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="calculator-modal-footer">
              <button type="button" className="btn btn-outline" onClick={() => setUpgradeModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-pink">
                Upgrade Plan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
