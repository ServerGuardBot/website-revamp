"use client";
import { Card, Group, Image, Stack, Text, Title, rem } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import classes from "./LandingTrusted.module.css";
import { useTranslations } from "next-intl";

export default function LandingTrusted({ data }: { data?: Array<any> }) {
  if (!data) {
    data = [
      {
        avatar:
          "https://cdn.gilcdn.com/TeamAvatar/76cf644d9c462640c219906a212e4aa4-Large.png",
        name: "Toast RBX",
        vanity: "ToastRBX",
        members: 16604,
      },
      {
        avatar:
          "https://cdn.gilcdn.com/TeamAvatar/23879671c19e7dae68ad65ef0ecf3f5d-Large.png",
        name: "Anime Island",
        vanity: "anime",
        members: 15093,
      },
      {
        avatar:
          "https://cdn.gilcdn.com/TeamAvatar/bc0441ea1473436f07b2c98438633170-Large.png",
        name: "Bloxy News",
        vanity: "bloxynews",
        members: 8495,
      },
      {
        avatar:
          "https://cdn.gilcdn.com/TeamAvatar/9702628fb692062d3188a2eab0baf651-Large.png",
        name: "World Three (WWW)",
        vanity: "www",
        members: 7561,
      },
      {
        avatar:
          "https://cdn.gilcdn.com/TeamAvatar/220b8c6121a1ec1f58f85a13b9890ee2-Large.png",
        name: "I Roc Studios",
        vanity: "Iroc-Studios",
        members: 5693,
      },
    ];
  }

  const t = useTranslations("home");
  const ref = useRef<HTMLDivElement>(null);

  const len = data.length;
  for (let i = 0; i < len; i++) {
    data.push(data[i]);
  }

  useEffect(() => {
    let lastElementWidth = 0;
    if (ref.current) {
      lastElementWidth = (ref.current.lastElementChild as HTMLDivElement)?.clientWidth ?? 0;
    }
    document.documentElement.style.setProperty("--trusted-width", "-" + ((ref.current?.clientWidth ?? 0) / 2).toString() + "px")
  }, [ref]);

  return (
    <>
      <Title ta="center" mt="xl">
        {t("trusted-by")}
      </Title>
      <div className={classes.container}>
        <Group
          className={classes.trustedGroup}
          gap="sm"
          p="sm"
          ref={ref}
        >
          {data.map((item, index) => (
            <Card className={classes.card} component="a" href={`https://guilded.gg/${item.vanity}`} key={index} withBorder p="xs">
              <Group>
                <Image
                  src={item.avatar}
                  alt={item.name}
                  radius="sm"
                  w={56}
                  h={56}
                />
                <Stack gap={0}>
                  <Text size="xl">{item.name}</Text>
                  <Text c="dimmed" size="sm">
                    {item.members}+
                  </Text>
                </Stack>
              </Group>
            </Card>
          ))}
        </Group>
      </div>
    </>
  );
}
