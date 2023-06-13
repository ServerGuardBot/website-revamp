import { hydrateRoot } from 'react-dom/client';
import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState } from 'react';
import {
    createStyles, Title, MantineProvider, ColorSchemeProvider, Container, Button, Group, Text,
    Card, SimpleGrid, Image, Tooltip, Flex, Paper
} from '@mantine/core';
import {
    IconClipboardCheck, IconShieldCheck, IconUserCircle, IconMessageReport, IconBan, IconCheck
} from '@tabler/icons';
import { setCookie } from '../auth.jsx';
import { waitForLoad } from "../translator.jsx";
import { SiteHeader, SiteFooter, getCookie } from './shared.jsx';
import { API_BASE_URL } from '../helpers.jsx';

const useStyles = createStyles((theme, { colorScheme }) => ({
    wrapper: {
        position: 'relative',
        boxSizing: 'border-box',
        backgroundImage: `linear-gradient(0deg, rgba(179, 161, 0, 0) 0%, rgba(179, 161, 0, 0.1) 90%)`,

        '&:before': {
            maskImage: 'url(images/grid.png)',
            maskSize: 22,
            maskRepeat: 'repeat',
            content: '""',
            backgroundImage: `linear-gradient(0deg, rgba(179, 161, 0, 0) 0%, rgba(179, 161, 0, 0.1) 90%)`,
            width: '100%',
            height: '100%',
            position: 'absolute',
        }
    },
    
    inner: {
        display: 'flex',
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        
        [theme.fn.smallerThan('md')]: {
            paddingBottom: theme.spacing.sm,
            paddingTop: theme.spacing.sm,
        },
    },
    
    title: {
        fontSize: 48,
        fontWeight: 900,
        lineHeight: 1.1,
        margin: 0,
        padding: 0,
        color:
            colorScheme === "dark"
                ? theme.white
                : theme.black,
        maxWidth: 500,
        
        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            fontSize: 34,
            lineHeight: 1.15,
        },
    },

    serverIcon: {
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        borderRadius: theme.radius.sm,
    },
    
    description: {
        marginTop: theme.spacing.xl,
        maxWidth: 500,
        color:
            colorScheme === "dark"
                ? theme.white
                : theme.black,
        opacity: 0.75,
        
        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
        },
    },
    
    controls: {
        marginTop: theme.spacing.xl * 2,
        
        [theme.fn.smallerThan('md')]: {
            marginTop: theme.spacing.xl,
        },
    },

    content: {
        paddingTop: `calc(${theme.spacing.xl} * 2)`,
        paddingBottom: `calc(${theme.spacing.xl} * 2)`,
        marginRight: `calc(${theme.spacing.xl} * 3)`,
    
        [theme.fn.smallerThan('md')]: {
            marginRight: 0,
        },
    },
    
    control: {
        height: 54,
        paddingLeft: 38,
        paddingRight: 38,
        
        [theme.fn.smallerThan('md')]: {
            height: 54,
            paddingLeft: 18,
            paddingRight: 18,
            flex: 1,
        },
    },
    
    card: {
        border: `1 solid ${
            colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
        }`,
    },

    inviteCTA: {
        height: 240,
    },

    inviteCTAContent: {
        ...theme.fn.cover(),
        padding: theme.spacing.xl,
        zIndex: 1,
    },

    inviteCTAAction: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
    },

    inviteCTATitle: {
        color: theme.white,
        marginBottom: `calc(${theme.spacing.xs} / 2)`,
    },

    inviteCTADescription: {
        color: theme.white,
        maxWidth: 220,
    },
}));

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Index() {
    const [colorScheme, setColorScheme] = useState('dark');
    const toggleColorScheme = (value) => {
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
        setCookie('color_scheme', value || (colorScheme === 'dark' ? 'light' : 'dark'));
    }
    const { classes, theme } = useStyles({ colorScheme });

    const features = [
        {
            title: 'Frictionless New User Verification',
            description: 'New users are required to verify through our verification system which offers a frictionless experience. Our checkpoint system will deter bots and prevent alts, while allowing legitimate users entry to your server!',
            icon: IconClipboardCheck,
        },
        {
            title: 'Automated Raid Protection',
            description: 'Automated accounts will not be able to pass our verification site, while allowing legitimate users in to enjoy your server! If we detect a suspected raid, our system will activate stricter checkpoints.',
            icon: IconShieldCheck,
        },
        {
            title: 'Detailed User Information',
            description: 'Server Guard notifies you of exactly who is verifying, giving you a score of a user based on various factors, including their social connections. We will even alert you if they are using a VPN!',
            icon: IconUserCircle,
        },
        {
            title: 'Automatic Chat Moderation',
            description: 'Our automated chat filters can greatly assist server moderators by preventing toxicity, hate-speech, invite links, and more automatically without moderator intervention! Rest assured, our filters rarely have false positives!',
            icon: IconMessageReport,
        },
        {
            title: 'Banning, Mutes & Warnings',
            description: 'Our bot offers the capability to temporarily ban users, mute them permanently or temporarily, and issue warnings to users that can be temporary and viewed by moderators, making moderation easier for your moderators!',
            icon: IconBan,
        },
        {
            title: '...And More To Come',
            description: 'We are always actively on the lookout for new features to implement that would assist in moderation! Be sure to join our support server so you can get help with using the bot and submit feature requests or bug reports!',
            icon: IconCheck,
        },
    ];
    const trustedServerIDs = [
        'wReb5DPl',
        'kj7x0mxR',
        'ME2Mrw6l',
    ];
    const [trustedServers, setTrustedServers] = useState([]);

    let ourTheme = {
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
        colorScheme: colorScheme
    };

    useEffect(() => {
        setColorScheme(getCookie('color_scheme') || 'dark');

        (async () => {
            let newTrustedServers = [];
            for (let index = 0; index < trustedServerIDs.length; index++) {
                const serverId = trustedServerIDs[index];
                
                let preparedData = document.getElementsByClassName(`server-data-${serverId}`)[0];
                console.log(document.getElementsByClassName(`server-data-${serverId}`))
                if (preparedData == undefined) {
                    // Any missing data is most likely to be missing at build time, so we create a cache for it in the html to save on requests
                    // when clients view the page.
                    const response = await fetch(`https://www.guilded.gg/api/teams/${serverId}/info`);
                    const memberResponse = await fetch(`https://www.guilded.gg/api/teams/${serverId}/members`);

                    const js = (await response.json()).team;
                    const memberJs = await memberResponse.json();
                    const newData = document.createElement('cached-item');
                    const neededData = {
                        'name': js.name,
                        'subdomain': js.subdomain,
                        'profilePicture': js.profilePicture,
                        'memberCount': memberJs.members.length,
                    }
                    newData.classList.add(`server-data-${serverId}`);
                    newData.innerText = JSON.stringify(neededData);
                    document.head.appendChild(newData);
                    preparedData = neededData;
                } else {
                    preparedData = JSON.parse(preparedData.innerText);
                }

                try {
                    newTrustedServers.push({
                        'name': preparedData.name,
                        'vanity': preparedData.subdomain,
                        'avatar': preparedData.profilePicture,
                        'members': preparedData.memberCount,
                    });
                } catch {}
            }

            setTrustedServers(newTrustedServers);
        })();
    }, []);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
                <SiteHeader currentPath="/" />
                <section className={classes.wrapper}>
                    <Container size="lg">
                        <div className={classes.inner}>
                            <div className={classes.content}>
                                <h1 className={classes.title}>
                                    A{' '}
                                    <Text component="span" variant="gradient" gradient={{ from: 'goldenrod', to: 'gold' }} inherit>
                                        powerful
                                    </Text>{' '}
                                    Guilded moderation bot
                                </h1>

                                <Text className={classes.description} size="md" color="dimmed">
                                    Protect your servers from raids, trolls and bad actors with ease – Server Guard has
                                    numerous features for moderating your server, such as our verification system.
                                </Text>

                                <Group className={classes.controls}>
                                    <Button
                                        size="xl"
                                        className={classes.control}
                                        component="a"
                                        href="/invite"
                                        variant="gradient"
                                        gradient={{ from: 'goldenrod', to: 'gold' }}
                                    >
                                        Invite Server Guard
                                    </Button>
                                </Group>
                            </div>
                        </div>
                    </Container>
                </section>
                <Container>
                    <section>
                        <Title my={12} align='center'>Trusted by the Best</Title>
                        <Flex direction='row' justify='center' wrap='wrap' gap={8}>
                            {
                                trustedServers.map((server) => (
                                    <Tooltip label={`${server.name} - ${server.members.toLocaleString()} members`} withArrow>
                                        <Paper withBorder className={classes.serverIcon}>
                                            <a href={`https://guilded.gg/${server.vanity}`}>
                                                <Image src={server.avatar} width={124} height={124} />
                                            </a>
                                        </Paper>
                                    </Tooltip>
                                ))
                            }
                        </Flex>
                    </section>
                    <section>
                        <Title my={12} align='center'>Features</Title>
                        <SimpleGrid cols={2} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                            {
                                features.map((feature) => (
                                    <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
                                        <feature.icon size={50} stroke={2} color="#b3a100" />
                                        <Text fz="lg" fw={500} mt="md">
                                            {feature.title}
                                        </Text>
                                        <Text fz="sm" c="dimmed" mt="sm">
                                            {feature.description}
                                        </Text>
                                    </Card>
                                ))
                            }
                        </SimpleGrid>
                    </section>
                    <section>
                        <Card
                            radius="md"
                            style={{ backgroundColor: theme.colors.blue[6] }}
                            className={classes.inviteCTA}
                            mt={theme.spacing.xl}
                        >

                            <div className={classes.inviteCTAContent}>
                                <Text size="lg" weight={700} className={classes.inviteCTATitle}>
                                    Ready to Try Server Guard?
                                </Text>

                                <Text size="sm" className={classes.inviteCTADescription}>
                                    Don't delay any further! Invite our bot to your server and start using it right away!
                                </Text>

                                <Button
                                    className={classes.inviteCTAAction}
                                    variant="white"
                                    color="dark"
                                    component="a"
                                    size="sm"
                                    href="/invite"
                                >
                                    Invite Server Guard
                                </Button>
                            </div>
                        </Card>
                    </section>
                </Container>
                <SiteFooter />
            </MantineProvider>
        </ColorSchemeProvider>
    );
}

(async () => {
    var root = document.getElementById('root');
    var rootObject;

    while (root == null) {
        root = document.getElementById('root');
        await sleep(100);
    }

    if (root.hasChildNodes()) {
        const oldStyles = document.querySelectorAll('style[data-emotion]');
        console.log(oldStyles.length);
        oldStyles.forEach(style => style.remove());
        rootObject = hydrateRoot(root, <Index />);
    } else {
        // rootObject = createRoot(root);
        // rootObject.render(<Index />);
        root.innerHTML = ReactDOMServer.renderToString(<Index />);
    }
    window.status = 'ready';
})();