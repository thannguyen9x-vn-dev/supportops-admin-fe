"use client";

import { useCallback, useState } from "react";

type DialogState<TPayload> = {
  isOpen: boolean;
  payload: TPayload | null;
};

export function useDialogState<TPayload = undefined>() {
  const [state, setState] = useState<DialogState<TPayload>>({
    isOpen: false,
    payload: null,
  });

  const open = useCallback((payload?: TPayload) => {
    setState({
      isOpen: true,
      payload: (payload ?? null) as TPayload | null,
    });
  }, []);

  const close = useCallback(() => {
    setState({
      isOpen: false,
      payload: null,
    });
  }, []);

  const setPayload = useCallback((payload: TPayload | null) => {
    setState((prev) => ({
      ...prev,
      payload,
    }));
  }, []);

  return {
    close,
    isOpen: state.isOpen,
    open,
    payload: state.payload,
    setPayload,
  };
}
