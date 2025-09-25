export const INJECTED_TOP_TABS_ID = 'crx-injected-top-tabs';
export const INJECTED_RIGHT_SIDEBAR_ID = 'crx-injected-right-sidebar';

export function createTopTabs(renderSidebarContent: (key: string) => void, openSidebar: () => void): HTMLElement {
	const existing = document.getElementById(INJECTED_TOP_TABS_ID);
	if (existing) return existing;
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
			Array.from(container.querySelectorAll('.crx-tab-button')).forEach((el) => el.classList.remove('active'));
			button.classList.add('active');
			renderSidebarContent(tab.key);
			openSidebar();
		});
		
		container.appendChild(button);
	});
	const appElement: HTMLElement | null = document.getElementById('app');
	if (appElement != null) {
		// 在第一个元素之前插入
		appElement.insertBefore(container, appElement.firstChild);
	 
	}else{
		document.documentElement.appendChild(container);
	}
	return container;
}

export function createRightSidebar(): HTMLElement {
	const existing = document.getElementById(INJECTED_RIGHT_SIDEBAR_ID);
	if (existing) return existing;
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

export function openSidebar(): void {
	const sidebar = createRightSidebar();
	if (!sidebar.classList.contains('open')) sidebar.classList.add('open');
}

export function closeSidebar(): void {
	const sidebar = createRightSidebar();
	sidebar.classList.remove('open');
}

export function renderSidebarContent(key: string): void {
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
							<div class="crx-acc-title">翻译配置</div>
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

export function attachAccordionHandlers(root: HTMLElement): void {
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

export function initializeUI(): void {
	createTopTabs(renderSidebarContent, openSidebar);
	createRightSidebar();
}

