require('dotenv').config()
const fs = require('fs')
const {promisify} = require('util')
const axios = require('axios')
const Lob = require('lob')(process.env.LOB_API_KEY)

const generateLetter = async () => {
  let lines = await readDataFromFile(process.argv[2])
  let letter = formatSenderInfo(lines)
  let governorInfo = await getGovernorInfo(letter)
  letter.to = formatReceiverInfo(governorInfo)
  let letterUrl = await createLetter(letter)
  console.log(letterUrl)
}

const readDataFromFile = async (path) => {
  const readFileAsync = promisify(fs.readFile)
  const lines = await readFileAsync(path, 'utf-8')
    .catch(err => {console.log('There was an error reading input file.', err)}) 
  return lines.split('\n')
}

const formatSenderInfo = (lines) => {
  lines = lines.map((line) => {
    return line.slice(line.indexOf(':') + 1).trim()
  })
  let from = {
    name: lines[0],
    address_line1: lines[1],
    address_line2: lines[2],
    address_city: lines[3],
    address_state: lines[4],
    address_country: lines[5],
    address_zip: lines[6]
  }
  return {from, message: lines[7]}
}

const getGovernorInfo = async (letter) => {
  let params = {
    key: process.env.GOOG_API_KEY,
    includeOffices: true,
    address: JSON.stringify(letter.from.address_zip),
    levels: 'administrativeArea1',
    roles: 'headOfGovernment'
  }
  const response = await axios.get(`https://www.googleapis.com/civicinfo/v2/representatives`, {params})
    .catch(err => {console.log(`Error fetching governor info. Message: ${err.message}. ${err.response.statusText}. Check input file has valid zip code. Check Google API key.`)})
  return response.data.officials
}

const formatReceiverInfo = (data) => {
  const mailingAddress = data[0].address[0]
  
  let to = {
    name: `Governor ${data[0].name}`,
    address_line1: mailingAddress.line1,
    address_line2: mailingAddress.line2 || '',
    address_city: mailingAddress.city,
    address_state: mailingAddress.state,
    address_zip: mailingAddress.zip,
    address_country: 'US'
  }
  return to
}

const createLetter = async ({to, from, message}) => {
  promisify(Lob.letters.create)

  const response = await Lob.letters.create({
    description: 'Letter to Governor',
    to,
    from,
    file: fs.createReadStream('letter.html'),
    merge_variables: {
      message
    },
    color: true
  })
    .catch(err => {console.log('There was an error generating letter.', err.message)})
  return response.url
}

process.argv[2] ? generateLetter().catch((err) => {console.log('Please try again.')}) : null

module.exports = {
  readDataFromFile,
  formatSenderInfo,
  getGovernorInfo,
  formatReceiverInfo,
  createLetter
}