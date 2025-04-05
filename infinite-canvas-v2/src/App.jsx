import React, { useEffect, useRef, useState } from "react";
import { fabric as Fabric } from "fabric";
import "./index.css";

export default function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [connectMode, setConnectMode] = useState(false);
  const [connectStep, setConnectStep] = useState([]);
  const connectionMap = useRef([]);

  useEffect(() => {
    const canvas = new Fabric.Canvas("canvas", {
      width: window.innerWidth - 120,
      height: window.innerHeight,
      backgroundColor: "#f9fafb",
    });

    fabricRef.current = canvas;

    const handleResize = () => {
      canvas.setWidth(window.innerWidth - 120);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    canvas.on("object:moving", updateConnections);

    canvas.on("mouse:down", (opt) => {
      if (!connectMode) return;
      if (opt.target) {
        setConnectStep((prev) => {
          const next = [...prev, opt.target];
          if (next.length === 2) {
            connectObjects(next[0], next[1]);
            return [];
          }
          return next;
        });
      }
    });

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [connectMode]);

  const addRect = () => {
    const rect = new Fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 60,
      fill: "#ffffff",
      stroke: "#000000",
      strokeWidth: 1,
    });
    fabricRef.current.add(rect);
  };

  const addLine = () => {
    const line = new Fabric.Line([50, 50, 200, 200], {
      stroke: "#000",
      strokeWidth: 2,
    });
    fabricRef.current.add(line);
  };

  const addCell = () => {
    const rect = new Fabric.Rect({
      left: 150,
      top: 150,
      width: 120,
      height: 40,
      fill: "#fff",
      stroke: "#ccc",
      strokeWidth: 1,
    });
    const text = new Fabric.Textbox("单元格", {
      left: 155,
      top: 155,
      fontSize: 14,
      width: 110,
    });
    fabricRef.current.add(rect);
    fabricRef.current.add(text);
  };

  const connectObjects = (obj1, obj2) => {
    const [x1, y1] = getCenter(obj1);
    const [x2, y2] = getCenter(obj2);
    const line = new Fabric.Line([x1, y1, x2, y2], {
      stroke: "blue",
      selectable: false,
      evented: false,
    });
    fabricRef.current.add(line);
    connectionMap.current.push({ line, from: obj1, to: obj2 });
  };

  const updateConnections = () => {
    connectionMap.current.forEach(({ line, from, to }) => {
      const [x1, y1] = getCenter(from);
      const [x2, y2] = getCenter(to);
      line.set({ x1, y1, x2, y2 });
    });
    fabricRef.current.requestRenderAll();
  };

  const getCenter = (obj) => {
    return [obj.left + obj.width / 2, obj.top + obj.height / 2];
  };

  return (
    <div className="app">
      <div className="sidebar">
        <button onClick={addRect}>添加矩形</button>
        <button onClick={addLine}>添加线条</button>
        <button onClick={addCell}>添加单元格</button>
        <button
          style={{ background: connectMode ? '#cce' : '' }}
          onClick={() => {
            setConnectMode(!connectMode);
            setConnectStep([]);
          }}
        >
          {connectMode ? '退出连接模式' : '连接线'}
        </button>
      </div>
      <canvas id="canvas" ref={canvasRef} />
    </div>
  );
}