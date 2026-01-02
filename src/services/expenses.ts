import { supabase } from "@/lib/supabaseClient";
import { Expense, ExpenseInsert } from "@/types/expense";

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createExpense(expense: ExpenseInsert) {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateExpenseById(id: string, expense: Partial<Expense>) {
  const { error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", id);

  if (error) throw error;
}

export async function deleteExpenseById(id: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
