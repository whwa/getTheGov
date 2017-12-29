# lobIt

### Must have Node.js to run.

## To get up and running:

1. Unzip
2. Create Google API key -> Be sure to also enable Google Civic Information API on your developer console.
3. Create Lob account -> Log in and access your Settings. Under 'Account' tab, change US Mail Strictess to 'Relaxed'. You can find you test API key in 'API Keys' tab.
4. Fill in placeholders in .env file with api keys.

### To Run
```node index.js input.txt```

...where input.txt is the file containing sender information. The input file should be formatted the same as input.txt included in this project.

Link to created letter will print to console.

### To Test
```npm test```

#### Notes/TODO
-more elegant error handling

-add more robust checks for edge cases, especially for input file

-more robust test suite
