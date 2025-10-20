import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Send, Upload, FileText, Users, CheckCircle2, AlertCircle, Bot, User,
  Sparkles, Bell, Clock, TrendingUp, Shield, Settings, Download, 
  RefreshCw, Eye, Edit, Trash2, Plus, Minus, Search, Filter,
  Calendar, MapPin, Phone, Mail, Home, Briefcase, Award,
  BarChart3, PieChart, Activity, Zap, Heart, Star, MessageSquare
} from 'lucide-react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好！我是小耕，您的乡村事务助理。请告诉我您需要什么帮助？', timestamp: new Date() }
  ])
  const [inputValue, setInputValue] = useState('')
  const [currentView, setCurrentView] = useState('welcome') // welcome, taskPreview, recipientConfirm, dataEntry, export, conflict, permission

  // 模拟不同的交互场景
  const [taskData, setTaskData] = useState(null)
  const [recipientData, setRecipientData] = useState(null)
  const [conflictData, setConflictData] = useState(null)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = { role: 'user', content: inputValue, timestamp: new Date() }
    setMessages(prev => [...prev, userMessage])

    // 模拟AI响应
    setTimeout(() => {
      handleAIResponse(inputValue)
    }, 800)

    setInputValue('')
  }

  const handleAIResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase()

    if (lowerInput.includes('上传') || lowerInput.includes('创建') || lowerInput.includes('五保户')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,表格的字段已经识别出来了,您核对一下有没有错漏?没问题的话,我就正式创建任务了。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setTaskData({
        name: '五保户信息统计',
        fields: ['姓名', '身份证号', '健康状况', '联系电话', '家庭住址', '补贴金额']
      })
      setCurrentView('taskPreview')
    } else if (lowerInput.includes('模板') || lowerInput.includes('农业补贴')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,已载入"农业补贴"模板。本次任务名称就叫"2025年度种植面积申报"可以吗?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setTaskData({
        name: '2025年度种植面积申报',
        template: '农业补贴'
      })
      setCurrentView('taskPreview')
    } else if (lowerInput.includes('通知') || lowerInput.includes('户主') || lowerInput.includes('60岁')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,根据您的要求,已筛选出 152位户主。确认无误后,即可发送通知。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setRecipientData({
        count: 152,
        criteria: lowerInput.includes('60岁') ? '60岁以上村民' : '所有户主'
      })
      setCurrentView('recipientConfirm')
    } else if (lowerInput.includes('张三') || lowerInput.includes('代填') || lowerInput.includes('玉米')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,张三的信息已录入,请确认。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentView('dataEntry')
    } else if (lowerInput.includes('催办') || lowerInput.includes('提醒')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,已经向剩余15位村民发送了提醒通知。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentView('welcome')
    } else if (lowerInput.includes('导出') || lowerInput.includes('数据')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,数据已导出。请您在电脑上处理完毕后,将最终版文件直接拖拽到这里或上传。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentView('export')
    } else if (lowerInput.includes('比对') || lowerInput.includes('冲突')) {
      const aiMessage = {
        role: 'assistant',
        content: '书记,比对出3条数据有变化,需要您审核一下。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setConflictData({
        total: 3,
        current: 1,
        villager: '李四',
        field: '手机号',
        oldValue: '138****1234',
        newValue: '139****5678'
      })
      setCurrentView('conflict')
    } else if (lowerInput.includes('小王') || lowerInput.includes('网格员') || lowerInput.includes('权限')) {
      const aiMessage = {
        role: 'assistant',
        content: '好的,将为"小王"创建【协作者】角色,其数据权限范围为【一组、二组】,无数据导出权限。确认吗?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentView('permission')
    } else {
      const aiMessage = {
        role: 'assistant',
        content: '我理解了。您还有其他需要帮助的吗?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setCurrentView('welcome')
    }
  }

  const handleConfirmTask = () => {
    const aiMessage = {
      role: 'assistant',
      content: '任务创建成功!现在要通知哪些村民来填写呢?',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    setCurrentView('welcome')
  }

  const handleSendNotification = () => {
    const aiMessage = {
      role: 'assistant',
      content: '通知已发送!我会持续跟踪填写进度,有情况随时向您汇报。',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    setCurrentView('welcome')
  }

  const handleArchive = () => {
    const aiMessage = {
      role: 'assistant',
      content: '数据已归档。还有14户未填写,需要继续处理吗?',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    setCurrentView('welcome')
  }

  const handleConflictResolve = (action) => {
    const aiMessage = {
      role: 'assistant',
      content: action === 'new' ? '好的,已使用新数据更新。' : '好的,已保留旧数据。',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    setCurrentView('welcome')
  }

  const handleConfirmPermission = () => {
    const aiMessage = {
      role: 'assistant',
      content: '权限配置完成!小王现在可以访问一组和二组的数据了。',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMessage])
    setCurrentView('welcome')
  }

  const renderContentArea = () => {
    switch (currentView) {
      case 'taskPreview':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                任务预览
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">任务名称</p>
                <p className="font-semibold text-lg">{taskData?.name}</p>
              </div>
              {taskData?.fields && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">识别字段</p>
                  <div className="flex flex-wrap gap-2">
                    {taskData.fields.map((field, idx) => (
                      <Badge key={idx} variant="secondary">{field}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {taskData?.template && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">使用模板</p>
                  <Badge variant="outline">{taskData.template}</Badge>
                </div>
              )}
              <Button onClick={handleConfirmTask} className="w-full mt-4">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                确认创建任务
              </Button>
            </CardContent>
          </Card>
        )

      case 'recipientConfirm':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                通知对象确认
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">筛选条件</p>
                <p className="font-medium">{recipientData?.criteria}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-2xl font-bold text-primary">{recipientData?.count}</p>
                <p className="text-sm text-muted-foreground">位村民符合条件</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  查看完整名单
                </Button>
                <Button onClick={handleSendNotification} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  立即发送通知
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'dataEntry':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                数据录入确认
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    姓名
                  </span>
                  <span className="font-medium">张三</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    种植作物
                  </span>
                  <span className="font-medium">玉米</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    种植面积
                  </span>
                  <span className="font-medium">6亩</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    补贴状态
                  </span>
                  <Badge variant="default" className="gap-1">
                    <Star className="w-3 h-3" />
                    需要补贴
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleArchive} className="flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  归档
                </Button>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'export':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                数据导出
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 p-6 rounded-lg text-center space-y-3 border">
                <div className="relative inline-block">
                  <FileText className="w-12 h-12 mx-auto text-primary" />
                  <Download className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1" />
                </div>
                <div>
                  <p className="font-medium flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    玉米统计数据.xlsx
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">152条记录 • 24KB</p>
                </div>
                <Button variant="default" className="gap-2">
                  <Download className="w-4 h-4" />
                  下载文件
                </Button>
              </div>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-3 hover:border-primary/50 transition-colors">
                <div className="relative inline-block">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <RefreshCw className="w-4 h-4 text-blue-500 absolute -top-1 -right-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">处理完毕后,将文件拖拽到这里</p>
                  <p className="text-xs text-muted-foreground/70">支持 .xlsx, .xls, .csv 格式</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  或点击上传
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'conflict':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                数据冲突审核 ({conflictData?.current}/{conflictData?.total})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    村民
                  </span>
                  <span className="font-medium">{conflictData?.villager}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    字段
                  </span>
                  <Badge variant="outline">{conflictData?.field}</Badge>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    原数据
                  </p>
                  <p className="font-mono font-semibold">{conflictData?.oldValue}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    新数据
                  </p>
                  <p className="font-mono font-semibold">{conflictData?.newValue}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleConflictResolve('new')} variant="default" className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  使用新数据
                </Button>
                <Button onClick={() => handleConflictResolve('old')} variant="outline" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  保留旧数据
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                查看完整记录
              </Button>
            </CardContent>
          </Card>
        )

      case 'permission':
        return (
          <Card className="animate-fade-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                权限配置确认
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">姓名</span>
                  <span className="font-medium">小王</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">角色</span>
                  <Badge>协作者</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">数据范围</span>
                  <div className="flex gap-1">
                    <Badge variant="secondary">一组</Badge>
                    <Badge variant="secondary">二组</Badge>
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">导出权限</span>
                  <Badge variant="destructive">无</Badge>
                </div>
              </div>
              <Button onClick={handleConfirmPermission} className="w-full mt-4">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                确认创建
              </Button>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="h-full flex flex-col">
            <CardContent className="flex-1 flex flex-col items-center justify-center space-y-6 py-12">
              <div className="relative">
                <Bot className="w-16 h-16 mx-auto text-primary opacity-50" />
                <Sparkles className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  智能助理待命中
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  选择快捷操作或输入自然语言指令
                </p>
              </div>
              
              {/* 快捷操作按钮 */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <span className="text-xs">创建任务</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Users className="w-6 h-6 text-green-500" />
                  <span className="text-xs">发送通知</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-500" />
                  <span className="text-xs">数据统计</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
                  <Download className="w-6 h-6 text-orange-500" />
                  <span className="text-xs">导出数据</span>
                </Button>
              </div>

              {/* 示例指令 */}
              <div className="w-full max-w-md space-y-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  示例指令:
                </p>
                <div className="space-y-1">
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Upload className="w-3 h-3" />
                    上传文件,创建五保户信息统计
                  </Badge>
                  <Badge variant="secondary" className="text-xs gap-1">
                    <Bell className="w-3 h-3" />
                    通知所有户主
                  </Badge>
                  <Badge variant="secondary" className="text-xs gap-1">
                    <TrendingUp className="w-3 h-3" />
                    导出数据
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto h-screen flex flex-col p-4 gap-4">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm p-4 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center relative">
                <Bot className="w-6 h-6 text-white" />
                <Sparkles className="w-3 h-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  智能填表助理
                  <Zap className="w-4 h-4 text-yellow-500" />
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  乡村事务智能管理系统
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Badge variant="outline" className="gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                在线
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid lg:grid-cols-2 gap-4 min-h-0">
          {/* Chat Area */}
          <Card className="flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="text-base">对话区域</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' 
                          ? 'bg-blue-500' 
                          : 'bg-gradient-to-br from-blue-500 to-green-500'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="输入您的指令..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Display Area */}
          <div className="flex flex-col min-h-0">
            {renderContentArea()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

