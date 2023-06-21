# Country Statistics Searcher

This is a simple web application that allows you to search for statistics about countries using their names or partial names. The application is built using HTML, CSS, JavaScript, and utilizes the jQuery library and AJAX for making API requests.

## Usage
1. Open the `index.html` file in a web browser.
2. Enter at least three letters of the country name in the search box.
3. Click the "Search" button to retrieve country statistics based on the search query.
4. The application will display the number of countries found, total population, and average population in the "Stats" section.
5. Three tables will be shown:
    1. Country names and their respective populations
    2. Regions and the number of countries in each region.
    3. Currencies and the number of countries that use them including support for countries that use multiple currencies
6. To view statistics for all countries, click the "All Countries" button.

## Dependencies
- jQuery 3.7.0 library

## API Endpoints
- All Countries: `https://restcountries.com/v3.1/all`
- Name: `https://restcountries.com/v3.1/name/{name}`

Please note that you need an internet connection to access the API and retrieve country data.

Feel free to explore the code and customize it according to your needs.