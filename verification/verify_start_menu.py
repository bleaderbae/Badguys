from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 720})

        try:
            print("Navigating to home...")
            page.goto("http://localhost:3000")

            # Wait for loader to finish. The Start button appears after loading.
            print("Waiting for Start button...")
            start_button = page.get_by_role("button", name="Start")
            start_button.wait_for(timeout=10000)

            print("Start button found!")

            # Check initial state
            expanded_state = start_button.get_attribute("aria-expanded")
            print(f"Initial aria-expanded: {expanded_state}")

            if expanded_state == "true":
                 print("ERROR: Start menu should be closed initially")

            print("Clicking Start button...")
            start_button.click()

            # Wait for state update
            page.wait_for_timeout(500)

            expanded_state_after = start_button.get_attribute("aria-expanded")
            print(f"After click aria-expanded: {expanded_state_after}")

            if expanded_state_after != "true":
                print("ERROR: Start menu should be open")

            # Verify menu is visible
            menu = page.locator("#start-menu")
            if not menu.is_visible():
                print("ERROR: Start menu element not visible")

            print("Pressing Escape...")
            page.keyboard.press("Escape")

            # Wait for state update
            page.wait_for_timeout(500)

            expanded_state_final = start_button.get_attribute("aria-expanded")
            print(f"After Escape aria-expanded: {expanded_state_final}")

            if expanded_state_final != "false":
                print("ERROR: Start menu should be closed after Escape")
            else:
                print("SUCCESS: Start menu closed on Escape")

            print("Taking screenshot...")
            page.screenshot(path="verification/start_menu_closed.png")
            print("Verification complete.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error_start_menu.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
