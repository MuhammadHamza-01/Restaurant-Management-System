import mongoose from "mongoose";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, image } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist or is inactive.",
      });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      image,
    });

    const populatedItem = await menuItem.populate("category", "name");

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully.",
      menuItem: populatedItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create menu item.",
    });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch menu items.",
    });
  }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image, isAvailable } =
      req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, category and price are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID.",
      });
    }

    const categoryExists = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Selected category does not exist or is inactive.",
      });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        price,
        image,
        isAvailable,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully.",
      menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update menu item.",
    });
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete menu item.",
    });
  }
};

// Toggle menu item availability
export const updateMenuItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be true or false.",
      });
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    ).populate("category", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item availability updated.",
      menuItem,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update item availability.",
    });
  }
};
