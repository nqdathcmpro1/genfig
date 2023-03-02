import React, { useEffect, useState } from "react";

import ProductList from "@/components/ProductList";
import { GetServerSidePropsContext } from "next";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product, SortProps } from "@/interface";
import HeadContainer from "@/components/Head";
import { useRouter } from "next/router";

const Collection = () => {
  const router = useRouter();

  const [productData, setProductData] = useState<Product[]>();

  const [sort, setSort] = useState<SortProps>({
    field: "name",
    isAscending: true,
  });

  useEffect(() => {
    const sortProduct = async () => {
   

      const queryProductSnapshot = await getDocs(
        query(
          collection(db, "products"),
          orderBy("searchSlug", sort.isAscending ? "asc" : "desc"),
          orderBy(sort.field, sort.isAscending ? "asc" : "desc"),
          where(
            "searchSlug",
            ">=",
            (router?.query.search as string).toLowerCase().split("-").join("")
          ),
          where(
            "searchSlug",
            "<=",
            (router?.query.search as string).toLowerCase().split("-").join("") +
              "\uf8ff"
          )
        )
      );
      const products: Product[] = [];
      queryProductSnapshot.forEach(async (doc) => {
        await products.push({
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
    sortProduct();
  }, [sort, router]);

  return (
    <>
      <HeadContainer>{`Tìm sản phẩm cho "${router.query?.search}"`}</HeadContainer>
      <ProductList
        sort={sort}
        setSort={setSort}
        category={`Tìm sản phẩm cho "${router.query?.search}"`}
        productData={productData}
      />
    </>
  );
};

export default Collection;
