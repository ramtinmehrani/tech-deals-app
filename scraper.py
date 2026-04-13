import urllib.request
import json
import uuid
import re

def fetch_tech_deals():
    req = urllib.request.Request(
        'https://www.reddit.com/r/buildapcsales/hot.json?limit=30', 
        headers={'User-Agent': 'TechDealsApp/2.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            deals = []
            for post in data['data']['children']:
                p = post['data']
                if p['stickied'] or p['is_self']: continue
                
                title = p['title']
                price_strings = re.findall(r'\$([0-9,]+(?:\.[0-9]{2})?)', title)
                prices = [float(p.replace(',', '')) for p in price_strings]
                
                current_price = prices[0] if prices else 0
                previous_price = max(prices) if len(prices) > 1 else 0

                # SMART LOGIC: If only 1 price found, try to calculate original from "X% off"
                if len(prices) == 1:
                    pct_match = re.search(r'(\d+)%\s+off', title.lower())
                    save_match = re.search(r'save\s+\$(\d+)', title.lower())
                    
                    if pct_match:
                        pct = int(pct_match.group(1))
                        previous_price = current_price / (1 - (pct / 100))
                    elif save_match:
                        savings = float(save_match.group(1))
                        previous_price = current_price + savings

                # Determine Store
                domain = p.get('domain', '').lower()
                store = 'Other'
                if 'microcenter' in domain or 'micro center' in title.lower(): store = 'Micro Center'
                elif 'amazon' in domain: store = 'Amazon'
                elif 'newegg' in domain: store = 'Newegg'
                elif 'bestbuy' in domain: store = 'Best Buy'

                # Extract Category like [Monitor] or [GPU]
                cat_match = re.search(r'\[(.*?)\]', title)
                category = cat_match.group(1) if cat_match else "Deal"

                deals.append({
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "store": store,
                    "category": category,
                    "currentPrice": current_price,
                    "previousPrice": previous_price,
                    "url": p['url']
                })
            
            with open('deals.json', 'w') as f:
                json.dump(deals, f, indent=2)
            print("✅ Smart Scraper updated!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fetch_tech_deals()
