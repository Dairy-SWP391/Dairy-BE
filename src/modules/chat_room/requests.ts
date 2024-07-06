import { ParamsDictionary, Query } from 'express-serve-static-core';
export interface GetConversationsParams extends ParamsDictionary {
  user_id: string;
}

export interface Pagination extends Query {
  limit: string;
  page: string;
}
