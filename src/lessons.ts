/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KnowledgePoint } from './data';

interface LessonContent {
  title: string;
  emoji: string;
  illustrationSvg: string;
  concept: string;
  example: string;
  quizQuestion: string;
  quizPlaceholder: string;
  quizAnswer: string;
  quizExplanation: string;
}

// Generates dynamic customized course material for 240+ math knowledge points
export function getLessonContent(kp: KnowledgePoint): LessonContent {
  const name = kp.name;
  const category = kp.category;

  // Let's build specialized templates based on names/keywords to give highly tailored content!
  if (name.includes('10以内') || name.includes('0的认识') || name.includes('11-20')) {
    return {
      title: `${name} 魔法屋`,
      emoji: '🎈',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-3">
          <circle cx="60" cy="60" r="25" fill="#fecdd3" stroke="#f43f5e" stroke-width="3"/>
          <text x="60" y="68" font-size="24" font-weight="bold" fill="#f43f5e" text-anchor="middle">1</text>
          
          <circle cx="130" cy="60" r="25" fill="#fef08a" stroke="#eab308" stroke-width="3"/>
          <text x="130" y="68" font-size="24" font-weight="bold" fill="#eab308" text-anchor="middle">2</text>
          
          <circle cx="200" cy="60" r="25" fill="#bbf7d0" stroke="#22c55e" stroke-width="3"/>
          <text x="200" y="68" font-size="24" font-weight="bold" fill="#22c55e" text-anchor="middle">3</text>
          
          <circle cx="270" cy="60" r="25" fill="#bfdbfe" stroke="#3b82f6" stroke-width="3"/>
          <text x="270" y="68" font-size="24" font-weight="bold" fill="#3b82f6" text-anchor="middle">4</text>
          
          <circle cx="340" cy="60" r="25" fill="#d8b4fe" stroke="#a855f7" stroke-width="3"/>
          <text x="340" y="68" font-size="24" font-weight="bold" fill="#a855f7" text-anchor="middle">5</text>
        </svg>
      `,
      concept: '数字就像一串亮闪闪的珍珠，不仅能代表东西的数量（比如3只可爱兔子🐰），还能代表排列的顺序（比如排在第3个）哦！0表示一个也没有。',
      example: '瞧！盘子里有3个大苹果，吃掉了3个，剩下的苹果数量就是：3 - 3 = 0 个。',
      quizQuestion: '排在第4前面的一个数字是几呢？',
      quizPlaceholder: '输入一个字母或数字...',
      quizAnswer: '3',
      quizExplanation: '4的前面一个是3，因为按顺序数是：1, 2, 3, 4, 5。'
    };
  }

  if (name.includes('加法') && !name.includes('分数') && !name.includes('小数')) {
    return {
      title: `${name} 大冲关`,
      emoji: '➕',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- 2 apples -->
          <circle cx="80" cy="60" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="110" cy="60" r="15" fill="#ef4444" opacity="0.8" />
          <text x="95" y="105" font-size="14" fill="#ef4444" font-weight="bold" text-anchor="middle">2个苹果</text>
          
          <!-- Plus -->
          <text x="180" y="70" font-size="32" fill="#10b981" font-weight="bold" text-anchor="middle">+</text>
          
          <!-- 3 apples -->
          <circle cx="250" cy="60" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="280" cy="60" r="15" fill="#ef4444" opacity="0.8" />
          <circle cx="265" cy="40" r="15" fill="#ef4444" opacity="0.8" />
          <text x="265" y="105" font-size="14" fill="#ef4444" font-weight="bold" text-anchor="middle">3个苹果</text>
        </svg>
      `,
      concept: '加法就是把两部分或者几部分“合起来”，变成一个新的好朋友！加法运算中，合起来以前的数量叫“加数”，合起来以后的总数叫“和”。',
      example: '树上有 2 只小鸟🦜，又飞来了 3 只小鸟🦜。现在一共有多少只鸟呢？列式就是 2 + 3 = 5 只！',
      quizQuestion: '小熊有 5 粒粉色糖果，小猴送给它 4 粒黄色糖果，它现在一共有多少粒糖果？',
      quizPlaceholder: '糖果总数...',
      quizAnswer: '9',
      quizExplanation: '用加法把两部分合起来：5 ＋ 4 ＝ 9（粒）。'
    };
  }

  if (name.includes('减法') && !name.includes('分数') && !name.includes('小数')) {
    return {
      title: `${name} 游乐场`,
      emoji: '➖',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <circle cx="100" cy="60" r="20" fill="#22c55e" opacity="0.3" stroke="#22c55e" stroke-dasharray="4"/>
          <line x1="85" y1="45" x2="115" y2="75" stroke="#ef4444" stroke-width="4"/>
          <line x1="115" y1="45" x2="85" y2="75" stroke="#ef4444" stroke-width="4"/>
          
          <circle cx="200" cy="60" r="20" fill="#22c55e"/>
          <circle cx="280" cy="60" r="20" fill="#22c55e"/>
          <text x="190" y="100" font-size="12" fill="#1e293b" font-weight="bold">剩下了这两个！</text>
        </svg>
      `,
      concept: '减法就是从一个总数里面“拿走”或者“去掉”一部分，求剩下的是多少。减去前面的那个总数叫做“被减数”，割舍掉的原数量叫做“减数”，结果叫“差”。',
      example: '兔妈妈采了 6 朵蘑菇🍄，小兔吃掉了 2 朵。还剩几朵蘑菇？计算：6 - 2 = 4 朵！',
      quizQuestion: '盘子里原有 12 块香喷喷的小饼干，小狗吃掉了 5 块。还剩下几块小饼干呢？',
      quizPlaceholder: '饼干数量...',
      quizAnswer: '7',
      quizExplanation: '从总数 12 中拿走 5，列式为：12 - 5 ＝ 7。'
    };
  }

  if (name.includes('乘法') && !name.includes('分数') && !name.includes('小数')) {
    return {
      title: `${name} 的魔法`,
      emoji: '✖️',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <g transform="translate(40,10)">
            <rect x="0" y="10" width="80" height="50" rx="8" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="25" cy="35" r="10" fill="#ef4444"/>
            <circle cx="55" cy="35" r="10" fill="#ef4444"/>
          </g>
          <text x="150" y="50" font-size="28" fill="#3b82f6">+</text>
          <g transform="translate(180,10)">
            <rect x="0" y="10" width="80" height="50" rx="8" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
            <circle cx="25" cy="35" r="10" fill="#ef4444"/>
            <circle cx="55" cy="35" r="10" fill="#ef4444"/>
          </g>
          <text x="130" y="100" font-size="14" fill="#475569" font-weight="bold" text-anchor="middle">有2个盒子，每个放2个，也就是 2 &times; 2</text>
        </svg>
      `,
      concept: '乘法是求几个相同加数和的简便算法。例如，有4个盘子，每个盘子里放了3个草莓，我们不用3+3+3+3，只要用乘法：3 × 4 = 12 就可以啦！',
      example: '5 × 3 表示 3 个 5 相加，或者是 5 个 3 相加。结果为 15。',
      quizQuestion: '一辆玩具小汽车有 4 个软轮子，5 辆这样的小汽车一共有多少个轮子呢？',
      quizPlaceholder: '轮子总数...',
      quizAnswer: '20',
      quizExplanation: '每辆车 4 个轮子，共有 5 辆，列式计算：4 × 5 ＝ 20（个）。'
    };
  }

  if (name.includes('除法') && !name.includes('分数') && !name.includes('小数')) {
    return {
      title: `${name} 分一分`,
      emoji: '➗',
      illustrationSvg: `
        <svg viewBox="0 0 400 110" class="w-full h-24 mx-auto my-2">
          <rect x="10" y="10" width="380" height="80" rx="10" fill="#fef3c7" stroke="#fbbf24" stroke-width="2" stroke-dasharray="5"/>
          <circle cx="60" cy="50" r="12" fill="#ef4444"/>
          <circle cx="90" cy="50" r="12" fill="#ef4444"/>
          <line x1="160" y1="20" x2="160" y2="80" stroke="#fbbf24" stroke-dasharray="4"/>
          <circle cx="220" cy="50" r="12" fill="#ef4444"/>
          <circle cx="250" cy="50" r="12" fill="#ef4444"/>
          <line x1="310" y1="20" x2="310" y2="80" stroke="#fbbf24" stroke-dasharray="4"/>
          <text x="340" y="55" font-size="12" fill="#d97706" text-anchor="middle">每组2个！</text>
        </svg>
      `,
      concept: '除法就是把一堆好东西“平均分配”给几个朋友！每个人分到同样多的东西，这就是“平均分”。被分配的总数叫“被除数”，分的人数叫“除数”，分到的结果叫“商”。',
      example: '把 8 根嫩竹笋平均分给 2 只滚滚大熊猫。算一算每只熊猫分到几根呢？ 8 ÷ 2 = 4（根）！',
      quizQuestion: '松鼠妈妈采了 15 颗松果，平均分给 3 只小松鼠。每只小松鼠可以分到几颗？',
      quizPlaceholder: '松果数量...',
      quizAnswer: '5',
      quizExplanation: '利用除法平均分：15 ÷ 3 ＝ 5（颗）。'
    };
  }

  if (name.includes('厘米') || name.includes('米') || name.includes('毫米') || name.includes('长度单位') || name.includes('分米') || name.includes('千米')) {
    const isMeterToCm = name.includes('厘米') || name.includes('米');
    return {
      title: `量度精灵 - ${name}`,
      emoji: '📏',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- Ruler layout -->
          <rect x="20" y="30" width="360" height="40" rx="4" fill="#faf5ff" stroke="#a855f7" stroke-width="3"/>
          <line x1="20" y1="70" x2="20" y2="45" stroke="#a855f7" stroke-width="3"/>
          <line x1="56" y1="70" x2="56" y2="55" stroke="#a855f7" stroke-width="2"/>
          <line x1="92" y1="70" x2="92" y2="45" stroke="#a855f7" stroke-width="3"/>
          <text x="20" y="22" font-size="12" fill="#a855f7" font-weight="bold">0 cm</text>
          <text x="92" y="22" font-size="12" fill="#a855f7" font-weight="bold">1 cm</text>
          
          <line x1="128" y1="70" x2="128" y2="55" stroke="#a855f7" stroke-width="2"/>
          <line x1="164" y1="70" x2="164" y2="45" stroke="#a855f7" stroke-width="3"/>
          <text x="164" y="22" font-size="12" fill="#a855f7" font-weight="bold">2 cm</text>
        </svg>
      `,
      concept: '我们要测量铅笔的长短、课桌的宽，就要用到长度单位。厘米(cm)用来量较小的东西，米(m)用来量大一点的东西。1米可是有足够长的呢！',
      example: '小朋友伸开双臂，大约就是1米的长度哦！而大拇指的宽度大约是1厘米。',
      quizQuestion: isMeterToCm ? '请问 2 米等于多少厘米呢？' : '请问 3 厘米加 5 毫米，转换为毫米是多少？',
      quizPlaceholder: '输入数字...',
      quizAnswer: isMeterToCm ? '200' : '35',
      quizExplanation: isMeterToCm ? '因为 1 米 = 100 厘米，所以 2 米 = 200 厘米。' : '因为 1 厘米 = 10 毫米，3 厘米就是 30 毫米，加上 5 毫米等于 35 毫米。'
    };
  }

  if (name.includes('周长') || name.includes('面积') || name.includes('公顷') || name.includes('体积') || name.includes('长方体')) {
    const isArea = name.includes('面积');
    const isVolume = name.includes('体积');
    return {
      title: `图形空间探索 - ${name}`,
      emoji: '📐',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- A rectangle with dimensions -->
          <rect x="120" y="20" width="160" height="70" fill="#ecfeff" stroke="#0891b2" stroke-width="3" stroke-dasharray="${isArea ? 'none' : '4,4'}"/>
          <text x="200" y="60" font-size="14" fill="#0891b2" font-weight="bold" text-anchor="middle">
            ${isArea ? '包含的格子面积' : isVolume ? '体积（空间）' : '一圈的长度（周长）'}
          </text>
          <!-- dimensions labels -->
          <text x="200" y="105" font-size="12" fill="#0891b2" text-anchor="middle">长 = 5 厘米</text>
          <text x="100" y="60" font-size="12" fill="#0891b2" text-anchor="middle">宽 = 3 厘米</text>
        </svg>
      `,
      concept: isArea ? 
        '面积就是一个平面图形“占了多少格子”的大小。长方形的面积公式是：长 × 宽。正方形面积则是：边长 × 边长。' : 
        isVolume ? 
        '体积是指物体所占“三维空间”的大小。长方体的体积公式是：长 × 宽 × 高。' :
        '周长就是绕着图形“边缘走一圈”的总长度。长方形周长公式是：(长 + 宽) × 2。',
      example: '一个长方形长是 5 厘米，宽是 3 厘米。那么它的周长是 (5+3)×2=16 厘米。面积是 5×3=15 平方厘米。',
      quizQuestion: isArea ? '一个正方形花坛，边长是 6 米，请问它的面积是多少平方米？' : '一个长方形拼图底板長 6 厘米，宽 4 厘米，请算算它的一圈周长是多少厘米？',
      quizPlaceholder: '输入数值...',
      quizAnswer: isArea ? '36' : '20',
      quizExplanation: isArea ? '正方形面积 = 边长 × 边长，所以 6 × 6 ＝ 36 平方米。' : '长方形周长 = (长 ＋ 宽) × 2，即 (6 ＋ 4) × 2 ＝ 20 厘米。'
    };
  }

  if (name.includes('分数') || name.includes('小数') || name.includes('百分数')) {
    return {
      title: `神秘的小数和分数 - ${name}`,
      emoji: '🍰',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- Circle pie chart showing half -->
          <circle cx="200" cy="60" r="40" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
          <path d="M 200 60 A 40 40 0 0 1 200 100 Q 160 80 200 60" fill="#f0abfc" stroke="#c084fc" stroke-width="2" transform="rotate(45, 200, 60)" />
          <path d="M 200 60 A 40 40 0 0 1 240 60 Q 220 20 200 60" fill="#f0abfc" stroke="#c084fc" stroke-width="2" transform="rotate(135, 200, 60)" />
          <text x="200" y="64" font-size="14" fill="#6b21a8" font-weight="bold" text-anchor="middle">吃了其中的四分之一 (1/4)</text>
        </svg>
      `,
      concept: '一个蛋糕切成4份，每人拿1份，写出来就是 1/4！这就是分数。小数则是整数中间点了个小句号(如0.5)，把不足1的小伙伴也记录下来。百分数是分母为100的特殊分数(例如50%)。',
      example: '二分之一（1/2）写成小数就是 0.5，写成百分数则是 50%。它们表示同样多的布丁布丁！',
      quizQuestion: '将分数五分之一（1/5）转换成小数是多少？',
      quizPlaceholder: '格式如 0.x...',
      quizAnswer: '0.2',
      quizExplanation: '1/5 等于 1 ÷ 5 ＝ 0.2。'
    };
  }

  if (name.includes('三角形') || name.includes('角') || name.includes('平行与垂直') || name.includes('圆')) {
    const isTriangle = name.includes('三角形');
    return {
      title: `几何魔法实验室 - ${name}`,
      emoji: '🔺',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- Triangle or general shape -->
          <polygon points="200,20 150,90 250,90" fill="#ecfdf5" stroke="#10b981" stroke-width="3" />
          <text x="200" y="65" font-size="12" fill="#047857" font-weight="bold" text-anchor="middle">内角三兄弟</text>
        </svg>
      `,
      concept: isTriangle ? 
        '三角形是由三条线段首尾顺次连接组成的封闭图形。而且无论什么三角形，它头顶和两个脚边的三个内角和加起来，永远都是 180 度哦！' : 
        '角是由一个顶点引出的两条射线组成的图形。根据角的大小我们分为：锐角（小于90度）、直角（等于90度）、钝角（大于90度小于180度）。',
      example: '钝角比直角大，锐角比直角小。我们用的红领巾有2个锐角和1个钝角哦！',
      quizQuestion: isTriangle ? '三角形的三个内角度之和是多少度？' : '红领巾最大的那个角，是什么角？(选填：锐角、直角、钝角)',
      quizPlaceholder: '写下你的答案...',
      quizAnswer: isTriangle ? '180' : '钝角',
      quizExplanation: isTriangle ? '任意三角形的内角和，不论形状大小，一律是 180 度！' : '红领巾中间那个大角超过了90度，所以是钝角，两边两个耳朵是锐角。'
    };
  }

  if (category === '统计与概率') {
    return {
      title: `概率大侦探 - ${name}`,
      emoji: '📊',
      illustrationSvg: `
        <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
          <!-- Chart -->
          <rect x="100" y="20" width="30" height="80" rx="3" fill="#f59e0b" />
          <rect x="160" y="40" width="30" height="60" rx="3" fill="#fbbf24" />
          <rect x="220" y="10" width="30" height="90" rx="3" fill="#f59e0b" />
          <line x1="80" y1="100" x2="300" y2="100" stroke="#78350f" stroke-width="2" />
        </svg>
      `,
      concept: '统计学能帮我们把乱蓬蓬的书本整理成一目了然的条形图、折线图！而“可能性”（概率）帮我们预测丢硬币、抓奖券到底能获得什么结果。',
      example: '把红球和蓝球放箱子里。如果有9个红球、1个蓝球，那摸出红球的可能性很大，摸出蓝球的可能性就很小。',
      quizQuestion: '抛硬币，正面朝上和反面朝上的可能性是：(选填：一样大，正面大，反面大)',
      quizPlaceholder: '打字回答...',
      quizAnswer: '一样大',
      quizExplanation: '因为硬币只有两面，且两面一样平。在正常抛掷时，正面和反面出现的可能性各占一半，也就是一样大。'
    };
  }

  if (name.includes('鸡兔同笼')) {
    return {
      title: '趣味思维 - 鸡兔同笼魔法关卡',
      emoji: '🐰',
      illustrationSvg: `
        <svg viewBox="0 0 400 130" class="w-full h-24 mx-auto my-2">
          <!-- A cute chicken and a cute rabbit -->
          <rect x="80" y="20" width="80" height="80" rx="40" fill="#fef3c7" stroke="#fbbf24" stroke-width="2"/>
          <text x="120" y="65" font-size="28" text-anchor="middle">🐣</text>
          <text x="120" y="115" font-size="12" fill="#78350f" text-anchor="middle">2条腿</text>
          
          <rect x="240" y="20" width="80" height="80" rx="40" fill="#f3e8ff" stroke="#c084fc" stroke-width="2"/>
          <text x="280" y="65" font-size="28" text-anchor="middle">🐰</text>
          <text x="280" y="115" font-size="12" fill="#581c87" text-anchor="middle">4条腿</text>
        </svg>
      `,
      concept: '鸡兔同笼是我国古代名著《孙子算经》里的有趣问题。我们可以通过“假设法”来算：假设笼子里全都是鸡，那么脚的总数就会变少。把少掉的腿分回去，就能找出兔子有几只！',
      example: '有 3 个头，一共 10 条腿。假设全是鸡应该有 2×3=6 条腿，相比 10 条腿少了 4 条。由于每只兔子比鸡多 2 条腿，所以少掉的 4 条腿对应着 4÷2=2 只兔子。剩下就是 3-2=1 只鸡。',
      quizQuestion: '如果笼子里有 4 个头，一共有 12 条腿。请问笼子里小兔子有几只？',
      quizPlaceholder: '输入兔子的只数...',
      quizAnswer: '2',
      quizExplanation: '假设全部都是鸡，应有 4 × 2 = 8 条腿。但实际有 12 条腿，多了 12 - 8 = 4 条。每有一只兔子，应多 2 条腿，所以兔子只数为 4 ÷ 2 ＝ 2 只！剩下 2 只鸡。'
    };
  }

  // General fallback dynamic generator that covers all other lessons beautifully
  return {
    title: `知识大本营 - ${name}`,
    emoji: '⭐',
    illustrationSvg: `
      <svg viewBox="0 0 400 120" class="w-full h-24 mx-auto my-2">
        <rect x="60" y="20" width="280" height="80" rx="15" fill="#f0fdf4" stroke="#10b981" stroke-width="2" stroke-dasharray="4" />
        <text x="200" y="55" font-size="15" fill="#047857" font-weight="bold" text-anchor="middle">✨ ${name} ✨</text>
        <text x="200" y="85" font-size="12" fill="#059669" text-anchor="middle">点击查看你的学习小书签</text>
      </svg>
    `,
    concept: `【${name}】是小学数学${kp.grade}的重点课程！主要帮助我们要掌握它的推理步骤和应用方法，养成爱画图、爱思考的好习惯。`,
    example: `在应用【${name}】时，我们可以先把已知条件列表写下来，搞清楚数量关系，一步一步计算，就能轻松拿到满分喔！`,
    quizQuestion: `学完了【${kp.subCategory}】，你今天又棒了一点！请问 6 乘以 8 等于多少呢？`,
    quizPlaceholder: '输入结果...',
    quizAnswer: '48',
    quizExplanation: '根据乘法口诀：“六八四十八”，所以 6 × 8 ＝ 48。'
  };
}

// Generate the beautiful child-themed responsive page content
export function renderLessonHtml(kp: KnowledgePoint): string {
  const content = getLessonContent(kp);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #f7fee7 0%, #ecfdf5 100%);
      color: #1e293b;
      padding: 16px;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .lesson-card {
      background: white;
      border-radius: 20px;
      border: 3px solid #86efac;
      box-shadow: 0 8px 0px 0px #bbf7d0;
      max-width: 650px;
      margin: 10px auto;
      padding: 24px;
      overflow: hidden;
      position: relative;
    }

    .bubble-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      border-bottom: 2px dashed #bbf7d0;
      padding-bottom: 12px;
    }

    .emoji-box {
      font-size: 32px;
      background: #f0fdf4;
      border: 2px solid #86efac;
      border-radius: 12px;
      width: 54px;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title-group h1 {
      font-size: 20px;
      font-weight: 800;
      color: #15803d;
    }

    .title-group .subtitle {
      font-size: 12px;
      color: #16a34a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: bold;
    }

    .section-title {
      font-size: 15px;
      font-weight: bold;
      color: #166534;
      margin: 14px 0 8px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-title::before {
      content: "★";
      color: #f59e0b;
    }

    .p-box {
      font-size: 14px;
      color: #334155;
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 14px;
    }

    .example-box {
      background: #fffbeb;
      border: 2px solid #fde68a;
      border-left: 6px solid #f59e0b;
    }

    .graphic-pane {
      background: #f0fdf4;
      border-radius: 12px;
      border: 1px solid #bbf7d0;
      margin: 12px 0;
    }

    /* Quiz Area Card */
    .quiz-card {
      background: #ecfeff;
      border: 3px solid #67e8f9;
      border-radius: 16px;
      padding: 16px;
      margin-top: 18px;
      box-shadow: 0 4px 0px 0px #a5f3fc;
    }

    .quiz-header {
      font-size: 15px;
      font-weight: bold;
      color: #0891b2;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }

    .quiz-header::before {
      content: "🧠";
    }

    .quiz-question {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .input-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }

    .quiz-input {
      flex: 1;
      border: 2px solid #a5f3fc;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: bold;
      color: #0d9488;
      outline: none;
      transition: border-color 0.2s;
    }

    .quiz-input:focus {
      border-color: #06b6d4;
    }

    .btn-check {
      background: #06b6d4;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 3px 0 0 #0891b2;
      transition: transform 0.1s, box-shadow 0.1s;
    }

    .btn-check:active {
      transform: translateY(2px);
      box-shadow: 0 1px 0 0 #0891b2;
    }

    /* Answer Result Feedback */
    .feedback {
      display: none;
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 14px;
      margin-top: 10px;
      font-weight: bold;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .feedback.correct {
      display: block;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }

    .feedback.incorrect {
      display: block;
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
    }

    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      overflow: hidden;
      display: none;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #f59e0b;
      border-radius: 50%;
      opacity: 0.8;
      animation: fall 1s linear forwards;
    }

    @keyframes popIn {
      0% { transform: scale(0.9); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes fall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
    }
  </style>
</head>
<body>

  <div class="lesson-card">
    <div class="confetti-container" id="confettiContainer"></div>
    
    <div class="bubble-header">
      <div class="emoji-box">${content.emoji}</div>
      <div class="title-group">
        <h1>${content.title}</h1>
        <div class="subtitle">${kp.category} &bull; ${kp.subCategory} &bull; ${kp.grade}</div>
      </div>
    </div>

    <div class="section-title">核心概念</div>
    <div class="p-box">${content.concept}</div>

    <div class="graphic-pane">
      ${content.illustrationSvg}
    </div>

    <div class="section-title">例题解析</div>
    <div class="p-box example-box">
      <strong>💡 小练习：</strong>${content.example}
    </div>

    <!-- Interactive Answer Area -->
    <div class="quiz-card">
      <div class="quiz-header">小小挑战家</div>
      <div class="quiz-question">${content.quizQuestion}</div>
      
      <div class="input-row">
        <input type="text" id="quizInput" class="quiz-input" placeholder="${content.quizPlaceholder}" autocomplete="off">
        <button type="button" class="btn-check" onclick="checkUserAnswer()">帮我批改</button>
      </div>

      <div class="feedback" id="feedbackBox"></div>
    </div>
  </div>

  <script>
    const correctAnswer = "${content.quizAnswer.replace(/"/g, '\\"')}".trim().toLowerCase();
    const explanation = "${content.quizExplanation.replace(/"/g, '\\"')}";
    const kpId = "${kp.id}";

    function checkUserAnswer() {
      const input = document.getElementById('quizInput');
      const feedback = document.getElementById('feedbackBox');
      const userVal = input.value.trim().toLowerCase();

      if (!userVal) {
        feedback.className = "feedback incorrect";
        feedback.innerText = "🔍 请记得写下你的想法哦！";
        return;
      }

      if (userVal === correctAnswer || (correctAnswer === '一样大' && (userVal.includes('一样') || userVal.includes('等')))) {
        feedback.className = "feedback correct";
        feedback.innerHTML = "🎉 答对了！你真是个天才小伙伴！<br><span style='font-size: 12px; color: #166534; font-weight: normal; margin-top: 4px; display: block;'>小侦探解密：" + explanation + "</span>";
        triggerConfetti();
        // Inform parents/application to check off this concept!
        window.parent.postMessage({
          type: 'KNOWLEDGE_MASTERED',
          id: kpId
        }, '*');
      } else {
        feedback.className = "feedback incorrect";
        feedback.innerHTML = "💡 加油！再稍微琢磨一下哦！可以看例题寻找线索 ~";
      }
    }

    function triggerConfetti() {
      const container = document.getElementById('confettiContainer');
      container.style.display = 'block';
      container.innerHTML = '';
      
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#fbbf24', '#a855f7', '#67e8f9'];
      for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 6) + 'px';
        piece.style.height = (Math.random() * 8 + 6) + 'px';
        piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        piece.style.animationDelay = (Math.random() * 0.4) + 's';
        piece.style.animationDuration = (Math.random() * 0.8 + 0.8) + 's';
        container.appendChild(piece);
      }
    }

    // Support enter key in input
    document.getElementById('quizInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkUserAnswer();
      }
    });
  </script>
</body>
</html>`;
}
