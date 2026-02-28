'use client';

import type { ReactNode } from "react";

import styles from "../auth.module.css";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  illustration: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({
  title,
  subtitle,
  illustration,
  children,
  footer,
}: AuthCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.illustration}>
        <div className={styles.illustrationContent}>{illustration}</div>
      </div>
      <div className={styles.formPanel}>
        <div>
          <div className={styles.formTitle}>{title}</div>
          {subtitle ? <p className={styles.formSubtitle}>{subtitle}</p> : null}
        </div>
        <div className={styles.fields}>{children}</div>
        {footer ? <div className={styles.footer}>{footer}</div> : null}
      </div>
    </section>
  );
}
