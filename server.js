const fetch = require('node-fetch');
const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app =  express();

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')
app.use(express.static('public'));

app.get('/secret', (req, res)=>{
    console.log('Shhhh!');
    res.status(403).send('Access Denied!');
})

app.get('/about', (req, res)=>{  
    const data = {text: "Test test 123", img: "https://static.toiimg.com/thumb/msid-44945486,width-1070,height-580,resizemode-75,imgsize-44945486,pt-32,y_pad-40/44945486.jpg"};
    res.render('about', data);
})

app.get('/gallery', (req, res)=>{
    const data = {image: [
        "https://static.toiimg.com/thumb/msid-44945486,width-1070,height-580,resizemode-75,imgsize-44945486,pt-32,y_pad-40/44945486.jpg",
        "https://static.toiimg.com/thumb/msid-44945488,width-748,height-499,resizemode=4,imgsize-291921/Nice-in-pictures.jpg",
        "https://static.toiimg.com/thumb/msid-44945486,width-1070,height-580,resizemode-75,imgsize-44945486,pt-32,y_pad-40/44945486.jpg",
        "https://static.toiimg.com/thumb/msid-44945486,width-1070,height-580,resizemode-75,imgsize-44945486,pt-32,y_pad-40/44945486.jpg",
        "https://static.toiimg.com/thumb/msid-44945488,width-748,height-499,resizemode=4,imgsize-291921/Nice-in-pictures.jpg",
        "https://static.toiimg.com/thumb/msid-44945486,width-1070,height-580,resizemode-75,imgsize-44945486,pt-32,y_pad-40/44945486.jpg",
    ]}
    res.render('gallery', data);
});

app.get('/nasa', async (req, res)=>{
    const dateTime = randomDate(new Date(1995, 16, 6), new Date());
    const date = dateTime.toISOString().substr(0,10);
    let isImage = false;
    await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${date}`).then((res) => res.json()).then((data)=>{
        console.log(data);
        if (data.media_type === 'image') {
            isImage = true;
        } else{
            isImage = false;
        }
        console.log({data: data, isImage: isImage});
        res.render('nasa', {data: data, isImage: isImage});
    });
})

app.get('/space', async (req, res) =>{
    await fetch('http://api.open-notify.org/astros.json').then(res => res.json()).then(data=>{
        res.render('space', data);
    })
})

app.listen(3000, (err)=>{
    if (err) throw new Error(err);
    console.log('Listening...');
})

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }