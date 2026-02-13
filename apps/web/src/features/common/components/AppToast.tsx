import { Alert, Snackbar } from "@mui/material";
import type { AlertColor } from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";

type AppToastProps = {
  autoHideDuration?: number;
  message: string;
  onClose: () => void;
  open: boolean;
  severity: AlertColor;
  toastKey?: number;
};

export function AppToast({
  autoHideDuration = 3000,
  message,
  onClose,
  open,
  severity,
  toastKey,
}: AppToastProps) {
  const handleClose = (_event: unknown, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      autoHideDuration={autoHideDuration}
      key={toastKey}
      onClose={handleClose}
      open={open}
      sx={{
        "& .MuiAlert-root": {
          alignItems: "center",
          maxWidth: { sm: 560, xs: "calc(100vw - 32px)" },
          minWidth: { sm: 440, xs: 280 },
          width: "100%",
        },
      }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
