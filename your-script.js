const apiKey = 'YOUR_API_KEY';
const searchUrl = 'https://archive.org/wayback/available?url=';

// Get the input value from the textbox
const inputTextbox = document.getElementById('urlInput');

// Get the display boxes
const currentWebPageBox = document.getElementById('currentWebPage');
const archivedWebPageBox = document.getElementById('archivedWebPage');

// Function to handle the search and display
function searchAndDisplayWebPages() {
  // Get the user input URL
  const targetUrl = inputTextbox.value;

  // Create the request URLs
  const currentWebPageRequestUrl = `${searchUrl}${targetUrl}`;
  const archivedWebPageRequestUrl = `${searchUrl}${targetUrl}&timestamp=${getTimestampTenYearsAgo()}`;

  // Make the AJAX request to the Wayback Machine API for the current web page
  $.ajax({
    url: currentWebPageRequestUrl,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Authorization': `LOW ${apiKey}`
    },
    success: function (response) {
      if (response && response.archived_snapshots && response.archived_snapshots.closest) {
        const closest = response.archived_snapshots.closest;
        let snapshotUrl = closest.url;
        snapshotUrl = snapshotUrl.replace(/^http:/, 'https:');  // replace http with https
    
        const iframe = document.createElement('iframe');
        iframe.src = snapshotUrl;
        currentWebPageBox.innerHTML = '';
        currentWebPageBox.appendChild(iframe);
      } else {
        currentWebPageBox.innerHTML = 'No archived snapshots found for the current web page.';
      }
    },
    
    error: function (error) {
      console.log('Error:', error);
    }
  });

  // Make the AJAX request to the Wayback Machine API for the archived web page
  $.ajax({
    url: archivedWebPageRequestUrl,
    method: 'GET',
    dataType: 'json',
    headers: {
      'Authorization': `LOW ${apiKey}`
    },
    success: function (response) {
      // Check if the response contains an archived snapshot
      if (response && response.archived_snapshots && response.archived_snapshots.closest) {
        const closest = response.archived_snapshots.closest;
        let snapshotUrl = closest.url;
        snapshotUrl = snapshotUrl.replace(/^http:/, 'https:');  // replace http with https
    
        // Display the snapshot of the archived web page
        const iframe = document.createElement('iframe');
        iframe.src = snapshotUrl;
        archivedWebPageBox.innerHTML = '';
        archivedWebPageBox.appendChild(iframe);
      } else {
        archivedWebPageBox.innerHTML = 'No archived snapshots found for the archived web page.';
      }
    },
    
    error: function (error) {
      console.log('Error:', error);
    }
  });
}

// Helper function to get the timestamp of the date 10 years ago in the format YYYYMMDD
function getTimestampTenYearsAgo() {
  const currentDate = new Date();
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);
  const year = tenYearsAgo.getFullYear();
  const month = String(tenYearsAgo.getMonth() + 1).padStart(2, '0');
  const day = String(tenYearsAgo.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Attach an event listener to trigger the search and display when the button is clicked
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchAndDisplayWebPages);

