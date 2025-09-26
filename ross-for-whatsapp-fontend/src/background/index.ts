console.log('background is running')
const GOOGLE_ORIGIN = 'whatsapp.com'

// 在后台脚本中监听来自 popup.js 的消息
chrome.runtime.onMessage.addListener((msg, sender: any) => {
  console.log('msg:', msg, 'sender', sender)
  if (msg && msg.type === 'open-sidepanel') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId })
  }
})

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'openSidePanel',
//     title: 'Open side panel',
//     contexts: ['all']
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab:any) => {
//   if (info.menuItemId === 'openSidePanel') {
//     // This will open the panel in all the pages on the current window.
//     chrome.sidePanel.open({ windowId: tab.windowId });
//   }
// });

// click action open sidepanel
// chrome.sidePanel
//   .setPanelBehavior({ openPanelOnActionClick: true })
//   .catch((error) => console.error(error))

// open sidepanel on whatsapp.com
// chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
//   if (!tab.url) return;
//   const url = new URL(tab.url);
//   // Enables the side panel on google.com
//   if (url.hostname.includes(GOOGLE_ORIGIN)) {
//     await chrome.sidePanel.setOptions({
//       tabId,
//       path: 'sidepanel.html',
//       enabled: true
//     });
//   } else {
//     // Disables the side panel on all other sites
//     await chrome.sidePanel.setOptions({
//       tabId,
//       enabled: false
//     });
//   }
// });
