const transactionURI = "http://localhost:3000/transactions";


const TransactionApi = {
    getTransactionByUserId: (userId) => {
       return fetch(transactionURI + "?userId=" + userId)
        .then((result) => {
            // console.log("RESULT");
            // console.log(result);
            
            return result.json();
        })
        .then((data) =>{
            // console.log("DATA: ");
            // console.log(data);
            
            return data;
            // userTransactions = data;             
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

export default TransactionApi;