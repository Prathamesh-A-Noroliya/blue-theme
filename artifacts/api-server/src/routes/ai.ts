import { Router } from "express";

const router = Router();

router.post("/ai/chatbot", async (req, res) => {
  const { message } = req.body;
  const msg = (message ?? "").toLowerCase();

  let response = "I can help you with road conditions, sensor data, complaints, and public spending. What would you like to know?";

  if (msg.includes("health") || msg.includes("score")) {
    response = "The average road health score across monitored Pune roads is 53/100. Critical roads include Katraj Ghat (38/100) and NH-48 near Khopoli (32/100). Immediate action recommended.";
  } else if (msg.includes("fc road") || msg.includes("goodluck")) {
    response = "FC Road near Goodluck Chowk, Pune has a health score of 45/100 with high risk. PMC Road Dept has managed this stretch. Budget utilization is monitored. AI recommends pothole patching before monsoon.";
  } else if (msg.includes("sensor") || msg.includes("anomal")) {
    response = "Today's sensor network shows 8 live anomalies. The most critical readings are on NH-48 near Khopoli (vibration: 9.1/10) and Katraj Ghat (vibration: 7.2/10). Both roads are flagged for imminent failure risk.";
  } else if (msg.includes("corruption") || msg.includes("suspicious")) {
    response = "The AI Corruption Detector has flagged MSRDC and PWD Maharashtra Pune Division. MSRDC shows 1 corruption flag — repeat failures across 18 roads. PWD Pune Division has 1 corruption flag with a trust score of 66/100.";
  } else if (msg.includes("spend") || msg.includes("money") || msg.includes("budget")) {
    response = "The platform is tracking ₹505 Crores allocated for road maintenance across Pune region in FY 2024-25. Current spending stands at ₹505 Crores. ₹2.9 Crores are estimated as wasted on repeated repairs that should not have been necessary.";
  } else if (msg.includes("risk") || msg.includes("fail")) {
    response = "The AI Risk Map predicts 2 road failures within 7 days: Katraj Ghat (97% risk) and NH-48 near Khopoli (94% risk). Within 30 days, 3 roads total are predicted to fail. Preventive action can save an estimated ₹3.2 Crores in emergency repairs.";
  } else if (msg.includes("katraj") || msg.includes("ghat")) {
    response = "Katraj Ghat, Pune is in critical condition with a health score of 38/100 and 97% failure probability. Sensor vibration is at 7.2/10. Contractor PWD Maharashtra Pune Division has been flagged. Immediate intervention by PMC is recommended.";
  } else if (msg.includes("hadapsar")) {
    response = "Hadapsar Junction, Pune has a health score of 58/100 with medium risk. PMC Road Dept manages this road. Sensor S-02 is currently offline. Current health indicates manageable wear with scheduled maintenance.";
  } else if (msg.includes("nh-48") || msg.includes("khopoli")) {
    response = "NH-48 near Khopoli has a health score of 32/100 with critical risk. NHAI Pune Zone manages this stretch. This road has shown 3 sensor spikes in the past week. AI recommends immediate resurfacing.";
  }

  res.json({ response, timestamp: new Date().toISOString() });
});

router.get("/ai/insights", async (req, res) => {
  res.json([
    { id: 1, title: "High repeat failure risk on NH-48 near Khopoli", description: "Road has shown 3 sensor spikes in 1 week. NHAI Pune Zone flagged.", severity: "critical", confidence: 0.92, roadId: 3 },
    { id: 2, title: "Budget overrun on Mumbai-Pune Expressway", description: "12% budget overrun with health score of 72/100.", severity: "high", confidence: 0.87, roadId: 6 },
    { id: 3, title: "Predicted failure in 7 days: Katraj Ghat", description: "Sensor data indicates imminent road failure. Health score 38/100.", severity: "critical", confidence: 0.95, roadId: 1 },
    { id: 4, title: "PWD Pune Division pattern detected", description: "1 corruption flag across 15 road contracts.", severity: "high", confidence: 0.89, roadId: null },
  ]);
});

router.post("/ai/scan", async (req, res) => {
  await new Promise(r => setTimeout(r, 500));
  res.json({
    issueType: "Pothole Formation",
    severity: "high",
    confidence: 0.91,
    healthScore: 38,
    riskLevel: "high",
    detectedIssues: ["Surface pothole", "Edge crumbling", "Water seepage", "Asphalt delamination"],
    recommendation: "Immediate patching required. Pothole depth exceeds 5cm. Risk of vehicle damage high. Recommend full-depth repair with quality hot-mix asphalt.",
    shouldFileComplaint: true,
  });
});

router.get("/ai/corruption-flags", async (req, res) => {
  res.json([
    { id: 1, type: "Repeated Repair", description: "5 repair cycles on Nashik Phata in 4 years", roadName: "Nashik Phata, Pimpri", contractorName: "PWD Maharashtra Pune Division", severity: "critical", evidence: "5 repair cycles in 48 months", detectedAt: "2024-04-10", status: "open" },
    { id: 2, type: "Budget Overrun", description: "Repair cost unusually high for short lifespan", roadName: "NH-48 near Khopoli", contractorName: "MSRDC", severity: "critical", evidence: "₹3.2Cr spent vs ₹2.8Cr allocated.", detectedAt: "2024-04-12", status: "open" },
    { id: 3, type: "Low Quality Score", description: "Contractor with multiple failed roads", roadName: "Katraj Ghat, Pune", contractorName: "PWD Maharashtra Pune Division", severity: "high", evidence: "3 of 6 roads show critical failure.", detectedAt: "2024-04-08", status: "under review" },
    { id: 4, type: "Suspicious Pattern", description: "Rapid re-failure after repair", roadName: "Nashik Phata, Pimpri", contractorName: "PWD Maharashtra Pune Division", severity: "high", evidence: "Each repair fails within 10-14 months.", detectedAt: "2024-04-15", status: "open" },
  ]);
});

router.get("/roads/risk-map", async (req, res) => {
  res.json([
    { id: 1, roadId: 1, roadName: "Katraj Ghat, Pune", latitude: 18.453, longitude: 73.868, riskScore: 97, riskLevel: "critical", predictedFailureIn: "2-5 days", reason: "Extreme vibration. Health score 38/100." },
    { id: 2, roadId: 3, roadName: "NH-48 near Khopoli", latitude: 18.789, longitude: 73.348, riskScore: 94, riskLevel: "critical", predictedFailureIn: "3-7 days", reason: "3 sensor spikes. Health 32/100." },
    { id: 3, roadId: 5, roadName: "Nashik Phata, Pimpri", latitude: 18.627, longitude: 73.802, riskScore: 78, riskLevel: "high", predictedFailureIn: "2-3 weeks", reason: "5 failures in 4 years." },
    { id: 4, roadId: 2, roadName: "Hadapsar Junction, Pune", latitude: 18.508, longitude: 73.925, riskScore: 45, riskLevel: "medium", predictedFailureIn: "1-2 months", reason: "Gradual health decline." },
    { id: 5, roadId: 4, roadName: "Swargate Circle, Pune", latitude: 18.501, longitude: 73.863, riskScore: 32, riskLevel: "medium", predictedFailureIn: "2-3 months", reason: "Moderate wear." },
    { id: 6, roadId: 6, roadName: "Mumbai-Pune Expressway KM 42", latitude: 18.591, longitude: 73.423, riskScore: 8, riskLevel: "low", predictedFailureIn: "12+ months", reason: "Well maintained." },
  ]);
});

export default router;
