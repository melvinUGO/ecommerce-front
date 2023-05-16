const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const handlePayment = (email, amount) => {
  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: "pk_test_aa69027aa9cd0d4d8c982dc1928559e94a66e38e",
    email,
    amount: amount * 100,
    onSuccess: (transaction) => {
      // Payment complete! Reference: transaction.reference
      window.location = "/bag?success=true&reference=" + transaction.reference;
    },
    onCancel: () => {
      // user closed popup
    },
  });
};
