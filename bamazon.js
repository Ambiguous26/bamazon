// Did an NPM install mysql and inquierer for my application folders and used the following code to utilize those modules.//


var mysql = require('mysql');
var inquirer = require('inquirer');

// Created MySQL connection//

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Wesley12",
	database: "bamazon_db"
});

// This initializes the connection//
// Within node I can test that the connection works by inputing "node [+ js file name]"
connection.connect(function(err){
	if (err) throw err;
	//If there is a connection the following message will show in node//
	console.log("aliens have abducted me!");
	// If there is a connection the node will produce a table and print it to the screen//
	makeTable();
});

//This is the code that tells what data to include in the table//
var makeTable = function(){
	//Selects from MySQL dummy data//
	connection.query("SELECT * FROM products", function(err,res){
			//How it loops through the data//
			for(var i=0; i<res.length; i++){
				//Prints to node the following: Item ID, Product Name, Department Name, Price, and Quantity//
				console.log(res[i].item_id+" || "+res[i].product_name+" || "+res[i].department_name+" || "+res[i].price+" || "+res[i].stock_quantity+"\n");
			}
	//Customer needs to input a response//
	promptCustomer(res);
	})
}
//The above code shoes that MySQL dummy data is print to the node//
//The below code allows the user to purchase from the data above//

//res = response from our data that the user can input//
var promptCustomer = function(res){
	inquirer.prompt([{
		type: 'input',
		name: 'choice',
		message: "What would you like to buy? [Quit with Q]"
	}]).then(function(answer){
		var correct = false;
		//code that helps user exit if they are done making their purchases//
		if(answer.choice.toUpperCase()=="Q"){
			process.exit();
		}
		// loop through response from query//
		for(var i = 0; i<res.length; i++){
			if (res[i].product_name==answer.choice){
				// if their response is true then we will change correct to true and change the id//
				correct=true;
				var product=answer.choice;
				var id=i;
				//This asks the customer how many items they would like to purchase//
				inquirer.prompt({
					type: "input",
					name: "quant",
					message: "How many would you like to buy?",
					//this checks that it is a number//
					validate: function(value){
						if (isNaN(value)==false){
							return true;
						} else {
							return false;
						}
					}
				//if the above is true (the value input is a real #) the it takes the response from the function above and alters quantity from the table//
				}).then(function(answer){
					if((res[id].stock_quantity-answer.quant)>0){
						connection.query("UPDATE products SET stock_quantity='"+(res[id].stock_quantity-answer.quant)+"' WHERE product_name='"+product+"'",function(err,res2){
							console.log("Purchase Confirmed!");
							//This calls the makeTable fuction already specified above but updates the info as a result of code above//
							makeTable();
						})
					} else {
						//if quantity is < 0 node will respond with the message below//
						console.log("Unable to proceed. Please make a valid selection!");
						promptCustomer(res);	
					}
				})
			}
		}
		//if user enters a product that is not part of our table it will provide them with the following response & then re-run the prompt//
		if(i==res.length && correct==false){
			console.log("Not as valid selection!");
			promptCustomer(res);
	}
	})
}
// module.exports = connection;