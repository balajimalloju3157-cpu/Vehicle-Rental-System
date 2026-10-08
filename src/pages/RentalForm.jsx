import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { VEHICLES_DATA, CITIES } from '../data/vehiclesData';
import { rentalDb } from '../lib/supabase';
import { ShieldCheck, User, Calculator, Plus, Minus, Tag, ArrowRight, AlertCircle } from 'lucide-react';

export default function RentalForm({ currency, formatPrice, onRentalCreated }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const preselectedVehicleId = searchParams.get('vehicle') || VEHICLES_DATA[0].id;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId);
  const [durationDays, setDurationDays] = useState(3);
  const [city, setCity] = useState(CITIES[0]);
  const [pickupDate, setPickupDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  
  const [selectedAddons, setSelectedAddons] = useState({
    insurance: true,
    gps: false,
    childSeat: false,
    helmet: false
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedVehicle = useMemo(() => {
    return VEHICLES_DATA.find((v) => v.id === vehicleId) || VEHICLES_DATA[0];
  }, [vehicleId]);

  const returnDate = useMemo(() => {
    if (!pickupDate) return '';
    const date = new Date(pickupDate);
    date.setDate(date.getDate() + Number(durationDays));
    return date.toISOString().split('T')[0];
  }, [pickupDate, durationDays]);

  const pricing = useMemo(() => {
    const baseRatePerDay = selectedVehicle.ratePerDay;
    const baseCost = baseRatePerDay * durationDays;

    let dailyAddonRate = 0;
    if (selectedAddons.insurance) dailyAddonRate += 300;
    if (selectedAddons.gps) dailyAddonRate += 100;
    if (selectedAddons.childSeat) dailyAddonRate += 150;
    if (selectedAddons.helmet) dailyAddonRate += 50;

    const totalAddonsCost = dailyAddonRate * durationDays;
    const subtotal = baseCost + totalAddonsCost;

    const discountAmount = Math.round((subtotal * appliedDiscountPercent) / 100);
    const taxableAmount = subtotal - discountAmount;
    const gstTax = Math.round(taxableAmount * 0.12);

    const finalTotal = taxableAmount + gstTax;

    return {
      baseRatePerDay,
      baseCost,
      totalAddonsCost,
      subtotal,
      discountAmount,
      gstTax,
      finalTotal
    };
  }, [selectedVehicle, durationDays, selectedAddons, appliedDiscountPercent]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscountPercent(10);
      setCouponMessage('Success: 10% Welcome Discount applied!');
    } else if (code === 'DRIVE20') {
      setAppliedDiscountPercent(20);
      setCouponMessage('Success: 20% Special Discount applied!');
    } else {
      setAppliedDiscountPercent(0);
      setCouponMessage('Error: Invalid coupon code. Try WELCOME10 or DRIVE20');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !licenseId.trim()) {
      setFormError('Please fill in all required customer details.');
      return;
    }

    setIsSubmitting(true);

    try {
      const activeAddonsList = [];
      if (selectedAddons.insurance) activeAddonsList.push('Full Insurance Coverage');
      if (selectedAddons.gps) activeAddonsList.push('GPS Navigator');
      if (selectedAddons.childSeat) activeAddonsList.push('Child Safety Seat');
      if (selectedAddons.helmet) activeAddonsList.push('Extra Helmet');

      const newBooking = {
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        licenseId: licenseId.trim(),
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        vehicleType: selectedVehicle.type,
        ratePerDay: selectedVehicle.ratePerDay,
        durationDays: Number(durationDays),
        city,
        pickupDate,
        returnDate,
        addons: activeAddonsList,
        addonsCost: pricing.totalAddonsCost,
        discountAmount: pricing.discountAmount,
        totalAmount: pricing.finalTotal,
        status: 'Confirmed'
      };

      const createdRecord = await rentalDb.create(newBooking);

      if (onRentalCreated) {
        onRentalCreated({
          type: 'success',
          title: 'Booking Confirmed',
          message: `Reservation ID: ${createdRecord.id} created successfully.`
        });
      }

      navigate('/history');
    } catch (err) {
      console.error('Booking submission error:', err);
      setFormError('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vehicle Reservation</h1>
        <p className="text-slate-500 text-xs mt-1">
          Complete your customer details and configure rental duration
        </p>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Box */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            
            {/* 1. Customer Information */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <span>1. Customer Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aarav@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Driving License ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="DL-142011009876"
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Vehicle Selection */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-700" />
                <span>2. Vehicle & Duration</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  {VEHICLES_DATA.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.type}) — {formatPrice(v.ratePerDay)}/day [{v.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pick-up Location</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Duration (Days)</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setDurationDays(Math.max(1, durationDays - 1))}
                      className="p-1.5 text-slate-600 hover:text-slate-900 bg-white rounded-lg shadow-xs transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-center text-xs font-extrabold text-slate-900">
                      {durationDays} Days
                    </span>
                    <button
                      type="button"
                      onClick={() => setDurationDays(durationDays + 1)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 bg-white rounded-lg shadow-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Pick-up Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Protection Add-ons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Optional Add-ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedAddons.insurance
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">Zero-Dep Insurance</span>
                    <span className={`text-[10px] ${selectedAddons.insurance ? 'text-slate-300' : 'text-slate-500'}`}>+₹300 / day</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAddons.insurance}
                    onChange={(e) => setSelectedAddons({ ...selectedAddons, insurance: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedAddons.gps
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">GPS Live Navigation</span>
                    <span className={`text-[10px] ${selectedAddons.gps ? 'text-slate-300' : 'text-slate-500'}`}>+₹100 / day</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAddons.gps}
                    onChange={(e) => setSelectedAddons({ ...selectedAddons, gps: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedAddons.childSeat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">Child Safety Seat</span>
                    <span className={`text-[10px] ${selectedAddons.childSeat ? 'text-slate-300' : 'text-slate-500'}`}>+₹150 / day</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAddons.childSeat}
                    onChange={(e) => setSelectedAddons({ ...selectedAddons, childSeat: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedAddons.helmet
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}>
                  <div>
                    <span className="text-xs font-bold block">Extra Safety Helmet</span>
                    <span className={`text-[10px] ${selectedAddons.helmet ? 'text-slate-300' : 'text-slate-500'}`}>+₹50 / day</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAddons.helmet}
                    onChange={(e) => setSelectedAddons({ ...selectedAddons, helmet: e.target.checked })}
                    className="w-4 h-4 accent-slate-900 rounded"
                  />
                </label>

              </div>
            </div>

            {/* Coupon Code */}
            <div className="pt-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Coupon code (WELCOME10 or DRIVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 uppercase font-medium focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-[11px] mt-1 font-semibold ${
                  couponMessage.startsWith('Success') ? 'text-emerald-700' : 'text-rose-600'
                }`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{isSubmitting ? 'Creating Reservation...' : 'Confirm Reservation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Summary Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
            
            {/* Vehicle Preview Card */}
            <div className="flex gap-3.5 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {selectedVehicle.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{selectedVehicle.name}</h4>
                <p className="text-[11px] text-slate-500">{selectedVehicle.seats} Seats • {selectedVehicle.transmission}</p>
              </div>
            </div>

            {/* Dynamic Breakdown Table */}
            <div className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Estimated Price Summary</h4>

              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Base Rate ({durationDays} days @ {formatPrice(pricing.baseRatePerDay)})</span>
                <span className="font-bold text-slate-900">{formatPrice(pricing.baseCost)}</span>
              </div>

              {pricing.totalAddonsCost > 0 && (
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Optional Add-ons</span>
                  <span className="font-bold text-slate-900">{formatPrice(pricing.totalAddonsCost)}</span>
                </div>
              )}

              {pricing.discountAmount > 0 && (
                <div className="flex justify-between py-0.5 text-emerald-700 font-semibold">
                  <span>Coupon Discount ({appliedDiscountPercent}%)</span>
                  <span>- {formatPrice(pricing.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between py-0.5">
                <span className="text-slate-500">Taxes (12% GST)</span>
                <span className="font-bold text-slate-900">{formatPrice(pricing.gstTax)}</span>
              </div>

              <div className="flex justify-between py-0.5 text-slate-500">
                <span>Calculated Return Date</span>
                <span className="font-semibold text-slate-900">{returnDate}</span>
              </div>

              {/* Total Price Banner */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block text-[11px]">Grand Total</span>
                  <span className="text-xl font-extrabold text-slate-900">{formatPrice(pricing.finalTotal)}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Calculated Live
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700 flex-shrink-0 mt-0.5" />
              <span>Reservation auto-saves directly to Section 4 rental log dashboard.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
