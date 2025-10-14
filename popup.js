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
                        length: "short",
                        format: "plain-text"
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
    statusEl.textContent = 'Copied';
    setTimeout(()=> statusEl.textContent = 'Ready', 1200);
  }catch(e){
    statusEl.textContent = 'Copy failed';
  }
});


