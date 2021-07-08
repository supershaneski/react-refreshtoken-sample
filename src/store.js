const store = (function(){

    function _setTokens({ token, rtoken }) {
        
        localStorage.setItem("token", token)
        localStorage.setItem("rtoken", rtoken)

    }

    function _getTokens() {

        let token = localStorage.getItem("token")
        let rtoken = localStorage.getItem("rtoken")
        
        token = token === null ? "" : token;
        rtoken = rtoken === null ? "" : rtoken;

        return {
            token,
            rtoken
        }

    }

    function _clearTokens() {

        localStorage.removeItem("token")
        localStorage.removeItem("rtoken")

    }

    return {
        setTokens: _setTokens,
        getTokens: _getTokens,
        clearTokens: _clearTokens,
    }

})();

export default store;