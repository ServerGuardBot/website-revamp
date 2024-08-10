import ServerPageContents from "@/components/ServerPageContents";
import ServerNavigation from "@/components/ServerNavigation";
import { ServerProvider } from "@/components/ServerContext";
import DashHeader from "@/components/DashHeader";
import DashNav from "./DashNav";
import { Metadata } from "next";

import classes from "./layout.module.css";
import { MenuProvider } from "@/components/MenuContext";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classes.main}>
      <MenuProvider>
        <ServerProvider>
          <ServerNavigation />
          <DashNav />
          <div className={classes.container}>
            <DashHeader />
            <ServerPageContents>{children}</ServerPageContents>
          </div>
        </ServerProvider>
      </MenuProvider>
    </div>
  );
}
