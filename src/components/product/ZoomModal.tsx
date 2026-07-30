"use client";

import { useEffect, useRef } from "react";

export function ZoomModal({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return;

    let zoom = 1;
    let minZoom = 1;
    const maxZoom = 4;
    let posX = 0;
    let posY = 0;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let raf = 0;

    function apply() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!img) return;
        img.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${zoom})`;
      });
    }

    function onImgLoad() {
      if (!img || !stage) return;
      const r = stage.getBoundingClientRect();
      const scale = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
      zoom = scale;
      minZoom = scale;
      posX = 0;
      posY = 0;
      apply();
    }

    function stageToImageCoords(stageX: number, stageY: number) {
      const r = stage!.getBoundingClientRect();
      const offsetX = r.width / 2 + posX;
      const offsetY = r.height / 2 + posY;
      return { x: (stageX - r.left - offsetX) / zoom, y: (stageY - r.top - offsetY) / zoom };
    }

    function zoomAt(stageX: number, stageY: number, newZoom: number) {
      const boundedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
      const before = stageToImageCoords(stageX, stageY);
      zoom = boundedZoom;
      const after = stageToImageCoords(stageX, stageY);
      posX += (after.x - before.x) * zoom;
      posY += (after.y - before.y) * zoom;
      apply();
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0008);
      zoomAt(e.clientX, e.clientY, zoom * factor);
    }

    function onMouseDown(e: MouseEvent) {
      dragging = true;
      startX = e.clientX - posX;
      startY = e.clientY - posY;
      stage!.classList.add("is-dragging");
      img!.style.transition = "none";
    }
    function onMouseMove(e: MouseEvent) {
      if (!dragging) return;
      posX = e.clientX - startX;
      posY = e.clientY - startY;
      apply();
    }
    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      img!.style.transition = "transform 0.1s ease-out";
      stage!.classList.remove("is-dragging");
    }

    let pinchStartZoom = 1;
    let pinchStartDist = 0;
    let pinchCx = 0;
    let pinchCy = 0;

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        const [a, b] = [e.touches[0], e.touches[1]];
        pinchStartDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        pinchStartZoom = zoom;
        pinchCx = (a.clientX + b.clientX) / 2;
        pinchCy = (a.clientY + b.clientY) / 2;
      } else if (e.touches.length === 1) {
        dragging = true;
        startX = e.touches[0].clientX - posX;
        startY = e.touches[0].clientY - posY;
        img!.style.transition = "none";
      }
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [a, b] = [e.touches[0], e.touches[1]];
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        zoomAt(pinchCx, pinchCy, pinchStartZoom * (dist / pinchStartDist));
      } else if (e.touches.length === 1 && dragging) {
        posX = e.touches[0].clientX - startX;
        posY = e.touches[0].clientY - startY;
        apply();
      }
    }
    function onTouchEnd() {
      dragging = false;
      img!.style.transition = "transform 0.1s ease-out";
    }

    img.addEventListener("load", onImgLoad);
    if (img.complete) onImgLoad();
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(raf);
      img.removeEventListener("load", onImgLoad);
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [src]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative h-[80vh] w-[80vw] overflow-hidden rounded-[30px] bg-charcoal shadow-[0_0_40px_rgba(201,168,106,0.35),0_0_80px_rgba(201,168,106,0.2)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close zoomed image"
          className="absolute right-5 top-3.5 z-10 flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-gold bg-charcoal text-xl text-gold shadow-[0_0_10px_rgba(201,168,106,0.15)] transition hover:scale-105 hover:opacity-85"
        >
          &times;
        </button>
        <div
          ref={stageRef}
          className="relative h-full w-full cursor-grab touch-none overflow-hidden [&.is-dragging]:cursor-grabbing"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary
              zoom levels need the raw element; next/image can't drive
              transform-based pan/zoom like this. */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            draggable={false}
            decoding="sync"
            fetchPriority="high"
            className="absolute left-1/2 top-1/2 h-auto max-h-none w-auto max-w-none origin-top-left [backface-visibility:hidden] will-change-transform select-none"
          />
        </div>
      </div>
    </div>
  );
}
