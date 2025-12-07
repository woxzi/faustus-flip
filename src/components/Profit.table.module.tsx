import { useMemo, useState } from 'react';
import { IconInfoCircle, IconSearch } from '@tabler/icons-react';
import cx from 'clsx';
import { Center, ScrollArea, Table, TextInput, Tooltip, useMantineTheme } from '@mantine/core';
import { sortData, toFixedIfNecessary, toTitleCase } from '@/helpers';
import { TableHeader } from './TableBase';
import classes from './Profit.table.module.css';

interface ProfitTableProps {
  tableData: CurrencyTrio[];
}
export function ProfitTable({ tableData }: ProfitTableProps) {
  const [scrolled, setScrolled] = useState(false);
  const theme = useMantineTheme();

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(tableData);
  const [sortBy, setSortBy] = useState<keyof CurrencyTrio | null>('profit');
  const [reverseSortDirection, setReverseSortDirection] = useState(true);

  const setSorting = (field: keyof CurrencyTrio) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(tableData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setSortedData(sortData(tableData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  useMemo(() => {
    setSortedData(sortData(tableData, { sortBy, reversed: reverseSortDirection, search }));
  }, [tableData]);

  const rows = sortedData.map((trio, index) => (
    <Table.Tr key={trio.currency_name} className={classes.trheader}>
      <Table.Td>
        {trio.low_confidence && (
          <Center>
            <Tooltip label="Currency pair has low confidence">
              <IconInfoCircle size={'1rem'} color={theme.colors.orange[3]} />
            </Tooltip>
          </Center>
        )}
      </Table.Td>
      <Table.Td>{toTitleCase(trio.currency_name)}</Table.Td>
      <Table.Td>{`${toFixedIfNecessary(trio.profit, 2)}c`}</Table.Td>
      <Table.Td>{trio.chaos_value < trio.div_value ? 'Chaos → Div' : 'Div → Chaos'}</Table.Td>
      <Table.Td>{`${toFixedIfNecessary(trio.chaos_value, 2)}c`}</Table.Td>
      <Table.Td>{`${toFixedIfNecessary(trio.div_value, 2)}c`}</Table.Td>
      <Table.Td>{toFixedIfNecessary(trio.chaos_volume_traded, 2).toLocaleString()}</Table.Td>
      <Table.Td>{toFixedIfNecessary(trio.div_volume_traded, 2).toLocaleString()}</Table.Td>
    </Table.Tr>
  ));

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchChange((e.target as any).search.value);
    console.log('searched', (e.target as any).search.value);
  };

  return (
    <>
      <form onSubmit={submitSearch}>
        <TextInput
          leftSection={<IconSearch className={classes.icon} />}
          placeholder="Search..."
          variant="default"
          name="search"
        />
      </form>
      <ScrollArea h={'85dvh'} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        <Table miw={700} striped highlightOnHover>
          <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
              <Table.Th></Table.Th>
              <TableHeader
                sorted={sortBy === 'currency_name'}
                onSort={() => setSorting('currency_name')}
                reversed={reverseSortDirection}
              >
                Name
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'profit'}
                onSort={() => setSorting('profit')}
                reversed={reverseSortDirection}
              >
                Profit
              </TableHeader>
              <Table.Th>Direction</Table.Th>
              <TableHeader
                sorted={sortBy === 'chaos_value'}
                onSort={() => setSorting('chaos_value')}
                reversed={reverseSortDirection}
              >
                Chaos Value
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'div_value'}
                onSort={() => setSorting('div_value')}
                reversed={reverseSortDirection}
              >
                Div Value
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'chaos_volume_traded'}
                onSort={() => setSorting('chaos_volume_traded')}
                reversed={reverseSortDirection}
              >
                Chaos Volume Traded
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'div_volume_traded'}
                onSort={() => setSorting('div_volume_traded')}
                reversed={reverseSortDirection}
              >
                Div Volume Traded
              </TableHeader>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
