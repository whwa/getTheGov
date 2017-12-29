# getTheGov

#### This is a simple program that reads an input file with sender information and creates a letter to the governor, outputting link to access letter. Uses Google Civic API to get governor info based on sender zip code. Uses Lob API to create formatted and ready-to-send letter.

## To get up and running:

1. ```npm install```
2. Create Google API key -> Be sure to also enable Google Civic Information API on your developer console.
3. Create Lob account -> Log in and access your Settings. Under 'Account' tab, change US Mail Strictess to 'Relaxed'. You can find you test API key in 'API Keys' tab.
4. Create .env file in root directory (copy example) and fill in placeholders with api keys.

### To Run
```node index.js input.txt```

...where input.txt is the file containing sender information. The input file should be formatted the same as input.txt included in this project. Note: message field in input file can be no longer than 500 characters.

Link to created letter will print to console.

### To Test
```npm test```

#### Notes/TODO
-more elegant error handling

-add more robust checks for edge cases, especially for input file

-more robust test suite
