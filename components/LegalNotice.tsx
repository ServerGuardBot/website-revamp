import { Blockquote } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function LegalNotice() {
    const t = useTranslations("legal");
    const icon = <IconAlertCircle />
    return (
        <Blockquote color="yellow" icon={icon} mt="xl" mb="md">
            {t.rich("notice")}
        </Blockquote>
    )
}