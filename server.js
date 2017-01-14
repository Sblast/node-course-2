const 	express 		= require('express'),
		//template engine 
		hbs				= require('hbs'),
		//fs - file system
		//built in node
	 	fs 				= require('fs');


//taking the environment variables from the hosting server
//we don't have it locally so add: || 3000
const port = process.env.PORT || 3000;

//starting express
var app = express();


//----------------
//hbs 
//----------------
//partials folder
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
//serving static files

//==============================
//Middleware (runs by order)
//==============================

//Maintenance message - above express.static - commented on/off
// app.use((req,res, next) => {
// 	res.render('partials/maintenance.hbs');
// 	//don't need next()
// });

//Express serving static files
app.use(express.static(__dirname + '/public'));

//Log Server requests 
app.use((req,res,next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	  //logging:
	  console.log(log);	 
	  //(file name, what we add)
	  fs.appendFile('server.log', log + '\n', (err)=> {
	  	if (err) {
	  		console.log(`unable to append to server.log.`);
	  	}
	  });
	next();
});



//--------------------------------------
//hbs helpers
//--------------------------------------
//functions that dynamically create content that can run from an hbs
//name of helper, callback function
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});


//Routes
//======================================

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

// /bad - send back json with errorMessage
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

//Express server, port is the const defined above
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
