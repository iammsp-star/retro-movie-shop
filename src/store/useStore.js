'use client';

import { create } from 'zustand';

// Initial Movie Catalog Fallback
const DEFAULT_CATALOG = [
  { id: 'tape_t2', title: 'Terminator 2', genre: 'Action', rentalPrice: 4.99, wholesaleCost: 15.00, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', rewound: true },
  { id: 'tape_dh', title: 'Die Hard', genre: 'Action', rentalPrice: 3.99, wholesaleCost: 12.00, posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80', rewound: true },
  { id: 'tape_br2049', title: 'Blade Runner 2049', genre: 'Sci-Fi', rentalPrice: 5.99, wholesaleCost: 18.00, posterUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80', rewound: true },
  { id: 'tape_bttf', title: 'Back to the Future', genre: 'Sci-Fi', rentalPrice: 4.49, wholesaleCost: 14.00, posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80', rewound: true },
  { id: 'tape_gb', title: 'Ghostbusters', genre: 'Comedy', rentalPrice: 3.99, wholesaleCost: 10.00, posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80', rewound: true },
  { id: 'tape_thing', title: 'The Thing', genre: 'Horror', rentalPrice: 4.99, wholesaleCost: 16.00, posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&auto=format&fit=crop&q=80', rewound: true },
];

export const useStore = create((set, get) => ({
  // Core Economy & Progress
  cash: 250.00,
  popularity: 85,
  day: 1,
  timeOfDay: '09:00 AM',
  isStoreOpen: false,

  // UI Modal State
  activeModal: null, // null | 'computer' | 'checkout' | 'slushie' | 'stock'
  targetedObject: null, // text for crosshair prompt
  hudMessage: 'Walk to the front door and flip sign to OPEN!',

  // Store Inventory & Furnishings
  warehouseStock: [...DEFAULT_CATALOG],
  shelves: [
    {
      id: 'shelf_1',
      genre: 'ACTION & SCI-FI',
      position: [-4, 0, -2],
      rotation: [0, 0, 0],
      slots: [
        DEFAULT_CATALOG[0], DEFAULT_CATALOG[1], DEFAULT_CATALOG[2],
        DEFAULT_CATALOG[3], null, null
      ]
    },
    {
      id: 'shelf_2',
      genre: 'COMEDY & HORROR',
      position: [4, 0, -2],
      rotation: [0, 0, 0],
      slots: [
        DEFAULT_CATALOG[4], DEFAULT_CATALOG[5], null,
        null, null, null
      ]
    }
  ],

  // Tape Return Drop Rack (returned tapes needing rewind & scan)
  dropRack: [
    { id: 'drop_1', title: 'The Matrix', genre: 'Action', rentalPrice: 4.99, posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', rewound: false, scanned: false },
    { id: 'drop_2', title: 'Evil Dead II', genre: 'Horror', rentalPrice: 3.99, posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80', rewound: false, scanned: false }
  ],

  // Player Hands & Placement State
  heldTape: null, // Tape object currently carried
  heldSlushie: null, // 'Cherry' | 'Blue Raspberry' | null
  placementMode: null, // null | { type: 'double_shelf', cost: 75.00 }
  placementGhostPos: [0, 0, 0],

  // Customer Register & Queue
  activeCustomer: null, // Customer at counter register
  customerQueue: [], // Customers waiting in store
  dailyStats: {
    rentalsCount: 0,
    revenue: 0,
    slushiesSold: 0,
  },

  // ==========================================
  // ACTIONS
  // ==========================================

  setTargetedObject: (objName) => set({ targetedObject: objName }),
  setHudMessage: (msg) => set({ hudMessage: msg }),

  toggleStoreOpen: () => set((state) => {
    const nextState = !state.isStoreOpen;
    return {
      isStoreOpen: nextState,
      hudMessage: nextState ? 'Store is NOW OPEN! Customers will start arriving.' : 'Store is CLOSED for the evening.'
    };
  }),

  openModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null }),

  // Finance Actions
  addCash: (amount) => set((state) => ({ cash: Number((state.cash + amount).toFixed(2)) })),
  spendCash: (amount) => {
    const { cash } = get();
    if (cash < amount) return false;
    set({ cash: Number((cash - amount).toFixed(2)) });
    return true;
  },

  addPopularity: (delta) => set((state) => ({
    popularity: Math.min(100, Math.max(0, state.popularity + delta))
  })),

  // Computer Shop Purchases
  buyBundle: (bundle) => {
    const { spendCash, warehouseStock } = get();
    if (spendCash(bundle.price)) {
      set({
        warehouseStock: [...warehouseStock, ...bundle.items],
        hudMessage: `Purchased bundle: ${bundle.name} for $${bundle.price}!`
      });
      return true;
    }
    return false;
  },

  buyFurniture: (furniture) => {
    const { spendCash } = get();
    if (spendCash(furniture.price)) {
      set({
        placementMode: furniture,
        hudMessage: `Placing ${furniture.name}. Move cursor in 3D store and click to position.`
      });
      get().closeModal();
      return true;
    }
    return false;
  },

  setPlacementGhostPos: (pos) => set({ placementGhostPos: pos }),

  confirmPlacement: () => {
    const { placementMode, placementGhostPos, shelves } = get();
    if (!placementMode) return;

    const newShelf = {
      id: `shelf_${Date.now()}`,
      genre: placementMode.genre || 'NEW RELEASES',
      position: [...placementGhostPos],
      rotation: [0, 0, 0],
      slots: [null, null, null, null, null, null]
    };

    set({
      shelves: [...shelves, newShelf],
      placementMode: null,
      hudMessage: `Placed ${placementMode.name} successfully!`
    });
  },

  cancelPlacement: () => set({ placementMode: null }),

  // Tape Processing Mechanics (Pick up, Rewind, Scan, Stock)
  pickupDropTape: (tape) => {
    const { dropRack } = get();
    set({
      heldTape: tape,
      dropRack: dropRack.filter((t) => t.id !== tape.id),
      hudMessage: `Picked up returned tape "${tape.title}". Walk to Rewind Deck to fix!`
    });
  },

  processRewind: () => {
    const { heldTape } = get();
    if (!heldTape) return;

    const rewoundTape = { ...heldTape, rewound: true };
    set({
      heldTape: rewoundTape,
      hudMessage: `Tape "${heldTape.title}" REWOUND! Now scan at barcode scanner.`
    });
  },

  processScanBarcode: () => {
    const { heldTape, warehouseStock } = get();
    if (!heldTape) return;

    const scannedTape = { ...heldTape, scanned: true };
    set({
      heldTape: null,
      warehouseStock: [...warehouseStock, scannedTape],
      hudMessage: `Scanned "${scannedTape.title}"! Returned to warehouse stock.`
    });
  },

  // Slushie Machine Dispenser
  dispenseSlushie: (flavor) => {
    const { spendCash } = get();
    if (spendCash(0.50)) { // syrup ingredient cost $0.50
      set({
        heldSlushie: flavor,
        hudMessage: `Dispensed ${flavor} Slushie cup! Ready for customer add-on.`
      });
      return true;
    }
    return false;
  },

  clearHeldSlushie: () => set({ heldSlushie: null }),

  // Customer Queue & Checkout
  setCustomerAtCounter: (customer) => set({ activeCustomer: customer }),

  completeCheckout: (rentalPrice, slushiePrice = 0) => {
    const { addCash, addPopularity, activeCustomer, dailyStats } = get();
    const total = rentalPrice + slushiePrice;

    addCash(total);
    addPopularity(2);

    set({
      activeCustomer: null,
      heldSlushie: null,
      dailyStats: {
        rentalsCount: dailyStats.rentalsCount + 1,
        revenue: Number((dailyStats.revenue + total).toFixed(2)),
        slushiesSold: dailyStats.slushiesSold + (slushiePrice > 0 ? 1 : 0),
      },
      hudMessage: `Checkout complete! Collected $${total.toFixed(2)} cash from ${activeCustomer?.name || 'customer'}.`
    });
  },

  advanceDay: () => set((state) => ({
    day: state.day + 1,
    isStoreOpen: false,
    hudMessage: `Day ${state.day + 1} started! Store reset for morning.`
  }))
}));
