const crypto = require("crypto");
var secret = process.env.PAYSTACK_SECRET_KEY;

export default async function handler(req, res) {
  const method = req.method;
  if (method === "POST") {
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const event = req.body;
      // Do something with event
      console.log("webhook working", { event });
    }
    res.send(200);
  }
}
