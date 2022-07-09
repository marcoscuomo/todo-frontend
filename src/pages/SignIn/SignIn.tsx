import styles from "./styles.module.css";

export default function SignIn() {
  return (
    <main className={styles.container}>
      <form>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <footer>
          <button>Sign In</button>
          <button>Sign Up</button>
        </footer>
      </form>
    </main>
  );
}
