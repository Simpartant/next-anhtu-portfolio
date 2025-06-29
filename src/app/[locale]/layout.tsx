import { notFound } from "next/navigation";
import { Locale, hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { routing } from "@/i18n/routing";
import { clsx } from "clsx";
import "../globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
};

const montserrat = Montserrat({ subsets: ["latin"] });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: Omit<Props, "children">) {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "IndexPage" });

  return {
    title: t("title"),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html className="h-full" lang={locale}>
      <body className={clsx(montserrat.className, "")}>
        <NextIntlClientProvider>
          <Toaster />
          <ConditionalLayout>{children}</ConditionalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
