import LegalNav from "@/components/LegalNav";
import classes from "./layout.module.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <div className={classes.container}>
            <LegalNav />
            <main className={classes.main}>{children}</main>
        </div>
    </>
  );
}
