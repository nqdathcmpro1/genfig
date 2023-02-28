import HeadContainer from "@/components/Head";
import ProtectUnloggedInRoutes from "@/components/ProtectUnloggedInRoutes";
import { AuthContext } from "@/context/AuthContext";
import { UserType } from "@/interface";
import React, { useContext, useState } from "react";

type Props = {};

const CustomerDetail = (props: Props) => {
  const { currentUser } = useContext(AuthContext);

  const initialProfile:UserType = {
    email: currentUser?.email as string,
    displayName: currentUser?.displayName as string,
  }

  const [opendEdit, setOpenEdit] = useState<boolean>(false);

  const [profile, setProfile] = useState<UserType>(initialProfile);

  const handleChangeProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };


  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
  }

  const handleCancel = () => {
    setOpenEdit(false)
    setProfile(initialProfile)
  }

  return (
    <ProtectUnloggedInRoutes>
      <HeadContainer>Quản lý tài khoản</HeadContainer>
      <form onSubmit={handleUpdateUser} className="w-full md:w-2/3 flex flex-col items-center gap-3 md:gap-5">
        <h1 className="text-2xl md:text-5xl font-bold">THÔNG TIN CÁ NHÂN</h1>
        <div className="w-full flex flex-col gap-1">
          <label htmlFor="displayName" className="text-sm italic">
            Họ tên:
          </label>
          <input
            id="displayName"
            name="displayName"
            className="text-sm rounded-full px-2 disabled:bg-slate-200"
            type="text"
            placeholder="Họ tên"
            disabled={!opendEdit}
            value={profile?.displayName}
            onChange={handleChangeProfile}
          />
        </div>

        

        <div className="w-full flex flex-col gap-1">
          <label htmlFor="email" className="text-sm italic">
            Email:
          </label>
          <input
            id="email"
            name="email"
            className="text-sm rounded-full px-2 disabled:bg-slate-200"
            type="text"
            placeholder="Email"
            disabled={!opendEdit}
            value={profile?.email}
            onChange={handleChangeProfile}
          />
        </div>

        

        {opendEdit ? (
          <div className="w-1/2 flex items-center justify-between gap-5">
            <button
              className="border-2 border-red-600 text-red-600 p-3 hover:bg-red-600 hover:text-white rounded-lg"
              onClick={handleCancel}
            >
              Huỷ bỏ
            </button>
            <button type="submit" className="border-2 border-cyan-400 text-cyan-400 p-3 hover:bg-cyan-400 hover:text-white rounded-lg">
              Đồng ý
            </button>
          </div>
        ) : (
          <div className="w-1/2 flex items-center justify-center gap-5">
            <button
              type="button"
              className="border-2 border-cyan-400 text-cyan-400 p-3 hover:bg-cyan-400 hover:text-white rounded-lg"
              onClick={() => setOpenEdit(true)}
            >
              Chỉnh sửa
            </button>
          </div>
        )}
      </form>
    </ProtectUnloggedInRoutes>
  );
};

export default CustomerDetail;
