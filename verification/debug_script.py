from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Emulate a mobile device
        context = browser.new_context(
            viewport={"width": 375, "height": 667},
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
        )
        page = context.new_page()

        # Listen for console errors
        page.on("console", lambda msg: print(f"Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PageError: {err}"))

        try:
            print("Navigating to home...")
            response = page.goto("http://localhost:3000")
            print(f"Status: {response.status}")

            # Wait for content
            page.wait_for_selector("header", timeout=5000)

            print("Taking debug screenshot...")
            page.screenshot(path="verification/debug_console.png")

            # ... rest of logic skipped for debugging ...

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_console.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
