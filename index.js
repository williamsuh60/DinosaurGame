const express = require('express');
const app = express();
const url = require("url");
app.use(express.static(__dirname));
app.set('view engine', 'html')

app.get('/', (req, res, next)=>{
  res.render('index.html');
  res.redirect(url.parse(req.url).pathname);
})

app.listen(process.env.PORT || 3000, ()=>{
  console.log("Listening");
})
