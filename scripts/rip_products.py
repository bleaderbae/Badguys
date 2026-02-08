import urllib.request
import urllib.parse
import re
import json
import time
import os

BASE_URL = "https://bgc.gg"
SHOP_URL = "https://bgc.gg/shop/"

def get_html(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def extract_products_from_shop_page(html):
    product_links = set()
    # Looking for products links
    matches = re.findall(r'href="(https://bgc.gg/product/[^/]+/?)"', html)
    for link in matches:
        product_links.add(link)
    return list(product_links)

def extract_product_details(url, html):
    details = {"url": url}

    # Title
    title_match = re.search(r'<h1[^>]*class="product_title[^"]*"[^>]*>(.*?)</h1>', html, re.DOTALL)
    if title_match:
        details["title"] = title_match.group(1).strip()
    else:
        title_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.DOTALL)
        if title_match:
             details["title"] = title_match.group(1).strip()

    if "title" in details:
        details["title"] = re.sub(r'<[^>]+>', '', details["title"]).strip()

    # Price
    price_match = re.search(r'<p class="price">(.*?)</p>', html, re.DOTALL)
    if price_match:
        price_text = re.sub(r'<[^>]+>', '', price_match.group(1)).strip()
        # Clean up price (e.g., "$30.00 – $35.00" -> "30.00")
        details["price_range"] = price_text

        # Simple extraction of a base price
        prices = re.findall(r'\$?([\d,]+\.\d{2})', price_text)
        if prices:
            details["price"] = prices[0]
        else:
            details["price"] = "0.00"

    # Description
    desc_match = re.search(r'<div[^>]*id="tab-description"[^>]*>(.*?)</div>', html, re.DOTALL)
    if desc_match:
        desc_text = re.sub(r'<[^>]+>', '\n', desc_match.group(1)).strip()
        details["description"] = desc_text

    # Images
    images = set()
    # Looking for large images first
    img_matches = re.findall(r'(https://bgc.gg/wp-content/uploads/[0-9]{4}/[0-9]{2}/[^"\'\s]+\.(?:jpg|jpeg|png))', html)
    for img in img_matches:
        if "100x100" not in img and "150x150" not in img and "300x300" not in img:
             images.add(img)
    details["images"] = list(images)

    # Category Logic
    title_lower = details.get("title", "").lower()
    url_lower = url.lower()

    if "golf" in title_lower or "golf" in url_lower:
        details["category"] = "golf"
    elif "samurai" in title_lower or "samurai" in url_lower:
        details["category"] = "samurai"
    else:
        details["category"] = "shop-all" # Default for now

    return details

def main():
    if not os.path.exists('lib'):
        os.makedirs('lib')

    all_products = []
    # Scrape first few pages (likely only 2 based on previous view)
    for page in range(1, 4):
        url = f"{SHOP_URL}page/{page}/" if page > 1 else SHOP_URL
        print(f"Scraping {url}...")
        html = get_html(url)

        if not html:
            if page == 1:
                print("Failed to fetch shop page.")
            break

        products = extract_products_from_shop_page(html)
        if not products:
            print(f"No products found on page {page}. Stopping.")
            break

        print(f"Found {len(products)} products on page {page}")

        for p_url in products:
            # Skip if we already have it (dedupe)
            if any(p['url'] == p_url for p in all_products):
                continue

            print(f"  Fetching {p_url}...")
            p_html = get_html(p_url)
            if p_html:
                details = extract_product_details(p_url, p_html)
                all_products.append(details)
            time.sleep(0.5)

    print(f"Total products scraped: {len(all_products)}")
    with open('lib/ripped_products.json', 'w') as f:
        json.dump(all_products, f, indent=2)
    print("Done. Saved to lib/ripped_products.json")

if __name__ == "__main__":
    main()
