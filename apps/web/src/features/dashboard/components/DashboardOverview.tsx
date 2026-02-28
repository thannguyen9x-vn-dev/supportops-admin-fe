"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Alert, Button, Chip, CircularProgress } from "@mui/material";

import { useDashboardOverview } from "@/features/dashboard/hooks/useDashboardOverview";

import styles from "./dashboard-overview.module.css";

function getStatusColor(status: "COMPLETED" | "IN_PROGRESS" | "CANCELLED") {
  if (status === "COMPLETED") {
    return "success";
  }

  if (status === "IN_PROGRESS") {
    return "warning";
  }

  return "default";
}

export function DashboardOverview() {
  const t = useTranslations("pages.dashboard");
  const format = useFormatter();
  const { data, loadState, reload } = useDashboardOverview();

  if (loadState === "loading") {
    return (
      <div className={styles.centeredState}>
        <CircularProgress size={28} />
        <p>{t("state.loading")}</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className={styles.centeredState}>
        <Alert severity="error">{t("state.error")}</Alert>
        <Button onClick={() => void reload()} variant="contained">
          {t("action.retry")}
        </Button>
      </div>
    );
  }

  const kpi = data.kpi;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>{t("title")}</h1>
        <Button onClick={() => void reload()} size="small" variant="outlined">
          {t("action.refresh")}
        </Button>
      </div>

      {kpi ? (
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>{t("kpi.todaySales")}</p>
            <p className={styles.kpiValue}>{format.number(kpi.todaySales.value)}</p>
            <p className={styles.kpiChange}>{t("kpi.change", { value: kpi.todaySales.changePercent })}</p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>{t("kpi.todayVisitors")}</p>
            <p className={styles.kpiValue}>{format.number(kpi.todayVisitors.value)}</p>
            <p className={styles.kpiChange}>{t("kpi.change", { value: kpi.todayVisitors.changePercent })}</p>
          </div>
          <div className={styles.kpiCard}>
            <p className={styles.kpiLabel}>{t("kpi.weekVisitors")}</p>
            <p className={styles.kpiValue}>{format.number(kpi.weekVisitors.value)}</p>
            <p className={styles.kpiChange}>{t("kpi.change", { value: kpi.weekVisitors.changePercent })}</p>
          </div>
        </div>
      ) : null}

      <div className={styles.sectionGrid}>
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>{t("latestCustomers.title")}</h2>
          <div className={styles.rowList}>
            {data.latestCustomers.map((customer) => (
              <div className={styles.rowItem} key={customer.id}>
                <div>
                  <p className={styles.name}>{customer.name}</p>
                  <p className={styles.meta}>{customer.email}</p>
                </div>
                <span className={styles.amount}>{format.number(customer.amount)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>{t("transactions.title")}</h2>
          <div className={styles.rowList}>
            {data.transactions.map((transaction) => (
              <div className={styles.rowItem} key={transaction.id}>
                <div>
                  <p className={styles.name}>{transaction.description}</p>
                  <p className={styles.meta}>{format.dateTime(new Date(transaction.dateTime), { dateStyle: "medium" })}</p>
                </div>
                <div>
                  <p className={styles.amount}>{format.number(transaction.amount)}</p>
                  <Chip color={getStatusColor(transaction.status)} label={t(`transactions.status.${transaction.status}`)} size="small" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
