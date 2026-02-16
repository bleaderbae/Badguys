import { isValidLineItem } from './validation';

describe('isValidLineItem', () => {
  it('should return true for a valid line item without variant', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
    };
    expect(isValidLineItem(item)).toBe(true);
  });

  it('should return true for a valid line item with variant', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
      variant: {
        id: 'v1',
        title: 'Variant',
        price: { amount: '10.00' },
      },
    };
    expect(isValidLineItem(item)).toBe(true);
  });

  it('should return true for a valid line item with variant and image', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
      variant: {
        id: 'v1',
        title: 'Variant',
        price: { amount: '10.00' },
        image: { url: 'http://example.com' },
      },
    };
    expect(isValidLineItem(item)).toBe(true);
  });

  it('should return false if missing id', () => {
    const item = {
      title: 'Product',
      quantity: 1,
    };
    expect(isValidLineItem(item)).toBe(false);
  });

  it('should return false if missing title', () => {
    const item = {
      id: '1',
      quantity: 1,
    };
    expect(isValidLineItem(item)).toBe(false);
  });

  it('should return false if missing quantity', () => {
    const item = {
      id: '1',
      title: 'Product',
    };
    expect(isValidLineItem(item)).toBe(false);
  });

  it('should return false if variant is present but invalid (missing price)', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
      variant: {
        id: 'v1',
        title: 'Variant',
      },
    };
    expect(isValidLineItem(item)).toBe(false);
  });

  it('should return false if variant price is missing amount', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
      variant: {
        id: 'v1',
        title: 'Variant',
        price: {},
      },
    };
    expect(isValidLineItem(item)).toBe(false);
  });

  it('should return false if variant image is invalid', () => {
    const item = {
      id: '1',
      title: 'Product',
      quantity: 1,
      variant: {
        id: 'v1',
        title: 'Variant',
        price: { amount: '10.00' },
        image: { url: 123 }, // Invalid type
      },
    };
    expect(isValidLineItem(item)).toBe(false);
  });
});
