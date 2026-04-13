import urllib.request
import json
import uuid

def fetch_tech_deals():
    # Use a custom User-Agent so Reddit doesn't block the request
    req = urllib.request.Request(
        'https://www.reddit.com/r/buildapcsales/new.json?limit=15', 
        headers={'User-Agent': 'TechDealsApp/1.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            deals = []
            for post in data['data']['children']:
                p = post['data']
                
                # Skip sticky posts and text-only posts
                if p['stickied'] or p['is_self']:
                    continue
                    
                # Identify the store from the URL
                domain = p.get('domain', '').lower()
                if 'newegg' in domain:
                    store = 'Newegg'
                elif 'amazon' in domain:
                    store = 'Amazon'
                elif 'bestbuy' in domain:
                    store = 'Best Buy'
                else:
                    store = 'Amazon' # Fallback for TypeScript strictness
                
                deal = {
                    "id": str(uuid.uuid4()),
                    "title": p['title'],
                    "brand": "Various", 
                    "category": "PC Components",
                    "store": store,
                    "currentPrice": 0,
                    "previousPrice": 0,
                    "description": f"Trending deal from r/buildapcsales. Upvotes: {p.get('ups', 0)}",
                    "url": p['url']
                }
                deals.append(deal)
            
            # Save the live data to a JSON file
            with open('deals.json', 'w', encoding='utf-8') as f:
                json.dump(deals, f, indent=2)
                
            print(f"✅ Successfully scraped {len(deals)} live deals!")

    except Exception as e:
        print(f"❌ Error fetching deals: {e}")

if __name__ == "__main__":
    fetch_tech_deals()
