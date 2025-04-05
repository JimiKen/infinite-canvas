import React, { useEffect, useRef } from "react";
import { fabric as Fabric } from "fabric";
import "./index.css";

export default function App() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const canvas = new Fabric.Canvas("canvas", {
      width: window.innerWidth - 120,
      height: window.innerHeight,
      backgroundColor: "#f9fafb",
      selection: true,
    });

    canvas.setZoom(1);
    fabricRef.current = canvas;

    const handleResize = () => {
      canvas.setWidth(window.innerWidth - 120);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const cell = new Fabric.Rect({
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
      editable: true,
    });
    fabricRef.current.add(cell);
    fabricRef.current.add(text);
  };

  const handleDrop = (type) => {
    switch (type) {
      case "rect":
        addRect();
        break;
      case "line":
        addLine();
        break;
      case "cell":
        addCell();
        break;
      default:
        break;
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div draggable onDragStart={(e) => e.dataTransfer.setData('type', 'rect')}>矩形</div>
        <div draggable onDragStart={(e) => e.dataTransfer.setData('type', 'line')}>线条</div>
        <div draggable onDragStart={(e) => e.dataTransfer.setData('type', 'cell')}>单元格</div>
        <div className="click-tools">
          <button onClick={addRect}>添加矩形</button>
          <button onClick={addLine}>添加线条</button>
          <button onClick={addCell}>添加单元格</button>
        </div>
      </div>
      <canvas
        id="canvas"
        ref={canvasRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const type = e.dataTransfer.getData('type');
          handleDrop(type);
        }}
      />
    </div>
  );
}