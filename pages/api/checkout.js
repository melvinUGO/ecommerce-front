import { mongooseConnect } from "@/lib/mongoose";
import Order from "@/models/Order";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export default async function handle(req, res) {
  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }

  const { name, email, state, number, address, country, products, total } =
    req.body;
  await mongooseConnect();
  const productsIds = products?.split(",").filter((id) => id !== "");
  const uniqueIds = [...new Set(productsIds)];
  console.log(productsIds);

  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];

  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "USD",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price,
        },
      });
    }
  }

  const session = await getServerSession(req, res, authOptions);

  const orderDoc = await Order.create({
    userEmail: session?.user?.email,
    line_items,
    name,
    email,
    state,
    address,
    country,
    number,
    paid: false,
  });

  res.status(200).json("ok");
}
