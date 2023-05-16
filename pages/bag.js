import Button from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import Table from "@/components/Table";
import axios from "axios";
import Script from "next/script";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { handlePayment } from "./api/paystackInterface";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.3fr 0.8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2) {
    text-align: right;
  }
  table tr.subtotal td {
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2) {
    font-size: 1.4rem;
  }
  tr.total td {
    font-weight: bold;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  max-width: 70px;
  max-height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    max-width: 100px;
    max-height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const Bag = () => {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState("");

  useEffect(() => {
    if (state?.toLowerCase() !== "lagos") {
      console.log(state.toLowerCase());
      setShippingFee(5000);
    } else {
      axios.get("/api/settings?name=shippingFee").then((res) => {
        setShippingFee(res.data?.value);
      });
    }
  }, [state]);

  useEffect(() => {
    if (session) {
      axios.get("/api/address").then((res) => {
        setName(res.data?.name || "");
        setEmail(res.data?.email || "");
        setAddress(res.data?.address || "");
        setCountry(res.data?.country || "");
        setState(res.data?.state || "");
        setNumber(res.data?.number || "");
      });
    }
  }, [session]);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios
        .post("/api/bag", { ids: cartProducts })
        .then((res) => setProducts(res.data));
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  // on successful payment
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.location.href.includes("success")) {
      clearCart();
      setIsSuccess(true);
    }

    // SHIPPING FEE
    axios.get("/api/settings?name=shippingFee").then((res) => {
      setShippingFee(res.data?.value);
    });
  }, []);

  const moreOfThisProduct = (id) => {
    addProduct(id);
  };

  const lessOfThisProduct = (id) => {
    removeProduct(id);
  };

  // total
  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  const goToPayment = async () => {
    handlePayment(email, productsTotal + parseInt(shippingFee || 0));
    const res = await axios.post("/api/checkout", {
      name,
      email,
      address,
      number,
      state,
      country,
      total: productsTotal + parseInt(shippingFee || 0),
      products: cartProducts.join(","),
    });
  };

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>we will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Script src="https://js.paystack.co/v2/inline.js" />
      <Header />
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <Box>
              <h2>Cart</h2>
              {!cartProducts?.length && <div>Your bag is empty</div>}

              {products?.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map((product, index) => {
                      return (
                        <tr key={index}>
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.images[0]} alt="" />
                            </ProductImageBox>
                            {product?.title}
                          </ProductInfoCell>
                          <td>
                            <Button
                              onClick={() => lessOfThisProduct(product._id)}
                            >
                              -
                            </Button>
                            <QuantityLabel>
                              {" "}
                              {
                                cartProducts.filter((id) => id === product._id)
                                  .length
                              }
                            </QuantityLabel>
                            <Button
                              onClick={() => moreOfThisProduct(product._id)}
                            >
                              +
                            </Button>
                          </td>
                          <td>
                            {"₦" +
                              product.price *
                                cartProducts.filter((id) => id === product._id)
                                  .length}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="subtotal">
                      <td colSpan={2}>Products</td>
                      <td>₦{productsTotal}</td>
                    </tr>
                    <tr className="subtotal">
                      <td colSpan={2}>Shipping</td>
                      <td>₦{shippingFee}</td>
                    </tr>
                    <tr className="subtotal total">
                      <td colSpan={2}>Total</td>
                      <td>₦{productsTotal + parseInt(shippingFee || 0)}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Box>
          </RevealWrapper>
          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <Box>
                <h2>Order Info</h2>

                <Input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Email"
                  value={email}
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <CityHolder>
                  <Input
                    type="text"
                    placeholder="State"
                    value={state}
                    name="state"
                    onChange={(e) => {
                      setState(e.target.value);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="Number"
                    value={number}
                    name="number"
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </CityHolder>
                <Input
                  type="text"
                  placeholder="Street Address"
                  value={address}
                  name="address"
                  onChange={(e) => {
                    setAddress(e.target.value);
                    console.log("pie");
                  }}
                />
                <Input
                  type="text"
                  placeholder="Country"
                  value={country}
                  name="country"
                  onChange={(e) => setCountry(e.target.value)}
                />

                <Button black block onClick={goToPayment}>
                  Continue to Payment
                </Button>
              </Box>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
};

export default Bag;
