const { Schema, models, model, default: mongoose } = require("mongoose");

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    properties: [{ type: Object }],
  },
  { timestamps: true }
);

const Category = models?.Category || model("Category", CategorySchema);

export default Category;
