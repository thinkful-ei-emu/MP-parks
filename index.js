'use strict';

const apiKey = '';
const searchURL = 'https://newsapi.org/v2/everything';

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
function getNews(query, maxResults=10) {
  const params = {
    q: query,
    language: 'en',
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  const options = {
    headers: new Headers({'X-Api-Key': apiKey})
  };

  fetch(url, options)
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
function displayResults(responseJson, maxResults) {
  console.log('responseJson: ',responseJson);
  // clear the error message
  $('#js-error-message').empty();
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i<maxResults ; i++){
    // For each object in the articles array:
    // Add a list item to the results list with 
    // the article title, source, author,
    // description, and image
    $('#results-list').append(
      `
        <li><h3><a href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a></h3>
        <p>${responseJson.articles[i].source.name}</p>
        <p>By ${responseJson.articles[i].author}</p>
        <p>${responseJson.articles[i].description}</p>
        <img src='${responseJson.articles[i].urlToImage}'>
        </li>
      `
    );}
  // unhide the results section  
  $('#results').removeClass('hidden');
}

/**
 * Handles the form submission
 */
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}

$(watchForm);