'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import { useWallet } from '@/hooks/useWallet';
import { stellar } from '@/lib/stellar';
import { REGISTRY_CONTRACT_ID } from '@/lib/constants';
import * as StellarSdk from '@stellar/stellar-sdk';
import toast from 'react-hot-toast';
import { HiOutlineUser, HiOutlineArrowPath } from 'react-icons/hi2';

interface RegistryWork {
  id: string;
  title: string;
  creator: string;
  fileHash: string;
  timestamp: string;
}

export default function CreatorProfilePage({ params }: { params: { address: string } }) {
  const { publicKey, isConnected } = useWallet();
  const [works, setWorks] = useState<RegistryWork[]>([]);
  const [loading, setLoading] = useState(false);
  const creatorAddress = params.address;

  const loadCreatorWorks = useCallback(async () => {
    if (!isConnected) return;
    setLoading(true);
    try {
      const countVal = await stellar.simulateRead({
        publicKey,
        contractId: REGISTRY_CONTRACT_ID,
        method: 'get_count',
      });

      const count = countVal ? Number(StellarSdk.scValToNative(countVal)) : 0;
      const creatorWorks: RegistryWork[] = [];

      for (let i = count; i >= 1; i--) {
        try {
          const recordVal = await stellar.simulateRead({
            publicKey,
            contractId: REGISTRY_CONTRACT_ID,
            method: 'get_record',
            args: [StellarSdk.nativeToScVal(i, { type: 'u32' })],
          });

          if (recordVal) {
            const record = StellarSdk.scValToNative(recordVal);
            if (String(record.creator) === creatorAddress) {
              creatorWorks.push({
                id: String(record.id || i),
                title: String(record.title || `Work #${i}`),
                creator: String(record.creator || ''),
                fileHash: record.file_hash ? Buffer.from(record.file_hash).toString('hex') : '',
                timestamp: record.timestamp ? new Date(Number(record.timestamp) * 1000).toLocaleString() : '',
              });
            }
          }
        } catch {
          // Skip if missing
        }
      }

      setWorks(creatorWorks);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load creator profile');
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey, creatorAddress]);

  useEffect(() => {
    loadCreatorWorks();
  }, [loadCreatorWorks]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12 min-h-screen">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 rounded-full bg-brand-500/20 border border-brand-500/50 flex items-center justify-center">
            <HiOutlineUser className="h-8 w-8 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Creator Profile
            </h1>
            <p className="text-sm text-slate-400 font-mono break-all">
              {creatorAddress}
            </p>
          </div>
        </div>

        {!isConnected ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <HiOutlineUser className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-300 font-medium mb-2">Connect your wallet to view profile</p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You need a connected Stellar wallet to read from the Soroban smart contracts.
            </p>
          </div>
        ) : loading ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <HiOutlineArrowPath className="h-8 w-8 animate-spin text-brand-400 mb-4" />
            <p className="text-sm text-slate-400">Loading creator portfolio...</p>
          </div>
        ) : works.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400 mb-2">No registrations found for this creator.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-surface-700/50 pb-2">Registered Works ({works.length})</h2>
            {works.map((work) => (
              <div key={work.id} className="glass-card p-5">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge label={`ID #${work.id}`} variant="outline" />
                      <h3 className="font-semibold text-slate-200 text-lg">{work.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Registration Date</p>
                        <p className="text-sm text-slate-300">{work.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-surface-700/50">
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">SHA-256 Proof</p>
                      <p className="text-xs text-slate-400 font-mono break-all">{work.fileHash}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
