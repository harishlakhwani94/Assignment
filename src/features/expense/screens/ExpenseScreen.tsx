import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useDatabase } from '../hooks/useDatabase';
import useAuth from '../../auth/hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { Expense } from '../types/apiTypes';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

export default function ExpenseScreen() {
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState(categories[0]);
  const { expenses, addExpense } = useDatabase(categories);
  const { authenticated, checkAuth } = useAuth();
  const navigation = useNavigation();
  const openLogin = useCallback(() => {
    navigation.navigate('Login' as never);
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      checkAuth();
    }, [checkAuth]),
  );

  const handleAddExpense = () => {
    if (!addExpense(category, amount)) {
      Alert.alert('Invalid amount');
      return;
    }
    setAmount('');
  };

  const pieData = categories
    .map(cat => {
      const total = expenses
        .filter(e => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        name: cat,
        amount: total,
        color: getColor(cat),
        legendFontColor: '#333',
        legendFontSize: 14,
      };
    })
    .filter(d => d.amount > 0);

  function getColor(cat: string) {
    const colors: Record<string, string> = {
      Food: '#FF6384',
      Transport: '#36A2EB',
      Shopping: '#FFCE56',
      Bills: '#4BC0C0',
      Other: '#9966FF',
    };
    return colors[cat] || '#ccc';
  }

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Do Login for checking your expenses
        </Text>
        <TouchableOpacity style={styles.button} onPress={openLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Expense</Text>
      <View style={styles.row}>
        <Text>Category:</Text>
        <FlatList
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <Button
              title={item}
              onPress={() => setCategory(item)}
              color={category === item ? '#000' : '#888'}
            />
          )}
          keyExtractor={item => item}
        />
      </View>
      <View style={styles.row}>
        <Text>Amount:</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Button title="Add" onPress={handleAddExpense} />
      </View>
      <PieChart
        data={pieData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          color: () => '#333',
        }}
        accessor={'amount'}
        backgroundColor={'transparent'}
        paddingLeft={'15'}
        absolute
      />
      <Text style={styles.header}>Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item: Expense) => item.id.toString()}
        renderItem={({ item }: { item: Expense }) => (
          <View style={styles.expenseItem}>
            <Text>{item.category}</Text>
            <Text>${item.amount.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
    minWidth: 80,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  instruction: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 32,
    marginTop: 200,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: 120,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
