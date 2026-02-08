from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 375, "height": 667})
        page = context.new_page()

        try:
            print("Navigating to home...")
            page.goto("http://localhost:3000")
            page.wait_for_timeout(2000) # Wait for hydration

            print("Looking for button...")
            button = page.locator("button[aria-label='Open menu']")
            if button.count() > 0:
                print(f"Button found: {button.count()}")
                print(f"Button HTML: {button.first.evaluate('el => el.outerHTML')}")

                is_visible = button.is_visible()
                print(f"Is visible: {is_visible}")

                if not is_visible:
                    # Check bounding box
                    box = button.bounding_box()
                    print(f"Bounding box: {box}")

                    # Check computed style display
                    display = button.evaluate("el => getComputedStyle(el).display")
                    print(f"Computed display: {display}")

                    # Check if hidden by parent
                    parent_display = button.evaluate("el => getComputedStyle(el.parentElement).display")
                    print(f"Parent display: {parent_display}")
            else:
                print("Button NOT found in DOM")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
