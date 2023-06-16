import React, { useEffect, useState } from 'react';
import {
    createStyles, Image, Header, Container, Group, Burger, Paper, Transition,
    UnstyledButton, Loader, Text, Select, Avatar, Menu, Anchor, Button
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getLanguages, translate, setLanguage, waitForLoad, getCurrentLanguage } from "../translator.jsx";
import { authenticated_delete, get_user, setCookie } from "../auth.jsx";
import { IconDashboard, IconLogin, IconLogout, IconUser } from "@tabler/icons";
import { API_BASE_URL } from "../helpers.jsx";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
    root: {
        position: "relative",
        zIndex: 1,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3],
    },

    dropdown: {
        position: "absolute",
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: "hidden",

        [theme.fn.largerThan("sm")]: {
        display: "none",
        },
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
    },

    links: {
        [theme.fn.smallerThan("sm")]: {
        display: "none",
        },
    },

    burger: {
        [theme.fn.largerThan("sm")]: {
        display: "none",
        },
    },

    inlineLink: {
        textDecoration: "none",
        color: theme.colors.brand[6],

        "&:hover": {
            textDecoration: "underline",
        }
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },

        [theme.fn.smallerThan("sm")]: {
        borderRadius: 0,
        padding: theme.spacing.md,
        },
    },

    linkActive: {
        "&, &:hover": {
        backgroundColor: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
            .color,
        },
    },

    accountBox: {
        height: '100%',
        padding: 2,
        paddingRight: 5,
    },

    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        height: 36,
    },

    user: {
        display: 'block',
        height: '100%',
        color: theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.gray[7],
        borderRadius: theme.radius.sm,
        padding: 4,
        
        '&:hover': {
            backgroundColor: theme.colors.dark[5],
            color: theme.white,
        },
    },

    langPicker: {
        color: theme.colorScheme === "dark"
            ? theme.colors.dark[0]
            : theme.colors.gray[7],
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    },

    footer: {
        marginTop: 120,
        borderTop: `1 solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
    },

    inner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    footerLinks: {
        [theme.fn.smallerThan('xs')]: {
            marginTop: theme.spacing.md,
        },
    },
}));

export function getCookie(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}

function logout() {
    authenticated_delete(API_BASE_URL + 'auth')
        .then(() => {
            setCookie('auth', '', 1);
            setCookie('refresh', '', 14);
            location.assign('/login');
        });
}

function AccountBox() {
    const { classes, theme } = useStyles();

    const [user, setUser] = useState(undefined);
    const [langs, setLangs] = useState({});
    const [curLang, setCurLang] = useState(getCurrentLanguage());

    useEffect(() => {
        get_user(true)
            .then((res) => {
                setUser(res);
            })
            .catch(() => {
                setUser(0);
            });
        
        getLanguages()
            .then((res) => {
                setLangs(res);
            });
    }, []);

    var formattedLangs = [];
    for (const [index, value] of Object.entries(langs)) {
        formattedLangs.push({
            value: index,
            label: value,
        });
    }

    return (
        <Group
            className={classes.accountBox}
            spacing={theme.spacing.xs}
        >
            {
                (langs !== null) && (
                    <Select
                        placeholder="Pick language"
                        className={classes.langPicker}
                        searchable
                        withinPortal
                        nothingFound="No options"
                        value={curLang}
                        data={formattedLangs}
                        onChange={(value) => {
                            setLanguage(value)
                                .then(() => {
                                    setCurLang(value);
                                });
                        }}
                    />
                )
            }
            {
                (user == undefined) && (
                    <Loader size='xs' variant='dots' />
                )
                || (user == 0) && (
                    <a href="/login">
                        <Button>
                            <IconLogin size={theme.fontSizes.lg} style={{marginRight: theme.spacing.xs}} />
                            <Text size={theme.fontSizes.md}>Login</Text>
                        </Button>
                    </a>
                ) || (
                    <Menu withArrow width={150} position="bottom" transition="pop">
                        <Menu.Target>
                            <Paper
                                radius="sm"
                                withBorder
                                className={classes.paper}
                            >
                                <UnstyledButton className={classes.user}>
                                    <Group>
                                        <Avatar src={user.avatar} radius="lg" size="sm" />
                                        <Text sx={{lineHeight: "normal"}} size={theme.fontSizes.md}>{user.name}</Text>
                                    </Group>
                                </UnstyledButton>
                            </Paper>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} component="a" href="/account" icon={<IconUser size={22} stroke={1.5} />}>Dashboard</Menu.Item>
                            {
                                user.id == 'm6YxwpQd' && (
                                    <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} component="a" href="/internal" icon={<IconDashboard size={22} stroke={1.5} />}>Internal</Menu.Item>
                                )
                            }
                            <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} onClick={logout} icon={<IconLogout color={theme.colors.red[6]} size={22} stroke={1.5} />}>Logout</Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )
            }
        </Group>
    )
}

export function SiteHeader({ currentPath }) {
    const links = [
        { link: "/invite", label: "Invite" },
        { link: "/support", label: "Support" },
        { link: "/docs", label: "Docs" },
        { link: "/premium", label: "Premium" }
    ];

    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(navigator.userAgent == "Puppeteer" ? currentPath : location.pathname);
    const { classes, cx } = useStyles();

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={(event) => {
                setActive(link.link);
                close();
            }}
        >
        {link.label}
        </a>
    ));

    return (
        <Header height={HEADER_HEIGHT} className={classes.root}>
            <Container className={classes.header}>
                <a href="/">
                    <Image width={HEADER_HEIGHT * (2.5/4)} height={HEADER_HEIGHT * (2.5/4)} src="/images/logo.svg" />
                </a>
                <Group spacing={5} className={classes.links}>
                    {items}
                    <AccountBox />    
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                {(styles) => (
                    <Paper className={classes.dropdown} withBorder style={styles}>
                        {items}
                        <AccountBox />
                    </Paper>
                )}
                </Transition>
            </Container>
        </Header>
    );
}

export function SiteFooter() {
    const { classes } = useStyles();
    const links = [
        { link: "/support", label: "Support" },
        { link: "/legal", label: "Terms of Service" },
        { link: "/docs", label: "Docs" },
        { link: "/premium", label: "Premium" },
        { link: "https://github.com/ServerGuardBot", label: "GitHub" },
    ]
    const items = links.map((link) => (
        <Anchor
            color="dimmed"
            key={link.label}
            href={link.link}
            size="sm"
            >
            {link.label}
        </Anchor>
    ));

    const currentYear = new Date().getFullYear();

    return (
        <div className={classes.footer}>
        <Container className={classes.inner}>
            <Group>
                <Image width={35} height={35} src="/images/logo.svg" />
                <div>
                    <Text color="dimmed" size="sm">Server Guard is not endorsed or created by Guilded</Text>
                    <Text color="dimmed" size="sm">
                        © {currentYear} <a className={classes.inlineLink} href="https://reapimus.com/">Reapimus</a>. All rights reserved.
                    </Text>
                </div>
            </Group>
            <Group className={classes.footerLinks}>{items}</Group>
        </Container>
        </div>
    );
}