/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { createContext, type FC, useContext } from 'react';

import type { ObservabilityAIAssistantPublicStart } from '@kbn/observability-ai-assistant-plugin/public';
import type { IStorageWrapper } from '@kbn/kibana-utils-plugin/public';
import type { DataPublicPluginStart } from '@kbn/data-plugin/public';
import type { UnifiedSearchPublicPluginStart } from '@kbn/unified-search-plugin/public';
import type { ChartsPluginStart } from '@kbn/charts-plugin/public';
import type { FieldFormatsStart } from '@kbn/field-formats-plugin/public';
import type { SharePluginStart } from '@kbn/share-plugin/public';
import type {
  AnalyticsServiceStart,
  CoreStart,
  ExecutionContextStart,
  HttpStart,
  IUiSettingsClient,
  ThemeServiceStart,
  UserProfileService,
  NotificationsStart,
} from '@kbn/core/public';
import type { LensPublicStart } from '@kbn/lens-plugin/public';
import type { EmbeddableStart } from '@kbn/embeddable-plugin/public';
import type { CasesPublicStart } from '@kbn/cases-plugin/public';
import type { UsageCollectionSetup } from '@kbn/usage-collection-plugin/public';
import type { UiActionsStart } from '@kbn/ui-actions-plugin/public';
import type { FieldStatsFlyoutProviderProps } from '@kbn/ml-field-stats-flyout/field_stats_flyout_provider';
import type { UseFieldStatsTrigger } from '@kbn/ml-field-stats-flyout/use_field_stats_trigger';

/**
 * AIOps app context value to be provided via React context.
 */
export interface AiopsAppContextValue {
  /**
   * Used for telemetry/performance metrics.
   */
  analytics: AnalyticsServiceStart;
  /**
   * Used to check capabilities for links to other plugins.
   * `application.currentAppId$` is used to close the log pattern analysis flyout
   * when user navigates out of the current plugin.
   */
  application: CoreStart['application'];
  /**
   * Used for data fetching.
   */
  data: DataPublicPluginStart;
  /**
   * Provides execution context for data fetching.
   */
  executionContext: ExecutionContextStart;
  /**
   * Required as a dependency for the fields stats service.
   */
  charts: ChartsPluginStart;
  /**
   * Required as a dependency for the fields stats service and
   * used for date formatting in change point detection.
   */
  fieldFormats: FieldFormatsStart;
  /**
   * Used for data fetching.
   */
  http: HttpStart;
  /**
   * Used for toast notifications.
   */
  notifications: NotificationsStart;
  /**
   * Used to store user settings in local storage.
   */
  storage: IStorageWrapper;
  /**
   * Theme service.
   */
  theme: ThemeServiceStart;
  /**
   * UI settings.
   */
  uiSettings: IUiSettingsClient;
  /**
   * Unified search.
   */
  unifiedSearch: UnifiedSearchPublicPluginStart;
  /**
   * Usage collection.
   */
  usageCollection?: UsageCollectionSetup;
  /**
   * User profile service.
   */
  userProfile: UserProfileService;
  /**
   * Used to create deep links to other plugins.
   */
  share?: SharePluginStart;
  /**
   * Used to create lens embeddables.
   */
  lens: LensPublicStart;
  /**
   * UI actions.
   */
  uiActions?: UiActionsStart;
  /**
   * Internationalisation service
   */
  i18n: CoreStart['i18n'];
  /**
   * Deps for unified fields stats.
   */
  fieldStats?: {
    useFieldStatsTrigger: UseFieldStatsTrigger;
    FieldStatsFlyoutProvider: FC<FieldStatsFlyoutProviderProps>;
  };
  embeddable?: EmbeddableStart;
  cases?: CasesPublicStart;
  isServerless?: boolean;
  /** Identifier to indicate the plugin utilizing the component */
  embeddingOrigin: string;
  /** Observability AI Assistant */
  observabilityAIAssistant?: ObservabilityAIAssistantPublicStart;
}

/**
 * React AIOps app dependency context.
 */
export const AiopsAppContext = createContext<AiopsAppContextValue | undefined>(undefined);

/**
 * Custom hook to get AIOps app dependency context.
 */
export const useAiopsAppContext = (): AiopsAppContextValue => {
  const aiopsAppContext = useContext(AiopsAppContext);

  // if `undefined`, throw an error
  if (aiopsAppContext === undefined) {
    throw new Error('useAiopsAppContext was used outside of its Provider');
  }

  return aiopsAppContext;
};
