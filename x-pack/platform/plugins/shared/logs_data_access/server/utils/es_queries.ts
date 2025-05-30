/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { estypes } from '@elastic/elasticsearch';
import { QueryDslQueryContainer } from '@kbn/data-views-plugin/common/types';
import { fromKueryExpression, toElasticsearchQuery } from '@kbn/es-query';

export function existsQuery(field: string): QueryDslQueryContainer[] {
  return [{ exists: { field } }];
}

export function kqlQuery(kql?: string): estypes.QueryDslQueryContainer[] {
  if (!kql) {
    return [];
  }

  const ast = fromKueryExpression(kql);
  return [toElasticsearchQuery(ast)];
}
