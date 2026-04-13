import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Deal, percentOff } from '../../src/types/deal';

export default function DealsListScreen() {
  const [liveDeals, setLiveDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // New State for Filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeStore, setActiveStore] = useState<string>('All');

  useEffect(() => {
    // Your live GitHub URL
    const GITHUB_URL = 'https://raw.githubusercontent.com/ramtinmehrani/tech-deals-app/main/deals.json';
    
    fetch(GITHUB_URL)
      .then((response) => response.json())
      .then((data) => {
        setLiveDeals(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching live deals:", error);
        setIsLoading(false);
      });
  }, []);

  // Dynamically extract unique categories and stores from your live data
  const categories = useMemo(() => ['All', ...new Set(liveDeals.map(d => d.category))], [liveDeals]);
  const stores = useMemo(() => ['All', ...new Set(liveDeals.map(d => d.store))], [liveDeals]);

  // Filter the deals based on what is selected
  const filteredDeals = useMemo(() => {
    return liveDeals.filter(deal => {
      const matchesCategory = activeCategory === 'All' || deal.category === activeCategory;
      const matchesStore = activeStore === 'All' || deal.store === activeStore;
      return matchesCategory && matchesStore;
    });
  }, [liveDeals, activeCategory, activeStore]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Hunting for live deals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Live Tech Deals</Text>
        
        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map((cat) => (
            <Pressable 
              key={`cat-${cat}`} 
              style={[styles.pill, activeCategory === cat && styles.pillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Store Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.filterScroll, { paddingBottom: 16 }]}>
          {stores.map((store) => (
            <Pressable 
              key={`store-${store}`} 
              style={[styles.pill, styles.pillStore, activeStore === store && styles.pillActive]}
              onPress={() => setActiveStore(store)}
            >
              <Text style={[styles.pillText, activeStore === store && styles.pillTextActive]}>{store}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={`/deal/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.storeBadge}>{item.store}</Text>
                {item.previousPrice > 0 && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {percentOff(item.currentPrice, item.previousPrice)}% OFF
                    </Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.priceFooter}>
                <View style={styles.priceContainer}>
                  {item.currentPrice > 0 ? (
                    <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)}</Text>
                  ) : (
                    <Text style={styles.currentPrice}>See site for price</Text>
                  )}
                  {item.previousPrice > 0 && (
                    <Text style={styles.previousPrice}>${item.previousPrice.toFixed(2)}</Text>
                  )}
                </View>
                <Text style={styles.viewDealText}>View Deal →</Text>
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No deals found for these filters.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0c' },
  centerContent: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#a1a1aa', marginTop: 16, fontSize: 16 },
  header: { backgroundColor: '#0b0b0c', borderBottomWidth: 1, borderBottomColor: '#27272a' },
  headerTitle: { color: '#ffffff', fontSize: 28, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  filterScroll: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#27272a', borderWidth: 1, borderColor: '#3f3f46' },
  pillStore: { backgroundColor: '#18181b', borderRadius: 8 },
  pillActive: { backgroundColor: '#3b82f6', borderColor: '#60a5fa' },
  pillText: { color: '#d4d4d8', fontSize: 14, fontWeight: '600' },
  pillTextActive: { color: '#ffffff' },
  emptyContainer: { alignItems: 'center', marginTop: 40, padding: 20 },
  emptyText: { color: '#a1a1aa', fontSize: 16 },
  listContainer: { padding: 16, gap: 16 },
  card: { backgroundColor: '#1c1c1e', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#2c2c2e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  storeBadge: { color: '#a1a1aa', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  discountBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  discountText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#ffffff', fontSize: 17, fontWeight: '600', marginBottom: 16, lineHeight: 24 },
  priceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
  priceContainer: { flexDirection: 'column', gap: 2 },
  currentPrice: { color: '#10b981', fontSize: 24, fontWeight: 'bold' },
  previousPrice: { color: '#71717a', fontSize: 14, textDecorationLine: 'line-through' },
  viewDealText: { color: '#3b82f6', fontSize: 14, fontWeight: '600' }
});
