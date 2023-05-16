import React, { useContext, useEffect, useRef, useState } from "react";
import { primary } from "@/lib/colors";
import FlyingButtonOriginal from "react-flying-item";
import styled from "styled-components";
import { ButtonStyle } from "./Button";
import { CartContext } from "./CartContext";

const FlyingButtonWrapper = styled.div`
  button {
    ${ButtonStyle};
    ${(props) =>
      props.main
        ? `  background-color: ${primary} ;color: white;border: 1px solid ${primary};`
        : ` background-color: transparent; color: ${primary}; border: 1px solid ${primary};`};
    ${(props) =>
      props.white && ` background-color: white ;border: 1px solid white;`};
  }
  @keyframes fly {
    100% {
      top: 0;
      left: 100%;
      opacity: 0;
      dispaly: none;
      max-width: 50px;
      max-height: 50px;
    }
  }
  img {
    display: none;
    max-width: 100px;
    max-height: 100px;
    opacity: 1;
    position: fixed;
    display: none;
    z-index: 5;
    animation: fly 1s;
    border-radius: 10px;
  }
`;

const FlyingButton = (props) => {
  const { addProduct } = useContext(CartContext);
  const imageRef = useRef();

  const sendImageToCart = (event) => {
    imageRef.current.style.display = "inline-block";
    imageRef.current.style.left = event.clientX - 50 + "px";
    imageRef.current.style.top = event.clientY - 50 + "px";
    setTimeout(() => {
      imageRef.current.style.display = "none";
    }, 1000);
  };

  // sets position back to normal caused by react-reveal package
  useEffect(() => {
    const interval = setInterval(() => {
      const reveal = imageRef?.current?.closest("div[data-sr-id]");
      if (reveal?.style.opacity === "1") {
        // visible
        reveal.style.transform = "none";
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FlyingButtonWrapper
        white={props.white}
        main={props.main}
        onClick={() => addProduct(props._id)}
      >
        <img src={props.src} ref={imageRef} alt="" />
        <button {...props} onClick={(e) => sendImageToCart(e)} />
      </FlyingButtonWrapper>
    </>
  );
};

export default FlyingButton;
