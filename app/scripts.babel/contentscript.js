'use strict';

const searchResultWithAdsIdentifier = '.result--ad';
const searchResultWithAdsClass = 'search-results--ads';

// Listener for intercepting messages from the popup.
browser.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'adsCount')) {
    const adsInfo = getAllElementsWithAds();
    return Promise.resolve(adsInfo.length);
  }
});

/**
 * Get all search result elements from DOM that contains ads
 * @returns Array (List of elements)
 */
function getAllElementsWithAds() {
  return document.querySelectorAll(searchResultWithAdsIdentifier);
}

/**
 * Set UI state by adding a class to highlight Ads from search results
 */
function highlightAds() {
  const searchResultsWithAds = getAllElementsWithAds() || [];

  searchResultsWithAds.forEach((searchResultWithAd) => {
    if (!searchResultWithAd.classList.contains(searchResultWithAdsClass)) {
      searchResultWithAd.classList.add(searchResultWithAdsClass);
    };
  });
}

window.addEventListener('load', highlightAds);

