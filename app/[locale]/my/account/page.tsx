"use client";
import { useSession } from "@/app/api/client";
import Logo from "@/components/Logo";
import Link from "next/link";
import {
  Avatar,
  Text,
  Stack,
  Group,
  Title,
  Button,
  Image,
  SimpleGrid,
  Loader,
  Paper,
  Box,
  Center,
} from "@mantine/core";

import classes from "./page.module.css";

const serverIconSize = 128;

export default function Page() {
  const session = useSession(true);

  return (
    (session.status == "loading" && (
      <div className={classes.loader}>
        <Loader type="dots" size={64} />
      </div>
    )) || (
      <Stack p="md" align="center">
        <Paper withBorder p="xs" shadow="sm" className={classes.paper}>
          <Stack>
            <Center>
              <Logo size={48} withText withLink textSize={32} />
            </Center>
            <Group>
              <Avatar size={106} src={session.user?.avatar} />
              <Title className={classes.text} size={42}>
                Hello, {session.user?.name}
              </Title>
            </Group>
          </Stack>
        </Paper>
        <Paper withBorder p="xs" shadow="sm" className={classes.paper}>
          <SimpleGrid
            cols={{
              base: 2,
              sm: 3,
              lg: 5,
            }}
            spacing="xs"
            verticalSpacing={"sm"}
            style={{ overflow: "visible" }}
            p={4}
          >
            {session.guilds.map((guild) => (
              <Box key={guild.id} h={serverIconSize + 18}>
                <Button
                  component={Link}
                  className={classes.server}
                  href={`/my/servers/${guild.id}`}
                  disabled={!guild.isActive}
                  h={serverIconSize}
                  w={serverIconSize}
                  p={0}
                  styles={{
                    label: {
                      alignItems: "unset",
                      overflow: "visible",
                      width: "100%",
                      height: "100%",
                    },
                  }}
                  style={{ border: "none", overflow: "visible" }}
                >
                  <div style={{ width: "100%", overflow: "visible" }}>
                    <Image
                      src={guild.avatar}
                      alt={`${guild.name}'s Icon`}
                      width={serverIconSize}
                      height={serverIconSize}
                      radius="sm"
                    />
                    <Text size="lg" fw={500} truncate="end">
                      {guild.name}
                    </Text>
                  </div>
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Paper>
      </Stack>
    )
  );
}
