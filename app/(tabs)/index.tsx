import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function DealsListScreen() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ramtinmehrani/tech-deals-app/main/deals.json')
      .then(res => res.json())
      .then(data => {
        setDeals(data);
        setLoading(false);
      });
  }, []);

  const calculateDiscount = (curr, prev) => {
    if (!prev || prev <= curr) return null;
    return Math.round(((prev - curr) / prev) * 100);
  };

  if (loading) return (
    <View style={styles.center}><ActivityIndicator size="large" color="#3b82f6" /></View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Live Tech Deals', headerStyle: {backgroundColor: '#000'}, headerTintColor: '#fff' }} />
      <FlatList
        data={deals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const discount = calculateDiscount(item.currentPrice, item.previousPrice);
          return (
            <Link href={`/deal/${item.id}`} asChild>
              <Pressable style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.store}>{item.store}</Text>
                  {discount && <View style={styles.badge}><Text style={styles.badgeText}>{discount}% OFF</Text></View>}
                </View>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>${item.currentPrice.toFixed(2)}</Text>
                  {item.previousPrice > 0 && <Text style={styles.oldPrice}>${item.previousPrice.toFixed(2)}</Text>}
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
  container: { flex: 1, backgroundColor: '#000', padding: 10 },
  center: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#111', padding: 15, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  store: { color: '#888', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  badge: { backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  title: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  price: { color: '#22c55e', fontSize: 22, fontWeight: 'bold' },
  oldPrice: { color: '#666', fontSize: 14, textDecorationLine: 'line-through' }
});
