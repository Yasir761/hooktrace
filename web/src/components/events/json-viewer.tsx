"use client";

import { Button } from "@/components/ui/button";

export function JsonViewer({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown>;
}) {
  function copy() {
    navigator.clipboard.writeText(
      JSON.stringify(data, null, 2)
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={copy}
        >
          Copy
        </Button>
      </div>

      <pre className="rounded-md bg-muted p-4 text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
