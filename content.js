
function injectQRCodeButtonIntoPlayer() {
 
  if (document.getElementById('qr-code-player-button')) return;

  
  const playerControls = document.querySelector('.ytp-right-controls');

  if (playerControls) {
    
    const button = document.createElement('button');
    button.id = 'qr-code-player-button';
    button.className = 'ytp-button';
    button.title = 'Generate QR Code';
  
    button.innerHTML = `
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z" fill="#FFFFFF"/>
        <path d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z" fill="#FFFFFF"/>
        <path d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z" fill="#FFFFFF"/>
        <path d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z" fill="#FFFFFF"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z" fill="#FFFFFF"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z" fill="#FFFFFF"/>
        <path d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z" fill="#FFFFFF"/>
        <path d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z" fill="#FFFFFF"/>
        <path d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z" fill="#FFFFFF"/>
        <path d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z" fill="#FFFFFF"/>
      </svg>
    `;
    button.addEventListener('click', generateAndDisplayQRCode);

    
    playerControls.insertBefore(button, playerControls.firstChild);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showQRCodeOverlay') {
    generateAndDisplayQRCode();
  }
});

function generateAndDisplayQRCode() {
  let qrCodeContainer = document.getElementById('qr-code-container');

  if (qrCodeContainer) {
    if (qrCodeContainer.classList.contains('active')) {
      closeQRCodeOverlay();
    }
    return;
  }

 
  const videoElement = document.querySelector('video');
  const url = new URL(window.location.href);
  if (videoElement) {
    if (videoElement.ended || videoElement.currentTime >= videoElement.duration) {
      url.searchParams.delete('t');
    } else {
      const currentTime = Math.floor(videoElement.currentTime);
      url.searchParams.set('t', currentTime);
    }
  } else {
    url.searchParams.delete('t');
  }

  const videoId = url.searchParams.get('v');
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const videoTitle = getVideoTitle();

  qrCodeContainer = document.createElement('div');
  qrCodeContainer.id = 'qr-code-container';

  const contentWrapper = document.createElement('div');
  contentWrapper.id = 'qr-code-content';

  const headerBar = document.createElement('div');
  headerBar.id = 'qr-code-header';

  const headerText = document.createElement('div');
  headerText.id = 'qr-code-header-text';
  headerText.textContent = 'Continue watching this video from where you are leaving off!';

  const closeButton = document.createElement('button');
  closeButton.id = 'qr-code-close-button';
  closeButton.title = 'Close';
  closeButton.innerHTML = '&times;';

  headerBar.appendChild(headerText);
  headerBar.appendChild(closeButton);

  const mainContent = document.createElement('div');
  mainContent.id = 'qr-code-main-content';

  const leftSection = document.createElement('div');
  leftSection.id = 'qr-code-left';

  const thumbnailImg = document.createElement('img');
  thumbnailImg.id = 'qr-code-thumbnail';
  thumbnailImg.src = thumbnailUrl;
  thumbnailImg.alt = 'Video Thumbnail';

  const titleDiv = document.createElement('div');
  titleDiv.id = 'qr-code-title';
  titleDiv.textContent = videoTitle;

  leftSection.appendChild(thumbnailImg);
  leftSection.appendChild(titleDiv);

  const rightSection = document.createElement('div');
  rightSection.id = 'qr-code-right';

  const qrCodeDiv = document.createElement('div');
  qrCodeDiv.id = 'qr-code';

  rightSection.appendChild(qrCodeDiv);

  mainContent.appendChild(leftSection);
  mainContent.appendChild(rightSection);

  contentWrapper.appendChild(headerBar);
  contentWrapper.appendChild(mainContent);

  qrCodeContainer.appendChild(contentWrapper);

  document.body.appendChild(qrCodeContainer);


  new QRCode(qrCodeDiv, {
    text: url.toString(),
    width: 150,
    height: 150,
  });

  void qrCodeContainer.offsetWidth;
  qrCodeContainer.classList.add('active');

  qrCodeContainer.addEventListener('click', function (e) {
    if (e.target === qrCodeContainer) {
      closeQRCodeOverlay();
    }
  });

  closeButton.addEventListener('click', function (e) {
    e.stopPropagation();
    closeQRCodeOverlay();
  });
}

function closeQRCodeOverlay() {
  const qrCodeContainer = document.getElementById('qr-code-container');
  if (qrCodeContainer) {
    qrCodeContainer.classList.remove('active');
    qrCodeContainer.addEventListener('transitionend', function handler(event) {
      if (event.propertyName === 'opacity') {
        qrCodeContainer.removeEventListener('transitionend', handler);
        qrCodeContainer.remove();
      }
    });
  }
}

function getVideoTitle() {
  let videoTitleElement =
    document.querySelector('h1.title yt-formatted-string') ||
    document.querySelector('h1.title') ||
    document.querySelector('h1 > yt-formatted-string') ||
    document.querySelector('h1');

  let videoTitle = videoTitleElement ? videoTitleElement.textContent.trim() : null;

  if (!videoTitle || videoTitle === '') {
    videoTitle = document.title.replace(/ - YouTube.*$/, '').trim();
  }

  return videoTitle;
}

const playerObserver = new MutationObserver(() => {
  injectQRCodeButtonIntoPlayer();
});

playerObserver.observe(document.body, { childList: true, subtree: true });

injectQRCodeButtonIntoPlayer();
