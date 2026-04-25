
import axios from "axios";

const api=axios.create({
    baseURL : "http://localhost:3000/api/auth",
    withCredentials:true,
})


export async function register(userData) {
    try{
        const res= await api.post("/register", userData);
        return res.data;
    }
    catch(err){
     console.log(err);
     throw err;
    }
}
export async function login(userData) {
    try {
        const res=await api.post("/login", userData)
        return res.data
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function logout(){
    try {
        const res=await api.post("/logout",)
        return res.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function getMe() {
    try {
        const res=await api.get(`/get-me`);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}
