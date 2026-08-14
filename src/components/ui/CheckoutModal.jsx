'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, CheckCircle, DollarSign, CupSoda, Film } from 'lucide-react';

export function CheckoutModal() {
  const { activeModal, closeModal, activeCustomer, heldSlushie, completeCheckout } = useStore();
  const [includeSlushie, setIncludeSlushie] = useState(!!heldSlushie);

  if (activeModal !== 'checkout' || !activeCustomer) return null;

  const rentalPrice = activeCustomer.price || 4.99;
  const slushiePrice = includeSlushie ? 3.50 : 0;
  const total = rentalPrice + slushiePrice;
  const customerCashGiven = 20.00;
  const changeDue = customerCashGiven - total;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl text-white font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            <div>
              <h2 className="text-lg font-black text-amber-400 font-mono tracking-wider">CHECKOUT REGISTER</h2>
              <p className="text-xs text-gray-400">Processing Customer Rental</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Customer Details */}
        <div className="bg-slate-950 p-4 rounded-xl border border-gray-800 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/40">
            👤
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{activeCustomer.name}</h3>
            <p className="text-xs text-amber-400 font-mono">Preferred Genre: {activeCustomer.preferredGenre}</p>
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="space-y-3 mb-6 bg-black/40 p-4 rounded-xl border border-gray-800 font-mono text-sm">
          <div className="flex justify-between text-gray-300">
            <span className="flex items-center gap-2">
              <Film size={16} className="text-amber-400" /> VHS Rental ("{activeCustomer.tapeTitle}")
            </span>
            <span className="font-bold text-white">${rentalPrice.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-gray-300 pt-2 border-t border-gray-800">
            <span className="flex items-center gap-2">
              <CupSoda size={16} className="text-blue-400" /> Add Ice Slushie Cup
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeSlushie}
                onChange={(e) => setIncludeSlushie(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
              <span className="font-bold text-white">+ $3.50</span>
            </div>
          </div>

          <div className="flex justify-between text-base font-black text-amber-400 pt-3 border-t border-gray-700">
            <span>TOTAL DUE:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Cash Tendered & Change Calculation */}
        <div className="bg-green-950/40 border border-green-500/40 p-4 rounded-xl mb-6 font-mono text-xs space-y-1 text-green-300">
          <p className="flex justify-between">
            <span>Customer Payment Cash:</span>
            <span className="font-bold text-white">${customerCashGiven.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-sm font-bold text-green-400">
            <span>Change Due Back:</span>
            <span>${changeDue.toFixed(2)}</span>
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            completeCheckout(rentalPrice, slushiePrice);
            closeModal();
          }}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 text-sm transition shadow-lg"
        >
          <CheckCircle size={18} />
          <span>COLLECT CASH & COMPLETE RENTAL</span>
        </button>
      </div>
    </div>
  );
}
