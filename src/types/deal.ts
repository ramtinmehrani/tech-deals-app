export type DealCategory = 'Laptops' | 'Audio' | 'Gaming' | 'PC Components' | 'Smartphones';
export type DealStore = 'Amazon' | 'Best Buy' | 'Newegg';

export interface Deal {
  id: string;
  title: string;
  brand: string;
  category: DealCategory;
  store: DealStore;
  currentPrice: number;
  previousPrice: number;
  description: string;
  url: string;
}

export function percentOff(currentPrice: number, previousPrice: number): number {
  if (previousPrice <= 0) return 0;
  const discount = ((previousPrice - currentPrice) / previousPrice) * 100;
  return Math.round(discount);
}
