var express = require("express");
var sqlite3 = require("sqlite3");
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
TransactionDatabase = require("sqlite3-transactions").TransactionDatabase;
var app = express();
var db = new TransactionDatabase(new sqlite3.Database('Jeopardy.db'));

app.use( bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());


app.get("/", function(req,res) {
    db.get("select * from users",function(e,u){
        //   return res.json(u);
    });
    return res.send("Hello World");
});


app.post('/auth/signin', function(req, res) {
    var userID = req.body.userID;
    var password = req.body.password;
    console.log(req.body);
    if(userID == null || password == null) {
        return res.status(401).json({message: "invalid_credentials"});
    }
    //var token = jwt.sign({username:"ado"}, 'supersecret',{expiresIn: 120});
    var dbQuery = "select * from Users where UserID = ? and UserPassword = ?";
    var requestParams = [userID, password];

    db.get(dbQuery, requestParams, function(err, user) {
        if(err) {
            return res.status(500).json({message: "Internal server error"});
        }

        if(user == null) {
            return res.status(401).json({message: "invalid_credentials"});
        }

        var token = jwt.sign({username:userID}, password,{expiresIn: 3600});
        var dbQuery = "update Users set AuthToken = '" + token + "' ,AuthTokenIssued = '" + Date.now().toString()  +"' where userID = '" + userID +"'";

        db.run(dbQuery);
        return res.status(200).json({message: "success",
            authToken: token
        });
    });
});

app.get('/questions', function(req, res) {
    var categoryTitle = req.query.categoryTitle;
    var dollarValue = req.query.dollarValue;
    var questionText = req.query.questionText;
    var answerText = req.query.answerText;
    var showNumber = req.query.showNumber;
    var airDate = req.query.airDate;

    var dbQuery = "select * from Questions join Categories on Questions.CategoryCode = Categories.CategoryCode where ";
    var paramCount = 0;
    var params = [];

    if (categoryTitle != null) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'CategoryTitle = ? ';
        params.push(categoryTitle.toUpperCase());
    }

    if (dollarValue != null) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'DollarValue = ? ';
        dollarValue = "$" + dollarValue;
        params.push(dollarValue);
    }

    if (questionText) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'QuestionText like ? ' ;
        questionText = '%' + questionText + '%';
        params.push(questionText);
    }

    if (answerText) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'AnswerText = ? ';
        params.push(answerText);
    }

    if (showNumber) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'ShowNumber = ? ';
        params.push(showNumber);
    }

    if (airDate) {

        if(paramCount > 0) {
            dbQuery = dbQuery + 'and ';
        }

        paramCount++;
        dbQuery = dbQuery + 'AirDate = ? ';
        params.push(airDate);
    }

    dbQuery = dbQuery + 'order by AirDate desc';

    if(paramCount == 0) {
        dbQuery = "select * from Questions order by AirDate desc";
    }

    db.all(dbQuery, params, (err, questions) => {

        if(questions.length > 5000) {
        return res.status(400).json({message: "too_many_results"});
    }

    if (err) {
        console.log(err);
        return res.status(500).json({message: "Internal server error"});
    }

    return res.status(200).json(questions);
});
});
var errFlag = false;
app.post('/questionadd', function(req, res) {
    var categoryCode = req.body.categoryCode;
    var categoryTitle = req.body.categoryTitle;
    var dollarValue = req.body.dollarValue;
    var questionText = req.body.questionText;
    var answerText = req.body.answerText;
    var showNumber = req.body.showNumber;
    var airDate = req.body.airDate;
    var auth = req.body.auth;
    //console.log(auth);
    var isnum = /^\d+$/.test(categoryCode);
    if( !isnum ){
        errFlag = true;
        return res.status(400).json({message: "categoryCode can only be postive Integer"});
    }
    if(airDate == undefined){
        errFlag = true;
        return res.status(400).json({message: "Air Date cannot be empty."});

    }
    if((dollarValue % 100 ) !=0 || (dollarValue/100)%2 != 0 || dollarValue<100 || dollarValue>2000){
        errFlag = true;
        return res.status(400).json({message: "Invalid dollar value"});

    }
    if(questionText == undefined || questionText == "" ){
        errFlag = true;
        return res.status(400).json({message: "questionText cannot be empty"});

    }
    if(categoryCode == undefined || categoryCode == ""){
        errFlag = true;
        return res.status(400).json({message: "categoryCode cannot be empty"});

    }
    if(answerText == undefined || answerText== "" ){
        errFlag = true;
        return res.status(400).json({message: "answerText cannot be empty"});

    }
    if(categoryTitle == undefined || categoryTitle == ""){
        errFlag = true;
        return res.status(400).json({message: "categoryTitle cannot be empty"});

    }
    db.beginTransaction(function(err, transaction) {
    var authQuery = "select AuthToken, AuthTokenIssued from Users where AuthToken = '"+ auth +"'";

        transaction.commit(function(err) {
    db.all(authQuery, function(err, rows) {
        //console.log(rows);
        //console.log(auth)
        if (err) {
            errFlag = true;
            return res.status(500).json({message: "Internal server error"});
        }

        if (rows.length == 0) {
            errFlag = true;
            return res.status(400).json({message: "unauthorized access"});
        }
        //&& (parseInt(Date.now().toString()) - parseInt(rows[0].AuthTokenIssued)) / 1000 > 3600
        if (rows) {
            //return res.status(200).json({message: rows});
            var timeDifferent = ((parseFloat(Date.now().toString()) - parseFloat(rows[0].AuthTokenIssued)) / 1000);
            if( timeDifferent>360000) {
                console.log(timeDifferent);
                errFlag = true;
                return res.status(400).json({message: "auth token expired"});
            }else{
                var checkquery1 = "select * from Categories"+
                    " WHERE CategoryTitle =" + " '"+categoryTitle+"'";

                db.all(checkquery1, function(err1,rows) {

                    if(rows != null && rows[0].CategoryCode != categoryCode){
                        console.log(rows + "111");
                        errFlag = true;
                        return res.status(400).json({message: "Invalid Category Code"});
                    }
                    if (err1) {
                        // return res.status(400).json({message: err1.toString()});
                        console.log(err1);
                    }

                });

                var checkquery2 = "select * from Categories"+
                    " WHERE CategoryCode = "+ categoryCode +"";
                console.log(checkquery2);
                db.all(checkquery2, function(err,rows) {
                    if(rows != null && rows[0].CategoryTitle != categoryTitle){
                            console.log(rows);
                            errFlag = true;
                            return res.status(400).json({message: "Invalid Category Title"});

                    }
                    if (err) {
                        //return res.status(400).json({message: err.toString()});
                    }

                });


                var checkquery = "select CategoryCode, CategoryTitle from Categories "+
                    "WHERE categoryCode = "+ categoryCode +" AND categoryTitle = " + "'"+categoryTitle+"'";
                // console.log(checkquery);
                db.all(checkquery, function(err,rows) {
                    if(rows>0){
                        return;
                    }
                    else{
                        // console.log(rows);

                            return;
                    }
                    if (err) {
                        errFlag = true;
                        return res.status(500).json({message: "Internal server error" + err.toString()})
                    };

                });



            }
        }
    });

            if(errFlag == false) {
                var categoryQuery = "INSERT INTO Categories (CategoryCode,CategoryTitle) VALUES (?,?)";
                var params = [categoryCode,categoryTitle];
                db.all(categoryQuery,params, function(err1) {
                    if (err1) {
                        // errFlag = true;
                        return;
                        // return res.status(400).json({message: err1.toString()});
                    }
                    return;
                });


                var QuestionQuery = "insert into Questions (categoryCode,dollarValue,questionText,answerText,showNumber,airDate)" +
                    "VALUES ( ?,?,?,?,?,?)";
                var params = [categoryCode, dollarValue, questionText, answerText, showNumber, airDate];

                db.all(QuestionQuery, params, function (err) {
                    if (err) {
                        return res.status(400).json({message: err.toString()});
                    } else {


                        return res.status(200).json({message: "success"});

                    }
                });
            }
        });
    });


});


var port = process.env.PORT || 8000;
app.listen(port, function() {
    console.log("Running server on port " + port);
});