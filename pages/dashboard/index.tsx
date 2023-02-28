import { db } from "@/config/firebase";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";
import { PaymentProps } from "@/interface";
import React from "react";
import DashboardNav from "@/components/DashboardNav";

type Props = {
  paymentData: PaymentProps[];
};

const Dashboard = ({ paymentData }: Props) => {
  return (
    <div className="p-5">
      <div className="overflow-auto relative">
      <table className="border-4 border-gray-400 h-[550px] w-[1500px] overflow-scroll relative">
        <thead className="sticky top-0 border-4 border-black bg-white font-bold">
          <tr className="border-4 border-black">
            <th className="border-4 border-black">Mã giao dịch</th>
            <th className="border-4 border-black">Thời gian giao dịch</th>
            <th className="border-4 border-black">ID khách giao dịch</th>
            <th className="border-4 border-black">Giỏ hàng</th>
            <th className="border-4 border-black">Tổng tiền</th>
            <th className="border-4 border-black">Ngân hàng</th>
            <th className="border-4 border-black">STK giao dịch</th>
            <th className="border-4 border-black">Tên chủ giao dịch</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((payment) => (
            <tr key={payment.id}>
              <th className="border-4 border-gray-400">{payment.id}</th>
              <th className="border-4 border-gray-400">{new Date(
                  payment.paymentTime as number  * 1000
                ).toLocaleDateString("vi-VN")}</th>
              <th className="border-4 border-gray-400">{payment.userId}</th>
              <th className="border-4 border-gray-400 text-left">
                {payment.cart.map((item) => (
                  <li>
                    {item.name} -x{item.cartQuantity}
                  </li>
                ))}
              </th>
              <th className="border-4 border-gray-400">{payment.totalPrice}</th>
              <th className="border-4 border-gray-400">{payment.bank}</th>
              <th className="border-4 border-gray-400">{payment.accountNumber}</th>
              <th className="border-4 border-gray-400">{payment.accountOwner}</th>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <DashboardNav />
      <div className="w-full">{page}</div>
    </>
  );
};

export const getServerSideProps = async () => {
  const queryPaymentsSnapshot = await getDocs(query(collection(db, "payment"), orderBy("paymentTime", "desc")));
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
