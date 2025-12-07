import { useMemo, useState } from 'react';
import { IconInfoCircle, IconSearch } from '@tabler/icons-react';
import cx from 'clsx';
import {
  Center,
  Flex,
  ScrollArea,
  Table,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { sortData, toFixedIfNecessary, toTitleCase } from '@/helpers';
import { TableHeader } from './TableBase';
import classes from './Exchange.table.module.css';

interface ExchangeTableProps {
  tableData: CurrencyPair[];
}
export function ExchangeTable({ tableData }: ExchangeTableProps) {
  const [scrolled, setScrolled] = useState(false);
  const theme = useMantineTheme();

  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(tableData);
  const [sortBy, setSortBy] = useState<keyof CurrencyPair | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field: keyof CurrencyPair) => {
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

  const rows = sortedData.map((pair, index) => (
    <Table.Tr
      key={`${index}-${pair.first_currency}-${pair.second_currency}`}
      className={classes.trheader}
    >
      <Table.Td>
        {pair.low_confidence && (
          <Center>
            <Tooltip label="Currency pair has low confidence">
              <IconInfoCircle size={'1rem'} color={theme.colors.orange[3]} />
            </Tooltip>
          </Center>
        )}
      </Table.Td>
      <Table.Td>{toTitleCase(pair.first_currency)}</Table.Td>
      <Table.Td>{toTitleCase(pair.second_currency)}</Table.Td>
      <Table.Td>{`${pair.first_currency_ratio_amount}:${pair.second_currency_ratio_amount}`}</Table.Td>
      <Table.Td>
        {Number.isInteger(pair.primary_currency_value)
          ? pair.primary_currency_value
          : toFixedIfNecessary(pair.primary_currency_value, 2)}
        c
      </Table.Td>
      <Table.Td>{pair.quantity_traded.toLocaleString()}</Table.Td>
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
                sorted={sortBy === 'first_currency'}
                onSort={() => setSorting('first_currency')}
                reversed={reverseSortDirection}
              >
                Currency 1
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'second_currency'}
                onSort={() => setSorting('second_currency')}
                reversed={reverseSortDirection}
              >
                Currency 2
              </TableHeader>
              <Table.Th>Ratio</Table.Th>
              <TableHeader
                sorted={sortBy === 'primary_currency_value'}
                onSort={() => setSorting('primary_currency_value')}
                reversed={reverseSortDirection}
              >
                Chaos Per Unit
              </TableHeader>
              <TableHeader
                sorted={sortBy === 'quantity_traded'}
                onSort={() => setSorting('quantity_traded')}
                reversed={reverseSortDirection}
              >
                Quantity Traded
              </TableHeader>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
