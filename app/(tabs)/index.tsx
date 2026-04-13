import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Deal, percentOff } from '../../src/types/deal';

export default function DealsListScreen() {
  const [liveDeals, setLiveDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We will update YOUR_USERNAME once your GitHub repo is live!
    const GITHUB_URL = 'https://raw.githubusercontent.com/YOUR_USERNAME/tech-deals-app/main/deals.json';
    
    fetch(GITHUB_URL)
      .then((response) => response.json())
      .then((data) => {
        setLiveDeals(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Waiting for GitHub repo to go live...");
        setIsLoading(false);
      });
  }, []);

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
      <Text style={styles.headerTitle}>Live Tech Deals</Text>
      <FlatList
        data={liveDeals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Link href={`/deal/${item.id}`} asChild>
            <Pressable style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.storeBadge}>{item.store}</Text>
                {item.previousPrice > 0 && (
                  <Text style={styles.discountBadge}>
                    {percentOff(item.entPrice, item.previousPrice)}% OFF
                  </Text>
                )}
              </View>
              
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              
              <View style={styles.priceContainer}>
                {item.currentPrice > 0 ? (
                  <Text style={styles.currentPrice}>${item.currentPrice.toFixed(2)}</Text>
                ) : (
                  <Text style={styles.currentPrice}>See site for price</Text>
                )}
              </View>
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Waiting for live data!</Text>
            <Text style={styles.emptySubText}>Push your code to GitHub to trigger the scraper.</Text>
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
  emptyContainer: { alignItems: 'center', marginTop: 40, padding: 20 },
  emptyText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  emptySubText: { color: '#a1a1aa', textAlign: 'center', marginTop: 8 },
  headerTitle: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 20 },
  listContainer: { padding: 16, gap: 16 },
  card: { backgroundColor: '#1c1c1e', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#2c2c2e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  storeBadge: { color: '#a1a1aa', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  discountBadge: { backgroundColor: '#ef4444', color: '#ffffff', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' },
  title: { color: '#ffffff', fontSize: 16, fontWeight: '500', marginBottom: 12, lineHeight: 22 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currentPrice: { color: '#10b981', fontSize: 20, fontWeight: 'bold' },
  previousPrice: { color: '#71717a', fontSize: 14, textDecorationLine: 'line-through' },
});
