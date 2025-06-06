/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { BASE_RAC_ALERTS_API_PATH } from '@kbn/rule-registry-plugin/common';
import {
  AlertConsumers,
  SYNTHETICS_RULE_TYPE_IDS,
} from '@kbn/rule-registry-plugin/common/technical_rule_data_field_names';
import { useFetcher } from '@kbn/observability-shared-plugin/public';
import { useKibana } from '@kbn/kibana-react-plugin/public';
import { useParams } from 'react-router-dom';
import type { ESSearchResponse } from '@kbn/es-types';
import { useSelectedLocation } from './use_selected_location';

import { ClientPluginsStart } from '../../../../../plugin';

export function useFetchActiveAlerts() {
  const { http } = useKibana<ClientPluginsStart>().services;

  const { monitorId: configId } = useParams<{ monitorId: string }>();

  const selectedLocation = useSelectedLocation();

  const { loading, data } = useFetcher(async () => {
    return await http.post<ESSearchResponse>(`${BASE_RAC_ALERTS_API_PATH}/find`, {
      body: JSON.stringify({
        rule_type_ids: SYNTHETICS_RULE_TYPE_IDS,
        consumers: [AlertConsumers.UPTIME, AlertConsumers.ALERTS, AlertConsumers.OBSERVABILITY],
        size: 0,
        track_total_hits: true,
        query: {
          bool: {
            filter: [
              {
                range: {
                  '@timestamp': {
                    gte: 'now-24h/h',
                  },
                },
              },
              {
                term: {
                  configId,
                },
              },
              {
                term: {
                  'location.id': selectedLocation?.id,
                },
              },
              {
                term: {
                  'kibana.alert.status': 'active',
                },
              },
            ],
          },
        },
      }),
    });
  }, [configId, http, selectedLocation?.id]);

  return {
    loading,
    data,
    numberOfActiveAlerts: data?.hits?.total.value ?? 0,
  };
}
