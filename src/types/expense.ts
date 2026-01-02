export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash';

export type Category =
  | 'alimentacao'
  | 'moradia'
  | 'transporte'
  | 'lazer'
  | 'saude'
  | 'educacao'
  | 'vestuario'
  | 'outros';

export type Subcategory = {
  [K in Category]: string[];
};

/* ======================================================
   🔹 TIPO USADO NO FRONTEND (UI)
   ====================================================== */
export interface Expense {
  id: string;

  value: number;
  date: string;

  paymentMethod: PaymentMethod;
  card?: string;

  category: Category;
  subcategory?: string;

  description?: string;

  createdAt: string;
  updatedAt: string;
}

/* ======================================================
   🔹 TIPO DO BANCO (SUPABASE)
   ====================================================== */
export interface ExpenseDB {
  id: string;
  user_id: string;

  description?: string;
  value: number;

  category: Category;
  subcategory?: string;

  payment_method: PaymentMethod;
  card?: string;

  date: string;

  created_at: string;
  updated_at: string;
}

/* ======================================================
   🔹 FORMULÁRIO (entrada do usuário)
   ====================================================== */
export interface ExpenseForm {
  description?: string;
  value: number;
  category: Category;
  subcategory?: string;
  paymentMethod: PaymentMethod;
  card?: string;
  date: string;
}

/* ======================================================
   🔹 INSERT NO BANCO (SUPABASE)
   👉 já no formato snake_case
   ====================================================== */
export interface ExpenseInsert {
  user_id: string;

  description?: string;
  value: number;

  category: Category;
  subcategory?: string;

  payment_method: PaymentMethod;
  card?: string;

  date: string;
}

/* ======================================================
   🔹 FILTROS
   ====================================================== */
export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  category?: Category;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  card?: string;
}

/* ======================================================
   🔹 CONSTANTES
   ====================================================== */

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'pix', label: 'Pix' },
  { value: 'credit_card', label: 'Cartão de Crédito' },
  { value: 'debit_card', label: 'Cartão de Débito' },
  { value: 'cash', label: 'Dinheiro' },
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'moradia', label: 'Moradia' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'lazer', label: 'Lazer' },
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'vestuario', label: 'Vestuário' },
  { value: 'outros', label: 'Outros' },
];

export const SUBCATEGORIES: Subcategory = {
  alimentacao: ['Mercado', 'Restaurante', 'Delivery', 'Padaria', 'Lanche'],
  moradia: ['Aluguel', 'Condomínio', 'Energia', 'Água', 'Gás', 'Internet', 'Manutenção'],
  transporte: ['Combustível', 'Uber/99', 'Ônibus', 'Metrô', 'Estacionamento', 'Manutenção Veículo'],
  lazer: ['Cinema', 'Streaming', 'Jogos', 'Viagem', 'Restaurante', 'Bar', 'Eventos'],
  saude: ['Farmácia', 'Consulta', 'Exames', 'Plano de Saúde', 'Academia'],
  educacao: ['Curso', 'Livros', 'Material', 'Mensalidade'],
  vestuario: ['Roupas', 'Calçados', 'Acessórios'],
  outros: ['Presentes', 'Assinaturas', 'Taxas', 'Outros'],
};

export const DEFAULT_CARDS = [
  'Nubank',
  'Itaú',
  'Inter',
  'C6 Bank',
  'Bradesco',
  'Santander',
  'Banco do Brasil',
  'Caixa',
  'XP',
  'Outro',
];
