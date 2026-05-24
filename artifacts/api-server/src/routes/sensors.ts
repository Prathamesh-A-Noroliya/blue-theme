import { Router } from "express";
import { db } from "@workspace/db";
import { sensorStreamsTable as sensorStreams, roadsTable as roads } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/sensors/overview", async (req, res) => {
  try {
    const streams = await db.select().from(sensorStreams);
    const anomalies = streams.filter(s => (s.vibrationIntensity ?? 0) > 6);
    res.json({
      activeSensors: 847,
      roadsMonitored: await db.select().from(roads).then(r => r.length),
      liveAnomalyCount: anomalies.length,
      avgVibrationScore: Number((streams.reduce((a, s) => a + (s.vibrationIntensity ?? 0), 0) / (streams.length || 1)).toFixed(1)),
      currentStressLevel: anomalies.length > 3 ? "high" : "medium",
      criticalZones: anomalies.filter(s => (s.vibrationIntensity ?? 0) > 8).length,
      dataPointsToday: 12847,
      uptime: 99.7,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/sensors/feed", async (req, res) => {
  try {
    const streams = await db.select({
      id: sensorStreams.id, roadId: sensorStreams.roadId, roadName: roads.name,
      vibrationIntensity: sensorStreams.vibrationIntensity, shockSpikes: sensorStreams.shockSpikes,
      roughnessIndex: sensorStreams.roughnessIndex, temperature: sensorStreams.temperature,
      humidity: sensorStreams.humidity, sensorStatus: sensorStreams.sensorStatus,
      damageClassification: sensorStreams.damageClassification, damageProbability: sensorStreams.damageProbability,
      timestamp: sensorStreams.timestamp,
    }).from(sensorStreams).leftJoin(roads, eq(sensorStreams.roadId, roads.id)).orderBy(desc(sensorStreams.timestamp));
    res.json(streams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/sensors/analytics", async (req, res) => {
  const streams = await db.select().from(sensorStreams).catch(() => []);
  res.json({
    vibrationTrend: Array.from({ length: 24 }, (_, i) => ({
      time: `${String(i).padStart(2, "0")}:00`,
      "NH-48 Khopoli": 7 + Math.random() * 3,
      "Katraj Tunnel": 7 + Math.random() * 2,
      "Baner Road": 3 + Math.random() * 2,
      "Nashik Phata": 1.5 + Math.random(),
    })),
    anomalyByRoad: [
      { road: "NH-48 near Khopoli", count: 14, severity: "critical" },
      { road: "Katraj Ghat, Pune", count: 9, severity: "critical" },
      { road: "Nashik Phata, Pimpri", count: 7, severity: "high" },
      { road: "Baner Road", count: 3, severity: "medium" },
      { road: "Hadapsar Junction", count: 0, severity: "low" },
    ],
    conditionDistribution: [
      { condition: "Smooth", percentage: 25, count: 2 },
      { condition: "Rough", percentage: 37.5, count: 3 },
      { condition: "Anomaly", percentage: 25, count: 2 },
      { condition: "Critical", percentage: 12.5, count: 1 },
    ],
    stressTrend: Array.from({ length: 30 }, (_, i) => ({ date: `Apr ${i + 1}`, stress: 3.5 + Math.sin(i * 0.3) * 1.5 })),
    predictedFailures7Days: 2,
    predictedFailures30Days: 3,
  });
});

router.get("/sensors/alerts", async (req, res) => {
  res.json([
    { id: 1, roadName: "NH-48 near Khopoli", alertType: "Critical Anomaly", message: "Repeated high vibration detected. Likely crack formation imminent.", severity: "critical", timestamp: "08:03:44", resolved: false },
    { id: 2, roadName: "Katraj Ghat, Pune", alertType: "Stress Warning", message: "Vibration trend rising for 5 days. Monitor closely.", severity: "critical", timestamp: "08:01:23", resolved: false },
    { id: 3, roadName: "Hadapsar Junction", alertType: "Sensor Offline", message: "Sensor S-02 has been offline for 2 hours. Maintenance dispatch required.", severity: "high", timestamp: "06:30:00", resolved: false },
    { id: 4, roadName: "Nashik Phata, Pimpri", alertType: "Vibration Warning", message: "Rising vibration over 3 days. Maintenance scheduled.", severity: "medium", timestamp: "07:45:00", resolved: false },
  ]);
});

export default router;
