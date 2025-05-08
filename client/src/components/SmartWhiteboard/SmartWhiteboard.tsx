// App.tsx

import { useEffect, useState, useRef } from "react";
import {
  Tldraw,
  createTLStore,
  toRichText,
  createShapeId,
  createBindingId,
} from "tldraw";
import type { TLRecord, TLShapeId } from "tldraw";
import "tldraw/tldraw.css";
import "./SmartWhiteboard.css";
import { CodeRunner } from "../CodeEditor/CodeEditor"; // Import the CodeRunner component as exported
import { Rnd } from "react-rnd";
const RndComponent = Rnd as any;

// Add this helper function at the top of your component or outside it
const mapToValidColor = (color: string): string => {
  // Define valid tldraw colors
  const validColors = [
    "black",
    "grey",
    "light-violet",
    "violet",
    "blue",
    "light-blue",
    "yellow",
    "orange",
    "green",
    "light-green",
    "light-red",
    "red",
    "white",
  ];

  // If the color is already valid, return it
  if (validColors.includes(color)) {
    return color;
  }

  // Map common colors to valid tldraw colors
  const colorMap: Record<string, string> = {
    purple: "violet",
    gray: "grey",
    lightblue: "light-blue",
    lightviolet: "light-violet",
    lightgreen: "light-green",
    lightred: "light-red",
  };

  // Return mapped color or default to "black"
  return colorMap[color.toLowerCase()] || "black";
};

const mapToValidAlign = (align: string): string => {
  // Define valid tldraw align values
  const validAligns = [
    "start",
    "middle",
    "end",
    "start-legacy",
    "middle-legacy",
    "end-legacy",
  ];

  // If the align is already valid, return it
  if (validAligns.includes(align)) {
    return align;
  }

  // Map common align values to valid tldraw align values
  const alignMap: Record<string, string> = {
    left: "start",
    center: "middle",
    right: "end",
  };

  // Return mapped align or default to "middle"
  return alignMap[align.toLowerCase()] || "middle";
};

const mapToValidVerticalAlign = (align: string): string => {
  // Define valid tldraw vertical align values
  const validVerticalAligns = ["start", "middle", "end"];

  // If the align is already valid, return it
  if (validVerticalAligns.includes(align)) {
    return align;
  }

  // Map common vertical align values to valid tldraw values
  const verticalAlignMap: Record<string, string> = {
    top: "start",
    center: "middle",
    middle: "middle",
    bottom: "end",
  };

  // Return mapped align or default to "middle"
  return verticalAlignMap[align.toLowerCase()] || "middle";
};

export default function App() {
  const [store] = useState(() => createTLStore());
  // ... other state variables ... (clientId, status, prompt, isGenerating, wsRef)
  const [clientId, setClientId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "connecting" | "connected" | "error"
  >("idle");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  // Add state for toggling the code editor
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  // Add a ref for the code editor container
  const codeEditorRef = useRef<HTMLDivElement>(null);
  // Add state for tracking focus
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  // Add console logs to debug
  const toggleCodeEditor = () => {
    console.log("Toggling code editor, current state:", showCodeEditor);
    setShowCodeEditor(!showCodeEditor);
    console.log("New state:", !showCodeEditor);
  };

  // Add a click handler for the document to close the editor when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only do this check if the code editor is showing
      if (showCodeEditor && codeEditorRef.current) {
        // Check if the click was outside the code editor
        if (!codeEditorRef.current.contains(event.target as Node)) {
          setShowCodeEditor(false);
        }
      }
    };

    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCodeEditor]);

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      // Only handle Delete key when editor is focused
      if (e.key === "Delete" && showCodeEditor && isEditorFocused) {
        setShowCodeEditor(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCodeEditor, isEditorFocused]);

  // WebSocket useEffect (as previously defined, ensure ping cleanup is solid)
  useEffect(() => {
    if (!clientId) {
      console.log("[App] No clientId yet, skipping WS");
      return;
    }
    console.log(`[App] Connecting WS for clientId=${clientId}`);
    setStatus("connecting");
    const ws = new WebSocket(`ws://localhost:8000/ws/${clientId}`);
    let pingIntervalId: ReturnType<typeof setInterval> | undefined = undefined;

    ws.onopen = () => {
      console.log("[App][WS] open");
      setStatus("connected");
      pingIntervalId = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log("[App][WS] ping");
          ws.send("ping");
        }
      }, 30000);
    };

    ws.onmessage = (evt) => {
      console.log("[App][WS] message received:", evt.data);
      try {
        const shapes = JSON.parse(evt.data);
        clearCanvas();
        if (!Array.isArray(shapes)) {
          throw new Error("Received data is not an array of shapes");
        }

        const recs: TLRecord[] = [];
        const idMap = new Map<string, string>(); // Map original IDs to tldraw IDs

        // First pass: create tldraw IDs for each shape
        shapes.forEach((shape) => {
          if (!shape.id || !shape.type) return;
          const tlId = createShapeId();
          idMap.set(shape.id, tlId);
        });

        // Second pass: create shapes with proper IDs
        shapes.forEach((shape) => {
          if (!shape.id || !shape.type) {
            console.warn(
              "[App] Skipping shape due to missing id or type:",
              shape
            );
            return;
          }

          // Get the tldraw ID for this shape
          const tlId = idMap.get(shape.id);
          if (!tlId) return;

          // Base record properties
          const baseRecord = {
            id: tlId,
            typeName: "shape",
            type: shape.type,
            x: shape.x ?? 0,
            y: shape.y ?? 0,
            rotation: shape.rotation ?? 0,
            isLocked: shape.isLocked ?? false,
            opacity: shape.opacity ?? 1,
            index:
              shape.index ?? "a" + Math.random().toString(36).substring(2, 10),
            parentId: "page:page",
            meta: {}, // Add empty meta object
          };

          // Process shape-specific properties
          if (
            shape.type === "geo" ||
            [
              "rectangle",
              "oval",
              "diamond",
              "triangle",
              "hexagon",
              "cloud",
            ].includes(shape.type)
          ) {
            // For backward compatibility, if the type is a specific geo shape, convert it to geo type
            const actualType = "geo";
            const geoShape =
              shape.type === "geo" ? shape.props?.geo : shape.type;

            // Convert text to richText and remove the text property
            const richText =
              shape.props?.richText ?? toRichText(shape.props?.text ?? "");

            const geoProps = {
              geo: geoShape ?? "rectangle",
              w: shape.props?.w ?? 100,
              h: shape.props?.h ?? 100,
              color: mapToValidColor(shape.props?.color ?? "black"),
              labelColor: mapToValidColor(shape.props?.labelColor ?? "black"),
              fill: shape.props?.fill ?? "solid",
              dash: shape.props?.dash ?? "draw",
              size: shape.props?.size ?? "m",
              font: shape.props?.font ?? "draw",
              align: mapToValidAlign(shape.props?.align ?? "middle"),
              verticalAlign: mapToValidVerticalAlign(
                shape.props?.verticalAlign ?? "middle"
              ),
              url: shape.props?.url ?? "",
              growY: shape.props?.growY ?? 0,
              scale: shape.props?.scale ?? 1,
              richText: richText,
            };

            recs.push({
              ...baseRecord,
              type: actualType, // Always use "geo" as the type
              props: geoProps,
            } as TLRecord);
          } else if (shape.type === "arrow") {
            console.log("[App] Processing arrow shape:", shape);

            // Calculate a default position for the arrow
            const arrowX = shape.x ?? 0;
            const arrowY = shape.y ?? 0;

            // Map the bound shape IDs to their tldraw IDs
            let startBindingId = null;
            let endBindingId = null;

            // Process start binding
            if (
              shape.props?.start?.type === "binding" &&
              shape.props?.start?.boundShapeId
            ) {
              const boundTlId = idMap.get(shape.props.start.boundShapeId);
              if (boundTlId) {
                startBindingId = boundTlId;
              }
            }

            // Process end binding
            if (
              shape.props?.end?.type === "binding" &&
              shape.props?.end?.boundShapeId
            ) {
              const boundTlId = idMap.get(shape.props.end.boundShapeId);
              if (boundTlId) {
                endBindingId = boundTlId;
              }
            }

            // Process arrow shape - following tldraw's expected structure
            const arrowProps = {
              dash: shape.props?.dash ?? "draw",
              size: shape.props?.size ?? "m",
              fill: shape.props?.fill ?? "none",
              color: mapToValidColor(shape.props?.color ?? "black"),
              labelColor: mapToValidColor(shape.props?.labelColor ?? "black"),
              bend: shape.props?.bend ?? 0,
              // Just x and y coordinates for start and end
              start: {
                x: 0,
                y: 0,
              },
              end: {
                x: 100,
                y: 100,
              },
              // Add the missing labelPosition property
              labelPosition: 0.5,
              // Add the missing scale property
              scale: 1,
              arrowheadStart: shape.props?.arrowheadStart ?? "none",
              arrowheadEnd: shape.props?.arrowheadEnd ?? "arrow",
              text: shape.props?.text ?? "",
              font: shape.props?.font ?? "draw",
            };

            // Create the arrow shape
            recs.push({
              ...baseRecord,
              props: arrowProps,
            } as TLRecord);

            // Create bindings if needed
            if (startBindingId) {
              store.put([
                {
                  id: createBindingId(),
                  typeName: "binding",
                  type: "arrow",
                  fromId: tlId as unknown as TLShapeId,
                  toId: startBindingId as unknown as TLShapeId,
                  meta: {}, // Add empty meta object
                  props: {
                    terminal: "start",
                    normalizedAnchor: shape.props?.start?.normalizedAnchor ?? {
                      x: 0.5,
                      y: 0.5,
                    },
                    isExact: shape.props?.start?.isExact ?? false,
                    isPrecise: false,
                  },
                },
              ]);
            }

            if (endBindingId) {
              store.put([
                {
                  id: createBindingId(),
                  typeName: "binding",
                  type: "arrow",
                  fromId: tlId as unknown as TLShapeId,
                  toId: endBindingId as unknown as TLShapeId,
                  meta: {}, // Add empty meta object
                  props: {
                    terminal: "end",
                    normalizedAnchor: shape.props?.end?.normalizedAnchor ?? {
                      x: 0.5,
                      y: 0.5,
                    },
                    isExact: shape.props?.end?.isExact ?? false,
                    isPrecise: false,
                  },
                },
              ]);
            }
          } else if (shape.type === "text") {
            console.log("[App] Processing text shape:", shape);

            // Convert text to richText
            const richText =
              shape.props?.richText ?? toRichText(shape.props?.text ?? "");

            // Explicitly set textAlign to a valid value
            const textAlign = shape.props?.textAlign || "middle";
            console.log("[App] Using textAlign:", textAlign);

            const textProps = {
              color: mapToValidColor(shape.props?.color ?? "black"),
              size: shape.props?.size ?? "m",
              font: shape.props?.font ?? "draw",
              textAlign: textAlign, // Explicitly set to a valid value
              w: shape.props?.w ?? 200,
              autoSize: shape.props?.autoSize ?? true,
              scale: shape.props?.scale ?? 1, // Add scale property
              richText: richText,
            };

            console.log("[App] Final text props:", textProps);

            recs.push({
              ...baseRecord,
              props: textProps,
            } as TLRecord);
          } else {
            console.warn(`[App] Unknown shape type: ${shape.type}. Skipping.`);
          }
        });

        if (recs.length) {
          console.log(
            "[App] Adding",
            recs.length,
            "processed records to store"
          );
          try {
            // Add all records at once
            store.put(recs);
          } catch (e: any) {
            console.error("[App] Error during store.put():", e.message, e);
            setStatus("error");
          }
        } else {
          console.log("[App] No valid records to add to store.");
        }

        setIsGenerating(false);
      } catch (err) {
        console.error(
          "[App] Shape processing or WebSocket message error:",
          err
        );
        setStatus("error");
        setIsGenerating(false);
      }
    };

    ws.onerror = (err) => {
      console.error("[App][WS] error", err);
      setStatus("error");
      setIsGenerating(false);
    };

    ws.onclose = (ev) => {
      console.log("[App][WS] close", ev.code, ev.reason);
      if (pingIntervalId) {
        clearInterval(pingIntervalId);
      }
      setStatus("idle");
    };

    wsRef.current = ws;
    return () => {
      console.log("[App][WS] cleanup: closing WebSocket");
      if (pingIntervalId) {
        clearInterval(pingIntervalId);
      }
      ws.close();
    };
  }, [clientId]);

  // generateDiagram and clearCanvas methods (ensure they are correctly implemented as per previous suggestions)
  const generateDiagram = async () => {
    if (!prompt.trim() || isGenerating) {
      console.log(
        "[App] generateDiagram skipped (no prompt, or already generating)"
      );
      return;
    }
    console.log("[App] Generating diagram for prompt:", prompt);
    setIsGenerating(true);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      console.log(
        "[App] Closing existing WebSocket before new generation request."
      );
      wsRef.current.close(); // This will trigger onclose and cleanup
    }

    try {
      const res = await fetch("http://localhost:8000/generate-diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      console.log("[App] HTTP POST /generate-diagram status:", res.status);
      const responseBodyText = await res.text();
      console.log("[App] HTTP POST response body:", responseBodyText);

      if (!res.ok) {
        let errorMsg = `HTTP ${res.status} - ${res.statusText}`;
        try {
          const errorJson = JSON.parse(responseBodyText);
          errorMsg = errorJson.detail || errorJson.error || errorMsg;
        } catch (e) {
          /* ignore parsing error */
        }
        throw new Error(errorMsg);
      }
      const data = JSON.parse(responseBodyText);
      console.log("[App] Parsed JSON response:", data);

      if (!data.client_id)
        throw new Error("Missing client_id in backend response");
      setClientId(data.client_id); // Triggers useEffect for new WebSocket
    } catch (err) {
      console.error("[App] generateDiagram fetch error:", err);
      setStatus("error");
      setIsGenerating(false);
    }
  };

  const clearCanvas = () => {
    console.log("[App] Clearing canvas");
    const allShapesInStore = store
      .allRecords()
      .filter((r) => r.typeName === "shape");
    console.log(
      "[App] Found",
      allShapesInStore.length,
      "shapes in store to remove."
    );
    if (allShapesInStore.length > 0) {
      store.remove(allShapesInStore.map((s) => s.id));
      console.log("[App] Canvas cleared.");
    } else {
      console.log("[App] Canvas already empty or no shapes found.");
    }
  };

  // Add a click handler for the document to manage focus
  useEffect(() => {
    const handleDocumentClick = (e: any) => {
      // Check if the click was outside the editor
      if (showCodeEditor) {
        // Find the editor element
        const editorElement = document.querySelector(".rnd-container");
        if (editorElement && !editorElement.contains(e.target)) {
          // Click was outside the editor, blur it
          setIsEditorFocused(false);
        }
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [showCodeEditor]);

  // JSX structure (as previously defined)
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Voice Diagram Generator</h1>
        <div className="input-container">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateDiagram()}
            placeholder="Describe your diagram..."
            disabled={isGenerating || status === "connecting"}
            className="prompt-input"
          />
          <button
            onClick={generateDiagram}
            disabled={isGenerating || !prompt.trim() || status === "connecting"}
            className={`generate-button ${isGenerating ? "generating" : ""}`}
          >
            {isGenerating ? "Generating..." : "Generate Diagram"}
          </button>
          <button
            onClick={clearCanvas}
            disabled={isGenerating}
            className="clear-button"
          >
            Clear Canvas
          </button>
          {/* Add a toggle button for the code editor */}
          <button onClick={toggleCodeEditor} className="code-editor-button">
            {showCodeEditor ? "Hide Code Editor" : "Show Code Editor"}
          </button>
          <div className={`status-indicator status-${status}`}>
            {status === "connecting"
              ? "Connecting..."
              : status === "connected"
              ? "Connected"
              : status === "error"
              ? "Error"
              : "Idle"}
          </div>
        </div>
      </header>
      <main className="canvas-container">
        <Tldraw store={store} />
        {/* Render the CodeEditor component conditionally with improved handling */}
        {showCodeEditor && (
          <RndComponent
            className="rnd-container"
            default={{
              x: window.innerWidth / 2 - 350,
              y: window.innerHeight / 2 - 250,
              width: 700,
              height: 500,
            }}
            minWidth={400}
            minHeight={300}
            bounds="window"
            style={{
              backgroundColor: "#1e1e1e",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              overflow: "hidden",
              zIndex: isEditorFocused ? 1001 : 1000,
              border: isEditorFocused
                ? "2px solid #0078d4"
                : "2px solid transparent",
              position: "absolute",
            }}
            onMouseDown={() => setIsEditorFocused(true)}
            dragHandleClassName="header"
            disableDragging={false}
          >
            <CodeRunner onFocus={() => setIsEditorFocused(true)} />
          </RndComponent>
        )}
      </main>
    </div>
  );
}
