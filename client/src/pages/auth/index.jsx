import { Button } from '@/components/ui/button'
import Victory from '@/assets/victory.svg'
import React, { useState } from 'react'
import Background from '@/assets/login2.png'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs"
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { apiClient } from "@/lib/api-client.js"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants.js'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () =>
{
    const { setUserInfo } = useAppStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const validateLogin = () =>
        {
            if (!email.length)
            {
                toast.error("Email is required.")
                return false;
            }
            if (!password.length)
            {
                toast.error("Password is required.")
                return false
            }
            return true;
        }

    const validateSignup = () =>
    {
        if (!email.length)
        {
            toast.error("Email is required.")
            return false;
        }
        if (!password.length)
        {
            toast.error("Password is required.")
            return false
        }
        if (!confirmPass.length)
        {
            toast.error("Confirm Password is required.")
            return false
        }
        if (password != confirmPass)
        {
            toast.error("Password and Confirm Password should be match.")
            return false
        }
        return true;
    }

    const handleLogin = async () =>
    {
        if (validateLogin())
            {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    { email, password },
                    { withCredentials: true }
                );
                if(response.data.user.id){
                    setUserInfo(response.data.user)
                    if(response.data.user.profileSetup){
                        console.log(response.data.user.profileSetup)
                        navigate("/chat");
                    }
                    else{
                        navigate("/profile");
                    }
                }
                console.log({ response });
            }
    }

    const handleSignup = async () =>
    {
        if (validateSignup())
        {
            const response = await apiClient.post(
                SIGNUP_ROUTE,
                { email, password },
                { withCredentials: true }
            );
            if(response.status === 201){
                setUserInfo(response.data.user);
                navigate("/profile");
            }
            console.log({ response });
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
                <div className='flex flex-col gap-10 items-center justify-center'>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl text-black'>Welcome</h1>
                            <img src={Victory} alt='Victory Emoji' className='h-[100px]'></img>
                        </div>
                        <p className='font-medium text-center text-black'>Fill in the details to get started with the best chat app!</p>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <Tabs className='w-3/4' defaultValue='login'>
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger
                                    value="login"
                                    className="data-[state=active]:bg-transparent border-b-2  text-black text-opacity-90 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >Login</TabsTrigger>
                                <TabsTrigger
                                    value="signup"
                                    className="data-[state=active]:bg-transparent border-b-2 text-black text-opacity-90 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                                >Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6 border-black/20"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6 border-black/20"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} />
                                <Button className="rounded-full p-6 bg-black text-white data hover:text-black" onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5" value="signup">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className="rounded-full p-6 border-black/20"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className="rounded-full p-6 border-black/20"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)} />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className="rounded-full p-6 border-black/20"
                                    value={confirmPass}
                                    onChange={e => setConfirmPass(e.target.value)} />
                                <Button className="rounded-full p-6 bg-black text-white data hover:text-black" onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className='hidden xl:flex justify-center items-center'>
                    <img src={Background} alt='Background Login' className='h-[700px] object-contain'></img>
                </div>
            </div>
        </div>
    )
}

export default Auth
