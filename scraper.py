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
                
                # Logic to specifically highlight Micro Center
                title = p['title']
                store = 'Other'
                domain = p.get('domain', '').lower()
                
                if 'microcenter' in domain or 'micro center' in title.lower():
                    store = 'Micro Center'
                elif 'amazon' in domain: store = 'Amazon'
                elif 'newegg' in domain: store = 'Newegg'
                elif 'bestbuy' in domain: store = 'Best Buy'

                price_strings = re.findall(r'\$([0-9,]+(?:\.[0-9]{2})?)', title)
                current_price = float(price_strings[0].replace(',', '')) if price_strings else 0
                
                deals.append({
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "brand": "Tech", 
                    "category": "Deal",
                    "store": store,
                    "currentPrice": current_price,
                    "previousPrice": 0,
                    "description": f"Hot deal! Upvotes: {p.get('ups', 0)}",
                    "url": p['url']
                })
            
            with open('deals.json', 'w', encoding='utf-8') as f:
                json.dump(deals, f, indent=2)
            print(f"✅ Scraper updated with Micro Center support!")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    fetch_tech_deals()
