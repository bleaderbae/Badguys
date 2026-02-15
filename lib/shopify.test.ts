import {
  ShopifyData,
  getAllProducts,
  getShopInfo,
  customerAccessTokenCreate,
  customerCreate,
  getCustomer,
  customerRecover,
  updateCheckout,
  getCardProducts,
  getProduct,
  createCheckout,
  checkoutLineItemsAdd,
  getCheckout,
  checkoutLineItemsRemove
} from './shopify';
import { MOCK_SHOP_PRODUCTS, MOCK_CARD_PRODUCTS, MOCK_PRODUCT_DETAILS } from './mockData';

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

    it('should throw "Products not fetched" when response is not valid JSON', async () => {
       (global.fetch as jest.Mock).mockResolvedValue({
         json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
       });
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

    it('should call fetch with correct headers and body', async () => {
      const mockData = { data: { products: [] } };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockData),
      });

      await ShopifyData('some query', { var1: 'val1' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/2024-01/graphql.json'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }),
          body: JSON.stringify({
            query: 'some query',
            variables: { var1: 'val1' }
          }),
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('should log warning and throw generic error when request is aborted', async () => {
      const abortError = new Error('The user aborted a request.');
      abortError.name = 'AbortError';
      (global.fetch as jest.Mock).mockRejectedValue(abortError);

      await expect(ShopifyData('some query')).rejects.toThrow('Products not fetched');
      expect(console.warn).toHaveBeenCalledWith('Request to Shopify API timed out');
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

  describe('getCardProducts', () => {
    it('should return MOCK_CARD_PRODUCTS', async () => {
      const result = await getCardProducts();
      expect(result).toEqual(MOCK_CARD_PRODUCTS);
    });
  });

  describe('getProduct', () => {
    it('should return mocked product details if handle exists in MOCK_PRODUCT_DETAILS', async () => {
      const handle = Object.keys(MOCK_PRODUCT_DETAILS)[0];
      const result = await getProduct(handle);
      expect(result).toEqual(MOCK_PRODUCT_DETAILS[handle]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should fetch product from API if handle not in MOCK_PRODUCT_DETAILS', async () => {
      const handle = 'unknown-handle';
      const mockProduct = {
        data: {
          product: { title: 'New Product' }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await getProduct(handle);
      expect(result).toEqual(mockProduct.data.product);
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should return null when API request fails', async () => {
      const handle = 'unknown-handle';
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await getProduct(handle);
      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('createCheckout', () => {
    it('should return checkout object when API request succeeds', async () => {
      const mockCheckout = {
        data: {
          checkoutCreate: {
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

      const result = await createCheckout('variant-1', 1);
      expect(result).toEqual(mockCheckout.data.checkoutCreate.checkout);

      // Verify correct mutation variables
      const lastCall = (global.fetch as jest.Mock).mock.calls[0];
      const body = JSON.parse(lastCall[1].body);
      expect(body.variables).toEqual({ variantId: 'variant-1', quantity: 1 });
      expect(body.query).toContain('mutation checkoutCreate');
    });

    it('should return null when checkout is null in response', async () => {
      const mockResponse = {
        data: {
          checkoutCreate: {
            checkout: null
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await createCheckout('variant-1', 1);
      expect(result).toBeNull();
    });

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(createCheckout('variant-1', 1)).rejects.toThrow('Products not fetched');
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

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(customerAccessTokenCreate('test@example.com', 'password')).rejects.toThrow('Products not fetched');
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

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(customerCreate('test@example.com', 'password')).rejects.toThrow('Products not fetched');
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

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(getCustomer('token')).rejects.toThrow('Products not fetched');
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

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(customerRecover('test@example.com')).rejects.toThrow('Products not fetched');
    });
  });

  describe('checkoutLineItemsAdd', () => {
    it('should return updated checkout when API request succeeds', async () => {
      const mockCheckout = {
        data: {
          checkoutLineItemsAdd: {
            checkout: { id: 'checkout-1', lineItems: [] }
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCheckout),
      });

      const result = await checkoutLineItemsAdd('checkout-1', [{ variantId: 'v1', quantity: 1 }]);
      expect(result).toEqual(mockCheckout.data.checkoutLineItemsAdd.checkout);
    });

    it('should return null when checkout is null in response', async () => {
      const mockResponse = {
        data: {
          checkoutLineItemsAdd: {
            checkout: null
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutLineItemsAdd('checkout-1', [{ variantId: 'v1', quantity: 1 }]);
      expect(result).toBeNull();
    });

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(checkoutLineItemsAdd('checkout-1', [{ variantId: 'v1', quantity: 1 }])).rejects.toThrow('Products not fetched');
    });
  });

  describe('getCheckout', () => {
    it('should return checkout when API request succeeds', async () => {
      const mockCheckout = {
        data: {
          node: { id: 'checkout-1' }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCheckout),
      });

      const result = await getCheckout('checkout-1');
      expect(result).toEqual(mockCheckout.data.node);
    });

    it('should return null when node is null in response', async () => {
      const mockResponse = {
        data: {
          node: null
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await getCheckout('checkout-1');
      expect(result).toBeNull();
    });

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(getCheckout('checkout-1')).rejects.toThrow('Products not fetched');
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

  describe('checkoutLineItemsRemove', () => {
    it('should return updated checkout when API request succeeds', async () => {
      const mockCheckout = {
        data: {
          checkoutLineItemsRemove: {
            checkout: { id: 'checkout-1', lineItems: [] }
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockCheckout),
      });

      const result = await checkoutLineItemsRemove('checkout-1', ['line-item-1']);
      expect(result).toEqual(mockCheckout.data.checkoutLineItemsRemove.checkout);
    });

    it('should return null when checkout is null in response', async () => {
      const mockResponse = {
        data: {
          checkoutLineItemsRemove: {
            checkout: null
          }
        }
      };
      (global.fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await checkoutLineItemsRemove('checkout-1', ['line-item-1']);
      expect(result).toBeNull();
    });

    it('should throw "Products not fetched" when API request fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      await expect(checkoutLineItemsRemove('checkout-1', ['line-item-1'])).rejects.toThrow('Products not fetched');
    });
  });
});
