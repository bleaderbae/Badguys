import {
  ShopifyData,
  getAllProducts,
  getShopInfo,
  customerAccessTokenCreate,
  customerCreate,
  getCustomer,
  customerRecover,
  updateCheckout
} from './shopify';
import { MOCK_SHOP_PRODUCTS } from './mockData';

// Mock global fetch
global.fetch = jest.fn();

// Mock console.warn to suppress logs during tests
global.console.warn = jest.fn();

describe('Shopify API Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ShopifyData', () => {
    it('should throw "Products not fetched" when API request fails', async () => {
      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(ShopifyData('some query')).rejects.toThrow('Products not fetched');
    });

    it('should return data when API request succeeds', async () => {
      const mockData = { data: { products: [] } };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });

      const result = await ShopifyData('some query');
      expect(result).toEqual(mockData);
    });
  });

  describe('getAllProducts', () => {
    it('should return mock data when API request fails', async () => {
      // Mock fetch to reject, causing ShopifyData to throw
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getAllProducts();

      expect(result).toEqual(MOCK_SHOP_PRODUCTS);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return products when API request succeeds', async () => {
        const mockProducts = {
            data: {
                products: {
                    edges: [
                        { node: { title: 'Test Product' } }
                    ]
                }
            }
        };
        (global.fetch as jest.Mock).mockResolvedValue({
            json: jest.fn().mockResolvedValue(mockProducts),
        });

        const result = await getAllProducts();
        expect(result).toEqual(mockProducts.data.products.edges);
    });
  });

  describe('getShopInfo', () => {
    it('should return shop info when API request succeeds', async () => {
      const mockShop = {
        data: {
          shop: {
            name: 'Test Shop',
            description: 'Test Description'
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockShop),
      });

      const result = await getShopInfo();
      expect(result).toEqual(mockShop.data.shop);
    });

    it('should return default shop info when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getShopInfo();
      expect(result).toEqual({ name: 'Bad Guys Club', description: 'The lifestyle brand for modern bad guys' });
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('customerAccessTokenCreate', () => {
    it('should return access token when API request succeeds', async () => {
      const mockToken = {
        data: {
          customerAccessTokenCreate: {
            customerAccessToken: { accessToken: 'token', expiresAt: 'date' },
            customerUserErrors: []
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockToken),
      });

      const result = await customerAccessTokenCreate('test@example.com', 'password');
      expect(result).toEqual(mockToken.data.customerAccessTokenCreate);
    });
  });

  describe('customerCreate', () => {
    it('should return customer data when API request succeeds', async () => {
      const mockCustomer = {
        data: {
          customerCreate: {
            customer: { id: '1', email: 'test@example.com' },
            customerUserErrors: []
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCustomer),
      });

      const result = await customerCreate('test@example.com', 'password');
      expect(result).toEqual(mockCustomer.data.customerCreate);
    });
  });

  describe('getCustomer', () => {
    it('should return customer details when API request succeeds', async () => {
      const mockCustomer = {
        data: {
          customer: { id: '1', email: 'test@example.com' }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCustomer),
      });

      const result = await getCustomer('token');
      expect(result).toEqual(mockCustomer.data.customer);
    });
  });

  describe('customerRecover', () => {
    it('should return recover result when API request succeeds', async () => {
      const mockRecover = {
        data: {
          customerRecover: {
            customerUserErrors: []
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockRecover),
      });

      const result = await customerRecover('test@example.com');
      expect(result).toEqual(mockRecover.data.customerRecover);
    });
  });

  describe('updateCheckout', () => {
    it('should update checkout line items and return the checkout object', async () => {
      const mockCheckout = {
        data: {
          checkoutLineItemsReplace: {
            checkout: {
              id: 'checkout-1',
              webUrl: 'https://checkout.url',
              lineItems: { edges: [] }
            }
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCheckout),
      });

      const lineItems = [{ id: 'variant-1', variantQuantity: 2 }];
      const result = await updateCheckout('checkout-1', lineItems);

      expect(result).toEqual(mockCheckout.data.checkoutLineItemsReplace.checkout);

      // Verify that fetch was called with the correct formatted line items
      const expectedQueryVariables = {
        checkoutId: 'checkout-1',
        lineItems: [{ variantId: 'variant-1', quantity: 2 }]
      };

      const lastCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(lastCall[1].body);
      expect(body.variables).toEqual(expectedQueryVariables);
    });

    it('should return null when checkout update fails (checkout is null)', async () => {
      const mockResponse = {
        data: {
          checkoutLineItemsReplace: {
            checkout: null
          }
        }
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const lineItems = [{ id: 'variant-1', variantQuantity: 1 }];
      const result = await updateCheckout('checkout-1', lineItems);

      expect(result).toBeNull();
    });

    it('should throw an error when the API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const lineItems = [{ id: 'variant-1', variantQuantity: 1 }];

      await expect(updateCheckout('checkout-1', lineItems)).rejects.toThrow('Products not fetched');
    });
  });
});
