import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy",
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return children;
  }