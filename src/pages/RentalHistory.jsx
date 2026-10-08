import React, { useState, useEffect, useMemo } from 'react';
import { rentalDb, isSupabaseConfigured } from '../lib/supabase';
import { Database, Search, Download, RefreshCw, CheckCircle2, XCircle, Trash2, Eye, Printer, X } from 'lucide-react';

export default function RentalHistory({ currency, formatPrice, onNotification }) {
  const [rentals, setRentals] = useState([]);
  const [dbSource, setDbSource] = useState('Loading...');
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchRentals = async () => {
    setIsLoading(true);
    try {
      const res = await rentalDb.getAll();
      setRentals(res.data);
      setDbSource(res.source);
    } catch (err) {
      console.error('Fetch rentals error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const filteredRentals = useMemo(() => {
    return rentals.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = item.customerName.toLowerCase().includes(term);
        const matchesVehicle = item.vehicleName.toLowerCase().includes(term);
        const matchesId = item.id.toLowerCase().includes(term);
        const matchesCity = item.city.toLowerCase().includes(term);
        if (!matchesName && !matchesVehicle && !matchesId && !matchesCity) return false;
      }
      return true;
    });
  }, [rentals, statusFilter, searchTerm]);

  const metrics = useMemo(() => {
    const totalCount = rentals.length;
    const confirmedCount = rentals.filter((r) => r.status === 'Confirmed').length;
    const completedCount = rentals.filter((r) => r.status === 'Completed').length;
    const totalRevenue = rentals
      .filter((r) => r.status !== 'Cancelled')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    return { totalCount, confirmedCount, completedCount, totalRevenue };
  }, [rentals]);

  const handleUpdateStatus = async (id, newStatus) => {
    const updated = await rentalDb.updateStatus(id, newStatus);
    setRentals(updated);
    if (onNotification) {
      onNotification({
        type: 'info',
        title: 'Status Updated',
        message: `Reservation ${id} set to ${newStatus}.`
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Delete reservation record ${id}?`)) {
      const updated = await rentalDb.delete(id);
      setRentals(updated);
      if (onNotification) {
        onNotification({
          type: 'error',
          title: 'Record Removed',
          message: `Reservation ${id} deleted.`
        });
      }
    }
  };

  const handleResetDemoData = async () => {
    if (window.confirm('Reset database to initial sample dataset?')) {
      const res = await rentalDb.resetDemoData();
      setRentals(res);
      if (onNotification) {
        onNotification({
          type: 'success',
          title: 'Database Reset',
          message: 'Sample records restored.'
        });
      }
    }
  };

  const handleExportCSV = () => {
    if (rentals.length === 0) return;
    const headers = ['Booking ID', 'Customer Name', 'Email', 'Phone', 'Vehicle', 'City', 'Days', 'Total Amount', 'Status', 'Booking Date'];
    const rows = rentals.map((r) => [
      r.id,
      `"${r.customerName}"`,
      r.customerEmail,
      r.customerPhone,
      `"${r.vehicleName}"`,
      r.city,
      r.durationDays,
      r.totalAmount,
      r.status,
      r.bookingDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rental_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Rental History Dashboard</h1>
          <p className="text-slate-500 text-xs mt-1">
            Database records for customer reservations and status management
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            Storage: {dbSource}
          </span>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all border border-slate-200 flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleResetDemoData}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-all border border-slate-200 flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Total Bookings</span>
          <span className="text-2xl font-extrabold text-slate-900">{metrics.totalCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Active Confirmed</span>
          <span className="text-2xl font-extrabold text-emerald-700">{metrics.confirmedCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Completed</span>
          <span className="text-2xl font-extrabold text-slate-900">{metrics.completedCount}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-medium block">Total Revenue</span>
          <span className="text-2xl font-extrabold text-slate-900">{formatPrice(metrics.totalRevenue)}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search customer, ID, or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['All', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Rentals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <RefreshCw className="w-6 h-6 text-slate-700 animate-spin mx-auto mb-2" />
            <span>Loading records...</span>
          </div>
        ) : filteredRentals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Booking ID</th>
                  <th className="py-3.5 px-4 font-bold">Customer Name</th>
                  <th className="py-3.5 px-4 font-bold">Vehicle</th>
                  <th className="py-3.5 px-4 font-bold">Location & Dates</th>
                  <th className="py-3.5 px-4 font-bold">Duration</th>
                  <th className="py-3.5 px-4 font-bold">Total</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredRentals.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block text-xs">{item.customerName}</span>
                      <span className="text-slate-500 text-[11px]">{item.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{item.vehicleName}</span>
                      <span className="text-slate-500 text-[11px]">{item.vehicleType}</span>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <span className="font-semibold text-slate-900 block">{item.city}</span>
                      <span className="text-[11px] text-slate-500">{item.pickupDate} → {item.returnDate}</span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.durationDays} Days
                    </td>

                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatPrice(item.totalAmount)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold inline-flex items-center border ${
                        item.status === 'Confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.status === 'Completed'
                          ? 'bg-slate-100 text-slate-800 border-slate-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => setSelectedInvoice(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title="View Invoice"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {item.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Completed')}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {item.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'Cancelled')}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                          title="Cancel"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 space-y-2">
            <Database className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Rental Records Found</h3>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-6 text-slate-800 shadow-xl relative animate-scale-up">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">DrivePulse Invoice</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedInvoice.id}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                {selectedInvoice.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500 block font-medium text-[11px]">Customer:</span>
                <p className="font-bold text-slate-900">{selectedInvoice.customerName}</p>
                <p className="text-slate-600">{selectedInvoice.customerEmail}</p>
                <p className="text-slate-600">{selectedInvoice.customerPhone}</p>
                <p className="text-slate-400 text-[10px]">License: {selectedInvoice.licenseId}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                <span className="text-slate-500 block font-medium text-[11px]">Vehicle:</span>
                <p className="font-bold text-slate-900">{selectedInvoice.vehicleName}</p>
                <p className="text-slate-600">Category: {selectedInvoice.vehicleType}</p>
                <p className="text-slate-600">Location: {selectedInvoice.city}</p>
                <p className="text-slate-400 text-[10px]">Date: {selectedInvoice.bookingDate}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs border-t border-b border-slate-100 py-3">
              <div className="flex justify-between py-0.5">
                <span>Base ({selectedInvoice.durationDays} days @ {formatPrice(selectedInvoice.ratePerDay)})</span>
                <span className="font-semibold text-slate-900">{formatPrice(selectedInvoice.ratePerDay * selectedInvoice.durationDays)}</span>
              </div>
              {selectedInvoice.addonsCost > 0 && (
                <div className="flex justify-between py-0.5">
                  <span>Add-ons</span>
                  <span className="font-semibold text-slate-900">{formatPrice(selectedInvoice.addonsCost)}</span>
                </div>
              )}
              {selectedInvoice.discountAmount > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatPrice(selectedInvoice.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span>{formatPrice(selectedInvoice.totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
