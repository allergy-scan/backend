const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const pretty = require('express-prettify')
const upc = require('./lib/upc')
const db = require('./lib/db')

// json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(pretty({query: 'pretty'}))
var port = process.env.PORT || 8080

var router = express.Router()

router.get('/upc/:upc_code', (req, res) => {
  const upc_code = req.params.upc_code

  // res.json(upc.extractData({"ingredients":"Made of: Sorbitol, Corn Starch, Wheat Maltodextrin, Natural and Artificial Flavors, Acacia, Magnesium Stearate, Sucralose.","brand":"Altoids","nutrition":"Serving Size 1.0 mint Servings Per Container 50 Amount Per Serving Calories 1 Calories from Fat 0 % Daily Value* Total Fat 0g 0% Sodium 0mg 0% Total Carbohydrate 0g 0% Sugars 0g Protein 0g Vitamin A 0% Vitamin C 0% Calcium 0% Iron 0%","upc_code":"0022000009739","formattedNutrition":{"Servings Per Container":{"qty":"50","dv":null},"Protein":{"qty":"0g","dv":null},"Serving Size":{"qty":"1.0 mint","dv":null},"Calcium":{"dv":"0%","qty":null},"Calories":{"dv":null,"qty":"1"},"Iron":{"dv":"0%","qty":null},"Vitamin A":{"dv":"0%","qty":null},"Sodium":{"dv":"0%","qty":"0mg"},"Vitamin C":{"qty":null,"dv":"0%"},"Sugars":{"dv":null,"qty":"0g"},"Calories from Fat":{"dv":null,"qty":"0"},"Total carbohydrates":{"qty":"0g","dv":"0%"},"Allergy Warning":"Contains gluten, wheat.","Total Fat":{"dv":"0%","qty":"0g"}},"product_web_page":"http://directionsforme.org/item/127252","return_message":"Success","usage":"Altoids Smalls Sugar-Free. Naturally & artificially flavored peppermint. 50 mints. .","website":"directionsforme.org/","manufacturer":{"address":null,"state":null,"country":null,"postal_code":null,"contact":null,"address2":null,"city":null,"company":"Wm. Wrigley Jr. Company","phone":null},"uom":"0.37 ounces Tin","language":"en","gcp":{"country":"US","gln":"22000001108","contact":null,"gcp":"0022000","address2":"410 N. Michigan Ave.","postal_code":"60611","state":"IL","address":"Wrigley Building","fax":null,"company":"Wm. Wrigley Jr. Company","city":"Chicago","phone":"(312) 645-3541"},"gcp_gcp":"22000","description":"Altoids Smalls Sugar-free Peppermint Mints","directions":"http://www.digit-eyes.com/cgi-bin/digiteyes.fcgi?action=quickScan&k=/2dZpVxd0peJ&iP=3&upcCode=0022000009739&l=en","image":"https://i5.walmartimages.com/asr/603577a0-bcc9-4162-bb68-163a99a6343f_1.44d5adc6d0b471c0ec31c9fa9d368571.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF","return_code":"000"}))

  upc.fetchProduct(upc_code)
   .then(json => {
      res.json(json)
   })
})

router.post('/register', (req, res) => {
  const json = req.body

  const email = json["email"]
  const password = json["password"]

  const id = db.createUser(email, password)

  res.json({
    id: id
  })
})

router.post('/login', (req, res) => {
  const json = req.body
  const email = json.email
  const password = json.password

  const validated = db.validateUser(email, password)

  res.json({
    success: validated
  })
})

app.use('/api', router)


app.listen(port, '127.0.0.1')
console.log('Server started on port ' + port)