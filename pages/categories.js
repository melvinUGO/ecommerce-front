import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductBox from "@/components/ProductBox";
import Category from "@/models/Category";
import { Product } from "@/models/Product";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { RevealWrapper } from "next-reveal";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 0;
  a {
    color: #555;
    display: inline-block;
  }
  h2 {
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;

const CategoryWrapper = styled.div`
  margin-bottom: 40px;
`;

const ShowAllSquare = styled(Link)`
  background-color: #ddd;
  height: 160px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #555;
  text-decoration: none;
`;

const CategoriesPage = ({
  mainCategories,
  categoriesProducts,
  wishedProducts = [],
}) => {
  return (
    <>
      <Header />
      <Center>
        {mainCategories.map((category) => {
          return (
            <CategoryWrapper>
              <CategoryTitle>
                <h2>{category.name}</h2>
                <div>
                  <Link href={"/category/" + category._id}>Show all</Link>
                </div>
              </CategoryTitle>

              <CategoryGrid>
                {categoriesProducts[category._id].map((product, index) => {
                  return (
                    <RevealWrapper key={index} delay={index * 50}>
                      <ProductBox
                        {...product}
                        wished={wishedProducts.includes(product._id)}
                      />
                    </RevealWrapper>
                  );
                })}
                <RevealWrapper
                  delay={categoriesProducts[category._id].length * 50}
                >
                  <ShowAllSquare href={"/category/" + category._id}>
                    {" "}
                    Show all &rarr;
                  </ShowAllSquare>
                </RevealWrapper>
              </CategoryGrid>
            </CategoryWrapper>
          );
        })}
      </Center>
    </>
  );
};

export default CategoriesPage;

export async function getServerSideProps(context) {
  await mongooseConnect();
  const categories = await Category.find();
  const mainCategories = categories.filter((category) => !category.parent);
  const categoriesProducts = {};
  const allFetchedProductsId = [];

  for (const mainCategory of mainCategories) {
    const mainCategoryId = mainCategory._id.toString();
    const childCatIds = categories
      .filter((category) => category?.parent?.toString() === mainCategoryId)
      .map((category) => category._id.toString());

    const categoriesIds = [mainCategoryId, ...childCatIds];
    const products = await Product.find({ category: categoriesIds }, null, {
      limit: 3,
      sort: { _id: -1 },
    });
    allFetchedProductsId.push(...products.map((p) => p._id.toString()));
    categoriesProducts[mainCategory._id] = products;
  }
  const session = await getServerSession(context.req, context.res, authOptions);

  const wishedProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: allFetchedProductsId,
      })
    : [];

  return {
    props: {
      mainCategories: JSON.parse(JSON.stringify(mainCategories)),
      categoriesProducts: JSON.parse(JSON.stringify(categoriesProducts)),
      wishedProducts: wishedProducts.map((i) => i.product.toString()),
    },
  };
}
