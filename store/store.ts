import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderItem {
  productId?: string;
  productName: string;
  price: number;
  color?: string;
  storage?: string;
  RAM?: string;
  quantity: number;
  image?: string;
  sim?: string;
  display?: string;
  region?: string;
  colorname?: string;
  dynamicInputs?: object;
}

interface addtobagItem {
  productId?: number;
  productName: string;
  price: number;
  color?: string;
  storage?: string;
  quantity: number;
  image?: string;
  display?: string;
  colorname?: string;
  dynamicInputs?: object;
}

interface OrderState {
  order: OrderItem[];
  addOrder: (item: OrderItem) => void;
  clearOrder: () => void;
}

const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      order: [],
      addOrder: (item) =>
        set((state) => ({
          order: [...state.order, item],
        })),
      clearOrder: () => set({ order: [] }),
    }),
    {
      name: "order-storage",
    }
  )
);

interface addtobagState {
  order: addtobagItem[];
  addOrderbag: (item: addtobagItem) => void;
  removeOrder: (productId: string) => void; // Add remove function
  clearOrder: () => void;
}

const useaddtobagStore = create<addtobagState>()(
  persist(
    (set) => ({
      order: [],
      addOrderbag: (item) =>
        set((state) => ({
          order: [...state.order, item],
        })),
      removeOrder: (productId) =>
        set((state) => ({
          order: state.order.filter(item => item.productId !== productId),
        })),
      clearOrder: () => set({ order: [] }),
    }),
    {
      name: "addtobag-storage",
    }
  )
);

export default useOrderStore;
export { useaddtobagStore };


// store/sidebarStore.js
export const useSidebarStore = create((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  closeSidebar: () => set({ isOpen: false }),
  openSidebar: () => set({ isOpen: true }),
}));