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
    getUsersById: (userId) => {
        fetch(URI + "/" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            console.log("DATA: ");
            console.log(data);
            
            activeUser = data;             
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
    },

    depositAmount: (userId, accountType, checkingsAmount, savingsAmount) => {
        if(accountType == "checkings"){
            fetch(URI + "/" + userId, {
                method: "PUT",
                body: JSON.stringify({
                    banks: [
                        {
                            bank: "Wells Fargo",
                            checkings : checkingsAmount,
                            savings: savingsAmount
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
            });
        }
        else {
            fetch(URI + "/" + userId, {
                method: "PATCH",
                body: JSON.stringify({
                    banks: [
                        {
                            bank: "Wells Fargo",
                            savings : amount
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
            });
        }
    }
}


const depositMenu = () => {
    if(document.getElementById("depositAction").style.display == "none"){
        document.getElementById("depositAction").style.display = "initial";
    } 
    else {
        document.getElementById("depositAction").style.display = "none";
    }
}

const withdrawMenu = () => {
    if(document.getElementById("withdrawAction").style.display == "none"){
        document.getElementById("withdrawAction").style.display = "initial";
    }
    else {
        document.getElementById("withdrawAction").style.display = "none";
    }

}
// If the user is logged in
const dashboardMenu = () => {
    if(sessionStorage.getItem("isActive") == "true"){
    
        // Load bank information
        // activeUser = JSON.parse(sessionStorage.getItem("activeUser"));

        UserApi.getUsersById(sessionStorage.getItem("activeUserId"));
        
        setTimeout(() => {
            console.log(activeUser);
            document.getElementById("bankName") != undefined ? 
            document.getElementById("bankName").innerText = activeUser.banks[0].bank : document.getElementById("bankName").innerText = "No banks";
            document.getElementById("checkings") != undefined ? 
            document.getElementById("checkings").innerText = "$" + activeUser.banks[0].checkings : null;
            document.getElementById("savings") != undefined ? 
            document.getElementById("savings").innerText = "$" + activeUser.banks[0].savings : null;
            
            // Deposit
            document.getElementById("deposit").addEventListener("click", depositMenu);
            
            // Withdraw
            document.getElementById("withdraw").addEventListener("click", withdrawMenu);
        }, 1000)
        
    }
}

// Registration Form 
var regform = document.forms["regform"];
if(regform != undefined){

    // Clear session storage if not on dashboard page
    sessionStorage.clear();


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

    sessionStorage.clear();

    logForm.onsubmit = (e) => {
        e.preventDefault();
        
        let username = document.forms["logForm"]["username"].value;
        let password = document.forms["logForm"]["password"].value;

        UserApi.getUserByUsernamePassword(username, password, validUser);
        console.log(Object.keys(validUser).length);

        // Check for valid login 
        setTimeout(function() {
            if(Object.keys(validUser).length != 0){
                isActive = true;
                sessionStorage.setItem("isActive", isActive);
                // sessionStorage.setItem("activeUser", JSON.stringify(validUser));
                sessionStorage.setItem("activeUserId", validUser[0].id);
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

// Deposit Form 
var depositForm = document.forms["depositForm"];
if(depositForm != undefined){
    
    depositForm.onsubmit = (e) => {
        e.preventDefault();
        let accountType = document.forms["depositForm"]["account"].value;
        let amount = document.forms["depositForm"]["depositAmount"].value;
        let checkingsAmount = document
        console.log(accountType + amount);

        UserApi.depositAmount(activeUser.id,accountType, amount);
        dashboardMenu();

    }

}

// Withdraw Form 
var withdrawForm = document.forms["withdrawForm"];
if(withdrawForm != undefined){
    
    withdrawForm.onsubmit = (e) => {
        e.preventDefault();
        let accountType = document.forms["withdrawForm"]["account"].value;
        let amount = document.forms["withdrawForm"]["withdrawAmount"].value;


    }

}

dashboardMenu();


