import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  eyebrow,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className={styles.card}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}