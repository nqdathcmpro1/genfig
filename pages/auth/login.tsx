import HeadContainer from "@/components/Head";
import ProtectLoggedInRoutes from "@/components/ProtectLoggedInRoutes";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

type Props = {};

const Login = (props: Props) => {
  const { login, loading, errorLoginMessage } = useContext(AuthContext);

  const router = useRouter();

  type UserType = {
    email: string;
    password: string;
  };

  const [user, setUser] = useState<UserType>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login?.({
      email: user.email,
      password: user.password,
    });
  };

  return (
    <ProtectLoggedInRoutes>
      <form
        onSubmit={handleLogin}
        className="relative w-full sm:w-3/4 md:w-1/2 lg:w-1/3 p-5 h-full md:h-5/6 border-4 border-blue-600 flex flex-col items-center bg-white/50 rounded-xl gap-5"
      >
        <p className="text-2xl font-bold">ĐĂNG NHẬP</p>

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

        <p className="text-center text-sm font-bold text-red-600">
          {errorLoginMessage}
        </p>

        <div className="absolute bottom-5 h-1/12 flex flex-col items-center justify-center gap-2 w-full ">
          <button
            type="submit"
            disabled={loading}
            className="w-1/2 h-10 text-lg bg-blue-600 text-white hover:text-blue-600 hover:bg-white rounded-full border-2 border-blue-600 disabled:bg-gray-300 disabled:cursor-auto"
          >
            {loading ? "Đang chờ" : "Đăng nhập"}
          </button>

          <Link
            href="/auth/register"
            className="text-sm italic text-blue-600 font-bold"
          >
            Chưa có tài khoản? Đăng ký ngay.
          </Link>
        </div>
      </form>
    </ProtectLoggedInRoutes>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <HeadContainer>Đăng nhập</HeadContainer>
      <main className="w-full h-screen grid place-items-center">
        <div className="sm:w-10/12 w-full md:h-5/6 h-full min-h-[600px] bg-genshin rounded-xl bg-no-repeat bg-cover grid place-items-center bg-center">
          {page}
        </div>
      </main>
    </>
  );
};

export default Login;
