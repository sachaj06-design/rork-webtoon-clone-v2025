import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { ArrowLeft, Share, MoreVertical, Heart } from "lucide-react-native";

import { Colors, Layout } from "@/constants/colors";
import { MOCK_DATA } from "@/constants/data";

export default function SeriesDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Find series data
  const series = MOCK_DATA.series.find((s) => s.id === id) || MOCK_DATA.series[0];
  
  const [subscribed, setSubscribed] = useState(MOCK_DATA.user_state.subscribed_series.includes(series.id));

  // In a real app, we would fetch episodes. Using mock data.
  // Reverse episodes to show latest first or adhering to the specific instruction:
  // "Liste verticale inversée (du #1 au plus récent)." -> Wait, "du #1 au plus récent" means #1, #2, #3.
  // Usually webtoons show #1 at the bottom if it's "reversed", but standard list is often Top=Newest or Top=Oldest.
  // Prompt says: "Liste verticale inversée (du #1 au plus récent)." 
  // This phrasing "inversée" usually suggests Newest First in blog contexts, but "(du #1 au plus récent)" literally means 1, 2, 3...
  // Let's stick to 1, 2, 3 as per "du #1 au plus récent".
  
  const episodes = series.episodes || [];

  return (
    <View style={styles.container}>
      {/* Custom Header Back Button */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.headerActions}>
         <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
           <ArrowLeft color={Colors.white} size={24} />
         </TouchableOpacity>
         <View style={{ flex: 1 }} />
         <TouchableOpacity style={styles.iconButton}>
           <Share color={Colors.white} size={24} />
         </TouchableOpacity>
         <TouchableOpacity style={styles.iconButton}>
           <MoreVertical color={Colors.white} size={24} />
         </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Parallax/Blur Header Background */}
        <View style={styles.headerBackgroundContainer}>
          <Image 
            source={{ uri: series.hero_url }} 
            style={styles.headerBackgroundImage}
            blurRadius={Platform.OS === 'ios' ? 10 : 5}
          />
          <View style={styles.headerOverlay} />
        </View>

        {/* Info Block */}
        <View style={styles.infoBlock}>
            <View style={styles.thumbnailContainer}>
                <Image source={{ uri: series.thumbnail_url }} style={styles.thumbnail} />
            </View>
            <Text style={styles.title}>{series.title}</Text>
            <Text style={styles.author}>{series.author}</Text>
            <View style={styles.ratingContainer}>
                <View style={styles.starsRow}>
                   <Text style={styles.ratingStar}>★</Text>
                   <Text style={styles.ratingText}>{series.rating}</Text>
                </View>
                <Text style={styles.genreText}>{series.genre}</Text>
            </View>
            <Text style={styles.description} numberOfLines={3}>{series.description}</Text>
            
            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                    style={[styles.subscribeButton, subscribed && styles.subscribedButton]}
                    onPress={() => setSubscribed(!subscribed)}
                >
                    <Text style={[styles.subscribeText, subscribed && styles.subscribedText]}>
                        {subscribed ? "Abonné" : "+ S'abonner"}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.readButton}
                    onPress={() => {
                        if (episodes.length > 0) {
                             router.push({ pathname: '/reader/[episodeId]', params: { episodeId: episodes[0].id, seriesId: series.id } });
                        }
                    }}
                >
                    <Text style={styles.readButtonText}>Lire le 1er épisode</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.separator} />

        {/* Episodes List */}
        <View style={styles.episodesList}>
             <View style={styles.listHeader}>
                 <Text style={styles.listTitle}>Épisodes</Text>
                 <Text style={styles.sortText}>#1 au plus récent</Text>
             </View>

             {episodes.map((episode) => {
                 const isRead = MOCK_DATA.user_state.read_history.includes(episode.id);
                 return (
                 <TouchableOpacity 
                    key={episode.id} 
                    style={styles.episodeRow}
                    onPress={() => router.push({ pathname: '/reader/[episodeId]', params: { episodeId: episode.id, seriesId: series.id } })}
                 >
                     <Image source={{ uri: episode.thumbnail_url }} style={styles.episodeThumb} />
                     <View style={styles.episodeInfo}>
                         <Text style={[styles.episodeTitle, isRead && { color: Colors.textSecondary }]}>{episode.title}</Text>
                         <Text style={styles.episodeDate}>{episode.upload_date}</Text>
                     </View>
                     <View style={styles.episodeLike}>
                         <Heart size={14} color={Colors.textSecondary} />
                         <Text style={styles.likeCount}>{episode.likes}</Text>
                     </View>
                 </TouchableOpacity>
             )})}
             
             {episodes.length === 0 && (
                 <View style={styles.emptyState}>
                     <Text style={styles.emptyText}>Aucun épisode disponible pour le moment.</Text>
                 </View>
             )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundMain,
  },
  headerActions: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  iconButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerBackgroundContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
  },
  headerBackgroundImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  infoBlock: {
    marginTop: -60, // Overlap the header
    alignItems: 'center',
    paddingHorizontal: Layout.globalPadding,
  },
  thumbnailContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: Layout.cardRadius,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    color: Colors.brandGreen,
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
  },
  genreText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  subscribeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.surfaceGrey,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  subscribedButton: {
    backgroundColor: Colors.surfaceGrey,
  },
  subscribeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  subscribedText: {
    color: Colors.textSecondary,
  },
  readButton: {
    flex: 2, // Wider
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.brandGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  separator: {
    height: 8,
    backgroundColor: Colors.surfaceGrey,
    width: '100%',
  },
  episodesList: {
    width: '100%',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Layout.globalPadding,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceGrey,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  episodeRow: {
    flexDirection: 'row',
    padding: Layout.globalPadding,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceGrey,
  },
  episodeThumb: {
    width: 80,
    height: 60,
    borderRadius: Layout.cardRadius,
    backgroundColor: Colors.surfaceGrey,
    marginRight: 12,
  },
  episodeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  episodeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  episodeDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  episodeLike: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  likeCount: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  emptyState: {
      padding: 40,
      alignItems: 'center',
  },
  emptyText: {
      color: Colors.textSecondary,
  },
});
