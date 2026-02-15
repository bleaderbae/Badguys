import {
  createCheckout,
  checkoutLineItemsAdd,
  updateCheckout
} from './shopify';
import { CheckoutLineItemInput, UpdateCheckoutLineItem } from './types';

// Mock global fetch to ensure it's not called when validation fails
global.fetch = jest.fn();

// Mock console.warn to suppress logs during tests
global.console.warn = jest.fn();

describe('Shopify API Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckout', () => {
    it('should throw an error if quantity is 0', async () => {
      await expect(createCheckout('variant-1', 0)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if quantity is negative', async () => {
      await expect(createCheckout('variant-1', -1)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if quantity is excessively large', async () => {
      await expect(createCheckout('variant-1', 10001)).rejects.toThrow('Quantity exceeds maximum limit');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('checkoutLineItemsAdd', () => {
    it('should throw an error if any item has quantity 0', async () => {
      const items: CheckoutLineItemInput[] = [{ variantId: 'v1', quantity: 0 }];
      await expect(checkoutLineItemsAdd('checkout-1', items)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if any item has negative quantity', async () => {
      const items: CheckoutLineItemInput[] = [{ variantId: 'v1', quantity: -5 }];
      await expect(checkoutLineItemsAdd('checkout-1', items)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if any item has excessively large quantity', async () => {
      const items: CheckoutLineItemInput[] = [{ variantId: 'v1', quantity: 10001 }];
      await expect(checkoutLineItemsAdd('checkout-1', items)).rejects.toThrow('Quantity exceeds maximum limit');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('updateCheckout', () => {
    it('should throw an error if any item has quantity 0', async () => {
      const items: UpdateCheckoutLineItem[] = [{ id: 'v1', variantQuantity: 0 }];
      await expect(updateCheckout('checkout-1', items)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if any item has negative quantity', async () => {
      const items: UpdateCheckoutLineItem[] = [{ id: 'v1', variantQuantity: -1 }];
      await expect(updateCheckout('checkout-1', items)).rejects.toThrow('Quantity must be greater than 0');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should throw an error if any item has excessively large quantity', async () => {
      const items: UpdateCheckoutLineItem[] = [{ id: 'v1', variantQuantity: 10001 }];
      await expect(updateCheckout('checkout-1', items)).rejects.toThrow('Quantity exceeds maximum limit');
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
