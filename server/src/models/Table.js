import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, "Table number is required"],
      unique: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: [true, "Table capacity is required"],
      min: [1, "Table capacity must be at least 1"],
    },

    // Whether the table is enabled for restaurant use.
    isActive: {
      type: Boolean,
      default: true,
    },

    // Whether a current dine-in order is using this table.
    isOccupied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Table = mongoose.model("Table", tableSchema);

export default Table;