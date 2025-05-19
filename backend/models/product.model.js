import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:{
    type:String,
    
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  likedBy: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default:0
    
  },
  comments: [
  {
    userId:String,
    text: String,
  }
]
  
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
