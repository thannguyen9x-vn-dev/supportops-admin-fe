import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

import { AuthProvider } from "@/lib/auth/AuthContext";

interface TestProviderProps {
  children: ReactNode;
}

function TestProviders({ children }: TestProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
  return render(ui, {
    wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    ...options
  });
}

export * from "@testing-library/react";
export { customRender as render };
