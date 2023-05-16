const { Schema, models, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    userEmail: String,
    line_items: Object,
    name: String,
    email: String,
    state: String,
    number: Number,
    address: String,
    country: String,
    paid: Boolean,
  },
  { timestamps: true }
);

const Order = models?.Order || model("Order", OrderSchema);

export default Order;
