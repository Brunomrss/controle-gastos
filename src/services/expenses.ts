import { supabase } from "@/lib/supabaseClient";
import { Expense, ExpenseInsert, ExpenseDB } from "@/types/expense";

/* ======================================================
   🔹 CONVERSÕES DB ⇄ UI
   ====================================================== */

function mapExpenseFromDB(expense: ExpenseDB): Expense {
  return {
    id: expense.id,
    value: expense.value,
    date: expense.date,

    paymentMethod: expense.payment_method,
    card: expense.card ?? undefined,

    category: expense.category,
    subcategory: expense.subcategory ?? undefined,

    description: expense.description ?? undefined,

    createdAt: expense.created_at,
    updatedAt: expense.updated_at,
  };
}

/* ======================================================
   🔹 FETCH
   ====================================================== */

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  if (!data) return [];

  return data.map(mapExpenseFromDB);
}

/* ======================================================
   🔹 CREATE
   ====================================================== */

export async function createExpense(expense: ExpenseInsert): Promise<Expense> {
  const { data, error } = await supabase
    .from("expenses")
    .insert(expense)
    .select()
    .single<ExpenseDB>();

  if (error) {
    console.error("Erro Supabase:", error);
    throw error;
  }

  return mapExpenseFromDB(data);
}

/* ======================================================
   🔹 UPDATE
   ====================================================== */

export async function updateExpenseById(
  id: string,
  expense: Partial<ExpenseInsert>
) {
  const { error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", id);

  if (error) throw error;
}

/* ======================================================
   🔹 DELETE
   ====================================================== */

export async function deleteExpenseById(id: string) {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
