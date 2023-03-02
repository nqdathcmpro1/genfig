import React, { useEffect, useState } from "react";

import ProductList from "@/components/ProductList";
import { GetServerSidePropsContext } from "next";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Product, SortProps } from "@/interface";
import HeadContainer from "@/components/Head";

const Collection = () => {
  const [productData, setProductData] = useState<Product[]>();

  const [sort, setSort] = useState<SortProps>({
    field: "name",
    isAscending: true,
  });

  useEffect(() => {
    const sortProduct = async () => {
      const queryProductSnapshot = await getDocs(
        query(collection(db, "products"), orderBy(sort.field, sort.isAscending ? "asc" : "desc"))
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
  }, [sort]);

  return (
    <>
      <HeadContainer>Tất cả sản phẩm</HeadContainer>
      <ProductList
        sort={sort}
        setSort={setSort}
        category="Tất cả sản phẩm"
        productData={productData}
      />
    </>
  );
};


export default Collection;
