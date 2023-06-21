/// <reference path="jquery-3.7.0.js"/>

"use strict";

//# Main
$(() => { 

    // Validation and click handler
    function validationHandler() {
        return $("#countrySearchBox").val().length >= 3;
    }
    function errorHandler() {
        let errorMessage = `<span>No countries found under: "${$("#countrySearchBox").val()}"<span>`
        $("#statsContainer").html(errorMessage)
        $("#countriesContainer").hide();
        $("#regionsContainer").hide();
        $("#bonusContainer").hide();
    }
    // On search click, results that return from the API will be displayed on the page.
    $("#searchButton").on("click", async function(){
        if (validationHandler()){
            let searchQuery = $("#countrySearchBox").val();
            const data = await getJSON(`https://restcountries.com/v3.1/name/${searchQuery}`)
            if (data.status === 404) errorHandler()
            else {

                await displayStatsTable(data);
                await displayCountryTable(data);
                await displayRegionsTable(data);
                await displayBonusContainer(data)
                $("#containerOfContainers").children().show();
            }
        } else {
            let errorMessage = `<span>You must input at least three letters<span>`
            $("#statsContainer").html(errorMessage)
            $("#containerOfContainers").children().hide();
        }
    })

    $("#allCountriesButton").on("click", async function(){
        const data = await getJSON(`https://restcountries.com/v3.1/all`)
        $("#countriesContainer").hide();
        $("#bonusContainer").hide();
        $("#regionsContainer").show();
        await displayStatsTable(data);
        await displayRegionsTable(data);
    })

    async function displayStatsTable(data) {
        const stats = await dataManipulation(data);
        let statsContent = `
        <p>Amount of countries found: <span>${stats[0]}</span></p>
        <p>Total Population: <span>${stats[1].toLocaleString()}</span></p>
        <p>Average (Mean) Population: <span>${stats[2].toLocaleString()}</span></p>
        `
        $("#statsContainer").html(statsContent)
        
    }

    async function displayCountryTable(data){
        // Table displaying name of country and population of country
        let countryTableContent =``;

        for (let i = 0; i < data.length; i++) {
            let name = data[i].name.common;
            let population = data[i].population;

            countryTableContent +=
            `
                <tr>
                    <td> ${name} </td>
                    <td> ${population.toLocaleString()} </td>
                </tr>
            `
        }

        let countryTable = 
        `
        <table id="dataTable">
            <thead>
                <th> Country Name </th>
                <th> Country Population </th>
            </thead>
            <tbody>
                ${countryTableContent}
            </tbody>
        </table>
        `
        $("#countriesContainer").html(countryTable)
    }

    async function displayRegionsTable(data){
        // Table displaying the region and the amount of countries in that region
        // Getting Regions
        
        // All the countries regions in one array
        let regionsArr = [];
        for (let i = 0; i < data.length; i++) {
            if (!(regionsArr.includes(data[i].region))) {
                regionsArr.push(data[i].region);
                regionsArr.push(1);
            } else {
                let indexOfCounter = (1 + regionsArr.indexOf(data[i].region));
                regionsArr[indexOfCounter]++;
            }
        }

        let regionsTableContent =``;
        for (let i = 0; i < (regionsArr.length)/2; i++) {
            let j = i;
            if (i >= 1) j = i*2;

            regionsTableContent +=
                `
                    <tr>
                        <td>${regionsArr[j]} </td>
                        <td>${regionsArr[j+1]} </td>
                    </tr>
                `
        }

        let regionsTable = 
        `
        <table id="dataTable">
            <thead>
                <th> Region </th>
                <th> Amount in region </th>
            </thead>
            <tbody>
                ${regionsTableContent}
            </tbody>
        </table>
        `
        $("#regionsContainer").html(regionsTable)
    }

    // Getting currency
    async function displayBonusContainer(data) {
        let currencyArray = [];
        for (let i = 0; i < data.length; i++) {
            let currency;
            if (data[i].currencies === undefined) continue
            else {
                // If a country uses more than one currency
                if (Object.keys(data[i].currencies).length > 1) {
                    console.log(Object.keys(data[i].currencies))
                    let multCurrencyArr = Object.keys(data[i].currencies);
                    multCurrencyArr.forEach(currency => {
                        if (!(currencyArray.includes(currency))) {
                            currencyArray.push(currency);
                            currencyArray.push(1);
                        } else {
                            let indexOfCounter = (1 + currencyArray.indexOf(currency));
                            currencyArray[indexOfCounter]++;
                        }
                    });
                }
                // If a country only has one currency
                else {
                    currency = Object.keys(data[i].currencies).toString();
                    if (!(currencyArray.includes(currency))) {
                        currencyArray.push(currency);
                        currencyArray.push(1);
                    } else {
                        let indexOfCounter = (1 + currencyArray.indexOf(currency));
                        currencyArray[indexOfCounter]++;
                    }
                }    
            }
                
        }
        console.log(currencyArray);

        let currencyTableContent =``;
        for (let i = 0; i < (currencyArray.length)/2; i++) {
            let j = i;
            if (i >= 1) j = i*2;

            currencyTableContent +=
                `
                    <tr>
                        <td>${currencyArray[j]} </td>
                        <td>${currencyArray[j+1]} </td>
                    </tr>
                `
        }

        let bonusTable = 
        `
        <table id="dataTable">
            <thead>
                <th> Currency </th>
                <th> # of countries that use it </th>
            </thead>
            <tbody>
                ${currencyTableContent}
            </tbody>
        </table>
        `
        $("#bonusContainer").html(bonusTable)
    }
    
    //# Get the number of countries, the average and total population
    async function dataManipulation(data) {
        // - Number of countries - results that came back
        let numbCountries = data.length;

        // - Total population
        let totalPop = 0;
        for (let i = 0; i < data.length; i++) {
            const countryPopulation = data[i].population;
            totalPop += countryPopulation;
        }

        // - Average mean population
        let avgPop = totalPop / numbCountries;

        return [numbCountries, totalPop, avgPop,]
    }
    
    
    //# Getting data from API
    async function getJSON(url) {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    }

    // # API List
    // All Countries
    // https://restcountries.com/v3.1/all

    // Name
    // https://restcountries.com/v3.1/name/{name}

});