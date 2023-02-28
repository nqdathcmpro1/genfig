import { db } from "@/config/firebase";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import showPrice from "@/utils/showPrice";
import { addDoc, collection, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

type Props = {};

type TopUpType = {
  bank?: string;
  accountNumber?: string;
  accountOwner?: string;
};

type BankListType = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  code: string;
};

const topup = (props: Props) => {
  const { cart, totalPrice, resetCart } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);

  const [bankList, setBankList] = useState<BankListType[]>();

  const [topUpInfo, setTopUpInfo] = useState<TopUpType>();

  const router = useRouter()

  useEffect(() => {
    const getBankList = async () => {
      const res = await fetch("https://api.vietqr.io/v2/banks");
      const banks = await res.json();
      setBankList(banks.data);
    };
    getBankList();
    return () => {};
  }, []);

  const handleChangeTopUpInfo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.target.value = e.target.value.toString().toUpperCase();
    setTopUpInfo({ ...topUpInfo, [e.target.name]: e.target.value });
  };

  const handleAcceptPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "payment"), {
        userId: currentUser?.uid,
        cart,
        totalPrice,
        ...topUpInfo,
        paymentTime: serverTimestamp()
      });
  
      cart.forEach(async (item) => {
        await updateDoc(doc(db, "products", item.id), {
          quantity: item.quantity - item.cartQuantity,
        })
      })

      await resetCart?.()
      router.replace("/payment/success")
    } catch (error) {
      console.log(error)
    }


  };

  return (
    <div className="w-full flex relative gap-5">
      <div className="md:w-2/3 w-full">
        <p className="w-full text-center text-3xl font-extrabold">
          XÁC NHẬN THANH TOÁN
        </p>
        <div className="w-full flex flex-col gap-3 divide-y-2">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div className="w-full flex items-center gap-3 p-3 rounded-lg">
                <img src={item.imgUrl} className="w-1/12 rounded-lg" />
                <div className="w-11/12 relative flex flex-col gap-2 justify-start">
                  <p className="font-extrabold text-xl">{item.name}</p>
                  <p className="italic">Số lượng: {item.cartQuantity}</p>
                  <p className="absolute bottom-0 right-0">
                    {showPrice(item.totalPrice)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center italic p-5">
              Không có sản phẩm trong giỏ hàng
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-5">
          <span className="text-right">
            Tổng cộng:
            <p className="text-2xl font-bold tetx-red-600">
              {showPrice(totalPrice)}
            </p>
          </span>
          <form
            onSubmit={handleAcceptPayment}
            className="w-full flex flex-col gap-2"
          >
            <div className="w-full md:w-1/2">
              <label htmlFor="bank">Chọn ngân hàng</label>
              <select
                id="bank"
                name="bank"
                onChange={handleChangeTopUpInfo}
                className="w-full h-12 rounded-xl truncate border-2"
              >
                <option defaultValue={""} value="" disabled>
                  Chọn ngân hàng
                </option>
                {bankList?.map((bank) => (
                  <option key={bank.id} value={bank.code}>
                    {bank.name} - {bank.shortName}
                  </option>
                ))}
              </select>
            </div>

            {topUpInfo?.bank && (
              <>
                <div className="w-full md:w-1/2">
                  <label htmlFor="accountOwner">Chủ tài khoản</label>
                  <input
                    id="accountOwner"
                    name="accountOwner"
                    onChange={handleChangeTopUpInfo}
                    className="w-full h-12 rounded-xl border-2 px-4"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label htmlFor="accountNumber">Số tài khoản</label>
                  <input
                    type="number"
                    id="accountNumber"
                    name="accountNumber"
                    onChange={handleChangeTopUpInfo}
                    className="w-full h-12 rounded-xl border-2 px-4"
                  />
                </div>
              </>
            )}
            <div className="w-full flex justify-center items-center gap-12">
              <button className="px-4 py-2 rounded-full">Huỷ bỏ</button>
              <button
                type="submit"
                disabled={!topUpInfo?.accountNumber || !topUpInfo?.accountOwner || cart.length === 0}
                className="px-4 py-2 bg-green-600 hover:bg-green-800 disabled:bg-gray-400 text-white rounded-full"
              >
                Thanh toán
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="hidden md:block w-1/6">
        <div className="w-64 text-center fixed rounded-lg border-4 border-red-600 text-red-600 bg-white border-spacing-2 p-2 break-words">
          <p className="text-xl font-extrabold">CHÚ Ý!</p>
          <p>
            Vui lòng kiểm tra kỹ lưỡng giao dịch của Quý khách. Chúng tôi xin
            miễn trừ mọi trách nhiệm với mọi sai sót trong quá trình tổng kết
            đơn hàng của Quý khách.
          </p>
        </div>
      </div>
    </div>
  );
};

export default topup;
