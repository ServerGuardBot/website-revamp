"use client";
import { Container, Title, Accordion } from '@mantine/core';
import classes from './LandingFAQ.module.css';
import { useTranslations } from 'next-intl';

export default function LandingFAQ() {
  const t = useTranslations("home");
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        {t.rich("faq-title")}
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="verification">
          <Accordion.Control>{t.rich("faq-verification")}</Accordion.Control>
          <Accordion.Panel>{t.rich("faq-verification-panel")}</Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="data-privacy">
          <Accordion.Control>{t.rich("faq-privacy")}</Accordion.Control>
          <Accordion.Panel>
            {t.rich("faq-privacy-panel")}
          </Accordion.Panel>
          <Accordion.Panel>
            {t.rich("faq-privacy-panel-2")}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="filters">
          <Accordion.Control>{t.rich("faq-filters")}</Accordion.Control>
          <Accordion.Panel>
            {t.rich("faq-filters-panel")}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="credit-card">
          <Accordion.Control>{t.rich("faq-credit-card")}</Accordion.Control>
          <Accordion.Panel>
            {t.rich("faq-credit-card-panel")}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="support">
          <Accordion.Control>{t.rich("faq-support")}</Accordion.Control>
          <Accordion.Panel>
            {t.rich("faq-support-panel")}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="user-privacy">
          <Accordion.Control>{t.rich("faq-user-privacy")}</Accordion.Control>
          <Accordion.Panel>
            {t.rich("faq-user-privacy-panel")}
          </Accordion.Panel>
          <Accordion.Panel>
            {t.rich("faq-user-privacy-panel-2")}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}