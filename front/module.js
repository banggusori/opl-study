function readTextFile(file)
{
    return new Promise(function(resolve,reject){
        
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    resolve(JSON.parse(allText));
                }
            }
        }
        rawFile.send(null);

    })

}