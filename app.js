
// *********************************************
/*                  PRE CONFIG                */

var express             = require('express');
var bodyParser          = require('body-parser');
var expressValidator    = require('express-validator');
var mysql               = require('mysql');

var path                = require('path');
var app                 = express();

// *********************************************
/*                  APP CONFIG                */

app.set('port',             3000);
app.set('view engine',      'ejs');

// *********************************************
/*                  DB CONFIG                 */

var connection = mysql.createConnection(
{
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'app'
});

connection.connect();

// *********************************************
/*                  MIDDLEWARE                */

//Middleware should fire before any ROUTING

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path: CSS, Jquery etc (Angular, React would go here as index overrides routing)
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express validator middleware

app.use(expressValidator());


// *********************************************
/*                  GLOBAL VARS               */

app.use(function(req, res, next)
{
    res.locals.errors = null;
    next();
});

// *********************************************
/*                     ROUTING                */

app.get('/', function(req, res)
{
    connection.query('SELECT * FROM users', function (error, results, fields)
    {
        console.log(results);
        res.render('index',
        {
            title   :   'Customers',
            users   :   results
        });
    });
});

app.post('/users/add', function(req, res)
{
    req.checkBody('firstname',  'First Name is required!'   ).notEmpty();
    req.checkBody('lastname',   'Last Name is required!'    ).notEmpty();
    req.checkBody('email',      'Email is required!'        ).notEmpty();

    var errors = req.validationErrors();

    if(errors)
    {
        res.render('index',
        {
            title   : 'Customers',
            users   : users,
            errors  : errors
        });
    }
    else
    {
        var newUser = {
            firstname   : req.body.firstname,
            lastname    : req.body.lastname,
            email       : req.body.email
        }

        connection.query('INSERT INTO users SET ?', newUser, function (error, results, fields)
        {
            if(error) { console.log(error) } else
            {
                res.redirect('/');
                console.log(`Success!`);
            }
        });
    }
});

app.delete('/users/delete/:id', function(req, res)
{
    connection.query('DELETE FROM users WHERE id = ?', [req.params.id], function(error, results, fields)
    {
        if(error) { console.log(error) } else
        {
            console.log(`Deleted: ${req.params.id}`);
            res.redirect('/');
        }
    });
});

/*

    Pass views a variable
    res.render('index', {
        title: 'Customers'
    });
    accesable as <%= title %>
*/

// *********************************************
/*                  APP LAUNCH                */

app.listen(app.get('port'), function()
{
    console.log('<SRV> Apex Game Panel is live at localhost:' + app.get('port'));
});
