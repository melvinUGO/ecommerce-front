const { Schema, models, model, default: mongoose } = require("mongoose");

const AddressSchema = new Schema({
  userEmail: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  email: String,
  state: String,
  number: Number,
  address: String,
  country: String,
});

const Address = models?.Address || model("Address", AddressSchema);
export default Address;
