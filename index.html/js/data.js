/* ============================================================
   Game data: persistent save (localStorage), catalog of
   balloons / shields / scenes, achievements & daily missions.
   ============================================================ */

const SAVE_KEY = 'balloonRise_save_v1';
const HISTORY_MAX = 200; // cap so the save file doesn't grow forever

const DIFFICULTIES = [
  { id: 'easy', name: 'ง่าย', icon: '🌤️', color: '#5be0c3', riseSpeed: 90, spawnInterval: 1.35, speedMul: 0.85, desc: 'สำหรับผู้เริ่มต้น สบาย ๆ' },
  { id: 'normal', name: 'ปกติ', icon: '⛅', color: '#4fc3f7', riseSpeed: 115, spawnInterval: 1.05, speedMul: 1.0, desc: 'ความท้าทายมาตรฐาน' },
  { id: 'hard', name: 'ยาก', icon: '🌩️', color: '#ff9f43', riseSpeed: 145, spawnInterval: 0.82, speedMul: 1.25, desc: 'สิ่งกีดขวางถี่และไวขึ้น' },
  { id: 'extreme', name: 'สุดขีด', icon: '🔥', color: '#ff6b9d', riseSpeed: 175, spawnInterval: 0.62, speedMul: 1.55, desc: 'สำหรับมือโปรเท่านั้น' },
  { id: 'endless', name: 'ไม่รู้จบ', icon: '♾️', color: '#a06bff', riseSpeed: 110, spawnInterval: 1.1, speedMul: 1.0, desc: 'ความยากเพิ่มขึ้นเรื่อย ๆ ไม่มีที่สิ้นสุด', endless: true },
];

const BALLOON_SKINS = [
  { id: 'classic_red', name: 'แดงคลาสสิก', cost: 0, colors: ['#ff6b9d', '#ff4785'], emoji: '🎈' },
  { id: 'sky_blue', name: 'ฟ้าใส', cost: 150, colors: ['#7fd6fb', '#29b6f6'], emoji: '🎈' },
  { id: 'lime', name: 'เขียวมะนาว', cost: 150, colors: ['#c6f26c', '#8bc93f'], emoji: '🎈' },
  { id: 'mint', name: 'มินต์สดชื่น', cost: 170, colors: ['#5be0c3', '#1fae8e'], emoji: '🎈' },
  { id: 'peach', name: 'พีชหวาน', cost: 190, colors: ['#ffc9a8', '#ff9466'], emoji: '🎈' },
  { id: 'coral', name: 'ปะการัง', cost: 200, colors: ['#ff8a80', '#ff5252'], emoji: '🎈' },
  { id: 'violet', name: 'ม่วงมายา', cost: 250, colors: ['#c9a0ff', '#a06bff'], emoji: '🎈' },
  { id: 'ocean_teal', name: 'มหาสมุทร', cost: 260, colors: ['#4fd1c5', '#0e7c86'], emoji: '🎈' },
  { id: 'cherry_blossom', name: 'ซากุระ', cost: 300, colors: ['#ffd9e8', '#ff8fb3'], emoji: '🎈' },
  { id: 'sunset', name: 'ตะวันลับฟ้า', cost: 350, colors: ['#ffb56b', '#ff6b6b'], emoji: '🎈' },
  { id: 'midnight', name: 'ราตรีมืดมิด', cost: 380, colors: ['#3a3f8a', '#1a1c4d'], emoji: '🎈' },
  { id: 'emerald', name: 'มรกต', cost: 400, colors: ['#34d399', '#059669'], emoji: '🎈' },
  { id: 'candy_stripe', name: 'ลายลูกกวาด', cost: 450, colors: ['#ff6b9d', '#ffffff'], emoji: '🎈', special: 'stripe' },
  { id: 'polka_dot', name: 'ลายจุด', cost: 480, colors: ['#4fc3f7', '#ffffff'], emoji: '🎈', special: 'dots' },
  { id: 'galaxy', name: 'จักรวาล', cost: 500, colors: ['#7c4dff', '#00e5ff'], emoji: '🎈', special: 'galaxy' },
  { id: 'frost', name: 'น้ำแข็งเยือกแข็ง', cost: 550, colors: ['#e0f7ff', '#7fd6fb'], emoji: '🎈', special: 'ice' },
  { id: 'neon_glow', name: 'นีออนเรืองแสง', cost: 600, colors: ['#39ff88', '#0aff9d'], emoji: '🎈', special: 'neon' },
  { id: 'gold', name: 'ทองคำ', cost: 800, colors: ['#ffe082', '#ffab00'], emoji: '🎈', special: 'gold' },
  { id: 'silver_chrome', name: 'โครเมียมเงิน', cost: 850, colors: ['#e8eef5', '#9aa7b8'], emoji: '🎈', special: 'metal' },
  { id: 'fire_blaze', name: 'เปลวเพลิง', cost: 900, colors: ['#ff5b3d', '#ffcf4d'], emoji: '🎈', special: 'fire' },
  { id: 'rainbow', name: 'สายรุ้ง', cost: 1200, colors: ['#ff6b9d', '#ffd54f', '#5be0c3', '#4fc3f7', '#a06bff'], emoji: '🎈', special: 'rainbow' },
  { id: 'diamond_shine', name: 'เพชรประกาย', cost: 1500, colors: ['#ffffff', '#bfe9ff'], emoji: '🎈', special: 'diamond' },
];

const SHIELD_SKINS = [
  { id: 'aqua', name: 'อควา', cost: 0, colors: ['#4fc3f7', '#29b6f6'] },
  { id: 'ember', name: 'เพลิงไหม้', cost: 150, colors: ['#ff9f43', '#ff5b5b'] },
  { id: 'electric', name: 'ไฟฟ้า', cost: 200, colors: ['#c9a0ff', '#7c4dff'] },
  { id: 'toxic', name: 'พิษเขียว', cost: 200, colors: ['#c6f26c', '#5be0c3'] },
  { id: 'coral_reef', name: 'แนวปะการัง', cost: 220, colors: ['#ff8a80', '#ff5b8a'] },
  { id: 'mint_wave', name: 'คลื่นมินต์', cost: 240, colors: ['#5be0c3', '#29b6a0'] },
  { id: 'blossom', name: 'ดอกซากุระ', cost: 260, colors: ['#ffd9e8', '#ff8fb3'] },
  { id: 'shadow', name: 'เงามืด', cost: 300, colors: ['#5a5a7a', '#1e1e33'] },
  { id: 'ice', name: 'น้ำแข็ง', cost: 300, colors: ['#e0f7ff', '#7fd6fb'] },
  { id: 'steel', name: 'เหล็กกล้า', cost: 320, colors: ['#cfd8e3', '#7c8b9e'] },
  { id: 'lava', name: 'ลาวาร้อน', cost: 350, colors: ['#ff5b3d', '#8a1c1c'] },
  { id: 'crystal', name: 'คริสตัล', cost: 380, colors: ['#c9a0ff', '#7fd6fb'] },
  { id: 'amethyst', name: 'อเมทิสต์', cost: 420, colors: ['#a06bff', '#5b2ea6'] },
  { id: 'sunrise', name: 'อรุณรุ่ง', cost: 450, colors: ['#ffb56b', '#ff6b9d'] },
  { id: 'royal', name: 'ทองคำหลวง', cost: 600, colors: ['#ffe082', '#ffab00'] },
  { id: 'rainbow_prism', name: 'ปริซึมสายรุ้ง', cost: 900, colors: ['#ff6b9d', '#ffd54f', '#5be0c3', '#4fc3f7', '#a06bff'], special: 'rainbow' },
];

const SCENES = [
  { id: 'sky', name: 'ท้องฟ้า', cost: 0, icon: '☁️' },
  { id: 'sunset', name: 'ตะวันตกดิน', cost: 180, icon: '🌇' },
  { id: 'city', name: 'เมือง', cost: 200, icon: '🏙️' },
  { id: 'forest', name: 'ป่าไม้', cost: 250, icon: '🌲' },
  { id: 'desert', name: 'ทะเลทราย', cost: 300, icon: '🏜️' },
  { id: 'ocean', name: 'ใต้ทะเล', cost: 350, icon: '🌊' },
  { id: 'space', name: 'อวกาศ', cost: 400, icon: '🌌' },
  { id: 'aurora', name: 'แสงเหนือ', cost: 550, icon: '🌈' },
  { id: 'cyberpunk', name: 'ไซเบอร์พังก์', cost: 650, icon: '🌃' },
  { id: 'galaxy', name: 'กาแล็กซี', cost: 700, icon: '🌠' },
];

const ACHIEVEMENTS = [
  // --- Games played ---
  { id: 'first_flight', name: 'เที่ยวบินแรก', desc: 'เล่นเกม 1 ครั้ง', icon: '🎈', target: 1, stat: 'gamesPlayed', reward: 50 },
  { id: 'regular_flyer', name: 'ขาประจำ', desc: 'เล่นเกมรวม 10 ครั้ง', icon: '🎮', target: 10, stat: 'gamesPlayed', reward: 70 },
  { id: 'survivor', name: 'ผู้รอดชีวิต', desc: 'เล่นเกมรวม 25 ครั้ง', icon: '🏅', target: 25, stat: 'gamesPlayed', reward: 200 },
  { id: 'veteran_pilot', name: 'นักเล่นตัวยง', desc: 'เล่นเกมรวม 50 ครั้ง', icon: '🎖️', target: 50, stat: 'gamesPlayed', reward: 250 },
  { id: 'balloon_master', name: 'เซียนลูกโป่ง', desc: 'เล่นเกมรวม 100 ครั้ง', icon: '👑', target: 100, stat: 'gamesPlayed', reward: 400 },
  { id: 'legend_of_play', name: 'ตำนานนักเล่น', desc: 'เล่นเกมรวม 250 ครั้ง', icon: '🌟', target: 250, stat: 'gamesPlayed', reward: 700 },

  // --- Total distance ---
  { id: 'rising_star', name: 'ดาวรุ่ง', desc: 'ลอยสูงรวม 1,000 เมตร', icon: '⭐', target: 1000, stat: 'totalDistance', reward: 80 },
  { id: 'sky_wanderer', name: 'นักบินไกล', desc: 'ลอยสูงรวม 5,000 เมตร', icon: '🌤️', target: 5000, stat: 'totalDistance', reward: 150 },
  { id: 'cloud_conqueror', name: 'ผู้พิชิตเมฆ', desc: 'ลอยสูงรวม 10,000 เมตร', icon: '☁️', target: 10000, stat: 'totalDistance', reward: 250 },
  { id: 'sky_roamer', name: 'ผู้ท่องนภา', desc: 'ลอยสูงรวม 25,000 เมตร', icon: '🌌', target: 25000, stat: 'totalDistance', reward: 400 },
  { id: 'sky_emperor', name: 'จ้าวเวหา', desc: 'ลอยสูงรวม 50,000 เมตร', icon: '🌠', target: 50000, stat: 'totalDistance', reward: 600 },

  // --- Best single-game distance ---
  { id: 'high_flyer', name: 'นักบินระดับสูง', desc: 'ทำระยะทางเดี่ยว 500 เมตรในเกมเดียว', icon: '🚀', target: 500, stat: 'bestSingleDistance', reward: 120 },
  { id: 'rocket_rise', name: 'จรวดทะยาน', desc: 'ทำระยะทางเดี่ยว 1,000 เมตรในเกมเดียว', icon: '🛸', target: 1000, stat: 'bestSingleDistance', reward: 200 },
  { id: 'lightning_climb', name: 'สายฟ้าแลบ', desc: 'ทำระยะทางเดี่ยว 2,000 เมตรในเกมเดียว', icon: '⚡', target: 2000, stat: 'bestSingleDistance', reward: 350 },
  { id: 'horizon_breaker', name: 'ทะลุขอบฟ้า', desc: 'ทำระยะทางเดี่ยว 3,000 เมตรในเกมเดียว', icon: '🌅', target: 3000, stat: 'bestSingleDistance', reward: 500 },

  // --- Coins earned ---
  { id: 'coin_collector', name: 'นักสะสมเหรียญ', desc: 'เก็บเหรียญรวม 500 เหรียญ', icon: '🪙', target: 500, stat: 'totalCoinsEarned', reward: 100 },
  { id: 'little_rich', name: 'เศรษฐีน้อย', desc: 'เก็บเหรียญรวม 1,500 เหรียญ', icon: '💰', target: 1500, stat: 'totalCoinsEarned', reward: 150 },
  { id: 'gold_hoarder', name: 'นักสะสมเหรียญทอง', desc: 'เก็บเหรียญรวม 3,000 เหรียญ', icon: '🪙', target: 3000, stat: 'totalCoinsEarned', reward: 250 },
  { id: 'coin_tycoon', name: 'มหาเศรษฐีเหรียญ', desc: 'เก็บเหรียญรวม 6,000 เหรียญ', icon: '💎', target: 6000, stat: 'totalCoinsEarned', reward: 400 },
  { id: 'coin_emperor', name: 'จักรพรรดิเหรียญ', desc: 'เก็บเหรียญรวม 10,000 เหรียญ', icon: '👑', target: 10000, stat: 'totalCoinsEarned', reward: 600 },

  // --- Coins spent (shop engagement) ---
  { id: 'first_shopper', name: 'นักช้อปมือใหม่', desc: 'ใช้เหรียญในร้านค้ารวม 500 เหรียญ', icon: '🛍️', target: 500, stat: 'totalCoinsSpent', reward: 100 },
  { id: 'shop_regular', name: 'นักช้อปตัวยง', desc: 'ใช้เหรียญในร้านค้ารวม 2,000 เหรียญ', icon: '🛒', target: 2000, stat: 'totalCoinsSpent', reward: 250 },
  { id: 'shop_tycoon', name: 'เจ้าสัวร้านค้า', desc: 'ใช้เหรียญในร้านค้ารวม 5,000 เหรียญ', icon: '🏬', target: 5000, stat: 'totalCoinsSpent', reward: 450 },

  // --- Deflects ---
  { id: 'shield_novice', name: 'โล่ป้องกัน', desc: 'ปัดป้องสิ่งกีดขวางรวม 50 ครั้ง', icon: '🛡️', target: 50, stat: 'totalDeflects', reward: 80 },
  { id: 'shield_master', name: 'เจ้าแห่งโล่', desc: 'ปัดป้องสิ่งกีดขวางรวม 200 ครั้ง', icon: '🛡️', target: 200, stat: 'totalDeflects', reward: 150 },
  { id: 'iron_wall', name: 'ปราการเหล็ก', desc: 'ปัดป้องสิ่งกีดขวางรวม 500 ครั้ง', icon: '⚙️', target: 500, stat: 'totalDeflects', reward: 300 },
  { id: 'eternal_bulwark', name: 'กำแพงอมตะ', desc: 'ปัดป้องสิ่งกีดขวางรวม 1,000 ครั้ง', icon: '🏰', target: 1000, stat: 'totalDeflects', reward: 500 },
  { id: 'god_of_shields', name: 'เทพแห่งโล่', desc: 'ปัดป้องสิ่งกีดขวางรวม 2,000 ครั้ง', icon: '🛡️', target: 2000, stat: 'totalDeflects', reward: 800 },

  // --- Best combo ---
  { id: 'combo_starter', name: 'สายคอมโบ', desc: 'ทำคอมโบสูงสุด x10 ในเกมเดียว', icon: '⚡', target: 10, stat: 'bestCombo', reward: 80 },
  { id: 'combo_king', name: 'ราชาคอมโบ', desc: 'ทำคอมโบสูงสุด x20 ในเกมเดียว', icon: '⚡', target: 20, stat: 'bestCombo', reward: 150 },
  { id: 'combo_master', name: 'จอมคอมโบ', desc: 'ทำคอมโบสูงสุด x30 ในเกมเดียว', icon: '💥', target: 30, stat: 'bestCombo', reward: 250 },
  { id: 'combo_god', name: 'เทพคอมโบ', desc: 'ทำคอมโบสูงสุด x50 ในเกมเดียว', icon: '🔥', target: 50, stat: 'bestCombo', reward: 500 },

  // --- Powerups used ---
  { id: 'powerup_curious', name: 'นักลองของ', desc: 'ใช้ไอเทมพาวเวอร์อัพรวม 10 ครั้ง', icon: '✨', target: 10, stat: 'totalPowerups', reward: 60 },
  { id: 'powerup_fan', name: 'สาวกไอเทม', desc: 'ใช้ไอเทมพาวเวอร์อัพรวม 30 ครั้ง', icon: '✨', target: 30, stat: 'totalPowerups', reward: 100 },
  { id: 'powerup_hoarder', name: 'นักสะสมไอเทม', desc: 'ใช้ไอเทมพาวเวอร์อัพรวม 75 ครั้ง', icon: '🎇', target: 75, stat: 'totalPowerups', reward: 250 },
  { id: 'powerup_lord', name: 'เจ้าแห่งไอเทม', desc: 'ใช้ไอเทมพาวเวอร์อัพรวม 150 ครั้ง', icon: '🌟', target: 150, stat: 'totalPowerups', reward: 450 },

  // --- Collections ---
  { id: 'collector_deluxe', name: 'นักสะสมตัวยง', desc: 'ปลดล็อกลูกโป่ง 4 แบบ', icon: '🎨', target: 4, stat: 'balloonsUnlocked', reward: 180 },
  { id: 'balloon_collection', name: 'คลังลูกโป่ง', desc: 'ปลดล็อกลูกโป่ง 8 แบบ', icon: '🎈', target: 8, stat: 'balloonsUnlocked', reward: 300 },
  { id: 'balloon_expert', name: 'ผู้เชี่ยวชาญลูกโป่ง', desc: 'ปลดล็อกลูกโป่ง 12 แบบ', icon: '🎨', target: 12, stat: 'balloonsUnlocked', reward: 500 },
  { id: 'balloon_complete', name: 'เจ้าของคอลเลกชันครบ', desc: 'ปลดล็อกลูกโป่งครบทุกแบบ', icon: '🏆', target: BALLOON_SKINS.length, stat: 'balloonsUnlocked', reward: 1000 },
  { id: 'shield_collector', name: 'นักสะสมโล่', desc: 'ปลดล็อกโล่ 4 แบบ', icon: '🛡️', target: 4, stat: 'shieldsUnlocked', reward: 200 },
  { id: 'shield_vault', name: 'คลังโล่', desc: 'ปลดล็อกโล่ 8 แบบ', icon: '🗝️', target: 8, stat: 'shieldsUnlocked', reward: 350 },
  { id: 'shield_complete', name: 'จอมโล่ครบชุด', desc: 'ปลดล็อกโล่ครบทุกแบบ', icon: '🏆', target: SHIELD_SKINS.length, stat: 'shieldsUnlocked', reward: 700 },
  { id: 'scene_traveler', name: 'นักเดินทาง', desc: 'ปลดล็อกฉากหลัง 3 แบบ', icon: '🗺️', target: 3, stat: 'scenesUnlocked', reward: 150 },
  { id: 'scene_explorer', name: 'นักสำรวจโลก', desc: 'ปลดล็อกฉากหลัง 6 แบบ', icon: '🧭', target: 6, stat: 'scenesUnlocked', reward: 300 },
  { id: 'scene_complete', name: 'ผู้พิชิตทุกฉาก', desc: 'ปลดล็อกฉากหลังครบทุกแบบ', icon: '🏆', target: SCENES.length, stat: 'scenesUnlocked', reward: 600 },

  // --- Endless mode ---
  { id: 'endless_brave', name: 'ผู้กล้าไม่รู้จบ', desc: 'ทำคะแนน 500 ในโหมดไม่รู้จบ', icon: '♾️', target: 500, stat: 'bestEndlessScore', reward: 150 },
  { id: 'endless_fighter', name: 'นักสู้อมตะ', desc: 'ทำคะแนน 1,000 ในโหมดไม่รู้จบ', icon: '♾️', target: 1000, stat: 'bestEndlessScore', reward: 250 },
  { id: 'endless_legend', name: 'ตำนานไม่รู้จบ', desc: 'ทำคะแนน 2,000 ในโหมดไม่รู้จบ', icon: '♾️', target: 2000, stat: 'bestEndlessScore', reward: 300 },
  { id: 'endless_myth', name: 'ตำนานไม่มีที่สิ้นสุด', desc: 'ทำคะแนน 4,000 ในโหมดไม่รู้จบ', icon: '🌌', target: 4000, stat: 'bestEndlessScore', reward: 500 },
  { id: 'endless_universe', name: 'จักรวาลไม่รู้จบ', desc: 'ทำคะแนน 8,000 ในโหมดไม่รู้จบ', icon: '🌠', target: 8000, stat: 'bestEndlessScore', reward: 900 },

  // --- Play time ---
  { id: 'rookie_pilot', name: 'นักบินมือใหม่', desc: 'สะสมเวลาเล่น 10 นาที', icon: '⏱️', target: 600, stat: 'totalPlayTimeSec', reward: 80 },
  { id: 'regular_pilot', name: 'นักบินขาประจำ', desc: 'สะสมเวลาเล่น 1 ชั่วโมง', icon: '⏰', target: 3600, stat: 'totalPlayTimeSec', reward: 200 },
  { id: 'marathon_pilot', name: 'นักบินมาราธอน', desc: 'สะสมเวลาเล่น 5 ชั่วโมง', icon: '🕐', target: 18000, stat: 'totalPlayTimeSec', reward: 450 },
  { id: 'time_lord_pilot', name: 'จ้าวเวลาบิน', desc: 'สะสมเวลาเล่น 10 ชั่วโมง', icon: '⌛', target: 36000, stat: 'totalPlayTimeSec', reward: 800 },
];

const MISSION_POOL = [
  { id: 'm_coins', name: 'นักล่าเหรียญ', desc: 'เก็บเหรียญรวม {t} เหรียญวันนี้', icon: '🪙', target: 25, stat: 'coins', reward: 40 },
  { id: 'm_coins2', name: 'นักล่าเหรียญตัวยง', desc: 'เก็บเหรียญรวม {t} เหรียญวันนี้', icon: '🪙', target: 60, stat: 'coins', reward: 70 },
  { id: 'm_distance', name: 'นักบิน', desc: 'ลอยสูงรวม {t} เมตรวันนี้', icon: '📏', target: 300, stat: 'distance', reward: 45 },
  { id: 'm_distance2', name: 'นักบินระยะไกล', desc: 'ลอยสูงรวม {t} เมตรวันนี้', icon: '📏', target: 800, stat: 'distance', reward: 80 },
  { id: 'm_deflect', name: 'ผู้พิทักษ์', desc: 'ปัดป้องสิ่งกีดขวางรวม {t} ครั้งวันนี้', icon: '🛡️', target: 20, stat: 'deflects', reward: 45 },
  { id: 'm_deflect2', name: 'ผู้พิทักษ์มือฉมัง', desc: 'ปัดป้องสิ่งกีดขวางรวม {t} ครั้งวันนี้', icon: '🛡️', target: 50, stat: 'deflects', reward: 80 },
  { id: 'm_games', name: 'ขยันเล่น', desc: 'เล่นเกม {t} ครั้งวันนี้', icon: '🎮', target: 3, stat: 'games', reward: 35 },
  { id: 'm_games2', name: 'ขาประจำวันนี้', desc: 'เล่นเกม {t} ครั้งวันนี้', icon: '🎮', target: 6, stat: 'games', reward: 65 },
  { id: 'm_powerup', name: 'นักล่าไอเทม', desc: 'เก็บพาวเวอร์อัพรวม {t} ชิ้นวันนี้', icon: '✨', target: 5, stat: 'powerups', reward: 40 },
  { id: 'm_powerup2', name: 'สาวกไอเทมตัวยง', desc: 'เก็บพาวเวอร์อัพรวม {t} ชิ้นวันนี้', icon: '✨', target: 12, stat: 'powerups', reward: 70 },
  { id: 'm_combo', name: 'สายคอมโบ', desc: 'ทำคอมโบให้ถึง x{t} ในเกมเดียว', icon: '⚡', target: 10, stat: 'bestCombo', reward: 50 },
  { id: 'm_combo2', name: 'จอมคอมโบวันนี้', desc: 'ทำคอมโบให้ถึง x{t} ในเกมเดียว', icon: '⚡', target: 16, stat: 'bestCombo', reward: 85 },
  { id: 'm_score', name: 'นักล่าคะแนน', desc: 'ทำคะแนน {t} แต้มในเกมเดียว', icon: '🎯', target: 300, stat: 'bestScore', reward: 55 },
  { id: 'm_score2', name: 'นักล่าคะแนนตัวยง', desc: 'ทำคะแนน {t} แต้มในเกมเดียว', icon: '🎯', target: 800, stat: 'bestScore', reward: 90 },
  { id: 'm_hard', name: 'ท้าความยาก', desc: 'เล่นโหมดยากขึ้นไป {t} ครั้งวันนี้', icon: '🌩️', target: 1, stat: 'hardGames', reward: 45 },
  { id: 'm_hard2', name: 'นักท้าทาย', desc: 'เล่นโหมดยากขึ้นไป {t} ครั้งวันนี้', icon: '🌩️', target: 3, stat: 'hardGames', reward: 80 },
  { id: 'm_endless', name: 'สู้ไม่รู้จบ', desc: 'เล่นโหมดไม่รู้จบ {t} ครั้งวันนี้', icon: '♾️', target: 1, stat: 'endlessGames', reward: 50 },
  { id: 'm_deflect_single', name: 'โล่สายฟ้า', desc: 'ปัดป้องสิ่งกีดขวาง {t} ครั้งในเกมเดียว', icon: '🛡️', target: 15, stat: 'bestSingleDeflects', reward: 60 },
  { id: 'm_distance_single', name: 'พุ่งทะยาน', desc: 'ลอยสูง {t} เมตรในเกมเดียว', icon: '🚀', target: 400, stat: 'bestSingleDistance', reward: 65 },
  { id: 'm_powerup_single', name: 'นักลองของประจำวัน', desc: 'เก็บพาวเวอร์อัพ {t} ชิ้นในเกมเดียว', icon: '✨', target: 3, stat: 'bestSinglePowerups', reward: 45 },
  { id: 'm_coin_single', name: 'มือเก็บเหรียญ', desc: 'เก็บเหรียญ {t} เหรียญในเกมเดียว', icon: '🪙', target: 15, stat: 'bestSingleCoins', reward: 45 },
  { id: 'm_shop', name: 'นักช้อปประจำวัน', desc: 'ซื้อหรือสวมใส่ไอเทมจากร้านค้าวันนี้', icon: '🛍️', target: 1, stat: 'shopActions', reward: 40 },
];

const DAILY_MISSION_COUNT = 5;

function defaultSave() {
  return {
    coins: 0,
    highScores: { easy: 0, normal: 0, hard: 0, extreme: 0, endless: 0 },
    bestDistance: { easy: 0, normal: 0, hard: 0, extreme: 0, endless: 0 },
    unlockedBalloons: ['classic_red'],
    unlockedShields: ['aqua'],
    unlockedScenes: ['sky'],
    selectedBalloon: 'classic_red',
    selectedShield: 'aqua',
    selectedScene: 'sky',
    achievements: {},
    dailyMissions: { date: '', missions: [] },
    // Cumulative-per-day counters that daily-mission progress is measured
    // against. Reset together with dailyMissions whenever the date rolls
    // over (see ensureDailyMissions). Kept separate from `stats` (all-time)
    // so clearing/resetting one never affects the other.
    dailyStats: {
      date: '', coins: 0, distance: 0, deflects: 0, games: 0, powerups: 0,
      bestCombo: 0, bestScore: 0, hardGames: 0, endlessGames: 0,
      bestSingleDeflects: 0, bestSingleDistance: 0, bestSinglePowerups: 0,
      bestSingleCoins: 0, shopActions: 0,
    },
    // Per-game play history — purely a log for the player to review/clear.
    // It is NEVER read by highScores/bestDistance/stats, so deleting
    // entries here can't affect best-ever records.
    history: [],
    stats: {
      gamesPlayed: 0,
      totalDistance: 0,
      bestSingleDistance: 0,
      totalCoinsEarned: 0,
      totalCoinsSpent: 0,
      totalDeflects: 0,
      bestCombo: 0,
      totalPowerups: 0,
      totalPlayTimeSec: 0,
      balloonsUnlocked: 1,
      shieldsUnlocked: 1,
      scenesUnlocked: 1,
      bestEndlessScore: 0,
    },
    settings: { sfx: true, music: true, vibrate: true, firstPlayDone: false },
  };
}

class GameData {
  constructor() {
    this.data = this.load();
    this.ensureDailyMissions();
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return defaultSave();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultSave(), parsed, {
        highScores: Object.assign(defaultSave().highScores, parsed.highScores),
        bestDistance: Object.assign(defaultSave().bestDistance, parsed.bestDistance),
        stats: Object.assign(defaultSave().stats, parsed.stats),
        settings: Object.assign(defaultSave().settings, parsed.settings),
        dailyStats: Object.assign(defaultSave().dailyStats, parsed.dailyStats),
        history: Array.isArray(parsed.history) ? parsed.history : [],
      });
    } catch (e) {
      return defaultSave();
    }
  }

  save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.data)); } catch (e) {}
  }

  resetAll() {
    this.data = defaultSave();
    this.ensureDailyMissions();
    this.save();
  }

  todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  seededRandom(seed) {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  ensureDailyMissions() {
    const today = this.todayStr();
    if (this.data.dailyMissions.date === today && this.data.dailyMissions.missions.length) return;
    let seed = 0;
    for (let i = 0; i < today.length; i++) seed += today.charCodeAt(i) * (i + 1);
    const rand = this.seededRandom(seed);
    const pool = [...MISSION_POOL];
    const picked = [];
    const pickCount = Math.min(DAILY_MISSION_COUNT, pool.length);
    while (picked.length < pickCount && pool.length) {
      const idx = Math.floor(rand() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    this.data.dailyMissions = {
      date: today,
      missions: picked.map(m => ({ id: m.id, progress: 0, target: m.target, claimed: false })),
    };
    // Fresh day → fresh daily counters, so mission progress always reflects
    // *today's* cumulative play, not a stale value from a previous day.
    this.data.dailyStats = {
      date: today, coins: 0, distance: 0, deflects: 0, games: 0, powerups: 0,
      bestCombo: 0, bestScore: 0, hardGames: 0, endlessGames: 0,
      bestSingleDeflects: 0, bestSingleDistance: 0, bestSinglePowerups: 0,
      bestSingleCoins: 0, shopActions: 0,
    };
    this.save();
  }

  addCoins(n) {
    this.data.coins += n;
    this.data.stats.totalCoinsEarned += n;
    this.save();
  }

  spendCoins(n) {
    if (this.data.coins < n) return false;
    this.data.coins -= n;
    this.data.stats.totalCoinsSpent += n;
    this.save();
    return true;
  }

  isUnlocked(type, id) {
    if (type === 'balloon') return this.data.unlockedBalloons.includes(id);
    if (type === 'shield') return this.data.unlockedShields.includes(id);
    if (type === 'scene') return this.data.unlockedScenes.includes(id);
    return false;
  }

  unlock(type, id) {
    const key = type === 'balloon' ? 'unlockedBalloons' : type === 'shield' ? 'unlockedShields' : 'unlockedScenes';
    if (!this.data[key].includes(id)) {
      this.data[key].push(id);
      if (type === 'balloon') this.data.stats.balloonsUnlocked = this.data.unlockedBalloons.length;
      if (type === 'shield') this.data.stats.shieldsUnlocked = this.data.unlockedShields.length;
      if (type === 'scene') this.data.stats.scenesUnlocked = this.data.unlockedScenes.length;
    }
    this.save();
  }

  // Called whenever the player equips or buys anything in the shop, so the
  // "shop" daily mission (and any future shop-related mission) can track it.
  recordShopPurchase() {
    this.ensureDailyMissions();
    this.data.dailyStats.shopActions += 1;
    this.updateMissionProgress();
    this.save();
  }

  select(type, id) {
    if (type === 'balloon') this.data.selectedBalloon = id;
    if (type === 'shield') this.data.selectedShield = id;
    if (type === 'scene') this.data.selectedScene = id;
    this.save();
  }

  recordGameEnd({ difficulty, score, distance, coins, deflects, bestCombo, powerupsUsed, time }) {
    const s = this.data.stats;
    s.gamesPlayed += 1;
    s.totalDistance += distance;
    s.bestSingleDistance = Math.max(s.bestSingleDistance, distance);
    s.totalDeflects += deflects;
    s.bestCombo = Math.max(s.bestCombo, bestCombo);
    s.totalPowerups += powerupsUsed;
    s.totalPlayTimeSec += Math.max(0, time || 0);
    if (difficulty === 'endless') s.bestEndlessScore = Math.max(s.bestEndlessScore, score);

    let isNewBest = false;
    if (score > this.data.highScores[difficulty]) { this.data.highScores[difficulty] = score; isNewBest = true; }
    this.data.bestDistance[difficulty] = Math.max(this.data.bestDistance[difficulty], distance);

    // Log this play as a history entry. This list is independent from the
    // best-score stats above — clearing/deleting entries from it never
    // touches highScores, bestDistance, or stats.
    this.data.history.unshift({
      id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      difficulty, score, distance, coins, deflects, bestCombo,
    });
    if (this.data.history.length > HISTORY_MAX) this.data.history.length = HISTORY_MAX;

    // Roll this game's results into today's cumulative counters, which is
    // what daily-mission progress is measured against (see
    // updateMissionProgress). Doing this here — once per finished game —
    // is what lets missions like "play 3 games today" or "collect 60 coins
    // today" actually accumulate across separate play sessions instead of
    // only reflecting the most recent single game.
    this.ensureDailyMissions();
    const ds = this.data.dailyStats;
    ds.coins += coins;
    ds.distance += distance;
    ds.deflects += deflects;
    ds.games += 1;
    ds.powerups += powerupsUsed;
    ds.bestCombo = Math.max(ds.bestCombo, bestCombo);
    ds.bestScore = Math.max(ds.bestScore, score);
    if (difficulty === 'hard' || difficulty === 'extreme' || difficulty === 'endless') ds.hardGames += 1;
    if (difficulty === 'endless') ds.endlessGames += 1;
    ds.bestSingleDeflects = Math.max(ds.bestSingleDeflects, deflects);
    ds.bestSingleDistance = Math.max(ds.bestSingleDistance, distance);
    ds.bestSinglePowerups = Math.max(ds.bestSinglePowerups, powerupsUsed);
    ds.bestSingleCoins = Math.max(ds.bestSingleCoins, coins);
    this.updateMissionProgress();

    this.save();
    return isNewBest;
  }

  // Removes a single play-history entry by id. Best-score stats are untouched.
  deleteHistoryEntry(id) {
    this.data.history = this.data.history.filter(h => h.id !== id);
    this.save();
  }

  // Clears the whole play-history log. Best-score stats are untouched.
  clearHistory() {
    this.data.history = [];
    this.save();
  }

  checkAchievements() {
    const unlocked = [];
    for (const a of ACHIEVEMENTS) {
      if (this.data.achievements[a.id]?.unlocked) continue;
      const val = this.data.stats[a.stat] || 0;
      if (val >= a.target) {
        this.data.achievements[a.id] = { unlocked: true };
        this.addCoins(a.reward);
        unlocked.push(a);
      }
    }
    if (unlocked.length) this.save();
    return unlocked;
  }

  achievementProgress(a) {
    const val = this.data.stats[a.stat] || 0;
    return Math.min(1, val / a.target);
  }

  // Recomputes each of today's mission's progress from the cumulative
  // dailyStats counters (see recordGameEnd / recordShopPurchase for what
  // feeds those counters).
  updateMissionProgress() {
    const ds = this.data.dailyStats;
    for (const m of this.data.dailyMissions.missions) {
      if (m.claimed) continue;
      const def = MISSION_POOL.find(d => d.id === m.id);
      if (!def) continue;
      const val = ds[def.stat] || 0;
      m.progress = Math.max(m.progress, val);
    }
    this.save();
  }

  claimMission(id) {
    const m = this.data.dailyMissions.missions.find(m => m.id === id);
    if (!m || m.claimed || m.progress < m.target) return null;
    const def = MISSION_POOL.find(d => d.id === id);
    m.claimed = true;
    this.addCoins(def.reward);
    this.save();
    return def;
  }

  anyMissionClaimable() {
    return this.data.dailyMissions.missions.some(m => !m.claimed && m.progress >= m.target);
  }
}

window.GameData = GameData;
window.DIFFICULTIES = DIFFICULTIES;
window.BALLOON_SKINS = BALLOON_SKINS;
window.SHIELD_SKINS = SHIELD_SKINS;
window.SCENES = SCENES;
window.ACHIEVEMENTS = ACHIEVEMENTS;
window.MISSION_POOL = MISSION_POOL;
window.DAILY_MISSION_COUNT = DAILY_MISSION_COUNT;
