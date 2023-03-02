import { CartType, CartItemType } from "@/interface";
import React, { useState, createContext, useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

type ContextType = {
  cart: CartItemType[];
  totalPrice: number;
  addCartItem?: (cartItem: CartItemType) => void;
  setCartItemAmount?: (quantity: number, id: string) => void;
  deleteCartItem?: (itemId: string) => void;
  resetCart?: () => void;
};

export const CartContext = createContext<ContextType>({
  cart: [
    {
      id: "",
      name: "",
      price: 0,
      quantity: 0,
      imgUrl: "",
      category: "",
      cartQuantity: 0,
      totalPrice: 0,
      categorySlug: "",
    },
  ],
  totalPrice: 0,
});

export const CartContextProvier = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    let totalPriceCals = cart.reduce((arr, cur) => arr + cur.totalPrice, 0);
    setTotalPrice(totalPriceCals);
  }, [cart]);

  const setCartItemAmount = async (quantity: number, id: string) => {
    const itemIndex = await cart.findIndex((item) => item.id === id);
    cart[itemIndex].cartQuantity =
      quantity <= 1
        ? 1
        : quantity > cart[itemIndex].quantity
        ? cart[itemIndex].quantity
        : quantity;
    cart[itemIndex].totalPrice =
      cart[itemIndex].price * cart[itemIndex].cartQuantity;
    setTotalPrice(cart.reduce((arr, cur) => arr + cur.totalPrice, 0));
  };

  const addCartItem = async (cartItem: CartItemType) => {
    const existedCartItem = await cart.find(
      (item) => item.name === cartItem.name
    );
    if (existedCartItem && cart.length > 0) {
      setCartItemAmount(
        existedCartItem.cartQuantity + cartItem.cartQuantity,
        existedCartItem.id
      );
    } else {
      setCart([...cart, cartItem]);
    }
  };

  const deleteCartItem = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const resetCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalPrice,
        addCartItem,
        setCartItemAmount,
        deleteCartItem,
        resetCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
