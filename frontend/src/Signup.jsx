import { useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const Signup=()=>{
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPass]=useState('');
const navigate=useNavigate();

    const handleSignup = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/signup`,
      { name, email, password }
    );

    if (res.status === 201) {
      localStorage.setItem("user", JSON.stringify({ name, email }));
      navigate('/');
    }
  } catch (error) {
    console.error("Signup error:", error);
    
  }
};
        



    return(
        <>
        <div className="log">
        <h2>Twinklr</h2>
        <p>spread the sparkle</p>
        <div className="side">
            <input type="text"  onChange={(e)=>setName(e.target.value)} placeholder="enter your name"></input>
            <input type="email"  onChange={(e)=>setEmail(e.target.value)} placeholder="enter your email"></input>
            <input type="password"  onChange={(e)=>setPass(e.target.value)} placeholder="enter your password"></input>
            <button onClick={handleSignup}>Submit</button>
            <Link to='/'>login page</Link>

            

        </div>
</div>

</>

    );
}
export default Signup;