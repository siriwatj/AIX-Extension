const statusEl = document.getElementById('status');
const extractBtn = document.getElementById('extract');
const resultEl = document.getElementById('result');
const resultContainer = document.getElementById('resultContainer');
const copyBtn = document.getElementById('copy');

async function initializeSummarizer() {
  //const availability = await Summarizer.availability();
  const summarizer = await Summarizer.create({
                        type: "headline",
                        outputLanguage: "en",
                        length: "short"
                      });
  return summarizer;
}

// On popup open, load any last selection saved by the context menu
chrome.storage.local.get(['lastSelection'], async (items) => {
  const last = items?.lastSelection || '';
  if(last && last.trim()){
    // const first10 = firstNWords(last, 10);
    const sumText = await summarizeThis(last);
    resultEl.textContent = sumText || '[No selection found]';
    resultContainer.classList.remove('hidden');
    statusEl.textContent = 'Loaded last selection';
  }
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
function firstNWords(text, n){
  if(!text) return '';
  // Normalize whitespace and split
  const words = text.replace(/\s+/g,' ').trim().split(' ');
  return words.slice(0, n).join(' ');
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

extractBtn.addEventListener('click', async () => {
  statusEl.textContent = 'Getting selection...';
  resultContainer.classList.add('hidden');
  resultEl.textContent = '';
  try{
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    const selected = await getSelectionFromPage(tab.id);
    const first10 = firstNWords(selected, 10);
    // resultEl.textContent = first10 || '[No selection found]';
    resultEl.textContent = 'xxx' || '[No selection found]';
    resultContainer.classList.remove('hidden');
    statusEl.textContent = 'Done';
  }catch(err){
    statusEl.textContent = 'Error: ' + err.message;
  }
});

copyBtn.addEventListener('click', async () => {
  const txt = resultEl.textContent;
  if(!txt) return;
  try{
    await navigator.clipboard.writeText(txt);
    statusEl.textContent = 'Copied';
    setTimeout(()=> statusEl.textContent = 'Ready', 1200);
  }catch(e){
    statusEl.textContent = 'Copy failed';
  }
});


