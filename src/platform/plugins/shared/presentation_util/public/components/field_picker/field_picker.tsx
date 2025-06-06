/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { sortBy, uniq } from 'lodash';
import { comboBoxFieldOptionMatcher, getFieldIconType } from '@kbn/field-utils';

import { i18n } from '@kbn/i18n';
import { FieldIcon } from '@kbn/react-field';
import {
  EuiFormRow,
  EuiSelectable,
  EuiSelectableOption,
  EuiSelectableProps,
  EuiSpacer,
  useEuiTheme,
} from '@elastic/eui';
import { DataView, DataViewField } from '@kbn/data-views-plugin/common';

import { FieldTypeFilter } from './field_type_filter';

export interface FieldPickerProps {
  dataView?: DataView;
  selectedFieldName?: string;
  filterPredicate?: (f: DataViewField) => boolean;
  onSelectField?: (selectedField: DataViewField) => void;
  selectableProps?: Partial<EuiSelectableProps>;
}

export const FieldPicker = ({
  dataView,
  onSelectField,
  filterPredicate,
  selectedFieldName,
  selectableProps,
  ...other
}: FieldPickerProps) => {
  const initialSelection = useRef(selectedFieldName);
  const { selectableStyles } = useStyles();

  const [typesFilter, setTypesFilter] = useState<string[]>([]);
  const [searchRef, setSearchRef] = useState<HTMLInputElement | null>(null);
  const [fieldSelectableOptions, setFieldSelectableOptions] = useState<EuiSelectableOption[]>([]);

  const availableFields = useMemo(
    () =>
      sortBy(
        (dataView?.fields ?? [])
          .filter(
            (f) => typesFilter.length === 0 || typesFilter.includes(getFieldIconType(f) as string)
          )
          .filter((f) => (filterPredicate ? filterPredicate(f) : true)),
        ['name']
      ).sort((f) => (f.name === initialSelection.current ? -1 : 1)),
    [dataView, filterPredicate, typesFilter]
  );

  useEffect(() => {
    if (!dataView) return;
    const options: EuiSelectableOption[] = (availableFields ?? []).map((field) => {
      return {
        key: field.name,
        name: field.name,
        label: field.displayName ?? field.name,
        className: 'presFieldPicker__fieldButton',
        checked: field.name === selectedFieldName ? 'on' : undefined,
        'data-test-subj': `field-picker-select-${field.name}`,
        prepend: (
          <FieldIcon
            type={getFieldIconType(field)}
            label={field.name}
            scripted={field.scripted}
            className="eui-alignMiddle"
          />
        ),
      };
    });
    setFieldSelectableOptions(options);
  }, [availableFields, dataView, filterPredicate, selectedFieldName, typesFilter]);

  const uniqueTypes = useMemo(
    () =>
      dataView
        ? uniq(
            dataView.fields
              .filter((f) => (filterPredicate ? filterPredicate(f) : true))
              .map((f) => getFieldIconType(f))
          )
        : [],
    [dataView, filterPredicate]
  );

  const setFocusToSearch = useCallback(() => {
    searchRef?.focus();
  }, [searchRef]);

  const fieldTypeFilter = (
    <EuiFormRow fullWidth={true}>
      <FieldTypeFilter
        setFocusToSearch={setFocusToSearch}
        onFieldTypesChange={(types) => setTypesFilter(types)}
        fieldTypesValue={typesFilter}
        availableFieldTypes={uniqueTypes}
        buttonProps={{ disabled: Boolean(selectableProps?.isLoading) }}
      />
    </EuiFormRow>
  );

  return (
    <EuiSelectable
      {...other}
      {...selectableProps}
      css={selectableStyles}
      emptyMessage={i18n.translate('presentationUtil.fieldPicker.noFieldsLabel', {
        defaultMessage: 'No matching fields',
      })}
      aria-label={i18n.translate('presentationUtil.fieldPicker.selectableAriaLabel', {
        defaultMessage: 'Select a field',
      })}
      searchable
      options={fieldSelectableOptions}
      onChange={(options, _, changedOption) => {
        setFieldSelectableOptions(options);
        if (!dataView || !changedOption.key) return;
        const field = dataView.getFieldByName(changedOption.key);
        if (field) onSelectField?.(field);
      }}
      optionMatcher={comboBoxFieldOptionMatcher}
      searchProps={{
        'data-test-subj': 'field-search-input',
        placeholder: i18n.translate('presentationUtil.fieldSearch.searchPlaceHolder', {
          defaultMessage: 'Search field names',
        }),
        compressed: true,
        disabled: Boolean(selectableProps?.isLoading),
        inputRef: setSearchRef,
      }}
      listProps={{
        isVirtualized: true,
        showIcons: false,
        bordered: true,
        truncationProps: { truncation: 'middle' },
      }}
      height="full"
    >
      {(list, search) => (
        <>
          {search}
          <EuiSpacer size={'s'} />
          {fieldTypeFilter}
          <EuiSpacer size={'s'} />
          {list}
        </>
      )}
    </EuiSelectable>
  );
};

const useStyles = () => {
  const { euiTheme } = useEuiTheme();
  const styles = useMemo(() => {
    return {
      selectableStyles: css({
        height: `calc(${euiTheme.size.xxl} * 9)`, // 40 * 9 = 360px
        '.presFieldPicker__fieldButton[aria-checked=true]': {
          backgroundColor: euiTheme.colors.backgroundBasePrimary,
        },
        '.euiSelectableMessage': {
          height: '100%',
        },
      }),
    };
  }, [euiTheme]);
  return styles;
};

// required for dynamic import using React.lazy()
// eslint-disable-next-line import/no-default-export
export default FieldPicker;
