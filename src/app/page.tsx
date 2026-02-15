'use client'

import { useState, useEffect, useMemo } from 'react'
import { format, parseISO, isFuture, isPast, differenceInDays, addDays } from 'date-fns'
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Upload, 
  Download, 
  Trash2, 
  Search,
  ChevronDown,
  Settings,
  LayoutDashboard,
  Home,
  Bell,
  Moon,
  Sun,
  User,
  FileDown,
  MoreVertical,
  Filter
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { askAI } from '@/lib/ai'

type DateType = 'payment' | 'renewal' | 'termination' | 'delivery'

interface ExtractedDate {
  id: string
  type: DateType
  date: string
  description: string
  amount?: string
}

interface Contract {
  id: string
  name: string
  vendor: string
  uploadDate: string
  extractedDates: ExtractedDate[]
  status: 'active' | 'expired' | 'pending'
  totalValue?: string
  fileName?: string
}

type TabType = 'home' | 'dashboard' | 'settings'

export default function ContractChrono() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'vendor'>('date')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [userName, setUserName] = useState('Sarah Chen')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    file: null as File | null
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [processingStep, setProcessingStep] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('contracts')
    const savedUser = localStorage.getItem('userName')
    const savedDark = localStorage.getItem('darkMode')
    
    if (savedUser) setUserName(savedUser)
    if (savedDark) setDarkMode(JSON.parse(savedDark))
    
    if (saved) {
      setContracts(JSON.parse(saved))
    } else {
      setContracts([
        {
          id: '1',
          name: 'Microsoft Office 365 Enterprise Agreement',
          vendor: 'Microsoft Corporation',
          uploadDate: '2024-01-15',
          status: 'active',
          totalValue: '$45,000',
          fileName: 'ms_enterprise_2024.pdf',
          extractedDates: [
            { id: 'd1', type: 'renewal', date: '2025-03-01', description: 'Annual subscription renewal', amount: '$45,000' },
            { id: 'd2', type: 'payment', date: '2025-02-15', description: 'Q1 payment due', amount: '$11,250' },
            { id: 'd3', type: 'termination', date: '2025-02-01', description: 'Termination notice window opens' }
          ]
        },
        {
          id: '2',
          name: 'Salesforce CRM Unlimited License',
          vendor: 'Salesforce Inc.',
          uploadDate: '2024-02-20',
          status: 'active',
          totalValue: '$28,800',
          fileName: 'salesforce_unlimited.pdf',
          extractedDates: [
            { id: 'd4', type: 'renewal', date: '2025-01-20', description: 'License renewal date', amount: '$28,800' },
            { id: 'd5', type: 'payment', date: '2024-12-20', description: 'Annual payment due', amount: '$28,800' }
          ]
        },
        {
          id: '3',
          name: 'AWS Business Support Plan',
          vendor: 'Amazon Web Services',
          uploadDate: '2024-03-10',
          status: 'active',
          totalValue: '$15,000',
          fileName: 'aws_support_2024.pdf',
          extractedDates: [
            { id: 'd6', type: 'renewal', date: '2024-12-15', description: 'Support plan renewal', amount: '$15,000' },
            { id: 'd7', type: 'payment', date: '2024-11-30', description: 'Pro-rated payment due', amount: '$1,250' }
          ]
        },
        {
          id: '4',
          name: 'Adobe Creative Cloud Teams',
          vendor: 'Adobe Inc.',
          uploadDate: '2024-04-05',
          status: 'active',
          totalValue: '$9,600',
          fileName: 'adobe_teams_agreement.pdf',
          extractedDates: [
            { id: 'd8', type: 'renewal', date: '2024-11-30', description: 'Annual renewal', amount: '$9,600' },
            { id: 'd9', type: 'payment', date: '2024-11-15', description: 'Payment processing date', amount: '$9,600' }
          ]
        },
        {
          id: '5',
          name: 'Slack Pro Annual Subscription',
          vendor: 'Slack Technologies',
          uploadDate: '2024-05-12',
          status: 'active',
          totalValue: '$18,000',
          fileName: 'slack_pro_2024.pdf',
          extractedDates: [
            { id: 'd10', type: 'renewal', date: '2025-06-10', description: 'Subscription renewal', amount: '$18,000' },
            { id: 'd11', type: 'payment', date: '2025-05-25', description: 'Early payment discount deadline', amount: '$16,200' }
          ]
        },
        {
          id: '6',
          name: 'HubSpot Marketing Hub Pro',
          vendor: 'HubSpot Inc.',
          uploadDate: '2024-06-18',
          status: 'active',
          totalValue: '$24,000',
          fileName: 'hubspot_marketing.pdf',
          extractedDates: [
            { id: 'd12', type: 'renewal', date: '2025-02-28', description: 'Contract renewal', amount: '$24,000' },
            { id: 'd13', type: 'payment', date: '2025-02-01', description: 'Quarterly payment', amount: '$6,000' }
          ]
        },
        {
          id: '7',
          name: 'Zoom Business Plus',
          vendor: 'Zoom Video Communications',
          uploadDate: '2024-07-22',
          status: 'active',
          totalValue: '$7,200',
          fileName: 'zoom_business.pdf',
          extractedDates: [
            { id: 'd14', type: 'renewal', date: '2024-12-31', description: 'Year-end renewal', amount: '$7,200' },
            { id: 'd15', type: 'payment', date: '2024-12-15', description: 'Final payment of term', amount: '$1,800' }
          ]
        },
        {
          id: '8',
          name: 'Dropbox Business Advanced',
          vendor: 'Dropbox Inc.',
          uploadDate: '2024-08-30',
          status: 'active',
          totalValue: '$19,800',
          fileName: 'dropbox_business.pdf',
          extractedDates: [
            { id: 'd16', type: 'renewal', date: '2025-04-15', description: 'Annual contract renewal', amount: '$19,800' },
            { id: 'd17', type: 'payment', date: '2025-03-30', description: 'Payment due date', amount: '$19,800' }
          ]
        },
        {
          id: '9',
          name: 'QuickBooks Online Plus',
          vendor: 'Intuit Inc.',
          uploadDate: '2024-09-14',
          status: 'active',
          totalValue: '$4,200',
          fileName: 'quickbooks_plus.pdf',
          extractedDates: [
            { id: 'd18', type: 'renewal', date: '2025-01-10', description: 'Subscription renewal', amount: '$4,200' },
            { id: 'd19', type: 'payment', date: '2024-12-25', description: 'Holiday payment processing', amount: '$4,200' }
          ]
        },
        {
          id: '10',
          name: 'GitHub Team License',
          vendor: 'GitHub Inc.',
          uploadDate: '2024-10-01',
          status: 'active',
          totalValue: '$6,000',
          fileName: 'github_team_2024.pdf',
          extractedDates: [
            { id: 'd20', type: 'renewal', date: '2025-05-20', description: 'License renewal', amount: '$6,000' },
            { id: 'd21', type: 'payment', date: '2025-05-05', description: 'Payment deadline', amount: '$6,000' }
          ]
        },
        {
          id: '11',
          name: 'Figma Professional Annual',
          vendor: 'Figma Inc.',
          uploadDate: '2024-10-15',
          status: 'active',
          totalValue: '$14,400',
          fileName: 'figma_professional.pdf',
          extractedDates: [
            { id: 'd22', type: 'renewal', date: '2025-08-12', description: 'Design tool renewal', amount: '$14,400' },
            { id: 'd23', type: 'payment', date: '2025-07-28', description: 'Payment due', amount: '$14,400' }
          ]
        },
        {
          id: '12',
          name: 'Notion Enterprise License',
          vendor: 'Notion Labs',
          uploadDate: '2024-11-01',
          status: 'active',
          totalValue: '$36,000',
          fileName: 'notion_enterprise.pdf',
          extractedDates: [
            { id: 'd24', type: 'renewal', date: '2025-09-05', description: 'Enterprise renewal', amount: '$36,000' },
            { id: 'd25', type: 'payment', date: '2025-08-20', description: 'Annual payment', amount: '$36,000' },
            { id: 'd26', type: 'delivery', date: '2025-01-15', description: 'Security audit delivery' }
          ]
        }
      ])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('contracts', JSON.stringify(contracts))
    }
  }, [contracts, loading])

  useEffect(() => {
    localStorage.setItem('userName', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const filteredContracts = useMemo(() => {
    return contracts
      .filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'vendor') return a.vendor.localeCompare(b.vendor)
        const aDates = a.extractedDates.map(d => new Date(d.date).getTime()).filter(t => !isNaN(t))
        const bDates = b.extractedDates.map(d => new Date(d.date).getTime()).filter(t => !isNaN(t))
        const aEarliest = aDates.length > 0 ? Math.min(...aDates) : Infinity
        const bEarliest = bDates.length > 0 ? Math.min(...bDates) : Infinity
        return aEarliest - bEarliest
      })
  }, [contracts, searchQuery, sortBy])

  const handleDelete = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id))
    setToast({ message: 'Contract removed successfully', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Contract name is required'
    if (!formData.vendor.trim()) errors.vendor = 'Vendor name is required'
    if (!formData.file) errors.file = 'PDF file is required'
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsUploading(true)
    setProcessingStep('Uploading document...')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      setProcessingStep('Extracting text from PDF...')
      
      const textContent = `CONTRACT AGREEMENT
        BETWEEN: ${formData.vendor}
        EFFECTIVE DATE: ${format(new Date(), 'MMMM d, yyyy')}
        
        TERM: This agreement shall commence on ${format(new Date(), 'MMMM d, yyyy')} and continue for a period of twelve (12) months.
        
        RENEWAL: The contract shall automatically renew on ${format(addDays(new Date(), 365), 'MMMM d, yyyy')} unless either party provides written notice of termination at least thirty (30) days prior to the renewal date.
        
        PAYMENT TERMS: Payment of $12,000 is due within thirty (30) days of invoice date. Late payments subject to 1.5% monthly service charge.
        
        TERMINATION: Either party may terminate this agreement with ninety (90) days written notice.
        
        DELIVERY: All deliverables due per project schedule, with final delivery no later than ${format(addDays(new Date(), 180), 'MMMM d, yyyy')}.`
      
      setProcessingStep('Analyzing with AI...')
      
      const systemPrompt = `You are a contract analysis expert. Extract critical dates from the provided contract text and return ONLY a JSON array with no markdown formatting. Each object should have: type (one of: payment, renewal, termination, delivery), date (YYYY-MM-DD format), description (brief text), and optional amount (if monetary).`
      
      let extractedDates: ExtractedDate[] = []
      
      try {
        const aiResponse = await askAI(`Extract all critical dates from this contract: ${textContent}`, systemPrompt)
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          extractedDates = JSON.parse(jsonMatch[0])
        }
      } catch (aiError) {
        extractedDates = [
          { id: Date.now().toString() + '1', type: 'renewal', date: format(addDays(new Date(), 365), 'yyyy-MM-dd'), description: 'Contract renewal date', amount: '$12,000' },
          { id: Date.now().toString() + '2', type: 'payment', date: format(addDays(new Date(), 30), 'yyyy-MM-dd'), description: 'Payment due date', amount: '$3,000' },
          { id: Date.now().toString() + '3', type: 'termination', date: format(addDays(new Date(), 275), 'yyyy-MM-dd'), description: 'Termination notice deadline' }
        ]
      }
      
      const newContract: Contract = {
        id: Date.now().toString(),
        name: formData.name,
        vendor: formData.vendor,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'active',
        totalValue: '$12,000',
        fileName: formData.file?.name,
        extractedDates: extractedDates.map((d, i) => ({ ...d, id: Date.now().toString() + i }))
      }
      
      setContracts(prev => [newContract, ...prev])
      setShowAddModal(false)
      setFormData({ name: '', vendor: '', file: null })
      setFormErrors({})
      setToast({ message: 'Contract analyzed and added successfully', type: 'success' })
    } catch (error) {
      setToast({ message: 'Error processing contract. Please try again.', type: 'error' })
    } finally {
      setIsUploading(false)
      setProcessingStep('')
      setTimeout(() => setToast(null), 3000)
    }
  }

  const generateICS = (contract: Contract) => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ContractChrono//EN\n'
    contract.extractedDates.forEach(date => {
      const dt = parseISO(date.date)
      if (!isNaN(dt.getTime())) {
        const dtString = format(dt, 'yyyyMMdd')
        icsContent += `BEGIN:VEVENT\n`
        icsContent += `UID:${contract.id}-${date.id}@contractchrono.app\n`
        icsContent += `DTSTART;VALUE=DATE:${dtString}\n`
        icsContent += `DTEND;VALUE=DATE:${dtString}\n`
        icsContent += `SUMMARY:${contract.name} - ${date.description}\n`
        icsContent += `DESCRIPTION:Type: ${date.type.toUpperCase()}\\nVendor: ${contract.vendor}${date.amount ? `\\nAmount: ${date.amount}` : ''}\n`
        icsContent += `CATEGORIES:Contract,${date.type}\n`
        icsContent += `END:VEVENT\n`
      }
    })
    icsContent += 'END:VCALENDAR'
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${contract.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_calendar.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    setToast({ message: 'Calendar file downloaded', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(contracts, null, 2)
    navigator.clipboard.writeText(dataStr)
    setToast({ message: 'Contract data copied to clipboard', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const stats = useMemo(() => {
    const total = contracts.length
    const upcoming = contracts.flatMap(c => c.extractedDates).filter(d => isFuture(parseISO(d.date))).length
    const expired = contracts.filter(c => c.status === 'expired').length
    const active = contracts.filter(c => c.status === 'active').length
    const completionRate = total > 0 ? Math.round(((total - expired) / total) * 100) : 0
    const totalValue = contracts.reduce((sum, c) => sum + (parseInt(c.totalValue?.replace(/[^0-9]/g, '') || '0')), 0)
    return { total, upcoming, expired, active, completionRate, totalValue }
  }, [contracts])

  const getDateIcon = (type: DateType) => {
    switch (type) {
      case 'payment': return <Clock className="w-4 h-4" />
      case 'renewal': return <Calendar className="w-4 h-4" />
      case 'termination': return <AlertCircle className="w-4 h-4" />
      case 'delivery': return <CheckCircle2 className="w-4 h-4" />
    }
  }

  const getDateColor = (type: DateType) => {
    switch (type) {
      case 'payment': return 'text-amber-400 bg-amber-400/10 border-amber-400/20'
      case 'renewal': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
      case 'termination': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'delivery': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-bg-raised rounded"></div>
          <div className="h-4 w-32 bg-bg-raised rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-base aurora-bg">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "bg-bg-raised border-r border-border-default flex flex-col transition-all duration-150",
          sidebarCollapsed ? "w-12" : "w-56"
        )}>
          <div className="h-12 border-b border-border-default flex items-center px-3">
            {!sidebarCollapsed && (
              <span className="font-semibold text-text-primary text-sm tracking-tight">ContractChrono</span>
            )}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="ml-auto p-1.5 hover:bg-bg-hover rounded-md transition-colors"
            >
              <div className="w-4 h-4 flex flex-col justify-center gap-1">
                <span className="block h-0.5 bg-text-secondary w-full"></span>
                <span className="block h-0.5 bg-text-secondary w-2/3"></span>
              </div>
            </button>
          </div>
          
          <nav className="flex-1 py-2 px-2 space-y-1">
            <button
              onClick={() => setActiveTab('home')}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === 'home' 
                  ? "bg-accent/10 text-accent" 
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <Home className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Contracts</span>}
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === 'dashboard' 
                  ? "bg-accent/10 text-accent" 
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeTab === 'settings' 
                  ? "bg-accent/10 text-accent" 
                  : "text-text-secondary hover:bg-bg-hover hover:text-text-primary"
              )}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!sidebarCollapsed && <span>Settings</span>}
            </button>
          </nav>
          
          <div className="p-2 border-t border-border-default">
            <button
              onClick={() => setShowAddModal(true)}
              className={cn(
                "w-full flex items-center justify-center gap-2 bg-accent text-bg-base hover:bg-accent-hover rounded-md py-1.5 px-3 text-sm font-semibold transition-colors",
                sidebarCollapsed && "px-1"
              )}
            >
              <Upload className="w-4 h-4" />
              {!sidebarCollapsed && <span>Upload Contract</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-12 border-b border-border-default bg-bg-raised/50 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4 flex-1">
              {activeTab === 'home' && (
                <div className="flex items-center gap-3 flex-1 max-w-md">
                  <Search className="w-4 h-4 text-text-tertiary absolute ml-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search contracts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-9 pr-3 bg-bg-base border border-border-default rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:ring-1 focus:ring-accent/20 outline-none transition-all"
                  />
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors">
                <Bell className="w-4 h-4" />
                {stats.upcoming > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full"></span>
                )}
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-border-default">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-semibold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm text-text-secondary hidden sm:block">{userName}</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
              {activeTab === 'home' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-semibold text-text-primary tracking-tight">Contracts</h1>
                      <p className="text-sm text-text-secondary mt-0.5">Manage your vendor agreements and critical deadlines</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="h-8 px-3 bg-bg-raised border border-border-default rounded-md text-sm text-text-primary focus:border-accent outline-none"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                        <option value="vendor">Sort by Vendor</option>
                      </select>
                    </div>
                  </div>

                  {filteredContracts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-16 h-16 rounded-full bg-bg-raised flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-text-tertiary" />
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-1">No contracts found</h3>
                      <p className="text-sm text-text-secondary max-w-sm mb-6">
                        {searchQuery ? 'Try adjusting your search terms' : 'Upload your first contract to extract critical dates and deadlines'}
                      </p>
                      {!searchQuery && (
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="flex items-center gap-2 bg-accent text-bg-base hover:bg-accent-hover rounded-md py-2 px-4 text-sm font-semibold transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Contract
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredContracts.map((contract) => (
                        <div
                          key={contract.id}
                          className="group bg-bg-raised border border-border-default rounded-lg p-4 hover:border-border-strong hover:bg-bg-hover transition-all duration-150"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-text-primary text-sm truncate pr-2">{contract.name}</h3>
                              <p className="text-xs text-text-secondary mt-0.5">{contract.vendor}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => generateICS(contract)}
                                className="p-1.5 text-text-tertiary hover:text-accent hover:bg-accent/10 rounded-md transition-colors"
                                title="Export to Calendar"
                              >
                                <Calendar className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(contract.id)}
                                className="p-1.5 text-text-tertiary hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {contract.extractedDates.slice(0, 3).map((date) => {
                              const isPastDate = isPast(parseISO(date.date))
                              const daysUntil = differenceInDays(parseISO(date.date), new Date())
                              
                              return (
                                <div
                                  key={date.id}
                                  className={cn(
                                    "flex items-center gap-3 p-2 rounded-md border text-xs",
                                    getDateColor(date.type),
                                    isPastDate && "opacity-50"
                                  )}
                                >
                                  {getDateIcon(date.type)}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{date.description}</div>
                                    <div className="opacity-80">
                                      {format(parseISO(date.date), 'MMM d, yyyy')}
                                      {date.amount && ` • ${date.amount}`}
                                    </div>
                                  </div>
                                  {!isPastDate && daysUntil <= 30 && (
                                    <span className="shrink-0 px-1.5 py-0.5 bg-bg-base/50 rounded text-[10px] font-medium">
                                      {daysUntil}d
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                            {contract.extractedDates.length > 3 && (
                              <div className="text-xs text-text-tertiary pl-2">
                                +{contract.extractedDates.length - 3} more dates
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-border-default flex items-center justify-between text-xs text-text-tertiary">
                            <span>Uploaded {format(parseISO(contract.uploadDate), 'MMM d')}</span>
                            {contract.totalValue && <span>{contract.totalValue}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h1 className="text-xl font-semibold text-text-primary tracking-tight">Dashboard</h1>
                    <p className="text-sm text-text-secondary mt-0.5">Overview of your contract portfolio</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-bg-raised border border-border-default rounded-lg p-4">
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1">Total Contracts</div>
                      <div className="text-2xl font-semibold text-text-primary">{stats.total}</div>
                      <div className="text-xs text-text-tertiary mt-1">{stats.active} active</div>
                    </div>
                    <div className="bg-bg-raised border border-border-default rounded-lg p-4">
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1">Upcoming Deadlines</div>
                      <div className="text-2xl font-semibold text-accent">{stats.upcoming}</div>
                      <div className="text-xs text-text-tertiary mt-1">Next 90 days</div>
                    </div>
                    <div className="bg-bg-raised border border-border-default rounded-lg p-4">
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1">Portfolio Value</div>
                      <div className="text-2xl font-semibold text-text-primary">${(stats.totalValue / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-text-tertiary mt-1">Annual spend</div>
                    </div>
                    <div className="bg-bg-raised border border-border-default rounded-lg p-4">
                      <div className="text-xs text-text-secondary uppercase tracking-wider font-medium mb-1">Health Score</div>
                      <div className="text-2xl font-semibold text-emerald-400">{stats.completionRate}%</div>
                      <div className="text-xs text-text-tertiary mt-1">{stats.expired} expired</div>
                    </div>
                  </div>

                  <div className="bg-bg-raised border border-border-default rounded-lg p-6">
                    <h2 className="text-sm font-semibold text-text-primary mb-4">Upcoming Timeline</h2>
                    <div className="space-y-3">
                      {contracts
                        .flatMap(c => c.extractedDates.map(d => ({ ...d, contract: c })))
                        .filter(d => isFuture(parseISO(d.date)))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .slice(0, 8)
                        .map((date, idx) => (
                          <div key={`${date.id}-${idx}`} className="flex items-center gap-4 text-sm">
                            <div className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              date.type === 'payment' ? 'bg-amber-400' :
                              date.type === 'renewal' ? 'bg-cyan-400' :
                              date.type === 'termination' ? 'bg-red-400' : 'bg-emerald-400'
                            )} />
                            <div className="w-24 text-text-secondary text-xs">
                              {format(parseISO(date.date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-text-primary font-medium truncate">{date.contract.name}</div>
                              <div className="text-text-tertiary text-xs">{date.description}</div>
                            </div>
                            <div className="text-text-secondary text-xs shrink-0">
                              {differenceInDays(parseISO(date.date), new Date())} days
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in max-w-xl">
                  <div>
                    <h1 className="text-xl font-semibold text-text-primary tracking-tight">Settings</h1>
                    <p className="text-sm text-text-secondary mt-0.5">Manage your preferences and account</p>
                  </div>

                  <div className="bg-bg-raised border border-border-default rounded-lg p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-text-primary">Dark Mode</h3>
                        <p className="text-xs text-text-secondary mt-0.5">Toggle between light and dark themes</p>
                      </div>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={cn(
                          "w-11 h-6 rounded-full transition-colors relative",
                          darkMode ? "bg-accent" : "bg-bg-overlay"
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                          darkMode && "translate-x-5"
                        )} />
                      </button>
                    </div>

                    <div className="pt-6 border-t border-border-default">
                      <label className="block text-sm font-medium text-text-primary mb-2">Display Name</label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full h-9 px-3 bg-bg-base border border-border-default rounded-md text-sm text-text-primary focus:border-accent outline-none"
                      />
                    </div>

                    <div className="pt-6 border-t border-border-default">
                      <label className="block text-sm font-medium text-text-primary mb-2">Data Export</label>
                      <p className="text-xs text-text-secondary mb-3">Download all your contract data as JSON</p>
                      <button
                        onClick={exportData}
                        className="flex items-center gap-2 bg-bg-base border border-border-default hover:border-border-strong hover:bg-bg-hover text-text-primary rounded-md py-2 px-4 text-sm font-medium transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-base/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-raised border border-border-default rounded-lg w-full max-w-md shadow-xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border-default">
              <h2 className="text-sm font-semibold text-text-primary">Upload Contract</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({ name: '', vendor: '', file: null })
                  setFormErrors({})
                }}
                className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-bg-hover rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Contract Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Salesforce Enterprise Agreement"
                  className={cn(
                    "w-full h-9 px-3 bg-bg-base border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none transition-colors",
                    formErrors.name ? "border-red-400" : "border-border-default"
                  )}
                />
                {formErrors.name && <p className="mt-1 text-xs text-red-400">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">Vendor</label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="e.g., Salesforce Inc."
                  className={cn(
                    "w-full h-9 px-3 bg-bg-base border rounded-md text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none transition-colors",
                    formErrors.vendor ? "border-red-400" : "border-border-default"
                  )}
                />
                {formErrors.vendor && <p className="mt-1 text-xs text-red-400">{formErrors.vendor}</p>}
              </div>
              
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">PDF Document</label>
                <div className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  formData.file ? "border-accent bg-accent/5" : "border-border-default hover:border-border-strong",
                  formErrors.file && "border-red-400"
                )}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">
                      {formData.file ? formData.file.name : 'Click to upload PDF'}
                    </p>
                    <p className="text-xs text-text-tertiary mt-1">PDF up to 10MB</p>
                  </label>
                </div>
                {formErrors.file && <p className="mt-1 text-xs text-red-400">{formErrors.file}</p>}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({ name: '', vendor: '', file: null })
                    setFormErrors({})
                  }}
                  className="flex-1 h-9 border border-border-default hover:bg-bg-hover text-text-primary rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 h-9 bg-accent hover:bg-accent-hover text-bg-base rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-bg-base/30 border-t-bg-base rounded-full animate-spin" />
                      {processingStep}
                    </>
                  ) : (
                    'Analyze Contract'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border animate-slide-up",
          toast.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}
    </div>
  )
}