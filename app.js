// 模拟数据
let tasks = [
    {
        id: '1',
        title: '2024年第一季度村民信息统计表',
        status: 'unsynced',
        createDate: '2024-10-10',
        creator: '张村长',
        synced: false,
        ocrData: [
            { name: '张三', phone: '13812345678', address: '村东组15号', idCard: '320123199001011234' },
            { name: '李四', phone: '13987654321', address: '村西组8号', idCard: '320123199002022345' },
            { name: '王五', phone: '13765432109', address: '村南组22号', idCard: '320123199003033456' }
        ]
    },
    {
        id: '2',
        title: '党建活动参与人员登记表',
        status: 'synced',
        createDate: '2024-10-08',
        creator: '李书记',
        synced: true,
        ocrData: [
            { name: '赵六', phone: '13654321098', address: '村北组5号', idCard: '320123199004044567' },
            { name: '钱七', phone: '13543210987', address: '村中组12号', idCard: '320123199005055678' }
        ]
    },
    {
        id: '3',
        title: '土地确权信息核实表',
        status: 'unsynced',
        createDate: '2024-10-12',
        creator: '王主任',
        synced: false,
        ocrData: [
            { name: '孙八', phone: '13432109876', address: '村东组28号', idCard: '320123199006066789', landArea: '2.5亩' },
            { name: '周九', phone: '13321098765', address: '村西组16号', idCard: '320123199007077890', landArea: '1.8亩' }
        ]
    }
];



/**
 * 埋点：统一事件记录（本地模拟，可替换为真实SDK/上报接口）
 */
function trackEvent({
    event_name,
    task_id = null,
    villager_id = null,
    action_type = null,
    result = 'success',
    error_message = ''
} = {}) {
    try {
        const payload = {
            user_id: 'demo_user_001',
            event_name,
            timestamp: new Date().toISOString(),
            task_id,
            villager_id,
            action_type,
            result,
            error_message
        };
        console.log('[analytics]', payload);
        const key = 'analytics_events';
        const arr = JSON.parse(localStorage.getItem(key) || '[]');
        arr.push(payload);
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
        console.warn('trackEvent error', e);
    }
}

// 页面导航函数
function goToSmartCollection() {
    trackEvent({ event_name: 'enter_smart_collection' });
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('smartCollectionPage').classList.remove('hidden');
    
    // 添加淡入动画
    setTimeout(() => {
        document.getElementById('smartCollectionPage').classList.add('fade-in', 'active');
    }, 10);
    
    // 初始化任务列表
    renderTaskList();
}

function goToHome() {
    document.getElementById('smartCollectionPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
}

// Tab 切换 - 只保留历史表格
document.getElementById('historyTab').addEventListener('click', function() {
    switchTab('history');
});

function switchTab(tab) {
    const historyTab = document.getElementById('historyTab');
    const historyContent = document.getElementById('historyContent');

    // 只处理历史表格tab
    if (tab === 'history') {
        historyTab.classList.add('tab-active');
        historyTab.classList.remove('text-gray-500');
        
        historyContent.classList.remove('hidden');
        
        renderTaskList();
    }
}

// 渲染任务列表
function renderTaskList() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

// 创建任务卡片
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg card-shadow p-4 fade-in';
    
    const statusClass = `status-${task.status}`;
    const statusText = getStatusText(task.status);
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800 mb-1">${task.title}</h4>
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span><i class="fas fa-calendar-alt mr-1"></i>${task.createDate}</span>
                    <span><i class="fas fa-user mr-1"></i>${task.creator}</span>
                </div>
            </div>
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
        <div class="flex items-center justify-between">
            <button onclick="viewTaskDetail('${task.id}')" class="text-blue-600 text-sm font-medium hover:text-blue-700">
                <i class="fas fa-eye mr-1"></i>查看数据
            </button>
            <div class="flex items-center space-x-2">
                <button onclick="exportTask('${task.id}')" class="text-gray-600 hover:text-gray-700 p-2" title="导出表格">
                    <i class="fas fa-download"></i>
                </button>
                
                ${task.status === 'unsynced' ? 
                    `<button onclick="openArchiveFromList('${task.id}')" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 shadow-md transform hover:scale-105 transition-all duration-200">
                        <i class="fas fa-archive mr-1"></i>我要归档
                    </button>` :
                    `<button class="bg-gray-300 text-gray-500 px-3 py-1 rounded text-sm cursor-not-allowed">
                        已归档
                    </button>`
                }
            </div>
        </div>
    `;
    
    // 添加动画
    setTimeout(() => {
        card.classList.add('active');
    }, 100);
    
    return card;
}



// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'unsynced': '进行中',
        'synced': '已归档'
    };
    return statusMap[status] || status;
}

// 显示导入对话框
function showImportDialog() {
    document.getElementById('importDialog').classList.remove('hidden');
}

// 关闭导入对话框
function closeImportDialog() {
    document.getElementById('importDialog').classList.add('hidden');
    // 重置标题识别区域
    document.getElementById('titleRecognitionArea').classList.add('hidden');
    document.getElementById('recognizedTitle').value = '';
}

// 显示标题识别结果
function showTitleRecognition(title, source) {
    const titleInput = document.getElementById('recognizedTitle');
    const titleArea = document.getElementById('titleRecognitionArea');
    
    // 设置识别的标题
    titleInput.value = title;
    
    // 存储当前的导入源和OCR数据
    window.currentImportSource = source;
    window.currentOCRData = generateMockOCRData(source);
    
    // 显示标题识别区域
    titleArea.classList.remove('hidden');
    
    // 添加淡入动画
    setTimeout(() => {
        titleArea.style.opacity = '0';
        titleArea.style.transform = 'translateY(10px)';
        titleArea.style.transition = 'all 0.3s ease-in-out';
        
        setTimeout(() => {
            titleArea.style.opacity = '1';
            titleArea.style.transform = 'translateY(0)';
        }, 10);
    }, 10);
}

// 生成模拟OCR数据
function generateMockOCRData(source) {
    if (source === 'photo') {
        return [
            { name: '新村民A', phone: '13800138000', address: '新地址1号', idCard: '320123199008088901' },
            { name: '新村民B', phone: '13900139000', address: '新地址2号', idCard: '320123199009099012' },
            { name: '新村民C', phone: '13700137000', address: '新地址3号', idCard: '320123199010100123' }
        ];
    } else if (source === 'wechat') {
        return [
            { name: '微信用户A', phone: '13600136000', address: '微信地址1号', idCard: '320123199011111234' },
            { name: '微信用户B', phone: '13500135000', address: '微信地址2号', idCard: '320123199012122345' }
        ];
    }
    return [];
}

// 确认创建任务
function confirmCreateTask() {
    const titleInput = document.getElementById('recognizedTitle');
    const title = titleInput.value.trim();
    
    if (!title) {
        showToast('请输入任务标题');
        return;
    }
    
    // 创建新任务
    const newTask = {
        id: Date.now().toString(),
        title: title,
        status: 'unsynced',
        createDate: new Date().toISOString().split('T')[0],
        creator: '张村长',
        synced: false,
        ocrData: window.currentOCRData || []
    };
    
    tasks.unshift(newTask);
    trackEvent({ event_name: 'task_created', task_id: newTask.id, action_type: window.currentImportSource === 'photo' ? 'upload_photo' : 'from_wechat' });
    renderTaskList();
    closeImportDialog();
    
    // 显示成功提示
    const sourceText = window.currentImportSource === 'photo' ? '照片识别' : '微信文件';
    showToast(`${sourceText}任务创建成功：${title}`);
    
    // 清理临时数据
    window.currentImportSource = null;
    window.currentOCRData = null;
}





// 上传照片识别
function uploadPhoto() {
    trackEvent({ event_name: 'import_upload_click', action_type: 'upload_photo' });
    showToast('正在模拟拉起相册/相机...');
    
    // 模拟文件选择和OCR识别过程
    setTimeout(() => {
        showToast('正在识别图片内容...');
        
        // 模拟标题识别
        setTimeout(() => {
            const recognizedTitles = [
                '土地确权登记表',
                '村民基本信息统计表', 
                '2024年度人口普查表',
                '农户收入调查表',
                '党建活动参与登记表'
            ];
            
            const randomTitle = recognizedTitles[Math.floor(Math.random() * recognizedTitles.length)];
            showTitleRecognition(randomTitle, 'photo');
            showToast('标题识别完成');
        }, 1500);
    }, 500);
}

// 从微信聊天选择
function selectFromWechat() {
    trackEvent({ event_name: 'import_upload_click', action_type: 'from_wechat' });
    showToast('正在模拟拉起微信聊天记录...');
    
    setTimeout(() => {
        showToast('正在解析微信文件...');
        
        // 模拟微信文件标题识别
        setTimeout(() => {
            const wechatTitles = [
                '户籍信息登记表（微信）',
                '村民联系方式统计（微信）',
                '疫情防控信息表（微信）',
                '低保申请汇总表（微信）'
            ];
            
            const randomTitle = wechatTitles[Math.floor(Math.random() * wechatTitles.length)];
            showTitleRecognition(randomTitle, 'wechat');
            showToast('文件解析完成');
        }, 1200);
    }, 500);
}

// 查看任务详情
function viewTaskDetail(taskId) {
    trackEvent({ event_name: 'view_task_detail', task_id: taskId });
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('taskDetailModal');
    const content = document.getElementById('taskDetailContent');
    window.currentViewingTaskId = taskId;
    
    // 生成表格HTML
    let tableHTML = `
        <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">${task.title}</h4>
            <p class="text-sm text-gray-500">创建时间: ${task.createDate} | 创建人: ${task.creator}</p>
        </div>
        
        <div class="mb-4">
            <h5 class="font-medium text-gray-800 mb-3">数据汇总</h5>
            <div class="overflow-x-auto">
                <table class="w-full border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">姓名</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">电话</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">地址</th>
                            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">身份证号</th>
                            ${task.ocrData[0].landArea ? '<th class="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">土地面积</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    task.ocrData.forEach((data, index) => {
        tableHTML += `
            <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                <td class="px-4 py-2 text-sm text-gray-800 border-b">${data.name}</td>
                <td class="px-4 py-2 text-sm text-gray-800 border-b">${data.phone}</td>
                <td class="px-4 py-2 text-sm text-gray-800 border-b">${data.address}</td>
                <td class="px-4 py-2 text-sm text-gray-800 border-b">${data.idCard}</td>
                ${data.landArea ? `<td class="px-4 py-2 text-sm text-gray-800 border-b">${data.landArea}</td>` : ''}
            </tr>
        `;
    });
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- 数据统计卡片 -->
        <div class="mb-4">
            <h5 class="font-medium text-gray-800 mb-3">数据统计</h5>
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <!-- 统计概览 -->
                <div class="grid grid-cols-3 gap-3 mb-4">
                    <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div class="text-2xl font-bold text-blue-600">${task.ocrData.length}</div>
                        <div class="text-xs text-gray-500 mt-1">总记录数</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div class="text-2xl font-bold text-green-600" id="uniqueCount-${task.id}">-</div>
                        <div class="text-xs text-gray-500 mt-1">唯一值</div>
                    </div>
                    <div class="bg-white rounded-lg p-3 text-center shadow-sm">
                        <div class="text-2xl font-bold text-orange-600" id="duplicateCount-${task.id}">-</div>
                        <div class="text-xs text-gray-500 mt-1">重复值</div>
                    </div>
                </div>
                
                <!-- 重复字段统计 -->
                <div class="bg-white rounded-lg p-4 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <h6 class="text-sm font-semibold text-gray-700">
                            <i class="fas fa-chart-bar mr-2 text-blue-500"></i>重复字段分析
                        </h6>
                        <select id="fieldSelector-${task.id}" class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="name">姓名</option>
                            <option value="phone">电话</option>
                            <option value="address">地址</option>
                            <option value="idCard">身份证号</option>
                        </select>
                    </div>
                    
                    <!-- 字段统计详情 -->
                    <div id="fieldStats-${task.id}" class="space-y-2">
                        <!-- 动态生成统计内容 -->
                    </div>
                    
                    <!-- 数据质量指标 -->
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <h6 class="text-xs font-semibold text-gray-600 mb-2">数据质量指标</h6>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-gray-600">空值数量</span>
                                <span class="font-semibold text-gray-800" id="emptyCount-${task.id}">0</span>
                            </div>
                            <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span class="text-gray-600">完整率</span>
                                <span class="font-semibold text-green-600" id="completeness-${task.id}">100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 原始图片容器 -->
        <div id="originalImagesContainer" class="fade-in mb-4 active">
            <h5 class="font-medium text-gray-800 mb-3">原始图片 (模拟)</h5>
            <div class="grid grid-cols-1 gap-4">
                <div class="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div class="flex items-center justify-center h-48 bg-white rounded-lg shadow-sm">
                        <div class="text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-500">原始表格图片 1</p>
                            <p class="text-xs text-gray-400 mt-1">上传时间: ${task.createDate}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div class="flex items-center justify-center h-48 bg-white rounded-lg shadow-sm">
                        <div class="text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-500">原始表格图片 2</p>
                            <p class="text-xs text-gray-400 mt-1">上传时间: ${task.createDate}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <div class="flex items-center justify-center h-48 bg-white rounded-lg shadow-sm">
                        <div class="text-center">
                            <i class="fas fa-image text-4xl text-gray-400 mb-2"></i>
                            <p class="text-sm text-gray-500">原始表格图片 3</p>
                            <p class="text-xs text-gray-400 mt-1">上传时间: ${task.createDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    content.innerHTML = tableHTML;
    modal.classList.remove('hidden');
    
    // 添加滑入动画
    setTimeout(() => {
        modal.querySelector('.slide-up').classList.add('active');
    }, 10);
    
    // 初始化数据统计
    initDataStatistics(task);
}

// 数据统计功能
function initDataStatistics(task) {
    // 计算字段统计
    function calculateFieldStats(fieldName) {
        const values = task.ocrData.map(item => item[fieldName]).filter(v => v);
        const valueCount = {};
        const duplicates = [];
        
        values.forEach(value => {
            valueCount[value] = (valueCount[value] || 0) + 1;
        });
        
        Object.entries(valueCount).forEach(([value, count]) => {
            if (count > 1) {
                duplicates.push({ value, count });
            }
        });
        
        return {
            total: values.length,
            unique: Object.keys(valueCount).length,
            duplicates: duplicates.sort((a, b) => b.count - a.count),
            emptyCount: task.ocrData.length - values.length
        };
    }
    
    // 更新统计显示
    function updateFieldDisplay(fieldName) {
        const stats = calculateFieldStats(fieldName);
        const fieldStatsDiv = document.getElementById(`fieldStats-${task.id}`);
        
        if (stats.duplicates.length === 0) {
            fieldStatsDiv.innerHTML = `
                <div class="text-center py-4 text-gray-500 text-sm">
                    <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                    <p>该字段无重复数据</p>
                </div>
            `;
        } else {
            fieldStatsDiv.innerHTML = stats.duplicates.map((dup, index) => `
                <div class="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <div class="flex-1">
                        <div class="text-sm font-medium text-gray-800">${dup.value}</div>
                        <div class="text-xs text-gray-500">重复 ${dup.count} 次 · 重复率 ${((dup.count / stats.total) * 100).toFixed(1)}%</div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="w-16 bg-gray-200 rounded-full h-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${(dup.count / stats.total) * 100}%"></div>
                        </div>
                        <span class="text-xs font-semibold text-orange-600 w-8 text-right">${dup.count}</span>
                    </div>
                </div>
            `).join('');
        }
        
        // 更新总体统计
        document.getElementById(`uniqueCount-${task.id}`).textContent = stats.unique;
        document.getElementById(`duplicateCount-${task.id}`).textContent = stats.duplicates.length;
        document.getElementById(`emptyCount-${task.id}`).textContent = stats.emptyCount;
        
        const completeness = ((stats.total / task.ocrData.length) * 100).toFixed(1);
        document.getElementById(`completeness-${task.id}`).textContent = `${completeness}%`;
    }
    
    // 初始显示姓名字段统计
    updateFieldDisplay('name');
    
    // 添加字段选择器事件监听
    const selector = document.getElementById(`fieldSelector-${task.id}`);
    if (selector) {
        selector.addEventListener('change', (e) => {
            updateFieldDisplay(e.target.value);
        });
    }
}

// 关闭任务详情
function closeTaskDetail() {
    const modal = document.getElementById('taskDetailModal');
    modal.querySelector('.slide-up').classList.remove('active');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// 显示原始图片
function showOriginalImages() {
    const imagesContainer = document.getElementById('originalImagesContainer');
    const showImagesBtn = document.querySelector('[onclick="showOriginalImages()"]');
    
    if (imagesContainer.classList.contains('hidden')) {
        // 显示图片
        imagesContainer.classList.remove('hidden');
        showImagesBtn.innerHTML = '<i class="fas fa-eye-slash mr-2"></i>隐藏原始图片';
        
        // 添加淡入动画
        setTimeout(() => {
            imagesContainer.classList.add('active');
        }, 10);
    } else {
        // 隐藏图片
        imagesContainer.classList.remove('active');
        showImagesBtn.innerHTML = '<i class="fas fa-eye mr-2"></i>显示原始图片';
        
        setTimeout(() => {
            imagesContainer.classList.add('hidden');
        }, 300);
    }
}

// 编辑OCR数据
function editOCRData() {
    trackEvent({ event_name: 'edit_ocr_data' });
    const taskId = window.currentViewingTaskId;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 显示识别结果页面
    showOCRResultPage(task);
}

// 显示识别结果页面
function showOCRResultPage(task) {
    const modal = document.getElementById('ocrResultModal');
    
    // 设置任务标题和统计信息
    document.getElementById('ocrTaskTitle').textContent = task.title;
    document.getElementById('ocrImageCount').textContent = `已上传3张图片`;
    document.getElementById('ocrRecordCount').textContent = `共识别${task.ocrData.length}条记录`;
    
    // 计算待确认项（模拟：随机标记一些字段为待确认）
    const errorCount = Math.floor(Math.random() * 3) + 1;
    document.getElementById('ocrErrorCount').textContent = `${errorCount}项待确认`;
    
    // 生成表格数据
    const tableBody = document.getElementById('ocrResultTableBody');
    tableBody.innerHTML = '';
    
    task.ocrData.forEach((data, index) => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100 hover:bg-gray-50';
        
        // 随机标记一些单元格为待确认（黄色背景）
        const hasIdCardError = Math.random() > 0.7;
        const hasPhoneError = Math.random() > 0.8;
        
        row.innerHTML = `
            <td class="px-3 py-3 text-sm text-gray-800">${index + 1}</td>
            <td class="px-3 py-3 text-sm text-gray-800">${data.address ? data.address.split('组')[0] + '组' : '同兴村6组'}</td>
            <td class="px-3 py-3 text-sm text-gray-800">${data.name}</td>
            <td class="px-3 py-3 text-sm text-gray-800 ${hasIdCardError ? 'bg-yellow-100 relative' : ''}">
                ${data.idCard}
                ${hasIdCardError ? '<i class="fas fa-exclamation-triangle text-orange-500 absolute right-1 top-1/2 transform -translate-y-1/2 text-xs"></i>' : ''}
            </td>
            <td class="px-3 py-3 text-sm text-gray-800 ${hasPhoneError ? 'bg-yellow-100 relative' : ''}">
                ${data.phone}
                ${hasPhoneError ? '<i class="fas fa-exclamation-triangle text-orange-500 absolute right-1 top-1/2 transform -translate-y-1/2 text-xs"></i>' : ''}
            </td>
            <td class="px-3 py-3 text-sm text-gray-800">${data.landArea || '成都'}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 显示模态框
    modal.classList.remove('hidden');
    
    // 关闭任务详情页
    closeTaskDetail();
}

// 关闭识别结果页面
function closeOCRResult() {
    const modal = document.getElementById('ocrResultModal');
    modal.classList.add('hidden');
}

// 继续添加图片
function continueAddImages() {
    trackEvent({ event_name: 'ocr_continue_add' });
    showToast('正在打开相册/相机...');
    // 这里可以实现继续添加图片的功能
}

// 图文校对
function imageTextProofread() {
    trackEvent({ event_name: 'ocr_image_text_proofread' });
    showToast('正在打开图文校对界面...');
    // 这里可以实现图文校对功能，显示原始图片和识别结果对比
}

// 确认OCR结果
function confirmOCRResult() {
    trackEvent({ event_name: 'ocr_confirm_result' });
    const taskId = window.currentViewingTaskId;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        showToast('识别结果已确认并保存');
        closeOCRResult();
        // 可以在这里更新任务状态或执行其他操作
    }
}

// 导出任务
function exportTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 创建下拉菜单
    const menu = document.createElement('div');
    menu.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    menu.innerHTML = `
        <div class="bg-white rounded-lg max-w-sm w-full p-4">
            <h3 class="font-semibold text-gray-800 mb-4">导出选项</h3>
            <div class="space-y-2">
                <button onclick="saveToPhone('${taskId}')" class="w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <i class="fas fa-download mr-3 text-blue-600"></i>保存到手机
                </button>
                <button onclick="sendToWechat('${taskId}')" class="w-full p-3 text-left hover:bg-gray-50 rounded-lg">
                    <i class="fab fa-weixin mr-3 text-green-600"></i>发送到微信
                </button>
            </div>
            <button onclick="closeExportMenu()" class="w-full mt-4 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                取消
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
    
    // 添加关闭功能
    window.closeExportMenu = function() {
        document.body.removeChild(menu);
    };
    
    window.saveToPhone = function(taskId) {
        trackEvent({ event_name: 'export', task_id: taskId, action_type: 'save_to_phone' });
        closeExportMenu();
        showToast('正在生成Excel文件并保存到手机...');
    };
    
    window.sendToWechat = function(taskId) {
        trackEvent({ event_name: 'export', task_id: taskId, action_type: 'send_to_wechat' });
        closeExportMenu();
        showToast('正在分享到微信...');
    };
}

/**
 * 归档方式选择
 */
function showArchiveOptions() {
    const taskId = window.currentViewingTaskId || null;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end';
    modal.innerHTML = `
        <div class="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto slide-up">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">请选择归档方式</h3>
                <button onclick="closeArchiveOptions()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4 space-y-3">
                <button onclick="archiveWithCurrentData()" class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <div class="font-medium text-gray-800">使用目前识别的数据归档</div>
                    <div class="text-sm text-gray-500 mt-1">适用于您已在平台内完成所有修改，数据准确无误的情况。</div>
                </button>
                <button onclick="archiveWithReupload()" class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <div class="font-medium text-gray-800">重新上传修改后的表格归档</div>
                    <div class="text-sm text-gray-500 mt-1">适用于数据需要大幅修改或补充，您希望在电脑上用Excel处理的情况。</div>
                </button>
                <button onclick="closeArchiveOptions()" class="w-full mt-4 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    取消
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => {
        modal.querySelector('.slide-up').classList.add('active');
    }, 10);

    window.closeArchiveOptions = function() {
        const panel = modal.querySelector('.slide-up');
        panel.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    };

    window.archiveWithCurrentData = function() {
        if (typeof trackEvent === 'function') {
            trackEvent({ event_name: 'archive_option', task_id: taskId, action_type: 'archive_current' });
        }
        // 模拟归档完成：复用“已同步”状态表示归档完成
        if (taskId) {
            const t = tasks.find(x => x.id === taskId);
            if (t) { t.status = 'synced'; t.synced = true; }
        }
        closeArchiveOptions();
        renderTaskList();
        showToast('已使用当前识别数据归档');
    };

    window.archiveWithReupload = function() {
        if (typeof trackEvent === 'function') {
            trackEvent({ event_name: 'archive_option', task_id: taskId, action_type: 'archive_reupload' });
        }
        closeArchiveOptions();
        showToast('请在电脑完成Excel修改后再上传归档（模拟）');
        // 可在此扩展为实际文件选择与上传流程
    };
}

function openArchiveFromList(taskId) {
    window.currentViewingTaskId = taskId;
    if (typeof trackEvent === 'function') {
        trackEvent({ event_name: 'archive_entry_click', task_id: taskId });
    }
    showArchiveOptionsNew();
}

function showArchiveOptionsNew() {
    const taskId = window.currentViewingTaskId || null;
    const task = tasks.find(t => t.id === taskId);
    const taskTitle = task ? task.title : '当前任务';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end';
    modal.innerHTML = `
        <div class="bg-white rounded-t-xl w-full max-h-[90vh] overflow-y-auto slide-up">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">上传最终版并归档</h3>
                <button onclick="closeArchiveOptionsNew()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-5 space-y-4">
                <div class="text-sm text-gray-700">
                    <div class="mb-2">✍️ 操作说明</div>
                    <div class="mb-2">即将为《${taskTitle}》任务进行最终归档。</div>
                    <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex items-start space-x-2">
                        <i class="fas fa-info-circle mt-0.5"></i>
                        <span class="font-medium">为未来表格任务提供数据预填支持。</span>
                    </div>
                </div>

                <div id="uploadArea" class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 transition">
                    <div class="text-gray-500">
                        <div class="text-xl mb-2">➕ 点击选择或拖拽文件到此处</div>
                        <div class="text-xs">支持 .xlsx .xls .csv</div>
                    </div>
                    <input id="archiveFileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" />
                    <div id="selectedFileInfo" class="mt-3 text-sm text-gray-700 hidden"></div>
                </div>

                <button id="confirmArchiveBtn" class="w-full mt-2 px-4 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed">
                    确认上传并归档
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.querySelector('.slide-up').classList.add('active'), 10);
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => { if (e.target === modal) { closeArchiveOptionsNew(); } });
    // Esc 关闭
    const escHandler = (e) => { if (e.key === 'Escape') { closeArchiveOptionsNew(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    let selectedFile = null;
    const fileInput = modal.querySelector('#archiveFileInput');
    const uploadArea = modal.querySelector('#uploadArea');
    const fileInfo = modal.querySelector('#selectedFileInfo');
    const confirmBtn = modal.querySelector('#confirmArchiveBtn');

    function enableConfirm() {
        if (selectedFile) {
            confirmBtn.className = 'w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700';
            confirmBtn.disabled = false;
        } else {
            confirmBtn.className = 'w-full mt-2 px-4 py-2 bg-gray-300 text-white rounded-lg cursor-not-allowed';
            confirmBtn.disabled = true;
        }
    }
    enableConfirm();

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('border-blue-400'); });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('border-blue-400'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('border-blue-400');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            selectedFile = e.dataTransfer.files[0];
            fileInfo.textContent = `已选择文件：${selectedFile.name}`;
            fileInfo.classList.remove('hidden');
            enableConfirm();
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            selectedFile = e.target.files[0];
            fileInfo.textContent = `已选择文件：${selectedFile.name}`;
            fileInfo.classList.remove('hidden');
            enableConfirm();
        }
    });

    // 下载草稿：复用导出逻辑（按钮可能不存在，做空值保护）
    const draftBtn = modal.querySelector('#downloadDraftBtn');
    if (draftBtn) {
        draftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (taskId) {
                exportTask(taskId);
            } else {
                showToast('暂无可下载的任务数据');
            }
        });
    }

    confirmBtn.addEventListener('click', () => {
        if (!selectedFile) return;
        if (typeof trackEvent === 'function') {
            trackEvent({ event_name: 'archive_upload_confirm', task_id: taskId, action_type: 'upload_final' });
        }
        // 模拟上传并归档
        setTimeout(() => {
            if (taskId) {
                const t = tasks.find(x => x.id === taskId);
                if (t) { t.status = 'synced'; t.synced = true; }
            }
            closeArchiveOptionsNew();
            renderTaskList();
            showToast('归档完成');
        }, 600);
    });

    window.closeArchiveOptionsNew = function() {
        const panel = modal.querySelector('.slide-up');
        panel.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    };
}

// 详情页强提醒删除
function showDeleteConfirmInDetail() {
    const taskId = window.currentViewingTaskId;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end';
    dialog.innerHTML = `
        <div class="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto slide-up">
            <div class="p-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800">⚠️ 确认删除？</h3>
            </div>
            <div class="p-4 space-y-4">
                <p class="text-sm text-gray-700">您确定要永久删除《${task.title}》这个任务吗？</p>
                <p class="text-sm text-red-600">删除后，该任务下的所有收集数据、上传文件及操作历史将无法恢复。</p>
                <div class="flex space-x-3 pt-2">
                    <button onclick="closeDetailDeleteDialog()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">取消</button>
                    <button onclick="confirmDetailDelete()" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">确认删除</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
    setTimeout(() => dialog.querySelector('.slide-up').classList.add('active'), 10);

    window.closeDetailDeleteDialog = function() {
        const panel = dialog.querySelector('.slide-up');
        panel.classList.remove('active');
        setTimeout(() => document.body.removeChild(dialog), 300);
    };

    window.confirmDetailDelete = function() {
        const idx = tasks.findIndex(t => t.id === taskId);
        if (idx !== -1) {
            const deleted = tasks[idx];
            tasks.splice(idx, 1);
            if (typeof trackEvent === 'function') {
                trackEvent({ event_name: 'task_delete', task_id: taskId, action_type: 'from_detail' });
            }
            renderTaskList();
            closeDetailDeleteDialog();
            closeTaskDetail();
            showToast(`任务"${deleted.title}"已删除`);
        }
    };
}

// 同步任务
function syncTask(taskId) {
    trackEvent({ event_name: 'sync_click', task_id: taskId });
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // 创建同步选项对话框
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    dialog.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">同步数据选项</h3>
            <div class="space-y-3">
                <button onclick="directSync('${taskId}')" class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <div class="font-medium text-gray-800">直接同步平台数据</div>
                    <div class="text-sm text-gray-500">使用当前识别的数据直接同步</div>
                </button>
                <button onclick="uploadAndSync('${taskId}')" class="w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                    <div class="font-medium text-gray-800">上传修改后同步</div>
                    <div class="text-sm text-gray-500">上传修改后的表格文件</div>
                </button>
            </div>
            <button onclick="closeSyncDialog()" class="w-full mt-4 p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                取消
            </button>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 添加功能
    window.closeSyncDialog = function() {
        document.body.removeChild(dialog);
    };
    
    window.directSync = function(taskId) {
        closeSyncDialog();
        showDataAuthDialog(taskId);
    };
    
    window.uploadAndSync = function(taskId) {
        closeSyncDialog();
        showToast('正在打开文件选择...');
        // 模拟文件上传后同步
        setTimeout(() => {
            showDataAuthDialog(taskId);
        }, 1000);
    };
}

// 显示数据授权对话框
function showDataAuthDialog(taskId) {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    dialog.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">数据授权协议须知</h3>
            <div class="text-sm text-gray-600 mb-4 max-h-40 overflow-y-auto">
                <p class="mb-2">1. 您即将同步的数据将上传至善治美平台进行统一管理。</p>
                <p class="mb-2">2. 平台将严格保护您的数据安全，仅用于村务管理相关用途。</p>
                <p class="mb-2">3. 数据同步过程中可能会检测到与平台现有数据的冲突，请仔细处理。</p>
                <p class="mb-2">4. 同步完成后，数据将与平台保持一致。</p>
            </div>
            <div class="flex space-x-3">
                <button onclick="closeAuthDialog()" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    取消
                </button>
                <button onclick="agreeAndSync('${taskId}')" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    同意并同步
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    window.closeAuthDialog = function() {
        trackEvent({ event_name: 'data_auth', action_type: 'cancel', result: 'cancel' });
        document.body.removeChild(dialog);
    };
    
    window.agreeAndSync = function(taskId) {
        trackEvent({ event_name: 'data_auth', task_id: taskId, action_type: 'agree', result: 'success' });
        closeAuthDialog();
        // 模拟检测冲突
        setTimeout(() => {
            showConflictDialog(taskId);
        }, 1000);
    };
}

// 显示数据冲突处理对话框
function showConflictDialog(taskId) {
    const conflicts = [
        {
            id: '1',
            name: '张三',
            type: 'data_mismatch',
            field: '电话',
            oldValue: '13812345678',
            newValue: '13812345679',
            resolved: false
        },
        {
            id: '2',
            name: '李四',
            type: 'data_mismatch',
            field: '地址',
            oldValue: '村西组8号',
            newValue: '村西组9号',
            resolved: false
        }
    ];
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end';
    modal.innerHTML = `
        <div class="bg-white rounded-t-xl w-full max-h-[80vh] overflow-y-auto slide-up">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-800">数据冲突处理</h3>
                <button onclick="closeConflictDialog()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4">
                <p class="text-sm text-gray-600 mb-4">检测到以下数据冲突，请选择处理方式：</p>
                <div id="conflictList" class="space-y-4">
                    ${conflicts.map((conflict, index) => `
                        <div class="border border-gray-200 rounded-lg p-4" data-conflict-id="${conflict.id}">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-medium text-gray-800">${conflict.name} - ${conflict.field}</h4>
                                <span class="text-xs px-2 py-1 bg-red-100 text-red-600 rounded conflict-badge">冲突</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4 mb-3 text-sm">
                                <div>
                                    <span class="text-gray-500">导入新值：</span>
                                    <span class="font-medium">${conflict.oldValue}</span>
                                </div>
                                <div>
                                    <span class="text-gray-500">平台旧值：</span>
                                    <span class="font-medium">${conflict.newValue}</span>
                                </div>
                            </div>
                            <div class="flex space-x-2 conflict-buttons">
                                <button data-conflict-id="${conflict.id}" data-action="keep" class="conflict-btn px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100">保留旧值</button>
                                <button data-conflict-id="${conflict.id}" data-action="adopt" class="conflict-btn px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100">采纳新值</button>
                                <button data-conflict-id="${conflict.id}" data-action="edit" class="conflict-btn px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 active:bg-gray-100">手动修改</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button id="completeBtn" onclick="completeSync('${taskId}')" class="w-full mt-6 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed" disabled>
                    处理完成 (0/${conflicts.length})
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加滑入动画
    setTimeout(() => {
        modal.querySelector('.slide-up').classList.add('active');
    }, 10);
    
    let resolvedCount = 0;
    
    // 添加事件监听器到冲突处理按钮
    setTimeout(() => {
        const conflictButtons = modal.querySelectorAll('.conflict-btn');
        conflictButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const conflictId = this.getAttribute('data-conflict-id');
                const action = this.getAttribute('data-action');
                resolveConflictNew(conflictId, action);
            });
        });
    }, 100);
    
    window.closeConflictDialog = function() {
        const slideUp = modal.querySelector('.slide-up');
        slideUp.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    // 新的冲突处理函数
    function resolveConflictNew(conflictId, action) {
        const conflictDiv = modal.querySelector(`[data-conflict-id="${conflictId}"]`);
        if (!conflictDiv) return;
        
        const badge = conflictDiv.querySelector('.conflict-badge');
        badge.className = 'text-xs px-2 py-1 bg-green-100 text-green-600 rounded conflict-badge';
        badge.textContent = '已处理';
        
        // 禁用按钮
        const buttons = conflictDiv.querySelectorAll('.conflict-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            btn.className = 'px-3 py-1 text-xs border border-gray-300 rounded bg-gray-100 text-gray-400 cursor-not-allowed';
            btn.removeEventListener('click', arguments.callee);
        });
        
        resolvedCount++;
        
        // 更新按钮状态
        const completeBtn = document.getElementById('completeBtn');
        if (resolvedCount === conflicts.length) {
            completeBtn.disabled = false;
            completeBtn.className = 'w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700';
            completeBtn.textContent = '处理完成';
        } else {
            completeBtn.textContent = `处理完成 (${resolvedCount}/${conflicts.length})`;
            completeBtn.className = 'w-full mt-6 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed';
        }
        
        // 埋点：冲突处理动作
        trackEvent({
            event_name: 'conflict_handle',
            action_type: action === 'keep' ? 'keep_old' : action === 'adopt' ? 'adopt_new' : 'edit_manual'
        });
        // 显示处理结果提示
        showToast(`已${action === 'keep' ? '保留旧值' : action === 'adopt' ? '采纳新值' : '标记为手动修改'}`);
    }
    
    // 保留原函数作为备用
    window.resolveConflict = function(conflictId, action) {
        resolveConflictNew(conflictId, action);
    };
    
    window.completeSync = function(taskId) {
        closeConflictDialog();
        
        // 更新任务状态
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'synced';
            task.synced = true;
        }
        
        renderTaskList();
        trackEvent({ event_name: 'sync_complete', task_id: taskId, result: 'success' });
        showToast('数据同步完成！');
    };
}

// 编辑村民
function editVillager(villagerId) {
    showToast('打开村民编辑界面...');
}

// 新增村民表单提交
document.getElementById('addVillagerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newVillager = {
        id: Date.now().toString(),
        name: formData.get('name') || e.target.elements[0].value,
        idCard: formData.get('idCard') || e.target.elements[1].value,
        phone: formData.get('phone') || e.target.elements[2].value,
        group: formData.get('group') || e.target.elements[3].value,
        updateDate: new Date().toISOString().split('T')[0]
    };
    
    villagers.unshift(newVillager);
    renderVillagerList();
    closeAddVillagerDialog();
    showToast('村民档案添加成功！');
});

// Toast 提示函数
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// 删除任务相关函数
let taskToDelete = null;

// 显示删除确认对话框
function showDeleteConfirmDialog(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    taskToDelete = taskId;
    const deleteTaskTitle = document.getElementById('deleteTaskTitle');
    deleteTaskTitle.textContent = `《${task.title}》`;
    
    const deleteDialog = document.getElementById('deleteConfirmDialog');
    deleteDialog.classList.remove('hidden');
}

// 关闭删除确认对话框
function closeDeleteConfirmDialog() {
    const deleteDialog = document.getElementById('deleteConfirmDialog');
    deleteDialog.classList.add('hidden');
    taskToDelete = null;
}

// 确认删除任务
function confirmDeleteTask() {
    if (!taskToDelete) return;
    
    // 从任务数组中删除
    const taskIndex = tasks.findIndex(t => t.id === taskToDelete);
    if (taskIndex !== -1) {
        const deletedTask = tasks[taskIndex];
        tasks.splice(taskIndex, 1);
        
        // 重新渲染任务列表
        renderTaskList();
        
        // 关闭对话框
        closeDeleteConfirmDialog();
        
        // 显示删除成功提示
        showToast(`任务"${deletedTask.title}"已删除`);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 默认显示历史表格管理
    switchTab('history');
    
    // 为新增任务按钮添加事件监听器
    document.getElementById('addTaskBtn').addEventListener('click', () => {
        trackEvent({ event_name: 'add_task_click' });
        showImportDialog();
    });
});