import axios from "axios";
import store from "./store";

let axiosInterceptor = null;

export function test() {
    console.log("test this is a test")
}

const baseURL = "http://192.168.1.80:8080/test";

export async function getapi(url, token, rtoken) {

    const instance = axios.create({ baseURL: baseURL })

    var stoken = token;
    
    instance.interceptors.request.use(
        request => {

            console.log("using token", stoken)

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

            const status = error.response.status;

            console.log("api response", error.response.status)

            if(status === 401) {

                var origRequest = error.config;
                
                return instance.request({
                    baseURL: baseURL,
                    url: "/refresh.php",
                    method: "POST",
                    data: { "rtoken": rtoken },
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": ["Bearer", token].join(" ")
                    }
                }).then(response => {

                    if(response.status === 200) {

                        
                        stoken = response.data.token;

                        console.log("refresh tokens rcv", response.data.token, response.data.rtoken, response.data.oldrtoken)
                        
                        store.setTokens({ token: response.data.token, rtoken: response.data.rtoken })

                        return instance(origRequest);
                    
                    }

                }).catch(error => {

                    console.log(error)

                })

            }

        } else if(error.request) {

            console.log(error.request)

        } else {

            console.log(error.message)

        }
        
        //throw error;

        return Promise.reject(error)

    })

    const ret = await instance.get(url);

    return ret;

}

export async function getlist(token, rtoken) {

    console.log("get list", (new Date()).toLocaleTimeString())

    var stoken = token;

    const instance = axios.create({ baseURL: "http://192.168.1.80:8080/test/" })

    instance.interceptors.request.use(req => {
        
        console.log("interceptor request...", stoken)

        if(token) {
            req.headers['Authorization'] = ['Bearer', stoken].join(' ');
            req.headers['Content-Type'] = 'application/json';
        }
        
        req.headers['Accept'] = 'application/json';

        return req;
    }, error => {
        return Promise.reject(error)
    })

    instance.interceptors.response.use(res => res, error => {

        console.log("interceptor error");
        
        if(error.response) {
            console.log("error 3");
            //console.log(error.response.data);
            console.log("status", error.response.status);
            //console.log(error.response.headers);

            if(error.response.status === 401) {

                console.log("try refresh...")

                var origRequest = error.config;

                return instance.request({
                    baseURL: "http://192.168.1.80:8080/test",
                    url: "/refresh.php",
                    method: "POST",
                    data: { "rtoken": rtoken },
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": ["Bearer", stoken].join(" ")
                    }
                }).then(response => {

                    console.log("refresh rcv", response)

                    if(response.status === 200) {

                        stoken = response.data.token;

                        console.log("refresh ok get orig request...")
                        console.log("new token", stoken)
                        console.log("orgig req", origRequest)

                        store.setTokens({ token: response.data.token, rtoken: response.data.rtoken })

                        return instance(origRequest);

                    } else {

                        console.log("not refreshed....")

                    }

                }).catch(error => {
                    console.log("refresh err", error)
                })

            }


        } else if(error.request) {
            console.log("error 2", error.request);
        } else {
            console.log("error 1", error.message);
        }

        //console.log(error.config);

        throw error;
    })

    const ret = await instance.get("http://192.168.1.80:8080/test/list.php");

    return ret;

}

export async function login({ id, password, apikey }) {
    
    const instance = axios.create({ baseURL: "http://192.168.1.80:8080/test/" })

    axios.interceptors.request.use(req => {
        
        const token = "";
        //const apikey = "XMAS_12-25-21";

        if(token) {
            req.headers['Authorization'] = ['Bearer', token].join(' ');
            req.headers['Content-Type'] = 'application/json';
        }

        if(apikey) {
            req.headers['x-api-key'] = apikey;
            req.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        }
        
        req.headers['Accept'] = 'application/json';

        return req;
    }, error => {
        return Promise.reject(error)
    })

    /*axios.interceptors.response.use(res => {
        //console.log("res intercept", res)
        return res;
    }, async function(error) {
        
        console.log("intercept error", error);

        return Promise.reject(error, error.config, error.response, error.response.status, error.response.data);
    })*/

    axios.interceptors.response.use(res => res, error => {
        console.log("interceptor error");
        if(error.response) {
            console.log("error 3");
            //console.log(error.response.data);
            console.log("status", error.response.status);
            //console.log(error.response.headers);

        } else if(error.request) {
            console.log("error 2", error.request);
        } else {
            console.log("error 1", error.message);
        }

        //console.log(error.config);

        throw error;
    })

    const ret = await axios.post("http://192.168.1.80:8080/test/login.php", {id: id, pwd: password});

    return ret;
}

export function loginxx() {

    const instance = axios.create({ baseURL: "http://192.168.1.80:8080/test/login.php" });

    if(!!axiosInterceptor || axiosInterceptor === 0) {
        instance.interceptors.request.eject(axiosInterceptor);
    }

    var refreshToken = "";
    var token = "";
    var apikey = "abc12345";

    axiosInterceptor = instance.interceptors.request.use(

        config => {

            if(token) {
                config.headers['Authorization'] = ['Bearer', token].join(' ');
                config.headers['Content-Type'] = 'application/json';
            }

            if(apikey) {
                config.headers['x-api-key'] = apikey;
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
            
            config.headers['Accept'] = 'application/json';

            return config;

        },
        error => {
            Promise.reject(error)
        });
    
    instance.interceptors.response.use((response) => {
        return response
    }, async function(error) {

        const origRequest = error.config;

        /*
        if(isEmpty(error.response)) {
            return Promise.reject(error)
        }
        */

        if((error.response.status === 401 || error.response.status === 403) && (origRequest.url.includes("fresh") || error.response.data.code === 'InvalidCredentials')) {
            return Promise.reject(error)
        }

        if((error.response.status === 401 || error.response.status === 403) && !origRequest._retry) {
            origRequest._retry = true;

            return await instance.request({
                baseURL: "",
                url: "refreshURL",
                method: "POST",
                data: { "refresh-token": refreshToken},
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': ['Bearer', token].join(' ')
                }
            }).then(response => {
                if(response.status === 200) {

                    /*
                    dispatch({
                        
                    })
                    */

                    token = response.data.user.accessToken;

                    return instance(origRequest);

                }
            })

        }
        return Promise.reject(error)
    });

    return instance;

}
