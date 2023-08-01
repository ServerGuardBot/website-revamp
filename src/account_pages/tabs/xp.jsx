import React, { useState, useEffect } from 'react';
import {
    createStyles, Title, Paper, Input, Grid, Group,
    Switch, Text, NumberInput, ActionIcon, ScrollArea,
    Table, Select
} from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { generateRoles } from '../../helpers.jsx';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        marginTop: theme.spacing.xl,

        '&:first-child': {
            marginTop: 0,
        },
    },

    danger: {
        backgroundColor: theme.colors.red[7],
        borderColor: theme.colors.red[9],
    },

    nonRelative: {
        position: 'unset',
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

    inputGap: {
        marginTop: theme.spacing.xs,
    },
}));

export function XP({user, server, config, updateConfig}) {
    const { classes, cx } = useStyles();

    useEffect(() => {
        let gain = config?.xp_gain || {'-1': 0};

        let xp = [];

        for (const [id, amt] of Object.entries(gain)) {
            let roleId = parseInt(id);
            let roleName;

            if (roleId == -1) {
                roleName = '@everyone';
            } else {
                for (const [id, r] of Object.entries(config?.__cache?.roles || {})) {
                    if (r.id == roleId) {
                        roleName = r.name;
                        break
                    }
                }
            }

            xp.push({
                id: roleId,
                name: roleName,
                xp: amt,
            });
        }

        setRoleXP(xp);
    }, []);

    const serverRoles = generateRoles(config?.__cache?.roles);

    const [removeOldLevelRoles, setRemoveOldLevelRoles] = useState(config?.xp_remove_old == 1);
    const [announceLU, setAnnounceLU] = useState(config?.xp_announce_lu == 1);

    function switchChanged(field, updater) {
        return (event) => {
            updater(event.currentTarget.checked);
            updateConfig(field, event.currentTarget.checked);
        }
    }

    const [roleXP, setRoleXP] = useState([]);

    function xpUpdater(id) {
        return (val) => {
            val = (val == undefined) ? 0 : val;
            var newRoleXP = [];
            for (let i = 0; i < roleXP.length; i++) {
                let role = roleXP[i];
                if (role.id == id) {
                    newRoleXP.push({
                        id: id,
                        name: role.name,
                        xp: val,
                    });
                } else {
                    newRoleXP.push({
                        id: role.id,
                        name: role.name,
                        xp: role.xp,
                    });
                }
            }
            setRoleXP(newRoleXP);
            updateConfig('xp_gain', newRoleXP);
        }
    }

    const levelRows = roleXP.map((item) => {
        return (
            <tr key={item.id}>
                <td>
                    <Text>{item.name}</Text>
                </td>
                <td>
                    <NumberInput
                        placeholder="0"
                        defaultValue={item.xp}
                        onChange={xpUpdater(item.id)}
                    />
                </td>
                <td width={80}>
                    <Group spacing={0} position="right">
                        <ActionIcon color="red" onClick={() => {
                            let xp = [];
                            for (let i = 0; i < roleXP.length; i++) {
                                let role = roleXP[i];
                                if (role.id == item.id) continue;
                                xp.push(role);
                            }
                            setRoleXP(xp);
                            updateConfig('xp_gain', xp);
                        }}>
                            <IconTrash size={18} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                </td>
            </tr>
        )
    });

    const [roleListScrolled, setRoleListScrolled] = useState(false);

    return (
        <div>
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title className={classes.title} order={2}>Settings</Title>
                <Grid grow columns={2}>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="remove_old_roles" label="Remove Old Level Roles" description="When a user gains a level, the bot will try to remove any known old previous level roles">
                            <Switch
                                checked={removeOldLevelRoles}
                                onChange={switchChanged('xp_remove_old', setRemoveOldLevelRoles)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="announce_level_up" label="Announce Level Up" description="Announces that the user leveled up, in the channel where they leveled up from">
                            <Switch
                                checked={announceLU}
                                onChange={switchChanged('xp_announce_lu', setAnnounceLU)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Title className={classes.title} order={3} mb={2}>Role XP Gain</Title>
                        <Text color="dimmed" size="md" mb="sm">Grant certain roles (or everyone) XP when they speak. Limits gains to once per minute.</Text>
                        <ScrollArea.Autosize
                            w="100%"
                            className={classes.table}
                            maxHeight={51*10}
                            onScrollPositionChange={({ y }) => setRoleListScrolled(y !== 0)}
                            scrollbarSize={6}
                        >
                            <Table width="100%" verticalSpacing="sm">
                                <thead className={cx(classes.tableHeader, { [classes.tableScrolled]: roleListScrolled })}>
                                    <tr>
                                        <th>Role</th>
                                        <th>XP</th>
                                        <th/>
                                    </tr>
                                </thead>
                                <tbody>
                                    {levelRows}
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
                                                            for (let i = 0; i < roleXP.length; i++) {
                                                                let role = roleXP[i];
                                                                if (role.id == sRole.id) continue role;
                                                            }
                                                            newRoleList.push(sRole);
                                                        }
                                                        return newRoleList;
                                                    })()}
                                                    onChange={(value) => {
                                                        let xp = [];
                                                        for (let i = 0; i < roleXP.length; i++) {
                                                            let role = roleXP[i];
                                                            xp.push(role);
                                                        }
                                                        
                                                        for (let i = 0; i < serverRoles.length; i++) {
                                                            let role = serverRoles[i];
                                                            if (role.value == parseInt(value)) {
                                                                xp.push({
                                                                    id: role.value,
                                                                    name: role.label,
                                                                    xp: 0,
                                                                });
                                                            }
                                                        }
                                                        setRoleXP(xp);
                                                        updateConfig('xp_gain', xp);
                                                    }}
                                                />
                                            </td>
                                            <td />
                                            <td />
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </ScrollArea.Autosize>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}