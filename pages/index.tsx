import { Carousel } from "flowbite-react";
import { MdEmojiTransportation } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { BiSupport } from "react-icons/bi";
import { FcNext } from "react-icons/fc";

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { useState } from "react";

import showPrice from "@/utils/showPrice";
import { Category, Product } from "@/interface";

const HomePageCaroussel = () => {
  return (
    <div className="w-full h-fit grid place-items-center ">
      <div className=" w-9/12 aspect-video rounded-none">
        <Carousel slideInterval={5000} className="object-cover rounded-xl border-2">
          <img
            className="object-cover"
            src="https://genshin.global/wp-content/uploads/2022/08/nendoroid-kaeya-xiao-figure-toy-goodsmile-genshin.webp"
            alt="..."
          />
          <img
            className="object-cover"
            src="https://genshin.global/wp-content/uploads/2022/07/kotobukiya-aether-lumine-traveler-figure-genshinimpact-887w.webp"
            alt="..."
          />
        </Carousel>
      </div>
    </div>
  );
};

type DataProps = {
  productData: Product[];
  categoryData: Category[];
};

type ProductReviewProps = {
  productData: Product[];
  category: Category;
};

const HomePageProductPreview = ({
  productData,
  category,
}: ProductReviewProps) => {
  const productsFromCategory = productData?.filter(
    (product) => product.categorySlug === category.slug
  );

  const isEmpty: boolean = productsFromCategory.length === 0;

  return (
    <>
      {!isEmpty && (
        <div className="w-full flex flex-col items-center justify-center gap-5">
          <h1 className="md:text-6xl text-2xl font-bold text-center">
            {category.category.toUpperCase()}
          </h1>
          <div className="lg:w-[900px] md:w-[700px] w-full aspect-auto grid md:grid-cols-3 grid-cols-2 md:grid-rows-2 grid-rows-3 align-middle gap-2">
            {productsFromCategory.map((product, index) =>
              index === 0 ? (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="w-full h-full aspect-square group row-span-2 col-span-2 rounded-xl overflow-hidden relative"
                >
                  <div className="absolute top-5 left-5 animate-blinkLabel font-bold p-2 rounded-lg ">
                    <p>Mới</p>
                  </div>
                  <img
                    src={product.imgUrl}
                    className="w-full h-full object-cover border-2 rounded-xl"
                  />
                  <div className="absolute md:group-hover:flex md:hidden flex bottom-0 w-full h-fit bg-black/50 px-5 py-2  gap-2 flex-col md:items-start items-center">
                    <h1 className="text-white md:text-3xl text-xl font-light truncate">
                      {product?.name}
                    </h1>
                    <p className="text-white md:text-3xl text-lg">
                      {showPrice(product?.price)}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="w-full h-full aspect-square group rounded-xl overflow-hidden relative"
                >
                  <img
                    src={product.imgUrl}
                    className="w-full h-full object-cover border-2 rounded-xl"
                  />
                  <div className="absolute bottom-0 w-full h-fit bg-black/50 md:group-hover:flex md:hidden flex px-3 py-1 flex-col md:items-start items-center gap-1">
                    <h1 className="text-white md:text-sm text-xs font-light truncate">
                      {product.name}
                    </h1>
                    <p className="text-white md:text-xs text-sm">
                      {showPrice(product.price)}
                    </p>
                  </div>
                </Link>
              )
            )}
          </div>
          <Link
            href={`/collection/${category.slug}`}
            className="x items-center justify-between flex rounded-full p-2 border-8 border-sky-600 md:opacity-50 hover:opacity-100 font-extrabold"
          >
            <FcNext className="w-10 md:w-16 h-10 md:h-16" />
          </Link>
        </div>
      )}
    </>
  );
};

const HomePageAbout = () => {
  return (
    <div className="w-full lg:h-60 h-fit lg:divide-x-4 lg:divide-y-0 divide-y-4 flex lg:flex-row flex-col items-center justify-between divide-slate-300 divide-dashed bg-neutral-100 rounded-xl">
      <div className="lg:w-1/3 w-3/4 flex flex-col items-center justify-center gap-2 p-5">
        <MdEmojiTransportation className="md:text-7xl text-3xl" />
        <h1 className="md:text-2xl text-lg font-bold text-center">
          Giao hàng nhanh chóng
        </h1>
      </div>
      <div className="lg:w-1/3 w-3/4 flex flex-col items-center justify-center gap-2 p-5">
        <GrTransaction className="md:text-7xl text-3xl" />
        <h1 className="md:text-2xl text-lg font-bold text-center">
          Giao dịch tiện lợi
        </h1>
      </div>
      <div className="lg:w-1/3 w-3/4 flex flex-col items-center justify-center gap-2 p-5">
        <BiSupport className="md:text-7xl text-3xl" />
        <h1 className="md:text-2xl text-lg font-bold text-center">
          Hỗ trợ 24/7
        </h1>
      </div>
    </div>
  );
};

export default function Home({ productData, categoryData }: DataProps) {
  return (
    <>
      <Head>
        <title>Welcome to GenFig</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full min-h-screen p-5 flex flex-col gap-5 ">
        <HomePageCaroussel />
        <HomePageAbout />
        {categoryData.map((category) => (
          <HomePageProductPreview
            key={category.id}
            productData={productData}
            category={category}
          />
        ))}
      </div>
    </>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const queryProductsSnapshot = await getDocs(
    query(collection(db, "products"), orderBy("timestamp", "desc"))
  );
  let productData: Product[] = [];
  queryProductsSnapshot.forEach((doc) => {
    return productData.push({
      id: doc?.id as string,
      name: doc.data().name,
      imgUrl: doc.data().imgUrl,
      price: doc.data().price,
      category: doc.data().category,
      categorySlug: doc.data().categorySlug,
      quantity: doc.data().quantity,
    });
  });
  const queryCategoriesSnapshot = await getDocs(collection(db, "categories"));
  let categoryData: Category[] = [];
  queryCategoriesSnapshot.forEach((doc) => {
    return categoryData.push({
      id: doc?.id as string,
      category: doc.data().category,
      slug: doc.data().slug,
    });
  });
  return {
    props: {
      productData,
      categoryData,
    },
  };
};
