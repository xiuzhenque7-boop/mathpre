/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Elementary School Math Prep Portal Service Worker
// Intercepts requests to '/knowledge/*.html' and serves dynamic learning pages!

const CACHE_NAME = 'math-prep-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// A mini-lesson engine built directly inside the SW for flawless standalone iframe loading!
function generateLessonHTML(kpName) {
  // Determine category and icon based on name
  let emoji = '⭐';
  let category = '数学奥秘';
  let themeColor = '#10b981';
  let bgGradient = 'linear-gradient(135deg, #f7fee7 0%, #ecfdf5 100%)';
  let borderCol = '#86efac';
  let shadowCol = '#bbf7d0';
  let headerText = '小学数学重点提前学';
  let content = `欢迎来到<b>【${kpName}】</b>魔法屋！这个知识点非常奇妙。`;
  let example = `在应用【${kpName}】时，多画图、多列表、仔细检查。`;
  let question = `学完了【${kpName}】，你特别厉害！算一算：6 &times; 8 ＝ ？`;
  let answer = '48';
  let explanation = '根据乘法口诀：“六八四十八”！';

  if (kpName.includes('数字') || kpName.includes('20') || kpName.includes('0的认识') || kpName.includes('百') || kpName.includes('千') || kpName.includes('万') || kpName.includes('数')) {
    emoji = '🎈';
    category = '数与代数（数的认识）';
    themeColor = '#10b981';
    content = `数字就像五彩斑斓的泡泡，它们能告诉我们东西的数量（有几个）和排在哪个位置（第几个）。0表示一个也没有哦！`;
    example = `如果你有 3 支铅笔，用掉了 3 支，剩下就是 0 支啦。`;
    question = `排在第 5 前面、紧挨着它的数字是几？`;
    answer = '4';
    explanation = '5的前面一个是4。数数顺序是：1, 2, 3, 4, 5。';
  } else if (kpName.includes('加') || kpName.includes('和')) {
    emoji = '➕';
    category = '数与代数（加法运算）';
    themeColor = '#10b981';
    content = `加法就是把几个好朋友的物品“合起来”，看看一共是多少！比如你有2个红苹果，我又给你3个黄苹果，一共有 2 + 3 = 5 个苹果！`;
    example = `小熊猫上午吃了 4 根竹子，下午吃了 3 根。一共有多少根？ 4 + 3 = 7（根）。`;
    question = `小兔有 5 朵蘑菇，又采了 6 朵。一共有几朵？`;
    answer = '11';
    explanation = '5 + 6 ＝ 11 朵。进位加法的小窍门是：凑十法。';
  } else if (kpName.includes('减') || kpName.includes('差') || kpName.includes('退位')) {
    emoji = '➖';
    category = '数与代数（减法运算）';
    themeColor = '#1e293b';
    content = `减法就是从总数里面“拿走”或者“吃掉”一些东西，看看还剩下多少。被减去的部分用减号标出来。`;
    example = `箱子里原有 10 个草莓，吃掉了 4 个。还剩：10 - 4 = 6 个。`;
    question = `树上有 15 只快乐的小鸟，飞走了 6 只。还剩几只？`;
    answer = '9';
    explanation = '总数 15 减去 6，列式：15 - 6 = 9。';
  } else if (kpName.includes('乘') || kpName.includes('倍')) {
    emoji = '✖️';
    category = '数与代数（乘法知识）';
    themeColor = '#3b82f6';
    bgGradient = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
    borderCol = '#93c5fd';
    shadowCol = '#bfdbfe';
    content = `乘法是相同数字加法快速计算的升级版！3 × 5 意思就是 5 个 3 或者 3 个 5 站成排加在一起。`;
    example = `每只小松树吃 3 个松果，5 只松鼠一共吃：3 × 5 = 15 个松果。`;
    question = `小汽车有 4 个轮子，6 辆这样的小汽车共有多少个轮子？`;
    answer = '24';
    explanation = '每辆车 4 个轮子，6 辆车就是：4 &times; 6 ＝ 24。';
  } else if (kpName.includes('除') || kpName.includes('余')) {
    emoji = '➗';
    category = '数与代数（除法知识）';
    themeColor = '#ef4444';
    bgGradient = 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)';
    borderCol = '#fca5a5';
    shadowCol = '#fecaca';
    content = `除法把好吃的或者好玩的“平均分给”小伙伴。每个人必须分得一样多才公平！`;
    example = `12 个糖果平均分给 3 个小朋友，每人分：12 ÷ 3 = 4 个。`;
    question = `把 20 份练习册平均发给 4 个小组，每个小组发几份？`;
    answer = '5';
    explanation = '20 ÷ 4 ＝ 5（份）。因为五四二十。';
  } else if (kpName.includes('厘米') || kpName.includes('米') || kpName.includes('图形') || kpName.includes('高') || kpName.includes('面积') || kpName.includes('长') || kpName.includes('宽') || kpName.includes('几何') || kpName.includes('角')) {
    emoji = '📐';
    category = '图形与几何';
    themeColor = '#06b6d4';
    bgGradient = 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)';
    borderCol = '#67e8f9';
    shadowCol = '#a5f3fc';
    content = `厘米、分米、米是度量长度的魔法尺。面积是占了多少个小格子。我们要细心看图形的边、角、高和周长！`;
    example = `1米有 100 厘米长。长方形的面积是：长 &times; 宽。`;
    question = `一张正方形小纸片，边长是 5 厘米。请问它的面积是多少平方厘米？`;
    answer = '25';
    explanation = '正方形面积 = 边长 × 边长，计算为：5 × 5 = 25。';
  } else if (kpName.includes('统计') || kpName.includes('图') || kpName.includes('可能') || kpName.includes('概率') || kpName.includes('平均数')) {
    emoji = '📊';
    category = '统计与概率';
    themeColor = '#f59e0b';
    bgGradient = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
    borderCol = '#fde68a';
    shadowCol = '#fef3c7';
    content = `条形图和折线图就像数学故事书，用高矮和起伏展示数据。而可能性让我们预测摸奖或下雨的可能性！`;
    example = `如果袋子里有5个红球，摸出红球的可能性是100%。`;
    question = `抛硬币一次，正面朝上的可能性和反面朝上的可能性是什么关系？(填写：一样大，更大，更小)`;
    answer = '一样大';
    explanation = '硬币只有两边且一样平衡，所以两面直立掉落朝上概率是一样大。';
  } else if (kpName.includes('鸡兔同笼') || kpName.includes('植树') || kpName.includes('搭配') || kpName.includes('应用题') || kpName.includes('拓展') || kpName.includes('问题')) {
    emoji = '🧠';
    category = '综合与实践';
    themeColor = '#8b5cf6';
    bgGradient = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
    borderCol = '#c084fc';
    shadowCol = '#e9d5ff';
    content = `综合应用题和数学广角能训练你的大脑变聪明！通过把实际场景画图简化，你可以解开鸡兔同笼、植树问题等数学古谜。`;
    example = `鸡兔共3只，脚共10只。鸡有一只，兔有两只。`;
    question = `4 头小猪和鸡关在一起，一共有 12 条腿。那么小鸡有多少只？`;
    answer = '2';
    explanation = '4头猪已有16条腿，腿不可能只有12条... 哦！题目指共有4个头，12条腿。假设全是鸡只有8条腿，实际多4条，也就是2只兔子，鸡就是4-2=2只。';
  }

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>${kpName} 提前学屋</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: ${bgGradient};
      color: #1e293b;
      padding: 16px;
      line-height: 1.6;
    }
    .card {
      background: white;
      border-radius: 20px;
      border: 3px solid ${borderCol};
      box-shadow: 0 8px 0px 0px ${shadowCol};
      max-width: 600px;
      margin: 12px auto;
      padding: 24px;
      position: relative;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 2px dashed ${borderCol};
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .emoji {
      font-size: 32px;
      background: #f8fafc;
      border: 2px solid ${borderCol};
      border-radius: 12px;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .title h2 {
      margin: 0;
      font-size: 18px;
      color: ${themeColor};
    }
    .title .meta {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }
    .sect {
      font-size: 14px;
      background: #f8fafc;
      padding: 12px;
      border-radius: 10px;
      margin-bottom: 12px;
      border: 1px solid #e2e8f0;
    }
    .sect-title {
      font-size: 14px;
      font-weight: bold;
      color: ${themeColor};
      margin-bottom: 6px;
    }
    .example {
      background: #fffbeb;
      border: 1px solid #fde68a;
    }
    .quiz {
      background: #ecfeff;
      border: 2px solid #a5f3fc;
      border-radius: 12px;
      padding: 14px;
      margin-top: 14px;
    }
    .quiz-title {
      font-size: 14px;
      font-weight: bold;
      color: #0891b2;
      margin-bottom: 6px;
    }
    .input-group {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .quiz-input {
      flex: 1;
      padding: 6px 12px;
      border: 1px solid #a5f3fc;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    .quiz-btn {
      background: ${themeColor};
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
    }
    .feedback {
      display: none;
      padding: 8px;
      margin-top: 8px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: bold;
    }
    .success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .error { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="emoji">${emoji}</div>
      <div class="title">
        <h2>${kpName} 大冒险</h2>
        <div class="meta">${category} &bull; 自主预习课</div>
      </div>
    </div>
    
    <div class="sect-title">✨ 魔力公式 / 概念</div>
    <div class="sect">${content}</div>
    
    <div class="sect-title">💡 趣味例题</div>
    <div class="sect example">${example}</div>
    
    <div class="quiz">
      <div class="quiz-title">🏁 趣味小挑战</div>
      <div id="qText">${question}</div>
      <div class="input-group">
        <input type="text" id="ansVal" class="quiz-input" placeholder="写下你的答案...">
        <button class="quiz-btn" onclick="checkAnswer()">提交</button>
      </div>
      <div id="fb" class="feedback"></div>
    </div>
  </div>

  <script>
    const correctAns = "${answer}";
    const expl = "${explanation}";
    
    function checkAnswer() {
      const val = document.getElementById('ansVal').value.trim();
      const fb = document.getElementById('fb');
      fb.style.display = 'block';
      
      if (val === correctAns || (correctAns === '一样大' && (val.includes('一') || val.includes('等')))) {
        fb.className = 'feedback success';
        fb.innerHTML = '🎉 哇哦！答对了，太聪明了！<br><span style="font-weight:normal; font-size:12px;">' + expl + '</span>';
        
        // Post message back to React applet
        window.parent.postMessage({
          type: 'KNOWLEDGE_MASTERED',
          id: '数与代数-数的认识-${kpName}' // fallback id
        }, '*');
      } else {
        fb.className = 'feedback error';
        fb.innerHTML = '💡 再差一点点就对了！重新数数看，在心里算一算。';
      }
    }
  </script>
</body>
</html>`;
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Intercept knowledge pages
  if (url.pathname.includes('/knowledge/') && url.pathname.endsWith('.html')) {
    // Extract filename (e.g. /knowledge/认识10以内的数字.html)
    const segments = url.pathname.split('/');
    const filename = decodeURIComponent(segments[segments.length - 1]);
    const kpName = filename.substring(0, filename.length - 5); // Strip '.html'
    
    event.respondWith(
      new Response(generateLessonHTML(kpName), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    );
  }
});
