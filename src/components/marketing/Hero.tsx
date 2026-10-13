import GlowBackground from "./GlowBackgroud";
import Card3D from "./Card3D";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <GlowBackground />

      <div className={styles.content}>
        <Card3D />
        <h1 className={styles.headline}>
          Your spending. <span className={styles.accent}>Understood by AI.</span>
        </h1>
        <p className={styles.subhead}>
          Track every transaction, see where your money goes, and earn rewards
          on every payment — all in one dashboard.
        </p>
        <a href="/signup" className={styles.primaryCta}>
          Get started
        </a>
      </div>
    </section>
  );
}