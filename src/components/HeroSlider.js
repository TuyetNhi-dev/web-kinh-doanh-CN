"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        const data = await res.json();
        if (data.length > 0) {
          setSlides(data);
        }
      } catch (e) {
        console.error('Lỗi tải banner:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      moveSlide(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, slides]);

  const moveSlide = (newDirection) => {
    if (slides.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + slides.length) % slides.length);
  };

  if (loading) return <div style={{ height: '430px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>Đang tải banner...</div>;
  if (slides.length === 0) return null;

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="hero-slider-container" style={{ height: '100%', minHeight: '430px', position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.5}
          onDragEnd={(e, { offset, velocity }) => {
            if (offset.x < -50 || velocity.x < -500) {
              moveSlide(1);
            } else if (offset.x > 50 || velocity.x > 500) {
              moveSlide(-1);
            }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: `url(${slides[currentIndex].image_url}) center/cover no-repeat`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '50px',
            color: '#fff'
          }}
        >
          {/* Lớp phủ gradient để nổi bật chữ */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 100%)', zIndex: 1 }}></div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '500px' }}>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '15px', color: '#fff' }}
            >
              {slides[currentIndex].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '1.2rem', marginBottom: '30px', color: 'rgba(255,255,255,0.9)' }}
            >
              {slides[currentIndex].subtitle}
            </motion.p>
            <Link href={slides[currentIndex].link || '/products'}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                style={{ background: 'var(--brand-orange)', color: '#fff', border: 'none', borderRadius: '30px', padding: '12px 35px', fontWeight: 'bold' }}
              >
                Khám Phá Ngay
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={() => moveSlide(-1)}
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button 
            onClick={() => moveSlide(1)}
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </>
      )}

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', gap: '10px' }}>
        {slides.map((_, index) => (
          <div 
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            style={{ 
              width: '10px', height: '10px', borderRadius: '50%', 
              background: index === currentIndex ? 'var(--brand-orange)' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer', transition: 'all 0.3s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
