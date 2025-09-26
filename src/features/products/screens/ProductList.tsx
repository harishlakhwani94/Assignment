import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct';
import { Product, Category } from '../types/apiTypes';
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

const numColumns = 2;
const { width } = Dimensions.get('window');

const ProductList = () => {
  const {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    products,
    getCategories,
    getProducts,
    hasMore,
  } = useProduct();
  const [loading, setLoading] = useState(false);
  const [reset, setReset] = useState(false);
  const numColumns = 2;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts(reset);
  }, [search, category]);

  const getItemLayout = (
    data: ArrayLike<any> | null | undefined,
    index: number,
  ) => ({
    length: width / numColumns,
    offset: (width / numColumns) * index,
    index,
  });

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </View>
  );

  const handleEndReached = async () => {
    if (!hasMore) return;
    getProducts();
  };

  const categorySelected = (item: Category) => {
    setReset(true);
    setCategory(item.slug);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryBtn,
        category === item.slug && styles.categoryBtnActive,
      ]}
      onPress={() => categorySelected(item)}
    >
      <Text
        style={[
          styles.categoryText,
          category === item.slug && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
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
        keyExtractor={item => item.slug}
        renderItem={renderCategory}
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
        style={styles.productList}
        ListFooterComponent={
          loading ? <ActivityIndicator style={{ margin: 16 }} /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    marginBottom: 16,
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
