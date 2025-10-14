// background service worker: create context menu and handle selection
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'summarize-this',
    title: 'Summarize This',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if(info.menuItemId === 'summarize-this'){
    const selectedText = info.selectionText || '';
    // store last selection
    try{
      await chrome.storage.local.set({lastSelection: selectedText});
    }catch(e){
      // fallback for callback style
      chrome.storage.local.set({lastSelection: selectedText});
    }
    // Try to open the popup so user sees the result
    if(chrome.action && chrome.action.openPopup){
      try{ chrome.action.openPopup(); }catch(e){}
    }
  }
});