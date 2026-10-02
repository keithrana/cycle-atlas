import type { CSSProperties, ReactNode } from 'react';

export type DiagramKind = 'network' | 'server' | 'sccm' | 'voice';

const INK = '#D7E2EA';
const TEAL = '#2BB3A6';
const MUTED = 'rgba(215,226,234,0.55)';
const FILL = '#14161a';

function Box({ x, y, w, h, label, sub, accent }: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={FILL} stroke={accent ? TEAL : INK} strokeWidth={accent ? 2.5 : 1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 8)} textAnchor="middle" fontSize={22} fontWeight={500} fill={INK}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 22} textAnchor="middle" fontSize={18} fill={MUTED}>{sub}</text>}
    </g>
  );
}

function Line({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTED} strokeWidth={2} strokeDasharray={dashed ? '6 6' : undefined} />;
}

function Arrow({ x1, y, x2, label }: { x1: number; y: number; x2: number; label?: string }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - 10} y2={y} stroke={TEAL} strokeWidth={3} />
      <path d={`M${x2 - 14} ${y - 8} L${x2} ${y} L${x2 - 14} ${y + 8} Z`} fill={TEAL} />
      {label && <text x={(x1 + x2) / 2} y={y - 14} textAnchor="middle" fontSize={20} fill={TEAL}>{label}</text>}
    </g>
  );
}

function Dot({ cx, cy, r = 14 }: { cx: number; cy: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill={FILL} stroke={TEAL} strokeWidth={2.5} />;
}

function Wifi({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g fill="none" stroke={TEAL} strokeWidth={2.5} strokeLinecap="round">
      <path d={`M${cx - 18} ${cy - 4} Q${cx} ${cy - 22} ${cx + 18} ${cy - 4}`} />
      <path d={`M${cx - 10} ${cy + 4} Q${cx} ${cy - 6} ${cx + 10} ${cy + 4}`} />
      <circle cx={cx} cy={cy + 12} r={2.5} fill={TEAL} />
    </g>
  );
}

const diagrams: Record<DiagramKind, { label: string; body: ReactNode }> = {
  network: {
    label: 'Network topology: Fortinet firewall connects to Fortinet 48P switches, which connect to access points.',
    body: (
      <>
        <Box x={190} y={30} w={220} h={64} label="Fortinet firewall" accent />
        <Line x1={300} y1={94} x2={300} y2={130} />
        <Line x1={150} y1={130} x2={450} y2={130} />
        <Line x1={150} y1={130} x2={150} y2={160} />
        <Line x1={450} y1={130} x2={450} y2={160} />
        <Box x={50} y={160} w={200} h={64} label="48P switch" sub="Fortinet" />
        <Box x={350} y={160} w={200} h={64} label="48P switch" sub="Fortinet" />
        {[90, 210, 390, 510].map((x, i) => (
          <g key={x}>
            <Line x1={i < 2 ? 150 : 450} y1={224} x2={x} y2={274} dashed />
            <Dot cx={x} cy={296} r={22} />
            <Wifi cx={x} cy={292} />
          </g>
        ))}
        <text x={300} y={372} textAnchor="middle" fontSize={20} fill={MUTED}>Access point uplift</text>
        <text x={300} y={400} textAnchor="middle" fontSize={20} fill={MUTED}>Network topology upgrade</text>
      </>
    ),
  },
  server: {
    label: 'Server upgrade: virtual machines and services move from the existing server to the upgraded server, with updated network settings.',
    body: (
      <>
        <Box x={20} y={70} w={190} h={200} label="" />
        <text x={115} y={105} textAnchor="middle" fontSize={22} fontWeight={500} fill={INK}>Existing server</text>
        <Box x={40} y={130} w={150} h={44} label="VMs" />
        <Box x={40} y={192} w={150} h={44} label="Services" />
        <Arrow x1={222} y={170} x2={378} label="Data migrated" />
        <Box x={390} y={70} w={190} h={200} label="" accent />
        <text x={485} y={105} textAnchor="middle" fontSize={22} fontWeight={500} fill={INK}>Upgraded server</text>
        <Box x={410} y={130} w={150} h={44} label="VMs" />
        <Box x={410} y={192} w={150} h={44} label="Services" />
        <Line x1={485} y1={270} x2={485} y2={320} dashed />
        <Box x={150} y={320} w={320} h={56} label="Updated network settings" />
        <Line x1={470} y1={348} x2={485} y2={348} dashed />
      </>
    ),
  },
  sccm: {
    label: 'SCCM implementation: install and configure SCCM, prepare settings, then establish the task-sequence process for endpoints.',
    body: (
      <>
        <Box x={200} y={26} w={200} h={64} label="SCCM" accent />
        <Line x1={300} y1={90} x2={300} y2={122} />
        <Box x={40} y={122} w={150} h={92} label="Install" sub="& configure" />
        <Box x={225} y={122} w={150} h={92} label="Prepare" sub="settings" />
        <Box x={410} y={122} w={150} h={92} label="Task" sub="sequence" accent />
        <Arrow x1={190} y={168} x2={225} />
        <Arrow x1={375} y={168} x2={410} />
        <Line x1={485} y1={214} x2={485} y2={262} dashed />
        <Line x1={150} y1={262} x2={450} y2={262} dashed />
        {[150, 250, 350, 450].map((x) => (
          <g key={x}>
            <Line x1={x} y1={262} x2={x} y2={292} dashed />
            <rect x={x - 30} y={292} width={60} height={40} rx={6} fill={FILL} stroke={TEAL} strokeWidth={2.5} />
            <line x1={x - 40} y1={344} x2={x + 40} y2={344} stroke={TEAL} strokeWidth={3} strokeLinecap="round" />
          </g>
        ))}
        <text x={300} y={392} textAnchor="middle" fontSize={20} fill={MUTED}>Endpoints built through the task sequence</text>
      </>
    ),
  },
  voice: {
    label: 'Microsoft Teams calling: number porting, dial-plan and call-flow design, then users supported by training, documentation and adoption monitoring.',
    body: (
      <>
        <Box x={20} y={50} w={160} h={70} label="Number" sub="porting" />
        <Box x={220} y={50} w={160} h={70} label="Dial plan" accent />
        <Box x={420} y={50} w={160} h={70} label="Call flow" />
        <Arrow x1={180} y={85} x2={220} />
        <Arrow x1={380} y={85} x2={420} />
        <Line x1={300} y1={120} x2={300} y2={168} dashed />
        <Line x1={100} y1={168} x2={500} y2={168} dashed />
        {[100, 300, 500].map((x) => (
          <g key={x}>
            <Line x1={x} y1={168} x2={x} y2={196} dashed />
            <circle cx={x} cy={214} r={16} fill={FILL} stroke={TEAL} strokeWidth={2.5} />
            <path d={`M${x - 28} ${264} Q${x} ${226} ${x + 28} ${264}`} fill={FILL} stroke={TEAL} strokeWidth={2.5} />
          </g>
        ))}
        <text x={100} y={310} textAnchor="middle" fontSize={20} fill={INK}>User training</text>
        <text x={300} y={310} textAnchor="middle" fontSize={20} fill={INK}>Documentation</text>
        <text x={500} y={310} textAnchor="middle" fontSize={20} fill={INK}>Adoption monitoring</text>
        <text x={300} y={380} textAnchor="middle" fontSize={20} fill={MUTED}>Microsoft Teams calling</text>
      </>
    ),
  },
};

export default function ProjectDiagram({ kind, className, style }: { kind: DiagramKind; className?: string; style?: CSSProperties }) {
  const d = diagrams[kind];
  return (
    <svg viewBox="0 0 600 420" role="img" aria-label={`Illustrative diagram. ${d.label}`} className={className} style={{ fontFamily: 'Kanit, sans-serif', ...style }}>
      {d.body}
    </svg>
  );
}
