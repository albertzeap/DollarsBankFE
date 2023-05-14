import AccountApi from "../api/account.js";
import TransactionApi from "../api/transaction.js";
import UserApi from "../api/user.js";

// Stores the list of users
let userList = [];
// Stores a validated user through login 
let validUser = {};
// Stores the user that is currently active in the application 
let activeUser = {};
// Stores the active user's account
let userAccounts;
// Stores all accounts
let allAccounts;
// Stores the transactions of the user
let userTransactions;
// Used to track login state
let isActive = false;


const formHandler = {
    handleRegister: () => {

        // Clear session storage if not on dashboard page
        sessionStorage.clear();

        UserApi.getUsers()
        .then((data) => {
            userList = data;
        })
        .catch((error) => {
            console.log(error)
        });

        AccountApi.getAllAccounts()
        .then((data)=> {
            allAccounts = data;
        })
        .catch((error) => {
            console.log(error);
        });

        
        regform.onsubmit = (e) => {
            e.preventDefault();
            
            // Collect the form data
            let fn = document.forms["regform"]["fname"].value;
            let ln = document.forms["regform"]["lname"].value;
            let username = document.forms["regform"]["username"].value;
            let password = document.forms["regform"]["password"].value;
            
            let id = userList.length + 1;
            let accountId = allAccounts.length + 1
            console.log("USERID:" + id + " : ACCOUNTID: " + accountId);

            
            UserApi.createUser(id, fn, ln, username, password);
          
            AccountApi.createAccount(accountId, id);
        }
    },
    handleLogin:() => {
        sessionStorage.clear();

        logForm.onsubmit = (e) => {
            e.preventDefault();
            
            let username = document.forms["logForm"]["username"].value;
            let password = document.forms["logForm"]["password"].value;

            UserApi.getUserByUsernamePassword(username, password, validUser)
            .then((data)=> {
                validUser = data;
            })
            .catch((error)=> {console.log(error)});

            
            console.log(Object.keys(validUser).length);

            // Check for valid login 
            setTimeout(function() {
                if(Object.keys(validUser).length != 0){
                    isActive = true;
                    sessionStorage.setItem("isActive", isActive);
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

            let fromAccountType = document.forms["transferForm"]["fromAccount"].value;
            let toAccountType = document.forms["transferForm"]["toAccount"].value;
            let amount = Number(document.forms["transferForm"]["transferAmount"].value);
            let invalidRequest = false;
            // console.log("AMOUNT: " + amount);

            // Check if same accounts are selected
            if(fromAccountType == toAccountType){
                alert("Invalid account transfer. Please select different accounts");
                transferForm.reset();
                return;
            }

            // Variables to store the corresponding accounts
            let fromAccount;
            let toAccount;
            userAccounts.forEach((account) => {
                if(account.type == fromAccountType){
                    if(amount > account.amount){
                        alert("Invalid amount requested");
                        transferForm.reset();
                        invalidRequest = true;
                        return;
                    }
                    account.amount -= amount;
                    fromAccount = account;
                } else if (account.type == toAccountType){
                    account.amount += amount;
                    toAccount = account;
                }
            });

            // Call the APIs
            if(!invalidRequest){
                AccountApi.transferAccountAmount(fromAccount,toAccount);
                TransactionApi.createTransaction(
                    userTransactions[userTransactions.length] + 1, 
                    Number(activeUser.id),
                    "Transfer",
                    `${fromAccount.type} -> ${toAccount.type}`,
                    amount
                )
            }
        }
    }
}

// If the user is logged in
const dashboardMenu = () => {
    if(sessionStorage.getItem("isActive") == "true"){

        // Call the APIs
        UserApi.getUsersById(sessionStorage.getItem("activeUserId"))
        .then((data)=> {
            activeUser = data
        })
        .catch((error)=> {
            console.log(error)
        });
        // AccountApi.getAccountByUserId(sessionStorage.getItem("activeUserId"));

        AccountApi.getAccountByUserId(sessionStorage.getItem("activeUserId"))
            .then((data) => {
                userAccounts = data;
            })
            .catch((error) => {
                console.log(error);
            })

        TransactionApi.getTransactionByUserId(sessionStorage.getItem("activeUserId"))
        .then((data)=>{
            userTransactions = data;
        })
        .catch((error)=> {
            console.log(error);
        });
        
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