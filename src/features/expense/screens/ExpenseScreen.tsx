import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type Expense = {
  id: number;
  category: string;
  amount: number;
};

const db = SQLite.openDatabase({ name: 'expenses.db', location: 'default' });

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];

export default function ExpenseScreen() {
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState(categories[0]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL)',
      );
    });
    fetchExpenses();
  }, []);

  const addExpense = () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Invalid amount');
      return;
    }
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO expenses (category, amount) VALUES (?, ?)',
        [category, parseFloat(amount)],
        () => fetchExpenses(),
      );
    });
    setAmount('');
  };

  const fetchExpenses = () => {
    db.transaction((tx: any) => {
      tx.executeSql('SELECT * FROM expenses', [], (tx: any, results: any) => {
        const rows = results.rows;
        let data: Expense[] = [];
        for (let i = 0; i < rows.length; i++) {
          data.push(rows.item(i));
        }
        setExpenses(data);
      });
    });
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
        <Button title="Add" onPress={addExpense} />
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
    marginVertical: 8,
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
});
