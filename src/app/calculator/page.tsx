import { StandaloneCalculator } from "@/components/logistics/StandaloneCalculator";
import { calculatorCopy } from "@/content/logistics";

export const metadata = {
  title: "Расчёт стоимости",
  description: calculatorCopy.description,
};

export default function CalculatorPage() {
  return <StandaloneCalculator />;
}
