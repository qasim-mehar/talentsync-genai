import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function RegisterPage() {
  const navigate= useNavigate()
  const {handleRegister, isLoading}=useAuth();

  const [username, setUsername]=useState("")
  const [email, setEmail]=useState("")
  const [password, setPassword]=useState("")

  const onSubmit =async (e) => {
    e.preventDefault();
    const success = await handleRegister({userName: username, password, email});
      navigate("/login");
    
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your details below to create your account"
      bottomText="Already have an account?"
      bottomLinkText="Sign in"
      bottomLinkTo="/login"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            id="username" 
            placeholder="johndoe" 
            required 
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            id="email" 
            placeholder="name@example.com" 
            type="email" 
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required 
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            id="password" 
            type="password" 
            required 
            className="h-11"
          />
        </div>
        <Button className="w-full h-11" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
