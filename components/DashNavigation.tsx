"use client";
import { IconChevronDown } from "@tabler/icons-react";
import blurBanner from "@/helpers/blurBanner";
import { usePathname } from "next/navigation";
import { useServer } from "./ServerContext";
import { useState } from "react";
import Link from "next/link";
import {
  BackgroundImage,
  Title,
  NavLink,
  Badge,
  NavLinkProps,
  ScrollArea,
} from "@mantine/core";

import classes from "./DashNavigation.module.css";

export interface DashLink {
  name: string;
  description?: string;
  href?: string;
  icon?: any;
  children?: DashLink[];
  isNew?: Date;
}

interface NavLinkWrapperProps extends NavLinkProps {
  component?: React.ElementType<any>;
  href?: string;
}

function NavLinkWrapper(props: NavLinkWrapperProps) {
  const [open, setOpen] = useState(true);

  if (props.children) {
    let newProps = { ...props };
    newProps.component = undefined;
    newProps.href = undefined;
    return (
      <NavLink
        {...(props as NavLinkProps)}
        onClick={() => setOpen(!open)}
        opened={open}
        className={classes.link}
        rightSection={<IconChevronDown size={16} stroke={1.5} />}
      >
        {props.children}
      </NavLink>
    );
  } else {
    return <NavLink {...(props as NavLinkProps)} className={classes.link} />;
  }
}

function renderLinks(path: string, base: string, links: DashLink[]) {
  return links.map((link) => {
    let isNew = false;
    if (link.isNew) {
      const diff = Date.now() - link.isNew.getTime();
      isNew = diff < 1000 * 60 * 60 * 24 * 7 * 2; // 2 Weeks
    }
    const href =
      (link.href && `${base}${link.href}`) || (link.href == "" && base) || "#";
    return (
      <NavLinkWrapper
        key={link.name}
        label={link.name}
        className={classes.link}
        description={link.description}
        active={(href && `${base}${path}` == href) || false}
        leftSection={link.icon && <link.icon size="1.5rem" stroke={2} />}
        component={Link}
        href={href}
        rightSection={
          isNew && (
            <Badge size="sm" color="red">
              NEW
            </Badge>
          )
        }
      >
        {link.children && renderLinks(path, base, link.children)}
      </NavLinkWrapper>
    );
  });
}

export default function DashNavigation({
  links,
  base = "/",
}: {
  links: DashLink[];
  base?: string;
}) {
  let server;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    server = useServer();
    if (server.sessionGuild) {
      base = `/my/servers/${server.sessionGuild.id}/`;
    } else {
      base = "/my/servers/UNKNOWN/";
    }
  } catch (e) {}

  const pathname = usePathname().split(base)[1] || "";
  const renderedLinks = renderLinks(pathname, base, links);

  const contents = (
    <>
      {server?.status == "success" && (
        <div className={classes.bannerContainer}>
          <BackgroundImage
            className={classes.banner}
            src={blurBanner(server.sessionGuild?.banner as string)}
          >
            <Title className={classes.text}>{server.sessionGuild?.name}</Title>
          </BackgroundImage>
        </div>
      )}
      <ScrollArea.Autosize className={classes.scrollArea}>
        {renderedLinks.length > 0 && renderedLinks}
      </ScrollArea.Autosize>
    </>
  );

  return <nav className={classes.navbar}>{contents}</nav>;
}
