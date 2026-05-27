/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Trophy,
  Search,
  CheckCircle,
  Circle,
  ArrowLeft,
  Download,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Calculator,
  Shapes,
  BarChart3,
  Brain,
  RotateCcw,
  Award,
  Check,
  CheckCircle2,
  ListRestart
} from 'lucide-react';

import {
  getParsedKnowledgePoints,
  KnowledgePoint,
  UI_CATEGORIES
} from './data';
import { renderLessonHtml } from './lessons';

export default function App() {
  // Parsing all 240+ elementary math knowledge points
  const knowledgePoints = useMemo(() => getParsedKnowledgePoints(), []);

  // 1. Current View State: 'dashboard' | 'detail'
  const [currentView, setCurrentView] = useState<'dashboard' | 'detail'>('dashboard');

  // 2. LocalStorage Persistence of Completed IDs
  const [completedIds, setCompletedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('MATH_PREP_COMPLETED_V2');
      return saved ? new Set<string>(JSON.parse(saved)) : new Set<string>();
    } catch (e) {
      return new Set<string>();
    }
  });

  // Track active knowledge point
  const [activePoint, setActivePoint] = useState<KnowledgePoint | null>(null);

  // Search, category filter and grade filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('全部');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  // Sidebar expand/collapse memory states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<Record<string, boolean>>({});

  // Mobile sidebar visible drawer?
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Celebratory confetti overlay after solving a quiz!
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedTopic, setCelebratedTopic] = useState('');

  // Auto scroll/focus on active lesson card
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Persist checked accomplishments
  const saveCompletedSet = (newSet: Set<string>) => {
    setCompletedIds(newSet);
    localStorage.setItem('MATH_PREP_COMPLETED_V2', JSON.stringify(Array.from(newSet)));
  };

  // Check off or toggle single point
  const handleToggleComplete = (kpId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation(); // prevent select trigger if clicking checkbox
    const updated = new Set<string>(completedIds);
    if (updated.has(kpId)) {
      updated.delete(kpId);
    } else {
      updated.add(kpId);
    }
    saveCompletedSet(updated);
  };

  // Clean all records to start fresh
  const handleResetProgress = () => {
    if (window.confirm('确定要清除所有自学打卡进度，回到起点重新出发吗？')) {
      const empty = new Set<string>();
      saveCompletedSet(empty);
    }
  };

  // Quick statistics calculated on the fly
  const totalCount = knowledgePoints.length;
  const completedCount = completedIds.size;
  const totalPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Grouped counts by category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {
      '数与代数': { total: 0, completed: 0 },
      '图形与几何': { total: 0, completed: 0 },
      '统计与概率': { total: 0, completed: 0 },
      '综合与实践': { total: 0, completed: 0 }
    };
    knowledgePoints.forEach(kp => {
      if (stats[kp.category]) {
        stats[kp.category].total++;
        if (completedIds.has(kp.id)) {
          stats[kp.category].completed++;
        }
      }
    });
    return stats;
  }, [completedIds, knowledgePoints]);

  // Unique lists of grades from data to build filters
  const allGrades = useMemo(() => {
    const grades = new Set<string>();
    knowledgePoints.forEach(kp => {
      if (kp.grade) grades.add(kp.grade);
    });
    return ['全部', ...Array.from(grades).sort()];
  }, [knowledgePoints]);

  // Group data for the 3-level tree: Category -> SubCategory -> KnowledgePoint
  // Respects search search filters and grade selections
  const filteredNavTree = useMemo(() => {
    // Phase 1: Filter raw list
    const filteredPoints = knowledgePoints.filter(kp => {
      const matchSearch =
        searchQuery.trim() === '' ||
        kp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kp.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchGrade = selectedGrade === '全部' || kp.grade === selectedGrade;
      const matchCategory = selectedCategory === '全部' || kp.category === selectedCategory;
      
      return matchSearch && matchGrade && matchCategory;
    });

    // Phase 2: Assemble into tree structure
    const tree: Record<string, Record<string, KnowledgePoint[]>> = {};

    filteredPoints.forEach(kp => {
      if (!tree[kp.category]) {
        tree[kp.category] = {};
      }
      if (!tree[kp.category][kp.subCategory]) {
        tree[kp.category][kp.subCategory] = [];
      }
      tree[kp.category][kp.subCategory].push(kp);
    });

    return tree;
  }, [knowledgePoints, searchQuery, selectedGrade, selectedCategory]);

  // Handle message from iframe (from the solved Quiz action)
  useEffect(() => {
    const handleQuizSolvedMessage = (e: MessageEvent) => {
      if (e.data?.type === 'KNOWLEDGE_MASTERED') {
        const finishedId = e.data.id;
        const kp = knowledgePoints.find(p => p.id === finishedId || p.name === finishedId.split('-').pop());
        if (kp) {
          const newSet = new Set<string>(completedIds);
          if (!newSet.has(kp.id)) {
            newSet.add(kp.id);
            saveCompletedSet(newSet);
            setCelebratedTopic(kp.name);
            setShowCelebration(true);
          }
        }
      }
    };

    window.addEventListener('message', handleQuizSolvedMessage);
    return () => window.removeEventListener('message', handleQuizSolvedMessage);
  }, [completedIds, knowledgePoints]);

  // Auto Expand categories if search triggers or category is pre-selected
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      const autoCats: Record<string, boolean> = {};
      const autoSubs: Record<string, boolean> = {};
      Object.keys(filteredNavTree).forEach(cat => {
        autoCats[cat] = true;
        Object.keys(filteredNavTree[cat]).forEach(sub => {
          autoSubs[`${cat}-${sub}`] = true;
        });
      });
      setExpandedCategories(prev => ({ ...prev, ...autoCats }));
      setExpandedSubCategories(prev => ({ ...prev, ...autoSubs }));
    }
  }, [searchQuery, filteredNavTree]);

  // Expand helper
  const toggleCategoryExpand = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSubCategoryExpand = (cat: string, sub: string) => {
    const key = `${cat}-${sub}`;
    setExpandedSubCategories(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Navigating into details focusing on a specific category
  const enterStudyDetails = (categoryName?: string) => {
    if (categoryName) {
      setSelectedCategory(categoryName);
      // Auto-expand this category
      setExpandedCategories(prev => ({ ...prev, [categoryName]: true }));
      // Set the first knowledge point of this category as active by default
      const firstKp = knowledgePoints.find(kp => kp.category === categoryName);
      if (firstKp) {
        setActivePoint(firstKp);
      }
    } else {
      setSelectedCategory('全部');
      if (!activePoint && knowledgePoints.length > 0) {
        setActivePoint(knowledgePoints[0]);
      }
    }
    setCurrentView('detail');
    setMobileSidebarOpen(false);
  };

  // Generate dynamic award grade based on percentage accomplished
  const getBadgeTitle = (pct: number) => {
    if (pct === 0) return '启航探索童鞋 🚀';
    if (pct < 15) return '数学小萌新 ☘️';
    if (pct < 35) return '算术能手 🧮';
    if (pct < 60) return '几何大星探 🌟';
    if (pct < 85) return '思维小博士 🎓';
    if (pct < 100) return '数理大掌门 🏆';
    return '数学超能魔法大师 🎉👑';
  };

  // Export Courses - generating CSV of ALL "uncompleted" / "未勾选" knowledge points with BOM
  const handleExportCSV = () => {
    const uncompleted = knowledgePoints.filter(kp => !completedIds.has(kp.id));
    if (uncompleted.length === 0) {
      alert('太棒啦！你已经完成了全书所有项目的打卡，没有未完的自学任务啦！🎊');
      return;
    }

    // Include UTF-8 BOM to survive Excel loading in Chinese
    let csvString = '\uFEFF';
    csvString += '主分类,二级子分类,知识点自学名称,推荐学级,当前状态\n';
    
    uncompleted.forEach(p => {
      const cleanCat = p.category.replace(/"/g, '""');
      const cleanSub = p.subCategory.replace(/"/g, '""');
      const cleanName = p.name.replace(/"/g, '""');
      const cleanGrade = p.grade.replace(/"/g, '""');
      csvString += `"${cleanCat}","${cleanSub}","${cleanName}","${cleanGrade}","计划预习中"\n`;
    });

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.setAttribute('download', `未学数学知识预习规划课表_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Quick category icon map
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case '数与代数':
        return <Calculator className="w-6 h-6 text-emerald-600" />;
      case '图形与几何':
        return <Shapes className="w-6 h-6 text-cyan-600" />;
      case '统计与概率':
        return <BarChart3 className="w-6 h-6 text-amber-600" />;
      default:
        return <Brain className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7fee7] to-[#ecfdf5] text-slate-800 selection:bg-emerald-200 selection:text-emerald-900 leading-relaxed font-sans antialiased relative">
      
      {/* Background cute blobs for childlike aesthetics */}
      <div className="absolute top-10 left-5 w-48 h-48 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none animate-bounce-slow" />
      <div className="absolute top-1/2 right-12 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none animate-pulse" />
      <div className="absolute bottom-16 left-1/3 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

      {/* Primary header branding with soft kid-appealing details */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-lime-200/50 px-4 py-3 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-lime-500 text-white p-2 rounded-2xl shadow-md border-b-4 border-lime-700 hover:rotate-3 transition-transform cursor-pointer" onClick={() => setCurrentView('dashboard')}>
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight flex items-center gap-2">
                数学知识点提前学
                <span className="hidden sm:inline-block text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full border border-emerald-200">
                  小学自主必修版
                </span>
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                让数学变成通关好玩的魔法大冒险！
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download Study Schedule button */}
            <button
              onClick={handleExportCSV}
              id="btnExport"
              className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm px-3 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-300 shadow-sm transition active:scale-95"
              title="导出包含所有未勾选自学规划的日程课表"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">下载未学规划</span>
              <span className="md:hidden">自学课表</span>
            </button>

            {/* Reset study metrics */}
            <button
              onClick={handleResetProgress}
              id="btnReset"
              className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl border border-rose-100 transition"
              title="还原所有自学打卡进度"
            >
              <ListRestart className="w-4 h-4" />
            </button>

            {/* Back to dashboard tab is view-specific */}
            {currentView === 'detail' && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm px-4 py-2 rounded-xl border-b-4 border-emerald-700 active:transform active:translate-y-0.5 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回主页</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        
        {/* VIEW 1: Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Top Ring Progress Banner */}
            <section className="bg-white rounded-3xl border-4 border-emerald-100 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden" id="dashboardHeroBanner">
              <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100/60 text-emerald-800 font-black px-3 py-1.5 rounded-2xl border border-emerald-200 text-xs tracking-wider uppercase">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                  我的自学大沙盘
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                  Hi👋 新一代数学小达人！
                </h2>
                
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  这里为你汇聚了全书 <span className="text-emerald-600 font-bold">{totalCount}</span> 个精炼的数学知识大宝藏。
                  无论是深奥的「数与代数」，还是立体的「图形与几何」，你都可以随时打卡、提前开考、攻破例题关卡！
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  {/* Enter Study Button */}
                  <button
                    onClick={() => enterStudyDetails()}
                    id="btn-enter-catalog"
                    className="w-full sm:w-auto bg-lime-500 hover:bg-lime-600 text-white text-md font-black px-8 py-4 rounded-2xl shadow-lg border-b-4 border-lime-700 transition active:scale-[98%]"
                  >
                    🎯 进入提前学目录 🎯
                  </button>
                  
                  <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border-2 border-amber-100 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold">
                    <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                    荣誉称号: {getBadgeTitle(totalPct)}
                  </div>
                </div>
              </div>

              {/* Ring Progress Indicator ("环形进度条") */}
              <div className="flex flex-col items-center justify-center bg-lime-50/50 p-6 rounded-3xl border border-lime-100/50 shadow-inner sm:min-w-[240px]" id="totalProgressRing">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="10"
                    />
                    {/* Active dynamic visual circle ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * totalPct) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  {/* Inner label content */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-emerald-950">{totalPct}%</span>
                    <span className="text-xs font-bold text-emerald-700/80 mt-0.5">总自学进度</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold mt-1">
                      {completedCount} / {totalCount}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Category selection and progress layout */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-emerald-950 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  四大核心自学课程板块
                </h3>
                <span className="text-xs font-bold text-slate-500">点击各大卡片，直接前往具体板块沙盘</span>
              </div>

              {/* Grid with 4 beautiful cartoon cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {UI_CATEGORIES.map(category => {
                  const stat = categoryStats[category.name] || { total: 0, completed: 0 };
                  const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
                  
                  return (
                    <div
                      key={category.name}
                      onClick={() => enterStudyDetails(category.name)}
                      className={`cursor-pointer border-3 rounded-3xl p-5 sm:p-6 transition-all duration-300 transform hover:-translate-y-1.5 shadow-md hover:shadow-xl group relative overflow-hidden flex flex-col justify-between ${category.color}`}
                    >
                      {/* Interactive splash background patterns */}
                      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-current opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl ${category.iconColor} shadow-md`}>
                              {getCategoryIcon(category.name)}
                            </div>
                            <h4 className="text-md sm:text-lg font-black text-slate-900 group-hover:text-emerald-950 transition-colors">
                              {category.name}
                            </h4>
                          </div>
                          
                          <span className="text-xs font-bold text-slate-700 bg-white/60 px-2.5 py-1 rounded-full border border-black/5">
                            已学 {stat.completed} / {stat.total}
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 font-medium">
                          {category.description}
                        </p>
                      </div>

                      {/* Bar progress layout */}
                      <div className="space-y-1.5 mt-5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                          <span>预习达成率</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="w-full bg-black/10 rounded-full h-3 overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full rounded-full transition-all duration-700 ${category.progressBarColor}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick tips and instructions */}
            <section className="bg-amber-50/50 rounded-2xl border-2 border-dashed border-amber-200 p-4 sm:p-5 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="text-xs sm:text-sm text-amber-900 font-medium space-y-1">
                <p className="font-bold">小朋友，家长和老师温馨指南：</p>
                <p>1. <b>提前自主预习</b> 能够大大激发课堂学习兴趣，培养独立思考的数学素养！</p>
                <p>2. 在知识点详情页中，点击右侧的<b>“帮我批改”</b>可以回答各魔法关卡配套题目，答对将直接进行<b>自学认证打卡</b>！</p>
              </div>
            </section>
          </div>
        )}


        {/* VIEW 2: Detailing page content */}
        {currentView === 'detail' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
            
            {/* Mobile directory floating drawer button */}
            <div className="lg:hidden flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-800 text-sm">
                  当前学习模块: {selectedCategory === '全部' ? '全部分类' : selectedCategory}
                </span>
                {activePoint && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                    {activePoint.name}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 py-1.5 rounded-lg active:scale-95 transition"
              >
                <Menu className="w-4 h-4" />
                <span>知识导航目录</span>
              </button>
            </div>

            {/* Sidebar Column: Left menu panel */}
            <aside
              className={`
                lg:col-span-4 bg-white border-3 border-lime-100 p-4 rounded-3xl shadow-lg space-y-4
                fixed lg:relative inset-y-0 left-0 w-80 lg:w-auto h-full lg:h-[calc(100vh-140px)] z-50 lg:z-10
                transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                transition-transform duration-300 ease-in-out flex flex-col overflow-hidden
              `}
              id="sidebarLearningList"
            >
              {/* Sidebar Header Container */}
              <div className="flex items-center justify-between lg:hidden pb-2 border-b">
                <h4 className="font-black text-emerald-800 flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  数学知识大目录
                </h4>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Category selector in inside sidebar */}
              <div className="space-y-1 shrink-0">
                <label className="text-xs font-black tracking-wider text-slate-400 uppercase">
                  自学学科模块
                </label>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-700 outline-none transition"
                >
                  <option value="全部">🌈 全套知识面（全部4大板块）</option>
                  <option value="数与代数">🧮 数与代数</option>
                  <option value="图形与几何">📐 图形与几何</option>
                  <option value="统计与概率">📊 统计与概率</option>
                  <option value="综合与实践">🧠 综合与实践</option>
                </select>
              </div>

              {/* Grade selectors for quick filters */}
              <div className="space-y-1.5 shrink-0">
                <label className="text-xs font-black tracking-wider text-slate-400 uppercase block">
                  年级难度
                </label>
                <div className="flex flex-wrap gap-1">
                  {allGrades.map(grade => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`
                        text-xs px-2.5 py-1.5 rounded-lg border font-bold transition whitespace-nowrap
                        ${
                          selectedGrade === grade
                            ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                        }
                      `}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Widget inside the sidebar */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="查找你想要的知识点..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:bg-white rounded-2xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-bold text-slate-700 placeholder-slate-400 outline-none transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    清除
                  </button>
                )}
              </div>

              {/* 3-Level Folder Navigation Tree Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 select-none" id="scrollTreeNavigation">
                {Object.keys(filteredNavTree).length === 0 ? (
                  <div className="text-center py-8 px-4 text-slate-400 font-medium">
                    <p className="text-3xl">🧩</p>
                    <p className="text-xs mt-2">没有找到匹配的知识宝箱哦</p>
                    <p className="text-[11px] text-slate-400 mt-1">试试筛选其他年级或输入其他字词</p>
                  </div>
                ) : (
                  Object.keys(filteredNavTree).map(categoryName => {
                    const isCatExpanded = !!expandedCategories[categoryName];
                    const subCategories = filteredNavTree[categoryName];
                    const totalPointsInCat = (Object.values(subCategories) as KnowledgePoint[][]).reduce((sum, list) => sum + list.length, 0);

                    return (
                      <div key={categoryName} className="border border-slate-100 rounded-2xl bg-slate-50/50 p-1 space-y-1">
                        
                        {/* LEVEL 1: Category Folding Header */}
                        <div
                          onClick={() => toggleCategoryExpand(categoryName)}
                          className={`
                            flex items-center justify-between p-2.5 rounded-xl cursor-pointer hover:bg-emerald-50/50 transition-colors
                            ${isCatExpanded ? 'bg-emerald-50/40 text-emerald-950 font-extrabold' : 'text-slate-700 font-black'}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {isCatExpanded ? (
                              <ChevronDown className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm">{categoryName}</span>
                          </div>
                          
                          <span className="text-[10px] font-bold bg-white/80 border border-slate-200/50 text-slate-500 px-2.5 py-0.5 rounded-md">
                            {totalPointsInCat}
                          </span>
                        </div>

                        {/* LEVEL 2 & 3: Sub categories and points */}
                        {isCatExpanded && (
                          <div className="pl-2 pr-1 pb-1 space-y-1">
                            {Object.keys(subCategories).map(subName => {
                              const pointsList = subCategories[subName];
                              const subKey = `${categoryName}-${subName}`;
                              const isSubExpanded = !!expandedSubCategories[subKey];

                              return (
                                <div key={subName} className="border border-slate-100 rounded-xl bg-white p-1 space-y-0.5">
                                  
                                  {/* SubCategory Heading tag */}
                                  <div
                                    onClick={() => toggleSubCategoryExpand(categoryName, subName)}
                                    className={`
                                      flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors text-xs font-black
                                      ${isSubExpanded ? 'text-emerald-800 bg-emerald-50/20' : 'text-slate-600'}
                                    `}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      {isSubExpanded ? (
                                        <ChevronDown className="w-3 h-3 text-emerald-600 shrink-0" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                                      )}
                                      <span>{subName}</span>
                                    </div>
                                    <span className="text-[9px] bg-slate-100 text-slate-500 font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                      {pointsList.length}
                                    </span>
                                  </div>

                                  {/* LEVEL 3: End Knowledge point list */}
                                  {isSubExpanded && (
                                    <div className="pl-3 pr-1 pt-0.5 space-y-1 border-l-2 border-slate-100/60 ml-2.5">
                                      {pointsList.map(point => {
                                        const isCompleted = completedIds.has(point.id);
                                        const isActive = activePoint?.id === point.id;

                                        return (
                                          <div
                                            key={point.id}
                                            onClick={() => {
                                              setActivePoint(point);
                                              setMobileSidebarOpen(false);
                                            }}
                                            className={`
                                              group flex items-center justify-between px-2.5 py-2.5 rounded-lg border cursor-pointer transition-all duration-150 text-xs font-semibold
                                              ${
                                                isActive
                                                  ? 'bg-lime-500 text-white border-lime-600 shadow-sm'
                                                  : 'bg-white hover:bg-slate-50/50 text-slate-700 border-slate-100 hover:border-slate-200'
                                              }
                                            `}
                                          >
                                            <div className="flex items-center gap-2 max-w-[80%]">
                                              {/* Check-off status circle */}
                                              <button
                                                type="button"
                                                onClick={e => handleToggleComplete(point.id, e)}
                                                className={`
                                                  p-0.5 rounded-full outline-none transition transform hover:scale-110 shrink-0
                                                  ${isActive ? 'text-white' : isCompleted ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'}
                                                `}
                                              >
                                                {isCompleted ? (
                                                  <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                  <Circle className="w-4 h-4" />
                                                )}
                                              </button>
                                              <span className="truncate" title={point.name}>
                                                {point.name}
                                              </span>
                                            </div>

                                            {/* Grade label */}
                                            <span
                                              className={`
                                                text-[9px] font-black px-1.5 py-0.5 rounded shrink-0
                                                ${
                                                  isActive
                                                    ? 'bg-lime-600 text-white'
                                                    : isCompleted
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-slate-100 text-slate-500'
                                                }
                                              `}
                                            >
                                              {point.grade.replace('年级', '')}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    );
                  })
                )}
              </div>

              {/* Reset filter stats indicators under the sidebar */}
              <div className="shrink-0 p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-500 space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span>当前大筛选下:</span>
                  <span className="font-bold text-slate-700">
                    {knowledgePoints.filter(kp => {
                      const matchGrade = selectedGrade === '全部' || kp.grade === selectedGrade;
                      const matchCategory = selectedCategory === '全部' || kp.category === selectedCategory;
                      return matchGrade && matchCategory;
                    }).length} 个知识点
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGrade('全部');
                    setSelectedCategory('全部');
                  }}
                  className="w-full text-center bg-white hover:bg-slate-100 text-slate-600 font-bold py-1 px-2 rounded-lg border border-slate-200 transition"
                >
                  重置所有过滤器
                </button>
              </div>

            </aside>


            {/* Content Study Window Column: Right side */}
            <section className="lg:col-span-8 space-y-4">
              
              {activePoint ? (
                <div className="bg-white rounded-3xl border-3 border-lime-100 p-4 sm:p-6 shadow-xl flex flex-col space-y-4 min-h-[500px]">
                  
                  {/* Active Point Card Header controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-400">{activePoint.category}</span>
                        <span className="text-slate-300 font-light text-xs">/</span>
                        <span className="text-xs font-black text-slate-500">{activePoint.subCategory}</span>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
                        {activePoint.name}
                        <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          {activePoint.grade}
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
                      {/* Check-off status button inside active title */}
                      <button
                        onClick={() => handleToggleComplete(activePoint.id)}
                        className={`
                          flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 border-b-4
                          ${
                            completedIds.has(activePoint.id)
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          }
                        `}
                      >
                        {completedIds.has(activePoint.id) ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                            <span>完成打卡（已学会）</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-slate-400" />
                            <span>预学打卡（未学会）</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* HTML IFrame Viewer: Loads dynamic child-oriented mathematical course */}
                  <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-100 bg-white shadow-inner flex-1" style={{ minHeight: '520px' }}>
                    <iframe
                      ref={iframeRef}
                      title={activePoint.name}
                      src={`./knowledge/${encodeURIComponent(activePoint.name)}.html`}
                      srcDoc={renderLessonHtml(activePoint)}
                      className="w-full h-full border-0 absolute inset-0"
                      referrerPolicy="no-referrer"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>

                  {/* Footnotes for guidance */}
                  <div className="flex items-center justify-between text-xs text-slate-400/80 px-2">
                    <span className="font-medium">⚠️ 答完题点击 iframe 中的【帮我批改】可触发通识自学打卡奖励哦！</span>
                    <span>大圆角自学游戏沙盒</span>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-3xl border-3 border-lime-100 p-12 text-center shadow-xl space-y-4">
                  <p className="text-4xl">🦉</p>
                  <h3 className="text-lg font-black text-emerald-990">哈啰！先挑选一个你想挑战的数学宝盒吧！</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    左侧目录配备了 1 到 6 年级完备的数学大纲关卡，你可以搜索拼写词、或挑选大板块，提前开学！
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        if (knowledgePoints.length > 0) {
                          setActivePoint(knowledgePoints[0]);
                        }
                      }}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl border-b-4 border-emerald-700 active:scale-95 transition"
                    >
                      帮我选第一个知识点 🚀
                    </button>
                  </div>
                </div>
              )}

            </section>

          </div>
        )}

      </main>

      {/* Floating Celebratory Congratulatory Confetti Overlay inside Parent Window */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl border-4 border-amber-300 max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              {/* Confetti effect inside standard components */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-5xl">
                🏵️👑🥇
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="text-sm font-black text-amber-600 tracking-wider uppercase">
                  ⭐ 关卡通关自学打卡大成功 ⭐
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-emerald-800">
                  答对啦！太聪明了！
                </h4>
                <div className="bg-emerald-50 text-emerald-800 border-2 border-emerald-100 p-3 rounded-2xl text-xs sm:text-sm font-bold antialiased">
                  已学会: <span className="text-slate-900 font-extrabold">{celebratedTopic}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500">
                恭喜你又多掌握了一个精彩的数学魔法奥秘！我们把代表荣誉的心愿小打卡贴在了自学目录中奖励你！继续加油挑战，通关更多的星星印章吧！
              </p>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCelebration(false)}
                  className="w-full bg-lime-500 hover:bg-lime-600 text-white font-black py-3 rounded-2xl shadow border-b-4 border-lime-700 active:scale-95 transition text-sm flex items-center justify-center gap-1"
                >
                  <Check className="w-5 h-5" />
                  <span>收下勋章，继续学习</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer copyright */}
      <footer className="bg-white/40 border-t border-slate-200/50 py-6 text-center text-xs text-slate-400 mt-12">
        <p className="font-semibold">&copy; 小学生数学提前学自主自控学习沙箱室 | 让孩子爱上思考的魔力画图板</p>
        <p className="text-[10px] mt-1 text-slate-400/80">
          基于 React 与 Tailwind CSS 全情构建 - 纯净童趣设计 • 100% 数据本地安全驻存
        </p>
      </footer>
      
    </div>
  );
}
