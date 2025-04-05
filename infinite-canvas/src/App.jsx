import React, { useEffect, useRef } from "react";
import { fabric as Fabric } from "fabric";
import * as XLSX from "xlsx";

export default function InfiniteCanvas() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const canvas = new Fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#f9fafb",
    });

    canvas.setZoom(1);
    fabricRef.current = canvas;

    const handleResize = () => {
      canvas.setWidth(window.innerWidth);
      canvas.setHeight(window.innerHeight);
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const htmlString = XLSX.utils.sheet_to_html(worksheet);

      const div = document.createElement("div");
      div.innerHTML = htmlString;
      div.style.background = "white";
      div.style.padding = "10px";
      div.style.border = "1px solid #ccc";

      const html = new Fabric.Rect({
        left: 100,
        top: 100,
        width: 300,
        height: 200,
        fill: "white",
        stroke: "#999",
        strokeWidth: 1,
        selectable: true,
      });

      fabricRef.current.add(html);

      const text = new Fabric.Textbox("Excel Table", {
        left: 110,
        top: 110,
        fontSize: 14,
        fill: "#111",
      });
      fabricRef.current.add(text);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} className="p-2" />
      <canvas ref={canvasRef} />
    </div>
  );
}