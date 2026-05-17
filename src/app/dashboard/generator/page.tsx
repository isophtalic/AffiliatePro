'use client';

import { useState } from 'react';
import { Link as LinkIcon, Copy, ExternalLink, CheckCircle } from 'lucide-react';

export default function GeneratorPage() {
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-2xl font-bold text-gray-800">Tạo Link Affiliate</h1>
        <p className="text-gray-500 mt-1">Chuyển đổi link Shopee thông thường thành link Affiliate.</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Link Shopee gốc</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://shope.ee/..."
                className="pl-10 w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !url}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold p-4 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Đang xử lý...' : 'Tạo Link'}
          </button>
        </form>

        {generatedLink && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="text-sm font-semibold text-green-800 mb-2">Link Affiliate của bạn:</h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 p-3 bg-white border border-green-200 rounded-lg text-gray-800 outline-none"
              />
              <button
                onClick={handleCopy}
                className={`p-3 rounded-lg flex items-center justify-center transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-white border border-green-200 text-green-600 hover:bg-green-100'
                  }`}
                title="Copy link"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              <a
                href={generatedLink}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white border border-green-200 text-green-600 hover:bg-green-100 rounded-lg transition-colors flex items-center justify-center"
                title="Mở link"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
