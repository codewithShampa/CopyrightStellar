'use client';

import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { HiOutlineArrowDownTray } from 'react-icons/hi2';

interface CertificateProps {
  id: string;
  title: string;
  creator: string;
  fileHash: string;
  timestamp: string;
  network?: string;
}

export default function Certificate({ id, title, creator, fileHash, timestamp, network = 'Stellar Soroban Testnet' }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#0f172a', // slate-900
      });
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `CopyrightStellar-Certificate-${id}.png`;
      link.href = image;
      link.click();
    } catch (err) {
      console.error('Failed to generate certificate:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center w-full">
      <button 
        onClick={downloadCertificate}
        disabled={downloading}
        aria-label="Download official copyright registration certificate as PNG"
        className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-2"
      >
        <HiOutlineArrowDownTray className="h-4 w-4" aria-hidden="true" />
        {downloading ? 'Generating...' : 'Download Official Certificate'}
      </button>

      {/* Hidden Certificate Container for capturing */}
      <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
        <div 
          ref={certificateRef}
          className="w-[800px] h-[600px] p-12 bg-slate-900 border-[8px] border-double border-brand-500/50 flex flex-col justify-between items-center text-center relative"
          style={{ fontFamily: 'sans-serif' }}
        >
          <div className="w-full pt-4">
            <h1 className="text-4xl font-serif text-brand-300 tracking-widest uppercase mb-2">Certificate of Registration</h1>
            <p className="text-slate-400 tracking-widest text-sm uppercase">Intellectual Property & Copyright Registry</p>
          </div>

          <div className="w-full my-8 space-y-6">
            <p className="text-slate-300 text-lg italic">This is to certify that the intellectual property titled</p>
            <h2 className="text-3xl font-bold text-slate-100">{title}</h2>
            <p className="text-slate-300 text-lg italic">has been immutably registered on the {network} by</p>
            <p className="text-xl font-mono text-brand-400">{creator}</p>
          </div>

          <div className="w-full text-left bg-slate-800/80 border border-brand-500/20 p-6 rounded-lg mt-auto z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registration ID</p>
                <p className="text-sm text-slate-200 font-mono">#{id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Registered Timestamp</p>
                <p className="text-sm text-slate-200">{timestamp}</p>
              </div>
              <div className="col-span-2 mt-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Cryptographic Proof (SHA-256)</p>
                <p className="text-xs text-slate-300 font-mono break-all">{fileHash}</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-12 opacity-40 text-right pointer-events-none">
            <h3 className="text-2xl font-bold text-brand-500 mb-1">© CopyrightStellar</h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest">DECENTRALIZED IP REGISTRY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
