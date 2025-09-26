import { useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';
import { Expense } from '../types/apiTypes';

const db = SQLite.openDatabase({ name: 'expenses.db', location: 'default' });

export function useDatabase(categories: string[]) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, category TEXT, amount REAL)',
      );
    });
    fetchExpenses();
  }, []);

  const addExpense = (category: string, amount: string) => {
    if (!amount || isNaN(Number(amount))) {
      return false;
    }
    db.transaction((tx: any) => {
      tx.executeSql(
        'INSERT INTO expenses (category, amount) VALUES (?, ?)',
        [category, parseFloat(amount)],
        () => fetchExpenses(),
      );
    });
    return true;
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

  return {
    expenses,
    addExpense,
    fetchExpenses,
  };
}
