import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();
  const method = req.method;
  const ids = req.body.ids;

  res.json(await Product.find({ _id: ids }));
}
