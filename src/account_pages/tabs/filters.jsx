import React, { useState } from 'react';
import {
    createStyles, Title, Paper, Input, Select, Tooltip, Grid, Group,
    Switch,
    Slider,
    MultiSelect
} from '@mantine/core';
import { IconAlertCircle, IconStar } from '@tabler/icons';

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

    title: {
        marginBottom: theme.spacing.sm,
    },

    inputGap: {
        marginTop: theme.spacing.xs,
    },
}));

export function Filters({user, server, config, updateConfig}) {
    const { classes, theme } = useStyles();

    const [maliciousURLFilter, setMaliciousURLFilter] = useState(config?.url_filter == 1);
    const [inviteFilter, setInviteFilter] = useState(config?.invite_link_filter == 1);
    const [duplicateFilter, setDuplicateFilter] = useState(config?.automod_duplicate == 1);
    const [blacklistValue, setBlacklistValue] = useState(config?.filters || []);
    const [blacklistedWords, setBlacklistedWords] = useState(() => {
        const filters = config?.filters || [];
        let bl = [];
        for (let i = 0; i < filters.length; i++) {
            let item = filters[i];
            bl.push({
                value: item,
                label: item,
            });
        }
        return bl;
    });

    function switchChanged(field, updater) {
        return (event) => {
            updater(event.currentTarget.checked);
            updateConfig(field, event.currentTarget.checked);
        }
    }

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
                        <Input.Wrapper id="malicious_filter" label="Block Malicious URLs" description="Filters out known malicious URLs from a public database">
                            <Switch
                                checked={maliciousURLFilter}
                                onChange={switchChanged('url_filter', setMaliciousURLFilter)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="invite_filter" label="Block Invite Links" description="Blocks Discord & Guilded invite links">
                            <Switch
                                checked={inviteFilter}
                                onChange={switchChanged('invite_link_filter', setInviteFilter)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="duplicate_filter" label="Block Duplicate Text" description="Blocks duplicate or spammy text">
                            <Switch
                                checked={duplicateFilter}
                                onChange={switchChanged('automod_duplicate', setDuplicateFilter)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="spam" label="Spam" description="How many messages must be sent within 3 seconds of each other to trigger the spam filter">
                            <Slider
                                defaultValue={config?.automod_spam || 0}
                                step={1}
                                min={0}
                                max={8}
                                label={(value) => (value == 0) ? 'DISABLED' : value}
                                onChangeEnd={(value) => {
                                    updateConfig('automod_spam', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="toxicity" label="Toxicity Filter" description="How certain the bot must be of a toxicity detection to act on it">
                            <Slider
                                defaultValue={config?.toxicity || 0}
                                step={1}
                                min={0}
                                max={100}
                                label={(value) => (value == 0) ? 'DISABLED' : `${value}%`}
                                onChangeEnd={(value) => {
                                    updateConfig('toxicity', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="hatespeech" label="Hate-speech Filter" description="How certain the bot must be of a hate-speech detection to act on it">
                            <Slider
                                defaultValue={config?.hatespeech || 0}
                                step={1}
                                min={0}
                                max={100}
                                label={(value) => (value == 0) ? 'DISABLED' : `${value}%`}
                                onChangeEnd={(value) => {
                                    updateConfig('hatespeech', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="block_words" label="Word Blacklist" description="Blacklist words in messages, automatically detects potential variants of listed words.">
                            <MultiSelect
                                data={blacklistedWords}
                                value={blacklistValue}
                                placeholder="Add words"
                                creatable
                                searchable
                                getCreateLabel={(query) => `+ Add "${query.toLowerCase()}"`}
                                onCreate={(query) => {
                                    const item = { value: query.toLowerCase(), label: query.toLowerCase() };
                                    setBlacklistedWords((current) => [...current, item]);
                                    return item;
                                }}
                                onChange={(value) => {
                                    setBlacklistValue(value);
                                    setBlacklistedWords(() => {
                                        let list = [];
                                        for (let i = 0; i < value.length; i++) {
                                            list.push({
                                                'value': value[i],
                                                label: value[i],
                                            });
                                        }
                                        return list;
                                    })
                                    updateConfig('filters', value);
                                }}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}