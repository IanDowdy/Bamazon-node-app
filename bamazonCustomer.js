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


function intro() {
    console.log(chalk.bgCyan("WELCOME! Today we have some great products for you!"))
    con.query(
        "SELECT * FROM products",
        function(err, res) {
            for ( i = 0; i < res.length; i ++) {
                console.log(res[i].product_name + " from the " + res[i].department_name + " department at a price of $" + res[i].price + " each.");
            }
        }
    );
}

intro();
con.end();
