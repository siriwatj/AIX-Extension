// Saves options to chrome.storage
function saveOptions() {
  const type = document.getElementById('type').value;
  const length = document.getElementById('length').value;
  
  chrome.storage.sync.set(
    {
      summarizerType: type,
      summarizerLength: length
    },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    }
  );
}

// Restores select box states using the preferences stored in chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(
    {
      // Default values
      summarizerType: 'tldr',
      summarizerLength: 'short'
    },
    (items) => {
      document.getElementById('type').value = items.summarizerType;
      document.getElementById('length').value = items.summarizerLength;
    }
  );
}

// Add event listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('type').addEventListener('change', saveOptions);
document.getElementById('length').addEventListener('change', saveOptions);