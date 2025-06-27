'use client';

import { useState } from 'react';

// 仮の記録データ
const mockRecords = [
  {
    id: 1,
    date: '2024-06-27',
    game: 'Valorant',
    device: 'Logitech G Pro X Superlight',
    scores: { flickAim: 4, trackingAim: 4, reactionSpeed: 3, crosshairPlacement: 4, peeking: 3, focus: 4, decisionMaking: 3, totalScore: 4 },
    shortComment: '調子良好！',
    memo: 'フリックが安定していた'
  },
  {
    id: 2,
    date: '2024-06-26',
    game: 'Valorant',
    device: 'Logitech G Pro X Superlight',
    scores: { flickAim: 3, trackingAim: 4, reactionSpeed: 4, crosshairPlacement: 3, peeking: 4, focus: 3, decisionMaking: 4, totalScore: 4 },
    shortComment: 'まずまず',
    memo: 'トラッキングが良かった'
  },
  {
    id: 3,
    date: '2024-06-25',
    game: 'Apex Legends',
    device: 'Razer DeathAdder V3 Pro',
    scores: { flickAim: 5, trackingAim: 4, reactionSpeed: 4, movement: 5, consistency: 3, focus: 4, totalScore: 4 },
    shortComment: 'フリック絶好調',
    memo: 'Apexのフリックが冴えていた'
  },
  {
    id: 4,
    date: '2024-06-24',
    game: 'Counter-Strike 2',
    device: 'Zowie EC2-C',
    scores: { flickAim: 2, trackingAim: 3, reactionSpeed: 2, crosshairPlacement: 3, peeking: 2, consistency: 2, focus: 2, totalScore: 2 },
    shortComment: '調子悪い...',
    memo: '疲れていた'
  },
  {
    id: 5,
    date: '2024-06-23',
    game: 'Valorant',
    device: 'Logitech G Pro X Superlight',
    scores: { flickAim: 4, trackingAim: 5, reactionSpeed: 4, crosshairPlacement: 4, peeking: 4, focus: 5, decisionMaking: 4, totalScore: 4 },
    shortComment: 'かなり良い',
    memo: '長時間プレイでも集中できた'
  },
  {
    id: 6,
    date: '2024-06-22',
    game: 'Apex Legends',
    device: 'Finalmouse Starlight-12',
    scores: { flickAim: 3, trackingAim: 3, reactionSpeed: 3, movement: 4, consistency: 3, focus: 3, totalScore: 3 },
    shortComment: '普通',
    memo: ''
  },
  {
    id: 7,
    date: '2024-06-21',
    game: 'Valorant',
    device: 'Logitech G Pro X Superlight',
    scores: { flickAim: 5, trackingAim: 4, reactionSpeed: 5, crosshairPlacement: 5, peeking: 4, focus: 4, decisionMaking: 5, totalScore: 5 },
    shortComment: '最高の調子！',
    memo: 'ランクマで連勝した'
  }
];

export default function HistoryPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'chart'>('list');
  const [filterGame, setFilterGame] = useState('');
  const [filterDevice, setFilterDevice] = useState('');
  const [dateRange, setDateRange] = useState('');

  // フィルタリング
  const filteredRecords = mockRecords.filter(record => {
    const matchesGame = filterGame === '' || record.game === filterGame;
    const matchesDevice = filterDevice === '' || record.device === filterDevice;
    // 日付フィルターは後で実装
    return matchesGame && matchesDevice;
  });

  // 統計計算
  const stats = {
    totalRecords: filteredRecords.length,
    averageTotal: filteredRecords.reduce((sum, r) => sum + r.scores.totalScore, 0) / filteredRecords.length,
    bestScore: Math.max(...filteredRecords.map(r => r.scores.totalScore)),
    recentTrend: filteredRecords.slice(0, 3).reduce((sum, r) => sum + r.scores.totalScore, 0) / Math.min(3, filteredRecords.length)
  };

  // ユニークな値を取得
  const games = [...new Set(mockRecords.map(r => r.game))];
  const devices = [...new Set(mockRecords.map(r => r.device))];

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600 bg-green-100';
    if (score >= 3.5) return 'text-blue-600 bg-blue-100';
    if (score >= 2.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 4.5) return '🔥';
    if (score >= 3.5) return '😊';
    if (score >= 2.5) return '😐';
    return '😓';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">記録履歴</h2>
          
          {/* 表示モード切替 */}
          <div className="flex space-x-2">
            {[
              { key: 'list', label: 'リスト', icon: '📋' },
              { key: 'calendar', label: 'カレンダー', icon: '📅' },
              { key: 'chart', label: 'グラフ', icon: '📈' }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as 'list' | 'calendar' | 'chart')}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  viewMode === mode.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mode.icon} {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">総記録数</div>
            <div className="text-2xl font-bold text-blue-900">{stats.totalRecords}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">平均スコア</div>
            <div className="text-2xl font-bold text-green-900">
              {stats.averageTotal.toFixed(1)} {getScoreEmoji(stats.averageTotal)}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">最高スコア</div>
            <div className="text-2xl font-bold text-yellow-900">
              {stats.bestScore} {getScoreEmoji(stats.bestScore)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">最近の調子</div>
            <div className="text-2xl font-bold text-purple-900">
              {stats.recentTrend.toFixed(1)} {getScoreEmoji(stats.recentTrend)}
            </div>
          </div>
        </div>

        {/* フィルター */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ゲーム</label>
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのゲーム</option>
              {games.map(game => (
                <option key={game} value={game}>{game}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">デバイス</label>
            <select
              value={filterDevice}
              onChange={(e) => setFilterDevice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのデバイス</option>
              {devices.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">期間</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全期間</option>
              <option value="7">過去7日</option>
              <option value="30">過去30日</option>
              <option value="90">過去3ヶ月</option>
            </select>
          </div>
        </div>

        {/* リスト表示 */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredRecords.map(record => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900">{record.date}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{record.game}</span>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${getScoreColor(record.scores.totalScore)}`}>
                        総合: {record.scores.totalScore} {getScoreEmoji(record.scores.totalScore)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{record.device}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  {Object.entries(record.scores).filter(([key]) => key !== 'totalScore').map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        {key === 'flickAim' ? 'フリック' :
                         key === 'trackingAim' ? 'トラッキング' :
                         key === 'reactionSpeed' ? '反応速度' :
                         key === 'crosshairPlacement' ? 'クロスヘア' :
                         key === 'peeking' ? 'ピーキング' :
                         key === 'movement' ? '移動' :
                         key === 'consistency' ? '安定性' :
                         key === 'focus' ? '集中力' :
                         key === 'decisionMaking' ? '判断力' : key}
                      </div>
                      <div className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(value)}`}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {record.shortComment && (
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-700">コメント: </span>
                    <span className="text-sm text-gray-600">{record.shortComment}</span>
                  </div>
                )}

                {record.memo && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {record.memo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* カレンダー表示 */}
        {viewMode === 'calendar' && (
          <div className="space-y-4">
            {(() => {
              const today = new Date();
              const year = today.getFullYear();
              const month = today.getMonth();
              
              // 月の最初の日と最後の日を取得
              const firstDay = new Date(year, month, 1);
              
              // カレンダーの開始日（月曜始まり）
              const startDate = new Date(firstDay);
              const dayOfWeek = (firstDay.getDay() + 6) % 7; // 月曜日を0にする
              startDate.setDate(firstDay.getDate() - dayOfWeek);
              
              // 42日分の日付を生成（6週分）
              const calendarDays = [];
              for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                calendarDays.push(date);
              }
              
              // 日付をYYYY-MM-DD形式に変換する関数
              const formatDate = (date: Date) => {
                return date.toISOString().split('T')[0];
              };
              
              // 各日付の記録を取得
              const getRecordForDate = (date: Date) => {
                const dateStr = formatDate(date);
                return filteredRecords.find(record => record.date === dateStr);
              };
              
              return (
                <div>
                  {/* カレンダーヘッダー */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">
                        {year}年{month + 1}月
                      </h3>
                      <div className="flex gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>良好 (4-5)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span>普通 (3-4)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>不調 (2-3)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span>悪い (1-2)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 曜日ヘッダー */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['月', '火', '水', '木', '金', '土', '日'].map((day, index) => (
                      <div
                        key={day}
                        className={`text-center text-sm font-medium py-2 ${
                          index >= 5 ? 'text-red-600' : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* カレンダーグリッド */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      const record = getRecordForDate(date);
                      const isCurrentMonth = date.getMonth() === month;
                      const isToday = formatDate(date) === formatDate(today);
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      
                      let bgColor = 'bg-white';
                      let textColor = 'text-gray-400';
                      
                      if (isCurrentMonth) {
                        textColor = isWeekend ? 'text-red-600' : 'text-gray-900';
                        
                        if (record) {
                          const score = record.scores.totalScore;
                          if (score >= 4.5) bgColor = 'bg-green-200 hover:bg-green-300';
                          else if (score >= 3.5) bgColor = 'bg-blue-200 hover:bg-blue-300';
                          else if (score >= 2.5) bgColor = 'bg-yellow-200 hover:bg-yellow-300';
                          else bgColor = 'bg-red-200 hover:bg-red-300';
                        } else {
                          bgColor = 'bg-gray-50 hover:bg-gray-100';
                        }
                      }
                      
                      if (isToday) {
                        bgColor = bgColor.replace('bg-', 'bg-opacity-70 ring-2 ring-blue-500 bg-');
                      }
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[80px] p-2 border border-gray-200 rounded transition-colors cursor-pointer ${bgColor} ${textColor}`}
                          title={record ? `${record.game} - スコア: ${record.scores.totalScore} - ${record.shortComment}` : ''}
                        >
                          <div className="font-medium text-sm">
                            {date.getDate()}
                          </div>
                          {record && isCurrentMonth && (
                            <div className="mt-1">
                              <div className="text-xs font-bold">
                                {record.scores.totalScore} {getScoreEmoji(record.scores.totalScore)}
                              </div>
                              <div className="text-xs truncate mt-1 opacity-75">
                                {record.game}
                              </div>
                              {record.shortComment && (
                                <div className="text-xs truncate mt-1 opacity-60">
                                  {record.shortComment}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* 月間サマリー */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {month + 1}月のサマリー
                    </h4>
                    {(() => {
                      const monthRecords = filteredRecords.filter(record => {
                        const recordDate = new Date(record.date);
                        return recordDate.getMonth() === month && recordDate.getFullYear() === year;
                      });
                      
                      if (monthRecords.length === 0) {
                        return (
                          <div className="text-gray-500 text-sm">
                            この月の記録はありません
                          </div>
                        );
                      }
                      
                      const monthlyAverage = monthRecords.reduce((sum, r) => sum + r.scores.totalScore, 0) / monthRecords.length;
                      const bestDay = monthRecords.reduce((best, current) => 
                        current.scores.totalScore > best.scores.totalScore ? current : best
                      );
                      const gamesPlayed = [...new Set(monthRecords.map(r => r.game))];
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">
                              {monthRecords.length}
                            </div>
                            <div className="text-sm text-gray-600">記録日数</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {monthlyAverage.toFixed(1)} {getScoreEmoji(monthlyAverage)}
                            </div>
                            <div className="text-sm text-gray-600">月間平均</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-yellow-600">
                              {bestDay.scores.totalScore} {getScoreEmoji(bestDay.scores.totalScore)}
                            </div>
                            <div className="text-sm text-gray-600">
                              最高スコア<br />
                              <span className="text-xs">({bestDay.date})</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">
                              {gamesPlayed.length}
                            </div>
                            <div className="text-sm text-gray-600">
                              プレイゲーム<br />
                              <span className="text-xs">({gamesPlayed.join(', ')})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* グラフ表示 */}
        {viewMode === 'chart' && (
          <div className="space-y-6">
            {/* 総合スコア推移 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">総合スコア推移</h3>
              <div className="relative h-64">
                <svg width="100%" height="100%" viewBox="0 0 800 200" className="border rounded">
                  {/* グリッド線 */}
                  {[1, 2, 3, 4, 5].map(y => (
                    <line
                      key={y}
                      x1="50"
                      y1={40 * y}
                      x2="750"
                      y2={40 * y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* データポイントと線 */}
                  {(() => {
                    const reversedRecords = [...filteredRecords].reverse();
                    const points = reversedRecords.map((record, index) => ({
                      x: 50 + (index * (700 / Math.max(reversedRecords.length - 1, 1))),
                      y: 200 - (record.scores.totalScore * 40)
                    }));
                    
                    return (
                      <>
                        {/* 線 */}
                        {points.length > 1 && (
                          <polyline
                            points={points.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                          />
                        )}
                        
                        {/* ポイント */}
                        {points.map((point, index) => (
                          <g key={index}>
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r="6"
                              fill="#3b82f6"
                              stroke="white"
                              strokeWidth="2"
                            />
                            <text
                              x={point.x}
                              y={point.y - 15}
                              textAnchor="middle"
                              fontSize="12"
                              fill="#374151"
                            >
                              {reversedRecords[index].scores.totalScore}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                  
                  {/* Y軸ラベル */}
                  {[1, 2, 3, 4, 5].map(y => (
                    <text
                      key={y}
                      x="30"
                      y={205 - (y * 40)}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#6b7280"
                    >
                      {y}
                    </text>
                  ))}
                </svg>
              </div>
              
              {/* 日付ラベル */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                {[...filteredRecords].reverse().map((record, index) => (
                  <span key={index} className="transform -rotate-45">
                    {record.date.split('-').slice(1).join('/')}
                  </span>
                ))}
              </div>
            </div>

            {/* 項目別平均スコア */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">項目別平均スコア</h3>
              <div className="space-y-3">
                {(() => {
                  const categories = ['flickAim', 'trackingAim', 'reactionSpeed', 'focus'];
                  const categoryLabels: Record<string, string> = {
                    flickAim: 'フリックエイム',
                    trackingAim: 'トラッキング',
                    reactionSpeed: '反応速度',
                    focus: '集中力'
                  };
                  
                  return categories.map(category => {
                    const validRecords = filteredRecords.filter(r => r.scores[category as keyof typeof r.scores] !== undefined);
                    const average = validRecords.length > 0 
                      ? validRecords.reduce((sum, r) => sum + (r.scores[category as keyof typeof r.scores] || 0), 0) / validRecords.length
                      : 0;
                    
                    return (
                      <div key={category} className="flex items-center">
                        <div className="w-24 text-sm text-gray-700">
                          {categoryLabels[category]}
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-gray-200 rounded-full h-6">
                            <div
                              className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                              style={{ width: `${(average / 5) * 100}%` }}
                            >
                              <span className="text-white text-xs font-medium">
                                {average.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-8 text-sm text-gray-500">
                          {getScoreEmoji(average)}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* ゲーム別パフォーマンス */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ゲーム別パフォーマンス</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {games.map(game => {
                  const gameRecords = filteredRecords.filter(r => r.game === game);
                  const average = gameRecords.length > 0
                    ? gameRecords.reduce((sum, r) => sum + r.scores.totalScore, 0) / gameRecords.length
                    : 0;
                  
                  return (
                    <div key={game} className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-lg font-semibold text-gray-900">{game}</div>
                      <div className={`text-3xl font-bold mt-2 ${getScoreColor(average).split(' ')[0]}`}>
                        {average.toFixed(1)} {getScoreEmoji(average)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {gameRecords.length}回プレイ
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <div className="text-lg">記録が見つかりません</div>
            <div className="text-sm mt-2">フィルターを変更するか、新しい記録を追加してください</div>
          </div>
        )}
      </div>
    </div>
  );
}