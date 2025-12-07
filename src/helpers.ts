import { useMemo, useState } from 'react';
import {
  IconChevronDown,
  IconChevronUp,
  IconInfoCircle,
  IconMoneybag,
  IconRefresh,
  IconSearch,
  IconSelector,
  IconTrendingUp,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Flex,
  Group,
  keys,
  MantineStyleProp,
  ScrollArea,
  Table,
  Tabs,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';

export function toTitleCase(str: string) {
  return str
    .replaceAll('-', ' ')
    .replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

export function filterData<RowData extends object>(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some(
      (key) => typeof item[key] === 'string' && item[key].toLowerCase().includes(query)
    )
  );
}

export function sortData<RowData extends object>(
  data: RowData[],
  payload: { sortBy?: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
          return b[sortBy] - a[sortBy];
        } else if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
          return b[sortBy].localeCompare(a[sortBy]);
        }
        return 0;
      } else {
        if (typeof a[sortBy] === 'number' && typeof b[sortBy] === 'number') {
          return a[sortBy] - b[sortBy];
        } else if (typeof a[sortBy] === 'string' && typeof b[sortBy] === 'string') {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return 0;
      }
    }),
    payload.search
  );
}

export function toFixedIfNecessary(value: string | number, dp: number) {
  if (typeof value === 'string') {
    return +parseFloat(value).toFixed(dp);
  } else {
    return +value.toFixed(dp);
  }
}
