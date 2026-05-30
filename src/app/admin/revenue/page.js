"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function fmt(n) {
  return parseFloat(n || 0).toLocaleString('vi-VN');
}

export default function RevenuePage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/revenue?year=${year}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [year]);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Đang tải...</div>;
  if (!data || data.error) return <div style={{ padding: 40, color: 'red' }}>Lỗi tải dữ liệu</div>;

  const { summary, monthly, topProducts, byCategory, years } = data;

  const maxRevenue = Math.max(...monthly.map(m => m.revenue), 1);
  const maxCatRevenue = Math.max(...byCategory.map(c => c.revenue), 1);

  const summaryCards = [
    { label: 'Tổng doanh thu', value: fmt(summary.total_revenue) + ' đ', icon: 'fa-solid fa-money-bill-trend-up', color: '#10b981', bg: '#d1fae5' },
    { label: 'Tháng này', value: fmt(summary.this_month) + ' đ', icon: 'fa-solid fa-calendar-day', color: '#f59e0b', bg: '#fef3c7' },
    { label: 'Đơn hoàn thành', value: summary.completed_orders, icon: 'fa-solid fa-circle-check', color: '#6366f1', bg: '#e0e7ff' },
    { label: 'Giá trị TB/đơn', value: fmt(summary.avg_order_value) + ' đ', icon: 'fa-solid fa-chart-simple', color: '#f57224', bg: '#ffedd5' },
  ];

  return (
    <div style={{ padding: '0 0 40px' }}>

      {/* Header + chọn năm */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Thống kê doanh thu</h2>
          <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', margin: 0 }}>Chỉ tính đơn hàng đã hoàn thành</p>
        </div>
        <select
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--admin-border)', fontSize: '0.9rem', cursor: 'pointer', background: '#fff' }}
        >
          {(years.length ? years : [year]).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {summaryCards.map((card, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid var(--admin-border)' }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={card.icon} style={{ color: card.color, fontSize: '1.1rem' }}></i>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trạng thái đơn hàng */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
        {[
          { label: 'Đang chờ', value: summary.pending_orders, color: '#f59e0b' },
          { label: 'Hoàn thành', value: summary.completed_orders, color: '#10b981' },
          { label: 'Đã huỷ', value: summary.cancelled_orders, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '14px 18px', border: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>{s.label}</span>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 24, border: '1px solid var(--admin-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>
          <i className="fa-solid fa-chart-bar" style={{ marginRight: 8, color: '#f57224' }}></i>
          Doanh thu theo tháng — {year}
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180 }}>
          {monthly.map(m => {
            const pct = (m.revenue / maxRevenue) * 100;
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {m.revenue > 0 ? (m.revenue >= 1_000_000 ? (m.revenue / 1_000_000).toFixed(0) + 'M' : fmt(m.revenue)) : ''}
                </span>
                <div
                  title={`${MONTHS[m.month - 1]}: ${fmt(m.revenue)} đ (${m.order_count} đơn)`}
                  style={{
                    width: '100%',
                    height: pct > 0 ? `${pct}%` : 4,
                    background: pct > 0 ? 'linear-gradient(180deg, #f57224, #e55a00)' : '#f3f4f6',
                    borderRadius: '6px 6px 0 0',
                    minHeight: 4,
                    transition: 'height 0.3s',
                    cursor: 'default',
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', fontWeight: 600 }}>{MONTHS[m.month - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Top sản phẩm bán chạy */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--admin-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
            <i className="fa-solid fa-fire" style={{ marginRight: 8, color: '#ef4444' }}></i>
            Top 5 sản phẩm bán chạy
          </h3>
          {topProducts.length === 0 && <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Chưa có dữ liệu</p>}
          {topProducts.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--admin-border)' : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#b45309' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, color: i < 3 ? '#fff' : '#6b7280' }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>Đã bán: {p.total_sold} | {fmt(p.total_revenue)} đ</p>
              </div>
            </div>
          ))}
        </div>

        {/* Doanh thu theo danh mục */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, border: '1px solid var(--admin-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
            <i className="fa-solid fa-layer-group" style={{ marginRight: 8, color: '#6366f1' }}></i>
            Doanh thu theo danh mục
          </h3>
          {byCategory.length === 0 && <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>Chưa có dữ liệu</p>}
          {byCategory.map((c, i) => {
            const pct = Math.round((c.revenue / maxCatRevenue) * 100);
            const colors = ['#f57224','#6366f1','#10b981','#f59e0b','#ef4444'];
            return (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>{fmt(c.revenue)} đ</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: colors[i % colors.length], borderRadius: 99, transition: 'width 0.4s' }} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
