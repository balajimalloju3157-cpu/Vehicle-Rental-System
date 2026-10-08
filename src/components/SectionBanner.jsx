import React from 'react';
import { Layers, ShieldCheck, Database, Code, CheckCircle } from 'lucide-react';

export default function SectionBanner({ activeSection, setActiveSection }) {
  const sections = [
    { id: 'all', title: 'All Integrated Features' },
    { id: 'sec1', title: 'Sec 1: Nav & Routing' },
    { id: 'sec2', title: 'Sec 2: Vehicles Catalog' },
    { id: 'sec3', title: 'Sec 3: Booking Form' },
    { id: 'sec4', title: 'Sec 4: Supabase DB & History' },
    { id: 'sec5', title: 'Sec 5: Architecture' }
  ];

  return (
    <div className="bg-slate-100 border-b border-slate-200 text-slate-700 py-2 px-4 text-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          <span className="w-2 h-2 rounded-full bg-slate-900"></span>
          <span className="font-semibold text-slate-900">Group Project Evaluation View:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border border-slate-200'
                }`}
              >
                {sec.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
