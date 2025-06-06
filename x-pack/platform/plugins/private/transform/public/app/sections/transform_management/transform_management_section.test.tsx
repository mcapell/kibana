/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { renderWithI18n } from '@kbn/test-jest-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TransformManagementSection } from './transform_management_section';

jest.mock('../../services/navigation');

const queryClient = new QueryClient();

describe('Transform: <TransformManagementSection />', () => {
  test('Minimal initialization', () => {
    const { container } = renderWithI18n(
      <QueryClientProvider client={queryClient}>
        <TransformManagementSection />
      </QueryClientProvider>
    );

    expect(container.textContent).toContain('Missing permission');
  });
});
