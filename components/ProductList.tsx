import React, { useEffect, useState } from "react";
import { Breadcrumb } from "flowbite-react";
import { MdExpandMore } from "react-icons/md";
import Link from "next/link";
import { Category, Product, SortProps } from "@/interface";
import { useRouter } from "next/router";
import showPrice from "@/utils/showPrice";

type Props = {
  sort?: SortProps;
  setSort?: React.Dispatch<React.SetStateAction<SortProps>>;
  category?: string;
  productData?: Product[];
};

const ProductList = ({ sort, setSort, category, productData }: Props) => {
  const BreadcrumbComponent = () => {
    return (
      <Breadcrumb className="md:text-xl text-sm flex items-center">
        <Breadcrumb.Item href="/" className="">
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item>{category}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };

  const CollectionFilter = ({ sort, setSort }: Props) => {
    return (
      <div className="lg:w-[900px] md:w-[700px] w-full h-28 grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-3 place-items-center">
        <div className="w-full relative group">
          <div className="w-full h-12 flex items-center justify-between p-2 border-2">
            <p className="text-sm font-bold">Sắp xếp theo</p>
            <MdExpandMore className="text-sm group-hover:rotate-180" />
          </div>
          <ul className="w-full z-10 absolute divide-y-2 hidden group-hover:block shadow-2xl border-2 bg-white">
            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "name" &&
                sort.isAscending === true &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "name",
                  isAscending: true,
                })
              }
            >
              A-Z
            </li>
            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "name" &&
                sort.isAscending === false &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "name",
                  isAscending: false,
                })
              }
            >
              Z-A
            </li>

            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "price" &&
                sort.isAscending === true &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "price",
                  isAscending: true,
                })
              }
            >
              Giá: Tăng dần
            </li>
            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "price" &&
                sort.isAscending === false &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "price",
                  isAscending: false,
                })
              }
            >
              Giá: Giảm dần
            </li>

            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "timestamp" &&
                sort.isAscending === false &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "timestamp",
                  isAscending: false,
                })
              }
            >
              Mới nhất
            </li>
            <li
              className={`w-full h-10 p-2 cursor-pointer ${
                sort?.field === "timestamp" &&
                sort.isAscending === true &&
                "text-orange-400"
              }`}
              onClick={() =>
                setSort?.({
                  field: "timestamp",
                  isAscending: true,
                })
              }
            >
              Cũ nhất
            </li>
          </ul>
        </div>
      </div>
    );
  };
  const CollectionList = ({ productData }: Props) => {
    return (
      <div className="w-full grid place-items-center">
        <div className="w-full grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 ">
          {productData?.map((product) => (
            <div key={product.id} className="w-full aspect-square ">
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.imgUrl}
                  className="w-full object-cover border-2 rounded-xl"
                />
              </Link>
              <div className="w-full flex flex-col justify-center">
                <h1 className="md:text-xl text-sm w-full col-span-2 font-bold truncate">
                  {product.name}
                </h1>
                <p className="w-full font-bold text-red-600">
                  {showPrice(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-fit flex flex-col gap-5">
      <BreadcrumbComponent />
      <h1 className="md:text-3xl text-xl font-bold">{category}</h1>
      <CollectionFilter sort={sort} setSort={setSort} />
      <CollectionList productData={productData} />
    </div>
  );
};

export default ProductList;
