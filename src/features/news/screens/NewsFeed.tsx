import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import useFeeds from '../hooks/useFeeds';

const NewsFeed = () => {
  const { feeds, loading, hasMore, loadFeeds, clearFeedsFromStorage } =
    useFeeds();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeeds(true);
  }, []);

  const handleRefresh = async () => {
    clearFeedsFromStorage();
    setRefreshing(true);
    await loadFeeds(true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadFeeds();
    }
  };

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; body: string };
  }) => (
    <View style={styles.feedItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          loading && !refreshing ? <ActivityIndicator /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feedItem: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },

  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 16,
  },
});

export default NewsFeed;
