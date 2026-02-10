from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    print("Navigating to product page...")
    # Go to the product page
    page.goto("http://localhost:3000/product/qa-test-product")

    # Wait for hydration and loading
    # The product page has a loading state. We wait for the main content.
    try:
        page.wait_for_selector("h1", timeout=10000)
        print("Page loaded.")
    except Exception as e:
        print(f"Timeout waiting for page load: {e}")
        page.screenshot(path="/home/jules/verification/timeout.png")
        browser.close()
        return

    # Check for variant buttons
    # The variant buttons have class "border-2" and are inside the product info
    try:
        page.wait_for_selector("button.border-2", timeout=5000)
        buttons = page.locator("button.border-2").all()
        print(f"Found {len(buttons)} variant/option buttons.")

        if len(buttons) > 0:
            # Click the second one if available to change selection
            if len(buttons) > 1:
                buttons[1].click()
                print("Clicked second variant button.")
            else:
                buttons[0].click()
                print("Clicked first variant button.")

            page.wait_for_timeout(1000) # Wait for any reaction
    except Exception as e:
        print(f"No variant buttons found or interaction failed: {e}")

    # Take a screenshot
    page.screenshot(path="/home/jules/verification/product_page.png")
    print("Screenshot saved to /home/jules/verification/product_page.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)
