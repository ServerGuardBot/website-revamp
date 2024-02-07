import cx from "clsx";
import { ActionIcon, Group, Menu } from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import classes from "./LangSwitcher.module.css";
import { LANGUAGES } from "@/localization/constants";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import trimLocale from "@/helpers/trimLocale";

export default function LangSwitcher({
  size = "xl",
}: {
  size?: string | number;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const t = useTranslations("locales");
  return (
    <Group key="scheme-toggle" justify="center">
      <Menu withArrow>
        <Menu.Target>
          <ActionIcon
            variant="default"
            size={size}
            aria-label="Change languages"
          >
            <IconWorld className={classes.icon} stroke={1.5} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {
            LANGUAGES.map((item) => (
              <Menu.Item key={item} onClick={() => {
                router.push("/" + item + trimLocale(pathName));
              }}>
                {t(item)}
              </Menu.Item>
            ))
          }
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
