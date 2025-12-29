import { useState } from 'react';
import { Plus, Wallet, LayoutDashboard, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseForm } from '@/components/expenses/ExpenseForm';
import { FilterPanel } from '@/components/expenses/FilterPanel';
import { Dashboard } from '@/components/expenses/Dashboard';
import { ExpenseTable } from '@/components/expenses/ExpenseTable';
import { Expense } from '@/types/expense';

const Index = () => {
  const { toast } = useToast();
  const {
    expenses,
    stats,
    filters,
    setFilters,
    clearFilters,
    addExpense,
    updateExpense,
    deleteExpense,
    uniqueCards,
    isLoading,
  } = useExpenses();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
      toast({
        title: 'Transação atualizada',
        description: 'A transação foi atualizada com sucesso.',
      });
    } else {
      addExpense(expenseData);
      toast({
        title: 'Transação adicionada',
        description: 'A nova transação foi salva com sucesso.',
      });
    }
    handleCloseForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: 'Transação excluída',
      description: 'A transação foi removida com sucesso.',
      variant: 'destructive',
    });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-primary shadow-glow">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FinanceFlow</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Controle de Gastos Pessoais
              </p>
            </div>
          </div>
          <Button variant="gradient" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Nova Transação</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
          uniqueCards={uniqueCards}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="transactions" className="gap-2">
              <List className="h-4 w-4" />
              Transações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
            <Dashboard stats={stats} />
          </TabsContent>

          <TabsContent value="transactions" className="animate-fade-in">
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Expense Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={editingExpense}
            onSave={handleSaveExpense}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
