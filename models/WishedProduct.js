import { Product } from "./Product";

const { Schema, models, model, default: mongoose } = require("mongoose");

const WishedProductsSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    product: { type: Schema.Types.ObjectId, ref: Product },
  },
  { timestamps: true }
);

export const WishedProduct =
  models?.WishedProduct || model("WishedProduct", WishedProductsSchema);
