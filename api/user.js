let userList = [];
const URI = "http://localhost:3000/users"

const UserApi = {
    
    getUsers: () => {
        fetch(URI)
        .then((result) => {
            console.log("RESULT");
            console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            console.log("DATA: ");
            console.log(data);
            
            userList = data;             
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
                password: password
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
UserApi.getUsers();

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
let activeUser = {};
if(logForm != undefined){
    
    logForm.onsubmit = (e) => {
        e.preventDefault();
        
        let username = document.forms["logForm"]["username"].value;
        let password = document.forms["logForm"]["password"].value;
        
        userList.forEach(user => {
            if(user.username == username && user.password == password){
                activeUser = user;
                console.log(activeUser.id + " " + activeUser.first_name)
            }
            
        })
    }
}



