import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './home.css';
import { Box, Button, HStack } from "@chakra-ui/react";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const Homepage=()=>{
    const [products, setProducts] = useState([]);
  const [userEmail, setUserEmail] = useState('');
    const navigate=useNavigate();
    const [pop, setpop] = useState(false);
    const [selectedImage, SetSelectedImage]=useState('');
    const[comment,setComment]=useState('');
    const [User, setUser]=useState('');
  
    
    const location = useLocation();


    const [userId,setUserId]=useState('');

   useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    console.log("User found in localStorage:", storedUser);
    setUserEmail(storedUser.email);
    setUserId(storedUser._id);
  } else {
    console.log("No user found in localStorage");
  }
}, []);



  useEffect(() => {
     const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserEmail(storedUser.email);
      setUserId(storedUser._id);
    }
    
   
  axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/products`)
    .then(res => {
      //like for each post
      const prodlike=res.data.data.map(product => ({
        ...product,
        likes: product.likes || 0,
      }));
      setProducts(prodlike);
    })
    .catch(err => console.error('Fetch error:', err));
}, []);




const handlelik=async(pid)=>{
  try {
    const res=await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/products/${pid}`,{
      email:userEmail //send email to backend
    });
    const updatedProduct=res.data.product; 

    setProducts(prev =>
      prev.map(product =>
        product._id===pid ?{ ...product,likes:updatedProduct.likes} : product
      )
    );
    
    console.log("liked:",res.data);
  } catch (err) {
    console.error("Error liking product:", err.message);
  }
};

const popup=(product)=>{
  setpop(true);
  SetSelectedImage(product);



}

useEffect(() => {
  const storedUser=JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setUserEmail(storedUser.email);
    setUser(storedUser.name);
    console.log("Fetched from localStorage:", storedUser);
  }
}, []);


const handlecomm=async () => {
  console.log("UserID before comment:", User);
  console.log("Comment text:", comment);
  if (!comment.trim()) {
    alert('Please enter a comment');
    return;
  }

 
  if (!User) {
    alert('Please login to comment');
    return;
  }

  try {
    const res=await axios.put(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/products/${selectedImage._id}/comments`,
      {
        userId: User,  
        text: comment
      }
    );

   
    SetSelectedImage(res.data);
    setProducts(prev => 
      prev.map(product => 
        product._id === selectedImage._id ? res.data : product
      )
    );
    
    setComment('');
  } catch (err) {
    console.error("Error details:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    alert(`Failed to post comment: ${err.response?.data?.message || err.message}`);
  }
};

 const scrollToTop=() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
 const handlelogout=()=>{
  navigate('/');
 };

  

  return (
<>
<div className={pop ? 'blur-background' : ''}>
    <div className='container'>
            <Link to={"/home"} className='small'>Twinklr</Link>
                <Link to={"/create"} className='small'>Create</Link>
        </div>
    <div className="product-container">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <h2 className='inv'>{product.name || "anonymous"}</h2>
          <img src={`http://localhost:5000${product.image}`} className="im" onClick={()=>popup(product)}/>
          
          <p className='desc'>{product.description}</p>
          <div className='l'>
          <Button className='like' onClick={() => {
  
  handlelik(product._id);
}}>♡
  {product.likes}
</Button>

<div className='c'><Button className='like' onClick={()=>popup(product)}>comments</Button></div>
</div>
      </div> 
      ))}
    </div>
    </div>

    {pop && selectedImage && (
      <div className='popup'>
        <div className='flx'>
        <h2>{selectedImage.name}</h2>
        <button className='close' onClick={()=>setpop(false)}>close</button>
        </div>
        <h3>{selectedImage.description}</h3>
        <img className="comm_img" src={`http://localhost:5000${selectedImage.image}`}></img>
        <div className='commsection'>
          
          <ul>
  {selectedImage.comments && selectedImage.comments.map((c, index) => (
    <li key={index}>
      <strong>{c.userId || 'Anonymous'}:</strong> {c.text}
    </li>
  ))}
</ul>
        </div>
        <div className='input-section'>
        <input type="text" placeholder="enter comments" onChange={(e)=>setComment(e.target.value)}></input>
        <Button onClick={handlecomm}>submit</Button>
        </div>
        
        
      </div>
    )}
    <div className='fxd'>
    <div className="sticky-footer">
  <button onClick={scrollToTop} title="Back to top">
    back to top
  </button>
  
</div>
</div>


  <div className='fxd1'>
    <div className="sticky-footer">
  <button onClick={handlelogout} title="Logout">
    logout
  </button>
  
</div>
</div>

</>
    

       
    );
}
export default Homepage;