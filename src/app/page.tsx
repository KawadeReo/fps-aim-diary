'use client';

import { useState } from 'react';
import Link from 'next/link';

// エイム評価項目の定義
const aimCategories = [
  { key: 'flickAim', label: 'フリックエイム精度', defaultValue: 3 },
  { key: 'trackingAim', label: 'トラッキングエイム精度', defaultValue: 3 },
  { key: 'reactionSpeed', label: '反応速度', defaultValue: 3 },
  { key: 'crosshairPlacement', label: 'クロスヘア配置', defaultValue: 3 },
  { key: 'peeking', label: 'ピーキング精度', defaultValue: 3 },
  { key: 'movement', label: 'エイム中の移動', defaultValue: 3 },
  { key: 'consistency', label: '安定性', defaultValue: 3 },
  { key: 'focus', label: '集中力', defaultValue: 3 },
  { key: 'decisionMaking', label: '判断力', defaultValue: 3 },
  { key: 'totalScore', label: '総合評価', defaultValue: 3 }
];

// ゲーム別の表示項目設定
const gamePresets = {
  valorant: {
    name: 'Valorant',
    categories: ['flickAim', 'trackingAim', 'reactionSpeed', 'crosshairPlacement', 'peeking', 'focus', 'decisionMaking', 'totalScore']
  },
  apex: {
    name: 'Apex Legends', 
    categories: ['flickAim', 'trackingAim', 'reactionSpeed', 'movement', 'consistency', 'focus', 'totalScore']
  },
  cs2: {
    name: 'Counter-Strike 2',
    categories: ['flickAim', 'trackingAim', 'reactionSpeed', 'crosshairPlacement', 'peeking', 'consistency', 'focus', 'totalScore']
  },
  overwatch: {
    name: 'Overwatch 2',
    categories: ['flickAim', 'trackingAim', 'reactionSpeed', 'movement', 'focus', 'decisionMaking', 'totalScore']
  },
  custom: {
    name: 'カスタム',
    categories: aimCategories.map(cat => cat.key)
  }
};

// 拡張デバイスデータ（現実的なスケール）
const mockDevices = [
  // 人気TOP機種
  { id: 1, brand: 'Logitech', model: 'G Pro X Superlight', popularity: 1250, category: 'gaming', verified: true, release_year: 2020 },
  { id: 2, brand: 'Razer', model: 'DeathAdder V3 Pro', popularity: 980, category: 'gaming', verified: true, release_year: 2022 },
  { id: 3, brand: 'Zowie', model: 'EC2-C', popularity: 850, category: 'gaming', verified: true, release_year: 2021 },
  { id: 4, brand: 'SteelSeries', model: 'Rival 600', popularity: 720, category: 'gaming', verified: true, release_year: 2019 },
  { id: 5, brand: 'Finalmouse', model: 'Starlight-12', popularity: 650, category: 'gaming', verified: true, release_year: 2021 },
  
  // メジャーブランド追加機種
  { id: 6, brand: 'Logitech', model: 'G403 HERO', popularity: 520, category: 'gaming', verified: true, release_year: 2018 },
  { id: 7, brand: 'Razer', model: 'Viper V3 Pro', popularity: 480, category: 'gaming', verified: true, release_year: 2023 },
  { id: 8, brand: 'Logitech', model: 'G502 X', popularity: 450, category: 'gaming', verified: true, release_year: 2022 },
  { id: 9, brand: 'Zowie', model: 'FK2-C', popularity: 380, category: 'gaming', verified: true, release_year: 2021 },
  { id: 10, brand: 'SteelSeries', model: 'Prime Wireless', popularity: 350, category: 'gaming', verified: true, release_year: 2021 },
  
  // 新興・専門ブランド
  { id: 11, brand: 'Pulsar', model: 'X2 Mini', popularity: 280, category: 'gaming', verified: true, release_year: 2023 },
  { id: 12, brand: 'Endgame Gear', model: 'OP1 8K', popularity: 250, category: 'gaming', verified: true, release_year: 2022 },
  { id: 13, brand: 'Glorious', model: 'Model O Wireless', popularity: 220, category: 'gaming', verified: true, release_year: 2021 },
  { id: 14, brand: 'HyperX', model: 'Pulsefire Haste', popularity: 180, category: 'gaming', verified: true, release_year: 2020 },
  { id: 15, brand: 'Corsair', model: 'M65 RGB Ultra', popularity: 150, category: 'gaming', verified: true, release_year: 2022 },
  
  // 日本・アジア系
  { id: 16, brand: 'エレコム', model: 'M-DUX50BK', popularity: 95, category: 'office', verified: true, release_year: 2021 },
  { id: 17, brand: 'バッファロー', model: 'BSMBW300M', popularity: 80, category: 'budget', verified: true, release_year: 2020 },
  { id: 18, brand: 'Artisan', model: 'ZF-1', popularity: 65, category: 'gaming', verified: true, release_year: 2019 },
  
  // 最新・話題機種
  { id: 19, brand: 'Lamzu', model: 'Atlantis Mini', popularity: 45, category: 'gaming', verified: true, release_year: 2023 },
  { id: 20, brand: 'Vaxee', model: 'OUTSET AX', popularity: 35, category: 'gaming', verified: true, release_year: 2023 },
];

// ユーザーの使用履歴（LocalStorageから取得想定）
const mockUserHistory = [
  { deviceId: 1, count: 15, lastUsed: '2024-06-26' },
  { deviceId: 2, count: 8, lastUsed: '2024-06-20' },
  { deviceId: 3, count: 3, lastUsed: '2024-06-15' },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<keyof typeof gamePresets>('valorant');
  const [selectedDevice, setSelectedDevice] = useState<number | ''>('');
  const [deviceSearch, setDeviceSearch] = useState('');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'popular' | 'recent' | 'history'>('all');
  const [formData, setFormData] = useState(() => {
    const initialData: Record<string, number | string> = {
      shortComment: '',
      memo: ''
    };
    // 全項目をデフォルト値で初期化
    aimCategories.forEach(cat => {
      initialData[cat.key] = cat.defaultValue;
    });
    return initialData;
  });

  const handleSliderChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGameChange = (game: keyof typeof gamePresets) => {
    setSelectedGame(game);
  };

  // デバイス検索とフィルタリング
  const getFilteredDevices = () => {
    let devices = mockDevices;

    // 検索フィルター
    if (deviceSearch) {
      devices = devices.filter(device =>
        device.brand.toLowerCase().includes(deviceSearch.toLowerCase()) ||
        device.model.toLowerCase().includes(deviceSearch.toLowerCase())
      );
    }

    // カテゴリフィルター
    switch (deviceFilter) {
      case 'popular':
        devices = devices.filter(d => d.popularity > 500).sort((a, b) => b.popularity - a.popularity);
        break;
      case 'recent':
        devices = devices.filter(d => d.release_year >= 2022).sort((a, b) => b.release_year - a.release_year);
        break;
      case 'history':
        const historyIds = mockUserHistory.map(h => h.deviceId);
        devices = devices.filter(d => historyIds.includes(d.id))
          .sort((a, b) => {
            const aHistory = mockUserHistory.find(h => h.deviceId === a.id);
            const bHistory = mockUserHistory.find(h => h.deviceId === b.id);
            return (bHistory?.count || 0) - (aHistory?.count || 0);
          });
        break;
      default:
        devices = devices.sort((a, b) => b.popularity - a.popularity);
    }

    return devices;
  };

  const getDeviceDisplayInfo = (device: typeof mockDevices[0]) => {
    const history = mockUserHistory.find(h => h.deviceId === device.id);
    const isNew = device.release_year >= 2023;
    const isPopular = device.popularity > 500;
    
    return {
      ...device,
      userCount: history?.count || 0,
      lastUsed: history?.lastUsed,
      isNew,
      isPopular,
      badges: [
        ...(isNew ? ['新着'] : []),
        ...(isPopular ? ['人気'] : []),
        ...(device.verified ? ['公式'] : []),
        ...(history ? [`${history.count}回使用`] : [])
      ]
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const gameConfig = gamePresets[selectedGame];
    const selectedDeviceInfo = selectedDevice ? mockDevices.find(d => d.id === selectedDevice) : null;
    
    const filteredData = {
      game: gameConfig.name,
      device: selectedDeviceInfo ? `${selectedDeviceInfo.brand} ${selectedDeviceInfo.model}` : null,
      deviceId: selectedDevice || null,
      ...Object.fromEntries(
        Object.entries(formData).filter(([key]) => 
          gameConfig.categories.includes(key) || ['shortComment', 'memo'].includes(key)
        )
      )
    };
    console.log('記録データ:', filteredData);
    // TODO: API呼び出し
  };

  const currentGameConfig = gamePresets[selectedGame];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          今日のエイム記録
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ゲーム選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ゲーム選択
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(gamePresets).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleGameChange(key as keyof typeof gamePresets)}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    selectedGame === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {config.name}
                </button>
              ))}
            </div>
          </div>

          {/* デバイス選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              使用マウス（任意）
            </label>
            
            {/* 前回使用デバイス・クイック選択 */}
            {!showDeviceSelector && (
              <div className="space-y-3">
                {/* 前回使用 */}
                {mockUserHistory.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">前回使用したマウス</div>
                    {(() => {
                      const lastDevice = mockDevices.find(d => d.id === mockUserHistory[0].deviceId);
                      return lastDevice ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDevice(lastDevice.id)}
                          className={`w-full px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                            selectedDevice === lastDevice.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{lastDevice.brand} {lastDevice.model}</div>
                              <div className="text-xs opacity-75">{mockUserHistory[0].count}回使用 • {mockUserHistory[0].lastUsed}</div>
                            </div>
                            {selectedDevice === lastDevice.id && <span className="text-xs">✓</span>}
                          </div>
                        </button>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* 人気TOP5 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">人気デバイス TOP5</div>
                  <div className="grid grid-cols-1 gap-2">
                    {mockDevices.slice(0, 5).map((device, index) => (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() => setSelectedDevice(device.id)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                          selectedDevice === device.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">#{index + 1}</span>
                              <span className="font-medium">{device.brand} {device.model}</span>
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">🔥 {device.popularity}</span>
                            </div>
                          </div>
                          {selectedDevice === device.id && <span className="text-xs">✓</span>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* その他のマウスを探す */}
                <button
                  type="button"
                  onClick={() => setShowDeviceSelector(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
                >
                  🔍 その他のマウスを探す（{mockDevices.length}機種から検索）
                </button>
              </div>
            )}

            {/* 詳細デバイス選択モード */}
            {showDeviceSelector && (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900">マウス検索</h3>
                  <button
                    type="button"
                    onClick={() => setShowDeviceSelector(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* 検索とフィルター */}
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={deviceSearch}
                    onChange={(e) => setDeviceSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ブランド・モデル名で検索..."
                  />
                  
                  <div className="flex gap-2">
                    {[
                      { key: 'all', label: '全て' },
                      { key: 'popular', label: '人気' },
                      { key: 'recent', label: '最新' },
                      { key: 'history', label: '履歴' }
                    ].map(filter => (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => setDeviceFilter(filter.key as 'all' | 'popular' | 'recent' | 'history')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          deviceFilter === filter.key
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* デバイス一覧 */}
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {getFilteredDevices().map(device => {
                    const info = getDeviceDisplayInfo(device);
                    return (
                      <button
                        key={device.id}
                        type="button"
                        onClick={() => {
                          setSelectedDevice(device.id);
                          setShowDeviceSelector(false);
                        }}
                        className={`w-full px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                          selectedDevice === device.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{device.brand} {device.model}</div>
                            <div className="flex gap-1 mt-1">
                              {info.badges.slice(0, 3).map((badge, index) => (
                                <span
                                  key={index}
                                  className={`text-xs px-2 py-0.5 rounded ${
                                    selectedDevice === device.id
                                      ? 'bg-blue-500 text-blue-100'
                                      : badge.includes('人気')
                                        ? 'bg-red-100 text-red-800'
                                        : badge.includes('新着')
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 選択中表示 */}
            {selectedDevice && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-800">
                  選択中: <span className="font-medium">
                    {mockDevices.find(d => d.id === selectedDevice)?.brand}{' '}
                    {mockDevices.find(d => d.id === selectedDevice)?.model}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedDevice('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    選択解除
                  </button>
                </div>
              </div>
            )}

            <div className="mt-3 text-sm text-gray-500">
              お使いのマウスが見つからない場合は{' '}
              <Link href="/devices" className="text-blue-600 hover:underline">
                デバイス管理ページ
              </Link>
              {' '}で追加してください
            </div>
          </div>

          {/* 5段階評価項目 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              {currentGameConfig.name}の評価項目
            </h3>
            
            {aimCategories
              .filter(category => currentGameConfig.categories.includes(category.key))
              .map(category => (
                <div key={category.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {category.label}: {formData[category.key]}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData[category.key]}
                    onChange={(e) => handleSliderChange(category.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  </div>
                </div>
              ))}
          </div>

          {/* コメント欄 */}
          <div className="border-t pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ひとことコメント
              </label>
              <input
                type="text"
                value={formData.shortComment}
                onChange={(e) => setFormData(prev => ({ ...prev, shortComment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="今日の調子は..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                詳細メモ（任意）
              </label>
              <textarea
                value={formData.memo}
                onChange={(e) => setFormData(prev => ({ ...prev, memo: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="詳細な記録や気づいたこと..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            記録を保存
          </button>
        </form>
      </div>
    </div>
  );
}
