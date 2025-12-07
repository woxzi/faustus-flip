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
import classes from './TableBase.module.css';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}
export function TableHeader({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
