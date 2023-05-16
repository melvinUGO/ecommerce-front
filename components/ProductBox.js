import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import FlyingButton from "./FlyingButton";
import HeartOutlineIcon from "./icons/HeartOutlineIcon";
import HeartSolidIcon from "./icons/HeartSolidIcon";
import axios from "axios";

const ProductWrapper = styled.div`
  button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 150px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  color: inherit;
  text-decoration: none;
  margin: 0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
  }
`;

const WishListButton = styled.button`
  border: 0;
  width: 40px !important;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  cursor: pointer;
  ${(props) => (props.wished ? " color:red;" : "color: black;")}
  svg {
    width: 16px;
  }
`;

const ProductBox = ({
  _id,
  title,
  description,
  images,
  price,
  wished = true,
  onRemoveFromWishlist = () => {},
}) => {
  const url = "/product/" + _id;
  const [isWished, setIsWished] = useState(wished);

  function addToWishList(e) {
    e.preventDefault();
    e.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios
      .post("/api/wishlist", {
        product: _id,
      })
      .then(() => {});
    setIsWished(nextValue);
  }

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          <WishListButton wished={isWished} onClick={addToWishList}>
            {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
          </WishListButton>
          <img src={images?.[0]} alt="" />
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>
          {" "}
          {title?.substring(0, 21)}
          {title.length > 21 && "..."}
        </Title>
        <PriceRow>
          <Price> ₦{price}</Price>
          <FlyingButton src={images?.[0]} _id={_id}>
            Add to bag
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
};

export default ProductBox;
