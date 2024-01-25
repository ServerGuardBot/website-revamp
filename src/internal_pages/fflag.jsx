import React, { createRef, useCallback, useEffect, useState } from 'react';
import {
    createStyles, Text, Paper, Group, ScrollArea, Loader, TextInput, Table, Menu, Button, UnstyledButton, Center, Badge, Modal, NumberInput, Checkbox, Dialog, ActionIcon
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconFlag, IconLetterA, IconNumber, IconTrash } from '@tabler/icons';
import { keys } from '@mantine/utils';
import { authenticated_delete, authenticated_get, authenticated_patch, authenticated_post } from '../auth.jsx';
import { API_BASE_URL } from '../helpers.jsx';
import Keybind from '../keybind.jsx';

const flagTypes = [
    'String',
    'Int',
    'Flag',
    'String List',
    'Int List',
];
const flagColors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
];

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
        keys(data[0]).some((key) => (String(item[key]).toLowerCase().includes(query)))
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
            if (typeof b[sortBy] == "string" && typeof a[sortBy] !== "string") {
                a[sortBy] = String(a[sortBy]);
            }
            if (payload.reversed) {
                if (typeof b[sortBy] == "number" && typeof a[sortBy] == "number") {
                    return b[sortBy] - a[sortBy];
                }
                return b[sortBy].localeCompare(a[sortBy]);
            }

            if (typeof b[sortBy] == "number" && typeof a[sortBy] == "number") {
                return a[sortBy] - b[sortBy];
            }
            return a[sortBy].localeCompare(b[sortBy]);
        }),
        payload.search
    );
}

function countNonNull(dict) {
    let count = 0;
    for (const key in dict) {
        if (dict[key] !== null) {
            count++;
        }
    }
    return count;
}

function TableSort({ data, setfflags }) {
    const { theme } = useStyles();

    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(data);
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [flagModal, setFM] = useState(-1);
    const [fmData, setFMD] = useState({
        name: '',
        value: '',
    });
    const [changedData, setCD] = useState({});
    const [deleteModal, setDM] = useState(null);

    const createFlagBtn = createRef();

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

    const createFFlag = useCallback((type, flag, value) => {
        authenticated_post(API_BASE_URL + `fflags/${flag}`, JSON.stringify({
            value: value,
            type: type,
        }))
            .then((res) => {
                console.log(res);
                res.json()
                    .then((json) => {
                        setfflags([
                            ...data,
                            json,
                        ]);
                    });
            });
    }, [data, setfflags]);

    useEffect(() => {
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    }, [data]);
    

    const rows = sortedData.map((row) => (
        <tr
            key={row.flag}
            style={{
                backgroundColor: (changedData[row.flag] !== undefined && changedData[row.flag] !== null) ? theme.colors.blue[9] : undefined,
            }}
        >
            <td>{
                <Badge
                    variant="filled"
                    color={flagColors[row.type] || 'gray'}
                    size="lg"
                >
                    {flagTypes[row.type]}
                </Badge>    
            }</td>
            <td>{row.flag}</td>
            <td>{
                row.type == 0 &&
                <TextInput
                    value={(changedData[row.flag] !== undefined && changedData[row.flag] !== null) ? changedData[row.flag] : row.value}
                    onChange={(e) => setCD({
                        ...changedData,
                        [row.flag]: e.target.value !== row.value ? e.target.value : null,
                    })}
                /> ||
                row.type == 1 &&
                <NumberInput
                    value={(changedData[row.flag] !== undefined && changedData[row.flag] !== null) ? changedData[row.flag] : row.value}
                    onChange={(e) => setCD({
                        ...changedData,
                        [row.flag]: e !== row.value ? e : null,
                    })}
                /> ||
                row.type == 2 &&
                <Checkbox
                    checked={(changedData[row.flag] !== undefined && changedData[row.flag] !== null) ? changedData[row.flag] : row.value}
                    onChange={(e) => setCD({
                        ...changedData,
                        [row.flag]: e.target.checked !== row.value ? e.target.checked : null,
                    })}
                /> ||
                <Text>{row.value}</Text>
            }</td>
            <td>
                <ActionIcon
                    color="red"
                    size="md"
                    onClick={() => {
                        setDM(row.flag);
                    }}
                >
                    <IconTrash stroke={1.5} />
                </ActionIcon>
            </td>
        </tr>
    ));

    const clickCreateFlagBtn = useCallback((e) => {
        if (e.key == 'Enter') {
            if (createFlagBtn.current) {
                createFlagBtn.current.click();
            }
        }
    }, [createFlagBtn]);
    
    return (
        <>
            <Modal
                opened={deleteModal !== null}
                onClose={() => setDM(null)}
                title="Delete flag"
                centered
            >
                <Text align="center" mb="md">Are you sure you want to delete this flag?</Text>
                <Group position="center">
                    <Button
                        onClick={() => {
                            authenticated_delete(API_BASE_URL + `fflags/${deleteModal}`)
                                .then((res) => {
                                    let newFlags = [];
                                    for (let i in data) {
                                        if (data[i].flag != deleteModal) {
                                            newFlags.push(data[i]);
                                        }
                                    }
                                    setfflags(newFlags);
                                    setDM(null);
                                })
                        }}
                        color="red"
                    >
                        Delete
                    </Button>
                    <Button
                        variant="subtle"
                        color="gray"
                        onClick={() => setDM(null)}
                    >
                        Cancel
                    </Button>
                </Group>
            </Modal>
            <Modal
                opened={flagModal >= 0}
                onClose={() => setFM(-1)}
                title="Create new flag"
                centered
            >
                <TextInput
                    label="Name"
                    mb="md"
                    value={fmData.name}
                    data-autofocus
                    onChange={(e) => setFMD({
                        ...fmData,
                        name: e.target.value,
                    })}
                />
                {
                    flagModal == 0 && (
                        <TextInput
                            label="Value"
                            mb="md"
                            value={fmData.value}
                            onChange={(e) => setFMD({
                                ...fmData,
                                value: e.target.value,
                            })}
                            onKeyDown={clickCreateFlagBtn}
                        />
                    ) ||
                    flagModal == 1 && (
                        <NumberInput
                            label="Value"
                            mb="md"
                            value={fmData.value}
                            onChange={(e) => setFMD({
                                ...fmData,
                                value: e,
                            })}
                            onKeyDown={clickCreateFlagBtn}
                        />
                    ) ||
                    flagModal == 2 && (
                        <Checkbox
                            label="Value"
                            mb="md"
                            checked={fmData.value}
                            onChange={(e) => setFMD({
                                ...fmData,
                                value: e.target.checked,
                            })}
                        />
                    ) ||
                    (
                        <TextInput
                            label="Value"
                            mb="md"
                            value={fmData.value}
                            onChange={(e) => setFMD({
                                ...fmData,
                                value: e.target.value,
                            })}
                            onKeyDown={clickCreateFlagBtn}
                        />
                    )
                }
                <Group position="center">
                    <Button ref={createFlagBtn} onClick={() => {
                        createFFlag(flagModal, fmData.name, String(fmData.value));
                        setFM(-1);
                        setFMD({
                            name: '',
                            value: '',
                        });
                    }}>Create Flag</Button>
                </Group>
            </Modal>
            <Dialog opened={countNonNull(changedData) > 0} withCloseButton={false}>
                You have unsaved changes.
                <Group w="100%" position="right">
                    <Button
                        variant="subtle"
                        onClick={() => {
                            const len = Object.keys(changedData).length;
                            let count = 0;
                            let newData = [ ...data ];
                            for (let i in changedData) {
                                count++;
                                authenticated_patch(API_BASE_URL + `fflags/${i}`, JSON.stringify({
                                    value: changedData[i],
                                }))
                                    .then((res) => {
                                        res.json()
                                            .then((json) => {
                                                for (let j in newData) {
                                                    if (newData[j].flag == i) {
                                                        let t = json.type;
                                                        newData[j] = {
                                                            flag: i,
                                                            type: json.type,
                                                            value: 
                                                                t == 0 ? String(json.value) :
                                                                t == 1 ? Number(json.value) :
                                                                t == 2 ? json.value == "1" :
                                                                json.value,
                                                        };
                                                    }
                                                }
                                                if (count == len) {
                                                    setfflags(newData);
                                                    setCD({});
                                                }
                                            });
                                    })
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </Group>
            </Dialog>
            <Keybind ctrl name="f" callback={() => setFM(2)} />
            <Keybind ctrl name="s" callback={() => setFM(0)} />
            <Keybind ctrl name="i" callback={() => setFM(1)} />
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
                                icon={<IconFlag size={16} color={theme.colors.pink[6]} stroke={1.5} />}
                                rightSection={
                                    <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                                        Ctrl + F
                                    </Text>
                                }
                                onClick={() => {
                                    setFM(2);
                                    setFMD({
                                        name: '',
                                        value: '',
                                    });
                                }}
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
                                onClick={() => {
                                    setFM(0);
                                    setFMD({
                                        name: '',
                                        value: '',
                                    });
                                }}
                            >
                                String
                            </Menu.Item>
                            <Menu.Item
                                icon={<IconNumber size={16} color={theme.colors.green[6]} stroke={1.5} />}
                                rightSection={
                                    <Text size="xs" transform="uppercase" weight={700} color="dimmed">
                                        Ctrl + I
                                    </Text>
                                }
                                onClick={() => {
                                    setFM(1);
                                    setFMD({
                                        name: '',
                                        value: '',
                                    });
                                }}
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
                    sx={{ tableLayout: 'fixed', borderRadius: theme.radius.sm, overflow: 'hidden' }}
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
                            <th style={{width: "5%"}} />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? (
                            rows
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        <Text weight={500} align="center">
                                            Nothing found
                                        </Text>
                                    </td>
                                </tr>
                            )}
                    </tbody>
                </Table>
            </ScrollArea>
        </>
    );
}

export function FFlags({ user }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [fflags, setFFlags] = useState([]);

    useEffect(() => {
        authenticated_get(API_BASE_URL + 'fflags')
            .then((response) => {
                response.json()
                    .then((json) => {
                        setFFlags(json);
                        setLoaded(true);
                    })
                }
            )
    }, []);

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
                            <TableSort
                                data={fflags}
                                setfflags={(val) => {
                                    setFFlags(val);
                                }}
                            />
                        </Paper>
                    </>
                )
            }
        </div>
    )
}