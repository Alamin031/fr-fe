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
  sim ?: string,
  display ? : string,
  region ? : string,
  colorname ? : string,
  dynamicInputs ? : object,
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
      name: "order-storage", // key in localStorage
    }
  )
);

export default useOrderStore;
