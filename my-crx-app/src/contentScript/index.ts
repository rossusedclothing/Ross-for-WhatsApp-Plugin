import { initializeUI, renderSidebarContent, closeSidebar } from './ui';
import './content.css';

console.info('contentScript is running')


// 等待WhatsApp主界面加载完成
function waitForWhatsAppMainPage() {
    return new Promise<void>((resolve) => {
      // 检查是否存在WhatsApp主界面的标志性元素
      const isMainPageLoaded = () => {
        // WhatsApp Web主界面通常包含以下元素之一:
        // 1. 聊天面板 (例如包含[data-testid="chat-list"]的元素)
        // 2. 导航栏 (例如包含[data-testid="navbar"]的元素)
        // 3. 应用容器 (例如包含#app的元素，且其内部有实际内容)
        const appElement = document.getElementById('app');
        if (!appElement) return false;
        
        // 检查app元素是否包含实际内容(而不是登录页面)
        const chatList = appElement.querySelector('[data-testid="chat-list"]');
        const navbar = appElement.querySelector('[data-testid="navbar"]');
        const mainPageElements = appElement.querySelectorAll('._aigs, ._ak_k, ._aigv'); // WhatsApp Web的一些主界面类名
        
        return chatList || navbar || mainPageElements.length > 0;
      };
      
      // 如果已经加载完成，直接resolve
      if (isMainPageLoaded()) {
        resolve();
        return;
      }
      
      // 否则，定期检查直到加载完成
      const interval = setInterval(() => {
        if (isMainPageLoaded()) {
          clearInterval(interval);
          resolve();
        }
      }, 1000); // 每秒检查一次
    });
  }


function initialize(): void {
        initializeUI();
        closeSidebar();
        renderSidebarContent('overview');
}

function onReady(callback: () => void): void {
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		callback();
		return;
	}
	document.addEventListener('DOMContentLoaded', callback, { once: true });
}

onReady(initialize);
