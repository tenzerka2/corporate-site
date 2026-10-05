import { StandaloneCalculator } from "@/components/logistics/StandaloneCalculator";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Расчёт стоимости",
  description:
    "Калькулятор грузоперевозок по России: цена и срок для сборного груза и отдельной машины сразу, без звонка менеджеру.",
  path: "/calculator",
});

export default function CalculatorPage() {
  return <StandaloneCalculator />;
}
