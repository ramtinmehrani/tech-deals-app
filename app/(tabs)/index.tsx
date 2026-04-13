import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function DealsListScreen() {
  const [liveDeals, setLiveDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStore, setActiveStore] = useState('All');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ramtinmehrani/tech-deals-app/main/deals.json')
      .then((res) => res.json())
      .then((data) => {
        setLiveDeals(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const categories = useMemo(() => ['All', ...new Set(liveDeals.map(d => d.category))], [liveDeals]);
  const stores = useMemo(() => ['All', ...new Set(liveDeals.map(d => d.store))], [liveDeals]);

  const filteredDeals = useMemo(() => {
    return liveDeals.filter(deal => {
      const matchesCategory = activeCategory === 'All' || deal.category === activeCategory;
      const matchesStore = activeStore === 'All' || deal.store === activeStore;
      return matchesCategory && matchesStore;
    });
  }, [liveDeals, activeCategory, activeStore]);

  const getDiscount = (curr, prev) => {
    if (!prev || prev <= curr) return null;
    return Math.round(((prev - curr) / prev) * 100);
  };

  if (isLoading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Live Tech Deals', headerStyle: {backgroundColor: '#0b0b0c'}, headerTintColor: '#fff' }} />
      
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {categories.map(cat => (
            <Pressable key={cat} onPress={() => setActiveCategory(cat)} 
              style={[styles.pill, activeCategory === cat && styles.pillActive]}>
              <Text style={[styles.pillText, activeCategory === cat && styles.pillTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {stores.map(s => (
            <Pressable key={s} onPress={() => setActiveStore(s)} 
              style={[styles.pill, styles.pillStore, activeStore === s && styles.pillActive]}>
              <Text style={[styles.pillText, activeStore === s && styles.pillTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => {
          const discount = getDiscount(item.currentPrice, item.previousPrice);
          return (
            <Link href={`/deal/${item.id}`} asChild>
              <Pressable style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.storeBadge}>{item.store}</Text>
                  {discount && <View style={styles.discountBadge}><Text style={styles.discountText}>{discount}% OFF</Text></View>}
                </View>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.priceFooter}>
                  <View>
                    <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)}</Text>
                    {item.previousPrice > 0 && <Text style={styles.oldPrice}>${item.previousPrice.toFixed(2)}</Text>}
                  </View>
                  <Text style={styles.viewLink}>View Deal →</Text>
                </View>
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0c' },
  center: { flex: 1, backgroundColor: '#0b0b0c', justifyContent: 'center', alignItems: 'center' },
  filterSection: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#27272a' },
  filterScroll: { paddingHorizontal: 15, gap: 8, marginBottom: 8 },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#27272a' },
  pillStore: { backgroundColor: '#18181b', borderRadius: 8 },
  pillActive: { backgroundColor: '#3b82f6' },
  pillText: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  card: { backgroundColor: '#1c1c1e', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2c2c2e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  storeBadge: { color: '#71717a', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  discountBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#ef4444' },
  discountText: { color: '#ef4444', fontSize: 12, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 16, lineHeight: 22 },
  priceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  currentPrice: { color: '#10b981', fontSize: 24, fontWeight: 'bold' },
  oldPrice: { color: '#52525b', fontSize: 14, textDecorationLine: 'line-through' },
  viewLink: { color: '#3b82f6', fontSize: 14, fontWeight: '600' }
});
