"use client";
import { Button, Center, Loader, Paper, Stack, Text } from "@mantine/core";
import { useClipboard, useLocalStorage } from "@mantine/hooks";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { IconCopy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import classes from "./page.module.css";
import { useSession } from "@/app/api/client";

interface LoginState {
  code?: string;
  lock?: string;
  hasLoaded: number;
}

export default function Page() {
  const [loginState, setLoginState] = useLocalStorage<LoginState>({
    key: "login-state",
    defaultValue: {
      hasLoaded: 0,
    },
  });
  const windowRef = useRef<Window | null>(null);
  const clipboard = useClipboard({ timeout: 500 });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (loginState.hasLoaded == 0) {
        setLoginState({
          hasLoaded: 1,
        });
      }
    }, 1000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/my/account");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (loading) return;
    if (loginState.hasLoaded == 0) return;
    if (loginState?.code) return;
    setLoading(true);
    const req = new ServerGuardRequest("/login", "POST");
    req
      .execute()
      .then((res) => {
        if (res.status == "ok") {
          setLoginState({
            code: res.token,
            lock: res.lock,
            hasLoaded: 2,
          });
          setLoading(false);
        }
      })
      .catch((res) => {
        if (res.status == 401) {
          session.loadSession().then(() => {
            router.push("/my/account");
          });
        } else {
          setTimeout(
            () =>
              setLoginState({
                hasLoaded: 1,
              }),
            1000
          );
          setLoading(false);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loginState.code == undefined || loginState.lock == undefined) {
        return;
      }
      const req = new ServerGuardRequest(
        `/login/${loginState.lock}/${loginState.code}`,
        "GET"
      );
      req
        .execute()
        .then((res) => {
          if (res.status == "ok" && res.state == 1) {
            if (windowRef.current) {
              windowRef.current.close();
              windowRef.current = null;
            }
            if ("serviceWorker" in navigator) {
              navigator.serviceWorker
                .getRegistration()
                .then((reg) =>
                  reg?.active?.postMessage({ type: "reloadSession" })
                );
            }
            setLoginState({
              hasLoaded: 1,
            });
            session.loadSession().then(() => {
              router.push("/my/account");
            });
          }
        })
        .catch(() => {
          setLoginState({
            hasLoaded: 1,
          });
        });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginState]);

  useEffect(() => {
    if (clipboard.copied) {
      notifications.show({
        title: "Copied!",
        message: "Copied to clipboard",
        color: "green",
      });
    } else {
      if (clipboard.error) {
        notifications.show({
          title: "Error!",
          message: "Failed to copy to clipboard",
          color: "red",
        });
      }
    }
  });

  return (
    <div className={classes.main}>
      <Paper px="md" py="xs" withBorder>
        <Stack align="center" gap="xs">
          {!loginState.code ? (
            <Loader type="dots" size="md" />
          ) : (
            <>
              <Button
                className={classes.code}
                leftSection={<IconCopy />}
                size="sm"
                onClick={() => {
                  clipboard.copy(loginState.code);
                }}
                c="dimmed"
              >
                {loginState.code}
              </Button>
              <Text>
                Send this code in{" "}
                <a
                  target="_blank"
                  href="https://www.guilded.gg/server-guard/groups/D57rgP7z/channels/1f6fae7f-6cdf-403d-80b9-623a76f8b621/chat"
                  className={classes.channel}
                  onClick={(e) => {
                    e.preventDefault();
                    if ((e?.target as HTMLAnchorElement)?.href) {
                      const newWindow = window.open(
                        (e.target as HTMLAnchorElement).href,
                        "_blank",
                        "popup=true, noopener=true"
                      );
                      if (newWindow) {
                        newWindow.focus();
                        windowRef.current = newWindow;
                      }
                    }
                  }}
                >
                  #Login
                </a>{" "}
                in our support server to log in!
              </Text>
              <Text>
                Please keep this page open until you have sent the code, it will
                automatically redirect to the account page once logged in.
              </Text>
            </>
          )}
        </Stack>
      </Paper>
    </div>
  );
}
