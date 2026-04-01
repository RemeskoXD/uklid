import express from "express";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-dev";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Middleware to check auth
  const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });
    
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // Admin Routes
  app.get("/api/users", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const users = db.prepare("SELECT id, name, email, role, priority, has_car FROM users").all();
    res.json(users);
  });

  app.post("/api/users", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { name, email, password, role, priority, has_car } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (name, email, password, role, priority, has_car) VALUES (?, ?, ?, ?, ?, ?)").run(name, email, hashedPassword, role || "cleaner", priority || 1, has_car ? 1 : 0);
      res.json({ id: result.lastInsertRowid, name, email, role: role || "cleaner" });
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { name, email, role, priority, has_car, password } = req.body;
    try {
      if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.prepare("UPDATE users SET name=?, email=?, role=?, priority=?, has_car=?, password=? WHERE id=?")
          .run(name, email, role, priority || 1, has_car ? 1 : 0, hashedPassword, req.params.id);
      } else {
        db.prepare("UPDATE users SET name=?, email=?, role=?, priority=?, has_car=? WHERE id=?")
          .run(name, email, role, priority || 1, has_car ? 1 : 0, req.params.id);
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Availability Routes
  app.get("/api/availability", (req, res) => {
    const address = (req.query.address as string) || "";
    const needsCar = address && !address.toLowerCase().includes("praha") ? 1 : 0;

    const slots = db.prepare(`
      SELECT a.date, a.time_slot
      FROM availability a
      JOIN users u ON a.user_id = u.id
      WHERE a.is_booked = 0 AND a.date >= date('now')
      AND (? = 0 OR u.has_car = 1)
      GROUP BY a.date, a.time_slot
    `).all(needsCar);
    res.json(slots);
  });

  app.get("/api/my-availability", authenticate, (req: any, res: any) => {
    try {
      const slots = db.prepare(`
        SELECT id, date, time_slot, is_booked
        FROM availability
        WHERE user_id = ? AND date >= date('now')
        ORDER BY date ASC, time_slot ASC
      `).all(req.user.id);
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.post("/api/availability", authenticate, (req: any, res: any) => {
    const { date, time_slot } = req.body;
    try {
      const result = db.prepare("INSERT INTO availability (user_id, date, time_slot) VALUES (?, ?, ?)").run(req.user.id, date, time_slot);
      res.json({ id: result.lastInsertRowid, user_id: req.user.id, date, time_slot, is_booked: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to add availability" });
    }
  });
  
  app.delete("/api/availability/:id", authenticate, (req: any, res: any) => {
    try {
      db.prepare("DELETE FROM availability WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete availability" });
    }
  });

  // Admin Availability Routes
  app.get("/api/admin/availability", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      const slots = db.prepare(`
        SELECT a.id, a.date, a.time_slot, a.is_booked, u.name as user_name, u.id as user_id
        FROM availability a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.date ASC, a.time_slot ASC
      `).all();
      res.json(slots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch all availability" });
    }
  });

  app.post("/api/admin/availability", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const { user_id, date, time_slot } = req.body;
    try {
      const result = db.prepare("INSERT INTO availability (user_id, date, time_slot) VALUES (?, ?, ?)").run(user_id, date, time_slot);
      res.json({ id: result.lastInsertRowid, user_id, date, time_slot, is_booked: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to add availability" });
    }
  });

  app.delete("/api/admin/availability/:id", authenticate, (req: any, res: any) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    try {
      db.prepare("DELETE FROM availability WHERE id = ?").run(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete availability" });
    }
  });

  // Orders Routes
  app.post("/api/orders", (req, res) => {
    const { name, email, phone, address, date, time_slot, service_type } = req.body;
    const needsCar = !address.toLowerCase().includes("praha") ? 1 : 0;

    try {
      const bestSlot = db.prepare(`
        SELECT a.id as availability_id, u.id as user_id
        FROM availability a
        JOIN users u ON a.user_id = u.id
        WHERE a.date = ? AND a.time_slot = ? AND a.is_booked = 0
        AND (? = 0 OR u.has_car = 1)
        ORDER BY u.priority DESC
        LIMIT 1
      `).get(date, time_slot, needsCar) as any;

      let claimed_by = null;
      let status = 'pending';

      if (bestSlot) {
        claimed_by = bestSlot.user_id;
        status = 'claimed';
        db.prepare("UPDATE availability SET is_booked = 1 WHERE id = ?").run(bestSlot.availability_id);
      }

      const result = db.prepare(`
        INSERT INTO orders (name, email, phone, address, date, time_slot, service_type, status, claimed_by_user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, email, phone, address, date, time_slot, service_type, status, claimed_by);

      res.json({ id: result.lastInsertRowid, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", authenticate, (req: any, res: any) => {
    try {
      let orders;
      if (req.user.role === "admin") {
        orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
      } else {
        // Cleaners see orders they claimed or unassigned ones that match their availability
        orders = db.prepare(`
          SELECT o.* FROM orders o
          WHERE o.claimed_by_user_id = ? 
          OR (o.status = 'pending' AND EXISTS (
            SELECT 1 FROM availability a WHERE a.user_id = ? AND a.date = o.date AND a.time_slot = o.time_slot
          ))
          ORDER BY o.created_at DESC
        `).all(req.user.id, req.user.id);
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.put("/api/orders/:id/claim", authenticate, (req: any, res: any) => {
    try {
      const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id) as any;
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.status !== "pending") return res.status(400).json({ error: "Order already claimed" });

      db.prepare("UPDATE orders SET status = 'claimed', claimed_by_user_id = ? WHERE id = ?").run(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to claim order" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const path = await import("path");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
