import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Product from './models/product.model.js';
import User from './models/user.model.js';
import Art from './models/art.model.js';
import contactRoutes from './routes/contactRoutes.js';
import mongoose from 'mongoose';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';

const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(cors());

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/*import multer from 'multer';
import path from 'path';
import { RiComputerFill } from 'react-icons/ri';

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //for file uploads
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads')); 



app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});
*/




app.post("/upload", async (req, res) => {
  try {
    const fileStr = req.body.image;

    if (!fileStr || typeof fileStr !== "string") {
      return res.status(400).json({ 
        success: false,
        error: "Invalid image data (must be a Base64 string)" 
      });
    }

    // valid url
    if (!fileStr.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: "Invalid image format (must be a valid image data URL)"
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: "twinklr",
      resource_type: "image",
      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" }
      ]
    });

    res.json({ 
      success: true,
      filePath: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ 
      success: false,
      error: err.message || "Failed to upload image",
      details: err.response?.data?.message || "No additional details"
    });
  }
});

//-------------------------------------------------------------------


//for signup
app.post('/signup',async(req,res)=>{
  const {name,email,password}=req.body; //extracts from request body
  try{
    const user=await User.create({name,email,password}); //creates a new user
    res.status(201).json(user);
  }catch(err){
    res.status(400).json(err);
  }
  

});

//-----------------------------------------------------------------------

//for login
app.post("/",async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email}) //finds email
   
    if(!user){//if the user with email exists, then check their password
        return res.json("email incorrect");
    }
    if(user.password===password){
        res.json("Welcome bro");
        }
        else{
          res.json("password incorrect");
        }
    });

//------------------------------------------------------------------------------

//GET to get all the posts
app.get("/products",async(req,res)=>{
  try {
    const products=await Product.find({});
    res.status(200).json({success:true,data:products});

    
  } catch (error) {
    console.log("error :",error.message);
    
  }
});

//-------------------------------------------------------------------------------

app.post('/getUser', async (req, res) => {
  const { email }=req.body;
  try {
    const user=await User.findOne({ email });
    if (user) {
      res.json({ name: user.name });
    } else {
      res.status(404).json({error:"User not found"});
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



///////////////////////////////////////////////////////////////////////////////



// POST (for creating new product)
app.post("/products", async (req, res) => {
  
  const product=req.body;
  if (product.name === "anonymous" && product.email) {
    try {
      const user = await User.findOne({ email: product.email });
      if (user) {
        product.name = user.name;
      } else {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
  if (!product.description || !product.image) { //makes sure that image and description are filled by user
    return res.status(400).json({ success: false, message: "Please provide everything" });
  }
  

  const newProduct = new Product(product);

  try {
    await newProduct.save(); //saves to db
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.log("Error in creating:", error.message);
    res.status(400).json({ success: false, message: "Server error" });
  }
});


////////////////////////////////////////////////////////////////////////////////////

//likes
 app.put("/products/:id", async (req, res) => {
  const { id }=req.params; //get id from url
  const { email }=req.body;  // get email from req body

  try {
    const product=await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.likedBy.includes(email)) {
      // if user already liked
      return res.status(400).json({success:false,message:"User already liked this post" });
    }

    //Add user to likedBy and increment likes
    product.likedBy.push(email);
    product.likes+=1;

    await product.save();

    res.status(200).json({ success:true,message:"Liked successfully",product });
  } catch (err) {
    console.error("Error liking product:", err.response?.data?.message || err.message);
  }
});

///////////////////////////////////////////////////////////////////////////////

const router=express.Router();
app.use('/products',router);


////////////////////////////////////////////////////////////////////////////////

//for comments

router.put('/:id/comments', async (req, res) => {
  const { userId, text }=req.body;

  if (!userId || !text) {
    return res.status(400).json({ message: "User ID and text are required." });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    product.comments.push({ userId, text });
    await product.save();

    //populate used to replace object id into name
    const updatedProduct=await Product.findById(req.params.id)
      .populate('comments.userId', 'name');

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error in route:", err);
    res.status(500).json({ message: "Failed to add comment", error: err.message });
  }
});


////////////////////////////////////////////////////////////////////////////////

app.get("/products", async (req, res) => {
  try {
    const products=await Product.find({})
      .populate('comments.userId', 'name'); 

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


//////////////////////////////////////////////////////////////////////////////////////




// Start server
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
};

startServer();


//////////////////END////////////////////////////////////////////////////////////
