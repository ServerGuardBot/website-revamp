"use client";
import {
  IconAlertTriangle,
  IconShieldCheck,
  IconShieldX,
} from "@tabler/icons-react";
import {
  Loader,
  Paper,
  Title,
  Text,
  Button,
  Avatar,
  Group,
  Space,
  Code,
  rem,
} from "@mantine/core";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Turnstile } from "@marsidev/react-turnstile";
import { Adsense } from "@ctrl/react-adsense";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import classes from "./page.module.css";
import CryptoJS from "crypto-js";
import cx from "clsx";
import Logo from "@/components/Logo";

interface VerifyDataPayload {
  user?: {
    name: string;
    avatar: string;
  };
  guild?: {
    name: string;
    avatar: string;
    adminContact?: string;
  };
}

interface VerifyStatus {
  state: "accepted" | "rejected" | "pending" | "waiting";
  message?: string;
}

function useVPNCheck() {
  const [isVPN, setIsVPN] = useState(false);
  useEffect(() => {
    fetch("https://ipapi.co/json")
      .then((res) => {
        res.json().then((data) => {
          var bT = Intl.DateTimeFormat().resolvedOptions().timeZone;
          var iT = data.timezone;
          setIsVPN(bT !== iT);
        });
      })
      .catch(() => {
        setIsVPN(false);
      });
  }, []);
  return isVPN;
}

export default function Page({
  params: { code },
}: {
  params: { code: string };
}) {
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    state: "waiting",
  });
  const [verifyData, setVerifyData] = useState<VerifyDataPayload>({});
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  const key = CryptoJS.enc.Utf8.parse(process.env.NEXT_PUBLIC_SECRET as string);
  const usingVPN = useVPNCheck();

  const t = useTranslations("verify");
  const tg = useTranslations("general");

  useEffect(() => {
    const req = new ServerGuardRequest(`/verify/${code}`, "GET");
    req.execute(undefined, false).then((data) => {
      setVerifyData(data);
    }).catch(() => {
      setVerifyData({
        "guild": {
          "name": "Unknown",
          "avatar": ""
        },
        "user": {
          "name": "Unknown",
          "avatar": ""
        }
      })
      setVerifyStatus({
        state: "rejected",
        message: "invalid_token"
      });
    })
  }, [code]);
  const isLoaded = Object.keys(verifyData).length > 0;

  return (
    <div className={classes.main}>
      <Logo withText size={64} textSize={38} />
      <Space h="sm" />
      <Paper className={cx({
        [classes.container]: true,
        [classes.paper]: true,
      })} px="md" py="xs" withBorder>
        {isLoaded &&
          ((verifyStatus.state == "waiting" ||
            verifyStatus.state == "pending") && (
            <>
              <Group justify="left">
                <Avatar
                  src={verifyData.user?.avatar}
                  alt={verifyData.user?.name}
                  radius="50%"
                  size="xl"
                />
                <Title order={1}>
                  {t("welcome", {
                    username: verifyData.user?.name,
                  })}
                </Title>
              </Group>
              <Space h="sm" />
              <Text size="md" ta="justify">
                {t("intro", {
                  server: verifyData.guild?.name,
                })}
              </Text>
              <Space h="sm" />
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE as string}
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken("ERROR")}
                options={{
                  size: "invisible",
                }}
              />
              {turnstileToken == "" && (
                <Text size="sm">{t("waiting_turnstile")}</Text>
              )}
              <Button
                size="sm"
                // @ts-ignore
                disabled={
                  verifyStatus.state == "pending" ||
                  turnstileToken == "" ||
                  turnstileToken == "ERROR"
                }
                onClick={() => {
                  if (!isLoaded) return;
                  if (
                    verifyStatus.state == "pending" ||
                    turnstileToken == "" ||
                    turnstileToken == "ERROR"
                  )
                    return;
                  FingerprintJS.load().then((fp: any) => {
                    fp.get().then((result: any) => {
                      const body = CryptoJS.AES.encrypt(
                        JSON.stringify({
                          v: usingVPN,
                          cf: turnstileToken,
                          bi: result.visitorId,
                        }),
                        key,
                        { mode: CryptoJS.mode.ECB }
                      ).toString();
                      const req = new ServerGuardRequest(
                        `/verify/${code}`,
                        "POST"
                      );
                      req.execute(body, false).then((data) => {
                        setVerifyStatus({
                          state: data.status,
                          message: data.reason,
                        });
                      });
                    });
                  });
                }}
              >
                {((verifyStatus.state == "pending" || turnstileToken == "") && (
                  <Loader type="dots" size="sm" />
                )) ||
                  t("button")}
              </Button>
            </>
          ) || (
            <>
              {(verifyStatus.state == "accepted" && (
                <IconShieldCheck size={132} />
              )) || <IconShieldX size={132} />}
              <Space h="sm" />
              <Title order={3}>{t(`state.${verifyStatus.state}`)}</Title>
              {verifyStatus.state == "rejected" && (
                <>
                  <Space h="xs" />
                  <Code block>{t(`rejected.${verifyStatus.message}`)}</Code>
                  {verifyData.guild?.adminContact && (
                    <>
                      <Space h="xs" />
                      <Text size="sm">
                        {t.rich("admin_contact", {
                          adminContact: verifyData.guild?.adminContact,
                          url: (chunks: any) => {
                            return <a href={verifyData.guild?.adminContact}>{chunks}</a>;
                          },
                        })}
                      </Text>
                    </>
                  )}
                </>
              ) || (
                <Text size="sm">{t("success")}</Text>
              )}
            </>
          )) || <Loader type="dots" size="md" />}
      </Paper>
      <Space h="sm" />
      <Paper className={classes.paper} px="md" py="xs" withBorder>
        <Text style={{display: "flex", gap: rem(4), justifyContent: "center", alignItems: "center"}} size="md" ta="center">
          <IconAlertTriangle size={36} color="var(--mantine-color-orange-6)" />
          <Space w="xs" />
          {t.rich("scamwarning")}
        </Text>
      </Paper>
      <Space h="sm" />
      <Paper className={classes.paper} px="md" py="xs" withBorder>
        <Text size="md" ta="justify">{t.rich("legal")}</Text>
        <Text size="md" ta="justify">{tg("endorse-notice")}</Text>
      </Paper>
      <Adsense
        client="ca-pub-4625689430964513"
        slot="8619832219"
        format="horizontal"
        style={{
          width: "480px",
          marginTop: "var(--mantine-spacing-sm)",
          borderRadius: "var(--mantine-radius-md)",
          overflow: "hidden"
        }}
        responsive="true"
      />
    </div>
  );
}
