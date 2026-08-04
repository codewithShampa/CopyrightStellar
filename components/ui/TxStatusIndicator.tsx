'use client';

import { HiOutlineArrowPath, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

type TxStatus = 'idle' | 'signing' | 'polling' | 'success' | 'failed';

interface TxStatusIndicatorProps {
  status: TxStatus;
  txHash?: string;
  explorerLink?: string;
  successMessage?: string;
}

const STATUS_CONFIG: Record<TxStatus, { color: string; label: string; icon: 'spin' | 'check' | 'x' | null }> = {
  idle:    { color: 'text-slate-400', label: 'Ready', icon: null },
  signing: { color: 'text-amber-400', label: 'Awaiting wallet signature…', icon: 'spin' },
  polling: { color: 'text-brand-400', label: 'Confirming on-chain…', icon: 'spin' },
  success: { color: 'text-emerald-400', label: 'Transaction confirmed', icon: 'check' },
  failed:  { color: 'text-red-400', label: 'Transaction failed', icon: 'x' },
};

export default function TxStatusIndicator({ status, txHash, explorerLink, successMessage }: TxStatusIndicatorProps) {
  if (status === 'idle') return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${config.color} bg-surface-800/50 border border-surface-600/30`}>
      {config.icon === 'spin' && <HiOutlineArrowPath className="h-4 w-4 animate-spin" />}
      {config.icon === 'check' && <HiOutlineCheckCircle className="h-4 w-4" />}
      {config.icon === 'x' && <HiOutlineXCircle className="h-4 w-4" />}
      <span>{successMessage && status === 'success' ? successMessage : config.label}</span>
      {txHash && explorerLink && (
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-brand-300 hover:text-brand-200 font-mono transition-colors"
        >
          View TX →
        </a>
      )}
    </div>
  );
}
