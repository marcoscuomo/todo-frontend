import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { AuthContext } from "../../contexts/AuthContext";

import styles from "./styles.module.css";

type TLoginType = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { register, handleSubmit } = useForm<TLoginType>();
  const { signIn } = useContext(AuthContext);

  const handleSignIn: SubmitHandler<TLoginType> = async (data) => {
    signIn(data);
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit(handleSignIn)}>
        <input type="text" placeholder="Email" {...register("email")} />
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <footer>
          <button type="submit">Sign In</button>
          <button>Sign Up</button>
        </footer>
      </form>
    </main>
  );
}
function useContent(): {} {
  throw new Error("Function not implemented.");
}
