// 基本型定義
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface Device {
  id: number;
  brand: string;
  model: string;
  createdBy: string;
  createdAt: Date;
}

export interface GameTitle {
  id: number;
  name: string;
  createdAt: Date;
}

export interface AimRecord {
  id: number;
  userId: string;
  deviceId?: number;
  gameTitleId?: number;
  recordedAt: Date;
  
  // 5段階評価項目
  flickAim: number; // 1-5
  trackingAim: number; // 1-5
  reactionSpeed: number; // 1-5
  focus: number; // 1-5
  totalScore: number; // 1-5
  
  // 追加情報
  dpi?: number;
  sensitivity?: number;
  playTime?: number; // 分
  physicalCondition?: number; // 1-5
  sleepHours?: number;
  shortComment?: string;
  memo?: string;
  
  // リレーション
  device?: Device;
  gameTitle?: GameTitle;
}

export interface DeviceStats {
  id: number;
  deviceId: number;
  periodType: 'weekly' | 'monthly' | 'all';
  periodStart?: Date;
  
  avgFlickAim?: number;
  avgTrackingAim?: number;
  avgReactionSpeed?: number;
  avgFocus?: number;
  avgTotalScore?: number;
  
  userCount: number;
  recordCount: number;
  updatedAt: Date;
  
  device?: Device;
}

// フォーム用型
export interface RecordFormData {
  deviceId?: number;
  gameTitleId?: number;
  flickAim: number;
  trackingAim: number;
  reactionSpeed: number;
  focus: number;
  totalScore: number;
  dpi?: number;
  sensitivity?: number;
  playTime?: number;
  physicalCondition?: number;
  sleepHours?: number;
  shortComment?: string;
  memo?: string;
}

export interface DeviceFormData {
  brand: string;
  model: string;
}

// API レスポンス型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// 統計用型
export interface DashboardStats {
  totalRecords: number;
  weeklyAverage: {
    flickAim: number;
    trackingAim: number;
    reactionSpeed: number;
    focus: number;
    totalScore: number;
  };
  recentRecords: AimRecord[];
  bestScores: {
    flickAim: number;
    trackingAim: number;
    reactionSpeed: number;
    focus: number;
    totalScore: number;
  };
}

export interface ChartData {
  date: string;
  flickAim: number;
  trackingAim: number;
  reactionSpeed: number;
  focus: number;
  totalScore: number;
}