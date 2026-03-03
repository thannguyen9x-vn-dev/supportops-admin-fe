import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  __typename?: 'Query';
  meSettings: UserPreferences;
};

export type UserPreferences = {
  __typename?: 'UserPreferences';
  accountActivity: Scalars['Boolean']['output'];
  buyerReviewNotif: Scalars['Boolean']['output'];
  companyNews: Scalars['Boolean']['output'];
  itemCommentNotif: Scalars['Boolean']['output'];
  itemUpdateNotif: Scalars['Boolean']['output'];
  meetupsNearYou: Scalars['Boolean']['output'];
  newMessages: Scalars['Boolean']['output'];
  ratingReminders: Scalars['Boolean']['output'];
};

export type MeSettingsQueryVariables = Exact<{ [key: string]: never; }>;


export type MeSettingsQuery = { __typename?: 'Query', meSettings: { __typename?: 'UserPreferences', companyNews: boolean, accountActivity: boolean, meetupsNearYou: boolean, newMessages: boolean, ratingReminders: boolean, itemUpdateNotif: boolean, itemCommentNotif: boolean, buyerReviewNotif: boolean } };


export const MeSettingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MeSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"meSettings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"companyNews"}},{"kind":"Field","name":{"kind":"Name","value":"accountActivity"}},{"kind":"Field","name":{"kind":"Name","value":"meetupsNearYou"}},{"kind":"Field","name":{"kind":"Name","value":"newMessages"}},{"kind":"Field","name":{"kind":"Name","value":"ratingReminders"}},{"kind":"Field","name":{"kind":"Name","value":"itemUpdateNotif"}},{"kind":"Field","name":{"kind":"Name","value":"itemCommentNotif"}},{"kind":"Field","name":{"kind":"Name","value":"buyerReviewNotif"}}]}}]}}]} as unknown as DocumentNode<MeSettingsQuery, MeSettingsQueryVariables>;