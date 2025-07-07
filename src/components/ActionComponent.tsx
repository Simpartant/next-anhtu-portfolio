import { useTranslations } from "next-intl";
import Button from "./Button";

export default function ActionComponent() {
  const t = useTranslations("ActionComponent");

  return (
    <div className="flex w-full flex-col px-6 xl:px-0">
      <div className="divider"></div>
      <div className="flex flex-col lg:flex-row items-center gap-10 justify-between mx-6 lg:mx-0 py-10 lg:py-15">
        <p className="text-2xl font-bold">{t("actionDescription")}</p>
        <Button variant="primary" className="font-bold">
          {t("action")}
        </Button>
      </div>
      <div className="divider"></div>
    </div>
  );
}
