'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [url, setUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedLink('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }), // settings are loaded on the server now
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedLink(data.link);
      } else {
        setError(data.error || 'Lỗi tạo link');
      }
    } catch {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 right-6">
        <Link href="/login" className="text-orange-600 hover:text-orange-800 font-medium text-sm">
          Đăng nhập Quản Trị
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100/50">
        <div className="p-8 text-center bg-orange-500 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
            <LinkIcon className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Tạo Link Shopee Affiliate</h1>
          <p className="text-orange-100">Dán link sản phẩm Shopee vào bên dưới để tạo link rút gọn</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon className="h-6 w-6 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Dán link Shopee vào đây (VD: https://shope.ee/...)"
                  className="pl-12 w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-lg text-gray-700 placeholder-gray-400"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-3 ml-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold p-5 rounded-2xl shadow-[0_8px_20px_-6px_rgba(249,115,22,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(249,115,22,0.6)] transition-all disabled:opacity-70 disabled:pointer-events-none text-xl"
            >
              {loading ? 'Đang tạo link...' : '🚀 Tạo Link Ngay'}
            </button>
          </form>

          {generatedLink && (
            <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl relative">
                <div className="absolute -top-3 left-6 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
                  Link đã sẵn sàng!
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 w-full p-4 bg-white border border-orange-200 rounded-xl text-gray-800 outline-none font-medium text-center sm:text-left focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleCopy}
                      className={`flex-1 sm:flex-none p-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all ${
                        copied 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                          : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:shadow-lg hover:shadow-orange-500/20'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Đã Copy</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <a
                      href={generatedLink}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 bg-white border-2 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center"
                      title="Mở tab mới"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Shopee Affiliate Tool. All rights reserved.</p>
      </div>
    </div>
  );
}
