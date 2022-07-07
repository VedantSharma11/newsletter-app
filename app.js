const express= require("express");
const bodyParser= require("body-parser");
const request= require("request");
const https= require("https");

const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.emai;

//data object that we need to post to mailchimp server
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };
 
//coverting data object from parse form to collapsed string form
    const jsondata= JSON.stringify(data);

    const url="https://us9.api.mailchimp.com/3.0/lists/{enter your own list/audience id}"; //enter your list/audience id by signing up on mailchimp
                                                                                  // in the url where it is written us9 the number 9 will be replaced by number which is in your generated api
    const options={
        method: "POST",
        auth:"vedant:<enter your api key>"   // enter your api key here after generating it on mailchimp
    }

    const request= https.request(url, options, function(response){

        if(response.statusCode==200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    
    request.write(jsondata);
    request.end();
});

app.post("/failure", function(req,res){
   res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is up & running");
})
