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
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdCategory, MdDelete, MdEdit } from "react-icons/md";
import slugify from "slugify";

type Props = {
  categories: Category[];
};

const CategoryLayout = ({ categories }: Props) => {
  const [category, setCategory] = useState<string>("");

  const [editCategory, setEditCategory] = useState<Category>({
    id: "",
    category: "",
    slug: "",
  });

  const router = useRouter();

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
      if (editCategory.id && category !== editCategory.category) {
        const queryProductSnapshot = await getDocs(
          query(
            collection(db, "products"),
            where("categorySlug", "==", editCategory.id)
          )
        );
        queryProductSnapshot.size > 0 &&
          queryProductSnapshot.forEach(async (product) => {
            await updateDoc(doc(db, "products", product.id), {
              category,
              categorySlug: slugify(category).toLowerCase(),
            });
          });
        const deleteCategory = await deleteDoc(
          doc(db, "categories", editCategory.id)
        );
        router.reload();
      } else router.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSetEdit = (category: Category) => {
    setEditCategory(category);
    setCategory(category.category);
  };

  const handleCancelEdit = () => {
    setEditCategory({
      id: "",
      category: "",
      slug: "",
    });
    setCategory("");
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const deleteCategory = await deleteDoc(doc(db, "categories", categoryId));
    const queryProductSnapshot = await getDocs(
      query(collection(db, "products"), where("categorySlug", "==", categoryId))
    );
    queryProductSnapshot.forEach(async (product) => {
      await deleteDoc(doc(db, "products", product.id));
    });

    router.reload();
  };

  return (
    <div className="w-full p-5">
      <form
        onSubmit={handleSubmit}
        className="w-full pb-10 flex flex-col items-center justify-center"
      >
        <fieldset className="w-full border-4 border-cyan-300 rounded-lg p-3 flex gap-5 ">
          <legend className="text-cyan-300 font-bold">Danh mục</legend>
          <input
            className="w-full h-12 border-2 rounded-lg p-2 focus:outline-none"
            name="category"
            value={category}
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
            {editCategory.id ? "Sửa" : "Gửi"}
          </button>
          {editCategory.id && (
            <button
              className="bg-red-300 text-white px-5 py-2 rounded-lg font-bold"
              type="button"
              onClick={handleCancelEdit}
            >
              Huỷ
            </button>
          )}
        </fieldset>
      </form>
      <div className="overflow-auto md:block hidden max-h-[600px] relative">
        <table className="border-2 border-gray-400/10  w-full overflow-scroll relative text-left">
          <thead className="sticky top-0 text-md bg-gray-100 shadow-lg font-extrabold w-full">
            <tr className="tracking-wide">
              <th className="w-32 p-3 whitespace-nowrap">Mã danh mục</th>
              <th className="w-32 p-3 whitespace-nowrap">Tên danh mục</th>
              <th className="w-32 p-3 whitespace-nowrap">Slug</th>
              <th className="w-32 p-3 whitespace-nowrap">Tuỳ chọn</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y-2 divide-gray-400/10">
            {categories.map((item) => (
              <tr key={item.id}>
                <td className="w-32 px-3 py-2 text-blue-400 font-bold whitespace-nowrap border-gray-400">
                  {item.id}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {item.category}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  {item.slug}
                </td>
                <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                  <div className="w-full h-full flex items-center justify-center gap-3">
                    <MdEdit
                      onClick={() => handleSetEdit(item)}
                      className="text-3xl cursor-pointer"
                    />
                    <MdDelete
                      onClick={() => handleDeleteCategory(item.id)}
                      className="text-3xl cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="xl:hidden grid gap-5">
        {categories.map((category) => (
          <div
            key={category.category}
            className="w-full rounded-lg shadow-xl p-3 flex flex-col text-sm"
          >
            <p className="text-3xl font-bold">{category.category}</p>
            <span className="flex gap-5 items-center">
              <MdCategory />
              <p>{category.slug}</p>
            </span>
            <span className="flex items-center">
              <MdEdit
                onClick={() => handleSetEdit(category)}
                className="text-xl cursor-pointer"
              />
              <MdDelete
                onClick={() => handleDeleteCategory(category.id)}
                className="text-xl cursor-pointer"
              />
            </span>
          </div>
        ))}
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
