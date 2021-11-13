# Search Ads Analysis Browser Extension

Browser Extension that highlights Ads in search results for duckduckgo.com

## Features

For duckduckgo.com
- Changes background color of Ads in search results to color Red 
- Appends **in 2021** to all search queries
- Shows number of Ads in each open search tab in extension popup

## How to load the extension

1. Clone the git repo: https://github.com/shuba3862/search-ads-analysis-extension.git
2. Go to chrome://extensions and load `app` directory from `search-ads-analysis-extension`
3. Enable the extension and pin the extension iconr.

## Test the functionality

1. Go to duckduck.com
2. Search for a keyword that will show Ads in the result e.g. "Resume Builder". The results should show Ads in red
3. Open the popup. The number of Ads count should render

## Design details

- Used `browser` namespace and `promises` using [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) in order to be compatible with all Browsers. [Reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Chrome_incompatibilities).

- Added browser tab event listeners for handling enabling/disabling extension browser action based on search query URL.

- Used [tabs.sendMessage](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage) API for the extension popup to communicate with content script to get the Ads count.

- In order to style the Ads in the search results with the background color:  
  - Identify all search result elements having Ads in the DOM through content script.
  - Then through content script add class to all the search result elements having Ads. 
  - Then use that added class to style with background-color in a seperate css file. 
  - This approach helps keep the JS and styling logic seperate in their respective files vs directly setting styles for the DOM through JS. This also enables the code to be extensible for adding additional styles 

- Used [webNavigation.onBeforeNavigate](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webNavigation/onBeforeNavigate) API to intercept the search query call for duckduckgo.com and update the query with `in 2021` keyword. The other option was to use [webRequest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest) API but `webRequest` is more ideal for modifying requests at a lower level such as handling redirects or adding headers which does not apply to our requirement.

- Added logic to avoid appending the `in 2021` multiple times such that if query already has `in 2021` appended, it won't append again.
 
## Testing

I did evaluate few open source solutions for adding automated tests for browser extensions but I could not find a robust open source solution. Here are my evaluation details

- [sinon-chrome](https://github.com/acvetkov/sinon-chrome) is good but is built for `chrome` and does not have out of the box solution for `browser/webExtension` APIs. TODO: Continue to investigate and update this repo.

