import { createClient } from '@supabase/supabase-js';
import { INITIAL_RENTALS } from '../data/sampleRentals';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const STORAGE_KEY = 'drivepulse_rentals_db_v1';

// Helper to initialize LocalStorage database
const getLocalRentals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('LocalStorage parse error:', err);
  }
  // Default seed data
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RENTALS));
  return INITIAL_RENTALS;
};

const setLocalRentals = (rentals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
};

// Unified DB API for Section 4
export const rentalDb = {
  // Fetch all rentals
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rentals')
          .select('*')
          .order('bookingDate', { ascending: false });

        if (!error && data && data.length > 0) {
          return { data, source: 'Supabase Database' };
        }
      } catch (err) {
        console.warn('Supabase fetch fallback to local:', err);
      }
    }
    return { data: getLocalRentals(), source: 'Local Storage (Demo DB)' };
  },

  // Save new rental
  async create(newRental) {
    const rentalWithMeta = {
      ...newRental,
      id: newRental.id || `RENT-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingDate: newRental.bookingDate || new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: newRental.status || 'Confirmed'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('rentals').insert([rentalWithMeta]);
        if (!error) {
          console.log('Saved to Supabase successfully');
        }
      } catch (err) {
        console.error('Supabase save error:', err);
      }
    }

    // Always update local state for fast UI reactivity
    const current = getLocalRentals();
    const updated = [rentalWithMeta, ...current];
    setLocalRentals(updated);

    return rentalWithMeta;
  },

  // Update status (e.g. Cancelled)
  async updateStatus(id, newStatus) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rentals').update({ status: newStatus }).eq('id', id);
      } catch (err) {
        console.error('Supabase update status error:', err);
      }
    }
    const current = getLocalRentals();
    const updated = current.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setLocalRentals(updated);
    return updated;
  },

  // Delete rental record
  async delete(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rentals').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }
    const current = getLocalRentals();
    const updated = current.filter(r => r.id !== id);
    setLocalRentals(updated);
    return updated;
  },

  // Reset to initial demo data
  async resetDemoData() {
    setLocalRentals(INITIAL_RENTALS);
    return INITIAL_RENTALS;
  }
};
