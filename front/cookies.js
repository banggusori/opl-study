

function _cookies(){
    return {
        setCookie:function(keys,value){

            var date = new Date();
            date.setTime(date.getTime()+(365*24*60*60*1000));
            var d = typeof value == 'string' ? value : value.toString();
            var str = keys+"="+d+"; expires="+date.toGMTString()+";path=/";
            document.cookie = str;
        },
        getCookiesAll:function(){
            if(document.cookie == ""){
                return "";
            }else{
                return JSON.parse(document.cookie);
            }
        },
        getCookie:function(keys){
            let cookies = document.cookie.match('(^|;) ?' + keys + '=([^;]*)(;|$)');
            cookies = cookies== null && cookies == undefined ? [] : cookies[2];
            return cookies;
            //cookies(keys);
        },
        resetCookie:function(keys){
            document.cookie=keys+'; expires=Thu, 01 Jan 1999 00:00:10 GMT; path=/';
        }
    }
}