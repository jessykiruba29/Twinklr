import axios from "axios";
import { useState } from "react";
import { useNavigate,Link ,useLocation} from "react-router-dom";
import './login.css';

const Login=()=>{

    const navigate=useNavigate();
    const location=useLocation();


    const [email,setemail]=useState('');
    const [password,setpass]=useState('');
    const [error,setError] = useState('');
    

  const handleLogin = async () => {
    setError('');
    try {
      const res=await axios.post('http://localhost:5000/', { email, password });
      if (res.data === "Welcome bro") {
        
        const nameRes=await axios.post("http://localhost:5000/getUser", { email });
        const name=nameRes.data.name;

        localStorage.setItem("user", JSON.stringify({ name, email }));
        navigate('/home');
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Login failed");
    }
  };
      



    return(
        <>
        <div className="log">
        <h2>Twinklr</h2>
        <p>spread the sparkle</p>
          

            <input type='text' placeholder="enter email" onChange={(e)=>{setemail(e.target.value)}} ></input>
            <input type='password' placeholder="enter password" onChange={(e)=>{setpass(e.target.value)}}></input>
            <button onClick={handleLogin}>LOGIN</button>
            <Link to={'/signup'}>new here? create your account</Link>
        
        {error && <div className="error-message">{error}</div>}
        
        </div>
        
        </>



    );
}
export default Login;