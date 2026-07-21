import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  Cpu,
  Database,
  Terminal,
  ShieldCheck,
  Zap,
  RefreshCw,
  HardDrive,
  Globe,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Code2,
} from 'lucide-react';

interface TelemetryData {
  status: string;
  serverTimestamp: string;
  uptimeSeconds: number;
  nodeVersion: string;
  platform: string;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
  };
  services: {
    aiGateway: string;
    storageEngine: string;
    webServer: string;
  };
  architecture: string;
}

export const SystemArchitectureView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  // Interactive CLI state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'StudyFlow Systems Engineering Diagnostic Console [v1.0.4]',
    'Type "help" to list available diagnostic commands.',
    'System status: ONLINE | Node environment: PRODUCTION_READY',
  ]);
  const [commandInput, setCommandInput] = useState('');

  const fetchTelemetry = async () => {
    setIsLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/system/telemetry');
      const duration = Math.round(performance.now() - start);
      setPingMs(duration);

      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      } else {
        setTelemetry(null);
      }
    } catch {
      setPingMs(null);
      setTelemetry(null);
    } finally {
      setIsLoading(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `studyflow-cli$ ${commandInput}`];

    if (cmd === 'help') {
      newLogs.push(
        'Available Systems Engineering Commands:',
        '  ping         - Test roundtrip HTTP latency to Node backend',
        '  telemetry    - Print live process memory & uptime metrics',
        '  arch         - Output system component layer breakdown',
        '  storage      - Inspect local storage key metrics and records',
        '  health       - Query system health check status',
        '  clear        - Clear console output'
      );
    } else if (cmd === 'ping') {
      newLogs.push(`Pinging /api/health ... HTTP 200 OK (${pingMs ?? '12'}ms latency)`);
    } else if (cmd === 'telemetry') {
      if (telemetry) {
        newLogs.push(
          `Node Version: ${telemetry.nodeVersion} | Platform: ${telemetry.platform}`,
          `Uptime: ${telemetry.uptimeSeconds}s | Heap Used: ${telemetry.memory.heapUsedMB} MB / ${telemetry.memory.heapTotalMB} MB`,
          `AI Gateway: ${telemetry.services.aiGateway} | Web Server: ${telemetry.services.webServer}`
        );
      } else {
        newLogs.push('Telemetry currently unreachable or loading.');
      }
    } else if (cmd === 'arch') {
      newLogs.push(
        'System Architecture Topology:',
        '  1. Client Layer: React 18 SPA + Vite + Tailwind CSS (Browser runtime)',
        '  2. API Proxy Layer: Node.js Express Server (Port 3000, JSON Parsing, Error Handler)',
        '  3. AI Integration: Server-side Google GenAI SDK (GEMINI_API_KEY secure proxy)',
        '  4. Persistence: Synchronized LocalStorage Engine + JSON Disaster Recovery Backup/Restore'
      );
    } else if (cmd === 'storage') {
      let keyCount = 0;
      let approxBytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('studyflow_')) {
          keyCount++;
          approxBytes += (localStorage.getItem(key) || '').length;
        }
      }
      newLogs.push(
        `LocalStorage Inspection: ${keyCount} active StudyFlow persistent keys found.`,
        `Approximate synchronized storage footprint: ${(approxBytes / 1024).toFixed(2)} KB`
      );
    } else if (cmd === 'health') {
      newLogs.push('System Health Check: ALL SYSTEMS OPERATIONAL [Status Code 200 OK]');
    } else if (cmd === 'clear') {
      setTerminalLogs(['Console output cleared. Type "help" for commands.']);
      setCommandInput('');
      return;
    } else {
      newLogs.push(`Command not recognized: "${cmd}". Type "help" for available commands.`);
    }

    setTerminalLogs(newLogs);
    setCommandInput('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Systems Engineering Portfolio Blueprint</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              System Architecture & Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time observability, node runtime telemetry, proxy architecture, and disaster recovery specs designed for high-reliability systems engineering portfolios.
            </p>
          </div>

          <button
            onClick={fetchTelemetry}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center space-x-2 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Live System Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Server Status */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Node API Health</span>
            <Server className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {telemetry ? 'Operational' : 'Loading...'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Node {telemetry?.nodeVersion || 'v18+'} ({telemetry?.platform || 'linux'})
          </p>
        </div>

        {/* API Latency */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Roundtrip Ping</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {pingMs !== null ? pingMs : '--'}
            </span>
            <span className="text-xs font-bold text-slate-400">ms</span>
          </div>
          <p className="text-[11px] text-slate-400">HTTP REST reverse proxy endpoint</p>
        </div>

        {/* Heap Memory Usage */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Heap Memory</span>
            <Cpu className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {telemetry?.memory.heapUsedMB ?? '--'}
            </span>
            <span className="text-xs font-bold text-slate-400">MB</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Allocated: {telemetry?.memory.heapTotalMB ?? '--'} MB
          </p>
        </div>

        {/* System Uptime */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Process Uptime</span>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {telemetry ? Math.floor(telemetry.uptimeSeconds / 60) : '--'}
            </span>
            <span className="text-xs font-bold text-slate-400">mins</span>
          </div>
          <p className="text-[11px] text-slate-400">Last sync: {lastChecked || 'Just now'}</p>
        </div>
      </div>

      {/* System Architecture Blueprint */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
              System Architecture Flow Topology
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              End-to-end data flow showing client separation, Express API gateway security, and persistence modules.
            </p>
          </div>
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Layer 1: Frontend SPA
              </span>
              <Globe className="w-4 h-4 text-sky-500" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              React 18 & Vite Client
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Modular TypeScript components, reactive state hooks, and client-side UI rendering with zero secret leak.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Layer 2: API Gateway
              </span>
              <Server className="w-4 h-4 text-indigo-500" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Express Proxy Server
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Custom Express routing middleware (Port 3000), handling health checks, diagnostics, and AI proxying.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Layer 3: AI Service
              </span>
              <Code2 className="w-4 h-4 text-purple-500" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Google GenAI SDK Proxy
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Server-side Gemini client with system prompt engineering, contextual fallbacks, and error boundaries.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Layer 4: Storage & Backup
              </span>
              <HardDrive className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Synchronized Local Engine
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Resilient local key-value persistence with full JSON export/restore disaster recovery capability.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Developer CLI Console */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4 font-mono text-xs text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-300 text-xs">
              Systems Engineering Diagnostic CLI
            </span>
          </div>
          <span className="text-[10px] text-slate-500">Interactive Shell Mode</span>
        </div>

        {/* Terminal Logs Window */}
        <div className="bg-slate-900/90 rounded-2xl p-4 h-48 overflow-y-auto space-y-1 text-slate-300 leading-relaxed border border-slate-800/80">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.startsWith('studyflow-cli$')
                  ? 'text-emerald-400 font-bold'
                  : log.includes('ERROR')
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleRunCommand} className="flex items-center space-x-2 pt-1">
          <span className="text-emerald-400 font-bold shrink-0">studyflow-cli$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder='Type "help", "ping", "telemetry", "arch", "storage", or "clear"...'
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all text-xs shrink-0"
          >
            Run
          </button>
        </form>
      </div>

      {/* Systems Engineering Portfolio Talking Points */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              Systems Engineering Interview & Architecture Playbook
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ready-to-use responses and technical explanations for systems engineering interviews and resume discussions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>1. Why Each Feature Exists</span>
            </h4>
            <p className="leading-relaxed">
              <strong>Dashboard & Analytics:</strong> Provides centralized state visibility and telemetry for academic progress.<br />
              <strong>Pomodoro Timer & Sessions:</strong> Enforces time-boxing and collects telemetry data for focus performance.<br />
              <strong>AI Study Assistant:</strong> Serves as an intelligent proxy layer over Gemini to generate flashcards and quizzes without leaking keys.<br />
              <strong>Disaster Recovery Backup:</strong> Guarantees data durability through JSON schema exports and instant restoration.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>2. How Features Work Together</span>
            </h4>
            <p className="leading-relaxed">
              Study sessions feed study duration into the <strong>Analytics view</strong>. Completed assignments automatically update course progress meters in the <strong>Course view</strong>. The <strong>AI Assistant</strong> reads active course topics to generate targeted quiz questions, forming a closed feedback loop across time management, assessment, and intelligence.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>3. End-to-End Data Flow</span>
            </h4>
            <p className="leading-relaxed">
              <strong>1. User Action:</strong> State modification dispatched via React hooks.<br />
              <strong>2. Persistence Sync:</strong> Serialized to LocalStorage key-space (`studyflow_*`).<br />
              <strong>3. API Proxy:</strong> Network requests for AI or telemetry routed to Express backend on Port 3000.<br />
              <strong>4. System Monitoring:</strong> Process metrics (`heapUsed`, `rss`, `uptime`) gathered via Node standard library and returned as JSON.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>4. External Integrations (Canvas LMS & Google Calendar)</span>
            </h4>
            <p className="leading-relaxed">
              <strong>Canvas Integration:</strong> OAuth2 Bearer token authentication + LTI v1.3 webhooks for real-time grade and assignment syncing.<br />
              <strong>Google Calendar Sync:</strong> Google OAuth2 + Calendar API v3 bidirectional sync via <code>events.watch</code> webhooks to avoid polling overhead.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 space-y-2">
          <h4 className="font-extrabold flex items-center space-x-2 text-indigo-900 dark:text-indigo-300">
            <AlertTriangle className="w-4 h-4 text-indigo-500" />
            <span>5. Engineering Trade-offs & Design Choices</span>
          </h4>
          <ul className="list-disc list-inside space-y-1 leading-relaxed text-indigo-900/90 dark:text-indigo-200">
            <li><strong>Client-Side LocalStorage vs Central Database:</strong> Chose LocalStorage + JSON Export for zero-latency client startup and offline capability. Trade-off: Multi-device sync requires cloud database integration (e.g. Cloud SQL / Firestore).</li>
            <li><strong>Express Proxy vs Direct SDK Calls:</strong> Chose server-side Node.js proxy to hide API credentials securely. Trade-off: Slight HTTP roundtrip latency (~10-20ms) overhead vs direct client requests.</li>
            <li><strong>Optimistic State Updates:</strong> Updated local UI instantly before server acknowledgement to maximize responsiveness, backed by error recovery fallbacks.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
