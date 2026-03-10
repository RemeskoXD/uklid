import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../database.sqlite');

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
    status TEXT DEFAULT 'pending',
    claimed_by_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (claimed_by_user_id) REFERENCES users (id)
  );
`);

try { db.exec("ALTER TABLE users ADD COLUMN priority INTEGER DEFAULT 1"); } catch (e) {}
try { db.exec("ALTER TABLE users ADD COLUMN has_car INTEGER DEFAULT 0"); } catch (e) {}

// Create default admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    'Admin',
    'admin@boziuklid.cz',
    hashedPassword,
    'admin'
  );
  console.log('Default admin created: admin@boziuklid.cz / admin123');
}
