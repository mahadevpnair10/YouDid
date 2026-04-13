console.log('Content script loaded.');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_GREETING') {
    showPageBanner(message.text);
    sendResponse({ status: 'Page received greeting.' });
    return true;
  }

  return false;
});

function showPageBanner(text) {
  const bannerId = 'template-extension-banner';
  let banner = document.getElementById(bannerId);

  if (!banner) {
    banner = document.createElement('div');
    banner.id = bannerId;
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.left = '0';
    banner.style.right = '0';
    banner.style.zIndex = '2147483647';
    banner.style.padding = '12px 16px';
    banner.style.background = 'rgba(37, 99, 235, 0.95)';
    banner.style.color = '#ffffff';
    banner.style.fontFamily = 'Segoe UI, sans-serif';
    banner.style.fontSize = '14px';
    banner.style.display = 'flex';
    banner.style.justifyContent = 'space-between';
    banner.style.alignItems = 'center';
    banner.style.gap = '12px';
    banner.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.2)';

    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.flex = '1';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✕';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.color = '#ffffff';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.addEventListener('click', () => banner.remove());

    banner.appendChild(textSpan);
    banner.appendChild(closeButton);
    document.body.appendChild(banner);
  } else {
    const textSpan = banner.querySelector('span');
    if (textSpan) {
      textSpan.textContent = text;
    }
    banner.style.display = 'flex';
  }

  setTimeout(() => {
    if (banner && banner.parentNode) {
      banner.remove();
    }
  }, 8000);
}
