import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} AlphaVault</span>
      <div className={styles.links}>
        <a href="#features">Features</a>
        <a href="#rewards">Rewards</a>
      </div>
    </footer>
  );
}