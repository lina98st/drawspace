import { useRef } from "react";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #ccc" }}
    />
  );
}

export default App;
