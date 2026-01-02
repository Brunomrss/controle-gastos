import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Expense, ExpenseFilters, Category, PaymentMethod, ExpenseInsert } from '@/types/expense';
import {
  fetchExpenses,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} from '@/services/expenses';

export function useExpenses() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ExpenseFilters>({});

  // 🔹 Buscar despesas do Supabase
  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  // 🔹 Criar
  const addExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 🔹 Atualizar
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Expense> }) =>
      updateExpenseById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 🔹 Deletar
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpenseById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  // 🔹 API compatível com seu Index atual
  const addExpense = (expense: ExpenseInsert) => {
    addExpenseMutation.mutate(expense);
  };

  const updateExpense = (
    id: string,
    updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
  ) => {
    updateExpenseMutation.mutate({ id, data: updates });
  };

  const deleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  // 🔹 Filtros (mantido)
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

  // 🔹 Estatísticas (mantido)
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.value, 0);
    const count = filteredExpenses.length;
    const average = count > 0 ? total / count : 0;

    const byCategory = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.value;
      return acc;
    }, {} as Record<Category, number>);

    const byPaymentMethod = filteredExpenses.reduce((acc, exp) => {
      acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.value;
      return acc;
    }, {} as Record<PaymentMethod, number>);

    const byCard = filteredExpenses.reduce((acc, exp) => {
      if (exp.card) {
        acc[exp.card] = (acc[exp.card] || 0) + exp.value;
      }
      return acc;
    }, {} as Record<string, number>);

    const byDate = filteredExpenses.reduce((acc, exp) => {
      const date = exp.date.split('T')[0];
      acc[date] = (acc[date] || 0) + exp.value;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
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
      topCategory: topCategory
        ? { category: topCategory[0] as Category, value: topCategory[1] }
        : null,
    };
  }, [filteredExpenses]);

  const uniqueCards = useMemo(() => {
    return [...new Set(expenses.filter((e) => e.card).map((e) => e.card!))];
  }, [expenses]);

  const clearFilters = () => setFilters({});

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
