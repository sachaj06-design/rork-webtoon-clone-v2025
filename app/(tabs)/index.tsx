import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Heart } from "lucide-react-native";

import { Colors, Layout } from "@/constants/colors";
import { MOCK_DATA } from "@/constants/data";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CAROUSEL_HEIGHT = SCREEN_HEIGHT * 0.45;

export default function HomeScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Tendance");
  const scrollRef = useRef<ScrollView>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Auto-scroll hero
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % 3); // Assuming 3 hero items for now from mock data or just cycling
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const featuredSeries = MOCK_DATA.series.slice(0, 3);
  const rankingSeries = MOCK_DATA.series.sort((a, b) => a.rank - b.rank);
  const recommendedSeries = MOCK_DATA.series; // Just using all for grid

  const renderHero = () => {
    // Just using the first series as the hero for demo, or cycling through them
    const heroItem = featuredSeries[heroIndex % featuredSeries.length];
    
    if (!heroItem) return null;

    return (
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: heroItem.hero_url }} 
          style={styles.heroImage} 
          resizeMode="cover" 
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <Text style={styles.heroGenre}>{heroItem.genre}</Text>
            <Text style={styles.heroTitle} numberOfLines={2}>{heroItem.title}</Text>
            <TouchableOpacity 
              style={styles.heroButton}
              onPress={() => router.push(`/series/${heroItem.id}`)}
            >
              <Text style={styles.heroButtonText}>Lire maintenant</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderStickyHeader = () => (
    <View style={styles.stickyHeader}>
      {["Tendance", "Populaire", "Nouveauté"].map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[
            styles.tabItem,
            activeTab === tab && styles.tabItemActive
          ]}
        >
          <Text style={[
            styles.tabText,
            activeTab === tab && styles.tabTextActive
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRankingRail = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Classement</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rankingList}>
        {rankingSeries.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.rankingCard}
            onPress={() => router.push(`/series/${item.id}`)}
          >
            <View style={styles.rankingImageContainer}>
              <Image source={{ uri: item.thumbnail_url }} style={styles.rankingImage} />
              <Text style={styles.rankingNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.rankingTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.rankingAuthor} numberOfLines={1}>{item.author}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderGrid = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Recommandés pour vous</Text>
      <View style={styles.gridContainer}>
        {recommendedSeries.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.gridItem}
            onPress={() => router.push(`/series/${item.id}`)}
          >
            <Image source={{ uri: item.thumbnail_url }} style={styles.gridImage} />
            <Text style={styles.gridTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.gridAuthor} numberOfLines={1}>{item.author}</Text>
            <View style={styles.gridMeta}>
              <Heart size={12} color={Colors.brandGreen} fill={Colors.brandGreen} />
              <Text style={styles.gridRating}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]} 
        scrollEventThrottle={16}
      >
        {renderHero()}
        {renderStickyHeader()}
        {renderRankingRail()}
        {renderGrid()}
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMain,
  },
  // Hero
  heroContainer: {
    height: CAROUSEL_HEIGHT,
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: Layout.globalPadding,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroGenre: {
    color: Colors.brandGreen,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 34,
  },
  heroButton: {
    backgroundColor: Colors.brandGreen,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Sticky Header
  stickyHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundMain,
    paddingVertical: 12,
    paddingHorizontal: Layout.globalPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceGrey,
    justifyContent: 'space-around',
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tabItemActive: {
    backgroundColor: Colors.black,
  },
  tabText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.white,
  },

  // Sections
  sectionContainer: {
    marginTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900', // Heavy/Black
    color: Colors.black,
    paddingHorizontal: Layout.globalPadding,
    marginBottom: 16,
  },
  
  // Ranking
  rankingList: {
    paddingHorizontal: Layout.globalPadding,
    gap: 16,
  },
  rankingCard: {
    width: 120,
    marginRight: 8,
  },
  rankingImageContainer: {
    position: 'relative',
    marginBottom: 8,
    width: 120,
    height: 160,
  },
  rankingImage: {
    width: '100%',
    height: '100%',
    borderRadius: Layout.cardRadius,
    backgroundColor: Colors.surfaceGrey,
  },
  rankingNumber: {
    position: 'absolute',
    bottom: -20,
    left: -10,
    fontSize: 60,
    fontWeight: '900',
    color: Colors.black,
    textShadowColor: Colors.white,
    textShadowOffset: { width: -1, height: -1 },
    textShadowRadius: 1, // Outline simulation
    elevation: 5,
    zIndex: 10,
    // Note: react-native text stroke is not fully supported without SVG or complex tricks.
    // Using simple shadow or color for now.
    // Making it just big black number for simplicity and robustness.
  },
  rankingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  rankingAuthor: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Grid
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Layout.globalPadding,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '31%', // 3 columns
    marginBottom: 20,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Layout.cardRadius,
    marginBottom: 6,
    backgroundColor: Colors.surfaceGrey,
  },
  gridTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 18,
    marginBottom: 2,
  },
  gridAuthor: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  gridRating: {
    fontSize: 11,
    color: Colors.brandGreen,
    fontWeight: 'bold',
  },
});
