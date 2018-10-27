let mysql = require("mysql");
let inquirer = require("inquirer");
let chalk = require("chalk");

let con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    database: "bamazon_db",
    password: "!Mishk@25>6qh9a4j"
});

con.connect(function (err) {
    if (err) throw err;
    intro();
})


function intro() {

    inquirer.prompt({
        name: "intro",
        type: "confirm",
        message: chalk.bgCyan("...Ohai, care to do some shopping?"),
        default: true
    }).then(function (ans) {
        if (ans.intro) {
            displayAvailable();
        }
    });

}

function displayAvailable() {
    console.log("\n_____________________________________________________________\n");
    console.log(chalk.cyan("We've got a great selection of products for you today:"));
    console.log("_____________________________________________________________");
    console.log("");
    let query = "SELECT * FROM products";
    con.query(
        query,
        function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
                console.log(chalk.magenta(res[i].product_name) + " from the " + res[i].department_name +
                 " department at a price of " + chalk.green("$") + chalk.green(res[i].price) + " each. " +
                  chalk.blue(res[i].stock_quantity) + " in stock.");
            }
            console.log("");
        });
    buying();

};

function updateDB(minus, ident) {
    con.query("UPDATE products SET ? WHERE ?",
    [
        {
          stock_quantity: minus 
        },
        {
            item_id: ident
        }
    ], function(err, res) {
        console.log(chalk.green("Thank You for choosing Bamazon, your order will arrive someday."))
    });
};


function buying() {
    con.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([{
            name: "choice",
            type: "rawlist",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }
                return choiceArray;
            },
            message: "What would you like to buy today?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to order?"
        }]).then(function (answer) {
            // get the information of the chosen item
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === answer.choice) {
                    chosenItem = results[i];
                };

            };
            if (answer.quantity > chosenItem.stock_quantity) {
                console.log(chalk.red("We apologize but your order exceeds our capacity."));
            } else {
                let subtract = chosenItem.stock_quantity - answer.quantity;
                let itemId = chosenItem.item_id;
                console.log("");
                console.log("Your total is: $" + answer.quantity * chosenItem.price);
                updateDB(subtract, itemId);

            }
            con.end();
        })
    })
};






