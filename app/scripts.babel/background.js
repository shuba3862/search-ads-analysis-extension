'use strict';

const SEARCH_URL_MATCH = 'duckduckgo.com/?q=';
const SEARCH_QUERY_KEYWORD_TO_APPEND = 'in 2021';
const SEARCH_QUERY_KEY = 'q';
const SEARCH_QUERY_REGEX = /in 2021$/;
const SEARCH_HOST_NAME = 'duckduckgo.com';

/**
 * Triggers a tab update to update the url with a search query with a specifed keyword appended 
 * If query already has the keyword appended then do not update the tab url
 * @param {Object} details Navigation details passed from event callback
 * @returns Promise (tab update promise)
 */
function onUpdatedSearchQuery(details) {  
  const searchUrl = new URL(details.url);
  const urlQueryParams = new URLSearchParams(searchUrl.search);
  const existingSearchQuery = urlQueryParams.get(SEARCH_QUERY_KEY);

  // If search query already has 2021 then do nothing
  if (new RegExp(SEARCH_QUERY_REGEX).test(existingSearchQuery)) {
    return;
  } else {
    const urlWithUpdateSearchQuery = getUrlWithUpdateSearchQuery(
      searchUrl,
      urlQueryParams,
      existingSearchQuery
    );
    browser.tabs.update(details.tabId, { url: urlWithUpdateSearchQuery });
  }
}

/**
 * Appends search query with specified keyword
 * @param {URL} url URL to update
 * @param {Object} queryParams URL query params
 * @param {String} searchQuery existing search query to update
 * @returns String (Updated URL)
 */
function getUrlWithUpdateSearchQuery(url, queryParams, searchQuery) {
  const newSearchQueryParam = searchQuery.concat( ' ', SEARCH_QUERY_KEYWORD_TO_APPEND);
  queryParams.delete(SEARCH_QUERY_KEY);
  queryParams.set(SEARCH_QUERY_KEY, newSearchQueryParam);
  url.search = queryParams;
  
  return url.href;
}
/**
 * Gets search query params from a URL
 * @param {URL} url 
 * @returns Steinf search query param value
 */
function getSearchQueryParamsFromUrl(url) {
  const urlQueryParams = new URLSearchParams(url.search);
  return urlQueryParams.get(SEARCH_QUERY_KEY);
}

/**
 * Enable browser action if url updated is for a specified url with search query
 * Disable for all other urls
 * @param {Number} tabId 
 * @param {Object} changeInfo 
 * @param {Object} tab 
 */
function onUpdateTab(tabId, changeInfo, tab) {
  const url = new URL(tab.url);
  const hasSearchQueryInUrl = getSearchQueryParamsFromUrl(url) !== null;

  if (changeInfo.status === 'complete' && (url.hostname === SEARCH_HOST_NAME) && hasSearchQueryInUrl) {
    browser.browserAction.enable(tabId);
  } else if (changeInfo.status === 'complete') {
    browser.browserAction.disable(tabId);
  }
}

/**
 * Disable browser action by default
 * Only enable browser action if url for a newly created tab is for a specified url with search query
 * @param {Object} tab 
 */
function onCreateTab(tab) {
  browser.browserAction.disable(tab.id);
  
  if (tab.url) {
    const url = new URL(tab.url);
    const hasSearchQueryInUrl = getSearchQueryParamsFromUrl(tab.url) !== null; 
    if ((url.hostname === SEARCH_HOST_NAME) && hasSearchQueryInUrl) { 
      browser.browserAction.enable(tab.id);
    }
  }
}

// Listener for handling extension browser action on tab update
browser.tabs.onUpdated.addListener(onUpdateTab);

// Listener for handling extension browser action on tab create
browser.tabs.onCreated.addListener(onCreateTab);

// Web Navigation listener to update search query
browser.webNavigation.onBeforeNavigate.addListener(onUpdatedSearchQuery, {
  url: [{ 
    hostSuffix: SEARCH_HOST_NAME,
    queryContains: 'q=' 
  }],
});
