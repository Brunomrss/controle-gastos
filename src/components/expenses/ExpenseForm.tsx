import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import {
  Expense,
  PAYMENT_METHODS,
  CATEGORIES,
  SUBCATEGORIES,
  DEFAULT_CARDS,
  Category,
  PaymentMethod,
} from '@/types/expense';

interface ExpenseFormProps {
  expense?: Expense | null;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ExpenseForm({ expense, onSave, onCancel }: ExpenseFormProps) {
  const [value, setValue] = useState(expense?.value?.toString() || '');
  const [date, setDate] = useState<Date | undefined>(
    expense?.date ? new Date(expense.date) : new Date()
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(
    expense?.paymentMethod || ''
  );
  const [card, setCard] = useState(expense?.card || '');
  const [category, setCategory] = useState<Category | ''>(expense?.category || '');
  const [subcategory, setSubcategory] = useState(expense?.subcategory || '');
  const [description, setDescription] = useState(expense?.description || '');

  const showCardField = paymentMethod === 'credit_card' || paymentMethod === 'debit_card';
  const subcategories = category ? SUBCATEGORIES[category] : [];

  useEffect(() => {
    if (!showCardField) {
      setCard('');
    }
  }, [showCardField]);

  useEffect(() => {
    setSubcategory('');
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !date || !paymentMethod || !category || !subcategory) {
      return;
    }

    onSave({
      value: parseFloat(value),
      date: date.toISOString(),
      paymentMethod,
      card: showCardField ? card : undefined,
      category,
      subcategory,
      description: description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Value */}
        <div className="space-y-2">
          <Label htmlFor="value">Valor (R$) *</Label>
          <Input
            id="value"
            type="number"
            step="0.01"
            min="0"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label>Data *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'dd/MM/yyyy') : 'Selecione uma data'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <Label>Forma de Pagamento *</Label>
          <Select
            value={paymentMethod}
            onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHODS.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Card (conditional) */}
        {showCardField && (
          <div className="space-y-2">
            <Label>Cartão *</Label>
            <Select value={card} onValueChange={setCard}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cartão..." />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CARDS.map((cardName) => (
                  <SelectItem key={cardName} value={cardName}>
                    {cardName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Category */}
        <div className="space-y-2">
          <Label>Categoria *</Label>
          <Select
            value={category}
            onValueChange={(val) => setCategory(val as Category)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <Label>Subcategoria *</Label>
          <Select
            value={subcategory}
            onValueChange={setSubcategory}
            disabled={!category}
          >
            <SelectTrigger>
              <SelectValue placeholder={category ? 'Selecione...' : 'Selecione uma categoria primeiro'} />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Adicione detalhes sobre o gasto..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="gradient" className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          {expense ? 'Atualizar' : 'Salvar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>
    </form>
  );
}
