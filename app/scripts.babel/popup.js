'use strict';

/**
 * Set state render Ads count in pop-up
 * @param {String} adsCount 
 */
function setAdsInfo(adsCount) {
  if (document.getElementById('total_ads')) {
    document.getElementById('total_ads').textContent = adsCount;
  }
}

/**
 * Sends message to content script to get ads count for popup
 * @param {Object} tabs 
 */
async function sendMessageForAdsCount(tabs) {
  const adsCount = await browser.tabs.sendMessage(
    tabs[0].id,
    { from: 'popup', subject: 'adsCount' },
  );

  setAdsInfo(adsCount);
}

async function onLoadDomContent() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  sendMessageForAdsCount(tabs);
}

// Listener to send message to get Ads count info
window.addEventListener('DOMContentLoaded', onLoadDomContent);

