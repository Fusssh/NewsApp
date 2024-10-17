"use client";
import Link from "next/link"
import { useState } from "react";
import {useRouter} from "next/navigation";

export default function RegisterForm() {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("");

   const router = useRouter();

    const handlesubmit = async (e) => {
        e.preventDefault();
        
        if (!name || !email || !password) {
            seterror("All fields are mandatory");
            return;
        }
    
        try {
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
                });
                const { user } = await resUserExists.json();
                if (user) {
                    seterror("User already exists.");
                return;
                }else{
                    seterror("");
                }



            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name, 
                    email, 
                    password,
                }),
            });
    
            if (res.ok) {
                const form =e.target;
                form.reset();
                router.push("/");
            } else {
                console.log("User registration failed");
            }
        } catch (error) {
            console.log("Error during registration", error);
        }
    };
    
    

    return <div className='grid place-items-center h-screen'>
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
            <h1 className="text-xl font-bold my-4">Register</h1>
            <form onSubmit={handlesubmit} className='flex flex-col gap-3'>
                <input onChange={(e) => setname(e.target.value)}
                    type='text' placeholder='Full Name'></input>
                <input onChange={(e) => setemail(e.target.value)}
                    type='email' placeholder='email'></input>
                <input onChange={(e) => setpassword(e.target.value)}
                    type='password' placeholder='password'></input>
                <button className='bg-green-600 text-white font-bold cursor-pointer  px-6 py-2'>Register</button>
                {error && (
                    <div className='bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2'>
                        {error}
                    </div>)
                }
                <Link className='text-sm mt-3 text-right' href={"/"}>Already have an account ? <span className='underline'>Login</span></Link>
            </form>
        </div>
    </div>
}