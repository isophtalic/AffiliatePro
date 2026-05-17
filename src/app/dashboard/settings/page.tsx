'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import type { AffiliateSettings } from '@/lib/config-store';

const DEFAULT_SETTINGS: AffiliateSettings = {
  affiliateId: '',
  subIds: [''],
  articleLink: '',
  pageLink: '',
};

export default function SettingsPage() {
  const [formData, setFormData] = useState<AffiliateSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch from server on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.success && data.settings) {
          setFormData(data.settings);
        }
      })
      .catch((err) => console.error('Failed to fetch settings', err))
      .finally(() => {
        if (!cancelled) setIsLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubIdChange = (index: number, value: string) => {
    const updated = [...formData.subIds];
    updated[index] = value;
    setFormData({ ...formData, subIds: updated });
  };

  const addSubId = () => {
    setFormData({ ...formData, subIds: [...formData.subIds, ''] });
  };

  const removeSubId = (index: number) => {
    const updated = formData.subIds.filter((_, i) => i !== index);
    setFormData({ ...formData, subIds: updated.length ? updated : [''] });
  };

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const cleaned: AffiliateSettings = {
      ...formData,
      subIds: formData.subIds.filter((id) => id.trim() !== '') || [''],
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleaned),
      });

      const data = await res.json();
      if (data.success) {
        setFormData(cleaned);
        setMessage({ type: 'success', text: 'Lưu cấu hình thành công!' });
      } else {
        console.log(data.error);
        setMessage({ type: 'error', text: 'Lỗi khi lưu cấu hình' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `Lỗi kết nối: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Đang tải cấu hình...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-2xl font-bold text-gray-800">Cấu hình Affiliate</h1>
        <p className="text-gray-500 mt-1">Cài đặt các thông số ID Affiliate để áp dụng cho việc tạo link.</p>
      </div>

      <div className="p-6">
        {message.text && (
          <div
            className={`p-4 rounded-lg mb-6 text-sm font-medium ${message.type === 'success'
              ? 'bg-green-50 text-green-600 border border-green-100'
              : 'bg-red-50 text-red-600 border border-red-100'
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Affiliate ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Affiliate ID</label>
              <input
                type="text"
                name="affiliateId"
                value={formData.affiliateId}
                onChange={handleChange}
                placeholder="VD: 12345678"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              />
              <p className="text-xs text-gray-400">ID Affiliate chính của bạn (aff_id)</p>
            </div>

            {/* Link bài viết */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Link bài viết</label>
              <input
                type="text"
                name="articleLink"
                value={formData.articleLink}
                onChange={handleChange}
                placeholder="VD: https://yoursite.com/article"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              />
            </div>

            {/* Page Link */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Trang</label>
              <input
                type="text"
                name="pageLink"
                value={formData.pageLink}
                onChange={handleChange}
                placeholder="Tên trang / URL"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Sub IDs — dynamic list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Sub IDs</label>
                <p className="text-xs text-gray-400 mt-0.5">Các thông số theo dõi phụ (sub_id). Sẽ được nối bằng dấu phẩy.</p>
              </div>
              <button
                type="button"
                onClick={addSubId}
                className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm Sub ID
              </button>
            </div>
            <div className="space-y-2">
              {formData.subIds && formData.subIds.map((subId, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-6 text-right shrink-0">{index + 1}.</span>
                  <input
                    type="text"
                    value={subId}
                    onChange={(e) => handleSubIdChange(index, e.target.value)}
                    placeholder={`Sub ID ${index + 1} — VD: tracking123`}
                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubId(index)}
                    disabled={formData.subIds.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
