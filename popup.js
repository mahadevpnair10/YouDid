const statusEl = document.getElementById('status');
const sendMessageButton = document.getElementById('sendMessageButton');
const backgroundButton = document.getElementById('backgroundButton');

sendMessageButton.addEventListener('click', () => {
  setStatus('Sending greeting to active page...');
  chrome.runtime.sendMessage(
    { type: 'GREET_PAGE', text: 'Hello from the extension popup!' },
    (response) => {
      if (chrome.runtime.lastError) {
        setStatus(`Error: ${chrome.runtime.lastError.message}`);
        return;
      }
      setStatus(response?.status || 'Greeting sent to the page.');
    }
  );
});

backgroundButton.addEventListener('click', () => {
  setStatus('Notifying background service worker...');
  chrome.runtime.sendMessage(
    { type: 'LOG_MESSAGE', text: 'Popup requested a background log.' },
    (response) => {
      if (chrome.runtime.lastError) {
        setStatus(`Error: ${chrome.runtime.lastError.message}`);
        return;
      }
      setStatus(response?.status || 'Background event logged.');
    }
  );
});

function setStatus(message) {
  statusEl.textContent = message;
}
