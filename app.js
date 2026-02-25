const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
 
const app = express();
const PORT = process.env.PORT || 3000;
 
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: true }));
 
// Read products
function getProducts() {
  if (!fs.existsSync("products.json")) {
    fs.writeFileSync("products.json", "[]");
  }
  const data = fs.readFileSync("products.json");
  return JSON.parse(data);
}
 
// Save products
function saveProducts(products) {
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
}
 
// ================= ROUTES =================
 
// View Products
app.get("/", (req, res) => {
  const products = getProducts();
  res.render("index", { products });
});
 
// Show Add Form
app.get("/add", (req, res) => {
  res.render("add");
});
 
// Add Product
app.post("/add", (req, res) => {
  const products = getProducts();
 
  const newProduct = {
    id: uuidv4(),
    name: req.body.name,
    description: req.body.description,
    quantity: req.body.quantity,
    price: req.body.price,
    manufacturer: req.body.manufacturer
  };
 
  products.push(newProduct);
  saveProducts(products);
 
  res.redirect("/");
});
 
// Show Edit Form
app.get("/edit/:id", (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.id);
  res.render("edit", { product });
});
 
// Update Product
app.post("/edit/:id", (req, res) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === req.params.id);
 
  if (index !== -1) {
    products[index] = {
      ...products[index],
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
      manufacturer: req.body.manufacturer
    };
  }
 
  saveProducts(products);
  res.redirect("/");
});
 
// Delete Product
app.get("/delete/:id", (req, res) => {
  let products = getProducts();
  products = products.filter(p => p.id !== req.params.id);
  saveProducts(products);
  res.redirect("/");
});
 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 