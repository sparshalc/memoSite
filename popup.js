document.addEventListener('DOMContentLoaded', function() {
    var saveButton = document.getElementById('saveButton');
    var exportButton = document.getElementById('exportButton');
    var urlInput = document.getElementById('urlInput');
    var urlList = document.getElementById('urlList');
  
    // Load saved URLs from storage
    chrome.storage.sync.get('urls', function(data) {
      if (data.urls) {
        for (var i = 0; i < data.urls.length; i++) {
          var listItem = createListItem(data.urls[i]);
          urlList.appendChild(listItem);
        }
      }
    });
  
    // Save URL
    saveButton.addEventListener('click', function() {
      var url = urlInput.value;
      if (url) {
        chrome.storage.sync.get('urls', function(data) {
          var urls = data.urls || [];
          var currentDate = new Date().toLocaleString();
          var urlData = { url: url, date: currentDate };
          urls.push(urlData);
          chrome.storage.sync.set({ 'urls': urls }, function() {
            var listItem = createListItem(urlData);
            urlList.appendChild(listItem);
          });
        });
        urlInput.value = '';
      }
    });
  
    // Export URLs
    exportButton.addEventListener('click', function() {
      chrome.storage.sync.get('urls', function(data) {
        var urls = data.urls || [];
        var text = '';
        for (var i = 0; i < urls.length; i++) {
          var urlData = urls[i];
          text += urlData.url + ' (' + urlData.date + ')\n';
        }
        var blob = new Blob([text], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
  
        var a = document.createElement('a');
        a.href = url;
        a.download = 'urls.txt';
        a.click();
      });
    });
  
    // Create list item with delete button
    function createListItem(urlData) {
      var listItem = document.createElement('li');
      listItem.textContent = urlData.url + ' (' + urlData.date + ')';
      listItem.setAttribute('data-url', urlData.url);
  
      var deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'deleteButton';
      deleteButton.addEventListener('click', function() {
        var url = listItem.getAttribute('data-url');
        listItem.remove();
        chrome.storage.sync.get('urls', function(data) {
          var urls = data.urls || [];
          var filteredUrls = urls.filter(function(item) {
            return item.url !== url;
          });
          chrome.storage.sync.set({ 'urls': filteredUrls });
        });
      });
  
      listItem.appendChild(deleteButton);
      return listItem;
    }
  });
  