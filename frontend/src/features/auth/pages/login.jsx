import { useState } from "react";
import { Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router"
const Login = () => {
    const { loading, authError, handleLogin } = useAuth()
   const navigate=useNavigate()


    const[email,setemail]=useState("")
    const[password,setpassword]=useState("")
    const handleSubmit = async (e) => {
        e.preventDefault();
        const authenticated = await handleLogin({email,password})
        if (authenticated) {
            navigate('/')
        }
    }
    if(loading)
    {
        return(<main><h1>Loading......</h1></main>)
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                        onChange={(e)=>{
                            setemail(e.target.value)
                        }}
                        type="email" id="email" name="email" placeholder="Enter email address" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                           onChange={(e)=>{
                            setpassword(e.target.value)
                        }}
                        type="password" id="password" name="password" placeholder="Enter password" />
                    </div>

                    <button className="button primary-button">Login</button>
                </form>
                {authError && <p className="auth-error" role="alert">{authError}</p>}

                <p>
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </main>
    );
};

export default Login