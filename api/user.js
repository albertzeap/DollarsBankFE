// Stores the list of users
let userList = [];
// Stores a validated user through login 
let validUser = {};
// Stores the user that is currently active in the application 
let activeUser = {};
// Stores the active user's account
let userAccounts;
// Stores the transactions of the user
let userTransactions;
// Used to track login state
let isActive = false;

const userURI = "http://localhost:3000/users";
const accountURI = "http://localhost:3000/accounts";
const transactionURI = "http://localhost:3000/transactions";

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
            
            // alert("Transaction successful!");
        });
    }
}

const TransactionApi = {
    getTransactionByUserId: (userId) => {
        fetch(transactionURI + "?userId=" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            userTransactions = data;             
        })
        .catch((error)=>{console.log(error)});
    },
    createTransaction: (id, userId, action, account, amount) => {
       // Create the POST request
       fetch(transactionURI, {
        method: "POST",
        body: JSON.stringify({
            id: id,
            userId: userId,
            action : action,
            account: account,
            amount: amount,
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        alert("Transaction successful!");
    });
    }
}

const formHandler = {
    handleRegister: () => {

        // Clear session storage if not on dashboard page
        sessionStorage.clear();

        UserApi.getUsers();

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
    },
    handleLogin:() => {
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
    },
    handleDeposit: () => {

        if(document.getElementById("depositAction").style.display == "none"){
            document.getElementById("depositAction").style.display = "initial";
        } 
        else {
            document.getElementById("depositAction").style.display = "none";
        }

        var depositForm = document.forms["depositForm"];
        depositForm.onsubmit = (e) => {
            e.preventDefault();
            console.log("USER ID: " + activeUser.id)
            let accountType = document.forms["depositForm"]["account"].value;
            let amount = Number(document.forms["depositForm"]["depositAmount"].value);
            let accountId = 0;
    
            userAccounts.forEach((account) => {
                if(account.type == accountType){
                    account.amount += amount;
                    accountId = account.id;
                    AccountApi.updateAccount(account);
                    TransactionApi.createTransaction(
                            userTransactions[userTransactions.length] + 1, 
                            Number(activeUser.id),
                            "Deposit",
                            account.type,
                            amount
                        )
                   
                }
            });



        }
    },
    handleWithdraw: () => {
        if(document.getElementById("withdrawAction").style.display == "none"){
            document.getElementById("withdrawAction").style.display = "initial";
        }
        else {
            document.getElementById("withdrawAction").style.display = "none";
        }
        var withdrawForm = document.forms["withdrawForm"];
        withdrawForm.onsubmit = (e) => {
            e.preventDefault();

            let accountType = document.forms["withdrawForm"]["account"].value;
            let amount = Number(document.forms["withdrawForm"]["withdrawAmount"].value);
            let accountId = 0;

            userAccounts.forEach((account) => {
                if(account.type == accountType){
                    if(amount > account.amount){
                        alert("Invalid amount requested");
                        withdrawForm.reset();
                        return;
                    }
                    account.amount -= amount;
                    accountId = account.id;
                    AccountApi.updateAccount(account);
                    TransactionApi.createTransaction(
                        userTransactions[userTransactions.length] + 1, 
                        Number(activeUser.id),
                        "Withdraw",
                        account.type,
                        amount
                    )
                    console.log("Found a match! Now " + account.amount + " in accountId " + accountId);
                }
            });
    
        }
    },
    handleTransfer: () => {
        if(document.getElementById("transferAction").style.display == "none"){
            document.getElementById("transferAction").style.display = "initial";
        }
        else {
            document.getElementById("transferAction").style.display = "none";
        }
        var transferForm = document.forms["transferForm"];
        transferForm.onsubmit = (e) => {
            e.preventDefault();

            let fromAccount = document.forms["transferForm"]["fromAccount"].value;
            let toAccount = document.forms["transferForm"]["toAccount"].value;
            let amount = Number(document.forms["transferForm"]["transferAmount"].value);
            let accountId = 0;
            console.log("AMOUNT: " + amount);

            // Check if same accounts are selected
            if(fromAccount == toAccount){
                alert("Invalid account transfer. Please select different accounts");
                transferForm.reset();
                return;
            }

            userAccounts.forEach((account) => {
                if(account.type == fromAccount){
                    if(amount > account.amount){
                        alert("Invalid amount requested");
                        transferForm.reset();
                        return;
                    }
                    account.amount -= amount;
                    accountId = account.id;
                    AccountApi.updateAccount(account);
                    TransactionApi.createTransaction(
                        userTransactions[userTransactions.length] + 1, 
                        Number(activeUser.id),
                        "Withdraw",
                        account.type,
                        amount
                    )
                }
                else if(account.type == toAccount){
                    account.amount += amount;
                    accountId = account.id;
                    AccountApi.updateAccount(account);
                    TransactionApi.createTransaction(
                        userTransactions[userTransactions.length] + 2, 
                        Number(activeUser.id),
                        "Deposit",
                        account.type,
                        amount
                    )
                }
            });
        }
    }
}

// If the user is logged in
const dashboardMenu = () => {
    if(sessionStorage.getItem("isActive") == "true"){

        // Call the APIs
        UserApi.getUsersById(sessionStorage.getItem("activeUserId"));
        AccountApi.getAccountByUserId(sessionStorage.getItem("activeUserId"));
        TransactionApi.getTransactionByUserId(sessionStorage.getItem("activeUserId"));
        
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

            for(let i = 0; i < userTransactions.length; i++){
                console.log(userTransactions[userTransactions.length - 1 - i]);
                let transactions = document.getElementById("transactionHistory");

                let tr = document.createElement("tr");

                let tdAmount = document.createElement("td");
                tdAmount.innerText = "$" + userTransactions[userTransactions.length - 1 - i].amount;
                let tdAction = document.createElement("td");
                tdAction.innerText = userTransactions[userTransactions.length - 1 - i].action;
                let tdAccount = document.createElement("td");
                tdAccount.innerText = userTransactions[userTransactions.length - 1 - i].account;

                tr.appendChild(tdAmount);
                tr.appendChild(tdAction);
                tr.appendChild(tdAccount);

                transactions.appendChild(tr);

                if(i == 4) break;
            }

            // Track what the user wants to do
            let transactionForm = document.forms["transaction"]
            transactionForm.onsubmit = (e) =>{
                e.preventDefault();

                // Collect user action
                let userAction = transactionForm["transactionAction"].value;
                console.log(userAction);

                // Deposit
                if(userAction == "deposit"){
                    formHandler.handleDeposit();
                }
                // Withdraw
                else if(userAction == "withdraw"){
                    formHandler.handleWithdraw();
                }
                else {
                    formHandler.handleTransfer();
                }
            }
        }, 1000)
        
    }
}

// Registration Form 
var regform = document.forms["regform"];
if(regform != undefined) formHandler.handleRegister();

// Login
var logForm = document.forms["logForm"];
if(logForm != undefined) formHandler.handleLogin();

dashboardMenu();


