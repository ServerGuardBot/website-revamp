import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Paper, Group, Loader, TextInput,
    Button, Stack, ActionIcon, Input, Modal, Title, Select, Grid
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons';
import { authenticated_delete, authenticated_get, authenticated_patch, authenticated_post } from '../../auth.jsx';
import { API_BASE_URL, generateChannels, generateRoles } from '../../helpers.jsx';
import { getServerInfo } from '../../server_info.jsx';

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

export function Giveaways({ user, server, config, updateConfig }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [activeGiveaways, setAG] = useState([]);
    const [pingRole, setPingRole] = useState([]);

    const serverChannels = generateChannels(config?.__cache?.channels, ['chat', 'voice']);
    const [serverData, setServerData] = useState({});
    useEffect(() => {
        getServerInfo(server.id)
            .then((data) => {
                setServerData(data);

                let roles = [];
                let rolesList = config?.roles || [];
                let trustedRoles = config?.trusted_roles || [];
                let handled = [];

                for (let i = 0; i < rolesList.length; i++) {
                    let role = rolesList[i];
                    let sRole;
                    for (const [id, r] of Object.entries(data?.team?.rolesById || {})) {
                        if (r.id == ((typeof role.id == 'string') ? parseInt(role.id) : role.id)) {
                            sRole = r;
                            break
                        }
                    }
                    if (sRole == undefined) continue;

                    let perms = []

                    if (role.level >= 0) {
                        perms.push('Moderator');
                    }
                    if (role.level >= 1) {
                        perms.push('Admin');
                    }
                    if (trustedRoles.indexOf(role.id) > -1) {
                        perms.push('Trusted');
                    }

                    handled.push(parseInt(role.id));
                    roles.push({
                        id: (typeof role.id == 'string') ? parseInt(role.id) : role.id,
                        name: sRole.name,
                        'perms': perms,
                    });
                }

                for (let i = 0; i < trustedRoles.length; i++) {
                    let roleId = trustedRoles[i];

                    if (handled.indexOf((typeof roleId == 'string') ? parseInt(roleId) : roleId) > -1) continue;

                    let sRole;
                    for (const [id, r] of Object.entries(data?.team?.rolesById || {})) {
                        if (r.id == ((typeof roleId == 'string') ? parseInt(roleId) : roleId)) {
                            sRole = r;
                            break
                        }
                    }
                    if (sRole == undefined) continue;

                    roles.push({
                        id: (typeof roleId == 'string') ? parseInt(roleId) : roleId,
                        name: sRole.name,
                        'perms': ['Trusted'],
                    });
                }

                setRolePermissions(roles); // Only update role permissions once server data has loaded
            });
    }, []);
    const serverRoles = generateRoles(serverData?.team?.rolesById);

    useEffect(() => {
        authenticated_get(API_BASE_URL + `giveaways/${server.id}`)
            .then((response) => {
                response.text()
                    .then((txt) => {
                        const json = JSON.parse(txt);
                        setAG(json);
                        setLoaded(true);
                    });
            });
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
                            <Group position='apart' spacing="sm">
                                <Title order={1}>Giveaways</Title>
                                <Button display="none" onClick={() => console.log('Clicked create new')}>
                                    Create new
                                </Button>
                            </Group>
                            <Grid grow columns={2}>
                                <Grid.Col sm={2} md={1}>
                                    <Input.Wrapper id="ping_role" label="Ping Role" description="The role that will be pinged when a giveaway is hosted">
                                        <Select
                                            placeholder="Pick one"
                                            disabled={serverRoles.length == 0}
                                            searchable
                                            withinPortal
                                            nothingFound="No options"
                                            data={serverRoles}
                                            mt={theme.spacing.sm}
                                            value={pingRole}
                                            onChange={(value) => {
                                                setPingRole(value);
                                                updateConfig('giveaway_ping', parseInt(value));
                                            }}
                                        />
                                    </Input.Wrapper>
                                </Grid.Col>
                                <Grid.Col sm={2} md={1}>
                                    <Input.Wrapper id="giveaway_channel" label="Giveaway Channel" description="The channel all giveaways will be posted in">
                                        <Select
                                            disabled={serverChannels.length == 0}
                                            placeholder="Pick one"
                                            searchable
                                            withinPortal
                                            nothingFound="No options"
                                            value={config?.giveaway_channel}
                                            data={serverChannels}
                                            mt={theme.spacing.sm}
                                            onChange={(value) => {
                                                updateConfig('giveaway_channel', value);
                                            }}
                                        />
                                    </Input.Wrapper>
                                </Grid.Col>
                            </Grid>
                            <Stack mt="lg">
                                {activeGiveaways.map((item => {
                                    return (
                                        <div style={{
                                            borderRadius: theme.radius.md,
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            padding: theme.spacing.xs,
                                            backgroundColor: theme.colors.dark[7]
                                        }}>
                                            <Group w="100%">
                                                <div style={{flexGrow: 1, flexShrink: 0}}>
                                                    <Text size="lg" pos="relative">{item.prize}</Text>
                                                    <Text size="sm" color="dimmed" pos="relative">Ends at {(new Date(item.ends_at * 1000)).toLocaleDateString()}</Text>
                                                </div>
                                                <Group w={60} sx={{flexGrow: 0, flexShrink: 1, display: 'none'}} spacing={0} position="right">
                                                    <ActionIcon onClick={() => {
                                                        
                                                    }}>
                                                        <IconEdit size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                    <ActionIcon color="red" onClick={() => {
                                                        
                                                    }}>
                                                        <IconTrash size={18} stroke={1.5} />
                                                    </ActionIcon>
                                                </Group>
                                            </Group>
                                        </div>
                                    )
                                }))}
                            </Stack>
                        </Paper>
                    </>
                )
            }
        </div>
    )
}