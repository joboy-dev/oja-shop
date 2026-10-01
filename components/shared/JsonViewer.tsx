import React from "react";

type JsonViewerProps = {
  data: Record<string, any>;
  title?: string;
};

const JsonViewer: React.FC<JsonViewerProps> = ({ data, title }) => {
  return (
    <div className="bg-transparent w-full max-w-2xl">
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-start gap-4 border-b py-2 last:border-b-0"
          >
            <div className="text-base text-muted-foreground font-medium">{key}</div>
            <div className={`text-foreground text-base font-medium ${typeof value === "string" && "text-right"} break-all`}>
              {typeof value === "object" && value !== null ? (
                <pre className="text-sm bg-muted p-2 rounded-md whitespace-pre-wrap">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                String(value)
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JsonViewer;
