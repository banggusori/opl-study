var request=require('request');
request('API address',function(error, response, body){
if(!error&&response.statusCode==200)
  console.log(body);
});