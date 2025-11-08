import mongoose from "mongoose";
const notifyschema = new mongoose.Schema({
    name : {type : String },
    email : {type : String},
    phone : {type : String},
    product : {type : String },
    productId : {type : String},
    selectedOptions : {type : Object},

    totalPrice : {type : Number},
    timestamp : {}
})

const Product = mongoose.models.notify || mongoose.model("notify", notifyschema);

export default Product;