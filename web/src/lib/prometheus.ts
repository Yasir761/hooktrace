const PROM_URL =
  process.env.PROMETHEUS_URL || "http://localhost:9090";

export async function promQuery<T = unknown>(query: string): Promise<T> {
  const res = await fetch(
    `${PROM_URL}/api/v1/query?query=${encodeURIComponent(query)}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to query Prometheus");
  }

  const json = await res.json();
  return json.data.result;
}

export function getScalar(result: unknown[], fallback = 0) {
  if (!result?.length) return fallback;
  const first = result[0] as { value?: unknown[] } | undefined;
  if (
    !first ||
    !Array.isArray(first.value) ||
    first.value.length < 2 ||
    typeof first.value[1] !== "string"
  ) {
    return fallback;
  }
  const num = Number(first.value[1]);
  return Number.isNaN(num) ? fallback : num;
}


export async function promRangeQuery(query: string) {
    const end = Math.floor(Date.now() / 1000)
    const start = end - 60 * 60 * 24
    const step = 60 * 10
  
    const res = await fetch(
      `${PROM_URL}/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${end}&step=${step}`
    )
    const data = await res.json()
    return data.data.result[0]?.values || []
  }
  