const { Schema, models, model, default: mongoose } = require("mongoose");

const ReviewSchema = new Schema(
  {
    title: String,
    description: String,
    stars: Number,
    product: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

const Review = models?.Review || model("Review", ReviewSchema);

export default Review;
