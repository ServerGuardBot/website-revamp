import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service",
};

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return children;
  }