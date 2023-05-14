const accountURI = "http://localhost:3000/accounts";

const AccountApi =  {

    getAllAccounts: () => {
        return fetch(accountURI)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            return data;
            // allAccounts = data;             
        })
        .catch((error)=>{console.log(error)});
    },

    createAccount: (id, userId) => {
        // Create the POST request
        fetch(accountURI, {
            method: "POST",
            body: JSON.stringify({
                id: id,
                userId: userId,
                type : "checkings",
                amount: 0,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        }).then(() => {
            fetch(accountURI, {
                method: "POST",
                body: JSON.stringify({
                    id: id + 1,
                    userId: userId,
                    type : "savings",
                    amount: 0,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })

        });
    },
    
    getAccountByUserId: (userId) => {
        return fetch(accountURI + "?userId=" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            return data;       
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
            console.log(data);
            
        });
    },
    transferAccountAmount: (fromAccount, toAccount) => {
        fetch(accountURI + "/" + fromAccount.id, {
            method: "PUT",
            body: JSON.stringify({
                id: fromAccount.id,
                userId: fromAccount.userId,
                type : fromAccount.type,
                amount: fromAccount.amount
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .then(()=> {
            fetch(accountURI + "/" + toAccount.id, {
                method: "PUT",
                body: JSON.stringify({
                    id: toAccount.id,
                    userId: toAccount.userId,
                    type : toAccount.type,
                    amount: toAccount.amount
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            })
        });
    }
}

export default AccountApi;