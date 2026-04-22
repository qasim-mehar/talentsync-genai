import axios, { Axios } from "axios";
const API_URL = "http://localhost:3000/api/auth";


export async function register(userData) {
    try{
        const res= await axios.post(`${API_URL}/register`,{userData},{
            withCredentials:true
        });
        return res.data;
    }catch(err){
     console.log(err);
    }
}
export async function login(userData) {
    try {
        const res=await Axios.post(`${API_URL}/login`,{userData},{
            withCredentials:true
        })
        return res.data
    } catch (err) {
        console.log(err);
    }
}

export async function logout(){
    try {
        const res=await axios.post(`${API_URL}/logout`,{
            withCredentials:true,
        })
        return res.data;
    } catch (err) {
        console.log(err);
    }
}
export async function getMe() {
    try {
        const res=await axios.get(`${API_URL}/get-me`,{withCredentials:true,})
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

