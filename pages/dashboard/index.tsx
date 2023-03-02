import { db } from "@/config/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { PaymentProps } from "@/interface";
import React from "react";
import DashboardNav from "@/components/DashboardNav";
import showPrice from "@/utils/showPrice";
import {
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineCalendar,
  AiOutlineCreditCard,
} from "react-icons/ai";

type Props = {
  paymentData: PaymentProps[];
};

const Dashboard = ({ paymentData }: Props) => {
  return (
    <div className="w-full p-5">
      <div className="xl:block hidden max-h-[600px] overflow-auto rounded-lg">
        <table className="border-2 border-gray-400/10  w-full overflow-scroll relative text-left">
          <thead className="sticky top-0 text-md bg-gray-100 shadow-lg font-extrabold w-full">
            <tr className="tracking-wide ">
              <th className="w-32 p-3 whitespace-nowrap">Mã giao dịch</th>
              <th className="w-32 p-3 whitespace-nowrap">Ngày giao dịch</th>
              <th className="w-32 p-3 whitespace-nowrap">ID khách giao dịch</th>
              <th className="w-64 p-3 whitespace-nowrap">Giỏ hàng</th>
              <th className="w-32 p-3 whitespace-nowrap">Tổng tiền</th>
              <th className="w-32 p-3 whitespace-nowrap">Ngân hàng</th>
              <th className="w-32 p-3 whitespace-nowrap">STK giao dịch</th>
              <th className="w-32 p-3 whitespace-nowrap">Tên chủ giao dịch</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y-2 divide-gray-400/10">
            {paymentData.map((payment) => (
              <tr key={payment.id} className="even:bg-slate-100 bg-white">
                <td className="w-32 px-3 py-2 text-blue-400 font-bold whitespace-nowrap border-gray-400">
                  {payment.id}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {new Date(
                    (payment.paymentTime as number) * 1000
                  ).toLocaleString("vi-VN")}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {payment.userId}
                </td>
                <td className="w-64 px-3 py-2 whitespace-nowrap border-gray-400 text-left list-none">
                  {payment.cart.map((item) => (
                    <li>
                      {item.name} ({item.cartQuantity})
                    </li>
                  ))}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {payment.totalPrice}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {payment.bank}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {payment.accountNumber}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {payment.accountOwner}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="xl:hidden grid gap-5">
        {paymentData.map((payment) => (
          <div className="w-full rounded-lg shadow-xl p-3 flex flex-col text-sm">
            <span className="flex gap-5">
              <p className="text-blue-400 font-bold">#{payment.id}</p>
              <p className="font-bold text-red-500">
                {showPrice(payment.totalPrice)}
              </p>
            </span>
            <span className="flex gap-1 items-center">
              <AiOutlineCalendar />
              <p>
                {new Date(
                  (payment.paymentTime as number) * 1000
                ).toLocaleString("vi-VN")}
              </p>
            </span>
            <span className="flex gap-1 items-center">
              <AiOutlineUser />
              <p>{payment.userId}</p>
            </span>
            <span className="flex gap-1 items-baseline">
              <AiOutlineShoppingCart />
              <span className="flex flex-col">
                {payment.cart.map((item) => (
                  <p>
                    {item.name} ({item.cartQuantity})
                  </p>
                ))}
              </span>
            </span>
            <span className="flex gap-1 items-center">
              <AiOutlineCreditCard />
              <p>
                {payment.bank} - {payment.accountNumber} -{" "}
                {payment.accountOwner}
              </p>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <main className="bg-slate-50 min-h-screen">
      <DashboardNav />
      <div className="w-full">{page}</div>
    </main>
  );
};

export const getServerSideProps = async () => {
  const queryPaymentsSnapshot = await getDocs(
    query(collection(db, "payment"), orderBy("paymentTime", "desc"))
  );
  const paymentData: PaymentProps[] = [];
  queryPaymentsSnapshot.forEach((payment) => {
    paymentData.push({
      id: payment.id,
      cart: payment.data().cart,
      userId: payment.data().userId,
      totalPrice: payment.data().totalPrice,
      accountNumber: payment.data().accountNumber,
      accountOwner: payment.data().accountOwner,
      bank: payment.data().bank,
      paymentTime: payment.data().paymentTime.seconds,
    });
  });

  return {
    props: {
      paymentData,
    },
  };
};

export default Dashboard;
