require('dotenv').config();
var express = require('express');
var app = express();
const port = 3001;

var app = express();
app.use(express.static(__dirname + '/public'));
//app.use(express.favicon());
//app.use(express.logger('dev'));

var mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true,useUnifiedTopology: true }, () => {
  console.log("połączono z bazą mongo!");
  app.listen(port, () => console.log("Serwer pracuje na porcie: " + port));
  console.log("test serwera: http://localhost:" + port + "/hello");
  console.log("link do serwera: http://localhost:" + port + "/");
});

var schema = mongoose.Schema({
	nazwa:{type:String, required:true},
	zakonczone:{type:Boolean, default:false},
	data:{type:Date, default:Date.now}
}); 

var task = mongoose.model('myToDoList',schema);

// dodaj views
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// pokaż tasks
app.get('/', function(req, res) {
	task.find({},(err, tasks)=>{
		console.log('tasks GET');//,tasks);
		res.render('myToDoView', {tasks:tasks || [] })
		
	});					  
});

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// dodaj
app.post('/', function(req, res) {
	var zadanie = new task();
	zadanie.nazwa = req.body.nazwa
	zadanie.save();
	res.redirect('/');
	console.log('tasks POST');
});

// usuń
app.post('/:id/usun', function(req, res) {
	task.deleteOne({_id: req.params.id}, (err, tasks)=>
		{
			res.redirect('/')
			console.log('usuń');
		});
});

// usuń zakończone
app.post('/usunWszystkie', function(req, res) {
	task.deleteMany({'zakonczone':true}, (err, tasks)=>
		{
			res.redirect('/')
			console.log('usuńWszystkie');
		});
});

// zakończ zadanie
app.post('/:id/zakoncz', function(req, res) {
	task.findById({_id: req.params.id}, (err, tasks)=>
		{
			tasks.zakonczone = true;
			tasks.save();
			setTimeout(() => {  console.log("wait!"); }, 2000);
			res.redirect('/')
			console.log('zakoncz');
		});
});





// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");
// app.set("view options", { layout: false } );

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); 

//test serwera
app.get('/hello', (req, res) => {
  res.send('hey hi hello!!!')
})

// app.listen(port, () => {
//    console.log("apka nasłuchuje na porcie http://localhost:"+port+"/hello");
// })