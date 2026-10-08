import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-900">
                <Car className="w-4 h-4 stroke-[2]" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">DrivePulse</span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-xs">
              A minimalist, enterprise-grade vehicle rental system offering instant booking, dynamic price estimation, and Supabase database integration.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/vehicles" className="hover:text-white transition-colors">Vehicles Catalog</Link></li>
              <li><Link to="/rent" className="hover:text-white transition-colors">Book Vehicle</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Rental Log</Link></li>
              <li><Link to="/overview" className="hover:text-white transition-colors">Project Architecture</Link></li>
            </ul>
          </div>

          {/* Project Sections */}
          <div>
            <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Project Sections</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Section 1: Navbar & Routing</li>
              <li>Section 2: Vehicles Catalog</li>
              <li>Section 3: Booking Form State</li>
              <li>Section 4: Supabase Database</li>
              <li>Section 5: CSS Design System</li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Tech Hub Center, Bandra, Mumbai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 (800) 123-DRIVE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@drivepulse-rentals.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} DrivePulse Vehicle Rental System.</p>
          <p>Designed with a minimal & professional UI system.</p>
        </div>
      </div>
    </footer>
  );
}
