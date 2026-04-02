import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { Search, Download, Upload } from 'lucide-react';

export type EventCategory = 'work' | 'personal' | 'important' | 'other';

export interface CalendarEvent {
  text: string;
  category: EventCategory;
}

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Store events as a map from "YYYY-MM-DD" -> array of CalendarEvent objects
  const [eventsMap, setEventsMap] = useState<Record<string, CalendarEvent[]>>({});

  useEffect(() => {
    const stored = localStorage.getItem('calendar_events_v2') || localStorage.getItem('calendar_events');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Migration logic from string[] to CalendarEvent[]
        const migrated: Record<string, CalendarEvent[]> = {};
        Object.keys(parsed).forEach(date => {
          migrated[date] = parsed[date].map((evt: any) => {
            if (typeof evt === 'string') {
              return { text: evt, category: 'other' };
            }
            return evt;
          });
        });
        
        setEventsMap(migrated);
      } catch (err) {
        console.error("Failed to parse calendar events", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar_events_v2', JSON.stringify(eventsMap));
  }, [eventsMap]);

  const getFormatDate = (d: Date) => {
    const year = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (eventText: string, category: EventCategory) => {
    if (!selectedDate) return;
    const dateStr = getFormatDate(selectedDate);
    
    setEventsMap(prev => {
      const currentEvents = prev[dateStr] || [];
      return {
        ...prev,
        [dateStr]: [...currentEvents, { text: eventText, category }]
      };
    });
  };

  const handleDeleteEvent = (index: number) => {
    if (!selectedDate) return;
    const dateStr = getFormatDate(selectedDate);
    
    setEventsMap(prev => {
      const currentEvents = [...(prev[dateStr] || [])];
      currentEvents.splice(index, 1);
      return {
        ...prev,
        [dateStr]: currentEvents
      };
    });
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(eventsMap));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "calendar_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setEventsMap(json);
        alert("Calendar data imported successfully!");
      } catch (err) {
        alert("Failed to import JSON: Invalid format.");
      }
    };
    reader.readAsText(file);
  };

  const eventsForSelectedDate = selectedDate ? (eventsMap[getFormatDate(selectedDate)] || []) : [];

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div className="search-container glass-panel" style={{ padding: '4px 16px', borderRadius: 'var(--border-radius-sm)' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search events..." 
            style={{ background: 'transparent', border: 'none', outline: 'none', padding: '8px', width: '100%', color: 'var(--text-primary)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="view-toggle">
            <button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button>
            <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button>
          </div>
          
          <button className="glass-button" onClick={handleExport} title="Export Backup">
            <Download size={18} />
          </button>
          
          <label className="glass-button" style={{ cursor: 'pointer' }} title="Import Backup">
            <Upload size={18} />
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <Calendar 
        onSelectDate={handleSelectDate} 
        eventsMap={eventsMap} 
        view={view}
        searchQuery={searchQuery}
      />
      
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        events={eventsForSelectedDate}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </Layout>
  );
}

export default App;
