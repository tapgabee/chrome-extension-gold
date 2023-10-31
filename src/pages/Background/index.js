import numeral from 'numeral';

console.log('This is the background page.');
console.log('Put the background scripts here.');

function fetchDataAndSetBadge() {
  // Fetch data here, e.g., using the fetch API
  fetch('https://gold-api-wheat.vercel.app/api/gold-data')
    .then((response) => response.json())
    .then((data) => {
      // Update the badge with the fetched data.
      const goldPrices = data.goldPrices;
      const goldOrnament = goldPrices?.find((d) => d.title === 'ทองรูปพรรณ');
      if (goldOrnament?.data2) {
        chrome.action.setBadgeText({
          text: numeral(goldOrnament?.data2).format('0.0a', Math.floor),
        });
        chrome.action.setBadgeBackgroundColor({ color: '#ffdb19' });
      }
    })
    .catch((error) => console.error('Error fetching data: ' + error));
}

// Set up an alarm to periodically fetch data
chrome.alarms.create('fetchDataAlarm', {
  delayInMinutes: 30, // Adjust this to your preferred fetch interval
  periodInMinutes: 30,
});

// Listen for the alarm to trigger and fetch data
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchDataAlarm') {
    fetchDataAndSetBadge();
  }
});

// Initial fetch and badge update on extension load
fetchDataAndSetBadge();
