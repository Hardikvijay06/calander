import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Search } from 'lucide-react';
import { type CalendarEvent, type EventCategory } from '../App';

interface CalendarProps {
  onSelectDate: (date: Date) => void;
  eventsMap: Record<string, CalendarEvent[]>;
  view: 'month' | 'week';
  searchQuery: string;
}

export function Calendar({ onSelectDate, eventsMap, view, searchQuery }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    }
  };

  const next = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    }
  };

  const getFormatDate = (d: Date) => {
    const year = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch(cat) {
      case 'work': return 'var(--cat-work)';
      case 'personal': return 'var(--cat-personal)';
      case 'important': return 'var(--cat-important)';
      default: return 'var(--cat-other)';
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const todayStr = getFormatDate(today);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper to check if a date string matches search
  const matchesSearch = (dateStr: string) => {
    if (!searchQuery.trim()) return false;
    const items = eventsMap[dateStr] || [];
    return items.some(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  const renderMonthView = () => {
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, auto)', gap: '12px' }}>
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} style={{ opacity: 0.2, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--border-radius-sm)' }} />
        ))}
        {Array.from({ length: numDays }).map((_, i) => {
          const d = i + 1;
          const targetDate = new Date(year, month, d);
          const targetDateStr = getFormatDate(targetDate);
          const isToday = targetDateStr === todayStr;
          const items = eventsMap[targetDateStr] || [];
          const isHighlighted = matchesSearch(targetDateStr);

          return (
            <DayCell 
              key={d}
              date={targetDate}
              isToday={isToday}
              isHighlighted={isHighlighted}
              items={items}
              onSelect={() => onSelectDate(targetDate)}
              getCategoryColor={getCategoryColor}
            />
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    // Get the start of the week for currentDate
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '16px' }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const targetDate = new Date(startOfWeek);
          targetDate.setDate(startOfWeek.getDate() + i);
          const targetDateStr = getFormatDate(targetDate);
          const isToday = targetDateStr === todayStr;
          const items = eventsMap[targetDateStr] || [];
          const isHighlighted = matchesSearch(targetDateStr);

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', paddingBottom: '8px' }}>
                {dayNames[i]} {targetDate.getDate()}
              </div>
              <DayCell 
                date={targetDate}
                isToday={isToday}
                isHighlighted={isHighlighted}
                items={items}
                onSelect={() => onSelectDate(targetDate)}
                getCategoryColor={getCategoryColor}
                fixedHeight="400px"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '12px' }}>
            {view === 'month' ? (
              <><CalendarIcon color="var(--accent-color)" size={28} /> {monthNames[month]} {year}</>
            ) : (
                <>Week of {currentDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</>
            )}
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="glass-button" onClick={prev}><ChevronLeft size={20} /></button>
          <button className="glass-button" onClick={() => setCurrentDate(new Date())}>Today</button>
          <button className="glass-button" onClick={next}><ChevronRight size={20} /></button>
        </div>
      </div>

      {view === 'month' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)', opacity: 0.8, fontSize: '0.9rem' }}>
          {dayNames.map(day => <div key={day}>{day}</div>)}
        </div>
      )}

      {view === 'month' ? renderMonthView() : renderWeekView()}
    </div>
  );
}

interface DayCellProps {
  date: Date;
  isToday: boolean;
  isHighlighted: boolean;
  items: CalendarEvent[];
  onSelect: () => void;
  getCategoryColor: (cat: EventCategory) => string;
  fixedHeight?: string;
}

function DayCell({ date, isToday, isHighlighted, items, onSelect, getCategoryColor, fixedHeight }: DayCellProps) {
  return (
    <div 
      onClick={onSelect}
      style={{
        background: isToday ? 'var(--accent-color)' : (isHighlighted ? 'rgba(255, 255, 0, 0.1)' : 'var(--glass-bg)'),
        color: isToday ? 'white' : 'inherit',
        border: isHighlighted ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)',
        borderRadius: 'var(--border-radius-md)',
        padding: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: fixedHeight || '120px',
        height: fixedHeight || 'auto',
        position: 'relative',
        boxShadow: isHighlighted ? '0 0 15px rgba(102, 126, 234, 0.3)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isToday) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.06)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isToday) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isHighlighted ? '0 0 15px rgba(102, 126, 234, 0.3)' : 'none';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
          {date.getDate()}
        </span>
        {isHighlighted && <Search size={14} color={isToday ? 'white' : 'var(--accent-color)'} />}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
        {items.map((evt, idx) => (
          <div key={idx} style={{ 
            fontSize: '0.75rem', 
            background: isToday ? 'rgba(255,255,255,0.25)' : 'white', 
            color: isToday ? 'white' : 'var(--text-primary)',
            padding: '4px 8px', 
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            borderLeft: `3px solid ${getCategoryColor(evt.category)}`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}>
            {evt.text}
          </div>
        ))}
      </div>
    </div>
  );
}
