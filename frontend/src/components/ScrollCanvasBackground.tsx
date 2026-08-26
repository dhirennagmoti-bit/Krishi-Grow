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

    // We have 300 frames. 1-indexed.
    const frameCount = 300;
    const currentFrame = (index: number) => 
      `/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

    const images: HTMLImageElement[] = [];
    const airpods = {
      frame: 0
    };

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // Set initial canvas size and draw first frame when it loads
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };

    const render = () => {
      // floor the frame index to handle decimal scrub values
      const frameIndex = Math.floor(airpods.frame);
      if (images[frameIndex] && images[frameIndex].complete) {
        const img = images[frameIndex];
        
        // Calculate dimensions to cover the canvas (like object-fit: cover)
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

    images[0].onload = setCanvasSize;
    window.addEventListener('resize', setCanvasSize);

    // Refresh ScrollTrigger to recalculate document height after React mounts
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    // Setup GSAP ScrollTrigger
    const trigger = gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
      onUpdate: render
    });

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      trigger.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen z-[-1] pointer-events-none transition-opacity"
    />
  );
};
