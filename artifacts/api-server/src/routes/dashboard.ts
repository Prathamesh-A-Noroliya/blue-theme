import { Router } from "express";
import { db } from "@workspace/db";
import { complaintsTable as complaints, roadsTable as roads, sensorStreamsTable as sensorStreams, notificationsTable as notifications } from "@workspace/db/schema";
import { eq, count, avg } from "drizzle-orm";

const router = Router();

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [totalComplaints] = await db.select({ count: count() }).from(complaints);
    const [activeComplaints] = await db.select({ count: count() }).from(complaints).where(eq(complaints.status, "pending"));
    const [roadsCount] = await db.select({ count: count() }).from(roads);
    const allRoads = await db.select().from(roads);
    const avgHealth = allRoads.reduce((a, r) => a + (r.healthScore ?? 0), 0) / (allRoads.length || 1);
    const allSensors = await db.select().from(sensorStreams);
    const anomalies = allSensors.filter(s => (s.vibrationIntensity ?? 0) > 6).length;
    res.json({
      totalComplaints: totalComplaints.count, activeComplaints: activeComplaints.count,
      roadsMonitored: roadsCount.count, avgHealthScore: avgHealth, sensorAnomalies: anomalies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/dashboard/recent-activity", async (req, res) => {
  res.json([
    { id: 1, message: "Critical alert: Katraj Ghat health score dropped to 38/100", location: "Pune", timestamp: "2 min ago", severity: "critical" },
    { id: 2, message: "New complaint filed: Large pothole on FC Road near Goodluck Chowk", location: "Pune", timestamp: "8 min ago", severity: "high" },
    { id: 3, message: "Corruption pattern detected: PWD Pune Division flagged", location: "Pune", timestamp: "25 min ago", severity: "high" },
    { id: 4, message: "Sensor offline: Hadapsar Junction S-02 needs maintenance", location: "Pune", timestamp: "1 hr ago", severity: "critical" },
    { id: 5, message: "Repair verified on Swargate Circle flyover", location: "Pune", timestamp: "2 hr ago", severity: "info" },
    { id: 6, message: "Budget overrun: NH-48 near Khopoli exceeded 12%", location: "Khopoli", timestamp: "3 hr ago", severity: "medium" },
  ]);
});

router.get("/notifications", async (req, res) => {
  try {
    const result = await db.select().from(notifications).orderBy(notifications.createdAt);
    res.json(result.map(n => ({ id: n.id, title: n.title, message: n.message, read: n.read, severity: n.type, createdAt: n.createdAt })));
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
