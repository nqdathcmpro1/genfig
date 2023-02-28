import HeadContainer from "@/components/Head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

type Props = {};

const Register = (props: Props) => {
  type newUserType = {
    displayName: string;
    email: string;
    password: string;
  };

  const [newUser, setNewUser] = useState<newUserType>({
    displayName: "",
    email: "",
    password: "",
  });

  const { register, loading, errorRegisterMessage } = useContext(AuthContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({ ...newUser, [e?.target.name]: e?.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    await register?.({
      email: newUser.email,
      password: newUser.password,
      displayName: newUser.displayName,
    });
  };

  return (
    <form
      onSubmit={handleRegister}
      className="relative w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-5 h-full md:h-5/6 border-4 border-blue-600 flex flex-col items-center bg-white/50 rounded-xl gap-5"
    >
      <p className="text-2xl font-bold">ĐĂNG KÝ</p>

      <div className="w-full flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-bold">
          Email
        </label>
        <input
          onChange={handleChange}
          name="email"
          id="email"
          type="text"
          placeholder="Email"
          className="w-full h-10 rounded-full p-2"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-bold">
          Họ tên
        </label>
        <input
          onChange={handleChange}
          name="displayName"
          id="displayName"
          type="text"
          placeholder="Họ tên"
          className="w-full h-10 rounded-full p-2"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-bold">
          Mật khẩu
        </label>
        <input
          onChange={handleChange}
          name="password"
          id="password"
          type="password"
          placeholder="Mật khẩu"
          className="w-full h-10 rounded-full p-2"
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <label htmlFor="repassword" className="text-sm font-bold">
          Nhập lại mật khẩu
        </label>
        <input
          onChange={handleChange}
          name="repassword"
          id="repassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          className="w-full h-10 rounded-full p-2"
        />
      </div>

      <div className="text-red-600 font-bold text-sm">
        {errorRegisterMessage}
      </div>

      <div className="absolute bottom-5 h-1/12 flex flex-col items-center justify-center gap-2 w-full ">
        <button
          type="submit"
          className="w-1/2 h-10 text-lg bg-blue-600 text-white hover:text-blue-600 hover:bg-white rounded-full border-2 border-blue-600 disabled:bg-gray-300 disabled:cursor-auto"
          disabled={loading}
        >
          {loading ? "Đang chờ" : "Đăng ký"}
        </button>

        <Link href="/auth/login" className="text-sm italic text-blue-600 font-bold">
          Có tài khoản? Đăng ngập ngay.
        </Link>
      </div>
    </form>
  );
};

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <HeadContainer>Đăng ký</HeadContainer>
      <main className="w-full h-screen grid place-items-center">
        <div className="sm:w-10/12 w-full md:h-5/6 h-full min-h-[600px] bg-genshin rounded-xl bg-no-repeat bg-cover grid place-items-center bg-center">
          {page}
        </div>
      </main>
    </>
  );
};

export default Register;
