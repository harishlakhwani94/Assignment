import { useState, useCallback } from 'react';
import { fetchFeeds } from '../services/feedService';
import { StorageService } from '../../../app/services/storageService';
import { Feed } from '../types/feedType';
const PAGE_SIZE = 10;

const useFeeds = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadFeeds = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      const nextPage = reset ? 1 : page;
      if (nextPage === 1) {
        const cachedFeeds = await StorageService.getFeeds();
        if (cachedFeeds) {
          setFeeds(cachedFeeds);
          setHasMore(cachedFeeds.length === PAGE_SIZE);
          setPage(2);
          setLoading(false);
          return;
        }
      }

      const data = await fetchFeeds(nextPage, PAGE_SIZE);
      setFeeds(prevFeeds => (reset ? data : [...prevFeeds, ...data]));
      if (nextPage === 1) {
        await StorageService.storeFeeds(data);
      }
      setHasMore(data.length === PAGE_SIZE);
      setPage(prevPage => (reset ? 2 : prevPage + 1));
      setLoading(false);
    },
    [page, loading],
  );

  const clearFeedsFromStorage = useCallback(async () => {
    await StorageService.removeFeeds();
  }, []);

  return { feeds, loading, hasMore, loadFeeds, clearFeedsFromStorage };
};

export default useFeeds;
