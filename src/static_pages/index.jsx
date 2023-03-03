import ReactDOM from 'react-dom';
// import { hydrateRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import {
    createStyles, Drawer, MediaQuery, Header, Title, Burger, ScrollArea, Loader, MantineProvider, Container, Button, Group
} from '@mantine/core';
import {
    IconHome, IconUser, IconServer, IconFlag
} from '@tabler/icons';
import { useViewportSize } from '@mantine/hooks';
import { get_user } from '../auth.jsx';
import { waitForLoad } from "../translator.jsx";
import { renderToString } from 'react-dom/server';

const ourTheme = {
    colors: {
        brand: 
        [
          '#fffedc',
          '#fff8af',
          '#fff37e',
          '#ffee4d',
          '#ffe91e',
          '#e6cf08',
          '#b3a100',
          '#807300',
          '#4d4500',
          '#1b1700',
        ]
    },
    primaryColor: 'brand',
    colorScheme: 'dark'
};

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        boxSizing: 'border-box',
        backgroundColor: theme.colors.dark[8],
    },
    
    inner: {
        position: 'relative',
        paddingTop: 200,
        paddingBottom: 120,
        
        [BREAKPOINT]: {
            paddingBottom: 80,
            paddingTop: 80,
        },
    },
    
    title: {
        fontSize: 62,
        fontWeight: 900,
        lineHeight: 1.1,
        margin: 0,
        padding: 0,
        color: theme.white,
        
        [BREAKPOINT]: {
            fontSize: 42,
            lineHeight: 1.2,
        },
    },
    
    description: {
        marginTop: theme.spacing.xl,
        fontSize: 24,
        
        [BREAKPOINT]: {
            fontSize: 18,
        },
    },
    
    controls: {
        marginTop: theme.spacing.xl * 2,
        
        [BREAKPOINT]: {
            marginTop: theme.spacing.xl,
        },
    },
    
    control: {
        height: 54,
        paddingLeft: 38,
        paddingRight: 38,
        
        [BREAKPOINT]: {
            height: 54,
            paddingLeft: 18,
            paddingRight: 18,
            flex: 1,
        },
    },
}));

export default function Index() {
    const { classes, theme } = useStyles();

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
            <section className={classes.wrapper}>
                <Container size={700} className={classes.inner}>
                    <h1 className={classes.title}>
                        A{' '}
                        <Text component="span" variant="gradient" gradient={{ from: 'goldenrod', to: 'gold' }} inherit>
                            powerful
                        </Text>{' '}
                        Guilded moderation bot
                    </h1>

                    <Text className={classes.description} color="dimmed">
                        Protect your servers from raids, trolls, bad actors with ease – Server Guard has
                        numerous features for moderating your server, such as our verification system.
                    </Text>

                    <Group className={classes.controls}>
                        <Button
                            size="xl"
                            className={classes.control}
                            variant="gradient"
                            gradient={{ from: 'goldenrod', to: 'gold' }}
                        >
                            Invite Server Guard
                        </Button>
                    </Group>
                </Container>
            </section>
        </MantineProvider>
    );
}

function SSR() {
    return renderToString(<Index />);
}

try {
    const root = hydrateRoot(document.body, <Index />);
    root.render();
}
catch {}