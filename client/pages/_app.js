import "../styles/globals.css";
import React, { useEffect } from "react";
import { wrapper } from "../redux/store";
import { ChakraProvider } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { setCartFromLocalStorage } from "../redux/cart/cartActions";
import Cookie from "js-cookie";
import { setLogged, setUser } from "../redux/user/usersActions";
import {
  getAllBrands,
  getAllCategories,
} from "../redux/products/productsActions";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cartReducer.cart);

  useEffect(() => {
    const cartLocalStorage = localStorage.getItem("cart");
    const token = Cookie.get("token");
    const user = Cookie.get("user");
    if (cartLocalStorage) {
      dispatch(setCartFromLocalStorage(JSON.parse(cartLocalStorage)));
    } else {
      localStorage.setItem("cart", JSON.stringify([]));
    }
    if (token) {
      dispatch(setLogged(true));
      dispatch(setUser(JSON.parse(user)));
    }
    dispatch(getAllBrands());
    dispatch(getAllCategories());
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <ChakraProvider>
      <Head>
        <title>Gamerland</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default wrapper.withRedux(MyApp);
