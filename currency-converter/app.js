const axios = require('axios') ;

const FIXER_API_KEY = '6e186480adb0bd1bea0a2947b6c7a42c'
const FIXER_API = `http://data.fixer.io/api/latest?access_key=${FIXER_API_KEY}`


const REST_COUNTRIES_API = 'https://restcountries.eu/rest/v2/currency'

// fetch data about currency
const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
         // make a call to the api
    const { data: { rates } } = await axios.get(FIXER_API)

    const euro = 1 / rates[fromCurrency]
    const exchangeRate = euro * rates[toCurrency] 

    return exchangeRate;
    } catch (error) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}`)
    }
   
}

// getExchangeRate('USD', 'EURO')



// fetch data about countries
const  getCountries = async (currencyCode) => {
    try {
         // fetch data about in which countries a certain currency can be used in
        const { data } = await axios.get(`${REST_COUNTRIES_API}/${currencyCode}}`);
        // map over the list of countries so that we can get only the country name
        return data.map((country) => country.name) 
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`)
    }
   

}

getCountries('EURO')



const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    fromCurrency = fromCurrency.toUpperCase()
    toCurrency = toCurrency.toUpperCase()

    // call the functions at the same time instead of waiting
    const [exchangeRate, countries] = await Promise.all([
       getExchangeRate(fromCurrency, toCurrency),
       getCountries(toCurrency)
    ])
    // calculate the converted amount
    const convertedAmount = (amount * exchangeRate).toFixed(2)

    return (`${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}
    You can spend these in th following countries: ${countries}.`
    )
 
}

// how to retrieve the value from this function?
const result = convertCurrency('USD', 'CAD', 20)
console.log(result)
    



