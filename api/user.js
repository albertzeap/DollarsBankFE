


const URI = "http://localhost:3000/users";
let userList = [];

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
                console.log(userList[userList.length - 1].id);              
            })
            .catch((error)=>{console.log(error)});
    },

    createUser: (id, fn, ln, username, password) => {

            // Create the POST request
        fetch("http://localhost:3000/users", {
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

let regform = document.forms["regform"];
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
