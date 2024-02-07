"use client";
import Link from "next/link";

const TRANSLATION_VALUES = {
  support: (chunks: any) => (
    <a href="https://guilded.gg/server-guard">{chunks}</a>
  ),
  invite: (chunks: any) => (
    <a href="https://www.guilded.gg/b/2b2fa670-37c9-453c-8b35-5473fe932e6f">
      {chunks}
    </a>
  ),
  docs: (chunks: any) => (
    <a href="https://www.guilded.gg/server-guard/groups/D57rgP7z/channels/7ad31d28-0577-4f18-a80d-d401ceacf9db/docs">
      {chunks}
    </a>
  ),
  premium: (chunks: any) => <Link href="/premium">{chunks}</Link>,
  reapimus: (chunks: any) => <a href="https://reapimus.com">{chunks}</a>,
  website: (chunks: any) => <Link href="/">{chunks}</Link>,
  year: new Date().getFullYear().toString(),
  em: (chunks: any) => <em>{chunks}</em>,
};

export default TRANSLATION_VALUES;
