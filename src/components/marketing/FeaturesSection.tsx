import FeatureCard from "./FeatureCard";
import styles from "./FeaturesSection.module.css";

const FEATURES = [
  {
    eyebrow: "Transactions",
    title: "Every payment, instantly searchable",
    description:
      "Filter, sort, and search across thousands of transactions without ever waiting on a spinner.",
  },
  {
    eyebrow: "Analytics",
    title: "See where your money actually goes",
    description:
      "Category breakdowns and spending trends that update the moment your data does.",
  },
  {
    eyebrow: "Rewards",
    title: "Earn coins, redeem them your way",
    description:
      "Every successful payment earns coins. Redeem them against a catalogue built for how you spend.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}