import React, { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { createCheckout, checkoutLineItemsAdd } from '@/lib/shopify';

// Mock lib/shopify
jest.mock('@/lib/shopify', () => ({
  createCheckout: jest.fn(),
  checkoutLineItemsAdd: jest.fn(),
  getCheckout: jest.fn(),
  checkoutLineItemsRemove: jest.fn(),
}));

// Mock LocalStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CartContext Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should ignore addToCart with 0 quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.addToCart('variant_1', 0);
    });

    expect(createCheckout).not.toHaveBeenCalled();
    expect(checkoutLineItemsAdd).not.toHaveBeenCalled();
  });

  it('should ignore addToCart with negative quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.addToCart('variant_1', -5);
    });

    expect(createCheckout).not.toHaveBeenCalled();
    expect(checkoutLineItemsAdd).not.toHaveBeenCalled();
  });

  it('should ignore addToCart with excessively large quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.addToCart('variant_1', 10001);
    });

    expect(createCheckout).not.toHaveBeenCalled();
    expect(checkoutLineItemsAdd).not.toHaveBeenCalled();
  });
});
