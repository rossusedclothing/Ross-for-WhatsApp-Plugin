console.info('contentScript is running')

// Avoid duplicate injections when HMR or site re-renders
const INJECTED_TOP_TABS_ID = 'crx-injected-top-tabs';
const INJECTED_RIGHT_SIDEBAR_ID = 'crx-injected-right-sidebar';
const INJECTED_STYLE_ID = 'crx-injected-style';

function ensureStyleElement(): void {
	if (document.getElementById(INJECTED_STYLE_ID)) {
		return;
	}
	const styleElement = document.createElement('style');
	styleElement.id = INJECTED_STYLE_ID;
	styleElement.textContent = `
		/* Top Tabs Bar */
		#${INJECTED_TOP_TABS_ID} {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			height: 40px;
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 0 12px;
			background: rgba(28, 28, 28, 0.92);
			backdrop-filter: blur(6px);
			color: #fff;
			z-index: 2147483646; /* below sidebar */
			user-select: none;
			box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.25);
		}
		#${INJECTED_TOP_TABS_ID} .crx-tab-button {
			height: 26px;
			padding: 0 10px;
			border-radius: 6px;
			border: 1px solid rgba(255,255,255,0.12);
			background: rgba(255,255,255,0.06);
			color: #fff;
			font-size: 12px;
			cursor: pointer;
			transition: all 0.15s ease;
		}
		#${INJECTED_TOP_TABS_ID} .crx-tab-button:hover {
			background: rgba(255,255,255,0.12);
		}
		#${INJECTED_TOP_TABS_ID} .crx-tab-button.active {
			background: #00a884;
			border-color: #00a884;
		}

		/* Right Sidebar */
		#${INJECTED_RIGHT_SIDEBAR_ID} {
			position: fixed;
			top: 40px; /* below tabs */
			right: 0;
			bottom: 0;
			width: 360px;
			max-width: 75vw;
			background: #111b21; /* WhatsApp dark bg-ish */
			color: #e9edef;
			box-shadow: 0 0 0 1px rgba(255,255,255,0.06), -12px 0 24px rgba(0,0,0,0.35);
			transform: translateX(100%);
			transition: transform 0.2s ease;
			z-index: 2147483647; /* on top */
			display: flex;
			flex-direction: column;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID}.open {
			transform: translateX(0%);
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-sidebar-header {
			height: 44px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 12px;
			border-bottom: 1px solid rgba(255,255,255,0.06);
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-sidebar-content {
			flex: 1;
			overflow: auto;
			padding: 12px;
		}
		/* Accordion list */
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-item {
			border: 1px solid rgba(255,255,255,0.08);
			border-radius: 8px;
			background: rgba(255,255,255,0.03);
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 12px;
			cursor: pointer;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-title {
			font-size: 13px;
			font-weight: 600;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-toggle {
			font-size: 12px;
			opacity: 0.85;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-panel {
			padding: 10px 12px;
			border-top: 1px solid rgba(255,255,255,0.06);
			display: none;
			font-size: 12px;
			color: #c6d1d5;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-acc-item.open .crx-acc-panel {
			display: block;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-close-btn {
			border: none;
			background: transparent;
			color: #e9edef;
			cursor: pointer;
			font-size: 13px;
			padding: 6px 8px;
			border-radius: 6px;
		}
		#${INJECTED_RIGHT_SIDEBAR_ID} .crx-close-btn:hover {
			background: rgba(255,255,255,0.08);
		}
	`;
	document.head.appendChild(styleElement);
}

function createTopTabs(): HTMLElement {
	const existing = document.getElementById(INJECTED_TOP_TABS_ID);
	if (existing) {
		return existing;
	}
	const container = document.createElement('div');
	container.id = INJECTED_TOP_TABS_ID;

	const tabs: Array<{ key: string; label: string }> = [
		{ key: 'overview', label: '总览' },
		{ key: 'contacts', label: '联系人' },
		{ key: 'automation', label: '自动化' },
		{ key: 'settings', label: '设置' },
	];

	tabs.forEach((tab, index) => {
		const button = document.createElement('button');
		button.className = 'crx-tab-button' + (index === 0 ? ' active' : '');
		button.dataset.key = tab.key;
		button.textContent = tab.label;
		button.addEventListener('click', () => {
			// Switch active style
			Array.from(container.querySelectorAll('.crx-tab-button')).forEach((el) => {
				el.classList.remove('active');
			});
			button.classList.add('active');
			// Open sidebar on any tab click and render content
			renderSidebarContent(tab.key);
			openSidebar();
		});
		container.appendChild(button);
	});

	document.documentElement.appendChild(container);
	return container;
}

function createRightSidebar(): HTMLElement {
	const existing = document.getElementById(INJECTED_RIGHT_SIDEBAR_ID);
	if (existing) {
		return existing;
	}
	const sidebar = document.createElement('aside');
	sidebar.id = INJECTED_RIGHT_SIDEBAR_ID;

	const header = document.createElement('div');
	header.className = 'crx-sidebar-header';
	const title = document.createElement('div');
	title.textContent = '助手侧栏';
	const closeBtn = document.createElement('button');
	closeBtn.className = 'crx-close-btn';
	closeBtn.textContent = '收起';
	closeBtn.addEventListener('click', () => closeSidebar());
	header.appendChild(title);
	header.appendChild(closeBtn);

	const content = document.createElement('div');
	content.className = 'crx-sidebar-content';
	content.dataset.content = 'overview';
	content.textContent = '加载中...';

	sidebar.appendChild(header);
	sidebar.appendChild(content);

	document.documentElement.appendChild(sidebar);
	return sidebar;
}

function openSidebar(): void {
	const sidebar = createRightSidebar();
	if (!sidebar.classList.contains('open')) {
		sidebar.classList.add('open');
	}
}

function closeSidebar(): void {
	const sidebar = createRightSidebar();
	sidebar.classList.remove('open');
}

function renderSidebarContent(key: string): void {
	const sidebar = createRightSidebar();
	const content = sidebar.querySelector('.crx-sidebar-content') as HTMLElement | null;
	if (!content) return;
	content.dataset.content = key;
	switch (key) {
		case 'overview':
			content.innerHTML = `
				<h3>总览</h3>
				<div class="crx-acc" id="crx-feature-list">
					<div class="crx-acc-item" data-key="msg-broadcast">
						<div class="crx-acc-header">
							<div class="crx-acc-title">消息群发</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="export-contacts">
						<div class="crx-acc-header">
							<div class="crx-acc-title">导出联系人</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="number-verification">
						<div class="crx-acc-header">
							<div class="crx-acc-title">号码验证</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="translate-support">
						<div class="crx-acc-header">
							<div class="crx-acc-title">支持翻译</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="quick-replies">
						<div class="crx-acc-header">
							<div class="crx-acc-title">常用语快速回复</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="message-backup">
						<div class="crx-acc-header">
							<div class="crx-acc-title">消息备份</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="auto-reply">
						<div class="crx-acc-header">
							<div class="crx-acc-title">自动回复</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="phrase-analysis">
						<div class="crx-acc-header">
							<div class="crx-acc-title">用语分析</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
					<div class="crx-acc-item" data-key="customer-tags">
						<div class="crx-acc-header">
							<div class="crx-acc-title">客户标签</div>
							<div class="crx-acc-toggle">展开</div>
						</div>
						<div class="crx-acc-panel">点击时仅打印日志，不实现业务逻辑。</div>
					</div>
				</div>
			`;
			attachAccordionHandlers(content);
			break;
		case 'contacts':
			content.innerHTML = '<h3>联系人</h3><p>在此读取/管理联系人（示例）。</p>';
			break;
		case 'automation':
			content.innerHTML = '<h3>自动化</h3><p>配置自动发送、批量处理等（示例）。</p>';
			break;
		case 'settings':
			content.innerHTML = '<h3>设置</h3><p>扩展设置入口（示例）。</p>';
			break;
		default:
			content.textContent = '未知 Tab';
	}
}

function initialize(): void {
	ensureStyleElement();
	createTopTabs();
	createRightSidebar();
	// Default state: tabs injected, sidebar closed until a tab is clicked
	closeSidebar();
}

function onReady(callback: () => void): void {
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		callback();
		return;
	}
	document.addEventListener('DOMContentLoaded', callback, { once: true });
}

onReady(initialize);

function attachAccordionHandlers(root: HTMLElement): void {
	// Delegate clicks for headers
	root.addEventListener('click', (event) => {
		const header = (event.target as HTMLElement).closest('.crx-acc-header') as HTMLElement | null;
		if (!header) return;
		const item = header.closest('.crx-acc-item') as HTMLElement | null;
		if (!item) return;
		const key = item.getAttribute('data-key') || 'unknown';
		const open = item.classList.toggle('open');
		const toggle = header.querySelector('.crx-acc-toggle') as HTMLElement | null;
		if (toggle) toggle.textContent = open ? '收起' : '展开';
		console.info('[CRX] Accordion click:', key, 'open=', open);
	});
}
