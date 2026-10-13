import styles from "./GlowBackground.module.css";

export default function GlowBackground() {
  return (
    <div className={styles.glow} aria-hidden="true">
      <div className={styles.orb} />
    </div>
  );
}