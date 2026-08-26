import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ScrollCanvasBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const frameCount = 300;
    const currentFrame = (index: number) => 
      `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const airpods = {
      frame: 0
    };

    // Load first image immediately for initial render
    const firstImg = new Image();
    firstImg.src = currentFrame(1);
    images[0] = firstImg;

    const render = () => {
      const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(airpods.frame)));
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth > 0) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetY = 0;
          offsetX = (canvas.width - drawWidth) / 2;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    setCanvasSize();
    firstImg.onload = setCanvasSize;
    window.addEventListener('resize', setCanvasSize);

    // Preload remaining images in background chunks
    for (let i = 2; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images[i - 1] = img;
    }

    // Setup GSAP ScrollTrigger
    const trigger = gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
      onUpdate: render
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('resize', setCanvasSize);
      trigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen -z-10 pointer-events-none transition-opacity object-cover opacity-50"
      />
      {/* Ambient background glow gradient */}
      <div className="fixed inset-0 -z-20 bg-radial from-emerald-950/40 via-[#070a08] to-[#040605] pointer-events-none" />
    </>
  );
};
