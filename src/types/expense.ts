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

export interface Expense {
  id: string;
  value: number;
  date: string;
  paymentMethod: PaymentMethod;
  card?: string;
  category: Category;
  subcategory: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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

export const CATEGORY_COLORS: Record<Category, string> = {
  alimentacao: 'hsl(var(--chart-1))',
  moradia: 'hsl(var(--chart-2))',
  transporte: 'hsl(var(--chart-3))',
  lazer: 'hsl(var(--chart-4))',
  saude: 'hsl(var(--chart-5))',
  educacao: 'hsl(var(--chart-6))',
  vestuario: 'hsl(262, 83%, 58%)',
  outros: 'hsl(215, 15%, 50%)',
};

export type ExpenseInsert = {
  description: string;
  value: number;
  category: Category;
  subcategory?: string;
  paymentMethod: PaymentMethod;
  card?: string;
  date: string;
};

