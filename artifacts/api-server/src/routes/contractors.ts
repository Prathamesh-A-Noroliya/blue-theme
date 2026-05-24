import { Router } from "express";
import { db } from "@workspace/db";
import { contractorsTable as contractors, roadsTable as roads } from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/contractors", async (req, res) => {
  try {
    const result = await db.select().from(contractors);
    return res.json(result.map(c => ({
      id: c.id, name: c.name, location: c.location ?? "Pune, Maharashtra",
      roadsManaged: c.roadsManaged ?? 0, totalContracts: c.totalContracts ?? 0,
      totalValue: c.totalValue ?? 0, avgHealthScore: c.avgHealthScore ?? 50,
      trustScore: c.trustScore ?? 50, failedRoads: c.failedRoads ?? 0,
      repeatFailures: c.repeatFailures ?? 0, corruptionFlags: c.corruptionFlags ?? 0,
      status: c.status ?? "active",
    })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch contractors" });
  }
});

router.get("/contractors/:id", async (req, res) => {
  try {
    const [c] = await db.select().from(contractors).where(eq(contractors.id, Number(req.params.id))).limit(1);
    if (!c) return res.status(404).json({ error: "Not found" });
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
});

export default router;
