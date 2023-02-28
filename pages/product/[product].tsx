import HeadContainer from "@/components/Head";
import { db } from "@/config/firebase";
import { CartContext } from "@/context/CartContext";
import { Product } from "@/interface";
import showPrice from "@/utils/showPrice";
import console from "console";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { Breadcrumb } from "flowbite-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { ChangeEvent, useState, useContext } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { BsCart2 } from "react-icons/bs";

type Props = {
  product: Product;
};

const BreadcrumbComponent = () => {
  const router = useRouter();

  return (
    <Breadcrumb className="md:text-xl text-sm flex items-center">
      <Breadcrumb.Item href="/" className="">
        Home
      </Breadcrumb.Item>
      <Breadcrumb.Item href="/collection/all">Hàng có sẵn</Breadcrumb.Item>
      <Breadcrumb.Item>Raiden Shogun</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const ProductDetail = ({ product }: Props) => {
  const { addCartItem } = useContext(CartContext);

  const [quantity, setQuantity] = useState<number>(1);

  const handleChangeInput = async (e: ChangeEvent<HTMLInputElement>) => {
    await setQuantity(
      Number(e.target.value) <= product.quantity
        ? Number(e.target.value)
        : product.quantity
    );
  };

  const handleIncrease = () => {
    if (quantity < product?.quantity) setQuantity(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (addCartItem) {
      addCartItem({
        ...product,
        cartQuantity: quantity,
        totalPrice: product.price * quantity,
      });
    }
  };

  return (
    <div className="w-full h-fit sticky top-0 flex md:flex-row flex-col gap-3 justify-between">
      <div className="md:w-5/12 w-full sticky top-0">
        <img className="w-full object-cover rounded-lg" src={product.imgUrl} />
      </div>
      <div className="md:w-6/12 w-full px-2 md:px-5 flex flex-col items-center md:items-start md:gap-5 gap-3">
        <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
        <h1 className="text-5xl md:text-6xl font-bold text-red-600">
          {showPrice(product.price)}
        </h1>
        <div className="md:w-80 w-full bg-white font-bold h-fit flex items-center gap-5 md:relative fixed bottom-0 p-2 border-t-2">
          <form onSubmit={handleAddCart} className="w-full h-fit flex gap-5">
            <button
              type="submit"
              disabled={product.quantity <= 0}
              className="w-1/2 text-sm md:text-3xl bg-red-600 rounded-xl flex items-center justify-center md:p-5 md:gap-5 p-2 gap-2 hover:bg-green-400 text-white disabled:bg-gray-400 disabled:text-white disabled:cursor-default"
            >
              <BsCart2 />
              <p>MUA</p>
            </button>
            <div className="w-1/2 flex items-center">
              <BiMinus
                type="button"
                className={`w-1/5 text-3xl aspect-square cursor-pointer ${
                  quantity === 1 && "text-gray-400 cursor-default"
                }`}
                onClick={handleDecrease}
              />
              <input
                type="number"
                value={quantity}
                className="text-sm w-3/5 border-2 text-center"
                onChange={handleChangeInput}
              />
              <BiPlus
                className={`w-1/5 text-3xl aspect-square cursor-pointer ${
                  quantity >= product?.quantity &&
                  "text-gray-400 cursor-default"
                }`}
                onClick={handleIncrease}
              />
            </div>
          </form>
        </div>
        <p className="italic text-sm">{product.quantity > 0 ? `Còn lại : ${product.quantity}` : "Hết hàng"}</p>
        <h1 className="text-lg md:text-xl text-green-400 font-bold">
          THÔNG TIN SẢN PHẨM
        </h1>
        <h1 className="w-full text-sm">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error,
          distinctio tenetur veniam voluptatibus saepe deleniti molestias ullam
          quo illum praesentium eum, dicta ex?
        </h1>
      </div>
    </div>
  );
};

const ProductPage = ({ product }: Props) => {
  return (
    <>
      <HeadContainer>{product.name as string}</HeadContainer>
      <div className="w-full h-fit flex flex-col gap-5 relative">
        <BreadcrumbComponent />
        <ProductDetail product={product} />
      </div>
    </>
  );
};

export default ProductPage;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;

  const queryProductSnapshot = await getDoc(
    doc(db, "products", params?.product as string)
  );

  return {
    props: {
      product: {
        ...queryProductSnapshot.data(),
        id: queryProductSnapshot.id,
        timestamp: queryProductSnapshot.data()?.timestamp.toDate().getTime()
      },
    },
  };
};
