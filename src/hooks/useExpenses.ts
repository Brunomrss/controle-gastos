import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Expense,
  ExpenseFilters,
  Category,
  PaymentMethod,
  ExpenseInsert,
  ExpenseForm,
} from '@/types/expense';
import {
  fetchExpenses,
  createExpense,
  updateExpenseById,
  deleteExpenseById,
} from '@/services/expenses';
import { supabase } from '@/lib/supabaseClient';

export function useExpenses() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ExpenseFilters>({});

  /* ======================================================
     🔹 FETCH
     ====================================================== */

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses,
  });

  /* ======================================================
     🔹 CREATE
     ====================================================== */

  const addExpenseMutation = useMutation({
    mutationFn: async (expenseForm: ExpenseForm) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const expenseToInsert: ExpenseInsert = {
        user_id: user.id,
        description: expenseForm.description,
        value: expenseForm.value,
        category: expenseForm.category,
        subcategory: expenseForm.subcategory,
        payment_method: expenseForm.paymentMethod,
        card: expenseForm.card,
        date: expenseForm.date,
      };

      return createExpense(expenseToInsert);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      console.error('Erro ao criar despesa:', error);
    },
  });

  /* ======================================================
     🔹 UPDATE
     ====================================================== */

  const updateExpenseMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Expense>;
    }) => {
      const payload: Partial<ExpenseInsert> = {
        description: data.description,
        value: data.value,
        category: data.category,
        subcategory: data.subcategory,
        payment_method: data.paymentMethod,
        card: data.card,
        date: data.date,
      };

      return updateExpenseById(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  /* ======================================================
     🔹 DELETE
     ====================================================== */

  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpenseById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  /* ======================================================
     🔹 API EXPORTADA
     ====================================================== */

  const addExpense = (expense: ExpenseForm) => {
    addExpenseMutation.mutate(expense);
  };

  const updateExpense = (
    id: string,
    updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    updateExpenseMutation.mutate({ id, data: updates });
  };

  const deleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  /* ======================================================
     🔹 FILTROS
     ====================================================== */

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

  /* ======================================================
     🔹 STATS
     ====================================================== */

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

    return {
      total,
      count,
      average,
      byCategory,
      byPaymentMethod,
      byCard,
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
