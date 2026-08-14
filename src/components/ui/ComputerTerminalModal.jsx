'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { X, ShoppingBag, Package, Users, DollarSign, Monitor } from 'lucide-react';

export function ComputerTerminalModal() {
  const { activeModal, closeModal, cash, buyBundle, buyFurniture, dailyStats } = useStore();
  const [activeTab, setActiveTab] = useState('bundles');

  if (activeModal !== 'computer') return null;

  const BUNDLES = [
    {
      id: 'b_action',
      name: 'Action Movie Tape Bundle (4 Tapes)',
      price: 45.00,
      genre: 'Action',
      items: [
        { id: `t_${Date.now()}_1`, title: 'Terminator 2', genre: 'Action', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_2`, title: 'Die Hard', genre: 'Action', rentalPrice: 3.99, posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_3`, title: 'Mad Max 2', genre: 'Action', rentalPrice: 4.49, posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_4`, title: 'Predator', genre: 'Action', rentalPrice: 3.99, posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
      ]
    },
    {
      id: 'b_scifi',
      name: 'Sci-Fi Classic Tape Bundle (4 Tapes)',
      price: 55.00,
      genre: 'Sci-Fi',
      items: [
        { id: `t_${Date.now()}_5`, title: 'Blade Runner 2049', genre: 'Sci-Fi', rentalPrice: 5.99, posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_6`, title: 'Back to the Future', genre: 'Sci-Fi', rentalPrice: 4.49, posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_7`, title: 'Alien', genre: 'Sci-Fi', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_8`, title: 'TRON Legacy', genre: 'Sci-Fi', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
      ]
    },
    {
      id: 'b_horror',
      name: 'Horror Thriller Bundle (4 Tapes)',
      price: 50.00,
      genre: 'Horror',
      items: [
        { id: `t_${Date.now()}_9`, title: 'The Thing', genre: 'Horror', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_10`, title: 'The Shining', genre: 'Horror', rentalPrice: 4.49, posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_11`, title: 'Halloween', genre: 'Horror', rentalPrice: 3.99, posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
        { id: `t_${Date.now()}_12`, title: 'Scream', genre: 'Horror', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', rewound: true, scanned: true },
      ]
    }
  ];

  const FURNITURE = [
    { id: 'f_shelf', name: 'Double-Sided Wood Shelf Unit', price: 75.00, type: 'shelf', genre: 'NEW RELEASES' },
    { id: 'f_standee', name: 'Framed "NOW SHOWING" Poster Stand', price: 40.00, type: 'standee' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* 1990s CRT Monitor Outer Casing */}
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-slate-700 rounded-3xl p-6 shadow-2xl text-emerald-400 font-mono">
        {/* CRT Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-emerald-500/40 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="text-emerald-400 animate-pulse" size={24} />
            <div>
              <h2 className="text-lg font-black tracking-widest uppercase">RETRO-OS 1995 • STORE TERMINAL</h2>
              <p className="text-xs text-emerald-500 font-bold">CONNECTED TO BLOCKBUSTER WHOLESALE NET</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-bold bg-emerald-950 px-3 py-1 border border-emerald-500/50 rounded">
              CASH: ${cash.toFixed(2)}
            </span>
            <button onClick={closeModal} className="p-1.5 bg-red-900/60 hover:bg-red-800 text-white rounded-lg">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-emerald-500/30 pb-2">
          {[
            { id: 'bundles', label: '📼 Movie Bundles', icon: Package },
            { id: 'furniture', label: '🏬 Store Furnishings', icon: ShoppingBag },
            { id: 'financials', label: '📊 Daily Financials', icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px] max-h-[400px] overflow-y-auto pr-2 space-y-4">
          {activeTab === 'bundles' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BUNDLES.map((bundle) => (
                <div key={bundle.id} className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-300 mb-1">{bundle.name}</h3>
                    <p className="text-xs text-emerald-500 mb-3">Genre: {bundle.genre} Wholesale</p>
                    <ul className="text-[11px] text-gray-400 space-y-1 mb-4">
                      {bundle.items.map((it, idx) => (
                        <li key={idx}>• {it.title} (${it.rentalPrice}/day rental)</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => buyBundle(bundle)}
                    disabled={cash < bundle.price}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${
                      cash >= bundle.price
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>BUY BUNDLE FOR ${bundle.price.toFixed(2)}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'furniture' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FURNITURE.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-emerald-500/40 p-4 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-300 mb-1">{item.name}</h3>
                    <p className="text-xs text-emerald-500 mb-4">Price: ${item.price.toFixed(2)}</p>
                  </div>

                  <button
                    onClick={() => buyFurniture(item)}
                    disabled={cash < item.price}
                    className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${
                      cash >= item.price
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span>BUY & PLACE IN STORE (${item.price.toFixed(2)})</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="bg-slate-950 border border-emerald-500/40 p-6 rounded-xl space-y-4">
              <h3 className="text-base font-bold text-emerald-300">DAILY STORE REVENUE REPORT</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                  <p className="text-xs text-emerald-500 font-bold">TOTAL RENTALS</p>
                  <p className="text-2xl font-black text-white mt-1">{dailyStats.rentalsCount}</p>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                  <p className="text-xs text-emerald-500 font-bold">GROSS REVENUE</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">${dailyStats.revenue.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30">
                  <p className="text-xs text-emerald-500 font-bold">SLUSHIES SOLD</p>
                  <p className="text-2xl font-black text-blue-400 mt-1">{dailyStats.slushiesSold}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
