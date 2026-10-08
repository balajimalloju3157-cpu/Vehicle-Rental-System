import React from 'react';
import { Layers, Code, CheckCircle, ShieldCheck, Database, CheckCircle2, Cpu } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export default function ProjectOverview() {
  const sections = [
    {
      id: 1,
      title: "Section 1: Architecture & Header Navigation",
      icon: Code,
      description: "Sets up React foundation with Vite, React Router DOM v6, header navbar with logo, currency switcher, and mobile drawer.",
      deliverables: [
        "Navbar & Brand Header (`Navbar.jsx`)",
        "React Router DOM routes (`App.jsx`)",
        "INR (₹) / USD ($) Currency toggle",
        "Mobile responsive drawer menu"
      ]
    },
    {
      id: 2,
      title: "Section 2: Hero & Vehicle Cards Catalog",
      icon: CheckCircle,
      description: "Builds landing page hero search widget and reusable vehicle cards (`VehicleCard.jsx`) displaying specs, rates, and booking actions.",
      deliverables: [
        "Hero search banner (`Home.jsx`)",
        "Reusable Vehicle Card component (`VehicleCard.jsx`)",
        "Inventory search, category tabs, and budget slider (`Vehicles.jsx`)",
        "Verified fleet dataset (SUVs, Sedans, Hatchbacks, Luxury & Cruisers)"
      ]
    },
    {
      id: 3,
      title: "Section 3: Booking Form State & Logic",
      icon: ShieldCheck,
      description: "Interactive rental booking form with customer validation, vehicle model selection, duration counter, add-ons, and real-time live price calculation.",
      deliverables: [
        "Customer details form with license validation (`RentalForm.jsx`)",
        "Dynamic duration math (+ / - days) and date calculation",
        "Protection add-ons (Insurance, GPS, Child Seat, Helmet)",
        "Real-Time Rate Estimate card with tax breakdown"
      ]
    },
    {
      id: 4,
      title: "Section 4: Supabase Integration & History Log",
      icon: Database,
      description: "Integrates Supabase database SDK (`supabase.js`) with an automatic LocalStorage sync fallback layer for rental records.",
      deliverables: [
        "Supabase Client SDK & LocalStorage sync (`supabase.js`)",
        "Rental History Log dashboard (`RentalHistory.jsx`)",
        "Printable Invoice Receipt viewer",
        "CSV Data Export & Reset controls"
      ]
    },
    {
      id: 5,
      title: "Section 5: CSS Design System & Project Structure",
      icon: Layers,
      description: "Clean minimalist CSS theme system (`index.css`), responsive layouts, and Section Switcher evaluation toolbar.",
      deliverables: [
        "Minimal Vanilla CSS Design System (`index.css`)",
        "Responsive Breakpoint Grid Layouts",
        "Section Switcher Toolbar (`SectionBanner.jsx`)",
        "Full Group Project documentation"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Project Sections & Architecture</h1>
        <p className="text-slate-500 text-xs max-w-2xl">
          Modular group project divided into 5 core sections.
        </p>
      </div>

      {/* Database Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-slate-900 font-bold text-sm">Database System Status</h4>
            <p className="text-xs text-slate-500">
              {isSupabaseConfigured
                ? "Connected to Live Supabase Cloud Database."
                : "Active on LocalStorage Database Sync Mode."}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
          {isSupabaseConfigured ? 'Live Supabase DB' : 'LocalStorage Sync Active'}
        </span>
      </div>

      {/* Sections Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    Section {sec.id}
                  </span>
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>

                <h3 className="text-base font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{sec.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Key Deliverables:</span>
                <ul className="space-y-1 text-slate-600">
                  {sec.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
