import DashboardNav from "@/components/DashboardNav";
import { db } from "@/config/firebase";
import { Category } from "@/interface";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import slugify from "slugify";

type Props = {
  categories: Category[];
};

const CategoryLayout = ({ categories }: Props) => {
  const [category, setCategory] = useState<string>("");

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const addedCategory = await setDoc(
        doc(db, "categories", slugify(category).toLowerCase() as string),
        {
          category,
          slug: slugify(category).toLowerCase(),
        }
      );

      router.reload()
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const deleteCategory = await deleteDoc(doc(db, "categories", categoryId));
    const queryProductSnapshot = await getDocs(
      query(collection(db, "products"), where("category", "==", categoryId))
    );
    queryProductSnapshot.forEach(async (product) => {
      await deleteDoc(doc(db, "products", product.id));
    });

    router.reload()
  };

  return (
    <div className="p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full pb-10 flex flex-col items-center justify-center"
      >
        <fieldset className="border-4 w-full border-cyan-300 rounded-lg p-3 flex gap-5 ">
          <legend className="text-cyan-300 font-bold">Danh mục</legend>
          <input
            className="w-10/12 h-12 border-4 rounded-lg p-2 focus:outline-none"
            name="category"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCategory(e.target.value)
            }
            type="text"
            placeholder="Thêm danh mục"
          />
          <button
            className="bg-cyan-300 text-white px-5 py-2 rounded-lg font-bold"
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
              <th className="border-4 border-black">Mã danh mục</th>
              <th className="border-4 border-black">Tên danh mục</th>
              <th className="border-4 border-black">Slug</th>
              <th className="border-4 border-black">Tuỳ chọn</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id}>
                <th className="border-4 border-gray-400">{item.id}</th>
                <th className="border-4 border-gray-400">{item.category}</th>
                <th className="border-4 border-gray-400">{item.slug}</th>
                <th className="border-4 border-gray-400">
                  <div className="w-full h-full flex items-center justify-center gap-3">
                    <MdDelete
                      onClick={() => handleDeleteCategory(item.id)}
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

CategoryLayout.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <>
      <DashboardNav />
      <div className="w-full">{page}</div>
    </>
  );
};

export const getServerSideProps = async () => {
  const queryCategoriesSnapshot = await getDocs(collection(db, "categories"));
  const categories: Category[] = [];
  queryCategoriesSnapshot.forEach((category) => {
    categories.push({
      id: category.id,
      category: category.data().category,
      slug: category.data().slug,
    });
  });

  return {
    props: {
      categories,
    },
  };
};

export default CategoryLayout;
