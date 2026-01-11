import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Award, ChevronRight, ArrowRight, Play,
  Quote, Trophy, Heart, Globe, Crown, CheckCircle, Loader2
} from 'lucide-react';
import { usePortfolioData } from './hooks/usePortfolioData';
import { supabase } from './lib/supabase';
import type { HeroContent, HeroImage } from './types/portfolio';

// --- COMPONENT: FLOATING MESH BACKGROUND ---
const FloatingMeshBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 1.1, 1],
          opacity: [0.05, 0.12, 0.08, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[120%] h-[120%] bg-violet-600 blur-[80px] mix-blend-multiply"
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 40, 0],
          y: [0, 40, -40, 0],
          scale: [1, 1.1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 right-0 w-[80%] h-[80%] bg-indigo-500 blur-[100px] mix-blend-multiply"
      />
    </div>
  );
};

// --- PART 1: HERO SECTION (PARTICLE BACKGROUND + IMAGE SLIDESHOW) ---
const HeroSlideshow = ({ heroData, heroImages }: { heroData: HeroContent; heroImages: HeroImage[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Default images if none provided
  const defaultImages: HeroImage[] = [
    { image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', alt_text: 'Technology', brightness: 80, order_index: 0, is_active: true },
    { image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80', alt_text: 'Circuit', brightness: 75, order_index: 1, is_active: true },
    { image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80', alt_text: 'Code', brightness: 70, order_index: 2, is_active: true },
  ];
  
  const images = heroImages.length > 0 ? heroImages : defaultImages;
  
  // Auto-advance slideshow
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Particle neural network background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const particleCount = 350; 
    const connectionDistance = 100;
    const mouseDistance = 250;
    const gridSpeed = 0.4;
    let gridOffset = 0;
    let autoTiltAngle = 0;

    const mouse = { x: null as number | null, y: null as number | null };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; 
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches && e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * (canvas!.height * 0.75);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseColor = Math.random() > 0.5 ? '139, 92, 246' : '99, 102, 241';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height * 0.8) this.vy = -this.vy; 

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
             const forceDirectionX = dx / distance;
             const forceDirectionY = dy / distance;
             const force = (mouseDistance - distance) / mouseDistance;
             this.x -= forceDirectionX * force * 4;
             this.y -= forceDirectionY * force * 4;
          }
        }
      }

      draw() {
        ctx!.fillStyle = `rgba(${this.baseColor}, 0.7)`; 
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function drawLandscape() {
        const horizonY = canvas!.height * 0.65;
        const centerX = canvas!.width / 2;
        let tiltX = 0;
        if (mouse.x !== null) {
            tiltX = (mouse.x - centerX) * 0.03; 
        } else {
            autoTiltAngle += 0.008;
            tiltX = Math.sin(autoTiltAngle) * (canvas!.width * 0.04);
        }

        const gradient = ctx!.createLinearGradient(0, horizonY - 100, 0, horizonY + 200);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, horizonY - 100, canvas!.width, 300);

        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(0, horizonY, canvas!.width, canvas!.height - horizonY);
        ctx!.clip();

        ctx!.strokeStyle = "rgba(139, 92, 246, 0.12)";
        ctx!.lineWidth = 1;
        const spacing = canvas!.width * 1.5 / 20;
        for(let i = -10; i <= 30; i++) {
            const xBase = (i * spacing) - tiltX;
            ctx!.beginPath();
            ctx!.moveTo(centerX + (xBase - centerX) * 0.1, horizonY);
            ctx!.lineTo(xBase + (xBase - centerX) * 4, canvas!.height);
            ctx!.stroke();
        }

        gridOffset = (gridOffset + gridSpeed) % 40;
        for(let i = 0; i < 20; i++) {
            const z = i * 40 + gridOffset;
            const yPos = horizonY + (Math.pow(z / 800, 2) * (canvas!.height - horizonY));
            if (yPos < canvas!.height && yPos > horizonY) {
                const opacity = Math.min(1, (yPos - horizonY) / 200);
                ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
                ctx!.beginPath();
                ctx!.moveTo(0, yPos);
                ctx!.lineTo(canvas!.width, yPos);
                ctx!.stroke();
            }
        }
        ctx!.restore();
    }

    function animate() {
      ctx!.fillStyle = '#000205'; 
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
                ctx!.beginPath();
                const opacity = 1 - (distance / connectionDistance);
                ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.35})`; 
                ctx!.lineWidth = 0.5;
                ctx!.moveTo(particles[i].x, particles[i].y);
                ctx!.lineTo(particles[j].x, particles[j].y);
                ctx!.stroke();
            }
        }
      }
      drawLandscape();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentImage = images[currentIndex];
  const brightness = currentImage?.brightness || 80;

  return (
    <div className="relative w-full h-[85vh] lg:h-screen overflow-hidden border-b border-white/5 bg-[#000205]">
      {/* Particle Neural Network Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-auto" />
      <div className="absolute top-[65%] left-0 w-full h-[150px] bg-violet-600/10 blur-[80px] pointer-events-none" />
      
      {/* Hero Content */}
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 pointer-events-none">
        {/* Badge and Subtitle - Above Image */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-6 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600/80 to-amber-600/80 rounded-full mb-3">
            <Trophy className="w-4 h-4 text-yellow-200" />
            <span className="text-yellow-100 text-sm font-bold tracking-wider">{heroData.badge_text}</span>
          </div>
          <p className="text-slate-400 text-sm tracking-[0.2em] uppercase text-center">
            {heroData.subtitle}
          </p>
        </motion.div>

        {/* Image Slideshow - Smaller frame in center */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-[70rem] md:h-[84rem] lg:h-[96rem] mb-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: `url(${currentImage?.image_url})`,
                  filter: `brightness(${brightness / 100})`
                }}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Slide indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-auto">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Name - Centered below image with hover effect */}
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-12 text-center relative pointer-events-auto cursor-default group/name"
        >
          <span className="relative inline-block transition-all duration-200 group-hover/name:[text-shadow:-4px_0_#00ffff,4px_0_#ff00ff,0_0_30px_rgba(255,255,255,0.5)]">
            {heroData.name}
          </span>
        </motion.h1>

        {/* Stats Row - Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center pointer-events-none"
        >
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_1_value}</div>
            <div className="text-xs text-yellow-500 uppercase tracking-wider mt-1">{heroData.stat_1_label}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_2_value}</div>
            <div className="text-xs text-yellow-500 uppercase tracking-wider mt-1">{heroData.stat_2_label}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_3_value}</div>
            <div className="text-xs text-violet-400 uppercase tracking-wider mt-1">{heroData.stat_3_label}</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_4_value}</div>
            <div className="text-xs text-violet-400 uppercase tracking-wider mt-1">{heroData.stat_4_label}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Keep the old particle code for reference but not used
const _ParticleHeroOld = ({ heroData }: { heroData: HeroContent }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // EXTREMELY DENSE neural net config
    const particleCount = 350; 
    const connectionDistance = 100;
    const mouseDistance = 250;
    const gridSpeed = 0.4;
    let gridOffset = 0;
    let autoTiltAngle = 0;

    const mouse = { x: null as number | null, y: null as number | null };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight; 
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleTouchMove = (e: TouchEvent) => {
        if(e.touches && e.touches.length > 0) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
        }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseColor: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * (canvas!.height * 0.75);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseColor = Math.random() > 0.5 ? '139, 92, 246' : '99, 102, 241';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height * 0.8) this.vy = -this.vy; 

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
             const forceDirectionX = dx / distance;
             const forceDirectionY = dy / distance;
             const force = (mouseDistance - distance) / mouseDistance;
             // Powerful swirl/move effect
             this.x -= forceDirectionX * force * 4;
             this.y -= forceDirectionY * force * 4;
          }
        }
      }

      draw() {
        ctx!.fillStyle = `rgba(${this.baseColor}, 0.7)`; 
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function drawLandscape() {
        const horizonY = canvas!.height * 0.65;
        const centerX = canvas!.width / 2;
        let tiltX = 0;
        if (mouse.x !== null) {
            tiltX = (mouse.x - centerX) * 0.03; 
        } else {
            autoTiltAngle += 0.008;
            tiltX = Math.sin(autoTiltAngle) * (canvas!.width * 0.04);
        }

        const gradient = ctx!.createLinearGradient(0, horizonY - 100, 0, horizonY + 200);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.15)");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, horizonY - 100, canvas!.width, 300);

        ctx!.save();
        ctx!.beginPath();
        ctx!.rect(0, horizonY, canvas!.width, canvas!.height - horizonY);
        ctx!.clip();

        ctx!.strokeStyle = "rgba(139, 92, 246, 0.12)";
        ctx!.lineWidth = 1;
        const spacing = canvas!.width * 1.5 / 20;
        for(let i = -10; i <= 30; i++) {
            const xBase = (i * spacing) - tiltX;
            ctx!.beginPath();
            ctx!.moveTo(centerX + (xBase - centerX) * 0.1, horizonY);
            ctx!.lineTo(xBase + (xBase - centerX) * 4, canvas!.height);
            ctx!.stroke();
        }

        gridOffset = (gridOffset + gridSpeed) % 40;
        for(let i = 0; i < 20; i++) {
            const z = i * 40 + gridOffset;
            const yPos = horizonY + (Math.pow(z / 800, 2) * (canvas!.height - horizonY));
            if (yPos < canvas!.height && yPos > horizonY) {
                const opacity = Math.min(1, (yPos - horizonY) / 200);
                ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.2})`;
                ctx!.beginPath();
                ctx!.moveTo(0, yPos);
                ctx!.lineTo(canvas!.width, yPos);
                ctx!.stroke();
            }
        }
        ctx!.restore();
    }

    function animate() {
      ctx!.fillStyle = '#000205'; 
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);
      
      // Draw Dense Connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < connectionDistance) {
                ctx!.beginPath();
                const opacity = 1 - (distance / connectionDistance);
                ctx!.strokeStyle = `rgba(139, 92, 246, ${opacity * 0.35})`; 
                ctx!.lineWidth = 0.5;
                ctx!.moveTo(particles[i].x, particles[i].y);
                ctx!.lineTo(particles[j].x, particles[j].y);
                ctx!.stroke();
            }
        }
      }
      drawLandscape();
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[85vh] lg:h-screen overflow-hidden border-b border-white/5 bg-[#000205]">
        <canvas ref={canvasRef} className="absolute inset-0 z-0" />
        <div className="absolute top-[65%] left-0 w-full h-[150px] bg-violet-600/10 blur-[80px] pointer-events-none" />
        
        {/* Hero Content */}
        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 pointer-events-none">
            {/* Top Badge */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-600/80 to-amber-600/80 rounded-full mb-4"
            >
                <Trophy className="w-4 h-4 text-yellow-200" />
                <span className="text-yellow-100 text-sm font-bold tracking-wider">{heroData.badge_text}</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-slate-400 text-sm tracking-[0.2em] uppercase mb-6"
            >
                {heroData.subtitle}
            </motion.p>

            {/* Main Name with Hover Glitch Effect */}
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tight mb-6 text-center relative pointer-events-auto cursor-default group/name"
            >
                <span className="relative inline-block transition-all duration-200 group-hover/name:[text-shadow:-4px_0_#00ffff,4px_0_#ff00ff,0_0_30px_rgba(255,255,255,0.5)]">
                    {heroData.name}
                </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl md:text-2xl lg:text-3xl text-slate-300 tracking-wide mb-10 text-center"
            >
                {heroData.tagline} <span className="text-yellow-400 font-medium">{heroData.tagline_highlight}</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4 justify-center mb-16 pointer-events-auto"
            >
                <a href="#about" className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-lg font-bold hover:bg-slate-100 transition-all shadow-lg">
                    Start Journey <ArrowDown className="w-4 h-4" />
                </a>
                <a href="mailto:contact@joela.tech" className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-all border border-slate-600">
                    Contact Me
                </a>
            </motion.div>

            {/* Stats Row */}
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center"
            >
                <div>
                    <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_1_value}</div>
                    <div className="text-xs text-yellow-500 uppercase tracking-wider mt-1">{heroData.stat_1_label}</div>
                </div>
                <div>
                    <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_2_value}</div>
                    <div className="text-xs text-yellow-500 uppercase tracking-wider mt-1">{heroData.stat_2_label}</div>
                </div>
                <div>
                    <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_3_value}</div>
                    <div className="text-xs text-violet-400 uppercase tracking-wider mt-1">{heroData.stat_3_label}</div>
                </div>
                <div>
                    <div className="text-3xl md:text-4xl font-bold text-white">{heroData.stat_4_value}</div>
                    <div className="text-xs text-violet-400 uppercase tracking-wider mt-1">{heroData.stat_4_label}</div>
                   </div>
                </motion.div>
        </div>
    </div>
  );
};

// --- PART 2: SIDEBAR NAVIGATION ---

const menuItems = [
    { id: 'home', label: 'Home', activeClass: 'shadow-[inset_4px_0_0_0_#94a3b8] bg-slate-500/10 text-slate-900 font-bold', hoverClass: 'text-slate-500 hover:bg-slate-500/10 hover:text-slate-900 hover:shadow-[inset_4px_0_0_0_#94a3b8]' },
    { id: 'about', label: '01. About Me', activeClass: 'shadow-[inset_4px_0_0_0_#94a3b8] bg-slate-500/10 text-slate-900 font-bold', hoverClass: 'text-slate-500 hover:bg-slate-500/10 hover:text-slate-900 hover:shadow-[inset_4px_0_0_0_#94a3b8]' },
    { id: 'leadership', label: '02. Experience / Leadership', activeClass: 'shadow-[inset_4px_0_0_0_#8b5cf6] bg-violet-500/10 text-violet-700 font-bold', hoverClass: 'text-slate-500 hover:bg-violet-500/10 hover:text-violet-800 hover:shadow-[inset_4px_0_0_0_#8b5cf6]' },
    { id: 'projects', label: '03. Portfolio Projects', activeClass: 'shadow-[inset_4px_0_0_0_#3b82f6] bg-blue-500/10 text-blue-800 font-bold', hoverClass: 'text-slate-500 hover:bg-blue-500/10 hover:text-blue-800 hover:shadow-[inset_4px_0_0_0_#3b82f6]' },
    { id: 'awards', label: '04. Awards & Recognition', activeClass: 'shadow-[inset_4px_0_0_0_#eab308] bg-yellow-500/10 text-yellow-700 font-bold', hoverClass: 'text-slate-500 hover:bg-yellow-500/10 hover:text-yellow-800 hover:shadow-[inset_4px_0_0_0_#eab308]' },
    { id: 'community', label: '05. Community & Service', activeClass: 'shadow-[inset_4px_0_0_0_#10b981] bg-emerald-500/10 text-emerald-800 font-bold', hoverClass: 'text-slate-500 hover:bg-emerald-500/10 hover:text-emerald-800 hover:shadow-[inset_4px_0_0_0_#10b981]' },
    { id: 'press', label: '06. Media & Press', activeClass: 'shadow-[inset_4px_0_0_0_#ef4444] bg-red-500/10 text-red-700 font-bold', hoverClass: 'text-slate-500 hover:bg-red-500/10 hover:text-red-700 hover:shadow-[inset_4px_0_0_0_#ef4444]' },
    { id: 'publications', label: '07. Publications', activeClass: 'shadow-[inset_4px_0_0_0_#06b6d4] bg-cyan-500/10 text-cyan-800 font-bold', hoverClass: 'text-slate-500 hover:bg-cyan-500/10 hover:text-cyan-800 hover:shadow-[inset_4px_0_0_0_#06b6d4]' },
    { id: 'endorsements', label: '08. Endorsements', activeClass: 'shadow-[inset_4px_0_0_0_#ec4899] bg-pink-500/10 text-pink-700 font-bold', hoverClass: 'text-slate-500 hover:bg-pink-500/10 hover:text-pink-700 hover:shadow-[inset_4px_0_0_0_#ec4899]' },
    { id: 'newsletter', label: '09. Newsletter', activeClass: 'shadow-[inset_4px_0_0_0_#6366f1] bg-indigo-500/10 text-indigo-700 font-bold', hoverClass: 'text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-700 hover:shadow-[inset_4px_0_0_0_#6366f1]' },
];

const Sidebar = ({ activeSection }: { activeSection: string }) => (
    <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-8 space-y-2 ml-2">
            <div className="font-black text-3xl tracking-tighter text-black mb-2 ml-2">JA.</div>
            <nav className="flex flex-col gap-1">
                {menuItems.map((item) => (
                    <a 
                        key={item.id}
                        href={`#${item.id}`} 
                        className={`block px-4 py-3 text-sm transition-all duration-200 ${
                            activeSection === item.id 
                            ? item.activeClass
                            : item.hoverClass
                        }`}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
        </div>
    </aside>
);

// --- PART 3: HOLO CARD (WITH RADIOGRAPHY SCANLINE) ---
interface Project {
  id: string;
  title: string;
  role: string;
  status: string;
  description: string;
  image: string;
  stack: string[];
}

const HoloCard = ({ project }: { project: Project }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full rounded-xl bg-white shadow-xl border border-slate-200 group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 flex flex-col md:flex-row h-full"
    >
        <div className="relative w-full md:w-5/12 h-64 md:h-auto overflow-hidden">
             <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
                <div className="w-full h-[2px] bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] absolute top-0 animate-scanline" />
             </div>
             <div className={`w-full h-full bg-cover bg-center transition-all duration-700 ${hovered ? 'scale-105 filter-none' : 'scale-100 grayscale contrast-125 brightness-100'}`}
                style={{ backgroundImage: `url(${project.image})` }} />
        </div>

        <div className="p-8 flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-blue-600 font-mono">{project.id}</span>
                {project.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
            </div>
            <h4 className="text-2xl font-bold text-slate-900 mb-2">{project.title}</h4>
            <div className="text-violet-600 text-xs font-bold uppercase mb-4 tracking-wider">{project.role}</div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-violet-50 rounded text-xs text-violet-700 border border-violet-100 font-mono font-semibold">{tech}</span>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- PART 4: MAIN APP ---

// Helper to get layout class
const getLayoutClass = (layout?: string) => {
  switch (layout) {
    case 'list': return 'space-y-4';
    case 'grid-3': return 'grid md:grid-cols-3';
    case 'grid-4': return 'grid md:grid-cols-4';
    case 'masonry': return 'columns-2 md:columns-3';
    default: return 'grid md:grid-cols-2';
  }
};

const getGapClass = (gap?: string) => {
  switch (gap) {
    case '2': return 'gap-2';
    case '4': return 'gap-4';
    case '8': return 'gap-8';
    default: return 'gap-6';
  }
};

// Newsletter Form Component with Subscription Functionality
const NewsletterForm = ({ portfolioData }: { portfolioData: any }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email: email.toLowerCase().trim() }]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError('You are already subscribed!');
        } else {
          setError('Something went wrong. Please try again.');
          console.error('Subscription error:', dbError);
        }
      } else {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get current/latest newsletter issue
  const currentIssue = portfolioData.newsletterIssues && portfolioData.newsletterIssues.length > 0 
    ? portfolioData.newsletterIssues[0] 
    : null;
  const currentMonth = currentIssue?.month || 'December 2025';
  
  // Get past issues (all except the first one)
  const pastIssues = portfolioData.newsletterIssues && portfolioData.newsletterIssues.length > 1
    ? portfolioData.newsletterIssues.slice(1)
    : [];

  return (
    <div className="grid md:grid-cols-3 gap-0 items-start">
      {/* Left Column: Current + Newsletter Stacked */}
      <div className="md:col-span-2 space-y-6 pr-0">
        {/* Current Card - Top */}
        <div className="w-full bg-white rounded-lg border border-indigo-100 hover:shadow-lg transition-all duration-300 p-8 min-h-[180px]">
          <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-6">Current</h4>
          {currentIssue ? (
            <a href={currentIssue.link || '#'} className="block group">
              <div className="text-sm text-indigo-500 font-mono mb-4">{currentIssue.month || currentMonth}</div>
              <h5 className="text-base text-slate-800 font-bold group-hover:text-indigo-700 transition-colors">{currentIssue.title}</h5>
            </a>
          ) : (
            <div className="text-base text-slate-600">No current issue</div>
          )}
        </div>

        {/* Newsletter Subscribe Card - Below Current (Smaller) */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden min-h-[280px]">
          <div className="p-6 space-y-4">
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900">Newsletter</h3>
            
            {/* Subscribe text */}
            <p className="text-sm text-slate-600">Subscribe to get monthly updates</p>
            
            {/* Subscribe Form */}
            {subscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="font-bold text-green-800 text-xs">You're subscribed!</p>
                  <p className="text-xs text-green-600">Thank you for joining.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 placeholder-slate-400 transition-all" 
                  disabled={loading}
                />
                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
            
            {/* Footer text */}
            <p className="text-xs text-slate-500 text-center pt-1">
              Join our newsletter to get monthly updates on new tools and features
            </p>
          </div>
        </div>
      </div>

      {/* Past Issues Card - Right */}
      <div className="md:col-span-1 pl-0">
        <div className="bg-white rounded-lg border border-indigo-100 hover:shadow-lg transition-all duration-300 p-8 min-h-[180px]">
          <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-6">Past Issues</h4>
          {pastIssues.length > 0 ? (
            <div className="space-y-5">
              {pastIssues.map((issue: any) => (
                <a key={issue.id} href={issue.link || '#'} className="block group">
                  <div className="text-sm text-indigo-500 font-mono mb-3">{issue.month || issue.issue_number || ''}</div>
                  <h5 className="text-base text-slate-800 font-bold group-hover:text-indigo-700 transition-colors">{issue.title}</h5>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-base text-slate-600">No past issues yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const portfolioData = usePortfolioData();

  // Default projects for fallback
  const defaultProjects: Project[] = [
    { 
      id: "ONC-01", title: "OncoSense", role: "Founder", status: "Active",
      description: "Portable AI ultrasound system for remote cancer screening (Breast, Thyroid, Liver). Addressing healthcare inequality via edge AI.", 
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80", 
      stack: ["Python", "Edge AI", "WebGPU"] 
    },
    { 
      id: "HRO-09", title: "HEROChair", role: "Lead Engineer", status: "Active",
      description: "Brain-computer interface (BCI) allowing hands-free wheelchair control using Muse EEG signals and HoloLens spatial mapping.", 
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80", 
      stack: ["C#", "Unity", "Muse EEG"] 
    },
  ];

  // Use dynamic data if available, otherwise fallback to defaults
  const projects = portfolioData.projects.length > 0 
    ? portfolioData.projects.map(p => ({
        id: `PRJ-${p.id}`,
        title: p.title,
        role: p.subtitle,
        status: p.status,
        description: p.description,
        image: p.image_url,
        stack: p.tags,
      }))
    : defaultProjects;

  // Colored blob for cards
  const ColoredBlob = ({ color }: { color: string }) => {
    const colorMap: Record<string, string> = {
      slate: 'bg-slate-200',
      red: 'bg-red-200',
      pink: 'bg-pink-200',
      yellow: 'bg-yellow-200',
      violet: 'bg-violet-200',
      blue: 'bg-blue-200',
      emerald: 'bg-emerald-200',
      cyan: 'bg-cyan-200',
      indigo: 'bg-indigo-200',
      green: 'bg-green-200',
    };
    return (
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
        <div className={`absolute -top-20 -left-20 w-[80%] h-[80%] ${colorMap[color] || 'bg-violet-200'} blur-[60px] opacity-30`} />
      </div>
    );
  };

  const Section = ({ id, title, chapter, children, color = 'violet', borderColor = 'border-violet-500' }: { id: string; title: string; chapter: string; children: React.ReactNode; color?: string; borderColor?: string }) => {
    const ref = useRef<HTMLElement>(null);
    const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
    useEffect(() => { if (isInView) setActiveSection(id); }, [isInView, id]);
    
    const colorTextMap: Record<string, string> = {
      slate: 'text-slate-500',
      red: 'text-red-600',
      pink: 'text-pink-600',
      yellow: 'text-yellow-600',
      violet: 'text-violet-600',
      blue: 'text-blue-600',
      emerald: 'text-green-600',
      cyan: 'text-cyan-600',
      indigo: 'text-indigo-600',
    };
    
    return (
        <section id={id} ref={ref} className="scroll-mt-24 pb-16">
            <div className={`mb-8 border-l-4 ${borderColor} pl-6`}>
                <span className={`${colorTextMap[color] || 'text-violet-600'} font-bold tracking-widest uppercase text-sm mb-1 block`}>{chapter}</span>
                <h2 className="text-4xl font-black text-black mb-2 tracking-tight">{title}</h2>
            </div>
            {children}
        </section>
    );
  };

  return (
    <div className="bg-[#000205] font-sans selection:bg-violet-500/30">
      <style>{`
        @keyframes scanline {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scanline {
            animation: scanline 3.5s linear infinite;
        }
      `}</style>

      {/* Mobile Header */}
      <div className="lg:hidden fixed w-full z-50 top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-4 flex items-center justify-between shadow-sm">
        <div className="font-bold text-xl tracking-tight text-black">JA.</div>
        <a href="mailto:contact@joela.tech" className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium">Contact</a>
      </div>

      <main className="w-full">
        <section id="home"><HeroSlideshow heroData={portfolioData.hero!} heroImages={portfolioData.heroImages} /></section>
        
        {/* White Content Area Below Hero */}
        <div className="w-full bg-[#ffffff] text-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                <Sidebar activeSection={activeSection} />
                <div className="lg:col-span-9 pt-20 lg:pt-6">
                    
                    {/* ABOUT SECTION */}
                    <Section id="about" title="About Me" chapter="Chapter 01" color="slate" borderColor="border-slate-400">
                        <div className="relative bg-slate-50/50 border border-slate-200 p-10 rounded-3xl overflow-hidden shadow-lg">
                            <ColoredBlob color="slate" />
                            <div className="relative z-10 grid md:grid-cols-5 gap-6 items-start">
                                <div className="md:col-span-3 space-y-8">
                                    <p className="text-slate-700 leading-relaxed text-xl italic">{portfolioData.about?.paragraph_1}</p>
                                    <p className="text-slate-700 leading-relaxed text-xl italic">{portfolioData.about?.paragraph_2}</p>
                                    <div className="flex flex-wrap gap-3 pt-4">
                                        {(portfolioData.about?.tags || ['Robotics', 'Neuroscience', 'AI & ML']).map(tag => (
                                            <span key={tag} className="px-5 py-2.5 bg-white text-slate-600 rounded-full text-sm font-medium border border-slate-200 shadow-sm">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 h-[400px] rounded-2xl overflow-hidden shadow-xl">
                                     <img src={portfolioData.about?.image_url || "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800"} className="w-full h-full object-cover" alt="Joel Amaldas" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* EXPERIENCE / LEADERSHIP SECTION */}
                    <Section id="leadership" title="Experience / Leadership" chapter="Chapter 02" color="violet" borderColor="border-violet-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['leadership'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {(portfolioData.leadership.length > 0 ? portfolioData.leadership : [
                                        { id: 1, title: "Calgary Youth Mayor Council", date: "2025-2026", role: "Council Member", organization: "CITY OF CALGARY", icon: "Crown", color: "violet" },
                                        { id: 2, title: "Young Canadians' Parliament", date: "2025-2026", role: "Parliament Member", organization: "FEDERAL INITIATIVE", icon: "Globe", color: "blue" },
                                        { id: 3, title: "Royal Canadian Air Cadets", date: "Active", role: "Air Cadet", organization: "LEADERSHIP & FLIGHT", icon: "Award", color: "emerald" },
                                        { id: 4, title: "CAYAC", date: "Advisor", role: "Board Advisor", organization: "HEALTHCARE ADVOCACY", icon: "Heart", color: "pink" }
                                    ]).map((item) => {
                                        const IconComponent = item.icon === 'Crown' ? Crown : item.icon === 'Globe' ? Globe : item.icon === 'Award' ? Award : Heart;
                                        const CardWrapper = item.link ? 'a' : 'div';
                                        const cardProps = item.link ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                                        return (
                                        <CardWrapper key={item.id} {...cardProps} className={`relative bg-white shadow-lg p-6 rounded-xl border border-violet-100 hover:shadow-xl hover:-translate-y-1 hover:border-violet-300 transition-all duration-300 group overflow-hidden ${isHorizontal ? 'flex items-center gap-4' : ''} ${item.link ? 'cursor-pointer' : ''}`}>
                                            <ColoredBlob color={item.color} />
                                            <div className="flex-1 relative z-10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                                                    <span className="text-xs font-mono text-violet-600 bg-violet-50 px-2 py-1 rounded border border-violet-100">{item.date}</span>
                                                </div>
                                                <p className="text-slate-600 text-sm mb-3">{item.role}</p>
                                                <div className="text-xs text-violet-500 font-mono flex items-center gap-1"><IconComponent className="w-3 h-3" /> {item.organization}</div>
                                                {item.link && <div className="mt-2 text-xs text-violet-400 flex items-center gap-1">🔗 Click to open</div>}
                                    </div>
                                        </CardWrapper>
                                    )})}
                                </div>
                            );
                        })()}
                    </Section>

                    {/* PORTFOLIO PROJECTS SECTION */}
                    <Section id="projects" title="Portfolio Projects" chapter="Chapter 03" color="blue" borderColor="border-blue-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['projects'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            const showImage = layout?.show_image !== false;
                            const imagePosition = layout?.image_position || 'left';
                            const imageSize = layout?.image_size || 'md';
                            
                            // Image size classes
                            const imageSizeClass = imageSize === 'sm' ? 'w-1/4' : imageSize === 'lg' ? 'w-1/2' : imageSize === 'full' ? 'w-full' : 'w-5/12';
                            
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {projects.map((p) => {
                                        const CardWrapper = p.link ? 'a' : 'div';
                                        const cardProps = p.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                                        
                                        // Determine flex direction based on layout settings
                                        const flexDirection = isHorizontal 
                                            ? (imagePosition === 'right' ? 'flex-row-reverse' : 'flex-row')
                                            : (imagePosition === 'top' ? 'flex-col' : 'flex-col-reverse');
                                        
                                        return (
                                            <CardWrapper 
                                                key={p.id} 
                                                {...cardProps}
                                                className={`relative w-full rounded-xl bg-white shadow-xl border border-slate-200 group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-300 flex ${flexDirection} h-full ${p.link ? 'cursor-pointer' : ''}`}
                                            >
                                                {showImage && p.image && (
                                                    <div className={`relative ${isHorizontal ? imageSizeClass : 'w-full'} ${isHorizontal ? 'h-auto min-h-[200px]' : 'h-64'} overflow-hidden flex-shrink-0`}>
                                                        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
                                                            <div className="w-full h-[2px] bg-cyan-400/80 shadow-[0_0_10px_#22d3ee] absolute top-0 animate-scanline" />
                                        </div>
                                                        <div 
                                                            className="w-full h-full bg-cover bg-center transition-all duration-700 group-hover:scale-105 group-hover:filter-none scale-100 grayscale contrast-125 brightness-100"
                                                            style={{ backgroundImage: `url(${p.image})` }} 
                                                        />
                                    </div>
                                                )}
                                                <div className="p-8 flex flex-col justify-center flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-[10px] uppercase tracking-widest text-blue-600 font-mono">{p.id}</span>
                                                        {p.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                                </div>
                                                    <h4 className="text-2xl font-bold text-slate-900 mb-2">{p.title}</h4>
                                                    <div className="text-violet-600 text-xs font-bold uppercase mb-4 tracking-wider">{p.role}</div>
                                                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">{p.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {p.stack.map((tech: string, i: number) => (
                                                            <span key={i} className="px-2 py-1 bg-violet-50 rounded text-xs text-violet-700 border border-violet-100 font-mono font-semibold">{tech}</span>
                            ))}
                        </div>
                                                    {p.link && <div className="mt-4 text-xs text-blue-400 flex items-center gap-1">🔗 Click to view project</div>}
                                </div>
                                            </CardWrapper>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </Section>

                    {/* AWARDS & RECOGNITION SECTION */}
                    <Section id="awards" title="Awards & Recognition" chapter="Chapter 04" color="yellow" borderColor="border-yellow-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['awards'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {/* Featured Awards */}
                                    {(portfolioData.awards.length > 0 ? portfolioData.awards.filter(a => a.is_featured) : [{ id: 1, title: "Samsung Solve for Tomorrow", description: "National 2nd Place ($10k) + Fan Favourite ($5k)", is_featured: true }]).map(award => {
                                        const CardWrapper = award.link ? 'a' : 'div';
                                        const cardProps = award.link ? { href: award.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                                        return (
                                        <CardWrapper key={award.id} {...cardProps} className={`relative p-6 bg-white shadow-lg border border-yellow-200 rounded-xl overflow-hidden group hover:shadow-xl hover:-translate-y-1 hover:border-yellow-400 transition-all duration-300 ${isHorizontal ? 'flex items-center gap-4' : ''} ${award.link ? 'cursor-pointer' : ''}`}>
                                            <ColoredBlob color="yellow" />
                                            <Trophy className="w-8 h-8 text-yellow-500 relative z-10 flex-shrink-0" />
                                            <div className="relative z-10 flex-1">
                                                <h3 className="text-xl font-bold text-slate-900">{award.title}</h3>
                                                <p className="text-yellow-600 text-sm font-bold">{award.description}</p>
                                                {award.link && <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">🔗 Click to open</div>}
                                            </div>
                                        </CardWrapper>
                                    )})}
                                    {/* Regular Awards */}
                                    {(portfolioData.awards.length > 0 ? portfolioData.awards.filter(a => !a.is_featured) : [
                                        { id: 2, title: "CWSF National", description: "2x Bronze Medalist (2024, 2025)", is_featured: false },
                                        { id: 3, title: "CYSF Regional", description: "4x Gold Medalist (2021, 2023, 2024, 2025)", is_featured: false }
                                    ]).map(award => {
                                        const CardWrapper = award.link ? 'a' : 'div';
                                        const cardProps = award.link ? { href: award.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                                        return (
                                        <CardWrapper key={award.id} {...cardProps} className={`p-6 bg-white shadow-md border border-yellow-100 rounded-xl hover:shadow-lg hover:-translate-y-1 hover:border-yellow-300 transition-all duration-300 group relative overflow-hidden ${isHorizontal ? 'flex items-center gap-4' : ''} ${award.link ? 'cursor-pointer' : ''}`}>
                                            <ColoredBlob color="yellow" />
                                            <div className="relative z-10 flex-1">
                                                <h3 className="font-bold text-slate-900 mb-1">{award.title}</h3>
                                                <p className="text-sm text-yellow-700">{award.description}</p>
                                                {award.link && <div className="mt-2 text-xs text-yellow-400 flex items-center gap-1">🔗 Click to open</div>}
                                            </div>
                                        </CardWrapper>
                                    )})}
                                    {/* Special Awards Card */}
                                    <div className={`p-6 bg-white shadow-md border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-300 ${layout?.layout !== 'list' ? 'col-span-full' : ''}`}>
                                        <h3 className="font-bold text-slate-900 mb-4 text-lg">Special Awards</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {(portfolioData.specialAwards.length > 0 ? portfolioData.specialAwards : [
                                                { id: 1, name: 'Pfizer Oncology Award' }, { id: 2, name: 'Spartan Controls Innovation' }
                                            ]).map((award) => {
                                                if (award.link) {
                                                    return (
                                                        <a 
                                                            key={award.id} 
                                                            href={award.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-800 transition-colors cursor-pointer inline-flex items-center gap-1"
                                                        >
                                                            {award.name} <span className="text-xs">🔗</span>
                                                        </a>
                                                    );
                                                }
                                                return (
                                                    <span key={award.id} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium border border-slate-200 hover:bg-slate-100 transition-colors">{award.name}</span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </Section>

                    {/* COMMUNITY & SERVICE SECTION */}
                    <Section id="community" title="Community & Service" chapter="Chapter 05" color="emerald" borderColor="border-emerald-500">
                        <div className="relative bg-white border border-green-200 shadow-xl rounded-3xl p-8 md:p-12 text-center overflow-hidden group hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300">
                            <ColoredBlob color="emerald" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">{portfolioData.community?.title || 'Silver AI Initiative'}</h2>
                                <p className="text-slate-600 mb-8 max-w-xl mx-auto text-lg leading-relaxed">{portfolioData.community?.description || 'Bridging the generational gap.'}</p>
                                <div className="flex justify-center">
                                    <a href={portfolioData.community?.cta_link || '#'} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-lg">
                                        {portfolioData.community?.cta_text || 'Learn More'} <ChevronRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* MEDIA & PRESS SECTION */}
                    <Section id="press" title="Media & Press" chapter="Chapter 06" color="red" borderColor="border-red-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['press'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {/* Featured Press Items */}
                                    {(portfolioData.press.length > 0 ? portfolioData.press.filter(p => p.is_featured) : [
                                        { id: 1, title: "Top 20 Under 20: Class of 2026", description: "Awarded by Avenue Magazine & Calgary YMCA. Recognized for leadership and innovation.", source: "Headline Honour", is_featured: true, is_video: false, link: "#", color: "red" }
                                    ]).map(item => (
                                        <div key={item.id} className={`relative bg-red-50 border border-red-100 p-8 rounded-2xl group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${layout?.layout !== 'list' ? 'col-span-full' : ''} ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                                            <div className={`relative z-10 ${isHorizontal ? 'flex-1' : ''}`}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{item.source}</span>
                                                </div>
                                                <h3 className="text-3xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                                <p className="text-slate-700 leading-relaxed text-lg mb-6">{item.description}</p>
                                                {item.link && (
                                                    <a href={item.link} className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:gap-3 transition-all">
                                                        Read Feature <ArrowRight className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Regular Press Items */}
                                    {(portfolioData.press.length > 0 ? portfolioData.press.filter(p => !p.is_featured && !p.is_video) : [
                                        { id: 2, title: "Calgary Team Regional Finalist", description: "Featured coverage of the HEROChair project.", source: "CTV NEWS", color: "red" },
                                        { id: 3, title: "Winners Announcement", description: "2nd Place National & Fan Favourite Award.", source: "SAMSUNG", color: "blue" }
                                    ]).map(item => (
                                        <div key={item.id} className={`relative bg-white border border-slate-200 p-6 rounded-2xl group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${isHorizontal ? 'flex items-center gap-4' : ''}`}>
                                            <div className={`relative z-10 ${isHorizontal ? 'flex-1' : ''}`}>
                                                <div className={`text-${item.color}-600 text-lg font-bold uppercase tracking-wide mb-3`}>{item.source}</div>
                                                <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                                                <p className="text-slate-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Video Items */}
                                    {(portfolioData.press.length > 0 ? portfolioData.press.filter(p => p.is_video) : [
                                        { id: 4, title: "National Finals Presentation", source: "Watch Live Pitch", is_video: true, link: "#" }
                                    ]).map(item => (
                                        <div key={item.id} className={`relative bg-red-50 border border-red-100 p-6 rounded-2xl group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between ${layout?.layout !== 'list' ? 'col-span-full' : ''}`}>
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                                    <span className="text-red-600 text-xs font-bold uppercase tracking-widest">{item.source}</span>
                                                </div>
                                                <h4 className="text-2xl font-bold text-slate-900">{item.title}</h4>
                                            </div>
                                            <a href={item.link || '#'} className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 ml-1" fill="white" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </Section>

                    {/* PUBLICATIONS SECTION */}
                    <Section id="publications" title="Publications" chapter="Chapter 07" color="cyan" borderColor="border-cyan-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['publications'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {(portfolioData.publications.length > 0 ? portfolioData.publications : [
                                        { id: 1, title: "Scintix: AI-Driven Radiotherapy at Stanford", description: "Technical analysis of RefleXion's biology-guided radiotherapy.", platform: "MEDIUM", link: "https://medium.com/@joel.amaldas/scintix-how-ai-driven-radiotherapy-from-reflexion-is-revolutionizing-cancer-treatment-at-stanford-2575b5e43755" }
                                    ]).map(pub => (
                                        <a key={pub.id} href={pub.link} target="_blank" rel="noopener noreferrer" className={`relative block p-6 rounded-xl bg-white shadow-lg border border-cyan-100 hover:shadow-xl hover:-translate-y-1 hover:border-cyan-400 transition-all duration-300 group overflow-hidden ${isHorizontal ? 'flex items-center gap-4' : ''}`}>
                                <ColoredBlob color="cyan" />
                                            <div className={`relative z-10 ${isHorizontal ? 'flex-1' : ''}`}>
                                                <div className="text-cyan-600 text-xs font-bold mb-1 uppercase tracking-wide">{pub.platform}</div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-800 transition-colors">{pub.title}</h3>
                                                <p className="text-sm text-slate-600">{pub.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            );
                        })()}
                    </Section>

                    {/* ENDORSEMENTS SECTION */}
                    <Section id="endorsements" title="Endorsements" chapter="Chapter 08" color="pink" borderColor="border-pink-500">
                        {(() => {
                            const layout = portfolioData.sectionLayouts['endorsements'];
                            const isHorizontal = layout?.card_direction === 'horizontal';
                            return (
                                <div className={`${getLayoutClass(layout?.layout)} ${getGapClass(layout?.gap)}`}>
                                    {(portfolioData.endorsements.length > 0 ? portfolioData.endorsements : [
                                        { id: 1, name: "Dr. David Barzilai", role: "Longevity Medicine", initial: "DB", quote: "Praise for dedication to Precision Health & Longevity.", color: "pink" },
                                        { id: 2, name: "Interaxon Inc.", role: "Muse Neurotech", initial: "M", quote: "Official recognition of the 'brilliant students' using Muse technology.", color: "violet" }
                                    ]).map((item) => {
                                        const CardWrapper = item.link ? 'a' : 'div';
                                        const cardProps = item.link ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                                        return (
                                        <CardWrapper key={item.id} {...cardProps} className={`relative bg-white shadow-lg p-8 rounded-2xl border border-pink-100 hover:shadow-xl hover:-translate-y-1 hover:border-pink-300 transition-all duration-300 group overflow-hidden ${isHorizontal ? 'flex items-start gap-4' : ''} ${item.link ? 'cursor-pointer' : ''}`}>
                                            <ColoredBlob color={item.color} />
                                            <Quote className={`text-pink-200 w-8 h-8 group-hover:text-pink-300 transition-colors duration-300 flex-shrink-0 ${isHorizontal ? '' : 'absolute top-8 right-8'}`} />
                                            <div className="flex-1 relative z-10">
                                                <p className="text-slate-700 italic mb-6 leading-relaxed">"{item.quote}"</p>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-600 text-xs border border-pink-200">{item.initial}</div>
                                                    <div>
                                                        <div className="text-slate-900 font-bold text-sm">{item.name}</div>
                                                        <div className="text-pink-600 text-xs uppercase tracking-wide">{item.role}</div>
                                                    </div>
                                                </div>
                                                {item.link && <div className="mt-4 text-xs text-pink-400 flex items-center gap-1">🔗 Click to open</div>}
                                            </div>
                                        </CardWrapper>
                                    )})}
                        </div>
                            );
                        })()}
                    </Section>

                    {/* NEWSLETTER SECTION */}
                    <Section id="newsletter" title="Newsletter" chapter="Chapter 09" color="indigo" borderColor="border-indigo-500">
                        <NewsletterForm portfolioData={portfolioData} />
                    </Section>

                    <footer className="pt-24 pb-12 text-slate-500 text-xs font-mono border-t border-slate-200 mt-12">&copy; 2026 Joel Amaldas. Built to Innovate.</footer>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
