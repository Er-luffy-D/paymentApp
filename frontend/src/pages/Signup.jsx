import React, { useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router"
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'

function Signup() {
  const navigate = useNavigate();
  const [Body, setBody] = useState({});
  return (
    <div className='bg-slate-300 h-screen flex justify-center'>
      <div className='flex flex-col justify-center'>
        <div className='bg-white rounded-lg w-80 text-center p-2 h-max px-4'>
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox label={"First Name"} placeholder={"John"} onChange={e => setBody({ ...Body, "firstName": (e.target.value) })} />
          <InputBox label={"Last Name"} placeholder={"Doe"} onChange={e => setBody({ ...Body, "lastName": (e.target.value) })} />
          <InputBox label={"Email"} placeholder={"johndoe@gmail.com"} onChange={e => setBody({ ...Body, "username": (e.target.value) })} />
          <InputBox label={"Password"} placeholder={"123456"} onChange={e => setBody({ ...Body, "password": (e.target.value) })} />
          <div className='pt-4'>
            <Button onClick={async () => {
              try {
                const response = await axios.post("http://localhost:3000/api/v1/user/signup", Body)
                localStorage.setItem("token", response.data.jwt)
                navigate("/dashboard")
              }
              catch (err) {
                alert(err)
              }
            }} label={"Sign up"} />
          </div>
          <BottomWarning label={"Already have an account?"} buttonText={"Login"} to={"/signin"} />
        </div>
      </div>
    </div>
  )
}

export default Signup