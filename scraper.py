import urllib.request
import json
import uuid
import re # We need this to find prices in text!

def fetch_tech_deals():
    # Looking at the 'hot' page instead of 'new' to get better deals, grabbing top 25
    req = urllib.request.Request(
        'https://www.reddit.com/r/buildapcsales/hot.json?limit=25', 
        headers={'User-Agent': 'TechDealsApp/2.0'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            deals = []
            for post in data['data']['children']:
                p = post['data']
                
                # Skip sticky posts
                if p['stickied'] or p['is_self']:
                    continue
                
                # FILTER: Only keep deals the community actually likes (e.g., > 15 upvotes)
                upvotes = p.get('ups', 0)
                if upvotes < 15:
                    continue

                title = p['title']
                
                # Extract category from the brackets in the title (e.g., [Monitor] -> Monitor)
                category_match = re.search(r'\[(.*?)\]', title)
                category = category_match.group(1).strip() if category_match else "PC Components"

                # Identify the store
                domain = p.get('domain', '').lower()
                if 'newegg' in domain: store = 'Newegg'
                elif 'amazon' in domain: store = 'Amazon'
                elif 'bestbuy' in domain: store = 'Best Buy'
                elif 'microcenter' in domain: store = 'Micro Center'
                elif 'bhphotovideo' in domain: store = 'B&H Photo'
                else: store = domain.split('.')[0].capitalize() # Fallback to the website name
                
                # REGEX: Find all prices in the title (e.g., $199.99)
                price_strings = re.findall(r'\$([0-9,]+(?:\.[0-9]{2})?)', title)
                
                current_price = 0
                previous_price = 0
                
                if len(price_strings) >= 2:
                    # If it finds two prices, sort them. The lower is current, higher is previous.
                    parsed_prices = sorted([float(price.replace(',', '')) for price in price_strings])
                    current_price = parsed_prices[0]
                    previous_price = parsed_prices[-1]
                elif len(price_strings) == 1:
                    # If only one price, that's the current price
                    current_price = float(price_strings[0].replace(',', ''))

                deal = {
                    "id": str(uuid.uuid4()),
                    "title": title,
                    "brand": "Various", 
                    "category": category,
                    "store": store,
                    "currentPrice": current_price,
                    "previousPrice": previous_price,
                    "description": f"Trending deal with {upvotes} upvotes! \n\nOriginal title: {title}",
                    "url": p['url']
                }
                deals.append(deal)
            
            with open('deals.json', 'w', encoding='utf-8') as f:
                json.dump(deals, f, indent=2)
                
            print(f"✅ Extracted {len(deals)} TOP deals with prices!")

    except Exception as e:
        print(f"❌ Error fetching deals: {e}")

if __name__ == "__main__":
    fetch_tech_deals()
