import DashboardNav from "@/components/DashboardNav";
import { db } from "@/config/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import slugify from "slugify";

type CategoryProps = {
  id: string;
  category: string;
  slug: string;
};

type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  timestamp?: FieldValue;
  searchSlug?: string;
};

type Props = {
  categoriesData: CategoryProps[];
  productsData: ProductProps[];
};

const Product = ({ categoriesData, productsData }: Props) => {
  const [product, setProduct] = useState<ProductProps>({
    id: "",
    name: "",
    price: 0,
    quantity: 0,
    category: "",
    timestamp: serverTimestamp(),
    searchSlug: "",
  });

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, "products"), {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity),
      searchSlug: slugify(product.name).toLowerCase().split("-").join(""),
    });

    router.reload();
  };

  const handleDeleteProduct = async (productId: string) => {
    const deleteProduct = await deleteDoc(doc(db, "products", productId));

    router.reload();
  };

  return (
    <div className="p-5">
      <form className="w-full flex flex-col pb-10" onSubmit={handleAddProduct}>
        <fieldset className="w-full border-4 border-red-500 rounded-lg p-5 flex flex-col gap-3">
          <legend className="font-bold text-red-500">Sản phẩm</legend>
          <input
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="name"
            type="text"
            placeholder="Tên"
            onChange={handleChange}
          />
          <input
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="price"
            type="number"
            placeholder="Giá"
            onChange={handleChange}
          />
          <input
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="quantity"
            type="number"
            placeholder="Số lượng"
            onChange={handleChange}
          />
          <input
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="imgUrl"
            type="text"
            placeholder="Hình ảnh"
            onChange={handleChange}
          />
          <select
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="category"
            defaultValue={"Chọn danh mục"}
            onChange={handleChange}
          >
            <option disabled>Chọn danh mục</option>
            {categoriesData.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.category}
              </option>
            ))}
          </select>
          <button
            className="bg-red-500 w-24 text-white px-5 py-2 rounded-lg font-bold"
            type="submit"
          >
            Gửi
          </button>
        </fieldset>
      </form>

      <div className="overflow-auto relative mx-auto">
        <table className="border-4 border-gray-400 h-[550px] w-[1500px] overflow-scroll relative">
          <thead className="sticky z-10 top-0 border-4 border-black bg-white font-bold">
            <tr className="border-4 border-black">
              <th className="border-4 border-black">Mã sản phẩm</th>
              <th className="border-4 border-black">Tên sản phẩm</th>
              <th className="border-4 border-black">Giá</th>
              <th className="border-4 border-black">Số lượng</th>
              <th className="border-4 border-black">Danh mục</th>
              <th className="border-4 border-black">Tuỳ chọn</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((item) => (
              <tr key={item.id}>
                <th className="border-4 border-gray-400">{item.id}</th>
                <th className="border-4 border-gray-400">{item.name}</th>
                <th className="border-4 border-gray-400">{item.price}</th>
                <th className="border-4 border-gray-400">{item.quantity}</th>
                <th className="border-4 border-gray-400">{item.category}</th>
                <th className="border-4 border-gray-400">
                  <div className="w-full h-full flex items-center justify-center gap-3">
                    <MdDelete
                      onClick={() => handleDeleteProduct(item.id)}
                      className="text-3xl cursor-pointer"
                    />
                  </div>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryCategorySnapshot = await getDocs(collection(db, "categories"));
  const categoriesData: CategoryProps[] = [];
  queryCategorySnapshot.forEach((doc) => {
    categoriesData.push({
      id: doc?.id as string,
      category: doc?.data().category as string,
      slug: doc?.data().slug as string,
    });
  });

  const queryProductSnapshot = await getDocs(collection(db, "products"));
  const productsData: ProductProps[] = [];
  queryProductSnapshot.forEach((doc) => {
    productsData.push({
      id: doc?.id as string,
      category: doc?.data().category,
      name: doc?.data().name,
      price: doc?.data().price,
      quantity: doc?.data().quantity,
    });
  });
  return {
    props: {
      categoriesData,
      productsData,
    },
  };
};

Product.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <DashboardNav />
      <div className="w-full">{page}</div>
    </>
  );
};

export default Product;
