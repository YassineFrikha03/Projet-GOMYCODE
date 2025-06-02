import Category from "../models/Category.model.js";
import handleError from "../middlewares/errors/handleError.js";

const createCategory = async (req, res) => {
    try {
        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name: req.body.name });
        if (existingCategory) {
            return handleError(res, null, "Category with this name already exists", 409); // 409 Conflict
        }
        const newCategory = new Category(req.body);
        await newCategory.save();
        return res.status(201).json(newCategory); // 201 Created
    }
    catch (error) {
        handleError(res, error, "Error in creating category", 500); // 500 Internal Server Error
    }
}

const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return handleError(res, null, "Category not found", 404);
        }
        return res.status(200).json(category);
    } catch (error) {
        handleError(res, error, "Error in fetching category", 500);
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (categories.length === 0) {
            return res.status(204).send(); // No content
        }
        return res.status(200).json(categories);
    } catch (error) {
        handleError(res, error, "Error in fetching categories", 500);
    }
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // Check if a category with the same name already exists
        const existingCategory = await Category.findOne({ name: req.body.name, _id: { $ne: categoryId } });
        if (existingCategory) {
            return handleError(res, null, "Category with this name already exists", 409); 
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, req.body, { new: true });
        if (!updatedCategory) {
            return handleError(res, null, "Category not found", 404); 
        }
        return res.status(200).json(updatedCategory);
    } catch (error) {
        handleError(res, error, "Error in updating category", 500);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        // TODO check if category is used in any product before deleting
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            return handleError(res, null, "Category not found", 404);
        }
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        handleError(res, error, "Error in deleting category", 500);
    }
}

const categoryController = {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
}


export default categoryController;