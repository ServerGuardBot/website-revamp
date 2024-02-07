import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <SiteHeader />
        <main className="main-content">{children}</main>
        <SiteFooter />
    </>
  );
}
