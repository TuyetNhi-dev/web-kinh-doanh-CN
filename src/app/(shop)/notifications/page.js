"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function NotificationsPage() {
  const { notifications, markAllAsRead, markAsRead } = useNotificationStore();
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filteredNotifications = activeTab === "Tất cả" 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  const markAllRead = () => {
    markAllAsRead();
  };

  const toggleRead = (id) => {
    markAsRead(id);
  };

  return (
    <div className="container" style={{ padding: '40px 20px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Trung tâm Thông báo</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Quản lý tất cả cập nhật và ưu đãi dành riêng cho bạn</p>
          </div>
          <button 
            onClick={markAllRead}
            className="btn btn-outline"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            Đánh dấu đã đọc tất cả
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
          {["Tất cả", "Ưu đãi", "Đơn hàng", "Hệ thống"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                fontWeight: activeTab === tab ? '700' : '500',
                color: activeTab === tab ? 'var(--brand-orange)' : 'var(--text-secondary)',
                cursor: 'pointer',
                position: 'relative',
                padding: '5px 10px'
              }}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  style={{ position: 'absolute', bottom: '-16px', left: 0, right: 0, height: '3px', background: 'var(--brand-orange)', borderRadius: '3px' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="glass" style={{ overflow: 'hidden' }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((note) => (
              <div 
                key={note.id}
                onClick={() => toggleRead(note.id)}
                style={{
                  padding: '25px',
                  borderBottom: '1px solid #f5f5f5',
                  display: 'flex',
                  gap: '20px',
                  background: note.isRead ? 'transparent' : 'rgba(245, 114, 36, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                className="notification-row"
              >
                {!note.isRead && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--brand-orange)' }} />
                )}
                
                <div style={{
                  minWidth: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: `${note.color}15`,
                  color: note.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  border: `1px solid ${note.color}30`
                }}>
                  <i className={note.icon}></i>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: note.color, opacity: 0.8 }}>
                      {note.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#999' }}>{note.time}</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: note.isRead ? '600' : '750', marginBottom: '8px', color: '#111' }}>{note.title}</h3>
                  <p style={{ color: '#555', lineHeight: '1.5', fontSize: '0.95rem' }}>{note.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '80px 20px', textAlign: 'center', color: '#888' }}>
              <i className="fa-solid fa-bell-slash" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}></i>
              <p>Không có thông báo nào trong mục này</p>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        .notification-row:hover {
          background: #f9f9f9 !important;
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
