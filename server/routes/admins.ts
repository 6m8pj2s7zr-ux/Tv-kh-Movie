import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateAdminBody, DeleteAdminParams, ListAdminsResponse } from "@workspace/api-zod";
import { requireOwner } from "./auth";

const router: IRouter = Router();

router.get("/admins", requireOwner, async (req, res): Promise<void> => {
  const admins = await db.select({ id: adminsTable.id, username: adminsTable.username, role: adminsTable.role }).from(adminsTable).orderBy(adminsTable.createdAt);
  res.json(ListAdminsResponse.parse({ admins }));
});

router.post("/admins", requireOwner, async (req, res): Promise<void> => {
  const parsed = CreateAdminBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [admin] = await db.insert(adminsTable).values({ username: parsed.data.username, passwordHash: await bcrypt.hash(parsed.data.password, 10), role: parsed.data.role ?? "admin" }).returning();
  res.status(201).json({ id: admin.id, username: admin.username, role: admin.role });
});

router.delete("/admins/:id", requireOwner, async (req, res): Promise<void> => {
  const params = DeleteAdminParams.safeParse(req.params);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }
  const [admin] = await db.delete(adminsTable).where(eq(adminsTable.id, params.data.id)).returning();
  if (!admin) { res.status(404).json({ error: "Admin not found" }); return; }
  res.sendStatus(204);
});

export default router;
