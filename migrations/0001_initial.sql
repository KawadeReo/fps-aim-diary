-- FPS Aim Diary Database Schema
-- 初期マイグレーション

-- ユーザーテーブル
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- デバイステーブル（マウス）
CREATE TABLE devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    created_by_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id),
    UNIQUE(brand, model)
);

-- ゲームタイトルテーブル
CREATE TABLE game_titles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- エイム記録テーブル
CREATE TABLE aim_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_id INTEGER,
    game_title_id INTEGER NOT NULL,
    
    -- エイム評価項目（1-5段階）
    flick_aim INTEGER CHECK(flick_aim >= 1 AND flick_aim <= 5),
    tracking_aim INTEGER CHECK(tracking_aim >= 1 AND tracking_aim <= 5),
    reaction_speed INTEGER CHECK(reaction_speed >= 1 AND reaction_speed <= 5),
    crosshair_placement INTEGER CHECK(crosshair_placement >= 1 AND crosshair_placement <= 5),
    peeking INTEGER CHECK(peeking >= 1 AND peeking <= 5),
    movement INTEGER CHECK(movement >= 1 AND movement <= 5),
    consistency INTEGER CHECK(consistency >= 1 AND consistency <= 5),
    focus INTEGER CHECK(focus >= 1 AND focus <= 5),
    decision_making INTEGER CHECK(decision_making >= 1 AND decision_making <= 5),
    total_score INTEGER CHECK(total_score >= 1 AND total_score <= 5),
    
    short_comment TEXT,
    detailed_memo TEXT,
    recorded_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (device_id) REFERENCES devices(id),
    FOREIGN KEY (game_title_id) REFERENCES game_titles(id)
);

-- デバイス統計テーブル（将来のランキング機能用）
CREATE TABLE device_stats (
    device_id INTEGER PRIMARY KEY,
    total_records INTEGER DEFAULT 0,
    avg_total_score REAL DEFAULT 0.0,
    avg_flick_aim REAL DEFAULT 0.0,
    avg_tracking_aim REAL DEFAULT 0.0,
    avg_reaction_speed REAL DEFAULT 0.0,
    avg_crosshair_placement REAL DEFAULT 0.0,
    avg_peeking REAL DEFAULT 0.0,
    avg_movement REAL DEFAULT 0.0,
    avg_consistency REAL DEFAULT 0.0,
    avg_focus REAL DEFAULT 0.0,
    avg_decision_making REAL DEFAULT 0.0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (device_id) REFERENCES devices(id)
);

-- インデックス作成
CREATE INDEX idx_aim_records_user_date ON aim_records(user_id, recorded_date);
CREATE INDEX idx_aim_records_device ON aim_records(device_id);
CREATE INDEX idx_aim_records_game ON aim_records(game_title_id);
CREATE INDEX idx_devices_brand_model ON devices(brand, model);

-- 初期データ挿入

-- ゲームタイトル
INSERT INTO game_titles (name, display_name) VALUES
('valorant', 'Valorant'),
('apex', 'Apex Legends'),
('cs2', 'Counter-Strike 2'),
('overwatch', 'Overwatch 2');

-- 人気デバイス（初期データ）
INSERT INTO devices (brand, model, verified) VALUES
('Logitech', 'G Pro X Superlight', TRUE),
('Razer', 'DeathAdder V3 Pro', TRUE),
('Zowie', 'EC2-C', TRUE),
('SteelSeries', 'Rival 600', TRUE),
('Finalmouse', 'Starlight-12', TRUE),
('Logitech', 'G403 HERO', TRUE),
('Razer', 'Viper V3 Pro', TRUE),
('Logitech', 'G502 X', TRUE),
('Zowie', 'FK2-C', TRUE),
('SteelSeries', 'Prime Wireless', TRUE);