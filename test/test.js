const expect = require('chai').expect
const app = require('../index.js')

describe('testing', function() {

  it('it works', function() {
    expect(123).to.deep.equal(123);
  })
})

describe('readDataFromFile', function() {
  
  it('should read data from file', async function() {
    let lineData = [ 'From Name: Joe Schmoe',
      'From Address Line 1: 185 Berry Street',
      'From Address Line 2: Suite 170',
      'From City: San Francisco',
      'From State: CA',
      'From Country: US',
      'From Zip Code: 94107',
      'Message: This is a test letter for Lob\'s coding challenge. Thank you legislator.' ]

    const fileLines = await app.readDataFromFile('./test/testInput.txt')
    expect(fileLines).to.deep.equal(lineData);
  })
})

describe('formatSenderInfo', function() {
  
  it('should format sender info to match lob requirements', function() {

    let lineData = [ 'From Name: Joe Schmoe',
    'From Address Line 1: 185 Berry Street',
    'From Address Line 2: Suite 170',
    'From City: San Francisco',
    'From State: CA',
    'From Country: US',
    'From Zip Code: 94107',
    'Message: This is a test letter for Lob\'s coding challenge. Thank you legislator.' ]

    let letter = { 
      from:
        { name: 'Joe Schmoe',
          address_line1: '185 Berry Street',
          address_line2: 'Suite 170',
          address_city: 'San Francisco',
          address_state: 'CA',
          address_country: 'US',
          address_zip: '94107' },
      message: 'This is a test letter for Lob\'s coding challenge. Thank you legislator.'
    }

    let response = app.formatSenderInfo(lineData)
    expect(response).to.deep.equal(letter);
  })
})

describe('getGovernorInfo', function() {

  it('should call google api and return governor information', async function() {

    let letterInput = { 
      from:
        { name: 'Joe Schmoe',
          address_line1: '185 Berry Street',
          address_line2: 'Suite 170',
          address_city: 'San Francisco',
          address_state: 'CA',
          address_country: 'US',
          address_zip: '94107' },
      message: 'This is a test letter for Lob\'s coding challenge. Thank you legislator.'
    }
    
    let apiResponse = [
      {
       "name": "Edmund G. Brown Jr.",
       "address": [
        {
         "line1": "c/o State Capitol",
         "line2": "Suite 1173",
         "city": "Sacramento",
         "state": "CA",
         "zip": "95814"
        }
       ],
       "party": "Democratic",
       "phones": [
        "(916) 445-2841"
       ],
       "urls": [
        "http://gov.ca.gov/home.php"
       ],
       "channels": [
        {
         "type": "GooglePlus",
         "id": "+JerryBrown"
        },
        {
         "type": "Facebook",
         "id": "jerrybrown"
        },
        {
         "type": "Twitter",
         "id": "JerryBrownGov"
        }
       ]
      }
    ]

    const result = await app.getGovernorInfo(letterInput)
    expect(result).to.deep.equal(apiResponse);
  })
})

describe('formatReceiverInfo', function() {
  
  it('should format receiver info to match lob requirements', function() {

    let apiResponse = [
      {
       "name": "Edmund G. Brown Jr.",
       "address": [
        {
         "line1": "c/o State Capitol",
         "line2": "Suite 1173",
         "city": "Sacramento",
         "state": "CA",
         "zip": "95814"
        }
       ],
       "party": "Democratic",
       "phones": [
        "(916) 445-2841"
       ],
       "urls": [
        "http://gov.ca.gov/home.php"
       ],
       "channels": [
        {
         "type": "GooglePlus",
         "id": "+JerryBrown"
        },
        {
         "type": "Facebook",
         "id": "jerrybrown"
        },
        {
         "type": "Twitter",
         "id": "JerryBrownGov"
        }
       ]
      }
    ]

    let formattedReceiverInfo = { 
      name: 'Governor Edmund G. Brown Jr.',
      address_line1: 'c/o State Capitol',
      address_line2: 'Suite 1173',
      address_city: 'Sacramento',
      address_state: 'CA',
      address_zip: '95814',
      address_country: 'US' 
    } 
    let result = app.formatReceiverInfo(apiResponse)
    expect(result).to.deep.equal(formattedReceiverInfo);
  })
})

describe('createLetter', function() {
  
  it('should send request to lob api and return link to letter', async function() {
    let letter = { 
      from:
        { name: 'Joe Schmoe',
          address_line1: '185 Berry Street',
          address_line2: 'Suite 170',
          address_city: 'San Francisco',
          address_state: 'CA',
          address_country: 'US',
          address_zip: '94107' },
      message: 'This is a test letter for Lob\'s coding challenge. Thank you legislator.',
      to: { 
        name: 'Governor Edmund G. Brown Jr.',
        address_line1: 'c/o State Capitol',
        address_line2: 'Suite 1173',
        address_city: 'Sacramento',
        address_state: 'CA',
        address_zip: '95814',
        address_country: 'US' 
      }
    }
    let url = await app.createLetter(letter)
    expect(url.slice(0, 50)).to.equal('https://s3.us-west-2.amazonaws.com/assets.lob.com/');
  })
})