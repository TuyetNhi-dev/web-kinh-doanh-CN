"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '50px',
            right: '-140px', // Shift panel significantly right relative to the bell
            width: '380px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(15px)',
            borderRadius: '16px',
            boxShadow: '0 15px 50px rgba(0,0,0,0.2)',
            border: '1px solid rgba(0,0,0,0.08)',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '15px 20px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--brand-orange)',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Thông báo ({unreadCount})</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }} 
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '0.75rem', cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}
            >
              Đọc tất cả
            </button>
          </div>

          {/* List */}
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {notifications.map((note) => (
              <div 
                key={note.id} 
                className="notify-item"
                onClick={() => {
                  markAsRead(note.id);
                }}
                style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #f8f8f8',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  position: 'relative',
                  background: note.isRead ? 'transparent' : 'rgba(245, 114, 36, 0.03)'
                }}
              >
                {!note.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '8px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--brand-orange)',
                    boxShadow: '0 0 5px var(--brand-orange)'
                  }}></div>
                )}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    minWidth: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: note.type === 'promo' ? '#fff0e7' : '#f0f2f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: note.type === 'promo' ? 'var(--brand-orange)' : '#1c1e21',
                    fontSize: '1.1rem'
                  }}>
                    <i className={
                      note.type === 'welcome' ? 'fa-solid fa-hand-sparkles' : 
                      note.type === 'promo' ? 'fa-solid fa-fire-flame-curved' : 
                      'fa-solid fa-truck-fast'
                    }></i>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: note.isRead ? '600' : '700', margin: '0 0 4px 0', color: '#1c1e21' }}>{note.title}</h4>
                    <p style={{ fontSize: '0.82rem', color: '#65676b', margin: '0 0 8px 0', lineHeight: '1.4' }}>{note.content}</p>
                    <span style={{ fontSize: '0.72rem', color: '#8a8d91', fontWeight: '500' }}>
                      <i className="fa-regular fa-clock" style={{marginRight: '4px'}}></i>
                      {note.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <Link href="/notifications" style={{
            display: 'block',
            padding: '14px',
            textAlign: 'center',
            fontSize: '0.88rem',
            fontWeight: '700',
            color: 'var(--brand-orange)',
            background: '#fff',
            borderTop: '1px solid #f0f0f0',
            transition: 'all 0.2s'
          }} className="view-all-btn">
            Xem tất cả thông báo
          </Link>

          <style jsx>{`
            .notify-item:hover {
              background: #f9f9f9;
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
