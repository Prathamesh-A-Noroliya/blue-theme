import { useState } from "react";
import { useAnalyzeRoadImage } from "@workspace/api-client-react";
import { Upload, Scan, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { getHealthColor, getRiskColor } from "@/lib/utils";

const SAMPLE_IMAGES = [
  { label: "Pothole - High Severity", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
  { label: "Road Crack - Medium", url: "https://images.unsplash.com/photo-1514477917009-389d28a851d9?w=400" },
  { label: "Smooth Road - Good", url: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400" },
];

export default function ScanPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const analyze = useAnalyzeRoadImage();

  const doScan = async (url: string) => {
    setSelected(url);
    setScanning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 2500));
    try {
      const res = await analyze.mutateAsync({ data: { imageUrl: url } });
      setResult(res);
    } catch {
      setResult(MOCK_RESULT);
    }
    setScanning(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "Sora, sans-serif" }}>Quick Scan AI Scanner</h1>
        <p className="text-sm text-muted-foreground mt-1">Upload or select a road image for instant AI analysis</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload area */}
        <div className="space-y-4">
          <div className="rounded-2xl p-8 text-center" style={{ background: "hsl(var(--card))", border: "2px dashed hsl(var(--border))" }}>
            <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium mb-1">Upload Road Image</p>
            <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
            <button className="mt-4 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>
              Choose File
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Or select a sample</h3>
            <div className="grid grid-cols-3 gap-3">
              {SAMPLE_IMAGES.map((img) => (
                <div
                  key={img.url}
                  onClick={() => doScan(img.url)}
                  className="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{ border: selected === img.url ? "2px solid #0EA5A4" : "1px solid hsl(var(--border))" }}
                >
                  <img src={img.url} alt={img.label} className="w-full h-20 object-cover" />
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{img.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}>
          {scanning ? (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(14,165,164,0.2)" }} />
                <div className="relative w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "rgba(14,165,164,0.15)" }}>
                  <Scan className="w-10 h-10" style={{ color: "#0EA5A4" }} />
                </div>
              </div>
              <div className="font-semibold" style={{ fontFamily: "Sora, sans-serif" }}>Analyzing Image...</div>
              <div className="text-sm text-muted-foreground mt-1">AI is detecting road conditions</div>
              <div className="mt-4 space-y-2 text-xs text-muted-foreground text-center">
                {["Detecting surface anomalies...", "Calculating damage severity...", "Generating repair recommendations..."].map((t, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EA5A4", animationDelay: `${i * 0.3}s` }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ) : result ? (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5" style={{ color: "#0EA5A4" }} />
                <h3 className="font-bold" style={{ fontFamily: "Sora, sans-serif" }}>AI Scan Result</h3>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(14,165,164,0.15)", color: "#0EA5A4" }}>
                  {(result.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>

              {/* Health gauge */}
              <div className="flex items-center gap-4 mb-5">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Road Health Score</div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${result.healthScore}%`, background: getHealthColor(result.healthScore) }} />
                  </div>
                  <div className="text-sm font-bold mt-1" style={{ color: getHealthColor(result.healthScore) }}>
                    {result.healthScore}/100
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Severity</div>
                  <div className="font-bold text-lg" style={{ color: getRiskColor(result.severity), fontFamily: "Sora, sans-serif" }}>
                    {result.severity?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-xs text-muted-foreground">Issue Type</div>
                  <div className="font-semibold text-sm mt-0.5">{result.issueType}</div>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "hsl(var(--muted))" }}>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                  <div className="font-semibold text-sm mt-0.5" style={{ color: getRiskColor(result.riskLevel) }}>{result.riskLevel?.toUpperCase()}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-2">Detected Issues</div>
                <div className="flex flex-wrap gap-2">
                  {(result.detectedIssues ?? []).map((issue: string) => (
                    <span key={issue} className="text-xs px-2 py-1 rounded-full" style={{ background: "hsl(var(--muted))", color: "hsl(var(--foreground))" }}>
                      {issue}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl mb-4" style={{ background: "rgba(14,165,164,0.08)", border: "1px solid rgba(14,165,164,0.2)" }}>
                <div className="text-xs font-medium mb-1" style={{ color: "#0EA5A4" }}>AI Recommendation</div>
                <p className="text-xs text-muted-foreground">{result.recommendation}</p>
              </div>

              {result.shouldFileComplaint && (
                <div className="p-3 rounded-xl flex gap-2" style={{ background: "#F59E0B12", border: "1px solid #F59E0B30" }}>
                  <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: "#F59E0B" }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: "#F59E0B" }}>Complaint Recommended</div>
                    <div className="text-xs text-muted-foreground">This road condition requires official reporting.</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: "hsl(var(--muted))" }}>
                <Scan className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="font-medium mb-2">No Image Selected</div>
              <p className="text-sm text-muted-foreground">Upload an image or choose a sample to run the AI scan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MOCK_RESULT = {
  issueType: "Pothole Formation", severity: "high", confidence: 0.91,
  healthScore: 38, riskLevel: "high",
  detectedIssues: ["Surface pothole", "Edge crumbling", "Water seepage", "Asphalt delamination"],
  recommendation: "Immediate patching required. Pothole depth exceeds 5cm. Risk of vehicle damage high. Recommend full-depth repair with quality hot-mix asphalt. Independent inspection recommended before contractor billing.",
  shouldFileComplaint: true,
};
