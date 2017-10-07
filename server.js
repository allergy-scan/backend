var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fetch = require('fetch');	

// json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/upc/:upc_code', function(req, res) {
	const upc_code = req.params.upc_code
    res.json({ message: upc_code });   
});

app.use('/api', router);


app.listen(port);
console.log('Server started on port ' + port);