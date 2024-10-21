import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:3000/api/v1/user"
axios.defaults.withCredentials = true;

type User = {
    fullname:string;
    email:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
    isVerified:boolean;
}

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input:SignupInputState) => Promise<void>;
    login: (input:LoginInputState) => Promise<void>;
    verifyEmail: (verificationCode: string) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email:string) => Promise<void>; 
    resetPassword: (token:string, newPassword:string) => Promise<void>; 
    updateProfile: (input:any) => Promise<void>; 
}


export const useUserStore = create<UserState>()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
  //isauthenticated is used to check if the user is authenticated or not . if the user is authenticated then the user will be redirected to the login page .
  //isauthrnticated is for authentication of the user. ischecking auth is for authorization of the user . 
 
    //signup api implementation starts
    //we will use the userSignupSchema to validate the input fields then we will send the data to the server nd if the server returns a success message then we will redirect the user to the login page else we will show the error message to the user 
    signup : async (input : SignupInputState)=>{
     try{
     set({loading : true});
     console.log('Loading set to true');
 
     const response = await axios.post(`${API_END_POINT}/signup`, input, {
         headers: {
             // we are sending the data in json format so we need to set the content type to application/json. headers are used to send the data in the correct format to the server . 
             'Content-Type': 'application/json'
         }
          });
              // we will check if the response is successfull or not . the respone cant be a success if the user has entered the wrong data . if the response is successfull then we will redirect the user to the login page else we will show the error message to the user .  after the user has signed up we will redirect the user to the login page. the auth is done in backend so we will not be able to see the user data in the frontend .
              console.log('Signup response:', response);
 
          if (response.data.success) { 
             //toast is used to show the success message to the user . the success message is the message that the user will see when the user has successfully signed up . 
             toast.success(response.data.message);
             //we did isauthenticated to true so that the user is redirected to the login page after the user has signed up . 
             //nothing done with ishceckingauth because we are not checking the auth here . 
             set({ loading: false, user: response.data.user, isAuthenticated: true });
             console.log('Loading set to false, user set');
 
         }
    }catch (error : any) {
     console.error('Signup error:', error);
     //@ts-ignore
 
     toast.error(error.response.data.message);
         set({ loading: false });
     }
 },
 
 //login api implementation starts
 login : async(input: LoginInputState)=>{
     try {
         set({loading:true});
            console.log('Loading set to true');
         
         const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Login response:', response);
         if (response.data.success) {
              toast.success(response.data.message);
             set({ loading: false, user: response.data.user, isAuthenticated: true });
             console.log('Loading set to false, user set');
         }
     } catch (error : any) {
            console.error('Login error:', error);
             toast.error(error.response.data.message);
             set({ loading: false });
       }
 },
 verifyEmail: async (verificationCode: string) => {
     try {
         set({ loading: true });
         const response = await axios.post(`${API_END_POINT}/verify-email`, { verificationCode }, {
             headers: {
                 'Content-Type': 'application/json'
             }
         });
         if (response.data.success) {
             toast.success(response.data.message);
             set({ loading: false, user: response.data.user, isAuthenticated: true });
         }
     } catch (error: any) {
         toast.success(error.response.data.message);
         set({ loading: false });
     }
 },
 
 //we set token expire time after login to 1 hour . wehenver u will visit site  , this fucntiuon willbe called again to see the validity of the token . wehn the token is expired , the user will be redirected to the login page .
 // do our coookies have token or not , if yes no need to login again , if no then we need to login again .
 checkAuthentication: async () => {
     try {
         set({ isCheckingAuth: true });
         const response = await axios.get(`${API_END_POINT}/check-auth`);
         if (response.data.success) {
             set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
         }
     } catch (error : any) {
         set({isAuthenticated: false, isCheckingAuth: false });
     }
 },
 logout: async () => {
     try {
         set({ loading: true });
         const response = await axios.post(`${API_END_POINT}/logout`);
         if (response.data.success) {
             toast.success(response.data.message);
             set({ loading: false, user: null, isAuthenticated: false })
         }
     } catch (error:any) {
         toast.error(error.response.data.message);
         set({ loading: false });
     }
 },
 forgotPassword: async (email: string) => {
     try {
         set({ loading: true });
         const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
         if (response.data.success) {
             toast.success(response.data.message);
             set({ loading: false });
         }
     } catch (error: any) {
         toast.error(error.response.data.message);
         set({ loading: false });
     }
 },
 resetPassword: async (token: string, newPassword: string) => {
     try {
         set({ loading: true });
         const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
         if (response.data.success) {
             toast.success(response.data.message);
             set({ loading: false });
         }
     } catch (error: any) {
         toast.error(error.response.data.message);
         set({ loading: false });
     }
 },
 updateProfile: async (input:any) => {
     try { 
         const response = await axios.put(`${API_END_POINT}/profile/update`, input,{
             headers:{
                 'Content-Type':'application/json'
             }
         });
         if(response.data.success){
             toast.success(response.data.message);
             set({user:response.data.user, isAuthenticated:true});
         }
     } catch (error:any) { 
         toast.error(error.response.data.message);
     }
 }
 }),
  {
     name: 'user-name',
     storage: createJSONStorage(() => localStorage),
 }));
 