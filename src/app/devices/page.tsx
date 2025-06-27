'use client';

import { useState } from 'react';

// 仮のデバイスデータ（後でAPIから取得）
const mockDevices = [
  { id: 1, brand: 'Logitech', model: 'G Pro X Superlight', createdBy: 'system', createdAt: '2024-01-01' },
  { id: 2, brand: 'Razer', model: 'DeathAdder V3 Pro', createdBy: 'system', createdAt: '2024-01-01' },
  { id: 3, brand: 'SteelSeries', model: 'Rival 600', createdBy: 'system', createdAt: '2024-01-01' },
  { id: 4, brand: 'Zowie', model: 'EC2-C', createdBy: 'system', createdAt: '2024-01-01' },
  { id: 5, brand: 'Finalmouse', model: 'Starlight-12', createdBy: 'system', createdAt: '2024-01-01' },
  { id: 6, brand: 'Logitech', model: 'G403 HERO', createdBy: 'user1', createdAt: '2024-01-15' },
  { id: 7, brand: 'Razer', model: 'Viper V3 Pro', createdBy: 'user2', createdAt: '2024-02-01' },
];

export default function DevicesPage() {
  const [devices, setDevices] = useState(mockDevices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDevice, setNewDevice] = useState({ brand: '', model: '' });

  // ブランド一覧を取得
  const brands = ['', ...Array.from(new Set(devices.map(d => d.brand)))];

  // フィルタリング
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === '' || device.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // 新規デバイス追加
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDevice.brand.trim() && newDevice.model.trim()) {
      const device = {
        id: Math.max(...devices.map(d => d.id)) + 1,
        brand: newDevice.brand.trim(),
        model: newDevice.model.trim(),
        createdBy: 'current_user', // 実際は認証されたユーザー
        createdAt: new Date().toISOString().split('T')[0]
      };
      setDevices([...devices, device]);
      setNewDevice({ brand: '', model: '' });
      setShowAddForm(false);
      console.log('新規デバイス追加:', device);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            デバイス管理
          </h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            新規デバイス追加
          </button>
        </div>

        {/* 新規追加フォーム */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              新規デバイス追加
            </h3>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ブランド
                  </label>
                  <input
                    type="text"
                    value={newDevice.brand}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, brand: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: Logitech"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    モデル名
                  </label>
                  <input
                    type="text"
                    value={newDevice.model}
                    onChange={(e) => setNewDevice(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: G Pro X Superlight"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewDevice({ brand: '', model: '' });
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 検索・フィルター */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              検索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ブランドまたはモデル名で検索..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ブランドでフィルター
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのブランド</option>
              {brands.slice(1).map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>

        {/* デバイス一覧 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              デバイス一覧 ({filteredDevices.length}件)
            </h3>
          </div>

          {filteredDevices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              条件に一致するデバイスが見つかりません
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map(device => (
                <div
                  key={device.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-gray-900">
                    {device.brand}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {device.model}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      登録者: {device.createdBy}
                    </div>
                    <div className="text-xs text-gray-500">
                      {device.createdAt}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}