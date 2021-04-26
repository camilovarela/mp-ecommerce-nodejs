var express = require('express');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000

var app = express();
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data


var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'APP_USR-6377878936994227-042601-462bbbae2961834d1060ba4252548d06-749531263'
});
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.post('/complete', function (req, res) {

    var title = req.body.title;
    var price = req.body.price;
    var unit = req.body.unit;

    console.log(title + " " + price + " " + unit);

    var preference = {
        items: [
            {
                id: 1234,
                title: '',
                description: 'Dispositivo móvil de Tienda e-commerce',
                quantity: 1,
                unit_price: 10000
            }
        ],
        payer: {
            name: 'Lalo Landa',
            email: 'test_user_83958037@testuser.com',
            date_created: '2021-04-02T12:58:41.425-04:00',
            phone: {
                area_code: '52',
                number: 5549737300
            },
            address: {
                street_name: 'Insurgentes Sur',
                street_number: 1602,
                zip_code: '03940'
            }
        },
        back_urls: {
            success: 'https://www.success.com',
            failure: 'http://www.failure.com',
            pending: 'http://www.pending.com'
        },
        auto_return: 'approved',
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6
        },
        notification_url: 'https://camilovarela-mp-commerce.herokuapp.com/callback',
        statement_descriptor: 'MINEGOCIO',
        external_reference: 'ing.camilovarela@gmail.com'
    };

    preference.items[0].title = title;
    preference.items[0].unit_price = Number(price);
    preference.items[0].quantity = Number(unit);

    var initPoint;
    mercadopago.preferences.create(preference)
        .then(function(response) {
            console.log(response.body.init_point);
            res.redirect(response.body.init_point);
        }).catch(function(error) {
            console.log(error);
        });
});

app.post('/callback', function (req, res) {
    console.log(req.body);
});

app.listen(port);