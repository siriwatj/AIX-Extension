const statusEl = document.getElementById('status');
const extractBtn = document.getElementById('extract');
const resultEl = document.getElementById('result');
const resultContainer = document.getElementById('resultContainer');
const loadingContainer = document.getElementById('loadingContainer');
const copyBtn = document.getElementById('copy');

function showLoading() {
  loadingContainer.classList.remove('hidden');
  resultContainer.classList.add('hidden');
}

function hideLoading() {
  loadingContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
}

async function initializeSummarizer() {
  //const availability = await Summarizer.availability();
  const options = await chrome.storage.sync.get({
    // Default values
    summarizerType: 'tldr',
    summarizerLength: 'short'
  });

  // Update the title based on the type and length
  const titleMap = {
    'tldr': 'TL;DR',
    'teaser': 'Teaser',
    'key-points': 'Key Points',
    'headline': 'Headline'
  };
  const lengthMap = {
    'short': 'Short',
    'medium': 'Medium',
    'long': 'Long'
  };
  const typeTitle = titleMap[options.summarizerType] || 'TL;DR';
  const lengthTitle = lengthMap[options.summarizerLength] || 'Short';
  document.querySelector('#resultContainer h2').textContent = `${typeTitle} (${lengthTitle})`;

  const summarizer = await Summarizer.create({
    type: options.summarizerType,
    outputLanguage: "en",
    length: options.summarizerLength,
    format: "plain-text" // Always use plain-text format
  });
  return summarizer;
}

// On popup open, get current selection and summarize
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];
  if (!tab) return;

  // Try getting current selection first
  const selection = await getSelectionFromPage(tab.id);
  if (selection && selection.trim()) {
    showLoading();
    const sumText = await summarizeThis(selection);
    const sumTextwithURL = sumText + '\n\nSource: ' + tab.url;
    resultEl.textContent = sumTextwithURL;
    hideLoading();
    return;
  }

  // If no selection, show instructions
  resultEl.innerHTML = '<h3>[No selection found]</h3>';
  resultEl.innerHTML += '<p>Select text on the page and reopen the popup to summarize.</p>';
  resultContainer.classList.remove('hidden');
  
  //hidecopybutton
  copyBtn.style.display = 'none';

});

async function summarizeThis(text) {
  try {
    const summarizer = await initializeSummarizer();
    if (summarizer) {
      const summary = await summarizer.summarize(text);
      return summary;
    }
    return '[Unable to initialize summarizer]';
  } catch (error) {
    console.error('Summarization error:', error);
    return '[Error summarizing text]';
  }
}

// Gets selection from page; fallbacks: active element value or placeholder
async function getSelectionFromPage(tabId){
  try{
    const results = await chrome.scripting.executeScript({
      target: {tabId},
      func: () => {
        const sel = window.getSelection().toString();
        if(sel && sel.trim()) return sel;
        // If selection empty, try focused input/textarea
        const active = document.activeElement;
        if(active){
          if(active.tagName === 'TEXTAREA' || (active.tagName === 'INPUT' && /text|search|email|url|tel/.test(active.type))){
            return active.value || '';
          }
        }
        // Try common editors (contenteditable)
        const ced = document.querySelector('[contenteditable]');
        if(ced) return ced.innerText || '';
        return '';
      }
    });
    return results && results[0] && results[0].result ? results[0].result : '';
  }catch(e){
    return '';
  }
}

copyBtn.addEventListener('click', async () => {
  const txt = resultEl.textContent;
  if(!txt) return;
  try{
    await navigator.clipboard.writeText(txt);
    statusEl.innerHTML = 'Copied - <a href="https://aqua-linet-16.tiiny.site" target="_blank" rel="noopener noreferrer">Buy me a Coffee.</a>';
    setTimeout(()=> statusEl.textContent = 'Ready', 4800);
  }catch(e){
    statusEl.textContent = 'Copy failed';
  }
});


