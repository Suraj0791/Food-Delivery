import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const loading =  false;

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
        <div className="text-center">
          <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
          <p className="text-sm text-gray-600">Enter your email address to reset your password</p>
        </div>
        //we are using relative and absolute to show the icon inside the input field . so we are using relative in the parent div and absolute in the child div
        <div className="relative w-full">
            <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-10"
            />
            //this is the icon which is shown inside the input field . we are using absolute to show the icon inside the input field . we are using pointer-events-none so that the icon is not clickable. we are using left-2 and inset-y-2 to show the icon at the left side of the input field. inset is used to show the icon at the top and left side of the input field 
            <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none"/>
        </div>
        {
            loading ? (
                <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait</Button>
            ) : (
                <Button className="bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
            )
        }
        <span className="text-center">
            Back to{" "}
            <Link to="/login" className="text-blue-500">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default ForgotPassword;