import { useContext, useEffect } from "react";

import { api } from "../../utils/apiClient";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "./styles.module.css";

export default function Home() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api
      .get("todos/list-todos")
      .then((response) => console.log("todos", response.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main className={styles.container}>
      <h1>Home</h1>
    </main>
  );
}
