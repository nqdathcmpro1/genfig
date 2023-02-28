import HeadContainer from "@/components/Head";
import React from "react";
import { BsClock } from "react-icons/bs";

type Props = {};

const Promotion = (props: Props) => {
  return (
    <>
      <HeadContainer>Ưu đãi</HeadContainer>
      <div className="w-full flex flex-col items-center ">
        <div className="w-full p-5 flex flex-col gap-5 divide-y-2 devide-black">
          <div className="w-full flex flex-col items-center gap-5">
            <h1 className="text-3xl font-bold text-red-600 text-center">
              THÔNG BÁO: KHUYẾN MÃI 50% NHÂN DỊP KHIA TRƯƠNG GENFIG
            </h1>

            <span className="text-xs text-center flex items-center gap-2">
              <BsClock />
              10/2/2023
            </span>

            <p className="text-lg">
              Giảm giá 50% toàn bộ các mặt hàng từ hôm nay đến 10/3/2023
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Promotion;
