import React, { act } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import { createCheckout, checkoutLineItemsAdd, getCheckout } from '@/lib/shopify';

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

describe('CartContext Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider>{children}</CartProvider>
  );

  it('should use createCheckout for the first item', async () => {
    const mockCheckout = {
      id: 'checkout_1',
      webUrl: 'http://test.com/checkout',
      lineItems: { edges: [] },
    };
    (createCheckout as jest.Mock).mockResolvedValue(mockCheckout);

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    await act(async () => {
      await result.current.addToCart('variant_1', 1);
    });

    expect(createCheckout).toHaveBeenCalledWith('variant_1', 1);
    expect(checkoutLineItemsAdd).not.toHaveBeenCalled();
    expect(result.current.checkoutId).toBe('checkout_1');
  });

  it('should use checkoutLineItemsAdd for subsequent items', async () => {
    const mockCheckout1 = {
      id: 'checkout_1',
      webUrl: 'http://test.com/checkout',
      lineItems: { edges: [] },
    };
    const mockCheckout2 = {
      id: 'checkout_1',
      webUrl: 'http://test.com/checkout',
      lineItems: { edges: [{ node: { id: 'line_1', quantity: 1 } }, { node: { id: 'line_2', quantity: 1 } }] },
    };

    (createCheckout as jest.Mock).mockResolvedValue(mockCheckout1);
    (checkoutLineItemsAdd as jest.Mock).mockResolvedValue(mockCheckout2);

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    // First add (create)
    await act(async () => {
      await result.current.addToCart('variant_1', 1);
    });

    // Second add (add to existing)
    await act(async () => {
      await result.current.addToCart('variant_2', 1);
    });

    expect(createCheckout).toHaveBeenCalledTimes(1);
    expect(checkoutLineItemsAdd).toHaveBeenCalledTimes(1);
    expect(checkoutLineItemsAdd).toHaveBeenCalledWith('checkout_1', [{ variantId: 'variant_2', quantity: 1 }]);
  });

  it('should fallback to createCheckout if checkoutLineItemsAdd fails (e.g. expired)', async () => {
    const mockCheckout1 = {
      id: 'checkout_1',
      webUrl: 'http://test.com/checkout',
      lineItems: { edges: [] },
    };
    const mockCheckout2 = {
      id: 'checkout_2', // New ID
      webUrl: 'http://test.com/checkout2',
      lineItems: { edges: [] },
    };

    (createCheckout as jest.Mock)
      .mockResolvedValueOnce(mockCheckout1) // First call
      .mockResolvedValueOnce(mockCheckout2); // Second call (retry)

    (checkoutLineItemsAdd as jest.Mock).mockRejectedValue(new Error('Checkout expired'));

    const { result } = renderHook(() => useCart(), { wrapper });

    await waitFor(() => expect(result.current.isInitializing).toBe(false));

    // First add
    await act(async () => {
      await result.current.addToCart('variant_1', 1);
    });

    // Second add - should fail and retry
    await act(async () => {
      await result.current.addToCart('variant_2', 1);
    });

    expect(checkoutLineItemsAdd).toHaveBeenCalledTimes(1); // Tried and failed
    expect(createCheckout).toHaveBeenCalledTimes(2); // Initial + Retry
    expect(result.current.checkoutId).toBe('checkout_2');
  });
});
