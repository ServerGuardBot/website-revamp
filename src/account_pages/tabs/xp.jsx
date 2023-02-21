import React, { useState } from 'react';
import {
    createStyles, Title, Paper, Input, Grid, Group,
    Switch, Text, NumberInput, ActionIcon, ScrollArea,
    Table
} from '@mantine/core';
import { IconTrash } from '@tabler/icons';

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

export function XP({user, server}) {
    const { classes, cx } = useStyles();

    const [removeOldLevelRoles, setRemoveOldLevelRoles] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [announceLU, setAnnounceLU] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs

    const [roleXP, setRoleXP] = useState([
        {
            id: 0,
            name: '@everyone',
            xp: 0,
        }
    ]);

    function xpUpdater(id) {
        return (val) => {
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
                        <ActionIcon color="red">
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
                                onChange={(event) => setRemoveOldLevelRoles(event.currentTarget.checked)}
                                className={classes.inputGap}
                                disabled
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="announce_level_up" label="Announce Level Up" description="Announces that the user leveled up, in the channel where they leveled up from">
                            <Switch
                                checked={announceLU}
                                onChange={(event) => setAnnounceLU(event.currentTarget.checked)}
                                className={classes.inputGap}
                                disabled
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
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
                                <tbody>{levelRows}</tbody>
                            </Table>
                        </ScrollArea.Autosize>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}