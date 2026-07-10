import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const [color, setColor] = useState("#111111");
  const [brushSize, setBrushSize] = useState(6);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.lineCap = "round";
    context.lineJoin = "round";
  }, []);

  const getPointerPosition = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const rectangle = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rectangle.left) * (canvas.width / rectangle.width),
      y: (event.clientY - rectangle.top) * (canvas.height / rectangle.height),
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const position = getPointerPosition(event);

    if (!canvas || !context || !position) {
      return;
    }

    isDrawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);

    context.beginPath();
    context.moveTo(position.x, position.y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const position = getPointerPosition(event);

    if (!context || !position) {
      return;
    }

    context.lineWidth = brushSize;
    context.strokeStyle = color;
    context.globalCompositeOperation = isEraser
      ? "destination-out"
      : "source-over";

    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context || !isDrawingRef.current) {
      return;
    }

    isDrawingRef.current = false;
    context.closePath();

    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const exportCanvasElement = document.createElement("canvas");
    const exportContext = exportCanvasElement.getContext("2d");

    exportCanvasElement.width = canvas.width;
    exportCanvasElement.height = canvas.height;

    if (!exportContext) {
      return;
    }

    exportContext.fillStyle = "#ffffff";
    exportContext.fillRect(
      0,
      0,
      exportCanvasElement.width,
      exportCanvasElement.height,
    );

    exportContext.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "drawspace.png";
    link.href = exportCanvasElement.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="app">
      <header className="header">
        <div>
          <h1>Drawspace</h1>
          <p>Draw freely on your canvas.</p>
        </div>
      </header>

      <section className="workspace">
        <div className="canvas-wrapper">
          <div className="toolbar">
            <label className="control">
              <span>Color</span>

              <input
                type="color"
                value={color}
                disabled={isEraser}
                onChange={(event) => setColor(event.target.value)}
              />
            </label>

            <label className="control brush-control">
              <span>Brush size: {brushSize}px</span>

              <input
                type="range"
                min="1"
                max="50"
                value={brushSize}
                onChange={(event) => setBrushSize(Number(event.target.value))}
              />
            </label>

            <button
              type="button"
              className={!isEraser ? "active" : ""}
              onClick={() => setIsEraser(false)}
            >
              Brush
            </button>

            <button
              type="button"
              className={isEraser ? "active" : ""}
              onClick={() => setIsEraser(true)}
            >
              Eraser
            </button>

            <button type="button" onClick={clearCanvas}>
              Clear
            </button>

            <button type="button" onClick={exportCanvas}>
              Export PNG
            </button>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              className="drawing-canvas"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
