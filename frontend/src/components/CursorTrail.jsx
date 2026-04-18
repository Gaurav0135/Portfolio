import { useEffect, useRef } from "react";

const MAX_POINTS = 18;

const buildSmoothPath = (points) => {
  if (!points.length) return "";
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const xc = (current.x + next.x) / 2;
    const yc = (current.y + next.y) / 2;
    d += ` Q ${current.x} ${current.y} ${xc} ${yc}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
};

export default function CursorTrail() {
  const pathRef = useRef(null);
  const softPathRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return undefined;
    }

    const target = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
    const current = { ...target };
    const points = [];

    let rafId = 0;

    const handlePointerMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;

      points.unshift({ x: current.x, y: current.y });
      if (points.length > MAX_POINTS) {
        points.pop();
      }

      if (pathRef.current) {
        pathRef.current.setAttribute("d", buildSmoothPath(points));
      }

      if (softPathRef.current) {
        softPathRef.current.setAttribute("d", buildSmoothPath(points));
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${current.x}px, ${current.y}px)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cursor-trail-layer" aria-hidden="true">
      <svg className="cursor-trail-svg" viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
        <path ref={softPathRef} className="cursor-trail-path-soft" d="" />
        <path ref={pathRef} className="cursor-trail-path" d="" />
      </svg>
      <div ref={dotRef} className="cursor-trail-dot" />
    </div>
  );
}
