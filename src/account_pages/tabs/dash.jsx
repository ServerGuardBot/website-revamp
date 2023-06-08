import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Title, Paper, Input, Select, Tooltip, Grid, Table, Avatar, ScrollArea, Button, Group,
    Checkbox, ActionIcon, TextInput, Switch
} from '@mantine/core';
import { IconAlertCircle, IconTrash } from '@tabler/icons';
import { SetupWizard } from './setup_wizard.jsx';
import { getLanguages, translate } from '../../translator.jsx';
import { getServerInfo } from '../../server_info.jsx';
import { generateRoles, API_BASE_URL } from '../../helpers.jsx';
import { authenticated_get } from '../../auth.jsx';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        marginTop: theme.spacing.xl,

        '&:first-child': {
            marginTop: 0,
        },
    },

    danger: {
        backgroundColor: theme.colors.red[6],
        borderColor: theme.colors.red[9],
    },

    nonRelative: {
        position: 'unset',
    },

    setupTitle: {
        color: theme.white,
    },

    setupDescription: {
        color: theme.white,
    },

    setupButton: {
        marginLeft: 'auto',
        marginTop: theme.spacing.xs,
    },


    table: {
        borderRadius: theme.radius.sm,
        overflow: 'hidden',
    },

    tableHeader: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',
        
        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `1px solid ${
                theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
            }`,
        },
    },

    tableScrolled: {
        boxShadow: theme.shadows.sm,
    },

    title: {
        marginBottom: theme.spacing.sm,
    },
}));

export function Dash({user, server, config, updateConfig}) {
    const { classes, theme, cx } = useStyles();

    const [rolePermissions, setRolePermissions] = useState([]);

    const [activity, setActivity] = useState([
        {
            user: {
                name: "Server Guard",
                avatar: "https://img.guildedcdn.com/UserAvatar/6dc417befe51bbca91b902984f113f89-Medium.webp?w=240&h=240",
            },
            logged_at: (new Date()).toISOString(),
            action: "Recent Activity Feature Not Yet Implemented"
        },
    ]);

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

                authenticated_get(`${API_BASE_URL}servers/${server.id}/activity`)
                    .then((request) => {
                        if (request.status == 200) {
                            request.text().then((txt) => {
                                let act = JSON.parse(txt);
                                for (let index = 0; index < act.length; index++) {
                                    const item = act[index];
                                    const actionData = item.action;
                                    item.logged_at = (new Date(item.logged_at * 1000)).toISOString();
                                    if (actionData.translation_keys?.role !== undefined) {
                                        let roleData = null;
                                        if (data?.team?.rolesById !== undefined) {
                                            console.log(typeof data.team.rolesById);
                                            roleData = data.team.rolesById?.[actionData.translation_keys.role] || null;
                                        }
                                        actionData.translation_keys.role = roleData?.name || `<@${actionData.translation_keys.role}>`;
                                    }
                                    if (actionData.action_type == 'channel') {
                                        actionData.translation_keys.value = config?.__cache?.channels?.[actionData.translation_keys.value]?.name || `<#${actionData.translation_keys.value}>`;
                                    }
                                    item.action = translate(`activity.action.${actionData.action}`, actionData.translation_keys);
                                }

                                setActivity(act);
                            });
                        }
                    });
            });
    }, []);
    const serverRoles = generateRoles(serverData?.team?.rolesById);

    const [showSetupWizard, setShowSetupWizard] = useState(false);
    const [validLangs, setValidLangs] = useState([]);

    const [blockUntrustedImages, setBUI] = useState(config?.untrusted_block_images == 1);

    function rolePermUpdater(id, perm) {
        return () => {
            let newPerms = []
            for (let i = 0; i < rolePermissions.length; i++) {
                let role = rolePermissions[i];
                if (role.id == id) {
                    let updatedPerms = [];
                    if (role.perms.indexOf(perm) > -1) {
                        for (let k = 0; k < role.perms.length; k++) {
                            let otherPerm = role.perms[k];
                            if (otherPerm != perm) {
                                updatedPerms.push(otherPerm);
                            }
                        }
                    } else {
                        for (let k = 0; k < role.perms.length; k++) {
                            updatedPerms.push(role.perms[k]);
                        }
                        updatedPerms.push(perm);
                    }

                    newPerms[i] = {
                        id: role.id,
                        name: role.name,
                        perms: updatedPerms,
                    };
                } else {
                    newPerms[i] = {
                        id: role.id,
                        name: role.name,
                        perms: role.perms,
                    }
                }
            }
            setRolePermissions(newPerms);
            if (perm != 'Trusted') {
                updateConfig('roles', newPerms);
            }
            if (perm == 'Trusted') {
                updateConfig('trusted_roles', newPerms);
            }
        }
    }

    var timezones = [];
    const supportedTimezones = Intl.supportedValuesOf('timeZone');
    for (var i = 0; i < supportedTimezones.length; i++) {
        let tz = supportedTimezones[i];
        timezones.push({
            value: tz,
            label: tz,
        })
    }

    const activityRows = activity.map((item) => {
        return (
            <tr key={item.id}>
                <td width={32}>
                    <Tooltip label={item.user.name} position="bottom-middle" withArrow>
                        <Avatar className={classes.nonRelative} size={26} src={item.user.avatar} radius={26} />
                    </Tooltip>
                </td>
                <td width={160}>
                    {(new Date(item.logged_at)).toLocaleString(navigator.language)}
                </td>
                <td>
                    {item.action}
                </td>
            </tr>
        )
    });

    const rolePermRows = rolePermissions.map((item) => {
        return (
            <tr key={item.id}>
                <td>{item.name}</td>
                <td width={50}>
                    <Checkbox checked={item.perms.indexOf('Moderator') > -1} onChange={rolePermUpdater(item.id, 'Moderator')} />
                </td>
                <td width={50}>
                    <Checkbox checked={item.perms.indexOf('Admin') > -1} onChange={rolePermUpdater(item.id, 'Admin')} />
                </td>
                <td width={50}>
                    <Checkbox checked={item.perms.indexOf('Trusted') > -1} onChange={rolePermUpdater(item.id, 'Trusted')} />
                </td>
                <td width={80}>
                    <Group spacing={0} position="right">
                        <ActionIcon color="red" onClick={() => {
                            let newRolePerms = [];
                            for (let i = 0; i < rolePermissions.length; i++) {
                                let role = rolePermissions[i];
                                if (role.id == item.id) continue;
                                newRolePerms.push(role);
                            }
                            setRolePermissions(newRolePerms);
                            updateConfig('roles', newRolePerms);
                            updateConfig('trusted_roles', newRolePerms);
                        }}>
                            <IconTrash size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        )
    })

    const [activitiesScrolled, setActivitiesScrolled] = useState(false);
    const [rolePermScrolled, setRolePermScrolled] = useState(false);

    const [muteRole, setMuteRole] = useState((config?.mute_role !== undefined) ? config.mute_role.toString() : null);

    const enableProtectedBanner = false;
    var unprotectedBanner = (
        <></>
    ) // Empty unless it is detected to be unconfigured or possibly poorly configured

    if (Object.keys(config).length == 0 && enableProtectedBanner) {
        unprotectedBanner = (
            <Paper
                radius="md"
                withBorder
                p="md"
                className={cx(classes.paper, classes.danger)}
            >
                <Title order={1} className={classes.setupTitle}>Unprotected Server</Title>
                <Text size="lg" className={classes.setupDescription}>Hey there! Your server hasn't been configured for Server Guard to protect you, why not get started with our setup wizard?</Text>
                <Group w="100%">
                    <Button
                        className={classes.setupButton}
                        variant="white"
                        color="dark"
                        size="sm"
                        onClick={() => setShowSetupWizard(true)}
                    >
                        Start Setup
                    </Button>
                </Group>
            </Paper>
        )
    }

    function switchChanged(field, updater) {
        return (event) => {
            updater(event.currentTarget.checked);
            updateConfig(field, event.currentTarget.checked);
        }
    }

    useEffect(() => {
        getLanguages()
            .then((langs) => {
                let newLangs = [];
                for (const [index, value] of Object.entries(langs)) {
                    newLangs.push({
                        value: index,
                        label: value,
                    });
                }
                setValidLangs(newLangs);
            })
    }, []);

    return (
        <div>
            <SetupWizard opened={showSetupWizard} setOpened={setShowSetupWizard} />
            {unprotectedBanner}
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title className={classes.title} order={2}>Settings</Title>
                <Grid grow columns={2}>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="nickname" label="Nickname">
                            <TextInput
                                disabled
                                placeholder="Server Guard"
                                rightSection={
                                    <Tooltip label="Coming Soon" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="timezone" label="Timezone">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                data={timezones}
                                rightSection={
                                    <Tooltip label="Coming Soon" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="language" label="Server Language" description="The language that things like logs will be outputted in">
                            <Select
                                placeholder="Pick one"
                                defaultValue={config?.language || 'en'}
                                searchable
                                withinPortal
                                nothingFound="No options"
                                data={validLangs}
                                mt={theme.spacing.sm}
                                rightSection={
                                    <Tooltip label="Not Yet Functional" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                                onChange={(value) => {
                                    updateConfig('language', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="mute_role" label="Muted Role" description="The role that will be added to muted users">
                            <Select
                                placeholder="Pick one"
                                disabled={serverRoles.length == 0}
                                searchable
                                withinPortal
                                nothingFound="No options"
                                data={serverRoles}
                                mt={theme.spacing.sm}
                                value={muteRole}
                                onChange={(value) => {
                                    setMuteRole(value);
                                    updateConfig('mute_role', parseInt(value));
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Title className={classes.title} order={2}>Recent Activity</Title>
                        <ScrollArea.Autosize
                            w="100%"
                            className={classes.table}
                            maxHeight={51*10}
                            onScrollPositionChange={({ y }) => setActivitiesScrolled(y !== 0)}
                            scrollbarSize={6}
                        >
                            <Table width="100%" verticalSpacing="sm">
                                <thead className={cx(classes.tableHeader, { [classes.tableScrolled]: activitiesScrolled })}>
                                    <tr>
                                        <th>User</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>{activityRows}</tbody>
                            </Table>
                        </ScrollArea.Autosize>
                    </Grid.Col>
                </Grid>
            </Paper>
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title className={classes.title} order={2}>Role Permissions</Title>
                <Grid columns={2}>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="untrusted_block_images" label="Block Untrusted Images" description="Blocks images from untrusted users">
                            <Switch
                                mt={theme.spacing.sm}
                                checked={blockUntrustedImages}
                                onChange={switchChanged('untrusted_block_images', setBUI)}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
                <ScrollArea.Autosize
                    w="100%"
                    className={classes.table}
                    mt={theme.spacing.sm}
                    maxHeight={51*10}
                    onScrollPositionChange={({ y }) => setRolePermScrolled(y !== 0)}
                    scrollbarSize={6}
                >
                    <Table width="100%" verticalSpacing="sm">
                        <thead className={cx(classes.tableHeader, { [classes.tableScrolled]: rolePermScrolled })}>
                            <tr>
                                <th>Role</th>
                                <th>Moderator</th>
                                <th>Admin</th>
                                <th>Trusted</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {rolePermRows}
                            {serverRoles.length > 0 && (
                                <tr key='add_new_role'>
                                    <td>
                                        <Select
                                            placeholder="Add role"
                                            searchable
                                            nothingFound="No options"
                                            withinPortal
                                            value={null}
                                            data={(() => {
                                                let newRoleList = [];
                                                role: for (let i = 0; i < serverRoles.length; i++) {
                                                    let sRole = serverRoles[i];
                                                    for (let i = 0; i < rolePermissions.length; i++) {
                                                        let role = rolePermissions[i];
                                                        if (role.id == sRole.id) continue role;
                                                    }
                                                    newRoleList.push(sRole);
                                                }
                                                return newRoleList;
                                            })()}
                                            onChange={(value) => {
                                                let newRolePerms = [];
                                                for (let i = 0; i < rolePermissions.length; i++) {
                                                    let role = rolePermissions[i];
                                                    newRolePerms.push(role);
                                                }
                                                
                                                for (let i = 0; i < serverRoles.length; i++) {
                                                    let role = serverRoles[i];
                                                    if (role.value == parseInt(value)) {
                                                        newRolePerms.push({
                                                            id: role.value,
                                                            name: role.label,
                                                            perms: [],
                                                        });
                                                    }
                                                }
                                                setRolePermissions(newRolePerms);
                                                updateConfig('roles', newRolePerms);
                                                updateConfig('trusted_roles', newRolePerms);
                                            }}
                                        />
                                    </td>
                                    <td />
                                    <td />
                                    <td />
                                    <td />
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </ScrollArea.Autosize>
            </Paper>
        </div>
    )
}