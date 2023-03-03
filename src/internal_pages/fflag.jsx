import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Paper, Group, ScrollArea, Loader, TextInput, Table, Menu, Button, UnstyledButton, Center
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconFlag, IconLetterA, IconNumber } from '@tabler/icons';
import { keys } from '@mantine/utils';
import { authenticated_get } from '../auth.jsx';
import { API_BASE_URL } from '../helpers.jsx';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        marginTop: theme.spacing.xl,
    },

    danger: {
        backgroundColor: theme.colors.red[6],
        borderColor: theme.colors.red[9],
    },

    th: {
        padding: '0 !important',
    },
    
    control: {
        width: '100%',
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        
        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },
    
    icon: {
        width: 21,
        height: 21,
        borderRadius: 21,
    },    

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
}));

function Th({ children, reversed, sorted, onSort }) {
    const { classes } = useStyles();
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group position="apart">
                    <Text weight={500} size="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon size={14} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </th>
    );
}
    
function filterData(data, search) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
    );
}
    
function sortData(
    data,
    payload
) {
    const { sortBy } = payload;
    
    if (!sortBy) {
        return filterData(data, payload.search);
    }
    
    return filterData(
        [...data].sort((a, b) => {
            if (payload.reversed) {
                return b[sortBy].localeCompare(a[sortBy]);
            }
            
            return a[sortBy].localeCompare(b[sortBy]);
        }),
        payload.search
    );
}
            
function TableSort({ data }) {
    const { theme } = useStyles();

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(data, { sortBy: field, reversed, search }));
    };

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const rows = sortedData.map((row) => (
        <tr key={row.flag}>
            <td>{row.type}</td>
            <td>{row.flag}</td>
            <td>{row.value}</td>
        </tr>
    ));
    
    return (
        <ScrollArea>
            <Group spacing="sm">
                <TextInput
                    placeholder="Search by any field"
                    mb="md"
                    icon={<IconSearch size={14} stroke={1.5} />}
                    value={search}
                    onChange={handleSearchChange}
                    sx={{flexGrow: 1, marginBottom: '0 !important'}}
                />
                <Menu transition="pop-bottom-right" position="bottom-end" width={220} withinPortal>
                    <Menu.Target>
                        <Button rightIcon={<IconChevronDown size={18} stroke={1.5} />} pr={12}>
                            Create new
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item
                            icon={<IconFlag size={16} color={theme.colors.blue[6]} stroke={1.5} />}
                            rightSection={
                                <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                                    Ctrl + F
                                </Text>
                            }
                        >
                            Flag
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconLetterA size={16} color={theme.colors.blue[6]} stroke={1.5} />}
                            rightSection={
                                <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                                    Ctrl + S
                                </Text>
                            }
                        >
                            String
                        </Menu.Item>
                        <Menu.Item
                            icon={<IconNumber size={16} color={theme.colors.blue[6]} stroke={1.5} />}
                            rightSection={
                                <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                                    Ctrl + I
                                </Text>
                            }
                        >
                            Int
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
            <Table
                horizontalSpacing="md"
                verticalSpacing="xs"
                mt="sm"
                sx={{ tableLayout: 'fixed', minWidth: 700, borderRadius: theme.radius.sm, overflow: 'hidden' }}
            >
                <thead>
                    <tr>
                        <Th
                            sorted={sortBy === 'type'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('type')}
                        >
                            Type
                        </Th>
                        <Th
                            sorted={sortBy === 'flag'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('flag')}
                        >
                            Flag
                        </Th>
                        <Th
                            sorted={sortBy === 'value'}
                            reversed={reverseSortDirection}
                            onSort={() => setSorting('value')}
                        >
                            Value
                        </Th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length > 0 ? (
                        rows
                        ) : (
                            <tr>
                                <td colSpan={Object.keys(data[0]).length}>
                                    <Text weight={500} align="center">
                                        Nothing found
                                    </Text>
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>
    </ScrollArea>
    );
}

export function FFlags({ user }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(true);

    // useEffect(() => {
    //     authenticated_get(API_BASE_URL + 'analytics/servers/dash/30')
    //         .then((response) => {
    //             response.text()
    //                 .then((txt) => {
    //                     const json = JSON.parse(txt);
    //                     setLoaded(true);
    //                 });
    //         });
    // }, []);

    return (
        <div>
            {
                (!loaded) && (
                    <div className={classes.loading}>
                        <Loader size='xl' variant='dots' />
                    </div>
                ) || (
                    <>
                        
                        <Paper
                            radius="md"
                            withBorder
                            p="sm"
                            className={classes.paper}
                        >
                            <TableSort data={[
                                {
                                    type: 1,
                                    flag: 'testFlag',
                                    value: true,
                                },
                            ]} />
                        </Paper>
                    </>
                )
            }
        </div>
    )
}