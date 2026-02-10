
// Mock Checkout logic
const mockCreateCheckout = async (variantId: string, quantity: number) => {
  console.log(`[API] createCheckout called for variant ${variantId}, quantity ${quantity}`);
  return {
    id: `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    webUrl: `https://mock-shop.myshopify.com/checkouts/c/${Date.now()}`,
    lineItems: { edges: [] }
  };
};

const mockCheckoutLineItemsAdd = async (checkoutId: string, lineItems: { variantId: string; quantity: number }[]) => {
  console.log(`[API] checkoutLineItemsAdd called for checkout ${checkoutId} with ${lineItems.length} items`);
  if (checkoutId === 'checkout_expired') {
    throw new Error('Checkout expired');
  }
  return {
    id: checkoutId,
    webUrl: `https://mock-shop.myshopify.com/checkouts/c/${checkoutId.split('_')[1]}`,
    lineItems: { edges: [] }
  };
};

// Simulation State
let apiCalls = {
  createCheckout: 0,
  checkoutLineItemsAdd: 0
};

// Wrapper to count calls
const trackedCreateCheckout = async (variantId: string, quantity: number) => {
  apiCalls.createCheckout++;
  return mockCreateCheckout(variantId, quantity);
};

const trackedCheckoutLineItemsAdd = async (checkoutId: string, lineItems: { variantId: string; quantity: number }[]) => {
  apiCalls.checkoutLineItemsAdd++;
  return mockCheckoutLineItemsAdd(checkoutId, lineItems);
};

// Naive Implementation (Bad)
async function naiveAddToCart(variantId: string, quantity: number) {
  // Always create a new checkout
  const checkout = await trackedCreateCheckout(variantId, quantity);
  return checkout;
}

// Optimized Implementation (Good - simplified CartContext logic with Robustness Fix)
let currentCheckoutId: string | null = null;

async function optimizedAddToCart(variantId: string, quantity: number) {
  let checkout;
  try {
    if (!currentCheckoutId) {
      checkout = await trackedCreateCheckout(variantId, quantity);
      currentCheckoutId = checkout.id;
    } else {
      try {
        checkout = await trackedCheckoutLineItemsAdd(currentCheckoutId, [{ variantId, quantity }]);
      } catch (addError) {
        console.log(`[Optimized] checkoutLineItemsAdd failed: ${addError}, retrying with createCheckout`);
        // If adding fails (e.g. expired checkout), create a new one
        checkout = await trackedCreateCheckout(variantId, quantity);
        currentCheckoutId = checkout.id;
      }
    }
  } catch (shopifyError) {
     console.log(`[Optimized] Shopify cart failed fully: ${shopifyError}`);
  }
  return checkout;
}

async function runBenchmark() {
  console.log('--- STARTING BENCHMARK (With Robustness Fix) ---');

  // Scenario 1: Naive (3 items)
  console.log('\n--- Scenario 1: Naive Implementation (3 items) ---');
  apiCalls = { createCheckout: 0, checkoutLineItemsAdd: 0 };
  await naiveAddToCart('variant_1', 1);
  await naiveAddToCart('variant_2', 1);
  await naiveAddToCart('variant_3', 1);
  console.log(`Results Naive: createCheckout: ${apiCalls.createCheckout}, checkoutLineItemsAdd: ${apiCalls.checkoutLineItemsAdd}`);

  // Scenario 2: Optimized (3 items)
  console.log('\n--- Scenario 2: Optimized Implementation (3 items) ---');
  apiCalls = { createCheckout: 0, checkoutLineItemsAdd: 0 };
  currentCheckoutId = null; // Reset state
  await optimizedAddToCart('variant_1', 1);
  await optimizedAddToCart('variant_2', 1);
  await optimizedAddToCart('variant_3', 1);
  console.log(`Results Optimized: createCheckout: ${apiCalls.createCheckout}, checkoutLineItemsAdd: ${apiCalls.checkoutLineItemsAdd}`);

  // Scenario 3: Robustness (Simulated Failure)
  console.log('\n--- Scenario 3: Robustness Check (Simulated Failure) ---');
  apiCalls = { createCheckout: 0, checkoutLineItemsAdd: 0 };
  currentCheckoutId = 'checkout_expired'; // Pre-set an expired ID
  await optimizedAddToCart('variant_4', 1);
  console.log(`Results Robustness (Fixed): createCheckout: ${apiCalls.createCheckout}, checkoutLineItemsAdd: ${apiCalls.checkoutLineItemsAdd}`);
  // Expect: 1 checkoutLineItemsAdd (failed) AND 1 createCheckout (retry success)

  console.log('\n--- BENCHMARK COMPLETE ---');
}

runBenchmark();
