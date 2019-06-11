'use strict';

const apiKey = 'LCH2EJFUfLKgGkyQxyC0fUzO1yA5nw2rdAo7h8VX';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

/**
 * Creates a query string from a params object
 * @param {object} params 
 * @returns {string} query string
 */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

/**
 * Performs the fetch call to get news
 * @param {string} query 
 * @param {number} maxResults 
 */
function getNPSParks(query, maxResults=10) {
  const params = {
    stateCode: query,
    language: 'en',
    api_key:apiKey,
    limit:maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  console.log(url);


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

/**
 * Appends formatted HTML results to the page
 * @param {object} responseJson 
 * @param {number} maxResults 
 */ 
function displayResults(responseJson, maxResults=10) {
  console.log('responseJson: ',responseJson);
  // clear the error message
  $('#js-error-message').empty();
  // if there are previous results, remove them
  $('#results-list').empty();
  let i=0;

  // iterate through the articles array, stopping at the max number of results
  responseJson.data.forEach(article => {
    // For each object in the articles array:
    // Add a list item to the results list with 
    // the article title, source, author,
    // description, and image
    
    if (i<maxResults){
      $('#results-list').append(
        `
          <li><h3><a href="${article.url}">${article.fullName}</a></h3>
          <p>${article.description}</p>
          </li>
        `
      );
      i++;
    }
  });
  // unhide the results section  
  $('#results').removeClass('hidden');
}

/**
 * Handles the form submission
 */
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let searchTerm = $('#js-search-term').val().split(' ').filter(Boolean).join('');
    console.log(searchTerm);
    const maxResults = $('#js-max-results').val();
    getNPSParks(searchTerm, maxResults);
  });
}

$(watchForm);