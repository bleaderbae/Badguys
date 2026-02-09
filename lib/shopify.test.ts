import { ShopifyData, getAllProducts } from './shopify';
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
});
