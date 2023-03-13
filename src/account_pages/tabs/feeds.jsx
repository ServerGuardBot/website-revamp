import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Paper, Group, Loader, TextInput,
    Button, Stack, ActionIcon, Input, Modal, Title, Select
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons';
import { authenticated_delete, authenticated_get, authenticated_patch, authenticated_post } from '../../auth.jsx';
import { API_BASE_URL, generateChannels } from '../../helpers.jsx';
import { Blurhash } from 'react-blurhash';

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

export function Feeds({ user, server, config }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [feeds, setFeeds] = useState([]);
    const [feedDatas, setFeedDatas] = useState([]);

    const [modalOpened, setModalOpened] = useState(false);
    const [url, setURL] = useState('');
    const [feedID, setFeedID] = useState('');
    const [channel, setChannel] = useState('');
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState('');
    const [confirmDelete, setConfirmDelete] = useState('');

    const serverChannels = generateChannels(config?.__cache?.channels, ['chat', 'voice'], true);

    useEffect(() => {
        authenticated_get(API_BASE_URL + `feeds/${server.id}`)
            .then((response) => {
                response.text()
                    .then((txt) => {
                        const json = JSON.parse(txt);
                        setFeedDatas(json.feedDatas);
                        setFeeds(json.feeds);
                        setLoaded(true);
                    });
            });
    }, []);

    function getFeedData(id) {
        for (let index = 0; index < feedDatas.length; index++) {
            const element = feedDatas[index];
            if (element.id == id) {
                return element;
            }
        }
        return {
            url: ''
        }
    }

    return (
        <div>
            {
                (!loaded) && (
                    <div className={classes.loading}>
                        <Loader size='xl' variant='dots' />
                    </div>
                ) || (
                    <>
                        <Modal
                            opened={confirmDelete != ''}
                            onClose={() => setConfirmDelete('')}
                            title={`Delete "${confirmDelete}"?`}
                            size="auto"
                        >
                            <Text size="md">Are you sure you want to delete "{confirmDelete}"? This action is irreversible.</Text>
                            <Group position="center">
                                    <Button disabled={uploading} onClick={() => {
                                        setUploading(true);
                                        authenticated_delete(API_BASE_URL + `feeds/${server.id}/${confirmDelete}`)
                                            .then((response) => {
                                                if (response.status == 204) {
                                                    var newFeeds = [];
                                                    for (let index = 0; index < feeds.length; index++) {
                                                        const element = feeds[index];
                                                        if (element.id != confirmDelete) {
                                                            newFeeds.push(element);
                                                        }
                                                    }
                                                    setFeeds(newFeeds);
                                                    setUploading(false);
                                                    setConfirmDelete('');
                                                } else {
                                                    setUploading(false);
                                                }
                                            });
                                    }}>
                                        {
                                            uploading && (
                                                <Loader size="sm" color="white" variant="dots" />
                                            ) || "Confirm"
                                        }
                                    </Button>
                                    <Button color={theme.colors.dark[5]} onClick={() => setConfirmDelete('')}>
                                        Cancel
                                    </Button>
                                </Group>
                        </Modal>
                        <Modal
                            opened={modalOpened}
                            onClose={() => {
                                setModalOpened(false);
                                setEditing('');
                            }}
                            title={(editing != '') && `Edit Feed "${editing}"` || "Create Feed"}
                            size="auto"
                        >
                            <Stack spacing="sm">
                                {
                                    editing == '' && (
                                        <>
                                            <Input.Wrapper id="channel" label="Channel" description="The channel this feed will post to">
                                                <Select
                                                    disabled={serverChannels.length == 0}
                                                    placeholder="Pick one"
                                                    searchable
                                                    withinPortal
                                                    nothingFound="No options"
                                                    value={channel}
                                                    data={serverChannels}
                                                    onChange={(value) => {
                                                        setChannel(value);
                                                    }}
                                                />
                                            </Input.Wrapper>
                                            <Input.Wrapper id="feed_id" label="Feed" description="Where this feed pulls RSS data from">
                                                <Select
                                                    placeholder="Pick one"
                                                    searchable
                                                    withinPortal
                                                    nothingFound="No options"
                                                    value={feedID}
                                                    data={(() => {
                                                        var feedIDs = [];

                                                        for (let index = 0; index < feedDatas.length; index++) {
                                                            const element = feedDatas[index];
                                                            feedIDs.push({
                                                                label: element.name,
                                                                value: element.id,
                                                            });
                                                        }

                                                        return feedIDs;
                                                    })()}
                                                    onChange={(value) => {
                                                        setFeedID(value);
                                                    }}
                                                />
                                            </Input.Wrapper>
                                        </>
                                    )
                                }
                                {
                                    getFeedData(feedID).url.toLowerCase().startsWith('custom://') && (
                                        <Input.Wrapper id="url" label="URL" description="The URL this dynamic RSS feed pulls from (check docs for more info)">
                                            <TextInput
                                                placeholder="Place URL here"
                                                value={url}
                                                onChange={(event) => setURL(event.currentTarget.value)}
                                            />
                                        </Input.Wrapper>
                                    )
                                }
                                <Group position="center">
                                    <Button disabled={uploading} onClick={() => {
                                        setUploading(true);
                                        if (editing == '') {
                                            authenticated_post(API_BASE_URL + `feeds/${server.id}/${channel}/new`, JSON.stringify({
                                                'id': feedID,
                                                'url': url,
                                            }))
                                                .then((response) => {
                                                    if (response.status == 200) {
                                                        response.text()
                                                            .then((txt) => {
                                                                const json = JSON.parse(txt);
                                                                var newFeeds = [];
                                                                for (let index = 0; index < feeds.length; index++) {
                                                                    const element = feeds[index];
                                                                    newFeeds.push(element);
                                                                }
                                                                newFeeds.push({
                                                                    'id': json.id,
                                                                    'url': json.value['url'],
                                                                    'name': json.value['name'],
                                                                    'feed_id': feedID,
                                                                });
                                                                setFeeds(newFeeds);
                                                                setUploading(false);
                                                                setModalOpened(false);
                                                            });
                                                    } else {
                                                        setUploading(false);
                                                    }
                                                });
                                        } else {
                                            authenticated_patch(API_BASE_URL + `feeds/${server.id}/${channel}`, JSON.stringify({
                                                'id': editing,
                                                'url': url,
                                            }))
                                                .then((response) => {
                                                    if (response.status == 200) {
                                                        response.text()
                                                            .then((txt) => {
                                                                const json = JSON.parse(txt);
                                                                var newFeeds = [];
                                                                for (let index = 0; index < feeds.length; index++) {
                                                                    const element = feeds[index];
                                                                    if (element.id == editing) {
                                                                        newFeeds.push({
                                                                            'id': editing,
                                                                            'url': json.value['url'],
                                                                            'name': json.value['name'],
                                                                            'feed_id': feedID,
                                                                        });
                                                                    } else {
                                                                        newFeeds.push(element);
                                                                    }
                                                                }
                                                                setFeeds(newFeeds);
                                                                setUploading(false);
                                                                setEditing('');
                                                                setModalOpened(false);
                                                            })
                                                    } else {
                                                        setUploading(false);
                                                    }
                                                });
                                        }
                                    }}>
                                        {
                                            uploading && (
                                                <Loader size="sm" color="white" variant="dots" />
                                            ) || (
                                                editing != '' && "Edit Feed" ||
                                                "Create Feed"
                                            )
                                        }
                                    </Button>
                                </Group>
                            </Stack>
                        </Modal>
                        <Paper
                            radius="md"
                            withBorder
                            p="sm"
                            className={classes.paper}
                        >
                            <Group position='apart' spacing="sm">
                                <Title order={1}>Feeds</Title>
                                <Button onClick={() => setModalOpened(true)}>
                                    Create new
                                </Button>
                            </Group>
                            <Stack mt="lg">
                                {feeds.map((item => {
                                    return (
                                        <div style={{
                                            borderRadius: theme.radius.md,
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            padding: theme.spacing.xs,
                                        }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                            }}>
                                                <Blurhash
                                                    hash={getFeedData(item.feed_id).blur_hash}
                                                    width="100%"
                                                    height="100%"
                                                    resolutionX={32}
                                                    resolutionY={32/2}
                                                    punch={1}
                                                />
                                            </div>
                                            <Group w="100%">
                                                <Text sx={{flexGrow: 1, flexShrink: 0}} size="lg" pos="relative">{item.name || getFeedData(item.feed_id).name}</Text>
                                                <Group w={60} sx={{flexGrow: 0, flexShrink: 1}} spacing={0} position="right">
                                                    {
                                                        getFeedData(item.feed_id).url.toLowerCase().startsWith('custom://') && (
                                                            <ActionIcon onClick={() => {
                                                                setChannel(item.channel);
                                                                setURL(item.url);
                                                                setFeedID(item.feed_id);
                                                                setEditing(item.id);
                                                                setModalOpened(true);
                                                            }}>
                                                                <IconEdit size={18} stroke={1.5} />
                                                            </ActionIcon>
                                                        )
                                                    }
                                                    <ActionIcon color="red" onClick={() => {
                                                        setConfirmDelete(item.id)
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