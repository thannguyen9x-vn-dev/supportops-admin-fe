import { env } from "@/lib/config/env";
import { tokenManager } from "@/lib/auth/tokenManager";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { print } from "graphql";

type GraphqlError = {
  message: string;
};

type GraphqlResponse<TData> = {
  data?: TData;
  errors?: GraphqlError[];
};

function getGraphqlEndpoint(): string {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v\d+\/?$/, "");
  return `${baseUrl}/graphql`;
}

export async function graphqlQuery<TData, TVariables extends Record<string, unknown> = Record<string, never>>(
  document: string | TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<TData> {
  const query = typeof document === "string" ? document : print(document);
  const accessToken = tokenManager.getAccessToken();
  const response = await fetch(getGraphqlEndpoint(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GraphqlResponse<TData>;
  if (payload.errors && payload.errors.length > 0) {
    throw new Error(payload.errors[0]?.message || "GraphQL request failed");
  }

  if (!payload.data) {
    throw new Error("GraphQL response does not contain data");
  }

  return payload.data;
}
