import React, {useState, useEffect} from "react";
// import {Form,Input} from 'antd';
import axios from 'axios';

import {Form,Input,message} from 'antd';
import { Link, useNavigate} from "react-router-dom";
import Spinner from "../components/Layout/Spinner";



const Login = () => {
    
    const navigate = useNavigate()
    
    const [Loading,setloading] = useState(false)

    const submitHandler = async (values) => {
        try {
            setloading(true)
            const {data} = await axios.post('/users/login', values)
            setloading(false)
            message.success("login successfully")
            localStorage.setItem('user', JSON.stringify({...data.user,password:''}))
            navigate('/')
        } catch (error) {
            message.error('something went wrong')
            setloading(false)
        }
    }
    
    useEffect(() => {
        if(localStorage.getItem('user')){
            navigate('/');
        }
    },[navigate]);

    return(
        <>
            <div className="register-page">
                {Loading && <Spinner />}
                <Form layout="vertical" onFinish={submitHandler}>
                    {/* <img src="C:/Users/Asus/Desktop/Sem-8-Internship/Expanse-manager/client/public/moneydoc.jpeg"/> */}
                    <h1>Login Form</h1>
                    <Form.Item label="Email" name='email'>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Password" name='password'>
                        <Input type="password" />
                    </Form.Item>
                    <div className="d-flex justify-content-betwen">
                        <Link to='/register'>Not a user ? Click here to register</Link>
                        <button className="btn btn-primary">Login</button>
                    </div>
                </Form>
          </div>
        </>
    )
}

export default Login