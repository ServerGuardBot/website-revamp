import Image from "next/image";
import Link from "next/link";

import classes from './Logo.module.css';
import { Group, Text, rem } from "@mantine/core";

export default function Logo({ size, textSize, withLink=false, withText=false }: { size: number, textSize?: number, withLink?: boolean, withText?: boolean }) {
    if (withLink) {
        return (
            <Group>
                <Link className={classes.link} href="/">
                    <Image src="/images/logo.svg" alt="logo" width={size} height={size} />
                    {
                        withText && (
                            <Text fw={600} size={textSize !== undefined ? rem(textSize) : "lg"}>Server Guard</Text>
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
                        <Text fw={600} size={textSize !== undefined ? rem(textSize) : "md"} style={{userSelect: 'none'}}>Server Guard</Text>
                    )
                }
            </Group>
        )
    }
}