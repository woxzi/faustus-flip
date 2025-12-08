import { useMemo, useState } from 'react';
import { IconMoneybag, IconRefresh, IconTrendingUp } from '@tabler/icons-react';
import {
  ActionIcon,
  ActionIconProps,
  Card,
  Checkbox,
  Divider,
  Flex,
  Group,
  MantineStyleProp,
  Tabs,
} from '@mantine/core';
import { useToggle } from '@mantine/hooks';
import { ExchangeTable } from '@/components/Exchange.table';
import { ProfitTable } from '@/components/Profit.table';
import { getCurrencyPairsAndTrios } from '@/services/poewatch.service';
import classes from './Home.page.module.css';

export function HomePage() {
  const [tableData, setTableData] = useState<CurrencyPairsAndTriosResult>({ pairs: [], trios: [] });
  const [isLoading, toggleLoading] = useToggle();

  const [ignoreLowConfidence, setIgnoreLowConfidence] = useState(true);

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
            <Flex justify={'right'} px={'xs'} style={{ flexGrow: 1 }} columnGap={'sm'}>
              <Checkbox
                checked={ignoreLowConfidence}
                label="Ignore Low Confidence"
                onChange={(event) => setIgnoreLowConfidence(event.currentTarget.checked)}
              />
              <Divider orientation="vertical" />
              <RefreshButton onClick={fetchTableData} isLoading={isLoading} size={'sm'} />
            </Flex>
          </Group>
          <Tabs.Panel value="exchange">
            <ExchangeTable tableData={tableData.pairs} ignoreLowConfidence={ignoreLowConfidence} />
          </Tabs.Panel>
          <Tabs.Panel value="profit">
            <ProfitTable tableData={tableData.trios} ignoreLowConfidence={ignoreLowConfidence} />
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
  size?: ActionIconProps['size'];
}

export function RefreshButton({ onClick, isLoading, style, size }: RefreshButtonProps) {
  return (
    <ActionIcon
      style={style}
      size={size}
      color="gray"
      variant="transparent"
      onClick={onClick}
      loading={isLoading}
    >
      <IconRefresh className={classes.icon} />
    </ActionIcon>
  );
}
