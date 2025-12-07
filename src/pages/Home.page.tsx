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
import { useDisclosure, useToggle } from '@mantine/hooks';
import { ExchangeTable } from '@/components/Exchange.table';
import { ProfitTable } from '@/components/Profit.table.module';
import { getCurrencyPairsAndTrios } from '@/services/poewatch.service';
import classes from './Home.page.module.css';

export function HomePage() {
  const [tableData, setTableData] = useState<CurrencyPairsAndTriosResult>({ pairs: [], trios: [] });
  const [isLoading, toggleLoading] = useToggle();

  function fetchTableData() {
    toggleLoading();
    getCurrencyPairsAndTrios('Keepers').then((x) => {
      setTableData(x);
      toggleLoading();
    });
  }

  useMemo(() => fetchTableData(), []); // run on initial load

  return (
    <>
      <Card withBorder radius="md" p={'0'} className={classes.card}>
        <Tabs defaultValue="profit">
          <Group>
            <Tabs.List>
              <Tabs.Tab value="profit" leftSection={<IconTrendingUp size={12} />}>
                Profit
              </Tabs.Tab>
              <Tabs.Tab value="exchange" leftSection={<IconMoneybag size={12} />}>
                Exchange
              </Tabs.Tab>
            </Tabs.List>
            <Flex justify={'right'} px={'xs'} style={{ flexGrow: 1 }}>
              <RefreshButton onClick={fetchTableData} isLoading={isLoading} />
            </Flex>
          </Group>
          <Tabs.Panel value="exchange">
            <ExchangeTable tableData={tableData.pairs} />
          </Tabs.Panel>
          <Tabs.Panel value="profit">
            <ProfitTable tableData={tableData.trios} />
          </Tabs.Panel>
        </Tabs>
      </Card>
    </>
  );
}

interface RefreshButtonProps {
  onClick: () => void;
  isLoading: boolean;
  style?: MantineStyleProp;
}

export function RefreshButton({ onClick, isLoading, style }: RefreshButtonProps) {
  return (
    <ActionIcon
      style={style}
      size={'sm'}
      color="gray"
      variant="transparent"
      onClick={onClick}
      loading={isLoading}
    >
      <IconRefresh className={classes.icon} />
    </ActionIcon>
  );
}
