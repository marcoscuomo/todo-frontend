import Router from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "../../utils/apiClient";

import styles from "./styles.module.css";

type SignUpType = {
  firstName: string;
  lastName: string;
  cpf: string;
  password: string;
  email: string;
  birthday: string;
  genre: string;
  phoneNumber: string;
};

export default function SignUp() {
  const { register, handleSubmit } = useForm<SignUpType>();

  const handleSignUp: SubmitHandler<SignUpType> = async (data) => {
    const response = await api.post("user/create", data);
    console.log("response.data.status ", response.status);
    if (response.status === 201) {
      Router.push("/");
    }
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <input
          type="text"
          placeholder="First name"
          {...register("firstName")}
        />
        <input type="text" placeholder="Last name" {...register("lastName")} />
        <input type="text" placeholder="CPF" {...register("cpf")} />
        <input type="text" placeholder="E-mail" {...register("email")} />
        <input type="text" placeholder="Birthday" {...register("birthday")} />
        <input type="text" placeholder="Genre" {...register("genre")} />
        <input
          type="text"
          placeholder="Phone number"
          {...register("phoneNumber")}
        />
        <input type="text" placeholder="Password" {...register("password")} />

        <button type="submit">Register</button>
      </form>
    </main>
  );
}
