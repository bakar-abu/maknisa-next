"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ProductOrderModal } from "@/components/cart/ProductOrderModal";
import {
  buildCartLineId,
  type CartItem,
  type CartItemInput,
  type ProductOrderLineItem,
  type ProductOrderType,
} from "@/lib/cart/types";
import { readCartFromStorage, writeCartToStorage } from "@/lib/cart/storage";

type OrderModalState = {
  items: ProductOrderLineItem[];
  orderType: ProductOrderType;
  onSuccess?: () => void;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  hydrated: boolean;
  drawerOpen: boolean;
  orderModalOpen: boolean;
  addItem: (input: CartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openOrderModal: (state: OrderModalState) => void;
  closeOrderModal: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderModal, setOrderModal] = useState<OrderModalState | null>(null);

  useEffect(() => {
    setItems(readCartFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeCartToStorage(items);
  }, [items, hydrated]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const addItem = useCallback((input: CartItemInput) => {
    const lineId = buildCartLineId(input);
    setItems((current) => {
      const existing = current.find((item) => item.lineId === lineId);
      if (existing) {
        return current.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
            : item,
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: input.productId,
          productTitle: input.productTitle,
          serviceSlug: input.serviceSlug,
          categoryLabel: input.categoryLabel,
          image: input.image,
          href: input.href,
          price: input.price,
          quantity: input.quantity ?? 1,
          color: input.color,
          size: input.size,
          pieces: input.pieces,
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((current) => current.filter((item) => item.lineId !== lineId));
      return;
    }
    setItems((current) =>
      current.map((item) => (item.lineId === lineId ? { ...item, quantity } : item)),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const openOrderModal = useCallback((state: OrderModalState) => {
    setOrderModal(state);
    setDrawerOpen(false);
  }, []);

  const closeOrderModal = useCallback(() => setOrderModal(null), []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      hydrated,
      drawerOpen,
      orderModalOpen: Boolean(orderModal),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      openOrderModal,
      closeOrderModal,
    }),
    [
      items,
      itemCount,
      hydrated,
      drawerOpen,
      orderModal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      openOrderModal,
      closeOrderModal,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      {orderModal ? (
        <ProductOrderModal
          open
          items={orderModal.items}
          orderType={orderModal.orderType}
          onClose={closeOrderModal}
          onSuccess={orderModal.onSuccess ?? (() => undefined)}
        />
      ) : null}
    </CartContext.Provider>
  );
}
