import React, { useState, useEffect } from "react";

import ProductList from "@/components/ProductList";
import { GetServerSidePropsContext } from "next";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Category, Product, SortProps } from "@/interface";
import { useRouter } from "next/router";
import HeadContainer from "@/components/Head";

type Props = {
  categoryData: Category;
};

const Collection = ({ categoryData }: Props) => {
  const router = useRouter();

  const [sort, setSort] = useState<SortProps>({
    field: "name",
    isAscending: true,
  });

  const [productData, setProductData] = useState<Product[]>();

  useEffect(() => {
    const sortProducts = async () => {
      
      const queryProductSnapshot = await getDocs(
        query(
          collection(db, "products"),
          where("categorySlug", "==", router?.query.collection),
          orderBy(sort?.field, sort.isAscending ? "asc" : "desc"),
        )
      );
      const products: Product[] = [];
      queryProductSnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
          quantity: doc.data().quantity,
          imgUrl: doc.data().imgUrl,
          category: doc.data().category,
          categorySlug: doc.data().categorySlug
        });
      });
      setProductData([...products]);
    };
    sortProducts();
  }, [sort, router]);

  return (
    <>
      <HeadContainer>{categoryData.category as string}</HeadContainer>
      <ProductList
        sort={sort}
        setSort={setSort}
        category={categoryData.category}
        productData={productData}
      />
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { params } = context;

  const queryCategoriesSnapshot = await getDoc(
    doc(db, "categories", params?.collection as string)
  );

  return {
    props: {
      categoryData: queryCategoriesSnapshot.data(),
    },
  };
};

export default Collection;
