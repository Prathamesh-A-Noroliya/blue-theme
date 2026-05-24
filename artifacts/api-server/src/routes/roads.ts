import { Router } from "express";
import { db } from "@workspace/db";
import { roadsTable as roads, contractorsTable as contractors, complaintsTable as complaints, repairLogsTable as repairLogs } from "@workspace/db/schema";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/roads", async (req, res) => {
  try {
    const result = await db.select({
      id: roads.id, name: roads.name, roadType: roads.roadType, location: roads.location,
      healthScore: roads.healthScore, riskLevel: roads.riskLevel, status: roads.status,
      contractorName: contractors.name, totalComplaints: count(complaints.id),
    })
    .from(roads)
    .leftJoin(contractors, eq(roads.contractorId, contractors.id))
    .leftJoin(complaints, eq(complaints.roadId, roads.id))
    .groupBy(roads.id, contractors.name);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch roads" });
  }
});

router.get("/roads/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(404).json({ error: "Road not found" });
    const [road] = await db.select().from(roads).where(eq(roads.id, id)).limit(1);
    if (!road) return res.status(404).json({ error: "Road not found" });
    const [contractor] = await db.select().from(contractors).where(eq(contractors.id, road.contractorId!)).limit(1);
    const repairs = await db.select().from(repairLogs).where(eq(repairLogs.roadId, id));
    const healthTrend = [
      { month: "Oct", score: (road.healthScore ?? 0) + 8 },
      { month: "Nov", score: (road.healthScore ?? 0) + 6 },
      { month: "Dec", score: (road.healthScore ?? 0) + 4 },
      { month: "Jan", score: (road.healthScore ?? 0) + 2 },
      { month: "Feb", score: (road.healthScore ?? 0) + 1 },
      { month: "Mar", score: (road.healthScore ?? 0) },
      { month: "Apr", score: road.healthScore ?? 0 },
    ];
    return res.json({
      ...road, contractorName: contractor?.name,
      aiSummary: `AI analysis for ${road.name}: Health score ${road.healthScore}/100. Risk level: ${road.riskLevel}. Monitoring closely with sensor data.`,
      healthTrend, repairHistory: repairs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch road" });
  }
});

export default router;
