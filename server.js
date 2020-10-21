require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app =  express();
const {Restaurant, sequelize, load} = require('./models/models');

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/restaurants', async (req, res)=>{
    const restaurants = await Restaurant.findAll({include: ["menus"]});
    res.render('restaurants', {restaurants});
})

app.get('/restaurants/:id', async (req, res)=>{
    console.log(req.params.id);
    const restaurant = await Restaurant.findByPk(req.params.id, {include: [{all: true, nested: true}]});
    res.render('restaurant', {restaurant});
})

app.listen(3000, async (err)=>{
    console.log(process.env.NODE_ENV)
    await sequelize.sync();
    await load();
    if (err) throw new Error(err);
    console.log('Listening...');
})
