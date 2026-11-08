import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";

// Create a category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name must be at least 2 characters.",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create category.",
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch categories.",
    });
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Category name must be at least 2 characters.",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description,
        image,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update category.",
    });
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting categories that still contain menu items
    const itemsCount = await MenuItem.countDocuments({ category: id });

    if (itemsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a category that contains menu items.",
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete category.",
    });
  }
};
