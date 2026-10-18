"use client";
import { useState } from 'react';

export function CopyLink({ path }: { path: string }) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle');
  async function copy() {
    setStatus('copying');
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).href);
      setStatus('success');
    } catch { setStatus('error'); }
  }
  return <div className="share-control">
    <button type="button" className="action-button" onClick={copy} disabled={status === 'copying'}>{status === 'copying' ? 'Menyalin…' : 'Salin tautan'}</button>
    <p role="status">{status === 'success' ? 'Tautan berhasil disalin.' : status === 'error' ? 'Gagal menyalin. Salin alamat dari bilah browser atau coba lagi.' : ''}</p>
  </div>;
}
