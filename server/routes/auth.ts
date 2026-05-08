import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody } from "@workspace/api-zod";

const router: IRouter = Router();
const JWT_SECRET = process.env.SESSION_SECRET || "mkhtv-secret-2024";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
  } catch { return null; }
}

export function requireAuth(req: any, res: any, next: any): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  const payload = verifyToken(auth.slice(7));
  if (!payload) { res.status(401).json({ error: "Invalid token" }); return; }
  req.admin = payload;
  next();
}

export function requireOwner(req: any, res: any, next: any): void {
  requireAuth(req, res, () => {
    if (req.admin?.role !== "owner") { res.status(403).json({ error: "Owner access required" }); return; }
    next();
  });
}

// POST /auth/login — ចូល Admin Panel
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid request" }); return; }

  const { password } = parsed.data;
  const allAdmins = await db.select().from(adminsTable).limit(20);
  let admin: any;
  for (const a of allAdmins) {
    if (await bcrypt.compare(password, a.passwordHash)) { admin = a; break; }
  }

  if (!admin) { res.status(401).json({ error: "Invalid password" }); return; }

  const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, admin: { id: admin.id, username: admin.username, role: admin.role } });
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req: any, res): Promise<void> => {
  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, req.admin.id));
  if (!admin) { res.status(401).json({ error: "Admin not found" }); return; }
  res.json({ id: admin.id, username: admin.username, role: admin.role });
});

// PUT /auth/password — ប្ដូរ code សម្ងាត់ (owner only)
router.put("/auth/password", requireOwner, async (req: any, res): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) { res.status(400).json({ error: "currentPassword and newPassword are required" }); return; }
  if (newPassword.length < 6) { res.status(400).json({ error: "New password must be at least 6 characters" }); return; }

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, req.admin.id));
  if (!admin) { res.status(404).json({ error: "Admin not found" }); return; }
  if (!await bcrypt.compare(currentPassword, admin.passwordHash)) { res.status(401).json({ error: "Current password is incorrect" }); return; }

  await db.update(adminsTable).set({ passwordHash: await bcrypt.hash(newPassword, 10) }).where(eq(adminsTable.id, admin.id));
  res.json({ success: true });
});

export default router;
