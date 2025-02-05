import React, { useEffect, useRef, useState } from "react";

function DrawingBorad() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState('#000000'); 
  const [size, setSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;
  }, []);

 
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;  
    const scaleY = canvasRef.current.height / rect.height;  
    
    return {
      x: (e.clientX - rect.left) * scaleX, 
      y: (e.clientY - rect.top) * scaleY   
    };
  };
  


  const startDrawing = (e) => {
    const { x, y } = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  // Draw while mouse is moving
  const draw = (e) => {
    if (!isDrawing) return;

    const { x, y } = getMousePos(e);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.strokeStyle = color;
    ctxRef.current.lineWidth = parseInt(size, 10);  
    ctxRef.current.stroke();
  };


  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };


  const clearCanvas = () => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };


  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <canvas
          ref={canvasRef}
          className="border-2 h-3/4 w-3/4 border-gray-400 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        ></canvas>
        <div className="flex gap-4 mt-4 items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            type="range"
            min={1}
            max={30}
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="cursor-pointer"
          />
          <p>{size}</p>
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-900"
          >
            Clear
          </button>
          <button
            onClick={saveDrawing}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-900"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default DrawingBorad;
