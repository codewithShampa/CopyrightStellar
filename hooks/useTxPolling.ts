'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { stellar } from '@/lib/stellar';
import { TX_POLL_INTERVAL_MS } from '@/lib/config';

type TxStatus = 'idle' | 'signing' | 'polling' | 'success' | 'failed';

interface UseTxPollingResult {
  txHash: string;
  txStatus: TxStatus;
  returnValue: string | undefined;
  startPolling: (hash: string) => void;
  resetTx: () => void;
  setTxStatus: (status: TxStatus) => void;
}

/**
 * Custom hook to encapsulate transaction polling logic.
 * Replaces the repeated setInterval/clearInterval pattern across pages.
 */
export function useTxPolling(): UseTxPollingResult {
  const [txHash, setTxHash] = useState('');
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [returnValue, setReturnValue] = useState<string | undefined>();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const startPolling = useCallback((hash: string) => {
    setTxHash(hash);
    setTxStatus('polling');

    pollRef.current = setInterval(async () => {
      const result = await stellar.pollTransaction(hash);
      if (result.status === 'SUCCESS') {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setTxStatus('success');
        setReturnValue(result.returnValue);
      } else if (result.status === 'FAILED') {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setTxStatus('failed');
      }
    }, TX_POLL_INTERVAL_MS);
  }, []);

  const resetTx = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    setTxHash('');
    setTxStatus('idle');
    setReturnValue(undefined);
  }, []);

  return { txHash, txStatus, returnValue, startPolling, resetTx, setTxStatus };
}
