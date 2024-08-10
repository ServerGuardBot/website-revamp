"use client";
import { PropsWithChildren, createContext, useContext } from "react";
import { useDisclosure } from "@mantine/hooks";

export interface MenuContext {
  menuOpen?: boolean;
  toggleMenu?: () => void;
  closeMenu?: () => void;
}

const context = createContext<MenuContext>({});

export function useMenu() {
  return useContext(context);
}

export function MenuProvider(props: PropsWithChildren<{}>) {
  const [menuOpen, { toggle, close }] = useDisclosure();

  return (
    <context.Provider
      value={{
        menuOpen: menuOpen,
        toggleMenu: toggle,
        closeMenu: close,
      }}
      {...props}
    />
  );
}
