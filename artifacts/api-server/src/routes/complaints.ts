import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable as complaints } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/complaints", async (req, res) => {
  try {
    const result = await db.select().from(complaints).orderBy(complaints.createdAt);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

router.post("/complaints", async (req, res) => {
  try {
    const { title, description, location, severity, issueType, reportedBy } = req.body;
    const complaintId = `CMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const [result] = await db.insert(complaints).values({
      complaintId, title, description, location, severity, issueType,
      reportedBy: reportedBy ?? "anonymous", status: "pending",
      assignedDepartment: "Roads Department",
    }).returning();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create complaint" });
  }
});

router.get("/complaints/stats", async (req, res) => {
  try {
    const all = await db.select().from(complaints);
    const byStatus = Object.entries(all.reduce((acc: any, c) => {
      const s = c.status ?? "unknown"; acc[s] = (acc[s] ?? 0) + 1; return acc;
    }, {})).map(([status, count]) => ({ status, count }));
    const byType = Object.entries(all.reduce((acc: any, c) => {
      const t = c.issueType ?? "Other"; acc[t] = (acc[t] ?? 0) + 1; return acc;
    }, {})).map(([type, count]) => ({ type, count }));
    return res.json({ byStatus, byType });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

router.get("/complaints/:id", async (req, res) => {
  try {
    const [result] = await db.select().from(complaints).where(eq(complaints.id, Number(req.params.id))).limit(1);
    if (!result) return res.status(404).json({ error: "Complaint not found" });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
