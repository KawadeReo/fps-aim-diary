-- FPSエイム日記 データベーススキーマ

-- ユーザー情報
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- マウスデバイス（全ユーザー共通）
CREATE TABLE devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(brand, model)
);

-- ゲームタイトル
CREATE TABLE game_titles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- エイム記録
CREATE TABLE aim_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  device_id INTEGER,
  game_title_id INTEGER,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- 5段階評価項目
  flick_aim INTEGER CHECK(flick_aim >= 1 AND flick_aim <= 5),
  tracking_aim INTEGER CHECK(tracking_aim >= 1 AND tracking_aim <= 5),
  reaction_speed INTEGER CHECK(reaction_speed >= 1 AND reaction_speed <= 5),
  focus INTEGER CHECK(focus >= 1 AND focus <= 5),
  total_score INTEGER CHECK(total_score >= 1 AND total_score <= 5),
  
  -- 追加情報
  dpi INTEGER,
  sensitivity REAL,
  play_time INTEGER, -- 分
  physical_condition INTEGER CHECK(physical_condition >= 1 AND physical_condition <= 5),
  sleep_hours REAL,
  short_comment TEXT,
  memo TEXT,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (device_id) REFERENCES devices(id),
  FOREIGN KEY (game_title_id) REFERENCES game_titles(id)
);

-- デバイス統計（将来のランキング機能用）
CREATE TABLE device_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id INTEGER NOT NULL,
  period_type TEXT NOT NULL, -- 'weekly', 'monthly', 'all'
  period_start DATE,
  
  avg_flick_aim REAL,
  avg_tracking_aim REAL,
  avg_reaction_speed REAL,
  avg_focus REAL,
  avg_total_score REAL,
  
  user_count INTEGER,
  record_count INTEGER,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (device_id) REFERENCES devices(id),
  UNIQUE(device_id, period_type, period_start)
);

-- インデックスの作成
CREATE INDEX idx_aim_records_user_id ON aim_records(user_id);
CREATE INDEX idx_aim_records_recorded_at ON aim_records(recorded_at);
CREATE INDEX idx_aim_records_device_id ON aim_records(device_id);
CREATE INDEX idx_device_stats_device_period ON device_stats(device_id, period_type);

-- 初期データ投入
INSERT INTO game_titles (name) VALUES 
  ('Valorant'),
  ('Apex Legends'),
  ('Counter-Strike 2'),
  ('Overwatch 2'),
  ('PUBG'),
  ('Fortnite');

INSERT INTO devices (brand, model, created_by) VALUES 
  ('Logitech', 'G Pro X Superlight', 'system'),
  ('Razer', 'DeathAdder V3 Pro', 'system'),
  ('SteelSeries', 'Rival 600', 'system'),
  ('Zowie', 'EC2-C', 'system'),
  ('Finalmouse', 'Starlight-12', 'system');