import Image from "next/image";
import Link from "next/link";

import classes from './Logo.module.css';
import { Group, Text } from "@mantine/core";

export default function Logo({ size, withLink=false, withText=false }: { size: number, withLink?: boolean, withText?: boolean }) {
    if (withLink) {
        return (
            <Group>
                <Link className={classes.link} href="/">
                    <Image src="/images/logo.svg" alt="logo" width={size} height={size} />
                    {
                        withText && (
                            <Text>Server Guard</Text>
                        )
                    }
                </Link>
            </Group>
        )
    } else {
        return (
            <Group>
                <Image src="/images/logo.svg" alt="logo" width={size} height={size} />
                {
                    withText && (
                        <Text size="lg" style={{fontWeight: 600, userSelect: 'none'}}>Server Guard</Text>
                    )
                }
            </Group>
        )
    }
}