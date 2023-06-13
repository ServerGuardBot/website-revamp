import { hydrateRoot } from 'react-dom/client';
import ReactDOMServer from "react-dom/server";
import React, { useEffect, useState } from 'react';
import {
    createStyles, Title, MantineProvider, ColorSchemeProvider, Container, Text, List, Anchor
} from '@mantine/core';
import { setCookie } from '../auth.jsx';
import { waitForLoad } from "../translator.jsx";
import { SiteHeader, SiteFooter, getCookie } from './shared.jsx';

const useStyles = createStyles((theme) => ({
    inlineLink: {
        textDecoration: "none",
        color: "#b3a100",

        "&:hover": {
            textDecoration: "underline",
        }
    },
}));

function httpGetAsync(theUrl, callback)
{
    fetch(theUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
        .then((response) => {
            callback(response);
        });
}

function getServerData(serverId) {
    const preparedData = document.getElementsByClassName(`server-data-${serverId}`)[0];
    if (preparedData == undefined) {
        // Any missing data is most likely to be missing at build time, so we create a cache for it in the html to save on requests
        // when clients view the page.
        fetch(`https://www.guilded.gg/api/teams/${serverId}/info`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'include',
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        })
            .then((response) => {
                const js = response.json();
                const newData = document.createElement('cached-item');
                const neededData = {
                    "name": js.name
                }
                newData.classList.add(`server-data-${serverId}`);
                newData.innerText = JSON.stringify(neededData);
                document.head.appendChild(newData);
                return neededData;
            })
    } else {
        return JSON.parse(preparedData.innerText);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function Legal() {
    const { classes, theme } = useStyles();
    const [colorScheme, setColorScheme] = useState('dark');
    const toggleColorScheme = (value) => {
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
        setCookie('color_scheme', value || (colorScheme === 'dark' ? 'light' : 'dark'));
    }

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
        colorScheme: colorScheme
    };

    useEffect(() => {
        setColorScheme(getCookie('color_scheme') || 'dark');
    }, []);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
                <SiteHeader currentPath="/" />
                <Container size="90vw">
                    <Title mt={16}>Privacy Policy</Title>
                    <Text>
                        Your privacy is important to Server Guard, and we take appropriate measures to protect your privacy while using our services.<br />

                        <Text inherit>When your account is being verified with Server Guard, some information may be shared with the staff members of the servers using Server Guard. This includes, but is not limited to:</Text><br />
                        
                        <List withPadding>
                            <List.Item>The username on the service(s) you used to verify your account</List.Item>
                            <List.Item>Metrics about the accounts from the service(s) you used to verify your account, these can include but are not limited to, the age of the account, or the amount of tweets you have posted.</List.Item>
                            <List.Item>Connection information, indicating whether you used a VPN when you verified with Server Guard.</List.Item>
                        </List><br />

                        <Text inherit>Identifiers of your connection are irreversibly anonymized before storage using the SHA-512 hashing algorithm.</Text><br />

                        <Text inherit>We collect analytical data for statistical and error reporting purposes, and the storing of configuration data necessary for the operation of our services.
                        In addition, we may employ third-party integrations such as Google Analytics and Google AdSense for personalized advertisements, which make use of cookie technology to provide targeted advertisements.
                        We attempt to store your data outside of public access, in as safe a manner as we can realistically guarantee.
                        However, due to the very nature of online data transfer and storage, we may be unable to meet this expectation, due to the fact that complete security is not possible.
                        Server Guard may be used by people not directly affiliated to us, and thus, we do not have any control over how they use our services, provided it is within reasonable terms.</Text><br />

                        <Text inherit>Verification of your account using our services constitutes agreement to our policies on data collection. If you do not accept this agreement, you are to leave any servers using our services, and to never verify your account with our services. Not doing so will be regarded as accepting our policies.</Text><br />

                        <Text inherit>When you post, share, or otherwise transmit messages, or content in a server protected by Server Guard, we may collect those messages, and they may be filtered and moderated for purposes such as removal of profanity and other inappropriate content.
                        Where permitted by law, we may use pre-filtered messages for purposes such as training and improving our filter technology to increase safety in servers using Server Guard.</Text><br />
                    </Text>
                    <Title mt={theme.spacing.sm}>Terms of Service</Title>
                    <Text>
                        Please read these Terms of Service completely before using <Anchor inherit className={classes.inlineLink} href="https://serverguard.xyz">https://serverguard.xyz</Anchor> owned and operated by Reapimus.
                        This agreement documents the legally binding terms and conditions attached to the use of the Site at serverguard.xyz.
                        By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
                        In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        The Server Guard service is not accessible to those under 13 years of age, and Server Guard does not knowingly store personal information from children under the age of 13.
                        Any participation in this service will constitute acceptance of this agreement.
                        If you do not agree to abide by the above, please do not use this service.<br />

                        <Title mt={theme.spacing.sm} order={2}>1. Liability</Title>
                        This site and it’s components are offered for informational purposes only; this site shall not be responsible or liable for the accuracy, usefulness or available of any information transmitted or made available via the site, and shall not be responsible or liable for any error or omissions in that information.<br />

                        <Title mt={theme.spacing.sm} order={2}>2. Intellectual Property</Title>
                        The Site and its original content, features, and functionality are owned by Reapimus and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                        All data generated and shared by Server Guard in the past, present or future is property of Server Guard and it’s sole owners and must be transferred, removed or changed on request.<br />

                        <Title mt={theme.spacing.sm} order={2}>3. Termination</Title>
                        We may terminate your access to the Site, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.
                        All provisions of this Agreement that, by their nature, should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                        You may also request to terminate your account yourself, to do this, submit a deletion request on our web panel.
                        Using Server Guard after termination will result in a new account being opened for you.<br />

                        <Title mt={theme.spacing.sm} order={2}>4. Changes to the Agreement</Title>
                        Server Guard reserves the right to change these conditions from time to time as it sees fit and your continued use of the site will signify your acceptance of any adjustment to these terms.<br />

                        <Title mt={theme.spacing.sm} order={2}>5. Warranty</Title>
                        Server Guard is provided “as is” with no warranty or liability for any outcomes of using Server Guard and/or any content you may or may not interact with on Server Guard, and you agree that Server Guard is not liable for any events in the past, in current times or in the future.
                        You agree to hold harmless against Server Guard for every possible situation except for those we accept full responsibility off.
                        Server Guard is not responsible and will not take responsibility for the behaviour of other parties using Server Guard.<br />

                        <Title mt={theme.spacing.sm} order={2}>6. Disputes</Title>
                        <Text inherit>While using Server Guard, certain situations may or may not develop which may cause you to file a dispute with us.</Text><br />

                        <Text inherit>If you find yourself banned from our services, you must contact us through <Anchor inherit className={classes.inlineLink} href="https://serverguard.xyz/support">https://serverguard.xyz/support</Anchor> to file an official appeals, or to request the reason for your ban.
                        Appeals must be formally written and should include your Guilded ID, proof of account ownership and a reason why your ban should be overturned.</Text><br />

                        <Title mt={theme.spacing.sm} order={2}>7. Other Links</Title>
                        Our Site does contain a number of links to other websites and online resources that are not owned or controlled by Server Guard.
                        Server Guard has no control over, and therefor cannot assume responsibility for, the content or general practices of any of these third part sites and/or services.
                        Therefore, we strongly advise you to read the entire terms and conditions and privacy policy of any site that you visit as a result of following a link that is posted on our site.<br />

                        <Title mt={theme.spacing.sm} order={2}>8. Governing Law</Title>
                        This Agreement is governed in accordance with the laws of New South Wales.<br />

                        <Title mt={theme.spacing.sm} order={2}>9. Acknowledgement</Title>
                        By using Server Guard, you acknowledge all above Terms. You acknowledge that, even if you did not read the Terms in full, you will comply with our Terms.<br />

                        <Title mt={theme.spacing.sm} order={2}>10. Contact</Title>
                        If you have any questions, requests or complaints about Server Guard, please forward this to our staff using <Anchor inherit className={classes.inlineLink} href="https://serverguard.xyz/support">https://serverguard.xyz/support</Anchor> We will respond to these inquiries within 28 days.
                        Server Guard fully complies with GDPR Data Releasements and Data Deletion.
                    </Text>
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
        rootObject = hydrateRoot(root, <Legal />);
    } else {
        // rootObject = createRoot(root);
        // rootObject.render(<Index />);
        root.innerHTML = ReactDOMServer.renderToString(<Legal />);
    }
    window.status = 'ready';
})();