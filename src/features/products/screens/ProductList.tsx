import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

const PRODUCT_API = 'https://dummyjson.com/products';
const CATEGORY_API = 'https://dummyjson.com/products/categories';
const PAGE_LIMIT = 12;
const numColumns = 2;
const { width } = Dimensions.get('window');

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('beauty');
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetch(CATEGORY_API)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(
    async (reset = false) => {
      setLoading(true);
      let url = `${PRODUCT_API}?limit=${PAGE_LIMIT}&skip=${reset ? 0 : skip}`;
      if (search) url += `&q=${encodeURIComponent(search)}`;
      if (category)
        url = `https://dummyjson.com/products/category/${category}?limit=${PAGE_LIMIT}&skip=${
          reset ? 0 : skip
        }`;
      const res = await fetch(url);
      const data = await res.json();
      let newProducts = reset ? data.products : [...products, ...data.products];
      setProducts(newProducts);
      setHasMore(newProducts.length < data.total ? true : false);
      setLoading(false);
      setSkip(reset ? PAGE_LIMIT : skip + PAGE_LIMIT);
    },
    [search, category, skip, products],
  );

  useEffect(() => {
    fetchProducts(true);
  }, [search, category]);

  // Infinite scroll
  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchProducts();
    }
  };

  // FlatList optimization
  const getItemLayout = (
    data: ArrayLike<any> | null | undefined,
    index: number,
  ) => ({
    length: width / numColumns,
    offset: (width / numColumns) * index,
    index,
  });

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={categories}
        horizontal
        keyExtractor={item => item.slug.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryBtn,
              category === item.slug && styles.categoryBtnActive,
            ]}
            onPress={() => setCategory(item.slug)}
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      />
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        initialNumToRender={8}
        removeClippedSubviews={true}
        getItemLayout={getItemLayout}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 16,
    gap: 16,
  },
  search: {
    marginHorizontal: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'pink',
  },
  categoryList: {
    paddingHorizontal: 16,
    height: 44,
  },
  categoryBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    height: 36,
  },
  categoryBtnActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    color: '#333',
    fontWeight: 'bold',
  },
  productList: {
    backgroundColor: 'yellow',
  },
  productCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: width / numColumns - 24,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProductList;
