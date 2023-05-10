let userList = [];
let validUser = {};
let activeUser = {};
let isActive = false;

const URI = "http://localhost:3000/users"

const UserApi = {
    
    getUsers: () => {
        fetch(URI)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            console.log("DATA: ");
            console.log(data);
            
            userList = data;             
        })
        .catch((error)=>{console.log(error)});
    },

    getUserByUsernamePassword: (username, password) => {
        fetch(URI + "?username=" + username + "&password=" + password )
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            console.log("DATA: ");
            console.log(data);

            validUser = data;
                       
        })
        .catch((error)=>{console.log(error)});
    },
    
    createUser: (id, fn, ln, username, password) => {
        
        // Create the POST request
        fetch(URI, {
            method: "POST",
            body: JSON.stringify({
                id: id,
                first_name: fn,
                last_name : ln,
                username: username,
                password: password,
                banks: [
                    {

                    }
                ]
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            
            alert("User account created!" + `\nUsername: ${data.username}`);
        });
    }
}

// Registration Form 
var regform = document.forms["regform"];
if(regform != undefined){
    console.log(regform);
    regform.onsubmit = (e) => {
        e.preventDefault();
        
        // Collect the form data
        let fn = document.forms["regform"]["fname"].value;
        let ln = document.forms["regform"]["lname"].value;
        let username = document.forms["regform"]["username"].value;
        let password = document.forms["regform"]["password"].value;
        
        let id = userList[userList.length - 1].id + 1;
        UserApi.createUser(id, fn, ln, username, password);
    }
}

// Login Form 
var logForm = document.forms["logForm"];
if(logForm != undefined){
    
    logForm.onsubmit = (e) => {
        e.preventDefault();
        
        let username = document.forms["logForm"]["username"].value;
        let password = document.forms["logForm"]["password"].value;

        UserApi.getUserByUsernamePassword(username, password, validUser);

        // Check for valid login 
        setTimeout(function() {
            if(validUser != undefined){
                isActive = true;
                sessionStorage.setItem("isActive", isActive);
                sessionStorage.setItem("activeUser", JSON.stringify(validUser));
                window.location.assign("../pages/dashboard.html");
                alert("Login Successfully");
            }
            
            
            // Invalid login handling
            else{
                alert("Invalid Login");
                logForm.reset();
            }
        },1000);
    }
}

// If the user is logged in
if(sessionStorage.getItem("isActive") == "true"){

    // Load bank information
    activeUser = JSON.parse(sessionStorage.getItem("activeUser"));

    document.getElementById("bankName") != undefined ? 
        document.getElementById("bankName").innerText = activeUser[0].banks[0].bank : document.getElementById("bankName").innerText = "No banks";
    document.getElementById("checkings") != undefined ? 
        document.getElementById("checkings").innerText = "$" + activeUser[0].banks[0].checkings : null;
    document.getElementById("savings") != undefined ? 
        document.getElementById("savings").innerText = "$" + activeUser[0].banks[0].savings : null;

    // Deposit


    // Withdraw


}




