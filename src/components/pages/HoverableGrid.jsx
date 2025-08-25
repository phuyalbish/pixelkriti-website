import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { LIVE_URL } from '@/config/baseurl.js';

const GRID_SPACING = 20;
const FADE_DURATION = 500;
const PRESERVE_DURATION = 500;

const GREEN_SHADES = ["bg-green-400", "bg-green-500", "bg-green-600", "bg-green-700", "bg-green-800"];

const ANIMALS = [
  "Fox", "Tiger", "Eagle", "Wolf", "Lion", "Panther", "Bear", "Hawk",
  "Leopard", "Falcon", "Otter", "Rabbit", "Shark", "Cheetah", "Dolphin"
];

const socket = io(LIVE_URL);

export default function HoverableGrid() {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(0);
  const [activeCells, setActiveCells] = useState([]);
  const [tiltStyle, setTiltStyle] = useState({});
  const [remoteCursors, setRemoteCursors] = useState({});
  const [localCursor, setLocalCursor] = useState({ x: -100, y: -100 });

  // Assign user a random animal name + bright but not too light color
  const userName = useRef(ANIMALS[Math.floor(Math.random() * ANIMALS.length)]);
  const userColor = useRef(`hsl(${Math.random() * 360}, 80%, 55%)`); // vivid, mid-lightness

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (containerRef.current) setHeight(containerRef.current.offsetHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    setLocalCursor({ x: relX, y: relY });

    const gridX = Math.floor(relX / GRID_SPACING);
    const gridY = Math.floor(relY / GRID_SPACING);

    const now = Date.now();
    const randomShade = GREEN_SHADES[Math.floor(Math.random() * GREEN_SHADES.length)];

    const cell = { x: gridX, y: gridY, timestamp: now, shade: randomShade };
    setActiveCells(prev => [...prev.filter(c => !(c.x === gridX && c.y === gridY)), cell]);

    // Send cursor info + name to backend
    socket.emit("cursor-move", { x: relX, y: relY, color: userColor.current, name: userName.current, cell });

    // Tilt effect
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = e.clientX - centerX;
    const offsetY = e.clientY - centerY;
    const maxTilt = 10;
    const rotateY = (-offsetX / rect.width) * maxTilt;
    const rotateX = (offsetY / rect.height) * maxTilt;
    setTiltStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transition: "transform 0.1s ease" });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: `rotateX(0deg) rotateY(0deg)`, transition: "transform 0.5s ease" });
  };

  // Receive remote cursors
  useEffect(() => {
    socket.on("cursor-update", ({ id, x, y, color, name, cell }) => {
      if (id !== socket.id) { // ignore own cursor
        setRemoteCursors(prev => ({ ...prev, [id]: { x, y, color, name, cell } }));
      }
      if (cell) setActiveCells(prev => [...prev.filter(c => !(c.x === cell.x && c.y === cell.y)), cell]);
    });

    socket.on("cursor-remove", (id) => {
      setRemoteCursors(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    });

    return () => {
      socket.off("cursor-update");
      socket.off("cursor-remove");
    };
  }, []);

  // Cleanup expired cells
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveCells(prev => prev.filter(cell => now - cell.timestamp < PRESERVE_DURATION + FADE_DURATION));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Render grid cells
  const rows = Math.ceil(height / GRID_SPACING);
  const cols = Math.ceil(width / GRID_SPACING);
  const gridCells = [];

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = activeCells.find(c => c.x === x && c.y === y);
      let opacity = 0, shade = "";
      if (cell) {
        const age = Date.now() - cell.timestamp;
        shade = cell.shade;
        if (age < PRESERVE_DURATION) opacity = 1;
        else if (age < PRESERVE_DURATION + FADE_DURATION) opacity = 1 - (age - PRESERVE_DURATION)/FADE_DURATION;
      }
      gridCells.push(
        <div key={`${x}-${y}`} className={`absolute border border-white/5 transition-colors duration-150 ${shade}`}
          style={{ left: x*GRID_SPACING, top: y*GRID_SPACING, width: GRID_SPACING, height: GRID_SPACING, opacity, transition:"opacity 0.5s linear" }}
        />
      );
    }
  }

  return (
    <div ref={containerRef} className="relative w-[90vw] h-[90vh] top-[5vh] border border-white/10 overflow-hidden rounded-md"
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={tiltStyle}>
      {gridCells}

      {/* Render remote cursors with dot + names */}
      {Object.entries(remoteCursors).map(([id, { x, y, color, name }]) => (
        <div key={id} className="absolute pointer-events-none"
          style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
        >
          {/* Dot for other users */}
          <div style={{ width: 8, height: 8, backgroundColor: color, borderRadius: "50%" }} />
          <div className="p-1 rounded-full px-2 bg-white text-xs"
               style={{ color, textAlign: "center", marginTop: 10}}>
            {name}
          </div>
        </div>
      ))}

      <div 
  className="absolute bottom-2 right-2 p-1 rounded bg-white text-xs  pointer-events-none"
  style={{ color: userColor.current}}
>
  {userName.current}
</div>
    </div>
  );
}
