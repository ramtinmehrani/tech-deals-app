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
                # Look for all price patterns like $400 or $400.99
                price_strings = re.findall(r'\$([0-9,]+(?:\.[0-9]{2})?)', title)
                
                # Convert strings to floats
                prices = [float(p.replace(',', '')) for p in price_strings]
                
                current_price = 0
                previous_price = 0
                
                if len(prices) >= 2:
                    # If two prices found, the smaller is the deal, larger is original
                    current_price = min(prices)
                    previous_price = max(prices)
                elif len(prices) == 1:
                    current_price = prices[0]
                    previous_price = 0 # No original price found

                # Determine Store
                domain = p.get('domain', '').lower()
                store = 'Other'
                if 'microcenter' in domain or 'micro center' in title.lower(): store = 'Micro Center'
                elif 'amazon' in domain: store = 'Amazon'
                elif 'newegg' in domain: store = 'Newegg'
                elif 'bestbuy' in domain: store = 'Best Buy'

                deals.append({
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "store": store,
                    "category": "Deal",
                    "currentPrice": current_price,
                    "previousPrice": previous_price,
                    "url": p['url'],
                    "ups": p.get('ups', 0)
                })
            
            with open('deals.json', 'w') as f:
                json.dump(deals, f, indent=2)
            print(f"✅ Scraper updated with Price Comparison!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fetch_tech_deals()
