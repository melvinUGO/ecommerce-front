const { Schema, models, model, default: mongoose } = require("mongoose");

const SettingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Object,
    },
  },
  { timestamps: true }
);

const Setting = models?.Setting || model("Setting", SettingSchema);

export default Setting;
