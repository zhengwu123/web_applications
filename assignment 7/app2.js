var express = require("express"); //Import express to use as our webserver
var sqlite3 = require("sqlite3"); //Import sqlite3 so we can talk to the database
var bodyParser = require("body-parser"); //Import bodyParser so we can read request body data
var uuid = require("uuid/v4"); //Import uuid so we can generate unique tokens
var TransactionDatabase = require("sqlite3-transactions").TransactionDatabase; //Import sqlite3-transactions so we can use transactions with the database

var app = express();
var db = new TransactionDatabase(new sqlite3.Database('./Jeopardy.db'));

//Use bodyParser to read request body data
app.use( bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Auth Middleware
function authMiddleware(req,res,next) {
    //Make sure a token was given
    if(!req.query.auth) {
        //The user did not pass a token at all, show an error
        return res.status(400).json({message: "unauthorized access"});
    }

    //Check this token against the database
    var dbQuery = "select * from Users where AuthToken = ?";
    db.get(dbQuery, [req.query.auth], function(err, user) {
        if(err) {
            //Something went wrong with the database (this shouldn't happen)
            return res.status(500).json({message: "Internal server error"});
        }
        if(!user) {
            //There are no users with this token, so this token is not valid
            return res.status(400).json({message: "unauthorized access"});
        }
        //This is a real auth token, but has it expired?
        var currentTime = new Date(); //Create a date object from the current time
        var tokenTimestamp = new Date(parseInt(user.AuthTokenIssued)); //Create a date object from the stored timestamp

        var millisInHour = 1000 * 60 * 60; //Work out how many milliseconds are in one hour
        if(currentTime - tokenTimestamp > millisInHour) {
            //The timestamp is older than 1 hour
            return res.status(400).json({message: "auth token expired"});
        }
        //If we made it this far, the token is valid
        return next();
    });
};

//Hello World Endpoint
app.get("/", function(req,res) {
    return res.send("Hello World");
})

//Signin Endpoint
app.post('/auth/signin', function(req, res) {
    var userID = req.body.userID;
    var password = req.body.password;

    //Make sure the username and password were both provided
    if(!userID || !password) {
        return res.status(401).json({message: "invalid_credentials"});
    }

    var dbQuery = "select * from Users where UserID = ? and UserPassword = ?";
    var requestParams = [userID, password];

    db.get(dbQuery, requestParams, function(err, user) {
        if(err) {
            //Something went wrong with the database (this shouldn't happen)
            return res.status(500).json({message: "Internal server error"});
        }

        //There is no user with these credentials
        if(user == null) {
            return res.status(401).json({message: "invalid_credentials"});
        }

        //This is a valid user, issue them an auth token
        var authToken = uuid();
        var currentTime = new Date().getTime().toString();
        //Store the auth token in the database
        db.run("UPDATE Users SET AuthToken = ?, AuthTokenIssued = ? WHERE UserID = ?",[authToken,currentTime,userID],function(err){
            if(err) {
                //Something went wrong with the database (this shouldn't happen)
                return res.status(500).json({message: "Internal server error"});
            }
            return res.status(200).json({message: "success", authToken: authToken});
        });
    });
});

//Endpoint to create a new question
app.post('/questionadd',authMiddleware, function(req, res) {

    //First, we'll validate the request data to make sure all the params were provided

    //Make sure the air date was provided
    if(!req.body.airDate) {
        return res.status(400).json({message: "Missing airDate"});
    }
    //Make sure the showNumber was provided
    if(!req.body.showNumber) {
        return res.status(400).json({message: "Missing showNumber"});
    }
    //Make sure the showNumber is a valid integer
    if(isNaN(req.body.showNumber) || parseInt(req.body.showNumber) <= 0) {
        return res.status(400).json({message: "showNumber must be a valid int over 0"});
    }
    //Make sure the dollarValue was provided
    if(!req.body.dollarValue) {
        return res.status(400).json({message: "Missing dollarValue"});
    }
    //Make sure the dollarValue is a multiple of 100 between 100-2000
    if((req.body.dollarValue % 100) !== 0 || parseInt(req.body.dollarValue) < 100 || parseInt(req.body.dollarValue) > 2000) {
        return res.status(400).json({message: "dollarValue must be an multiple of 100 between 100 and 2000"});
    }
    //Make sure the questionText was provided
    if(!req.body.questionText) {
        return res.status(400).json({message: "Missing questionText"});
    }
    //Make sure the answerText was provided
    if(!req.body.answerText) {
        return res.status(400).json({message: "Missing answerText"});
    }
    //Make sure the categoryCode was provided
    if(!req.body.categoryCode) {
        return res.status(400).json({message: "Missing categoryCode"});
    }
    //Make sure the categoryCode is a valid integer
    if(isNaN(req.body.categoryCode) || parseInt(req.body.categoryCode) <= 0) {
        return res.status(400).json({message: "categoryCode must be a valid int over 0"});
    }
    //Make sure the categoryTitle was provided
    if(!req.body.categoryTitle) {
        return res.status(400).json({message: "Missing categoryTitle"});
    }

    //Next, we'll check if the categoryCode and categoryTitle values are okay
    var queryString = "SELECT * FROM Categories WHERE categoryCode = ? AND categoryTitle = ?";
    db.get(queryString,[req.body.categoryCode, req.body.categoryTitle], function(err,category) {
        if(err) {
            //Something went wrong with the database (this shouldn't happen)
            return res.status(500).json({message: "Internal server error"});
        }
        if(category) {
            //This is an existing category combination, let's insert it into the database
            return insertQuestion({
                showNumber: req.body.showNumber,
                airDate: req.body.airDate,
                dollarValue: req.body.dollarValue,
                questionText: req.body.questionText,
                answerText: req.body.answerText,
                questionID: req.body.questionID,
                categoryCode: req.body.categoryCode,
                categoryTitle: null,
            },function(err){
                if(err) {
                    //Something went wrong with the database (this shouldn't happen)
                    return res.status(500).json({message: "Internal server error"});
                }
                return res.status(200).json({message: "success"});
            });
        }

        //This categoryCode/categoryTitle combination is not in the database. Is it brand new, or an invalid combo?
        //If either this categoryCode or categoryTitle are used anywhere else, this request is invalid
        var queryString = "SELECT * FROM Categories WHERE categoryCode = ? OR categoryTitle = ?";
        db.all(queryString,[req.body.categoryCode,req.body.categoryTitle], function(err,resultSet) {
            if(err) {
                //Something went wrong with the database (this shouldn't happen)
                return res.status(500).json({message: "Internal server error"});
            }
            if(resultSet.length > 0) {
                //Either the category code or title are in use somewhere else, this request is invalid
                //Determine which was already used so we can send the correct error message
                for(var i=0; i<resultSet.length; i++) {
                    if(resultSet[i].CategoryCode == req.body.categoryCode) {
                        //This categoryCode is already used
                        return res.status(500).json({message: "Invalid Category Code"});
                    } else if(resultSet[i].CategoryTitle == req.body.categoryTitle) {
                        //This categoryTitle is already used
                        return res.status(500).json({message: "Invalid Category Title"});
                    }
                }
                //It should not be possible to hit this point, but return an error just in case
                return res.status(500).json({message: "Internal server error"});
            } else {
                //This is a brand new pair of categoryCode/categoryTitle, let's insert them
                return insertCategoryAndQuestion({
                    showNumber: req.body.showNumber,
                    airDate: req.body.airDate,
                    dollarValue: req.body.dollarValue,
                    questionText: req.body.questionText,
                    answerText: req.body.answerText,
                    questionID: req.body.questionID,
                    categoryCode: req.body.categoryCode,
                    categoryTitle: req.body.categoryTitle,
                },function(err){
                    if(err) {
                        //Something went wrong with the database (this shouldn't happen)
                        return res.status(500).json({message: "Internal server error"});
                    }
                    return res.status(200).json({message: "success"});
                });
            }
        })
    })
});

//A helper function for inserting a category/question pair to the database
function insertCategoryAndQuestion(questionData, callback) {
    //Begin a transaction
    db.beginTransaction(function(err, transaction) {
        if(err) {
            return callback(err);
        }

        //Add our category insert operation to this transaction
        var categoryQueryString = "INSERT INTO Categories (CategoryCode, CategoryTitle) VALUES (?, ?)";
        var categoryQueryParams = [questionData.categoryCode, questionData.categoryTitle];
        transaction.run(categoryQueryString,categoryQueryParams);

        //Add our question insert operation to this transaction
        var questionQueryString = "INSERT INTO Questions (ShowNumber, AirDate, CategoryCode, DollarValue, QuestionText, AnswerText, QuestionID) VALUES (?, ?, ?, ?, ?, ?, ?)";
        var questionQueryParams = [questionData.showNumber, questionData.airDate, questionData.categoryCode, questionData.dollarValue, questionData.questionText, questionData.answerText, questionData.questionID];
        db.run(questionQueryString,questionQueryParams);

        //Execute our transaction now that it's ready
        transaction.commit(function(err){
            if(err) {
                return callback(err);
            }
            return callback(false);
        });
    })

}

//A helper function for inserting questions into the database
function insertQuestion(questionData, callback) {
    var queryString = "INSERT INTO Questions (ShowNumber, AirDate, CategoryCode, DollarValue, QuestionText, AnswerText, QuestionID) VALUES (?, ?, ?, ?, ?, ?, ?)";
    var queryParams = [questionData.showNumber, questionData.airDate, questionData.categoryCode, questionData.dollarValue, questionData.questionText, questionData.answerText, questionData.questionID];
    db.run(queryString,queryParams,function(err){
        if(err) {
            return callback(err);
        } else {
            return callback(false);
        }
    });
}

//Endpoint to get a list of questions (same as hw6)
app.get('/questions', authMiddleware, function(req, res) {
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