import axios from 'axios'
// import Cookies from 'js-cookie'

const http = axios.create({
    baseURL: 'http://localhost:3000'
})


// http.interceptors.request.use(config=>{
//     const token = Cookies.get('token')
//     // console.log(document.cookie)
//     // console.log(token)
    
//     if(token){
//         config.headers.Authorization = 'Bearer'+' '+token
//     }
//     return config
// })

export default http