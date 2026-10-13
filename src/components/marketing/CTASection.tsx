import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Ready to see your spending clearly?</h2>
      <a href="/signup" className={styles.cta}>
        Create your account
      </a>
    </section>
  );
}