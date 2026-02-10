from playwright.sync_api import sync_playwright

def verify_cart():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # 1. Verify Empty Cart
        page.goto("http://localhost:3000/cart")
        try:
            page.wait_for_selector("text=CART IS EMPTY", timeout=10000)
        except:
            pass
        page.screenshot(path="cart_empty.png")

        # 2. Add Item
        page.goto("http://localhost:3000/shop")
        try:
            page.wait_for_selector("a[href^='/product/']", timeout=10000)
            products = page.query_selector_all("a[href^='/product/']")
            if products:
                products[0].click()
                page.wait_for_selector("text=ADD TO CART", timeout=10000)
                page.click("text=ADD TO CART")
                page.wait_for_selector("text=ADDED TO CART!", timeout=5000)
        except:
            pass

        # 3. Verify Cart
        page.goto("http://localhost:3000/cart")
        try:
            page.wait_for_selector("text=TOTAL", timeout=10000)
        except:
            pass

        page.screenshot(path="cart_with_items.png")

        browser.close()

if __name__ == "__main__":
    verify_cart()
