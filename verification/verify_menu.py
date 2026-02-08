from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Emulate a mobile device to force correct viewport behavior if meta tag is present
        # But if meta tag is missing, emulation might still show desktop size depending on browser defaults
        context = browser.new_context(
            viewport={"width": 375, "height": 667},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        try:
            print("Navigating to home...")
            page.goto("http://localhost:3000")

            width = page.evaluate("window.innerWidth")
            print(f"Window innerWidth: {width}")

            # Take screenshot to see what's loaded
            page.screenshot(path="verification/debug_viewport.png")

            if width > 500:
                print("WARNING: Viewport seems to be desktop size despite emulation!")

            print("Finding mobile menu button...")
            menu_button = page.locator("button[aria-label='Open menu']")

            if menu_button.is_visible():
                print("Mobile menu button is visible.")
            else:
                print("Mobile menu button is NOT visible.")

            # ... rest of the script ...

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
