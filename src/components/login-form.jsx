"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/app/redux/api/authApi";
import { Loader2 } from "lucide-react"; 
import { useRegisterMutation } from "@/app/redux/api/allApi";

const AuthForm = ({ className, ...props }) => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    surname: "",
    phone: "",
    gender: "",
    age: "",
    role: "seller"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email) newErrors.email = "Email kiritish majburiy!";
    if (!formData.password) newErrors.password = "Parol kiritish majburiy!";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (isLogin) {
        const user = await login({ email: formData.email, password: formData.password }).unwrap();
        if (user.data.role !== "seller") {
          alert("Nice try, diddy! 👀");
          return;
        }
        localStorage.setItem("token", user.token);
        localStorage.setItem("data", JSON.stringify(user.data));
        setTimeout(() => {
          router.push("/");
          window.location.href = "/";
        }, 1000);
      } else {
        console.log(formData);
        
        await register(formData).unwrap();
        alert("Ro‘yxatdan o‘tish muvaffaqiyatli! Iltimos, tizimga kiring.");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Amalda xatolik yuz berdi. Iltimos, ma’lumotlarni tekshiring!");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin ? "Enter your email below to login to your account" : "Fill in the form to create an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {!isLogin && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="firstname">First Name</Label>
                  <Input name="firstname" value={formData.firstname} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input name="surname" value={formData.surname} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="border rounded-md p-2">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="age">Age</Label>
                  <Input name="age" type="number" value={formData.age} onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={isLogin ? isLoginLoading : isRegisterLoading}>
              {(isLogin ? isLoginLoading : isRegisterLoading) ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> {isLogin ? "Kirish..." : "Ro‘yxatdan o‘tish..."}
                </>
              ) : (
                isLogin ? "Login" : "Register"
              )}
            </Button>
          </form>
          <p className="text-center mt-4 text-sm cursor-pointer text-blue-600" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Hali ro‘yxatdan o'tmadingizmi? Register" : "Allaqachon akkauntingiz bormi? Login"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
