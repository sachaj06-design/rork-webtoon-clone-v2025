import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MessageSquare, ChevronLeft, ChevronRight, Heart } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import { MOCK_DATA } from "@/constants/data";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ReaderScreen() {
  const { episodeId, seriesId } = useLocalSearchParams();
  const router = useRouter();
  
  const [controlsVisible, setControlsVisible] = useState(true);

  // Fetch data
  const series = MOCK_DATA.series.find(s => s.id === seriesId);
  const episode = series?.episodes.find(e => e.id === episodeId);
  const episodeIndex = series?.episodes.findIndex(e => e.id === episodeId) ?? -1;
  
  const hasNext = episodeIndex !== -1 && episodeIndex < (series?.episodes.length || 0) - 1;
  const hasPrev = episodeIndex > 0;

  // Mock images for the reader if none provided in mock data
  const images = episode?.images && episode.images.length > 0 
    ? episode.images 
    : [
        "https://images.unsplash.com/photo-1621644833219-c08dc457c126?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1580234550905-40c21dc78690?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
        // Duplicating for length
        "https://images.unsplash.com/photo-1621644833219-c08dc457c126?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000&auto=format&fit=crop",
      ];

  // Auto-hide controls after a few seconds initially
  useEffect(() => {
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const navigateToEpisode = (direction: 'next' | 'prev') => {
    if (!series) return;
    const newIndex = direction === 'next' ? episodeIndex + 1 : episodeIndex - 1;
    if (newIndex >= 0 && newIndex < series.episodes.length) {
      const nextEp = series.episodes[newIndex];
      router.replace({ pathname: '/reader/[episodeId]' as any, params: { episodeId: nextEp.id, seriesId: series.id } });
    }
  };

  const renderImage = ({ item, index }: { item: string, index: number }) => {
    // Determine height based on aspect ratio if real images, but for now fixed high height or auto-width
    // For seamless scroll, we usually know aspect ratio. Assuming generic webtoon slices often fit width.
    // Using a calculated height based on generic webtoon slice aspect ratio (often very tall or standard)
    // Here using a fixed height for demo but `resizeMode="cover"` or "contain" with width=windowWidth.
    // Ideally, `Image.getSize` would be used to calculate exact height to preserve aspect ratio.
    
    // Simplification for prototype: Use specific aspect ratio or just full width.
    return (
      <View style={{ width: SCREEN_WIDTH, height: 600 }}>
        <Image 
          source={{ uri: item }} 
          style={{ width: SCREEN_WIDTH, height: 600 }} 
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footerContainer}>
        <View style={styles.footerContent}>
            <Text style={styles.footerText}>Fin de l&apos;épisode</Text>
            {hasNext ? (
                <TouchableOpacity style={styles.nextEpCircle} onPress={() => navigateToEpisode('next')}>
                     <Text style={styles.nextEpText}>Suite</Text>
                     <Text style={styles.nextEpTimer}>5s</Text>
                </TouchableOpacity>
            ) : (
                <Text style={styles.footerSubText}>Dernier épisode</Text>
            )}
        </View>
        
        <View style={styles.footerActions}>
             <TouchableOpacity style={styles.footerActionBtn}>
                 <Heart color={Colors.textSecondary} size={24} />
                 <Text style={styles.footerActionText}>{episode?.likes || 0}</Text>
             </TouchableOpacity>
        </View>
    </View>
  );

  if (!episode) return <View style={styles.center}><Text>Episode not found</Text></View>;

  return (
    <View style={styles.container}>
      <StatusBar hidden={!controlsVisible} />
      
      {/* Main Content: Tap to toggle controls */}
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={toggleControls} 
        style={styles.touchLayer}
      >
        <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(_, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            // Optimization props
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews={Platform.OS === 'android'}
            contentContainerStyle={{ paddingBottom: 0, margin: 0 }}
        />
      </TouchableOpacity>

      {/* Top Bar */}
      {controlsVisible && (
        <View style={styles.topBar}>
           <SafeAreaView edges={['top']} style={styles.topBarSafe}>
               <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                   <ArrowLeft color={Colors.white} size={24} />
               </TouchableOpacity>
               <Text style={styles.headerTitle} numberOfLines={1}>{episode.title}</Text>
               <View style={{ width: 40 }} /> 
           </SafeAreaView>
        </View>
      )}

      {/* Bottom Bar */}
      {controlsVisible && (
        <View style={styles.bottomBar}>
            <SafeAreaView edges={['bottom']} style={styles.bottomBarSafe}>
                <View style={styles.navRow}>
                    <TouchableOpacity 
                        style={[styles.navBtn, !hasPrev && styles.navBtnDisabled]} 
                        disabled={!hasPrev}
                        onPress={() => navigateToEpisode('prev')}
                    >
                        <ChevronLeft color={hasPrev ? Colors.white : Colors.textSecondary} size={24} />
                        <Text style={[styles.navText, !hasPrev && styles.navTextDisabled]}>Précédent</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.commentBtn}>
                        <MessageSquare color={Colors.white} size={20} />
                        <Text style={styles.commentText}>1.2k</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.navBtn, !hasNext && styles.navBtnDisabled]}
                        disabled={!hasNext}
                        onPress={() => navigateToEpisode('next')}
                    >
                        <Text style={[styles.navText, !hasNext && styles.navTextDisabled]}>Suivant</Text>
                        <ChevronRight color={hasNext ? Colors.white : Colors.textSecondary} size={24} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Reader background usually black or white, depending on theme. Webtoons often default to white for pages but black for UI.
  },
  center: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  touchLayer: {
    flex: 1,
  },
  
  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 10,
  },
  topBarSafe: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    height: Platform.OS === 'ios' ? 100 : 80, 
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 10,
  },
  bottomBarSafe: {
    paddingVertical: 12,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 1,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  navTextDisabled: {
    color: Colors.textSecondary,
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  commentText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Footer Content
  footerContainer: {
      paddingVertical: 40,
      alignItems: 'center',
      backgroundColor: Colors.white,
  },
  footerContent: {
      alignItems: 'center',
      marginBottom: 30,
  },
  footerText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.black,
      marginBottom: 16,
  },
  footerSubText: {
      fontSize: 14,
      color: Colors.textSecondary,
  },
  nextEpCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: Colors.brandGreen,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
  },
  nextEpText: {
      color: Colors.white,
      fontSize: 12,
      fontWeight: 'bold',
  },
  nextEpTimer: {
      color: Colors.white,
      fontSize: 18,
      fontWeight: '900',
  },
  footerActions: {
      flexDirection: 'row',
      gap: 20,
  },
  footerActionBtn: {
      alignItems: 'center',
      gap: 4,
  },
  footerActionText: {
      fontSize: 12,
      color: Colors.textSecondary,
  },
});
