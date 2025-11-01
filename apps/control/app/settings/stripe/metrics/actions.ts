'use server';

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { startOfDay, endOfDay, subDays } from 'date-fns';

interface GetMetricsParams {
  startDate: string;
  endDate: string;
  currency: 'brl' | 'usd';
}

export async function getStripeMetrics({
  startDate,
  endDate,
  currency = 'brl'
}: GetMetricsParams) {
  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));
  const amountField = currency === 'brl' ? 'amount_brl' : 'amount_usd';

  // Calcular MRR e ARR
  const revenueMetrics = await db.execute(sql`
    WITH recurring_revenue AS (
      SELECT
        SUM(CASE
          WHEN s.interval = 'monthly' THEN i.${sql.raw(amountField)}
          WHEN s.interval = 'quarterly' THEN i.${sql.raw(amountField)} / 3
          WHEN s.interval = 'yearly' THEN i.${sql.raw(amountField)} / 12
        END) as mrr
      FROM billing.invoices i
      JOIN billing.subscriptions sub ON i.subscription_id = sub.id
      JOIN billing.plans s ON sub.plan_id = s.id
      WHERE i.status = 'succeeded'
      AND i.created_at BETWEEN ${start} AND ${end}
    )
    SELECT
      mrr,
      mrr * 12 as arr
    FROM recurring_revenue
  `);

  // Receita por dia
  const revenueByDay = await db.execute(sql`
    SELECT
      DATE_TRUNC('day', i.created_at) as date,
      SUM(i.${sql.raw(amountField)}) as amount
    FROM billing.invoices i
    WHERE i.status = 'succeeded'
    AND i.created_at BETWEEN ${start} AND ${end}
    GROUP BY DATE_TRUNC('day', i.created_at)
    ORDER BY date
  `);

  // Receita por plano
  const revenueByPlan = await db.execute(sql`
    SELECT
      p.name as plan,
      SUM(i.${sql.raw(amountField)}) as amount
    FROM billing.invoices i
    JOIN billing.subscriptions s ON i.subscription_id = s.id
    JOIN billing.plans p ON s.plan_id = p.id
    WHERE i.status = 'succeeded'
    AND i.created_at BETWEEN ${start} AND ${end}
    GROUP BY p.name
    ORDER BY amount DESC
  `);

  // Métricas de assinaturas
  const subscriptionMetrics = await db.execute(sql`
    WITH subscription_counts AS (
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active,
        COUNT(CASE WHEN status = 'trialing' THEN 1 END) as trialing,
        COUNT(CASE WHEN status = 'canceled' THEN 1 END) as canceled
      FROM billing.subscriptions
      WHERE created_at <= ${end}
    ),
    churn_rate AS (
      SELECT
        COALESCE(
          CAST(COUNT(CASE WHEN status = 'canceled' THEN 1 END) AS FLOAT) /
          NULLIF(COUNT(CASE WHEN status IN ('active', 'trialing') THEN 1 END), 0),
          0
        ) as churn_rate
      FROM billing.subscriptions
      WHERE created_at BETWEEN ${start} AND ${end}
    )
    SELECT
      sc.*,
      cr.churn_rate
    FROM subscription_counts sc, churn_rate cr
  `);

  // Assinaturas por dia
  const subscriptionsByDay = await db.execute(sql`
    SELECT
      DATE_TRUNC('day', created_at) as date,
      COUNT(*) as count
    FROM billing.subscriptions
    WHERE created_at BETWEEN ${start} AND ${end}
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `);

  // Assinaturas por plano
  const subscriptionsByPlan = await db.execute(sql`
    SELECT
      p.name as plan,
      COUNT(*) as count
    FROM billing.subscriptions s
    JOIN billing.plans p ON s.plan_id = p.id
    WHERE s.created_at BETWEEN ${start} AND ${end}
    GROUP BY p.name
    ORDER BY count DESC
  `);

  // Métricas de clientes
  const customerMetrics = await db.execute(sql`
    SELECT
      COUNT(DISTINCT tenant_id) as total,
      COUNT(DISTINCT CASE
        WHEN created_at BETWEEN ${start} AND ${end} THEN tenant_id
      END) as new
    FROM billing.subscriptions
  `);

  // Novos clientes por dia
  const customersByDay = await db.execute(sql`
    SELECT
      DATE_TRUNC('day', created_at) as date,
      COUNT(DISTINCT tenant_id) as count
    FROM billing.subscriptions
    WHERE created_at BETWEEN ${start} AND ${end}
    GROUP BY DATE_TRUNC('day', created_at)
    ORDER BY date
  `);

  return {
    revenue: {
      mrr: revenueMetrics.rows[0]?.mrr || 0,
      arr: revenueMetrics.rows[0]?.arr || 0,
      totalRevenue: revenueByPlan.rows.reduce((acc, row) => acc + row.amount, 0),
      revenueByDay: revenueByDay.rows,
      revenueByPlan: revenueByPlan.rows
    },
    subscriptions: {
      total: subscriptionMetrics.rows[0]?.total || 0,
      active: subscriptionMetrics.rows[0]?.active || 0,
      trialing: subscriptionMetrics.rows[0]?.trialing || 0,
      canceled: subscriptionMetrics.rows[0]?.canceled || 0,
      churnRate: subscriptionMetrics.rows[0]?.churn_rate || 0,
      subscriptionsByDay: subscriptionsByDay.rows,
      subscriptionsByPlan: subscriptionsByPlan.rows
    },
    customers: {
      total: customerMetrics.rows[0]?.total || 0,
      new: customerMetrics.rows[0]?.new || 0,
      customersByDay: customersByDay.rows
    }
  };
}