import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

type Props = {};

const Success = (props: Props) => {
  const [secondRedirect, setSecondRedirect] = useState<number>(5);

  const router = useRouter();

  useEffect(() => {
    const second = setInterval(() => {
      if (secondRedirect >= 0) setSecondRedirect(secondRedirect - 1);
    }, 1000);
    return () => clearInterval(second);
  }, [secondRedirect]);

  useEffect(() => {
    const redirect = setTimeout(() => {
      router.replace("/");
    }, 5000);
    return () => {
      clearTimeout(redirect);
    };
  }, []);

  return (
    <div>
      Giao dịch thành công, sẽ chuyển về trang chủ trong 0
      {secondRedirect.toString()} giây nữa ...
    </div>
  );
};

export default Success;
