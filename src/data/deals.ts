import { Deal } from '../types/deal';

export const deals: Deal[] = [
  {
    id: '1',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    brand: 'Sony',
    category: 'Audio',
    store: 'Amazon',
    currentPrice: 298.00,
    previousPrice: 399.99,
    description: 'Industry leading noise canceling with two processors controlling 8 microphones for unprecedented noise canceling.',
    url: 'https://www.amazon.com/'
  },
  {
    id: '2',
    title: 'Apple MacBook Air M2 (2022) - 8GB RAM, 256GB SSD',
    brand: 'Apple',
    category: 'Laptops',
    store: 'Best Buy',
    currentPrice: 899.00,
    previousPrice: 1099.00,
    description: 'Strikingly thin design. Supercharged by M2. Up to 18 hours of battery life.',
    url: 'https://www.bestbuy.com/'
  },
  {
    id: '3',
    title: 'AMD Ryzen 7 7800X3D 8-Core Desktop Processor',
    brand: 'AMD',
    category: 'PC Components',
    store: 'Newegg',
    currentPrice: 369.00,
    previousPrice: 449.00,
    description: 'The ultimate gaming processor, with AMD 3D V-Cache technology for even more game performance.',
    url: 'https://www.newegg.com/'
  }
];
