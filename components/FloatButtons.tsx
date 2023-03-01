import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  forwardRef,
} from "react";
import { BsArrowUp, BsCart } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai"

import showPrice from "@/utils/showPrice";
import { CartContext } from "@/context/CartContext";
import { CartItemType } from "@/interface";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useRouter } from "next/router";

type Props = {};

type CartProps = {
  ref: React.Ref<HTMLDivElement>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
};

type CartItemProps = {
  item: CartItemType;
};

const CartItem = ({ item }: CartItemProps) => {
  const { setCartItemAmount, deleteCartItem } = useContext(CartContext);

  return (
    <div className="w-full h-fit p-5 flex justify-between gap-3">
      <img className="w-1/6 rounded-lg" src={item.imgUrl} />
      <div className="w-5/6 font-bold flex flex-col gap-2">
        <p className="text-lg font-bold">{item.name}</p>
        <p className="text-lg font-bold text-red-600">
          {showPrice(item.totalPrice)}
        </p>
        <div className="w-1/2 flex items-center">
          <BiMinus
            className={`w-1/5 text-3xl aspect-square cursor-pointer ${
              item.cartQuantity <= 0 && "text-gray-400 cursor-default"
            }`}
            onClick={() => setCartItemAmount?.(item.cartQuantity - 1, item.id)}
          />
          <input
            type="number"
            value={item.cartQuantity}
            className="text-sm w-3/5 border-2 text-center"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCartItemAmount?.(Number(e.target.value), item.id)
            }
          />
          <BiPlus
            className={`w-1/5 text-3xl aspect-square cursor-pointer ${
              item.cartQuantity >= item.quantity &&
              "text-gray-400 cursor-default"
            }`}
            onClick={() => setCartItemAmount?.(item.cartQuantity + 1, item.id)}
          />
        </div>
      </div>
      <MdDelete
        onClick={() => deleteCartItem && deleteCartItem(item.id)}
        className="text-3xl cursor-pointer"
      />
    </div>
  );
};

const Cart = forwardRef(
  ({ isOpen, setIsOpen }: CartProps, ref: React.Ref<HTMLDivElement>) => {
    const { cart, totalPrice } = useContext(CartContext);

    const router = useRouter()

    return (
      <div
        ref={ref}
        className={`md:absolute z-40 fixed overflow-hidden md:bottom-[80%] bottom-0 md:right-[80%] right-0 md:w-[500px] w-full md:h-96 h-screen rounded-xl bg-white border-2 shadow-xl ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="px-5 py-1 h-12 z-30 fixed rounded-t-xl flex md:w-[500px] w-full items-center justify-between gap-5 bg-white shadow-lg">
          <div className="w-4/6 flex gap-3">
            <p className="text-sm italic">Tổng:</p>
            <p className="text-xl font-bold">{showPrice(totalPrice)}</p>
          </div>

          <button onClick={() => totalPrice > 0 && router.push("/payment") } className="w-24 h-full text-white bg-red-600 rounded-lg">
            Thanh toán
          </button>

          <AiOutlineCloseCircle onClick={() => setIsOpen(false)} className="md:hidden block text-3xl font-bold cursor-pointer" />
        </div>
        <div className="w-full h-full overflow-y- relative pt-12 grid grid-cols-1 divide-y-2">
          {cart?.map((item, index) => (
            <CartItem key={index} item={item} />
          ))}
        </div>
      </div>
    );
  }
);

const ScrollToTopButton = () => {
  const handleScrollClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handleScrollClick}
      className="w-8 md:w-12 aspect-square rounded-full cursor-pointer border-2 bg-white grid place-items-center"
    >
      <BsArrowUp className="w-full md:text-5xl text-xl" />
    </div>
  );
};

const CartButton = () => {
  const { cart } = useContext(CartContext);

  const [openCart, setOpenCart] = useState<boolean>(false);

  const cartRef = useRef<HTMLDivElement>(null);

  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.addEventListener("click", (e: MouseEvent) => {
      if (
        !e.composedPath().includes(cartRef.current as HTMLElement) &&
        !e.composedPath().includes(buttonRef.current as HTMLElement)
      )
        setOpenCart(false);
    });
  }, []);

  const handleOpenCart = () => {
    setOpenCart(!openCart);
  };

  return (
    <>
      <div
        ref={buttonRef}
        onClick={handleOpenCart}
        className="w-8 md:w-12 aspect-square rounded-full cursor-pointer border-2 bg-white grid place-items-center relative"
      >
        <BsCart className="w-full md:text-3xl text-xl" />
        <div className="md:w-6 w-4 aspect-square rounded-full absolute md:right-[-10px] right-[-6px] top-[-10px]  text-white bg-red-700 md:text-xs text-[0.5rem] grid place-items-center">
          {cart.length}
        </div>
      </div>
      <Cart ref={cartRef} isOpen={openCart} setIsOpen={setOpenCart} />
    </>
  );
};

const FloatButtons = (props: Props) => {
  const router = useRouter();

  return (
    <div className="z-10 fixed md:bottom-5 bottom-10 right-2 md:right-10 flex flex-col md:gap-5 gap-2 items-center">
      {router.pathname !== "/payment" && <CartButton />}
      <ScrollToTopButton />
    </div>
  );
};

export default FloatButtons;
