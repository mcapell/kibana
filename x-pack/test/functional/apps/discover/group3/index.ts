/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrProviderContext } from '../../../ftr_provider_context';

export default function ({ loadTestFile }: FtrProviderContext) {
  describe('discover - group 3', function () {
    loadTestFile(require.resolve('./saved_queries'));
    loadTestFile(require.resolve('./saved_searches'));
    loadTestFile(require.resolve('./visualize_field'));
    loadTestFile(require.resolve('./value_suggestions'));
    loadTestFile(require.resolve('./value_suggestions_non_timebased'));
    loadTestFile(require.resolve('./saved_search_embeddable'));
    loadTestFile(require.resolve('./esql_starred'));
  });
}
