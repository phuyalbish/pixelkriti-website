import { useEffect, useRef } from "react";
import { CELL } from "@/lib/dither.js";

/**
 * A trail of pixels drawn under the pointer, on the billboard's face only.
 *
 * The rule the whole thing turns on: a pixel is visible on the LIT parts of the
 * board and invisible on the shadowed ones. That is not a blend mode - it is
 * measured. Every frame, the video is drawn into a tiny offscreen canvas and
 * read back, and each cell looks up the brightness of the video at its own
 * position on the board. Bright there, the cell paints; in shadow, it does not.
 * The shadows move, so the trail dims and lifts as they sweep across it.
 *
 * Sampling the VIDEO rather than the screen is what makes that mapping honest:
 * the video is object-cover cropped, so screen geometry tells you nothing about
 * which part of the frame you are over, while BILLBOARD gives the board's own
 * rectangle inside the frame. The file is same-origin, so the canvas stays
 * untainted and readable.
 *
 * `multiply` for the paint itself, matching the lockup: the pixels sit in the
 * board's own light rather than on top of it. Mount this INSIDE the single
 * transformed group - a transform of its own would give it a new stacking
 * context, and mix-blend-mode only blends within one.
 */

/**
 * How the video's brightness maps to a pixel's opacity.
 *
 * MEASURED off the footage, not guessed: sampled across the clip, the board's
 * own luma is bimodal and stable - the shadowed parts sit at 0.72-0.76 and the
 * lit parts at 0.87-0.95. The split therefore goes between those two clusters.
 * Set SHADOW below 0.72 and the shadows paint too, which is the entire thing
 * this is supposed not to do. If the video is ever recut, re-measure.
 */
const SHADOW = 0.8; // at or below this the board is "in shadow": nothing shows
const LIT = 0.92; // at or above this it is fully lit: the pixel is at full strength
const TINT = 0.86; // the grey the pixels multiply with; 1 is invisible, 0 is black

const LIFE = 900; // ms a cell takes to fade out once it is left behind
const SAMPLE_W = 160; // the offscreen video sampler; small is the point
const SAMPLE_H = 90;

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function PixelTrail({ videoRef, targetRef, billboard, width, height }) {
  const canvasRef = useRef(null);
  const cellsRef = useRef(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    const video = videoRef.current;
    if (!canvas || !target || !video) return undefined;

    /* Coarse pointers have no hover to trail behind. */
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    const ctx = canvas.getContext("2d");
    const sampler = document.createElement("canvas");
    sampler.width = SAMPLE_W;
    sampler.height = SAMPLE_H;
    const sctx = sampler.getContext("2d", { willReadFrequently: true });

    const cells = cellsRef.current;
    let frame;
    let pixels = null;

    const onMove = (event) => {
      /* getBoundingClientRect, not the untransformed geometry: the board is
         mid-zoom most of the time, and the rect already carries the transform,
         so this needs no inverse of its own. */
      const box = canvas.getBoundingClientRect();
      const localX = ((event.clientX - box.left) / box.width) * width;
      const localY = ((event.clientY - box.top) / box.height) * height;
      if (localX < 0 || localY < 0 || localX > width || localY > height) return;

      const cx = Math.floor(localX / CELL);
      const cy = Math.floor(localY / CELL);
      cells.set(`${cx},${cy}`, { cx, cy, at: performance.now() });
    };

    /** The brightness of the video under a cell, 0..1. */
    const brightnessAt = (cx, cy) => {
      if (!pixels) return 1;
      const u =
        billboard.left +
        ((cx + 0.5) * CELL) / width * (billboard.right - billboard.left);
      const v =
        billboard.top +
        ((cy + 0.5) * CELL) / height * (billboard.bottom - billboard.top);
      const px = Math.min(SAMPLE_W - 1, Math.max(0, Math.round(u * SAMPLE_W)));
      const py = Math.min(SAMPLE_H - 1, Math.max(0, Math.round(v * SAMPLE_H)));
      const i = (py * SAMPLE_W + px) * 4;
      /* Rec. 601 luma: the shadows here are neutral, but weighting the channels
         still beats averaging them. */
      return (
        (0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255
      );
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);
      if (!cells.size) return;

      if (video.readyState >= 2) {
        try {
          sctx.drawImage(video, 0, 0, SAMPLE_W, SAMPLE_H);
          pixels = sctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
        } catch {
          /* A tainted canvas would throw here. Same-origin today; if that ever
             changes, the trail simply stops reading the light rather than
             taking the page down with it. */
          pixels = null;
        }
      }

      const now = performance.now();
      for (const [key, cell] of cells) {
        const age = (now - cell.at) / LIFE;
        if (age >= 1) {
          cells.delete(key);
          continue;
        }
        const lit = smoothstep(SHADOW, LIT, brightnessAt(cell.cx, cell.cy));
        const alpha = (1 - age) * lit;
        if (alpha <= 0.01) continue;
        ctx.fillStyle = `rgba(${TINT * 255}, ${TINT * 255}, ${TINT * 255}, ${alpha})`;
        ctx.fillRect(cell.cx * CELL, cell.cy * CELL, CELL, CELL);
      }
    };

    target.addEventListener("mousemove", onMove);
    frame = requestAnimationFrame(draw);

    return () => {
      target.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
      cells.clear();
    };
  }, [videoRef, targetRef, billboard, width, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-pixel-trail=""
      width={width}
      height={height}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}

export default PixelTrail;
