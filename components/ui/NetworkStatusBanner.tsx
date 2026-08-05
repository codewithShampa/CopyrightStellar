'use client';

import { useState, useEffect } from 'react';
import { STELLAR_RPC_URL } from '@/lib/constants';

type NetworkHealth = 'checking' | 'healthy' | 'degraded' | 'offline';

const HEALTH_CONFIG: Record<NetworkHealth, { dot: string; bg: string; label: string }> = {
  checking: { dot: 'bg-amber-400 animate-pulse', bg: 'bg-amber-900/20 border-amber-800/30', label: 'Checking network…' },
  healthy:  { dot: 'bg-emerald-400', bg: 'bg-emerald-900/20 border-emerald-800/30', label: 'Stellar Testnet — Operational' },
  degraded: { dot: 'bg-amber-400', bg: 'bg-amber-900/20 border-amber-800/30', label: 'Stellar Testnet — Degraded' },
  offline:  { dot: 'bg-red-400', bg: 'bg-red-900/20 border-red-800/30', label: 'Stellar Testnet — Unreachable' },
};

export default function NetworkStatusBanner() {
  const [health, setHealth] = useState<NetworkHealth>('checking');
  const [latestLedger, setLatestLedger] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkHealth = async () => {
      try {
        const res = await fetch(STELLAR_RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth' }),
        });
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            if (data.result?.status === 'healthy') {
              setHealth('healthy');
              // Also fetch latest ledger for display
              try {
                const ledgerRes = await fetch(STELLAR_RPC_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'getLatestLedger' }),
                });
                const ledgerData = await ledgerRes.json();
                if (ledgerData.result?.sequence) {
                  setLatestLedger(ledgerData.result.sequence);
                }
              } catch {
                // Ledger fetch is optional
              }
            } else {
              setHealth('degraded');
            }
          } else {
            setHealth('degraded');
          }
        }
      } catch {
        if (!cancelled) setHealth('offline');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const config = HEALTH_CONFIG[health];

  return (
    <div className={`flex items-center justify-center gap-2 py-1.5 text-xs font-medium border-b ${config.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span className="text-slate-300">{config.label}</span>
      {latestLedger && (
        <span className="text-slate-500 font-mono">• Ledger #{latestLedger.toLocaleString()}</span>
      )}
    </div>
  );
}
