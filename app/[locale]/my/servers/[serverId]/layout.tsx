import ServerPageContents from "@/components/ServerPageContents";
import ServerNavigation from "@/components/ServerNavigation";
import { ServerProvider } from "@/components/ServerContext";
import DashNav from "./DashNav";
import { Metadata } from "next";

import classes from "./layout.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={classes.main}>
      <ServerProvider>
        <ServerNavigation />
        <DashNav />
        <ServerPageContents>{children}</ServerPageContents>
      </ServerProvider>
    </div>
  );
}
