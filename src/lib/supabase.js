import { createClient } from '@supabase/supabase-js';
import { INITIAL_RENTALS } from '../data/sampleRentals';

// ─── Supabase Connection ──────────────────────────────────────────
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL
  || 'https://kiizvbwpqsaxxvodqmcc.supabase.co';

const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_VPHww9SLnqX0NXvyYLva7A_gmGjb-pY';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ─── Local Storage Fallback ───────────────────────────────────────
const STORAGE_KEY = 'drivepulse_rentals_db_v1';

const getLocalRentals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('LocalStorage parse error:', err);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RENTALS));
  return INITIAL_RENTALS;
};

const setLocalRentals = (rentals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
};

// ─── Unified Rental DB API ────────────────────────────────────────
export const rentalDb = {

  // GET ALL — fetch all bookings, prefer Supabase over localStorage
  async getAll() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rentals')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('[Supabase] getAll error, using local fallback:', error.message);
        } else if (data && data.length > 0) {
          // Sync Supabase data into localStorage so UI stays consistent
          setLocalRentals(data);
          return { data, source: 'Supabase Database' };
        } else if (data && data.length === 0) {
          // Table exists but is empty — still return Supabase (don't hide it)
          return { data: [], source: 'Supabase Database (empty)' };
        }
      } catch (err) {
        console.warn('[Supabase] getAll exception, using local fallback:', err.message);
      }
    }
    return { data: getLocalRentals(), source: 'Local Storage (Demo DB)' };
  },

  // CREATE — save a new booking to Supabase + localStorage
  async create(newRental) {
    const rentalWithMeta = {
      ...newRental,
      id: newRental.id || `RENT-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingDate: newRental.bookingDate
        || new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: newRental.status || 'Confirmed',
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('rentals')
          .insert([rentalWithMeta])
          .select()
          .single();

        if (error) {
          console.error('[Supabase] create error:', error.message);
        } else {
          console.log('[Supabase] Booking saved:', data.id);
        }
      } catch (err) {
        console.error('[Supabase] create exception:', err.message);
      }
    }

    // Always keep localStorage in sync for fast UI
    const current = getLocalRentals();
    setLocalRentals([rentalWithMeta, ...current]);

    return rentalWithMeta;
  },

  // UPDATE STATUS — cancel, complete, or re-confirm a booking
  async updateStatus(id, newStatus) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('rentals')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          console.error('[Supabase] updateStatus error:', error.message);
        }
      } catch (err) {
        console.error('[Supabase] updateStatus exception:', err.message);
      }
    }

    const current = getLocalRentals();
    const updated = current.map((r) =>
      r.id === id ? { ...r, status: newStatus } : r
    );
    setLocalRentals(updated);
    return updated;
  },

  // DELETE — remove a booking by ID
  async delete(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('rentals')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('[Supabase] delete error:', error.message);
        }
      } catch (err) {
        console.error('[Supabase] delete exception:', err.message);
      }
    }

    const current = getLocalRentals();
    const updated = current.filter((r) => r.id !== id);
    setLocalRentals(updated);
    return updated;
  },

  // RESET — restore sample data to localStorage only
  async resetDemoData() {
    setLocalRentals(INITIAL_RENTALS);
    return INITIAL_RENTALS;
  },
};
