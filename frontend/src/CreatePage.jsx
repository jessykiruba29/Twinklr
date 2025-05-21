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
  if (!file) return;

  // Validate file type and size
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, GIF)');
    return;
  }

  if (file.size > maxSize) {
    alert('Image size should be less than 5MB');
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    const dataUrl = reader.result;
    
    // Show loading state
    setnewProduct(prev => ({ ...prev, isLoading: true }));

    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/upload`, {
      image: dataUrl
    })
    .then(res => {
      if (res.data.success && res.data.filePath) {
        setnewProduct(prev => ({
          ...prev,
          image: res.data.filePath,
          isLoading: false
        }));
        alert('Image uploaded successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    })
    .catch(err => {
      console.error("Upload failed:", err);
      setnewProduct(prev => ({ ...prev, isLoading: false }));
      alert("Image upload failed. Please try again.");
    });
  };

  reader.onerror = (error) => {
    console.error("Error reading file:", error);
    setnewProduct(prev => ({ ...prev, isLoading: false }));
    alert("Error reading file. Please try another image.");
  };
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
