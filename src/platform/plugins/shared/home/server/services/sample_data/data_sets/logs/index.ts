/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import path from 'path';
import { i18n } from '@kbn/i18n';
import { getSavedObjects } from './saved_objects';
import { fieldMappings } from './field_mappings';
import { SampleDatasetProvider } from '../../lib/sample_dataset_registry_types';

const logsName = i18n.translate('home.sampleData.logsSpecTitle', {
  defaultMessage: 'Sample web logs',
});
const logsDescription = i18n.translate('home.sampleData.logsSpecDescription', {
  defaultMessage: 'Sample data, visualizations, and dashboards for monitoring web logs.',
});

export const logsSpecProvider: SampleDatasetProvider = ({ staticAssets }) => {
  return {
    id: 'logs',
    name: logsName,
    description: logsDescription,
    previewImagePath: staticAssets.getPluginAssetHref('/sample_data_resources/logs/dashboard.webp'),
    darkPreviewImagePath: staticAssets.getPluginAssetHref(
      '/sample_data_resources/logs/dashboard_dark.webp'
    ),
    overviewDashboard: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
    defaultIndex: '90943e30-9a47-11e8-b64d-95841ca0b247',
    savedObjects: getSavedObjects(),
    dataIndices: [
      {
        id: 'logs',
        dataPath: path.join(__dirname, './logs.json.gz'),
        fields: fieldMappings,
        timeFields: ['@timestamp', 'utc_time'],
        currentTimeMarker: '2018-08-01T00:00:00',
        preserveDayOfWeekTimeOfDay: true,
        isDataStream: true,
      },
    ],
    status: 'not_installed',
    iconPath: staticAssets.getPluginAssetHref('/sample_data_resources/logs/icon.svg'),
  };
};
