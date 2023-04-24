import React, {useState, useEffect} from "react";
import {Form,Input,message} from 'antd';
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Layout/Spinner";
// import { showLoading,hideLoading } from '../redux/features/alertSlice';

const Register = () => {
    
    const navigate = useNavigate()
    
    const [Loading,setloading] = useState(false)

    const submitHandler = async (values) => {
        try {
            setloading(true)
            await axios.post('/users/register',values)
            setloading(false)
            message.success('Registered successfully');
            navigate('/login');            
        } catch (error) {
            setloading(false)
            console.log(error);
            message.error('Something went wrong');
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
                    <h1>Register Form</h1>
                    <Form.Item label="Name" name='name'>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name='email'>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Password" name='password'>
                        <Input type="password" />
                    </Form.Item>
                    <div className="d-flex justify-content-betwen">
                        <Link to='/login'>Already Registerd ? Click here to login</Link>
                        <button className="btn btn-primary">Register</button>
                    </div>
                </Form>
          </div>  
 
        </>
    )
}

export default Register;