import { Router } from "express";
import { db } from "@workspace/db";
import { contractorsTable as contractors, roadsTable as roads, repairLogsTable as repairLogs } from "@workspace/db/schema";

const router = Router();

router.get("/spending/overview", async (req, res) => {
  try {
    const allRoads = await db.select().from(roads);
    const totalBudget = allRoads.reduce((a, r) => a + (r.allocatedBudget ?? 0), 0);
    const totalSpent = allRoads.reduce((a, r) => a + (r.spentBudget ?? 0), 0);
    res.json({
      totalBudget, totalSpent,
      wastedOnRepeatRepairs: 29000000,
      suspiciousTransactions: 4,
      avgCostPerKm: 6500000,
      roadsUnderBudget: allRoads.filter(r => (r.spentBudget ?? 0) <= (r.allocatedBudget ?? 0)).length,
      roadsOverBudget: allRoads.filter(r => (r.spentBudget ?? 0) > (r.allocatedBudget ?? 0)).length,
      yearlyTrend: [
        { year: "2021", budget: 120000000, spent: 115000000, quality: 74 },
        { year: "2022", budget: 145000000, spent: 142000000, quality: 68 },
        { year: "2023", budget: 195000000, spent: 198000000, quality: 58 },
        { year: "2024", budget: totalBudget || 505000000, spent: totalSpent || 505000000, quality: 52 },
      ],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/spending/contractor-breakdown", async (req, res) => {
  try {
    const cs = await db.select().from(contractors);
    const result = cs.map(c => ({
      contractorId: c.id, contractorName: c.name,
      totalSpent: c.totalValue ?? 0,
      qualityScore: c.avgHealthScore ?? 50,
      efficiency: c.trustScore ?? 50,
      flagged: (c.corruptionFlags ?? 0) > 0,
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/spending/corruption-flags", async (req, res) => {
  res.json([
    { id: 1, type: "Repeated Repair", description: "5 repair cycles on Nashik Phata in 4 years", roadName: "Nashik Phata, Pimpri", contractorName: "PWD Maharashtra Pune Division", severity: "critical", evidence: "5 repair cycles in 48 months", detectedAt: "2024-04-10", status: "open" },
    { id: 2, type: "Budget Overrun", description: "Repair cost unusually high for short lifespan", roadName: "NH-48 near Khopoli", contractorName: "MSRDC", severity: "critical", evidence: "₹3.2Cr spent vs ₹2.8Cr allocated.", detectedAt: "2024-04-12", status: "open" },
    { id: 3, type: "Low Quality Score", description: "Contractor with multiple failed roads", roadName: "Katraj Ghat, Pune", contractorName: "PWD Maharashtra Pune Division", severity: "high", evidence: "3 of 6 roads show critical failure.", detectedAt: "2024-04-08", status: "under review" },
    { id: 4, type: "Suspicious Pattern", description: "Rapid re-failure after repair", roadName: "Nashik Phata, Pimpri", contractorName: "PWD Maharashtra Pune Division", severity: "high", evidence: "Each repair fails within 10-14 months.", detectedAt: "2024-04-15", status: "open" },
  ]);
});

export default router;
