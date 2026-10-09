import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STUDENT } from '@constants/student';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  distanceKm: number | null;
  shipFee: number | null;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  changeQty: (productId: number, amount: number) => void;
  clearCart: () => void;
  setShippingInfo: (distanceKm: number | null, fee: number | null) => void;
  totalQuantity: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      distanceKm: null,
      shipFee: null,

      addItem: (product: Product) => {
        set((state) => {
          const index = state.items.findIndex(
            (item) => item.product.id === product.id,
          );

          if (index !== -1) {
            const updatedItems = [...state.items];
            updatedItems[index] = {
              ...updatedItems[index],
              quantity: updatedItems[index].quantity + 1,
            };
            return { items: updatedItems };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      changeQty: (productId: number, amount: number) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.product.id === productId) {
                const nextQty = item.quantity + amount;
                return nextQty > 0 ? { ...item, quantity: nextQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      setShippingInfo: (distanceKm: number | null, fee: number | null) => {
        set({ distanceKm, shipFee: fee });
      },

      totalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
