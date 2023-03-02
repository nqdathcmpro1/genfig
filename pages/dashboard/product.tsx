import DashboardNav from "@/components/DashboardNav";
import { db, storage } from "@/config/firebase";
import showPrice from "@/utils/showPrice";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState, memo } from "react";
import { MdDelete, MdFileUpload, MdClose, MdEdit, MdProductionQuantityLimits } from "react-icons/md";
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
  imgUrl: string;
  quantity: number;
  category: string;
  categorySlug: string;
  timestamp?: FieldValue;
  searchSlug?: string;
};

type Props = {
  categoriesData: CategoryProps[];
  productsData: ProductProps[];
};

type PreviewProductImg = {
  previewFile?: File | null;
  previewImg?: string;
};

const Product = ({ categoriesData, productsData }: Props) => {
  const [product, setProduct] = useState<ProductProps>({
    id: "",
    name: "",
    price: 0,
    imgUrl: "",
    quantity: 0,
    category: "",
    categorySlug: "",
    timestamp: serverTimestamp(),
    searchSlug: "",
  });

  const [previewImgUpload, setPreviewImgUpload] = useState<PreviewProductImg>({
    previewFile: null,
    previewImg: "",
  });

  const [editId, setEditId] = useState<string>("");

  const [filterCategory, setFilterCategory] = useState<string>(
    categoriesData[0].category
  );

  const router = useRouter();

  const convertBaseURL = (file: File | null | undefined) => {
    const reader = new FileReader();
    file && reader.readAsDataURL(file);

    reader.onload = () => {
      setPreviewImgUpload({
        ...previewImgUpload,
        previewImg: reader?.result as string,
      });
    };
  };

  useEffect(() => {
    convertBaseURL(previewImgUpload?.previewFile);
  }, [previewImgUpload.previewFile]);

  useEffect(() => {});

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name !== "imgUrl") {
      setProduct({ ...product, [e.target.name]: e.target.value });
    } else {
      setPreviewImgUpload({
        ...previewImgUpload,
        previewFile: (e?.target as HTMLInputElement)?.files?.[0],
      });
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (previewImgUpload.previewFile) {
      await uploadBytes(
        ref(storage, `product/${product.name}`),
        previewImgUpload?.previewFile as Blob
      );
    }
    const getImg = await getDownloadURL(
      ref(storage, `product/${product.name}`)
    );
    if (editId) {
      await updateDoc(doc(db, "products", editId), {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        categorySlug: slugify(product.category).toLowerCase(),
        searchSlug: slugify(product.name).toLowerCase().split("-").join(""),
        imgUrl: getImg || product.imgUrl,
      });
    } else {
      await addDoc(collection(db, "products"), {
        ...product,
        price: Number(product.price),
        quantity: Number(product.quantity),
        categorySlug: slugify(product.category).toLowerCase(),
        searchSlug: slugify(product.name).toLowerCase().split("-").join(""),
        imgUrl: getImg,
      });
    }
    router.reload();
  };

  const cancelSetImage = () => {
    setPreviewImgUpload({
      previewFile: null,
      previewImg: "",
    });
  };

  const handleEditProduct = (product: ProductProps) => {
    setEditId(product.id);
    setProduct({ ...product });
    setPreviewImgUpload({
      previewFile: null,
      previewImg: product.imgUrl,
    });
    window.scrollTo(0, 0);
  };
  const handleDeleteProduct = async (productId: string) => {
    const deleteProduct = await deleteDoc(doc(db, "products", productId));

    router.reload();
  };

  return (
    <div className="p-5">
      <form
        className="w-full flex flex-col pb-10"
        onSubmit={handleSubmitProduct}
      >
        <fieldset className="w-full border-4 border-red-500 rounded-lg p-5 flex flex-col gap-3">
          <legend className="font-bold text-red-500">Sản phẩm</legend>
          <div className="flex flex-col">
            <label htmlFor="name" className="font-bold">
              Tên sản phẩm:
            </label>
            <input
              id="name"
              className="w-full h-12 border-4 rounded-lg p-2 focus:outline-none"
              value={product.name}
              name="name"
              type="text"
              placeholder="Tên"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="price" className="font-bold">
              Giá:
            </label>
            <input
              id="price"
              className="w-full h-12 border-4 rounded-lg p-2 focus:outline-none"
              value={product.price}
              name="price"
              type="number"
              placeholder="Giá"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="quantity" className="font-bold">
              Số lượng:
            </label>
            <input
              id="quantity"
              className="w-full h-12 border-4 rounded-lg p-2 focus:outline-none"
              value={product.quantity}
              name="quantity"
              type="number"
              placeholder="Số lượng"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="font-bold">
              Danh mục:
            </label>
            <select
              id="category"
              className="w-full h-12 border-4 rounded-lg p-2 focus:outline-none"
              value={product.category}
              name="category"
              defaultValue={categoriesData[0].category}
              onChange={handleChange}
            >
              {categoriesData.map((category, index) => (
                <option key={category.id} value={category.category}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          {previewImgUpload?.previewImg ? (
            <div className="w-96 rounded-lg overflow-hidden relative">
              <img src={previewImgUpload.previewImg} className="w-full" />
              <div className="absolute top-1 right-1 rounded-full bg-white cursor-pointer">
                <MdClose className="text-xl" onClick={cancelSetImage} />
              </div>
            </div>
          ) : (
            <label
              htmlFor="imgUrl"
              className="rounded-xl border-2 shadow-xl w-fit p-6 flex gap-2 items-center justify-center cursor-pointer"
            >
              <MdFileUpload className="text-3xl font-black" />

              <p className="font-bold">Thêm hình ảnh</p>
            </label>
          )}
          <input
            id="imgUrl"
            className="hidden"
            name="imgUrl"
            type="file"
            placeholder="Hình ảnh"
            onChange={handleChange}
          />

          <button
            className="bg-red-500 w-24 text-white px-5 py-2 rounded-lg font-bold"
            type="submit"
          >
            Gửi
          </button>
        </fieldset>
      </form>
      <div className="md:w-1/2 w-full p-5">
        <label htmlFor="filterCategory font-bold">Lọc theo:</label>
        <select
          id="filterCategory"
          className="w-full h-12 border-2"
          defaultValue={categoriesData[0].category}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {categoriesData.map((category) => (
            <option key={category.id} value={category.category}>
              {category.category}
            </option>
          ))}
        </select>
      </div>

      <div className="xl:block hidden max-h-[600px] overflow-auto rounded-lg">
        <table className="border-2 border-gray-400/10  w-full overflow-scroll relative text-left">
          <thead className="sticky top-0 text-md bg-gray-100 shadow-lg font-extrabold w-full">
            <tr className="tracking-wide ">
              <th className="w-32 p-3 whitespace-nowrap">Mã sản phẩm</th>
              <th className="w-32 p-3 whitespace-nowrap">Tên sản phẩm</th>
              <th className="w-32 p-3 whitespace-nowrap">Giá</th>
              <th className="w-64 p-3 whitespace-nowrap">Ảnh sản phẩm</th>
              <th className="w-32 p-3 whitespace-nowrap">Số lượng</th>
              <th className="w-32 p-3 whitespace-nowrap">Danh mục</th>
              <th className="w-32 p-3 whitespace-nowrap">Tuỳ chọn</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y-2 divide-gray-400/10">
            {productsData
              .filter((product) => product.category === filterCategory)
              .map((item) => (
                <tr key={item.id} className="even:bg-slate-100 bg-white">
                  <td className="w-32 px-3 py-2 text-blue-400 font-bold whitespace-nowrap border-gray-400">
                    {item.id}
                  </td>
                  <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                    {item.name}
                  </td>
                  <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                    {showPrice(item.price)}
                  </td>
                  <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                    <img className="w-full rounded-xl" src={item.imgUrl} />
                  </td>
                  <td
                    className={`w-32 px-3 py-2 whitespace-nowrap border-gray-400 ${
                      item.quantity === 0 && "text-red-500 font-bold"
                    }`}
                  >
                    {item.quantity}
                  </td>
                  <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                    {item.category}
                  </td>
                  <td className="w-32 px-3 py-2 whitespace-nowrap border-gray-400">
                    <div className="w-full h-full flex items-center justify-center gap-3">
                      <MdEdit
                        onClick={() => handleEditProduct(item)}
                        className="text-3xl cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => handleDeleteProduct(item.id)}
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
        {productsData
          .filter((product) => product.category === filterCategory)
          .map((item) => (
            <div className="w-full rounded-lg shadow-xl p-3 flex flex-col gap-5 text-sm relative">
              <img className="w-32 rounded-md" src={item.imgUrl} alt="..." />
              <span className="flex gap-5">
              <p className="text-blue-400 font-bold">#{item.id}</p>
              <p className="font-bold text-red-500">
                {showPrice(item.price)}
              </p>
              
            </span>
            <p className="font-bold">{item.name}</p>
            <span className="flex gap-5 items-center">
              <MdProductionQuantityLimits />
              <div>{item.quantity}</div>
            </span>
            <span className="flex gap-5">
            <MdEdit
                        onClick={() => handleEditProduct(item)}
                        className="text-xl cursor-pointer"
                      />
                      <MdDelete
                        onClick={() => handleDeleteProduct(item.id)}
                        className="text-xl cursor-pointer"
                      />
            </span>
            </div>
          ))}
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
      categorySlug: doc?.data().categorySlug,
      name: doc?.data().name,
      imgUrl: doc?.data().imgUrl,
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
