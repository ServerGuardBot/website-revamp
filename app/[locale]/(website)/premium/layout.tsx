import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
