import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Paper, Group, ScrollArea, Loader, TextInput,
    Button, Stack, ActionIcon, Input, Modal, Title
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons';
import { authenticated_delete, authenticated_get, authenticated_patch, authenticated_post } from '../auth.jsx';
import { API_BASE_URL } from '../helpers.jsx';
import { encode } from 'blurhash';
import { Blurhash } from 'react-blurhash';
import { DropzoneButton } from '../account_pages/dropzone.jsx';

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

const loadImage = async src =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (...args) => reject(args);
        img.src = src;
    }
);

const getImageData = image => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
};

const encodeImageToBlurhash = async imageUrl => {
    const image = await loadImage(imageUrl);
    const imageData = getImageData(image);
    return encode(imageData.data, imageData.width, imageData.height, 4, 4);
};

export function Feeds({ user }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(true);
    const [feeds, setFeeds] = useState([]);

    const [modalOpened, setModalOpened] = useState(false);
    const [name, setName] = useState('');
    const [url, setURL] = useState('');
    const [file, setFile] = useState('');
    const [uploading, setUploading] = useState(false);
    const [editing, setEditing] = useState('');
    const [confirmDelete, setConfirmDelete] = useState('');

    useEffect(() => {
        authenticated_get(API_BASE_URL + 'feeds/data')
            .then((response) => {
                response.text()
                    .then((txt) => {
                        const json = JSON.parse(txt);
                        setFeeds(json.feedDatas);
                        setLoaded(true);
                    });
            });
    }, []);

    function uploadFile(files) {
        encodeImageToBlurhash(URL.createObjectURL(files[0]))
            .then(hash => setFile(hash));
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
                                        authenticated_delete(API_BASE_URL + `feeds/data/${confirmDelete}`)
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
                            title={(editing != '') && `Edit Feed Type "${editing}"` || "Create Feed Type"}
                            size="auto"
                        >
                            <Stack spacing="sm">
                                <Input.Wrapper id="name" label="Name">
                                    <TextInput
                                        placeholder="Input Name Here"
                                        value={name}
                                        onChange={(event) => setName(event.currentTarget.value)}
                                    />
                                </Input.Wrapper>
                                <Input.Wrapper id="url" label="URL">
                                    <TextInput
                                        placeholder="Place URL here"
                                        value={url}
                                        onChange={(event) => setURL(event.currentTarget.value)}
                                    />
                                </Input.Wrapper>
                                <DropzoneButton setFiles={uploadFile} />
                                <Group position="center">
                                    <Button disabled={uploading} onClick={() => {
                                        if (file != '') {
                                            setUploading(true);
                                            if (editing == '') {
                                                authenticated_post(API_BASE_URL + 'feeds/data', JSON.stringify({
                                                    'name': name,
                                                    'url': url,
                                                    'blur_hash': file,
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
                                                                        'name': name,
                                                                        'url': url,
                                                                        'blur_hash': file,
                                                                        'id': json.id,
                                                                    })
                                                                    setFeeds(newFeeds);
                                                                    setUploading(false);
                                                                    setModalOpened(false);
                                                                });
                                                        } else {
                                                            setUploading(false);
                                                        }
                                                    });
                                            } else {
                                                authenticated_patch(API_BASE_URL + `feeds/data/${editing}`, JSON.stringify({
                                                    'name': name,
                                                    'url': url,
                                                    'blur_hash': file,
                                                }))
                                                    .then((response) => {
                                                        if (response.status == 200) {
                                                            var newFeeds = [];
                                                            for (let index = 0; index < feeds.length; index++) {
                                                                const element = feeds[index];
                                                                if (element.id == editing) {
                                                                    newFeeds.push({
                                                                        'id': editing,
                                                                        'name': name,
                                                                        'url': url,
                                                                        'blur_hash': file,
                                                                    });
                                                                } else {
                                                                    newFeeds.push(element);
                                                                }
                                                            }
                                                            setFeeds(newFeeds);
                                                            setUploading(false);
                                                            setEditing('');
                                                            setModalOpened(false);
                                                        } else {
                                                            setUploading(false);
                                                        }
                                                    });
                                            }
                                        }
                                    }}>
                                        {
                                            uploading && (
                                                <Loader size="sm" color="white" variant="dots" />
                                            ) || (
                                                editing != '' && "Edit Feed Data" ||
                                                "Create Feed Data"
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
                            <Title order={1}>Feed Datas</Title>
                            <Group position='right' spacing="sm">
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
                                                    hash={item.blur_hash}
                                                    width="100%"
                                                    height="100%"
                                                    resolutionX={32}
                                                    resolutionY={32/2}
                                                    punch={1}
                                                />
                                            </div>
                                            <Group w="100%">
                                                <Text sx={{flexGrow: 1, flexShrink: 0}} size="lg" pos="relative">{item.name}</Text>
                                                <Group w={60} sx={{flexGrow: 0, flexShrink: 1}} spacing={0} position="right">
                                                    <ActionIcon onClick={() => {
                                                        setName(item.name);
                                                        setURL(item.url);
                                                        setFile(item.blur_hash);
                                                        setEditing(item.id);
                                                        setModalOpened(true);
                                                    }}>
                                                        <IconEdit size={18} stroke={1.5} />
                                                    </ActionIcon>
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