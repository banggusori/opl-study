

function _cookies(){
    return {
        setCookie:function(keys,value){
            let cookies = this.getCookiesAll();
            cookies[keys] = value;
            document.cookie = JSON.stringify(cookies);
        },
        getCookiesAll:function(){
            if(document.cookie == ""){
                return "";
            }else{
                return JSON.parse(document.cookie);
            }
        },
        getCookie:function(keys){
            let cookies = this.getCookiesAll();
            cookies = cookies[keys];
            return cookies == "" ? []:cookies;
            //cookies(keys);
        },
        resetCookie:function(){
            document.cookie="";
        }
    }
}