import { useState } from 'react';
import { X, Trash2, Tag } from 'lucide-react';
import { type EventCategory, type CalendarEvent } from '../App';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: CalendarEvent[];
  onAddEvent: (eventText: string, category: EventCategory) => void;
  onDeleteEvent: (index: number) => void;
}

export function EventModal({ isOpen, onClose, date, events, onAddEvent, onDeleteEvent }: EventModalProps) {
  const [newEvent, setNewEvent] = useState('');
  const [category, setCategory] = useState<EventCategory>('other');

  if (!isOpen || !date) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.trim()) {
      onAddEvent(newEvent.trim(), category);
      setNewEvent('');
    }
  };

  const getCategoryColor = (cat: EventCategory) => {
    switch(cat) {
      case 'work': return 'var(--cat-work)';
      case 'personal': return 'var(--cat-personal)';
      case 'important': return 'var(--cat-important)';
      default: return 'var(--cat-other)';
    }
  };

  const formattedDate = date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      opacity: isOpen ? 1 : 0,
      animation: 'fadeIn 0.2s ease-out forwards'
    }}>
      <div className="glass-panel" style={{
        width: '95%',
        maxWidth: '500px',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={24} />
        </button>

        <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', color: 'var(--accent-color)' }}>
          Events for
        </h3>
        <p style={{ marginBottom: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {formattedDate}
        </p>

        <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '24px', paddingRight: '4px' }}>
          {events.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
              No events scheduled for this day
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {events.map((evt, idx) => (
                <li key={idx} style={{ 
                  background: 'white', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  borderLeft: `5px solid ${getCategoryColor(evt.category)}`
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>{evt.text}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {evt.category}
                    </span>
                  </div>
                  <button 
                    onClick={() => onDeleteEvent(idx)}
                    className="glass-button"
                    style={{ padding: '8px', minWidth: 'auto', border: 'none', color: 'var(--danger-color)', background: 'transparent' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="What's happening?" 
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              autoFocus
            />
            <button type="submit" className="glass-button primary">
              Add Event
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={14} /> Category:
            </span>
            {(['work', 'personal', 'important', 'other'] as EventCategory[]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: category === cat ? getCategoryColor(cat) : 'white',
                  color: category === cat ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
