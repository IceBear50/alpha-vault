import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <span className={styles.wordmark}>AlphaVault</span>

      <nav className={styles.links} aria-label="Primary">
        <a href="#features">Features</a>
        <a href="#analytics">Analytics</a>
        <a href="#rewards">Rewards</a>
      </nav>

      <a href="/signup" className={styles.cta}>
        Get started
      </a>
    </header>
  );
}