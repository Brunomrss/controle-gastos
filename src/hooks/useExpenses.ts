import { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseFilters, Category, PaymentMethod } from '@/types/expense';

const STORAGE_KEY = 'expenses-data';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setExpenses(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading expenses:', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save expenses to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, isLoading]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id
          ? { ...expense, ...updates, updatedAt: new Date().toISOString() }
          : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      if (filters.startDate && new Date(filters.startDate) > expenseDate) return false;
      if (filters.endDate && new Date(filters.endDate) < expenseDate) return false;
      if (filters.month !== undefined && expenseDate.getMonth() !== filters.month) return false;
      if (filters.year !== undefined && expenseDate.getFullYear() !== filters.year) return false;
      if (filters.category && expense.category !== filters.category) return false;
      if (filters.subcategory && expense.subcategory !== filters.subcategory) return false;
      if (filters.paymentMethod && expense.paymentMethod !== filters.paymentMethod) return false;
      if (filters.card && expense.card !== filters.card) return false;

      return true;
    });
  }, [expenses, filters]);

  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.value, 0);
    const count = filteredExpenses.length;
    const average = count > 0 ? total / count : 0;

    // By category
    const byCategory = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.value;
      return acc;
    }, {} as Record<Category, number>);

    // By payment method
    const byPaymentMethod = filteredExpenses.reduce((acc, exp) => {
      acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.value;
      return acc;
    }, {} as Record<PaymentMethod, number>);

    // By card
    const byCard = filteredExpenses.reduce((acc, exp) => {
      if (exp.card) {
        acc[exp.card] = (acc[exp.card] || 0) + exp.value;
      }
      return acc;
    }, {} as Record<string, number>);

    // By date (for line chart)
    const byDate = filteredExpenses.reduce((acc, exp) => {
      const date = exp.date.split('T')[0];
      acc[date] = (acc[date] || 0) + exp.value;
      return acc;
    }, {} as Record<string, number>);

    // Top category
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // Daily average (based on unique days)
    const uniqueDays = new Set(filteredExpenses.map((exp) => exp.date.split('T')[0])).size;
    const dailyAverage = uniqueDays > 0 ? total / uniqueDays : 0;

    return {
      total,
      count,
      average,
      dailyAverage,
      byCategory,
      byPaymentMethod,
      byCard,
      byDate,
      topCategory: topCategory ? { category: topCategory[0] as Category, value: topCategory[1] } : null,
    };
  }, [filteredExpenses]);

  const uniqueCards = useMemo(() => {
    return [...new Set(expenses.filter((e) => e.card).map((e) => e.card!))];
  }, [expenses]);

  const clearFilters = () => {
    setFilters({});
  };

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    stats,
    filters,
    setFilters,
    clearFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    uniqueCards,
    isLoading,
  };
}
