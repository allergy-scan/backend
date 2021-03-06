const fetch = require('node-fetch')
const CryptoJS = require('crypto-js')
const withQuery = require('with-query')
const fsPromiser = require('promisify-fs');
const fs = require('fs');
const path = require('path')

const API_KEY = process.env.API_KEY
const AUTH_KEY = process.env.AUTH_KEY

const sign = (upc_code) => {
  const encrypted = CryptoJS.HmacSHA1(upc_code, AUTH_KEY)
  return CryptoJS.enc.Base64.stringify(encrypted)
}

const parseIngredients = (ingredients) => {
  // remove beginning thing
  var formatted = ingredients.replace("Made of:", "").trim()

  while (formatted[formatted.length - 1] === ".")
    formatted = formatted.slice(0, -1)

  formated = formatted.trim()

  var regex = /,(?![^(]*\))/;

  return formatted.split(regex)
}

const extractData = (json) => {
  const desc = json["description"]
  const upc = json["upc_code"]
  const image = json["image"]
  const nutrition = []
  var ingredients = []

  for (var key in json["formattedNutrition"]) {
    const value = json["formattedNutrition"][key]
    nutrition.push({
      name: key,
      quantity: value["qty"],
      daily_value: value["dv"]
    })
  }

  ingredients = parseIngredients(json["ingredients"])

  return {
    upc,
    desc,
    image,
    ingredients,
    nutrition
  }
}

module.exports.fetchProduct = (upc_code) => {
  const cachePath = path.join(__dirname, '..', 'cache', + upc_code + '.json')
  
  if (fs.existsSync(cachePath)) {
    return fsPromiser.readFile(cachePath)
      .then(contents => JSON.parse(contents))
      .then(json => extractData(json))
  }

  const url = withQuery("https://www.digit-eyes.com/gtin/v2_0", {
    upcCode: upc_code,
    language: "en",
    app_key: API_KEY,
    signature: sign(upc_code)
  })

  return fetch(url).then(res => res.json()).then(json => {
    // cache response
    fs.writeFile(cachePath, JSON.stringify(json), (err) => {})

    const data = extractData(json)

    return data
  })
}