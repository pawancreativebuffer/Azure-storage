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
    name: 'Acme Marketing Corp',
    planName: 'Business Enterprise Plan',
    monthlyFee: 1200,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 1750, // Internal cost to us
    overages: 252, // Extra charges customer pays
    quotaScore: 78,
    usageDetails: {
      storage: { current: 850, limit: 1000, unit: 'GB' },
      downloads: { current: 450000, limit: 500000, unit: '' },
      bandwidth: { current: 4.2, limit: 5, unit: 'TB' },
      ticketBuilder: { current: 4200, limit: 5000, unit: 'assets' },
      publishedAssets: { current: 12500, limit: 15000, unit: 'assets' },
      apiRequests: { current: 8.2, limit: 10, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '1 TB', current: '1.3 TB', remaining: '0 GB', overage: '300 GB', cost: 12 },
      { service: 'CDN Bandwidth', included: '5 TB', current: '7 TB', remaining: '0 TB', overage: '2 TB', cost: 25 },
      { service: 'SQL Database', included: '100 GB', current: '120 GB', remaining: '0 GB', overage: '20 GB', cost: 5 },
      { service: 'API Requests', included: '10 M', current: '12 M', remaining: '0 M', overage: '2 M', cost: 8 },
      { service: 'Azure Functions', included: '5 M', current: '15 M', remaining: '0 M', overage: '10 M', cost: 40 },
      { service: 'Networking Egress', included: '1 TB', current: '2.5 TB', remaining: '0 TB', overage: '1.5 TB', cost: 150 },
      { service: 'Storage Transactions', included: '10 M', current: '22 M', remaining: '0 M', overage: '12 M', cost: 12 }
    ],
    moduleCostSplit: { dam: 420, ticketBuilder: 310, downloads: 480, api: 242 },
    azureCostSplit: { storage: 450, cdn: 380, database: 320, functions: 180, networking: 420 },
    costTrend: [1100, 1150, 1120, 1220, 1250, 1280, 1310, 1340, 1320, 1390, 1410, 1452],
    storageTrend: [620, 640, 660, 690, 710, 730, 760, 780, 800, 810, 830, 850],
    forecast: {
      storage: '920 GB',
      downloads: '495,000',
      bandwidth: '4.6 TB',
      invoice: '$1,520',
      daysUntilExhaustion: '9 Days',
      planUpgradeDiscount: '32%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 85% of allocated plan limit.' },
      { id: 2, type: 'critical', msg: 'Downloads approaching limit (90% utilized). Upgrade recommended.' },
      { id: 3, type: 'warning', msg: 'Bandwidth usage is nearing its quota (84% used).' },
      { id: 4, type: 'warning', msg: 'Additional Azure consumption overage charges of $252 expected this month.' },
      { id: 5, type: 'warning', msg: 'Estimated invoice of $1,452 exceeds subscription plan amount of $1,200.' }
    ]
  },
  {
    id: 'globetech',
    name: 'GlobeTech Solutions',
    planName: 'Business Plus Plan',
    monthlyFee: 800,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 380,
    overages: 0,
    quotaScore: 92,
    usageDetails: {
      storage: { current: 310, limit: 500, unit: 'GB' },
      downloads: { current: 155000, limit: 250000, unit: '' },
      bandwidth: { current: 1.55, limit: 2.5, unit: 'TB' },
      ticketBuilder: { current: 1500, limit: 2500, unit: 'assets' },
      publishedAssets: { current: 4600, limit: 7500, unit: 'assets' },
      apiRequests: { current: 3.1, limit: 5, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '500 GB', current: '310 GB', remaining: '190 GB', overage: '0 GB', cost: 0 },
      { service: 'CDN Bandwidth', included: '2.5 TB', current: '1.55 TB', remaining: '0.95 TB', overage: '0 TB', cost: 0 },
      { service: 'SQL Database', included: '50 GB', current: '42 GB', remaining: '8 GB', overage: '0 GB', cost: 0 },
      { service: 'API Requests', included: '5 M', current: '3.1 M', remaining: '1.9 M', overage: '0 M', cost: 0 },
      { service: 'Azure Functions', included: '2.5 M', current: '1.8 M', remaining: '0.7 M', overage: '0 M', cost: 0 },
      { service: 'Networking Egress', included: '500 GB', current: '480 GB', remaining: '20 GB', overage: '0 GB', cost: 0 },
      { service: 'Storage Transactions', included: '5 M', current: '4.1 M', remaining: '0.9 M', overage: '0 M', cost: 0 }
    ],
    moduleCostSplit: { dam: 180, ticketBuilder: 110, downloads: 220, api: 90 },
    azureCostSplit: { storage: 120, cdn: 90, database: 80, functions: 50, networking: 40 },
    costTrend: [350, 360, 340, 355, 370, 365, 380, 375, 360, 380, 390, 380],
    storageTrend: [250, 255, 260, 270, 275, 280, 290, 295, 300, 305, 308, 310],
    forecast: {
      storage: '325 GB',
      downloads: '170,000',
      bandwidth: '1.7 TB',
      invoice: '$800',
      daysUntilExhaustion: 'None',
      planUpgradeDiscount: '0%'
    },
    alerts: [
      { id: 1, type: 'healthy', msg: 'All resource usage thresholds are within acceptable plan parameters.' }
    ]
  },
  {
    id: 'nova',
    name: 'Nova Creative Agency',
    planName: 'Pro Startup Plan',
    monthlyFee: 400,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 490,
    overages: 120,
    quotaScore: 81,
    usageDetails: {
      storage: { current: 180, limit: 200, unit: 'GB' },
      downloads: { current: 95000, limit: 100000, unit: '' },
      bandwidth: { current: 0.92, limit: 1, unit: 'TB' },
      ticketBuilder: { current: 850, limit: 1000, unit: 'assets' },
      publishedAssets: { current: 2800, limit: 3000, unit: 'assets' },
      apiRequests: { current: 1.8, limit: 2, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '200 GB', current: '230 GB', remaining: '0 GB', overage: '30 GB', cost: 12 },
      { service: 'CDN Bandwidth', included: '1 TB', current: '1.2 TB', remaining: '0 TB', overage: '0.2 TB', cost: 20 },
      { service: 'SQL Database', included: '20 GB', current: '28 GB', remaining: '0 GB', overage: '8 GB', cost: 18 },
      { service: 'API Requests', included: '2 M', current: '2.5 M', remaining: '0 M', overage: '0.5 M', cost: 15 },
      { service: 'Azure Functions', included: '1 M', current: '2.2 M', remaining: '0 M', overage: '1.2 M', cost: 55 },
      { service: 'Networking Egress', included: '200 GB', current: '200 GB', remaining: '0 GB', overage: '0 GB', cost: 0 },
      { service: 'Storage Transactions', included: '2 M', current: '2 M', remaining: '0 M', overage: '0 M', cost: 0 }
    ],
    moduleCostSplit: { dam: 180, ticketBuilder: 120, downloads: 140, api: 80 },
    azureCostSplit: { storage: 150, cdn: 110, database: 90, functions: 80, networking: 60 },
    costTrend: [380, 395, 410, 420, 430, 445, 450, 460, 455, 470, 480, 490],
    storageTrend: [110, 120, 125, 130, 142, 150, 155, 160, 168, 172, 175, 180],
    forecast: {
      storage: '205 GB',
      downloads: '105,000',
      bandwidth: '1.05 TB',
      invoice: '$520',
      daysUntilExhaustion: '4 Days',
      planUpgradeDiscount: '28%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Storage usage has exceeded 90% of your plan limit.' },
      { id: 2, type: 'warning', msg: 'Azure resources cost ($490) exceeds your subscription plan price ($400).' },
      { id: 3, type: 'warning', msg: 'API executions spike detected in the last 48 hours.' }
    ]
  },
  {
    id: 'apex',
    name: 'Apex Retailers',
    planName: 'Business Enterprise Plan',
    monthlyFee: 1200,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 850,
    overages: 50,
    quotaScore: 88,
    usageDetails: {
      storage: { current: 740, limit: 1000, unit: 'GB' },
      downloads: { current: 360000, limit: 500000, unit: '' },
      bandwidth: { current: 3.8, limit: 5, unit: 'TB' },
      ticketBuilder: { current: 3900, limit: 5000, unit: 'assets' },
      publishedAssets: { current: 11100, limit: 15000, unit: 'assets' },
      apiRequests: { current: 7.4, limit: 10, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '1 TB', current: '740 GB', remaining: '260 GB', overage: '0 GB', cost: 0 },
      { service: 'CDN Bandwidth', included: '5 TB', current: '3.8 TB', remaining: '1.2 TB', overage: '0 TB', cost: 0 },
      { service: 'SQL Database', included: '100 GB', current: '110 GB', remaining: '0 GB', overage: '10 GB', cost: 50 },
      { service: 'API Requests', included: '10 M', current: '7.4 M', remaining: '2.6 M', overage: '0 M', cost: 0 },
      { service: 'Azure Functions', included: '5 M', current: '4.5 M', remaining: '0.5 M', overage: '0 M', cost: 0 },
      { service: 'Networking Egress', included: '1 TB', current: '820 GB', remaining: '180 GB', overage: '0 GB', cost: 0 },
      { service: 'Storage Transactions', included: '10 M', current: '8.8 M', remaining: '1.2 M', overage: '0 M', cost: 0 }
    ],
    moduleCostSplit: { dam: 310, ticketBuilder: 240, downloads: 180, api: 120 },
    azureCostSplit: { storage: 280, cdn: 210, database: 190, functions: 110, networking: 60 },
    costTrend: [780, 790, 810, 800, 820, 830, 840, 835, 840, 845, 860, 850],
    storageTrend: [610, 625, 630, 642, 660, 675, 690, 705, 715, 722, 735, 740],
    forecast: {
      storage: '780 GB',
      downloads: '390,000',
      bandwidth: '4.1 TB',
      invoice: '$1,250',
      daysUntilExhaustion: 'None',
      planUpgradeDiscount: '0%'
    },
    alerts: [
      { id: 1, type: 'healthy', msg: 'All metrics are performing inside optimal quota boundaries.' }
    ]
  },
  {
    id: 'summit',
    name: 'Summit Health Group',
    planName: 'Business Plus Plan',
    monthlyFee: 800,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 1150,
    overages: 450,
    quotaScore: 71,
    usageDetails: {
      storage: { current: 480, limit: 500, unit: 'GB' },
      downloads: { current: 240000, limit: 250000, unit: '' },
      bandwidth: { current: 2.45, limit: 2.5, unit: 'TB' },
      ticketBuilder: { current: 2350, limit: 2500, unit: 'assets' },
      publishedAssets: { current: 6900, limit: 7500, unit: 'assets' },
      apiRequests: { current: 4.8, limit: 5, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '500 GB', current: '620 GB', remaining: '0 GB', overage: '120 GB', cost: 120 },
      { service: 'CDN Bandwidth', included: '2.5 TB', current: '3.1 TB', remaining: '0 TB', overage: '0.6 TB', cost: 80 },
      { service: 'SQL Database', included: '50 GB', current: '85 GB', remaining: '0 GB', overage: '35 GB', cost: 150 },
      { service: 'API Requests', included: '5 M', current: '6.5 M', remaining: '0 M', overage: '1.5 M', cost: 60 },
      { service: 'Azure Functions', included: '2.5 M', current: '3.8 M', remaining: '0 M', overage: '1.3 M', cost: 40 },
      { service: 'Networking Egress', included: '500 GB', current: '500 GB', remaining: '0 GB', overage: '0 GB', cost: 0 },
      { service: 'Storage Transactions', included: '5 M', current: '5 M', remaining: '0 M', overage: '0 M', cost: 0 }
    ],
    moduleCostSplit: { dam: 390, ticketBuilder: 280, downloads: 310, api: 170 },
    azureCostSplit: { storage: 380, cdn: 270, database: 260, functions: 140, networking: 100 },
    costTrend: [920, 950, 970, 990, 1010, 1050, 1070, 1090, 1110, 1120, 1140, 1150],
    storageTrend: [380, 395, 410, 420, 430, 440, 450, 455, 462, 470, 475, 480],
    forecast: {
      storage: '515 GB',
      downloads: '255,000',
      bandwidth: '2.6 TB',
      invoice: '$1,350',
      daysUntilExhaustion: '2 Days',
      planUpgradeDiscount: '45%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Customer is generating a loss due to high Azure costs ($1,150) relative to subscription fee ($800).' },
      { id: 2, type: 'critical', msg: 'Storage usage has reached 96% of current limits.' },
      { id: 3, type: 'warning', msg: 'Bandwidth usage is at 98% of the monthly plan threshold.' }
    ]
  },
  {
    id: 'starlight',
    name: 'Starlight Entertainment',
    planName: 'Enterprise Custom',
    monthlyFee: 2500,
    billingPeriod: 'June 1, 2026 - June 30, 2026',
    nextInvoiceDate: 'July 1, 2026',
    azureCost: 3100,
    overages: 800,
    quotaScore: 73,
    usageDetails: {
      storage: { current: 2850, limit: 3000, unit: 'GB' },
      downloads: { current: 1450000, limit: 1500000, unit: '' },
      bandwidth: { current: 14.2, limit: 15, unit: 'TB' },
      ticketBuilder: { current: 14200, limit: 15000, unit: 'assets' },
      publishedAssets: { current: 42500, limit: 45000, unit: 'assets' },
      apiRequests: { current: 28.2, limit: 30, unit: 'M' }
    },
    breakdown: [
      { service: 'Blob Storage', included: '3 TB', current: '3.4 TB', remaining: '0 TB', overage: '0.4 TB', cost: 160 },
      { service: 'CDN Bandwidth', included: '15 TB', current: '18 TB', remaining: '0 TB', overage: '3 TB', cost: 300 },
      { service: 'SQL Database', included: '300 GB', current: '350 GB', remaining: '0 GB', overage: '50 GB', cost: 200 },
      { service: 'API Requests', included: '30 M', current: '34 M', remaining: '0 M', overage: '4 M', cost: 120 },
      { service: 'Azure Functions', included: '15 M', current: '16 M', remaining: '0 M', overage: '1 M', cost: 20 },
      { service: 'Networking Egress', included: '3 TB', current: '3 TB', remaining: '0 TB', overage: '0 TB', cost: 0 },
      { service: 'Storage Transactions', included: '30 M', current: '30 M', remaining: '0 M', overage: '0 M', cost: 0 }
    ],
    moduleCostSplit: { dam: 1100, ticketBuilder: 800, downloads: 900, api: 300 },
    azureCostSplit: { storage: 950, cdn: 820, database: 700, functions: 380, networking: 250 },
    costTrend: [2600, 2700, 2750, 2800, 2900, 2950, 3000, 3050, 3020, 3080, 3120, 3100],
    storageTrend: [2100, 2150, 2200, 2300, 2400, 2480, 2550, 2600, 2680, 2750, 2800, 2850],
    forecast: {
      storage: '3,050 GB',
      downloads: '1,520,000',
      bandwidth: '15.1 TB',
      invoice: '$3,400',
      daysUntilExhaustion: '3 Days',
      planUpgradeDiscount: '35%'
    },
    alerts: [
      { id: 1, type: 'critical', msg: 'Abnormal downloads spike detected: Storage transactions increased by 250% in 12 hours.' },
      { id: 2, type: 'critical', msg: 'Bandwidth abuse alert: Multiple repeat requests detected from single IP segment.' },
      { id: 3, type: 'warning', msg: 'Usage is at 95% across three major Azure resource limits.' }
    ]
  }
];

// Interactive Custom SVG Charts
function SvgLineChart({ data, labels, height = 180, strokeColor = '#2563eb' }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data) * 1.15 || 100;
  const minVal = 0;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 30;
  
  const chartHeight = height - paddingTop - paddingBottom;
  const chartWidth = 500;
  
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
    <svg viewBox={`0 0 ${chartWidth} ${height}`} className="svg-chart" style={{ overflow: 'visible', width: '100%', height: '100%' }}>
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
            <text x={paddingLeft - 8} y={y + 4} className="chart-axis-text" textAnchor="end" style={{ fill: '#94a3b8', fontSize: '10px' }}>{val}</text>
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
          {/* Label under point - only every 2nd or 3rd label to avoid clutter */}
          {(points.length < 8 || i % 2 === 0 || i === points.length - 1) && (
            <text x={p.x} y={height - 10} className="chart-axis-text" textAnchor="middle" style={{ fill: '#64748b', fontSize: '9px', fontWeight: 500 }}>
              {p.label}
            </text>
          )}
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
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', lineHeight: 1 }}>
            {total >= 1000 ? `$${(total/1000).toFixed(1)}k` : `$${total}`}
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginTop: '4px' }}>Total</span>
        </div>
      </div>
      <div className="donut-legend" style={{ gridTemplateColumns: '1fr', marginTop: '16px' }}>
        {data.map((item, index) => (
          <div key={index} className="legend-item" style={{ justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="legend-color" style={{ backgroundColor: colors[index], width: '8px', height: '8px' }} />
              <span style={{ fontWeight: 600, fontSize: '12px', color: '#334155' }}>{item.name}</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '12px', color: '#0f172a' }}>
              ${item.value.toLocaleString()} <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 500 }}>({Math.round((item.value / total) * 100)}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('client'); // 'client' or 'admin'
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState('acme');
  const [drawerCustomerId, setDrawerCustomerId] = useState(null);
  
  // Filters & Page Size
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

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
      storage: [...customers].sort((a,b) => b.usageDetails.storage.current - a.usageDetails.storage.current).slice(0, 3),
      downloads: [...customers].sort((a,b) => b.usageDetails.downloads.current - a.usageDetails.downloads.current).slice(0, 3),
      bandwidth: [...customers].sort((a,b) => b.usageDetails.bandwidth.current - a.usageDetails.bandwidth.current).slice(0, 3),
      azureCost: [...customers].sort((a,b) => b.azureCost - a.azureCost).slice(0, 3),
      ticketBuilder: [...customers].sort((a,b) => b.usageDetails.ticketBuilder.current - a.usageDetails.ticketBuilder.current).slice(0, 3),
      dam: [...customers].sort((a,b) => b.moduleCostSplit.dam - a.moduleCostSplit.dam).slice(0, 3),
    };
  }, [customers]);

  // Aggregate Infrastructure Cost split for admin donut charts
  const adminAzureSplit = useMemo(() => {
    let storage = 0, cdn = 0, database = 0, functions = 0, networking = 0;
    customers.forEach(c => {
      storage += c.azureCostSplit.storage;
      cdn += c.azureCostSplit.cdn;
      database += c.azureCostSplit.database;
      functions += c.azureCostSplit.functions;
      networking += c.azureCostSplit.networking;
    });
    return [
      { name: 'Blob Storage', value: storage },
      { name: 'CDN Bandwidth', value: cdn },
      { name: 'SQL Database', value: database },
      { name: 'Azure Functions', value: functions },
      { name: 'Networking', value: networking }
    ];
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
        let overageAmt = '0 GB';
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
        quotaScore: Math.round(100 - (maxUsedPct / 5)) // mock score
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
          <button className="header-icon-btn" onClick={() => setToastMsg('Logging out...') } title="Log Out">
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
          {activeTab === 'client' && (
            <>
              <button className="btn btn-outline" onClick={() => setToastMsg('Exporting usage audit reports...')}>
                <FileSpreadsheet size={14} /> Export Report
              </button>
              <button className="btn btn-green" onClick={() => setUpgradeModalOpen(true)}>
                <Sparkles size={14} /> Upgrade Plan
              </button>
            </>
          )}
        </div>
      </div>

      {/* DASHBOARD CONTENT BODY */}
      <main className="dashboard-content animate-fade-in" key={activeTab}>
        
        {/* PAGE 1: CLIENT USAGE PORTAL */}
        {activeTab === 'client' && (
          <div>
            {/* Title & Metadata Row */}
            <div className="dashboard-header-row">
              <div>
                <h1 className="page-title">Usage & Billing Management</h1>
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

              <div className="card kpi-card coral">
                <div className="kpi-header">
                  <span>Overage Charges</span>
                  <AlertTriangle size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">${currentCustomer.overages}</span>
                <div className="kpi-footer">
                  {currentCustomer.overages > 0 ? (
                    <span className="kpi-trend-down"><TrendingUp size={12} /> Consumption exceeded</span>
                  ) : (
                    <span className="kpi-trend-up"><CheckCircle2 size={12} /> Inside plan limits</span>
                  )}
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-header">
                  <span>Estimated Final Bill</span>
                  <CreditCard size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">{currentCustomer.forecast.invoice}</span>
                <div className="kpi-footer font-medium">
                  <span className="text-muted">Projected end-of-month</span>
                </div>
              </div>

              <div className="card kpi-card yellow">
                <div className="kpi-header">
                  <span>Remaining Quota</span>
                  <Database size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">
                  {Math.round(100 - (currentCustomer.usageDetails.storage.current / currentCustomer.usageDetails.storage.limit * 100))}%
                </span>
                <div className="kpi-footer">
                  <span className="text-muted">Storage remaining capacity</span>
                </div>
              </div>

              <div className="card kpi-card green">
                <div className="kpi-header">
                  <span>Usage Health Score</span>
                  <Activity size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value text-green">{currentCustomer.quotaScore}%</span>
                <div className="kpi-footer">
                  <span className="text-muted">Overall quota health</span>
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
                  {Object.entries(currentCustomer.usageDetails).map(([key, detail]) => {
                    const percentage = Math.round((detail.current / detail.limit) * 100);
                    const colorClass = getProgressColorClass(percentage);
                    
                    return (
                      <div className="progress-item" key={key}>
                        <div className="progress-label-row">
                          <span className="progress-name" style={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1')}
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

                <div className="upgrade-card" style={{ marginTop: '20px' }}>
                  <span className="upgrade-title">
                    <Sparkles size={16} className="text-pink" /> Optimization Suggestion
                  </span>
                  <p className="upgrade-desc">
                    Based on your current consumption patterns, upgrading to <span className="upgrade-highlight">Business Plus Plan</span> would reduce your projected overage charges by <strong style={{ color: '#ffffff' }}>32%</strong>.
                  </p>
                  <div className="upgrade-actions">
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>*Saves approx $80/month</span>
                    <button className="btn btn-pink upgrade-cta" onClick={() => setUpgradeModalOpen(true)}>Upgrade Options</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout: Detailed breakdown table */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="section-title-bar">
                <span className="section-title"><Layers size={16} className="text-blue" /> Granular Azure Infrastructure Consumption</span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Actual resource metrics powered by Microsoft Azure Cost API</span>
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
                          {row.service.includes('Database') && <Database size={13} className="text-muted" />}
                          {row.service.includes('API') && <Cpu size={13} className="text-muted" />}
                          {row.service.includes('Functions') && <Cpu size={13} className="text-muted" />}
                          {row.service.includes('Networking') && <Globe size={13} className="text-muted" />}
                          {row.service.includes('Transactions') && <Activity size={13} className="text-muted" />}
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

            {/* Layout: Forecast & Analytics charts */}
            <div className="dashboard-grid-1-1">
              <div className="card">
                <div className="section-title-bar">
                  <span className="section-title"><TrendingUp size={16} className="text-blue" /> Billing & Consumption Historical Trends</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Cost Trend (12 Months)</h4>
                    <div className="chart-container">
                      <SvgLineChart 
                        data={currentCustomer.costTrend}
                        labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                        strokeColor="#e91e63"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Storage Volume Growth (GB)</h4>
                    <div className="chart-container">
                      <SvgLineChart 
                        data={currentCustomer.storageTrend}
                        labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                        strokeColor="#2563eb"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="section-title-bar">
                  <span className="section-title"><Cpu size={16} className="text-blue" /> Module Usage & Azure Breakdown</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Cost By Platform Module</h4>
                    <SvgDonutChart 
                      data={[
                        { name: 'DAM (Asset Storage)', value: currentCustomer.moduleCostSplit.dam },
                        { name: 'Ticket Builder', value: currentCustomer.moduleCostSplit.ticketBuilder },
                        { name: 'Downloads API', value: currentCustomer.moduleCostSplit.downloads },
                        { name: 'API Requests & Hooks', value: currentCustomer.moduleCostSplit.api }
                      ]}
                      colors={['#e91e63', '#2563eb', '#10b981', '#f59e0b']}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Azure Infrastructure cost split</h4>
                    <SvgDonutChart 
                      data={[
                        { name: 'Blob Storage', value: currentCustomer.azureCostSplit.storage },
                        { name: 'CDN Bandwidth', value: currentCustomer.azureCostSplit.cdn },
                        { name: 'SQL Databases', value: currentCustomer.azureCostSplit.database },
                        { name: 'Functions / Network', value: currentCustomer.azureCostSplit.functions + currentCustomer.azureCostSplit.networking }
                      ]}
                      colors={['#e91e63', '#3b82f6', '#10b981', '#8b5cf6']}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout: Forecast panel */}
            <div style={{ marginBottom: '24px' }}>
              <div className="card">
                <div className="section-title-bar">
                  <span className="section-title"><Info size={16} className="text-blue" /> Predictive Forecast Analysis</span>
                </div>
                <div className="forecast-grid">
                  <div className="forecast-item">
                    <span className="forecast-label">Estimated Storage at Month-End</span>
                    <span className="forecast-value">{currentCustomer.forecast.storage}</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Estimated Final Monthly Invoice</span>
                    <span className="forecast-value text-pink">{currentCustomer.forecast.invoice}</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Estimated Download Operations</span>
                    <span className="forecast-value">{currentCustomer.forecast.downloads}</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Projected CDN Egress</span>
                    <span className="forecast-value">{currentCustomer.forecast.bandwidth}</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Days Until Quota Exhaustion</span>
                    <span className="forecast-value text-critical">{currentCustomer.forecast.daysUntilExhaustion}</span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Upgrade Cost Reduction</span>
                    <span className="forecast-value text-green">{currentCustomer.forecast.planUpgradeDiscount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: ADMIN COST MANAGEMENT PORTAL */}
        {activeTab === 'admin' && (
          <div>
            {/* Title & Metadata Row */}
            <div className="dashboard-header-row">
              <div>
                <h1 className="page-title">Admin Profitability & Infrastructure Cost</h1>
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

              <div className="card kpi-card coral">
                <div className="kpi-header">
                  <span>Azure Infrastructure Cost</span>
                  <Cpu size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">${adminKPIs.azureCost.toLocaleString()}</span>
                <div className="kpi-footer">
                  <span className="kpi-trend-down">Actual cloud bill total</span>
                </div>
              </div>

              <div className="card kpi-card green">
                <div className="kpi-header">
                  <span>Net Gross Profit</span>
                  <DollarSign size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value text-green">${adminKPIs.grossProfit.toLocaleString()}</span>
                <div className="kpi-footer">
                  <span className="text-green font-medium">
                    Margin: {adminKPIs.profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-header">
                  <span>Overage Billing Revenue</span>
                  <CreditCard size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">${adminKPIs.overageRevenue.toLocaleString()}</span>
                <div className="kpi-footer">
                  <span className="text-muted">From quota expansions</span>
                </div>
              </div>

              <div className="card kpi-card">
                <div className="kpi-header">
                  <span>Active Tenants</span>
                  <Activity size={14} className="kpi-icon" />
                </div>
                <span className="kpi-value">{adminKPIs.activeOrgs}</span>
                <div className="kpi-footer">
                  <span className="text-muted">Active deployment nodes</span>
                </div>
              </div>
            </div>

            {/* Layout: Main Customer profitability Table */}
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
                        <tr key={c.id} onClick={() => setDrawerCustomerId(c.id)}>
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

            {/* Layout: Usage & Azure Infrastructure Breakdown */}
            <div className="dashboard-grid-2-1">
              {/* Azure Infra Cost split */}
              <div className="card">
                <div className="section-title-bar">
                  <span className="section-title"><Cpu size={16} className="text-blue" /> Infrastructure Resource Billing Split</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Total Infrastructure Cloud Cost</h4>
                    <SvgDonutChart 
                      data={adminAzureSplit}
                      colors={['#e91e63', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6']}
                    />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Cumulative Cost Over Time</h4>
                    <div className="chart-container" style={{ height: '220px' }}>
                      <SvgLineChart 
                        data={[4500, 4800, 4900, 5200, 5600, 6000, 6200, 6500, 6800, 7100, 7400, adminKPIs.azureCost]}
                        labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                        strokeColor="#e91e63"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Risk monitoring */}
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
            </div>

            {/* Layout: Top consumers widgets (3 Columns) */}
            <div className="dashboard-grid-3">
              <div className="card">
                <div className="section-title-bar">
                  <span className="section-title"><Database size={15} className="text-blue" /> Top Storage Consumers</span>
                </div>
                <div className="top-consumers-list">
                  {topConsumers.storage.map((c, i) => (
                    <div className="top-consumer-item" key={c.id}>
                      <div className="top-consumer-meta">
                        <span className="consumer-name">{i+1}. {c.name}</span>
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
                        <span className="consumer-name">{i+1}. {c.name}</span>
                        <span className="consumer-value">{(c.usageDetails.downloads.current/1000).toFixed(0)}k Operations</span>
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
                        <span className="consumer-name">{i+1}. {c.name}</span>
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

            {/* Layout: Bottom forecasting */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="section-title-bar">
                <span className="section-title"><Info size={16} className="text-blue" /> Global Financial Projections</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px' }}>
                <div className="forecast-item" style={{ borderBottom: 'none' }}>
                  <span className="forecast-label">Projected Gross Revenue</span>
                  <span className="forecast-value" style={{ fontSize: '20px' }}>${(adminKPIs.monthlyRevenue * 1.05).toFixed(0)}</span>
                </div>
                <div className="forecast-item" style={{ borderBottom: 'none' }}>
                  <span className="forecast-label">Projected Azure Cost</span>
                  <span className="forecast-value text-pink" style={{ fontSize: '20px' }}>${(adminKPIs.azureCost * 1.02).toFixed(0)}</span>
                </div>
                <div className="forecast-item" style={{ borderBottom: 'none' }}>
                  <span className="forecast-label">Expected Net Margin</span>
                  <span className="forecast-value text-green" style={{ fontSize: '20px' }}>
                    {((adminKPIs.monthlyRevenue * 1.05 - adminKPIs.azureCost * 1.02) / (adminKPIs.monthlyRevenue * 1.05) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="forecast-item" style={{ borderBottom: 'none' }}>
                  <span className="forecast-label">Unbilled Overage Potential</span>
                  <span className="forecast-value" style={{ fontSize: '20px' }}>$980</span>
                </div>
                <div className="forecast-item" style={{ borderBottom: 'none' }}>
                  <span className="forecast-label">Orgs Near Quota Limit</span>
                  <span className="forecast-value text-critical" style={{ fontSize: '20px' }}>3 Accounts</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

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
              {/* Act as client CTA */}
              <div className="drawer-section">
                <button 
                  className="btn btn-pink" 
                  onClick={() => actAsCustomer(drawerCustomer.id)}
                  style={{ width: '100%', padding: '10px 0', fontSize: '13px' }}
                >
                  <User size={14} style={{ marginRight: '6px' }} /> Act As Customer Portal
                </button>
              </div>

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

              {/* Recommentation */}
              <div className="upgrade-card" style={{ padding: '16px' }}>
                <span className="upgrade-title" style={{ fontSize: '14px' }}>
                  <Sparkles size={14} className="text-pink" /> Recommended Action
                </span>
                <p className="upgrade-desc" style={{ fontSize: '12px', marginBottom: '12px' }}>
                  Upgrading this customer to <strong style={{ color: '#ffffff' }}>Business Plus</strong> plan would mitigate current overages and improve resource utilization efficiency.
                </p>
              </div>

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
                Send Invoice Warning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PLAN UPGRADE MODAL */}
      {upgradeModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div className="card animate-fade-in" style={{ width: '650px', maxWidth: '90%', padding: '24px', position: 'relative' }}>
            <button 
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
              onClick={() => setUpgradeModalOpen(false)}
            >
              <X size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} className="text-pink" />
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Available Plan Upgrades</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Upgrade plan tier to scale quotas dynamically and reduce high overage rates.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div className="card" style={{ border: '1px solid #e2e8f0', padding: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>Current Plan</span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 8px' }}>{currentCustomer.planName}</h4>
                <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>${currentCustomer.monthlyFee}<span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>/month</span></div>
                <ul style={{ fontSize: '12px', color: '#64748b', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>• Storage: {currentCustomer.usageDetails.storage.limit} GB included</li>
                  <li>• CDN Bandwidth: {currentCustomer.usageDetails.bandwidth.limit} TB included</li>
                  <li>• Downloads: {currentCustomer.usageDetails.downloads.limit.toLocaleString()} included</li>
                </ul>
              </div>

              <div className="card" style={{ border: '2px solid var(--ticket-pink)', padding: '16px', backgroundColor: '#fffdfd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ticket-pink)', textTransform: 'uppercase' }}>Recommended</span>
                  <span style={{ fontSize: '9px', fontWeight: 700, backgroundColor: 'var(--ticket-pink-light)', color: 'var(--ticket-pink)', padding: '2px 6px', borderRadius: '10px' }}>SAVE 32% ON OVERAGES</span>
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '4px 0 8px' }}>Business Plus Plan</h4>
                <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>$1,500<span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>/month</span></div>
                <ul style={{ fontSize: '12px', color: '#334155', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontWeight: 500 }}>
                  <li>• <strong>Storage: 1.5 TB</strong> (50% increase)</li>
                  <li>• <strong>CDN Bandwidth: 7.5 TB</strong> (50% increase)</li>
                  <li>• <strong>Downloads: 750,000</strong> (50% increase)</li>
                  <li style={{ color: 'var(--color-healthy)' }}>• Overage charges drop to $0.00</li>
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={() => setUpgradeModalOpen(false)}>Cancel</button>
              <button 
                className="btn btn-pink" 
                onClick={() => {
                  setToastMsg('Plan upgrade requested successfully! Your sales agent will contact you shortly.');
                  setUpgradeModalOpen(false);
                }}
              >
                Confirm Upgrade Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
