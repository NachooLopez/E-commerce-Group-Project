const { default: axios } = require("axios");
const { Router } = require("express");
const app = Router();
// model
const Product = require("./Product");

// todos los productos
app.get("/products", async (req, res) => {
  try {
    let { orderBy, sortBy, name, brands, categories } = req.query;

    //transformar querys a miniscula
    orderBy = orderBy?.toLowerCase();
    sortBy = sortBy?.toLocaleLowerCase();

    //crear array con regexp para filtrar categorias
    categories = categories ? JSON.parse(categories) : null;
    brands = brands ? JSON.parse(brands) : null;

    const regex = (query) => {
      if (Array.isArray(query)) {
        query = query ? query.map((q) => new RegExp(q, "i")) : null;
        return query;
      } else {
        query = query ? new RegExp(query, "i") : null;
        return query;
      }
    };

    categories = regex(categories);
    brands = regex(brands);
    name = regex(name);

    const products = await Product.find()
      .where(name ? { name: name } : null)
      .where(brands ? { brand: { $in: brands } } : null)
      .where(categories ? { category: { $in: categories } } : null)
      .sort({ [orderBy]: sortBy });
    return res.json(products);
  } catch (err) {
    console.log(err);
  }
});

// trae un producto
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id);
    res.json(products);
  } catch (err) {
    console.log(err);
  }
});

// crea un producto
app.post("/products/create", async (req, res) => {
  try {
    const { name, price, brand, image, stock, description, type } = req.body;
    const product = new Product({
      name,
      price,
      brand,
      image,
      stock,
      description,
      type,
    });
    await product.save();
    res.json(product);
  } catch (err) {
    cd;
    console.log(err);
  }
});

// actualiza un producto
app.put("/products/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, brand, image, description, type } = req.body;

  try {
    if (id) {
      await Product.findByIdAndUpdate(
        { _id: id },
        { name, price, brand, image, description, type }
      );
      return res.json({
        message: `product ${id} updated successfully`,
      });
    } else {
      return res.json({ message: "id not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

// elimina un producto
app.delete("/products/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.json({ message: `product ${id} deleted` });
  } catch (err) {
    console.log(err);
  }
});

//! crear productos falsos de prueba
// app.post("/products/create-api", async (req, res) => {
//   const { data } = await axios.get("https://dummyjson.com/products");
//   const refactApi = data.products.map((product) => {
//     return {
//       name: product.title || "...",
//       price: product.price || 000,
//       brand: product.brand || "...",
//       image: product.images[0] || "image.jpg",
//       stock: product.stock || 000,
//       description: product.description || "...",
//       category: product.category,
//     };
//   });

//   await Product.collection.insertMany(refactApi);
//   res.json("productos creados...");
// });

module.exports = app;
