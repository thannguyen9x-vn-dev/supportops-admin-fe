"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { InputBase } from "@mui/material";
import { useTranslations } from "next-intl";

import styles from "./header.module.css";

export function SearchBar() {
  const t = useTranslations("header");

  return (
    <label className={styles.search}>
      <SearchOutlinedIcon fontSize="small" />
      <InputBase
        placeholder={t("searchPlaceholder")}
        className={styles.searchInput}
        inputProps={{ "aria-label": t("searchPlaceholder") }}
      />
    </label>
  );
}

