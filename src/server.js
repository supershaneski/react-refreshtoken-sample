import axios from "axios";
import store from "./store";

const server = {
    login: async function( id, password ) {

        const instance = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL })

        instance.interceptors.request.use(req => {
            
            req.headers['x-api-key'] = process.env.REACT_APP_API_KEY;
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            req.headers['Accept'] = 'application/json';
            return req;

        }, error => {
            return Promise.reject(error)
        })

        instance.interceptors.response.use(res => res, error => {
            return Promise.reject(error)
        })
        
        const ret = await instance.post("/login", {id: id, pwd: password});

        return ret;

    },
    getapi: async function( url, token, rtoken ) {

        const instance = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL })

        var stoken = token;
    
        instance.interceptors.request.use(
            request => {
                
                if(stoken) {
                    request.headers['Authorization'] = ['Bearer', stoken].join(' ');
                }
                
                request.headers['Accept'] = 'application/json';
                request.headers['Content-Type'] = 'application/json';
                
                return request;

            },
            error => {
                return Promise.reject(error)
            })
    
        instance.interceptors.response.use(response => response,
        async function (error) {
        
            if(error.response) {
                
                if(error.response.status === 401) {

                    var origRequest = error.config;
                    
                    return instance.request({
                        baseURL: process.env.REACT_APP_API_BASEURL,
                        url: "/refresh",
                        method: "POST",
                        data: { "rtoken": rtoken },
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": ["Bearer", token].join(" ")
                        }
                    }).then(response => {

                        if(response.status === 200) {
                            
                            stoken = response.data.token;
                            
                            store.setTokens({ token: response.data.token, rtoken: response.data.rtoken })

                            return instance(origRequest);
                        
                        }

                    }).catch(err => {

                        return Promise.reject(error)

                    })
                }
            }
            
            return Promise.reject(error)

        })

        const ret = await instance.get(url);

        return ret;

    }
}

export default server;