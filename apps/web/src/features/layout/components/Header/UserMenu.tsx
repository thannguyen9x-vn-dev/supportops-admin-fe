"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Avatar, ButtonBase, Menu, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState, type MouseEvent } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./header.module.css";

export function UserMenu() {
  const t = useTranslations("header");
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const displayName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.trim() || "U";

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ButtonBase
        className={styles.userButton}
        onClick={handleOpen}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="header-user-menu"
        aria-label={t("userMenuAriaLabel")}
      >
        <Avatar src={user?.avatarUrl ?? undefined} sx={{ width: 32, height: 32 }}>
          {initials}
        </Avatar>
        <span className={styles.userButtonName}>{displayName}</span>
        <KeyboardArrowDownIcon fontSize="small" />
      </ButtonBase>

      <Menu
        id="header-user-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem onClick={handleClose}>{t("profile")}</MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            logout();
          }}
        >
          {t("signOut")}
        </MenuItem>
      </Menu>
    </>
  );
}
