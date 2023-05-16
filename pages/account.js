import Button from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import Input from "@/components/Input";
import ProductBox from "@/components/ProductBox";
import Spinner from "@/components/Spinner";
import Tabs from "@/components/Tabs";
import WhiteBox from "@/components/WhiteBox";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { RevealWrapper } from "next-reveal";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SingleOrder from "@/components/SingleOrder";

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;
  p {
    margin: 5;
  }
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const AccountPage = () => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [addressLoaded, setAddressLoaded] = useState(true);
  const [wishListLoaded, setWishListLoaded] = useState(true);
  const [ordersLoaded, setOrdersLoaded] = useState(true);
  const [wishedProducts, setWishedProducts] = useState("");
  const [activeTab, setActiveTab] = useState("Orders");
  const [orders, setOrders] = useState([]);

  console.log(session);

  async function logout() {
    await signOut({
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  async function login() {
    await signIn("google", {
      callbackUrl: process.env.NEXT_PUBLIC_URL,
    });
  }

  function saveAddress() {
    const data = { name, email, address, number, state, country };
    axios.put("/api/address", data);
  }

  useEffect(() => {
    if (!session) {
      return;
    }
    setAddressLoaded(false);
    setWishListLoaded(false);
    setOrdersLoaded(false);
    axios.get("/api/address").then((res) => {
      setName(res.data?.name);
      setEmail(res.data?.email);
      setAddress(res.data?.address);
      setCountry(res.data?.country);
      setState(res.data?.state);
      setNumber(res.data?.number);
      setAddressLoaded(true);
    });

    axios.get("/api/wishlist").then((res) => {
      setWishedProducts(res.data.map((wp) => wp.product));
      setWishListLoaded(true);
    });

    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
      setOrdersLoaded(true);
    });
  }, [session]);

  function productRemovedFromWishList(id) {
    setWishedProducts((products) => {
      return [...products.filter((p) => p._id.toString() !== id)];
    });
  }
  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <RevealWrapper delay={0}>
              <WhiteBox>
                <Tabs
                  tabs={["Orders", "Wishlist"]}
                  active={activeTab}
                  onChange={setActiveTab}
                />
                {activeTab === "Orders" && (
                  <>
                    {!ordersLoaded && <Spinner fullWidth={true} />}
                    {ordersLoaded && orders.length === 0 && (
                      <p>Login to see your orders</p>
                    )}
                    {ordersLoaded && (
                      <div>
                        {orders.length > 0 &&
                          orders.map((o) => {
                            return <SingleOrder {...o} />;
                          })}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "Wishlist" && (
                  <>
                    {!wishListLoaded && <Spinner fullWidth={true} />}
                    {wishListLoaded && (
                      <>
                        <WishedProductsGrid>
                          {" "}
                          {wishedProducts.length > 0 &&
                            wishedProducts.map((wp, index) => (
                              <ProductBox
                                key={index}
                                {...wp}
                                wished={true}
                                onRemoveFromWishlist={
                                  productRemovedFromWishList
                                }
                              />
                            ))}
                        </WishedProductsGrid>
                        {wishedProducts.length === 0 && (
                          <>
                            {session && <p>Your wishlist is empty</p>}
                            {!session && (
                              <p>Login to add products to your wishlist</p>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
          <div>
            <RevealWrapper delay={100}>
              <WhiteBox>
                <h2>{session ? "Acoount details" : "Login"}</h2>
                {!addressLoaded && <Spinner fullWidth={true} />}
                {addressLoaded && session && (
                  <>
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
                        onChange={(e) => setState(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Number"
                        value={number === null ? "" : number}
                        name="number"
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </CityHolder>
                    <Input
                      type="text"
                      placeholder="Street Address"
                      value={address}
                      name="address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Country"
                      value={country}
                      name="country"
                      onChange={(e) => setCountry(e.target.value)}
                    />

                    <Button black block onClick={saveAddress}>
                      Save
                    </Button>
                    <hr />
                  </>
                )}

                {session && (
                  <Button primary onClick={logout}>
                    Logout
                  </Button>
                )}
                {!session && (
                  <Button primary onClick={login}>
                    Login with Google
                  </Button>
                )}
              </WhiteBox>
            </RevealWrapper>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
};

export default AccountPage;
