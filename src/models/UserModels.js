import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  image : {
    type : String,
    

  },
  username: {
    type: String, // ✅ Capital S

},
  email: {
    type: String, // ✅ Capital S
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String, // ✅ Capital S
  },
  id :{
      type : String,
  },
  role : {
        type : String,
        default : 'user',
    },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String, // ✅ Capital S
  forgetPasswordTokenExpire: Date,
  verifyToken: String,         // ✅ Capital S
});

const User = mongoose.models.UserAuth || mongoose.model("UserAuth", userSchema);
export default User;
