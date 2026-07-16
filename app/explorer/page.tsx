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
import { HiOutlineGlobeAlt, HiOutlineArrowPath, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Link from 'next/link';

interface RegistryWork {
  id: string;
  title: string;
  creator: string;
  fileHash: string;
  timestamp: string;
}

export default function ExplorerPage() {
  const { publicKey, isConnected } = useWallet();
  const [works, setWorks] = useState<RegistryWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadExplorer = useCallback(async () => {
    if (!isConnected) return;
    setLoading(true);
    try {
      const countVal = await stellar.simulateRead({
        publicKey,
        contractId: REGISTRY_CONTRACT_ID,
        method: 'get_count',
      });

      const count = countVal ? Number(StellarSdk.scValToNative(countVal)) : 0;
      const allWorks: RegistryWork[] = [];

      // Fetch up to the last 50 works for performance
      const start = Math.max(1, count - 50);
      
      for (let i = count; i >= start; i--) {
        try {
          const recordVal = await stellar.simulateRead({
            publicKey,
            contractId: REGISTRY_CONTRACT_ID,
            method: 'get_record',
            args: [StellarSdk.nativeToScVal(i, { type: 'u32' })],
          });

          if (recordVal) {
            const record = StellarSdk.scValToNative(recordVal);
            allWorks.push({
              id: String(record.id || i),
              title: String(record.title || `Work #${i}`),
              creator: String(record.creator || ''),
              fileHash: record.file_hash ? Buffer.from(record.file_hash).toString('hex') : '',
              timestamp: record.timestamp ? new Date(Number(record.timestamp) * 1000).toLocaleString() : '',
            });
          }
        } catch {
          // Skip if fetching a specific record fails
        }
      }

      setWorks(allWorks);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load registry explorer');
    } finally {
      setLoading(false);
    }
  }, [isConnected, publicKey]);

  useEffect(() => {
    loadExplorer();
  }, [loadExplorer]);

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    w.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-12 min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <HiOutlineGlobeAlt className="h-8 w-8 text-brand-400" />
              <span className="gradient-text">Global Explorer</span>
            </h1>
            <p className="text-sm text-slate-400">
              Browse all immutable intellectual property registrations on the CopyrightStellar network.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by Title or Creator..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-9 w-full text-sm"
            />
          </div>
        </div>

        {!isConnected ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <HiOutlineGlobeAlt className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-300 font-medium mb-2">Connect your wallet to explore</p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              You need a connected Stellar wallet to read from the Soroban smart contracts on the testnet.
            </p>
          </div>
        ) : loading ? (
          <div className="glass-card p-12 text-center flex flex-col items-center">
            <HiOutlineArrowPath className="h-8 w-8 animate-spin text-brand-400 mb-4" />
            <p className="text-sm text-slate-400">Syncing with Stellar Soroban...</p>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-slate-400 mb-2">No registrations found.</p>
            {searchQuery && <p className="text-xs text-slate-500">Try adjusting your search criteria.</p>}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredWorks.map((work) => (
              <div key={work.id} className="glass-card p-5 transition-all hover:border-brand-500/30 hover:bg-surface-800/80">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge label={`ID #${work.id}`} variant="outline" />
                      <h3 className="font-semibold text-slate-200 text-lg">{work.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Creator / Owner</p>
                        <Link href={`/creator/${work.creator}`} className="text-sm font-mono text-brand-400 hover:text-brand-300 transition-colors">
                          {work.creator.slice(0, 8)}...{work.creator.slice(-8)}
                        </Link>
                      </div>
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
