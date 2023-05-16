/**
 * Created by B00265222 on 18/11/2015.
 */

/**
 *
 * TODO List:
 *
 *  1- the program will allow a user to add details of any expenses made. -- Implemented(still working atm)
 *   1.1. - date & time of expenditure -- Implemented
 *   1.2. - amount spent -- Implemented
 *   1.3. - who the money went to (E.G. Cousin Sal, Boots, Semichem) -- Implemented
 *   1.4. - the type of transaction (Bank card/cheque/online transaction) -- Implemented
 *   1.5. - a short description of the expense (what it was for, where it was spent) -- Implemented
 *   1.6. - a boolean declaring whether the transaction has been cleared by the bank -- Implemented
 *  2 - possible additional features
 *   2.1. - check sum of both cleared and uncleared transactions to aid in balancing account. -- Not implemented -- displays actual balance
 *  3 - when the user opens the application, the list of transactions already input should be displayed in
 *      a clear format. -- Implemented(still working atm)
 *  4 - The application should provide the following operations through a GUI:
 *   4.1. - Add a new transaction(including all information shown in 1) -- Implemented
 *   4.2. - Remove a cancelled transaction -- Implemented -- a little problematic but it works(no time to bring into perfect order)
 *   4.3. - Edit an existing transaction in case of an error -- not implemented(no time)
 *   4.4. - Mark a Transaction as cleared -- True/False check returns checked regardless atm(no time to fix)
 *
 *  Extra TODO list:
 *      - default time and date on add to the current time and date. -- Time done
 *      - Balance display -- Implemented
 *      - instruction manual button link -- Implemented
 */
var amount, clear, payee, type, desc, date, time;
var balance = 0;

var transaction = function (amnt, clr, pay, typ, dsc, dte, tme) {         // this function defines the items stored in the transactions array
    "use strict";
    this.amount = amnt;
    this.clear = clr;
    this.payee = pay;
    this.type = typ;
    this.description = dsc;
    this.datetime = new Date(dte + " " + tme);
    this.index = transactions.length;

};

var transactions = [];                                                  // this array is to store the transactions created

window.onload = function () {
    "use strict";
    amount = document.getElementById("amountField");
    clear = document.getElementById("clearField");
    payee = document.getElementById("payeeField");
    type = document.getElementById("typeField");
    desc = document.getElementById("descField");
    date = document.getElementById("dateField");
    time = document.getElementById("timeField");

    fillTimeList(time);
    loadTable();
    if(transactions.length > 0){
        createTable();
    }
    var addButton = document.getElementById("addButton"),
        manualButton = document.getElementById("manualButton");
    addButton.onclick = function () {
        add();
    };
    manualButton.onclick = function () {
        open("instructionsPage.html");
    }
};

var addTransaction = function (amnt, clr, pay, typ, dsc, dte, tme) {      // this function is to add the newly entered data into the transactions array.
    "use strict";
    var a = new transaction(amnt.value, clr.value, pay.value, typ.value, dsc.value, dte.value, tme.value);
    transactions.push(a);
};

var add = function () {                 // this function initiates the process of adding a new transaction to the array.
    "use strict";
    addTransaction(amount, clear, payee, type, desc, date, time);
    createTable(-1);
    saveTable();
};

var createTable = function (index) {
    "use strict";
    var tableDiv = document.getElementById("table"),
        table = "<table border='1'><tr><td>Index</td><td>clr</td><td>Date</td><td>Time</td><td>Amount</td><td>Payee</td><td>Transaction type</td><td>Short description</td></tr>";

    for (var i = 0, j = transactions.length; i < j; i++) {
        var trst = transactions[i];
        table += trst.tableRow(index);
    }

    table += "</table>";
    tableDiv.innerHTML = table;
    balanceCalc();

    var balDis = document.getElementById("balanceTable"),
        balTab = "<table border='1'><tr><td>Balance:</td><td>" + balance + "</td></tr>"

    balDis.innerHTML = balTab;

};

transaction.prototype.tableRow = function (index) {
    "use strict";

    var newRow = "<tr><td>" + this.index + "</td><td><input type='checkbox' value=" + this.clear +  "/>" +
        "</td><td>" + this.getDate() + "</td><td>" + this.getTime() + "</td><td>" + this.amount + "</td><td>" + this.payee +
        "</td><td>" + this.type + "</td><td>" + this.description + "</td><td><button onclick=" + "deleteTransaction(" + this.index +")" + ">delete</button></td></tr>";
    return newRow;

};

transaction.prototype.getTime = function () {
    "use strict";
    var time = this.datetime.getHours() + ":" + this.datetime.getMinutes();
    return time;

};

transaction.prototype.getDate = function () {
    "use strict";
    return this.datetime.toDateString();

};

var saveTable = function(){                     // this is to store the local files in the local storage
    "use strict";
    var trst = JSON.stringify(transactions);
    if(trst !== ""){
        localStorage.transactions = trst;
        localStorage.balance = balance;
    }else{
        window.alert("Sorry we were not able to save at this time")
    }

};

var loadTable = function (){
    "use strict";
    var tran = "", i, trs, proto;
    if (localStorage.transactions !== undefined) {
        tran = localStorage.transactions;
        balance = localStorage.balance;
        transactions = JSON.parse(tran);
        proto = new transaction();
        for (i = 0; i < transactions.length; i += 1) {
            trs = transactions[i];
            trs.__proto__ = proto;
            trs.datetime = new Date(trs.datetime);
        }
    }
};

var fillTimeList = function(tf){
    "use strict";
    var hours, minutes;
    for(hours=0; hours<24; hours+=1){
        var hh = hours.toString();
        if(hh.length < 2){
            hh = "0"+hh;
        }
        for(minutes=0; minutes<60; minutes+=30){
            var mm = minutes.toString();
            if(mm.length < 2){
                mm = "0"+mm;
            }
            var time = hh+':'+mm;
            tf.options[tf.options.length] = new Option(time, time);
        }
    }
    selectNearestTime(tf);
};

var selectNearestTime = function(tf){
    "use strict";
    var t = new Date(),
        n = t.getHours() * 2 + Math.floor(t.getMinutes() / 30);
    tf.options[n].selected = true;
};

var balanceCalc = function() {                          //this function simply calculates the value of the users balance
    "use strict";
    balance = Number(balance) + Number(amount.value);
}

var deleteTransaction = function (index) {              //this function has been devised in order to delete a single part of the transaction list.
    "use strict";
    var i = transactions[index].amount;
    balance = balance - Number(i);
    transactions.splice(index, 1);
    saveTable()
    createTable()
}