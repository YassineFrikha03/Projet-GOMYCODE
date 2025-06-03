import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import handleError from "../middlewares/errors/handleError.js";

const createProduct = async (req, res) => {
  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ name: req.body.name });

    if (existingProduct) {
      return handleError(
        res,
        null,
        "Product with this name already exists",
        409
      );
    }

    if (req.body.stock < 0) {
      return handleError(res, null, "Stock cannot be negative", 400);
    }

    if (req.body.price < 0) {
      return handleError(res, null, "Price cannot be negative", 400);
    }

    const existingCategory = await Product.findOne({
      category: req.body.category,
    });


    if (!existingCategory) {
      return handleError(res, null, "Category not found", 400);
    }
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    handleError(res, error, "Error in creating product", 500);
  }
};

const getProductById = async (req, res) => {
  try {      

    const productItem = await Product.findById(req.params.id);

    if (!productItem) {
      return handleError(res, null, "Product not found", 404);
    }
    return res.status(200).json(productItem);
  }

   catch (error) {
    handleError(res, error, "Error in fetching product", 500);
  }
};

const getAllProducts = async (req, res) => {

  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json(products);
  }
   catch (error) {
    handleError(res, error, "Error in fetching products", 500);
  }
};

const updateProduct = async (req, res) => {
  try {

    const productId = req.params.id;
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({
      name: req.body.name,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      return handleError(
        res,
        null,
        "Product with this name already exists",
        409
      );
    }

    if (req.body.stock < 0) {
      return handleError(res, null, "Stock cannot be negative", 400);
    }

    if (req.body.price < 0) {
      return handleError(res, null, "Price cannot be negative", 400);
    }

    const existingCategory = await Category.findOne({ 
      _id: req.body.category,
    });

    if (!existingCategory) {
      return handleError(res, null, "Category not found", 400);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return handleError(res, null, "Product not found", 404);
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    handleError(res, error, "Error in updating product", 500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    // TODO check if product is used in any order before deleting
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return handleError(res, null, "Product not found", 404);
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  }
  
  catch (error) {
    handleError(res, error, "Error in deleting product", 500);
  }
};

const getProductsByCategoryId = async (req, res) => {
  try {
    const categoryId = req.query.id;
    const existingCategory = await Category.findById(categoryId);

    if (!categoryId) {
      return res.status(400).json({ message: 'CategoryId missing in query.' });
    }

    if (!existingCategory) {
      return res.status(404).json({ message: 'Catégorie not found.' });
    }

    const products = await Product.find({ category: categoryId }).populate('category', 'name');

    res.status(200).json(products);
  }

  catch (error) {
    res.status(500).json({ message: 'Error retrieving products.', error });
  }
};

const productController = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductsByCategoryId
};
export default productController;
