import './create.css';
import { Link, useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const CreatePage = () => {
    const navigate=useNavigate();
    const location=useLocation();
    
    const [newProduct,setnewProduct]=useState({
        name:"",
        description:"",
        image:""

    });
    const handleChange=(e)=>{
        setnewProduct({...newProduct,[e.target.name]:e.target.value}); 

    };

    const handleFileChange = (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("image", file);

  axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload`, formData)
    .then(res => {
      setnewProduct({ ...newProduct, image: res.data.filePath }); 
    })
    .catch(err => console.error("Upload failed:", err));
};

useEffect(() => {
  const storedUser=JSON.parse(localStorage.getItem("user")); //stores object id in local storage
  if (storedUser?.email) {
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/getUser`, { email: storedUser.email })
      .then(res => {
        const fetchedName = res.data.name;
        setnewProduct(prev => ({ ...prev, name: fetchedName }));
      })
      .catch(err => console.error("Error fetching user from DB:", err));
  }
}, []);


    const handleSubmit=async () => {
      console.log("Submitting product:", newProduct);
        try {
          const res=await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/products`, newProduct); //gets post req from backend
          console.log(res.data);
          
          navigate('/home',{state:{description:newProduct.description,image:newProduct.image}});
        } catch (error) {
          console.error('Error creating product:', error.message);
          
        }
      };

      
  return (
    <div className="popup">
      <h2>Create Post</h2>
      
      <input type="text" name="description" placeholder="post description" onChange={handleChange} /><br></br>
      <input type="file" name="image" placeholder="post image" onChange={handleFileChange}/>
      <br></br>
      <div className='b'>
      <button className='btn' onClick={handleSubmit}>Create</button><br></br>
      <Link to={"/home"} className='lin'>close</Link>
    </div>
    </div>
  );
};

export default CreatePage;
