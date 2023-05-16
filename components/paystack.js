const { handlePayment } = require("@/pages/api/checkout");

export const paystackPayment = (email, amount) => {
  handlePayment(email, amount);
};
