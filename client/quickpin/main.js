function snapIt(info, tab) {
    // chrome.extension.getBackgroundPage().console.log(chrome.cookies.getAll());
    var emailAddress = '';
    chrome.cookies.getAll({domain: "localhost", name: 'snapit'}, function(cookies){
      console.log(cookies[0].value);
      if (cookies !== []) {
        emailAddress = cookies[0].value;
        emailAddress = emailAddress.replace(/%22/g, '');
      } 
    //chrome.extension.getBackgroundPage().console.log(cookies);
    });

    chrome.tabs.sendMessage(tab.id, {method: "getSelection"}, function () {
      var description = tab.title.substr(0, 500);
      var sUrl = info.srcUrl;
      var server = 'http://localhost:9000';

      if (info.selectionText) {
        // The user selected some text, put this in the message.
        var url = server + "/api/things/?media=" + 
          "&url=" + encodeURIComponent(tab.url) +
          "&title=" + encodeURIComponent(tab.title) +
          "&description=" + encodeURI(info.selectionText) +
          "&mediaType=selection" +
          "&emailAddress=" + emailAddress;
      } else if (info.mediaType === 'image') {
        //use right clicked on an image
        var url = server + "/api/things/?media=" + encodeURIComponent(sUrl) + 
          "&url=" + encodeURIComponent(tab.url) +
          "&title=" + encodeURIComponent(tab.title) +
          "&description=" + encodeURIComponent(description) +
          "&mediaType=image" +
          "&emailAddress=" + emailAddress;
      } else if (info.mediaType === 'video') {
        //user right clicked on a video
        var url = server + "/api/things/?media=" + encodeURIComponent(sUrl) + 
        "&url=" + encodeURIComponent(tab.url) +
        "&title=" + encodeURIComponent(tab.title) +
        "&description=" + encodeURIComponent(description) +
        "&mediaType=video" +
        "&emailAddress=" + emailAddress;
      } else if (info.linkUrl) {
        var url = server + "/api/things/?media=" + encodeURIComponent(info.linkUrl) +
        "&url=" + encodeURIComponent(tab.url) +
        "&title=" + encodeURIComponent(tab.title) +
        "&mediaType=links" +
        "&emailAddress=" + emailAddress;
      } else if (info.mediaType === 'audio') {
        var url = server + "/api/things/?media=" +
        "&url=" + encodeURIComponent(tab.url) +
        "&title=" + encodeURIComponent(tab.title) +
        "&mediaType=audio" +
        "&emailAddress=" + emailAddress;
      } else if (info.pageUrl) {
        var url = server + "/api/things/?media=" +
        "&url=" + encodeURIComponent(tab.url) +
        "&title=" + encodeURIComponent(tab.title) +
        "&mediaType=page" +
        "&emailAddress=" + emailAddress;
      } else {
        var url = server + "/api/things/?media=" +
        "&url=" + encodeURIComponent(tab.url) +
        "&title=" + encodeURIComponent(tab.title) +
        "&mediaType=other" +
        "&emailAddress=" + emailAddress;
      }
      

        chrome.windows.create({
            url: url,
            type: "popup",
            width: 600,
            height: 300
        });
    });
}
chrome.contextMenus.create({
    title: "SnapIt!",
    contexts: ["image", "video", "link", "selection", "page", "audio" ], 
    onclick: snapIt
});
