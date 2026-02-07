from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:3000")

        # Wait for the cart link to be visible
        cart_link = page.locator('a[href="/cart"]')
        cart_link.wait_for()

        # Take a screenshot of the header
        header = page.locator('header')
        header.screenshot(path="verification/header.png")

        # Take a screenshot of the cart button specifically
        cart_link.screenshot(path="verification/cart_button.png")

        browser.close()

if __name__ == "__main__":
    run()
