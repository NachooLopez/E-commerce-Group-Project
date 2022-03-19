import {
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  Button,
  SimpleGrid,
  useToast,
  StackDivider,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer.tsx";
import NavBar from "../../components/Navbar/NavBar";
import ProductsHome from "../../components/ProductsHome";
import SpinnerComponent from "../../components/Spinner/Spinner";
import { getProductById } from "../../redux/products/productsActions";
import { addItemQty, addToCart } from "../../redux/cart/cartActions";
import {
  removeFromFavorites,
  addToFavorites,
} from "../../redux/favorites/favoritesActions";

export default function Home({ id }) {
  const product = useSelector((state) => state.productsReducer.productById);
  const [loading, setLoading] = useState(false);
  const cart = useSelector((state) => state.cartReducer.cart);
  const favorite = useSelector((state) => state.favoritesReducer.favorites);
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getProductById(id));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [product]);

  if (!product._id) {
    return (
      <Container alignContent={"center"} justifyContent="center">
        Product Not found
      </Container>
    );
  }

  const showToastCart = () => {
    return toast({
      title: "Success!",
      position: "top-right",
      description: "Item added to cart!",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  const showToastFav = (action) => {
    return toast({
      title: "Success!",
      position: "top-right",
      description: `Item ${action} to favorites!`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const addCart = () => {
    if (cart.some((el) => el.product?._id === id)) {
      dispatch(addItemQty(id));
      showToastCart();
    } else {
      dispatch(addToCart(product));
      showToastCart();
    }
  };

  const addFavourites = () => {
    if (favorite.some((el) => el.product?._id === id)) {
      dispatch(removeFromFavorites(id));
      showToastFav("removed");
    } else {
      dispatch(addToFavorites(product));
      showToastFav("added");
    }
  };
  const stockValidate = () => {
    if (product.stock) {
      return product.stock;
    } else {
      return false;
    }
  };
  const noStockToast = () => {
    return toast({
      title: "No stock!",
      position: "top-right",
      description: `This product is out of stock!`,
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };
  const noStockBox = () => {
    return <Box>no hay stock quieres resivir un mail?</Box>;
  };

  return (
    <>
      <NavBar />
      <Flex align={"center"} justify="center">
        {loading ? (
          <SpinnerComponent />
        ) : (
          <Container maxW={"7xl"} w="90%">
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              spacing={{ base: 8, md: 10 }}
              py={{ base: 18, md: 24 }}
            >
              <Flex>
                <Image
                  rounded={"md"}
                  bg="white"
                  alt={"product image"}
                  src={`${product.image}`}
                  fit={"contain"}
                  align={"center"}
                  w={"100%"}
                  h={{ base: "100%", sm: "400px", lg: "500px" }}
                  p="auto"
                  border={"1px solid"}
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              </Flex>
              <Stack spacing={{ base: 6, md: 10 }}>
                <Box as={"header"}>
                  <Heading
                    lineHeight={1.1}
                    fontWeight={600}
                    fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                    textTransform="capitalize"
                  >
                    {product.name}
                  </Heading>
                </Box>

                <Stack
                  spacing={{ base: 4, sm: 6 }}
                  direction={"column"}
                  overflowY="scroll"
                  maxH="25vh"
                  css={{
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#44b8fc",
                      borderRadius: "24px",
                    },
                  }}
                >
                  <VStack
                    spacing={{ base: 4, sm: 6 }}
                    divider={
                      <StackDivider
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                      />
                    }
                  >
                    <Text
                      color={useColorModeValue("gray.500", "gray.400")}
                      fontSize={"2xl"}
                      fontWeight={"300"}
                    >
                      {product.description}
                    </Text>
                    <Text></Text>
                  </VStack>
                </Stack>
                <SimpleGrid columns={{ base: 3 }}>
                  <Text
                    color={useColorModeValue("gray.900", "gray.400")}
                    fontWeight={300}
                    fontSize={"3xl"}
                  >
                    $ {product.price}
                  </Text>

                  <Text
                    color={useColorModeValue("gray.900", "gray.400")}
                    fontWeight={700}
                    fontSize={"xl"}
                    alignSelf="center"
                  >
                    {product.stock} In Stock
                  </Text>

                  <Button onClick={addFavourites} href={"#"} display={"flex"}>
                    Add to Favorites
                  </Button>
                </SimpleGrid>

                <Popover>
                  <PopoverTrigger>
                    <Button
                      onClick={stockValidate() ? addCart : null}
                      bg={useColorModeValue("gray.900", "gray.300")}
                      color={useColorModeValue("white", "gray.900")}
                      _hover={{
                        transform: "translateY(1px)",
                        boxShadow: "md",
                      }}
                    >
                      Add to Cart
                    </Button>
                  </PopoverTrigger>
                  {stockValidate() ? (
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>No Stock available!</PopoverHeader>
                      <PopoverBody>
                        <Flex justify="space-evenly" direction="column">
                          Do you want to be notified if it becomes available
                          again?
                          <Box mt={5}>
                            <Button colorScheme="blue">yes</Button>
                            <Button ml={3} colorScheme="orange">
                              no
                            </Button>
                          </Box>
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  ) : (
                    addCart
                  )}
                </Popover>
              </Stack>
            </SimpleGrid>
            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              divider={
                <StackDivider
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                />
              }
            ></Stack>
          </Container>
        )}
      </Flex>
      <ProductsHome />
      <Footer />
    </>
  );
}

Home.getInitialProps = (context) => {
  const { query } = context;
  const { id } = query;
  return { id };
};
