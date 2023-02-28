import HeadContainer from "@/components/Head";
import { db } from "@/config/firebase";
import { AuthContext } from "@/context/AuthContext";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import { PaymentProps } from "@/interface";
import showPrice from "@/utils/showPrice";

type Props = {};

const PaymentHistory = () => {
  const { currentUser } = useContext(AuthContext);

  const [isAscending, setIsAscending] = useState<boolean>(false);

  const [paymentData, setPaymentData] = useState<PaymentProps[]>();

  useEffect(() => {
    const getPayment = async () => {
      const queryPaymentSnapshot = await getDocs(
        query(
          collection(db, "payment"),
          where("userId", "==", currentUser?.uid),
          orderBy("paymentTime", isAscending ? "asc" : "desc")
        )
      );
      const payments: PaymentProps[] = [];
      queryPaymentSnapshot.forEach((payment) => {
        payments.push({
          id: payment.id,
          userId: payment.data().userId,
          cart: payment.data().cart,
          totalPrice: payment.data().totalPrice,
          paymentTime: payment.data().paymentTime.seconds,
        });
      });
      setPaymentData(payments);
    };
    getPayment();
  }, [currentUser, isAscending]);

  return (
    <>
      <HeadContainer>Lịch sử mua hàng</HeadContainer>
      <div className="w-full flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Lịch sử mua hàng</h1>

        <div className="w-full md:w-1/2 h-12 relative group">
          <div className="w-full h-full p-2 border-2 group flex items-center justify-between gap-2">
            <p className="font-bold text-sm">Sắp xếp theo</p>
            <MdExpandMore className="text-sm group-hover:rotate-180" />
          </div>
          <div className="w-full absolute top-full text-sm hidden group-hover:flex flex-col bg-white divide-y-2 border-2">
            <div
              onClick={() => setIsAscending(false)}
              className={`w-full p-2 cursor-pointer ${
                !isAscending && "text-orange-300"
              }`}
            >
              Mới nhất
            </div>
            <div
              onClick={() => setIsAscending(true)}
              className={`w-full p-2 cursor-pointer ${
                isAscending && "text-orange-300"
              }`}
            >
              Cũ nhất
            </div>
          </div>
        </div>

        {paymentData?.map((payment) => (
          <div className="w-full flex flex-col gap-5 justify-center">
            <div className="w-full rounded-xl border-2 p-5 grid grid-cols-2">
              <p className="md:text-xl text-lg font-bold">
                {new Date(
                  payment.paymentTime as number * 1000
                ).toLocaleDateString("vi-VN")}
              </p>
              <p className="md:text-xl text-lg font-bold text-red-600 text-end">
                {showPrice(payment.totalPrice)}
              </p>
              <ul className="w-full text-sm">
                {payment.cart.map((item) => (
                  <li>
                    {item.name} ({item.cartQuantity})
                  </li>
                ))}
              </ul>
              <p className="text-sm text-blue-600 italic text-end">
                Thành công
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentHistory;
