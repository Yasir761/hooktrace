export default function MetricsPage() {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">System Metrics</h1>
  
        <iframe
          src="http://localhost:3005/d/ad5vkvk/hooktrace-dashboard?orgId=1&kiosk"
          className="w-full h-[900px] rounded-xl border"
        />
      </div>
    );
  }