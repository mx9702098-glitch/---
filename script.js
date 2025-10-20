document.addEventListener('DOMContentLoaded', () => {
    const screen1 = document.getElementById('screen-1');
    const chatHistory = screen1.querySelector('.chat-history');
    const addIcon = screen1.querySelector('.add-icon');
    const actionsMenu = screen1.querySelector('.actions-menu');
    const cameraAction = document.getElementById('action-camera');
    const inputBar = screen1.querySelector('.input-bar input[type="text"]');

    // --- 第一幕: 首页 & 任务创建 ---

    // 1. 点击 '+' 展开/收起菜单
    addIcon.addEventListener('click', () => {
        actionsMenu.classList.toggle('visible');
    });

    // 2. 点击 '相机' 图标
    cameraAction.addEventListener('click', () => {
        // 隐藏菜单
        actionsMenu.classList.remove('visible');
        // 模拟上传图片并进入第二幕
        simulateOcrRecognition();
    });

    function simulateOcrRecognition() {
        // 延迟模拟网络请求和OCR处理
        setTimeout(() => {
            addAssistantMessage(
                "好的，收到了您的图片。这是我识别出的表格字段，请您核对。",
                `
                <div class="gui-card" id="ocr-card">
                    <div class="card-title">
                        <span class="material-icons">warning</span>
                        危房排查登记表
                    </div>
                    <div class="tag-container">
                        <span class="tag">姓名</span>
                        <span class="tag">身份证号</span>
                        <span class="tag">房屋结构</span>
                        <span class="tag">危险等级</span>
                        <span class="tag" id="wrong-tag">排查人前名</span>
                    </div>
                    <button class="btn" id="confirm-ocr-btn">确认无误，创建任务</button>
                </div>
                `
            );
            // 为新生成的按钮和输入框添加事件监听
            setupScreen2Interactions();
        }, 1000);
    }

    // --- 第二幕: OCR识别 & 对话式修正 ---

    function setupScreen2Interactions() {
        const confirmOcrBtn = document.getElementById('confirm-ocr-btn');
        const wrongTag = document.getElementById('wrong-tag');

        // 监听回车键进行修正
        inputBar.addEventListener('keypress', handleCorrection);

        // 点击 "确认无误" 按钮
        confirmOcrBtn.addEventListener('click', () => {
            // 移除修正的监听器，避免重复触发
            inputBar.removeEventListener('keypress', handleCorrection);
            addUserMessage(confirmOcrBtn.textContent); // 将按钮文字作为用户消息
            
            // 清空输入框
            inputBar.value = '';
            
            // 进入第三幕
            initiateTaskDispatch();
        });
    }

    function handleCorrection(event) {
        if (event.key === 'Enter' && inputBar.value.trim() !== '') {
            const userText = inputBar.value.trim();
            addUserMessage(userText);
            inputBar.value = '';

            if (userText.includes("最后一个字段错了") || userText.includes("排查人签名")) {
                // 延迟模拟AI思考
                setTimeout(() => {
                    const wrongTag = document.getElementById('wrong-tag');
                    if(wrongTag) {
                        wrongTag.textContent = '排查人签名';
                        wrongTag.classList.add('highlight');
                        // 移除高亮效果
                        setTimeout(() => wrongTag.classList.remove('highlight'), 1000);
                    }
                    addAssistantMessage("好的，已修正。");
                }, 500);
            }
        }
    }


    // --- 第三幕: 精确分发 ---

    function initiateTaskDispatch() {
        setTimeout(() => {
            addAssistantMessage("任务已创建！现在要通知哪些村民来填写呢？");
            inputBar.addEventListener('keypress', handleDispatch);
        }, 1000);
    }

    function handleDispatch(event) {
        if (event.key === 'Enter' && inputBar.value.trim() !== '') {
            const userText = inputBar.value.trim();
            addUserMessage(userText);
            inputBar.value = '';
            inputBar.removeEventListener('keypress', handleDispatch);

            if (userText.includes("所有户主")) {
                setTimeout(() => {
                    addAssistantMessage(
                        "好的，根据您的要求，已筛选出152位户主。确认无误后即可发送。",
                        `
                        <div class="gui-card confirmation-card">
                            <div class="card-content">
                                <span class="material-icons">groups</span>
                                <p>目标人群：户主 (共152人)</p>
                            </div>
                            <a href="#" class="card-link">查看完整名单</a>
                            <button class="btn" id="send-notification-btn">
                                <span class="material-icons">send</span>
                                立即发送通知
                            </button>
                        </div>
                        `
                    );
                    setupScreen3Interactions();
                }, 1000);
            }
        }
    }
    
    function setupScreen3Interactions() {
        const sendBtn = document.getElementById('send-notification-btn');
        sendBtn.addEventListener('click', () => {
            addUserMessage(sendBtn.textContent.trim());
            showFinalFeedback();
        });
    }


    // --- 第四幕: 完成与反馈 ---

    function showFinalFeedback() {
        setTimeout(() => {
            addAssistantMessage(
                "✅ 成功！通知已发送给152位户主。您可以在任务看板中随时跟踪进度。",
                `
                <div class="gui-card task-progress-card">
                    <h3 class="card-title">危房排查登记表</h3>
                    <div class="status">
                        <span class="material-icons">hourglass_top</span>
                        进行中: 0/152 已完成
                    </div>
                    <button class="btn btn-secondary">进入任务看板</button>
                </div>
                `
            );
        }, 1000);
    }


    // --- 辅助函数 ---

    function addMessage(content, sender) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', `${sender}-message`);
        
        // 如果内容包含HTML，则直接插入
        if (/<[a-z][\s\S]*>/i.test(content)) {
             bubble.innerHTML = content;
        } else {
             bubble.textContent = content;
        }

        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight; // 自动滚动到底部
    }
    
    function addAssistantMessage(text, guiContent = null) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', 'assistant-message');
        
        const textElement = document.createElement('p');
        textElement.textContent = text;
        bubble.appendChild(textElement);

        if (guiContent) {
            const guiElement = document.createElement('div');
            guiElement.innerHTML = guiContent;
            bubble.appendChild(guiElement);
        }

        chatHistory.appendChild(bubble);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function addUserMessage(text) {
        addMessage(text, 'user');
    }
});