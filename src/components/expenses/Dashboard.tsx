import { DollarSign, TrendingUp, CreditCard, Target } from 'lucide-react';
import { StatCard } from './StatCard';
import { CategoryBarChart } from './charts/CategoryBarChart';
import { PaymentPieChart } from './charts/PaymentPieChart';
import { TimeLineChart } from './charts/TimeLineChart';
import { CardBarChart } from './charts/CardBarChart';
import { formatCurrency, getCategoryLabel } from '@/lib/formatters';
import { Category, PaymentMethod } from '@/types/expense';

interface DashboardProps {
  stats: {
    total: number;
    count: number;
    average: number;
    dailyAverage: number;
    byCategory: Record<Category, number>;
    byPaymentMethod: Record<PaymentMethod, number>;
    byCard: Record<string, number>;
    byDate: Record<string, number>;
    topCategory: { category: Category; value: number } | null;
  };
}

export function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total do Período"
          value={formatCurrency(stats.total)}
          subtitle={`${stats.count} transações`}
          icon={DollarSign}
          colorClass="gradient-primary"
        />
        <StatCard
          title="Média por Transação"
          value={formatCurrency(stats.average)}
          icon={TrendingUp}
          colorClass="bg-accent"
        />
        <StatCard
          title="Média Diária"
          value={formatCurrency(stats.dailyAverage)}
          icon={CreditCard}
          colorClass="bg-chart-3"
        />
        <StatCard
          title="Maior Categoria"
          value={stats.topCategory ? getCategoryLabel(stats.topCategory.category) : '-'}
          subtitle={stats.topCategory ? formatCurrency(stats.topCategory.value) : undefined}
          icon={Target}
          colorClass="bg-chart-4"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBarChart data={stats.byCategory} />
        <PaymentPieChart data={stats.byPaymentMethod} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeLineChart data={stats.byDate} />
        <CardBarChart data={stats.byCard} />
      </div>
    </div>
  );
}
