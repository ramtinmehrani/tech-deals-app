import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { deals } from '../../src/data/deals';
import { percentOff } from '../../src/types/deal';

export default function DealDetailScreen() {
  const { id } = useLocalSearchParams();
  const dealId = String(id);
  const deal = deals.find((d) => d.id === dealId);

  if (!deal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Deal not found.</Text>
      </View>
    );
  }

  const handleOpenStore = async () => {
    try {
      const supported = await Linking.canOpenURL(deal.url);
      if (supported) await Linking.openURL(deal.url);
      else Alert.alert("Error", "Cannot open this URL");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const discount = percentOff(deal.currentPrice, deal.previousPrice);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: deal.title.substring(0, 20) + '...', headerStyle: { backgroundColor: '#0b0b0c' }, headerTintColor: '#ffffff' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerTags}>
          <Text style={styles.tag}>{deal.store}</Text>
          <Text style={styles.tag}>{deal.category}</Text>
        </View>
        <Text style={styles.title}>{deal.title}</Text>
        <Text style={styles.brand}>by {deal.brand}</Text>
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.currentPrice}>${deal.currentPrice.toFixed(2)}</Text>
            <Text style={styles.previousPrice}>MSRP: ${deal.previousPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.discountBubble}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        </View>
        <Text style={styles.sectionTitle}>About this item</Text>
        <Text style={styles.description}>{deal.description}</Text>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleOpenStore} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Open Store Page</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0c' },
  errorContainer: { flex: 1, backgroundColor: '#0b0b0c', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#ef4444', fontSize: 18 },
  scrollContent: { padding: 20 },
  headerTags: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: '#27272a', color: '#d4d4d8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, fontSize: 12, fontWeight: '600', overflow: 'hidden' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', lineHeight: 32, marginBottom: 8 },
  brand: { color: '#a1a1aa', fontSize: 16, marginBottom: 24 },
  priceCard: { backgroundColor: '#1c1c1e', borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderWidth: 1, borderColor: '#2c2c2e' },
  currentPrice: { color: '#10b981', fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  previousPrice: { color: '#71717a', fontSize: 16, textDecorationLine: 'line-through' },
  discountBubble: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  discountText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600', marginBottom: 12 },
  description: { color: '#d4d4d8', fontSize: 16, lineHeight: 24 },
  footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#27272a', backgroundColor: '#0b0b0c' },
  button: { backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});
