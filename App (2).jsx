import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { FileUp, BarChart3, FileText, Plus, X, Send, Mic, Upload } from 'lucide-react'
import './App.css'

// 详细名单卡片组件
function DetailListCard({ onFillFor, onBatchRemind, onRemindAll }) {
  const [selectedPeople, setSelectedPeople] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  
  const peopleList = [
    { id: 1, name: '王大妈' },
    { id: 2, name: '李叔' },
    { id: 3, name: '赵四' },
    { id: 4, name: '陈伯' },
    { id: 5, name: '张婶' },
    { id: 6, name: '刘大爷' },
    { id: 7, name: '孙大姐' },
    { id: 8, name: '周叔' }
  ]

  const handleSelectPerson = (id) => {
    if (selectedPeople.includes(id)) {
      setSelectedPeople(selectedPeople.filter(pid => pid !== id))
      setSelectAll(false)
    } else {
      const newSelected = [...selectedPeople, id]
      setSelectedPeople(newSelected)
      if (newSelected.length === peopleList.length) {
        setSelectAll(true)
      }
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPeople([])
      setSelectAll(false)
    } else {
      setSelectedPeople(peopleList.map(p => p.id))
      setSelectAll(true)
    }
  }

  const handleBatchRemindClick = () => {
    if (selectedPeople.length > 0) {
      onBatchRemind(selectedPeople.length)
    }
  }

  return (
    <div className="card">
      <div className="card-title">未填写人员名单 (117人)</div>
      <div className="card-subtitle">可在此对村民进行单独或批量操作</div>
      <div className="people-list">
        {peopleList.map(person => (
          <div key={person.id} className="people-item">
            <input
              type="checkbox"
              checked={selectedPeople.includes(person.id)}
              onChange={() => handleSelectPerson(person.id)}
            />
            <span className="people-name">{person.name}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="fill-button"
              onClick={() => onFillFor(person.name)}
            >
              ✍️ 代为填写
            </Button>
          </div>
        ))}
      </div>
      <div className="card-actions">
        <div className="select-all">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <span>全选</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          disabled={selectedPeople.length === 0}
          onClick={handleBatchRemindClick}
        >
          🔔 催办选中人员
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRemindAll}
        >
          📣 一键催办所有未填写人员
        </Button>
      </div>
    </div>
  )
}

function App() {
  const [messages, setMessages] = useState([
    { type: 'agent', text: '您好,李书记!今天有什么填表任务需要我帮忙吗?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [currentStep, setCurrentStep] = useState('welcome')
  const [selectedFields, setSelectedFields] = useState(['姓名', '身份证号', '房屋结构', '隐患等级', '排查人'])
  const [newFieldInput, setNewFieldInput] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef(null)
  const wechatFileInputRef = useRef(null)
  const assistMaterialInputRef = useRef(null)

  // 添加消息
  const addMessage = (type, text, card = null) => {
    setMessages(prev => [...prev, { type, text, card }])
  }

  // 处理上传文件按钮
  const handleUploadFile = () => {
    setCurrentStep('upload')
    addMessage('agent', '好的,请选择您的文件来源,我们来创建一个新任务。', {
      type: 'fileSource'
    })
  }

  // 处理任务情况按钮
  const handleTaskStatus = () => {
    addMessage('agent', '好的,这是"危房排查登记表"的最新任务进展。', {
      type: 'taskSummary'
    })
  }

  // 处理查看详细名单
  const handleViewDetailList = () => {
    addMessage('agent', '这是未填写人员的详细名单,您可以进行催办或代填操作。', {
      type: 'detailList'
    })
  }

  // 处理导出表格按钮
  const handleExportTable = () => {
    addMessage('agent', '好的,我们将为您导出包含当前所有已收集数据的工作草稿。', {
      type: 'exportDraft'
    })
  }

  // 处理本地文件上传
  const handleLocalFileUpload = () => {
    fileInputRef.current?.click()
  }

  // 处理微信聊天记录选择
  const handleWechatFileUpload = () => {
    wechatFileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileChange = (e, source) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFileName(file.name)
      setCurrentStep('recognizing')
      const sourceText = source === 'local' ? '本地文件' : '微信聊天记录'
      addMessage('agent', `正在识别${sourceText}"${file.name}"中的表格字段,请稍候...`)
      setTimeout(() => {
        addMessage('agent', '识别完成!请您确认、修改或增删字段,这将是村民需要填写的项目。', {
          type: 'fieldConfirm'
        })
        setCurrentStep('fieldConfirm')
      }, 2000)
    }
  }

  // 处理拍照识别
  const handlePhotoRecognition = () => {
    setCurrentStep('recognizing')
    addMessage('agent', '正在识别图片中的表格字段,请稍候...')
    setTimeout(() => {
      addMessage('agent', '识别完成!请您确认、修改或增删字段,这将是村民需要填写的项目。', {
        type: 'fieldConfirm'
      })
      setCurrentStep('fieldConfirm')
    }, 2000)
  }

  // 处理字段确认
  const handleFieldConfirm = () => {
    setCurrentStep('modeSelect')
    addMessage('agent', '字段已确认!接下来您希望如何处理这份表格呢?', {
      type: 'modeSelect'
    })
  }

  // 处理任务模式选择
  const handleModeSelect = (mode) => {
    if (mode === 'direct') {
      setCurrentStep('directFill')
      addMessage('agent', '好的,您选择了直接填写模式。请选择填写方式:', {
        type: 'directFillOptions'
      })
    } else if (mode === 'collect') {
      setCurrentStep('audienceSelect')
      addMessage('agent', '好的,我们将向村民收集信息。请选择需要通知的人群范围。', {
        type: 'audienceSelect'
      })
    }
  }

  // 处理辅助材料上传
  const handleAssistMaterialUpload = () => {
    assistMaterialInputRef.current?.click()
  }

  // 处理辅助材料文件选择
  const handleAssistMaterialChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      addMessage('agent', `正在从"${file.name}"中识别相同字段并自动填写...`)
      setTimeout(() => {
        addMessage('agent', '✅ 识别完成!已从辅助材料中提取并填写了以下字段:姓名、身份证号、房屋结构。您可以继续手动补充其他字段。', {
          type: 'fillResult'
        })
      }, 2000)
    }
  }

  // 处理从村庄大表读取
  const handleReadFromVillageTable = () => {
    addMessage('agent', '正在从村庄大表中读取已有信息并进行AI自动填写...')
    setTimeout(() => {
      addMessage('agent', '✅ 自动填写完成!已从村庄大表中提取并填写了所有可匹配字段。表格已生成,您可以导出查看。', {
        type: 'fillResult'
      })
    }, 2000)
  }

  // 处理人群选择
  const handleAudienceSelect = (audience) => {
    if (audience === 'household') {
      setCurrentStep('sendConfirm')
      addMessage('agent', '已为您选中所有户主,共152人。请确认通知内容,点击即可发送。', {
        type: 'sendConfirm'
      })
    } else if (audience === 'specific') {
      addMessage('agent', '请选择特定人群类型:', {
        type: 'specificAudience'
      })
    } else if (audience === 'all') {
      setCurrentStep('sendConfirm')
      addMessage('agent', '已为您选中全体村民,共328人。请确认通知内容,点击即可发送。', {
        type: 'sendConfirm',
        count: 328
      })
    } else if (audience === 'custom') {
      addMessage('agent', '请自定义选择需要通知的人员:', {
        type: 'customAudience'
      })
    }
  }

  // 处理特定人群选择
  const handleSpecificAudienceSelect = (type) => {
    const audienceMap = {
      'lowIncome': { name: '低保户', count: 45 },
      'elderly': { name: '60岁以上老人', count: 89 },
      'disabled': { name: '残疾人', count: 23 },
      'poverty': { name: '建档立卡贫困户', count: 37 }
    }
    const selected = audienceMap[type]
    setCurrentStep('sendConfirm')
    addMessage('agent', `已为您选中${selected.name},共${selected.count}人。请确认通知内容,点击即可发送。`, {
      type: 'sendConfirm',
      count: selected.count
    })
  }

  // 处理自定义人群选择完成
  const handleCustomAudienceConfirm = () => {
    setCurrentStep('sendConfirm')
    addMessage('agent', '已为您选中自定义人员,共67人。请确认通知内容,点击即可发送。', {
      type: 'sendConfirm',
      count: 67
    })
  }

  // 处理发送确认
  const handleSendConfirm = (count = 152) => {
    setCurrentStep('sent')
    addMessage('agent', `✅ 发送成功!村民们会收到填表通知的。您可以随时点击顶部的 [📊 任務情況] 按钮来查看填写进度。`)
  }

  // 处理单独代填
  const handleFillFor = (name) => {
    addMessage('agent', `好的,请开始为'${name}'填写信息。`, {
      type: 'fillForm',
      name: name
    })
  }

  // 处理批量催办
  const handleBatchRemind = (selectedCount) => {
    addMessage('agent', `✅ 操作成功!提醒消息已发送给选中的${selectedCount}位村民。`)
  }

  // 处理一键催办全体
  const handleRemindAll = () => {
    addMessage('agent', '好的,提醒消息已成功发送给全部117位未填写的村民。')
  }

  // 处理导出草稿
  const handleExportDraft = () => {
    addMessage('agent', '✅ 草稿已导出。请您处理完毕后,将最终版文件直接拖拽到这里,或在下方对话框输入"上传最终版",我将为您完成后续的数据更新。')
  }

  // 处理删除字段
  const handleRemoveField = (field) => {
    setSelectedFields(prev => prev.filter(f => f !== field))
  }

  // 处理添加字段
  const handleAddField = () => {
    if (newFieldInput.trim()) {
      setSelectedFields(prev => [...prev, newFieldInput.trim()])
      setNewFieldInput('')
    }
  }

  // 处理发送消息
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage('user', inputValue)
      if (inputValue.includes('上传最终版')) {
        setTimeout(() => {
          addMessage('agent', '好的,请上传您的最终版Excel文件,我将为您进行数据比对与更新到"村大表"。', {
            type: 'fileUpload'
          })
        }, 500)
      }
      setInputValue('')
    }
  }

  // 渲染功能卡片
  const renderCard = (card) => {
    switch (card.type) {
      case 'fileSource':
        return (
          <div className="card">
            <div className="card-title">请选择创建方式</div>
            <div className="card-buttons">
              <Button variant="outline" className="card-button" onClick={handleLocalFileUpload}>
                <FileUp className="w-4 h-4 mr-2" />
                从本地文件上传
              </Button>
              <Button variant="outline" className="card-button" onClick={handleWechatFileUpload}>
                💬 从微信聊天记录选择
              </Button>
              <Button variant="outline" className="card-button" onClick={handlePhotoRecognition}>
                📷 拍照识别表格
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.doc,.docx,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'local')}
            />
            <input
              ref={wechatFileInputRef}
              type="file"
              accept=".xlsx,.xls,.doc,.docx,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'wechat')}
            />
          </div>
        )
      
      case 'fieldConfirm':
        return (
          <div className="card">
            <div className="card-title">字段确认</div>
            <div className="field-list">
              {selectedFields.map((field, index) => (
                <div key={index} className="field-item">
                  <span>{field}</span>
                  <button onClick={() => handleRemoveField(field)} className="field-remove">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="field-add">
              <input
                type="text"
                placeholder="输入新字段名称"
                value={newFieldInput}
                onChange={(e) => setNewFieldInput(e.target.value)}
                className="field-input"
              />
              <Button size="sm" onClick={handleAddField}>
                <Plus className="w-4 h-4 mr-1" />
                增加字段
              </Button>
            </div>
            <Button className="w-full mt-3" onClick={handleFieldConfirm}>
              ✅ 确定字段,下一步
            </Button>
          </div>
        )
      
      case 'modeSelect':
        return (
          <div className="card">
            <div className="card-title">请选择任务模式</div>
            <div className="card-buttons">
              <Button variant="outline" className="card-button mode-button" onClick={() => handleModeSelect('direct')}>
                <div className="mode-icon">✍️</div>
                <div className="mode-content">
                  <div className="mode-title">直接填写</div>
                  <div className="mode-desc">适用于紧急任务,由您直接填写或上传材料</div>
                </div>
              </Button>
              <Button variant="outline" className="card-button mode-button" onClick={() => handleModeSelect('collect')}>
                <div className="mode-icon">📢</div>
                <div className="mode-content">
                  <div className="mode-title">收集信息</div>
                  <div className="mode-desc">适用于常规任务,向村民分发并收集</div>
                </div>
              </Button>
            </div>
          </div>
        )
      
      case 'directFillOptions':
        return (
          <div className="card">
            <div className="card-title">请选择填写方式</div>
            <div className="card-buttons">
              <Button variant="outline" className="card-button" onClick={handleAssistMaterialUpload}>
                <Upload className="w-4 h-4 mr-2" />
                上传辅助材料自动识别填写
              </Button>
              <Button variant="outline" className="card-button" onClick={handleReadFromVillageTable}>
                📊 从村庄大表读取信息填写
              </Button>
            </div>
            <input
              ref={assistMaterialInputRef}
              type="file"
              accept=".xlsx,.xls,.doc,.docx,.pdf"
              style={{ display: 'none' }}
              onChange={handleAssistMaterialChange}
            />
          </div>
        )
      
      case 'fillResult':
        return (
          <div className="card">
            <div className="card-title">填写结果</div>
            <div className="export-desc">
              表格已自动填写完成,您可以导出查看或继续手动编辑。
            </div>
            <Button className="w-full mt-3">
              📥 导出已填写表格
            </Button>
          </div>
        )
      
      case 'audienceSelect':
        return (
          <div className="card">
            <div className="card-title">请选择通知人群</div>
            <div className="card-buttons">
              <Button variant="outline" className="card-button" onClick={() => handleAudienceSelect('household')}>
                👤 按户主
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleAudienceSelect('specific')}>
                🎯 按特定人群
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleAudienceSelect('all')}>
                全员
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleAudienceSelect('custom')}>
                ✏️ 自定义选择
              </Button>
            </div>
          </div>
        )
      
      case 'specificAudience':
        return (
          <div className="card">
            <div className="card-title">请选择特定人群类型</div>
            <div className="card-buttons">
              <Button variant="outline" className="card-button" onClick={() => handleSpecificAudienceSelect('lowIncome')}>
                💰 低保户 (45人)
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleSpecificAudienceSelect('elderly')}>
                👴 60岁以上老人 (89人)
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleSpecificAudienceSelect('disabled')}>
                ♿ 残疾人 (23人)
              </Button>
              <Button variant="outline" className="card-button" onClick={() => handleSpecificAudienceSelect('poverty')}>
                📋 建档立卡贫困户 (37人)
              </Button>
            </div>
          </div>
        )
      
      case 'customAudience':
        return (
          <div className="card">
            <div className="card-title">自定义选择人员</div>
            <div className="export-desc">
              您可以通过搜索姓名、身份证号或其他条件来筛选需要通知的人员。
            </div>
            <div className="field-add mt-3">
              <input
                type="text"
                placeholder="搜索人员姓名或身份证号"
                className="field-input"
              />
              <Button size="sm">
                搜索
              </Button>
            </div>
            <div className="custom-audience-list">
              <div className="audience-item">
                <input type="checkbox" />
                <span>张三 (身份证: 110***********234)</span>
              </div>
              <div className="audience-item">
                <input type="checkbox" />
                <span>李四 (身份证: 110***********567)</span>
              </div>
              <div className="audience-item">
                <input type="checkbox" />
                <span>王五 (身份证: 110***********890)</span>
              </div>
            </div>
            <Button className="w-full mt-3" onClick={handleCustomAudienceConfirm}>
              ✅ 确认选择 (已选3人)
            </Button>
          </div>
        )
      
      case 'sendConfirm':
        const count = card.count || 152
        return (
          <div className="card">
            <div className="card-title">发送确认</div>
            <div className="confirm-info">
              <div className="confirm-row">
                <span className="confirm-label">通知内容:</span>
                <span className="confirm-value">"各位户主,请尽快填写《危房排查登记表》,事关居住安全,感谢配合。"</span>
              </div>
              <div className="confirm-row">
                <span className="confirm-label">发送人数:</span>
                <span className="confirm-value">{count}人</span>
              </div>
            </div>
            <Button className="w-full mt-3" onClick={() => handleSendConfirm(count)}>
              🚀 确认发送
            </Button>
          </div>
        )
      
      case 'taskSummary':
        return (
          <div className="card">
            <div className="card-title">危房排查登记表 - 任务进度</div>
            <div className="progress-info">
              <div className="progress-row">
                <span>✅ 已填写: 35/152</span>
              </div>
              <div className="progress-row">
                <span>✏️ 未填写: 117/152</span>
              </div>
            </div>
            <Button className="w-full mt-3" onClick={handleViewDetailList}>
              ➡️ 查看详细名单与操作
            </Button>
          </div>
        )
      
      case 'detailList':
        return (
          <DetailListCard 
            onFillFor={handleFillFor}
            onBatchRemind={handleBatchRemind}
            onRemindAll={handleRemindAll}
          />
        )
      
      case 'fillForm':
        return (
          <div className="card">
            <div className="card-title">为 {card.name} 代填表单</div>
            <div className="fill-form">
              <div className="form-field">
                <label>姓名</label>
                <input type="text" value={card.name} disabled className="form-input" />
              </div>
              <div className="form-field">
                <label>身份证号</label>
                <input type="text" placeholder="请输入身份证号" className="form-input" />
              </div>
              <div className="form-field">
                <label>房屋结构</label>
                <input type="text" placeholder="请输入房屋结构" className="form-input" />
              </div>
              <div className="form-field">
                <label>隐患等级</label>
                <select className="form-input">
                  <option>请选择</option>
                  <option>无隐患</option>
                  <option>一般隐患</option>
                  <option>严重隐患</option>
                </select>
              </div>
              <div className="form-field">
                <label>排查人</label>
                <input type="text" placeholder="请输入排查人" className="form-input" />
              </div>
            </div>
            <Button className="w-full mt-3">
              ✅ 提交代填表单
            </Button>
          </div>
        )
      
      case 'exportDraft':
        return (
          <div className="card">
            <div className="card-title">导出数据草稿</div>
            <div className="export-desc">
              当前数据将导出为Excel文件,方便您在电脑上进行最终审核、修改,并补充未在平台上的村民信息。
            </div>
            <Button className="w-full mt-3" onClick={handleExportDraft}>
              📥 导出草稿Excel
            </Button>
          </div>
        )
      
      case 'fileUpload':
        return (
          <div className="card">
            <div className="file-upload-area">
              <FileUp className="w-12 h-12 text-muted-foreground mb-2" />
              <div className="text-sm text-muted-foreground">点击或拖拽文件到此处上传</div>
              <Button variant="outline" className="mt-3">
                选择文件
              </Button>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="app-container">
      {/* 顶部固定按钮栏 */}
      <div className="top-bar">
        <Button variant="outline" className="top-button" onClick={handleUploadFile}>
          <FileUp className="w-4 h-4 mr-1" />
          上传文件
        </Button>
        <Button variant="outline" className="top-button" onClick={handleTaskStatus}>
          <BarChart3 className="w-4 h-4 mr-1" />
          任務情況
        </Button>
        <Button variant="outline" className="top-button" onClick={handleExportTable}>
          <FileText className="w-4 h-4 mr-1" />
          导出表格
        </Button>
      </div>

      {/* 对话流区域 */}
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.type === 'agent' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              {msg.text && <div className="message-text">{msg.text}</div>}
              {msg.card && renderCard(msg.card)}
            </div>
            {msg.type === 'user' && (
              <div className="message-avatar user">👤</div>
            )}
          </div>
        ))}
      </div>

      {/* 底部输入栏 */}
      <div className="input-bar">
        <input
          type="text"
          placeholder="输入消息..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="chat-input"
        />
        <button className="icon-button">
          <Mic className="w-5 h-5" />
        </button>
        <button className="icon-button" onClick={handleSendMessage}>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default App

