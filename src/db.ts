import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');

// Ensure the directory exists before creating the database
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'cleaner',
    priority INTEGER DEFAULT 1,
    has_car INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    is_booked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    service_type TEXT NOT NULL,
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    claimed_by_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claimed_by_user_id) REFERENCES users (id)
  );
`);

try { db.exec("ALTER TABLE users ADD COLUMN priority INTEGER DEFAULT 1"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN has_car INTEGER DEFAULT 0"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN note TEXT"); } catch (e) {}
try { db.exec("ALTER TABLE orders ADD COLUMN internal_note TEXT"); } catch (e) {}

// Migrate old statuses
try {
  db.exec("UPDATE orders SET status = 'new' WHERE status = 'pending'");
  db.exec("UPDATE orders SET status = 'confirmed' WHERE status = 'claimed'");
} catch (e) {}

// Create or update default admin
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
const hashedPassword = bcrypt.hashSync('DelphiaUklid2026.', 10);

if (!adminExists) {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    'Admin',
    'info@docistaskacou.cz',
    hashedPassword,
    'admin'
  );
  console.log('Default admin created: info@docistaskacou.cz / DelphiaUklid2026.');
} else {
  db.prepare("UPDATE users SET email = ?, password = ? WHERE role = 'admin'").run(
    'info@docistaskacou.cz',
    hashedPassword
  );
  console.log('Admin credentials updated: info@docistaskacou.cz');
}
