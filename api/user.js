// Stores the list of users
let userList = [];
// Stores a validated user through login 
let validUser = {};
// Stores the user that is currently active in the application 
let activeUser = {};
// Stores the active user's account
let userAccounts;
// Used to track login state
let isActive = false;

const userURI = "http://localhost:3000/users";
const accountURI = "http://localhost:3000/accounts";

const UserApi = {
    
    getUsers: () => {
        fetch(userURI)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            userList = data;             
        })
        .catch((error)=>{console.log(error)});
    },
    getUsersById: (userId) => {
        fetch(userURI + "/" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            activeUser = data;             
        })
        .catch((error)=>{console.log(error)});
    },

    getUserByUsernamePassword: (username, password) => {
        fetch(userURI + "?username=" + username + "&password=" + password )
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);

            validUser = data;
                       
        })
        .catch((error)=>{console.log(error)});
    },
    
    createUser: (id, fn, ln, username, password) => {
        
        // Create the POST request
        fetch(userURI, {
            method: "POST",
            body: JSON.stringify({
                id: id,
                first_name: fn,
                last_name : ln,
                username: username,
                password: password,
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

const AccountApi =  {
    
    getAccountByUserId: (userId) => {
        fetch(accountURI + "?userId=" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            userAccounts = data;       
        })
        .catch((error)=>{console.log(error)});
    },
    updateAccount: (account) => {
        fetch(accountURI + "/" + account.id, {
            method: "PUT",
            body: JSON.stringify({
                id: account.id,
                userId: account.userId,
                type : account.type,
                amount: account.amount
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            
            alert("Transaction successful!");
        });
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

        UserApi.getUsersById(sessionStorage.getItem("activeUserId"));
        AccountApi.getAccountByUserId(sessionStorage.getItem("activeUserId"));
        
        // Allow time for the api to fetch data before displaying data
        setTimeout(() => {

            // Iterate through the list of accounts that the user has
            let i = 1;
            userAccounts.forEach((account) => {
            
                document.getElementById(`accountType${i}`).innerText = account.type;
                document.getElementById(`accountAmount${i}`).innerText = "$" + account.amount;
                console.log(document.getElementById(`accountType${i}`).innerText = account.type);
                i++;
            });
            
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
        let amount = Number(document.forms["depositForm"]["depositAmount"].value);
        let accountId = 0;

        userAccounts.forEach((account) => {
            if(account.type == accountType){
                account.amount += amount;
                accountId = account.id;
                AccountApi.updateAccount(account);
                console.log("Found a match! Now " + account.amount + " in accountId " + accountId);
            }
        });
     
        

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

        let accountId = 0;

        userAccounts.forEach((account) => {
            if(account.type == accountType){
                account.amount -= amount;
                accountId = account.id;
                AccountApi.updateAccount(account);
                console.log("Found a match! Now " + account.amount + " in accountId " + accountId);
            }
        });

    }

}

dashboardMenu();


