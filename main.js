document.addEventListener('DOMContentLoaded', function(){
  const Vin = 5.0;

  // --- i18n strings (English + Hindi) ---
  const I18N = {
    en: {
      title: '⚡ Note Gate — ECE Learning Game',
      subtitle: 'Learn logic gates, adders, and circuits! Master electronics! 🎮',
      caption: 'Gate opens when Vout ≈ target ✨',
      objective: '🎯 Objective',
      newPuzzle: '🔄 New Puzzle',
      hint: '💡 Hint',
      nextLevel: '➡️ Next Level',
      soundLabel: '🔊 Sound',
      soundOn: 'On',
      soundOff: 'Off',
      matchTitle: '🍬 Candy Puzzle — Unlock Level',
      matchHelp: 'Match 3 or more candies! 🎯 Reach the score to unlock. 🔓',
      matchReset: '🔀 Shuffle',
      matchClose: '🔓 Unlock',
      achievements: '🏆 Achievements',
      footer: '⚡ Learn ECE the fun way — Logic gates, adders, circuits! 🎓'
    },
    hi: {
      title: '⚡ नोट गेट — ECE सीखने का खेल',
      subtitle: 'लॉजिक गेट, एडर, और सर्किट सीखें! इलेक्ट्रॉनिक्स मास्टर बनें! 🎮',
      caption: 'जब Vout ≈ लक्ष्य होगा तो गेट खुलेगा ✨',
      objective: '🎯 उद्देश्य',
      newPuzzle: '🔄 नई पहेली',
      hint: '💡 संकेत',
      nextLevel: '➡️ अगला स्तर',
      soundLabel: '🔊 ध्वनि',
      soundOn: 'चालू',
      soundOff: 'बंद',
      matchTitle: '🍬 मिनी पज़ल — स्तर अनलॉक करें',
      matchHelp: '3 या अधिक कैंडी मिलाएं! 🎯 स्कोर पूरा करें और स्तर अनलॉक करें। 🔓',
      matchReset: '🔀 शफल',
      matchClose: '🔓 अनलॉक',
      achievements: '🏆 उपलब्धियाँ',
      footer: '🎓 मज़ेदार तरीके से ECE सीखें — लॉजिक गेट, एडर, सर्किट! 🎓'
    }
  };

  let currentLang = localStorage.getItem('noteGateLang') || (navigator.language && navigator.language.startsWith('hi') ? 'hi' : 'en');

  function applyLang(lang){
    currentLang = (lang in I18N) ? lang : 'en';
    const s = I18N[currentLang];
    const el = id => document.getElementById(id);
    if(el('title')) el('title').textContent = s.title;
    if(el('subtitle')) el('subtitle').textContent = s.subtitle;
    if(el('caption')) el('caption').textContent = s.caption;
    if(el('objectiveStrong')) el('objectiveStrong').textContent = s.objective;
    if(el('randomize')) el('randomize').textContent = s.newPuzzle;
    if(el('hint')) el('hint').textContent = s.hint;
    if(el('nextLevel')) el('nextLevel').textContent = s.nextLevel;
    if(el('soundLabel')) el('soundLabel').textContent = s.soundLabel;
    if(el('matchTitle')) el('matchTitle').textContent = s.matchTitle;
    if(el('matchHelp')) el('matchHelp').textContent = s.matchHelp;
    if(el('matchReset')) el('matchReset').textContent = s.matchReset;
    if(el('matchClose')) el('matchClose').textContent = s.matchClose;
    if(el('achHeader')) el('achHeader').textContent = s.achievements;
    if(el('footerText')) el('footerText').textContent = s.footer;
    // sound toggle label should reflect current enabled state
    const sbtn = el('soundToggle'); if(sbtn) sbtn.textContent = soundEnabled ? s.soundOn : s.soundOff;
    // update <select>
    const sel = el('lang'); if(sel){ sel.value = currentLang; }
    localStorage.setItem('noteGateLang', currentLang);
  }

  // Generate 100 levels with varied ECE topics
  function generateLevels(){
    const levelTemplates = [
      // Analog levels (Voltage Dividers)
      {type: 'analog', desc: '🎯 Voltage Divider - Match target voltage', gate: null},
      {type: 'analog', desc: '🔋 Resistor Network - Calculate output', gate: null},
      {type: 'analog', desc: '⚡ Power Distribution - Balance the circuit', gate: null},
      // Digital levels (Logic Gates)
      {type: 'digital', desc: '🔌 AND Gate - Both HIGH → HIGH', gate: 'and'},
      {type: 'digital', desc: '⚡ OR Gate - Any HIGH → HIGH', gate: 'or'},
      {type: 'digital', desc: '🚫 NOT Gate - Invert signal', gate: 'not'},
      {type: 'digital', desc: '🔥 NAND Gate - Universal logic', gate: 'nand'},
      {type: 'digital', desc: '⚙️ NOR Gate - Universal gate', gate: 'nor'},
      {type: 'digital', desc: '✨ XOR Gate - Differ → HIGH', gate: 'xor'},
      {type: 'digital', desc: '➕ Half Adder - Sum & Carry', gate: 'xor'},
      {type: 'digital', desc: '🔢 Full Adder - 3-bit addition', gate: 'xor'},
      {type: 'digital', desc: '🎯 Multiplexer - Select inputs', gate: 'and'},
      {type: 'digital', desc: '🔀 Demultiplexer - Route signals', gate: 'or'},
      {type: 'digital', desc: '💾 Flip-Flop - Memory element', gate: 'nand'},
      {type: 'digital', desc: '🔄 Counter Circuit - Sequential', gate: 'xor'}
    ];
    
    const levels = [];
    for(let i = 1; i <= 100; i++){
      const template = levelTemplates[(i-1) % levelTemplates.length];
      const difficulty = Math.min(1 + Math.floor(i / 10) * 0.5, 5); // Increases every 10 levels
      
      // Calculate parameters based on difficulty
      const tolerance = Math.max(0.01, 0.08 - difficulty * 0.01);
      const timeLimit = Math.max(10, 35 - Math.floor(i / 5));
      const minTarget = 0.5 + (i % 3) * 0.3;
      const maxTarget = 4.5 - (i % 4) * 0.2;
      
      const desc = `${template.desc} (Level ${i})`;
      
      levels.push([
        minTarget,
        maxTarget,
        tolerance,
        timeLimit,
        desc,
        template.type,
        template.gate
      ]);
    }
    
    // Special milestone levels
    levels[9][4] = '🏆 Level 10: Milestone! 4-bit Adder Circuit!';
    levels[24][4] = '🎉 Level 25: Quarter Century! Master Complex Gates!';
    levels[49][4] = '💎 Level 50: Halfway There! Advanced Digital Logic!';
    levels[74][4] = '⚡ Level 75: Three Quarters! Expert Circuits!';
    levels[99][4] = '🏆 Level 100: FINAL BOSS! Complete ECE Mastery!';
    
    return levels;
  }
  
  const levels = generateLevels();

  // Quiz questions for unlocking levels
  const quizQuestions = {
    2: {
      question: "What is the output of an AND gate when both inputs are HIGH (1)?",
      options: ["0 (LOW)", "1 (HIGH)", "Undefined", "Depends on voltage"],
      correct: 1,
      explanation: "✅ Correct! AND gate outputs 1 only when BOTH inputs are 1."
    },
    3: {
      question: "Which gate outputs HIGH when ANY input is HIGH?",
      options: ["AND Gate", "OR Gate", "NOT Gate", "XOR Gate"],
      correct: 1,
      explanation: "✅ Perfect! OR gate outputs 1 if at least one input is 1."
    },
    4: {
      question: "What does a NOT gate (Inverter) do?",
      options: ["Adds two inputs", "Inverts the input signal", "Multiplies inputs", "Delays signal"],
      correct: 1,
      explanation: "✅ Excellent! NOT gate inverts: 0→1 and 1→0."
    },
    5: {
      question: "NAND gate is called 'universal' because:",
      options: ["It's used everywhere", "Any logic function can be built using only NAND gates", "It works at high voltage", "It's the fastest gate"],
      correct: 1,
      explanation: "✅ Superb! NAND is universal - you can build ANY logic circuit using only NAND gates!"
    },
    6: {
      question: "What is the output of NOR gate when both inputs are LOW (0)?",
      options: ["0 (LOW)", "1 (HIGH)", "Floating", "Short circuit"],
      correct: 1,
      explanation: "✅ Right! NOR outputs 1 only when ALL inputs are 0."
    },
    7: {
      question: "XOR gate outputs HIGH when:",
      options: ["Both inputs are same", "Both inputs are different", "Both inputs are HIGH", "Any input is LOW"],
      correct: 1,
      explanation: "✅ Perfect! XOR (Exclusive OR) outputs 1 when inputs DIFFER."
    },
    8: {
      question: "In a Half Adder, which gates are used?",
      options: ["AND + OR", "XOR + AND", "NAND + NOR", "NOT + OR"],
      correct: 1,
      explanation: "✅ Brilliant! Half Adder uses XOR (for Sum) and AND (for Carry)."
    },
    9: {
      question: "What is the difference between Half Adder and Full Adder?",
      options: ["Speed of operation", "Full Adder has a Carry-In input", "Half Adder is faster", "Power consumption"],
      correct: 1,
      explanation: "✅ Excellent! Full Adder adds 3 bits (A, B, Carry-In), Half Adder adds only 2 bits."
    },
    10: {
      question: "In digital circuits, what is a Flip-Flop used for?",
      options: ["Amplification", "Memory/Storage of 1 bit", "Voltage regulation", "Signal inversion"],
      correct: 1,
      explanation: "✅ Outstanding! Flip-Flop stores 1 bit of data - it's a basic memory element!"
    },
    // Quizzes every 10 levels for milestones
    20: {
      question: "What is Ohm's Law formula?",
      options: ["V = I × R", "V = I / R", "V = I + R", "V = R / I"],
      correct: 0,
      explanation: "✅ Perfect! Ohm's Law: Voltage = Current × Resistance (V = I × R)"
    },
    30: {
      question: "Which of these can build any logic function?",
      options: ["Only AND gates", "Only OR gates", "Only NAND gates", "Only XOR gates"],
      correct: 2,
      explanation: "✅ Brilliant! NAND gate is universal - any logic function can be built with only NAND gates!"
    },
    40: {
      question: "What does a Multiplexer do?",
      options: ["Multiplies signals", "Selects one input from many", "Adds multiple inputs", "Inverts signals"],
      correct: 1,
      explanation: "✅ Correct! Multiplexer (MUX) selects one of many input signals based on control inputs."
    },
    50: {
      question: "In a Full Adder, how many outputs are there?",
      options: ["1 (Sum only)", "2 (Sum and Carry)", "3 outputs", "4 outputs"],
      correct: 1,
      explanation: "✅ Excellent! Full Adder has 2 outputs: Sum and Carry-Out."
    },
    60: {
      question: "What is the purpose of a Demultiplexer?",
      options: ["Divide voltage", "Route one input to many outputs", "Add signals", "Store data"],
      correct: 1,
      explanation: "✅ Perfect! Demultiplexer (DEMUX) routes one input to one of many outputs based on control."
    },
    70: {
      question: "What type of circuit is a counter?",
      options: ["Combinational", "Sequential", "Analog", "Power circuit"],
      correct: 1,
      explanation: "✅ Great! Counter is a Sequential circuit - output depends on current state and inputs."
    },
    80: {
      question: "What is propagation delay in digital circuits?",
      options: ["Time for signal to travel through circuit", "Distance between gates", "Power consumption", "Voltage drop"],
      correct: 0,
      explanation: "✅ Spot on! Propagation delay is the time it takes for a signal to pass through a gate/circuit."
    },
    90: {
      question: "What does TTL stand for in digital electronics?",
      options: ["Time To Live", "Transistor-Transistor Logic", "Total Timing Limit", "Transfer Technology Level"],
      correct: 1,
      explanation: "✅ Correct! TTL = Transistor-Transistor Logic, a common IC family."
    },
    100: {
      question: "What have you mastered by completing 100 levels?",
      options: ["Just logic gates", "Basic electronics", "Comprehensive ECE fundamentals", "Nothing special"],
      correct: 2,
      explanation: "✅ LEGENDARY! You've mastered voltage dividers, all logic gates, adders, complex circuits - Complete ECE fundamentals! 🏆"
    }
  };

  const els = {
    vin: document.getElementById('vin'),
    target: document.getElementById('target'),
    tol: document.getElementById('tol'),
    vout: document.getElementById('vout'),
    r1: document.getElementById('r1'),
    r2: document.getElementById('r2'),
    r1val: document.getElementById('r1val'),
    r2val: document.getElementById('r2val'),
    gate: document.getElementById('gate'),
    randomize: document.getElementById('randomize'),
    hint: document.getElementById('hint'),
    nextLevelBtn: document.getElementById('nextLevel'),
    level: document.getElementById('level'),
    score: document.getElementById('score')
  };

  // (language applied later after audio/sound is initialized)

  let currentLevel = 1;
  let score = 0;
  let targetV = 2.5;
  let tolFrac = levels[0][2];
  let solved = false;
  let timerId = null;
  let timeLeft = 0;
  let comboCount = 0;
  let streakCount = 0;
  let lastSolveTime = 0;

  function setTarget(v){
    targetV = Number(v);
    els.target.textContent = targetV.toFixed(2);
    els.tol.textContent = (tolFrac * Vin).toFixed(2);
  }

  function updateUI(){
    const R1 = Number(els.r1.value);
    const R2 = Number(els.r2.value);
    els.r1val.textContent = Math.round(R1);
    els.r2val.textContent = Math.round(R2);
    els.vin.textContent = Vin.toFixed(2);
    const vout = NoteGateSim.computeVout(Vin, R1, R2);
    els.vout.textContent = vout.toFixed(3);
    const diff = Math.abs(vout - targetV);
    const ok = diff <= (tolFrac * Vin);
    if(ok && !solved){
      solved = true;
      onSolve();
    }
    if(ok){
      els.gate.classList.remove('closed');
      els.gate.classList.add('open');
    } else {
      els.gate.classList.remove('open');
      els.gate.classList.add('closed');
    }
  }

  function randomTargetForLevel(level){
    const cfg = levels[Math.max(0, Math.min(levels.length-1, level-1))];
    const minT = cfg[0], maxT = cfg[1];
    const t = minT + Math.random() * (maxT - minT);
    tolFrac = cfg[2];
    setTarget(Math.round(t * 100) / 100);
  }

  function onSolve(){
    // award score based on level and remaining time (bonus)
    const base = Math.round(10 * currentLevel);
    const bonus = Math.round(timeLeft * currentLevel);
    
    // Check for combo/streak bonuses
    const now = Date.now();
    let comboBonus = 0;
    let streakBonus = 0;
    
    // Combo: solved quickly (within 10 seconds of last solve)
    if(now - lastSolveTime < 10000 && lastSolveTime > 0){
      comboCount++;
      comboBonus = comboCount * 25;
      showComboIndicator(comboCount);
    } else {
      comboCount = 0;
    }
    
    // Streak: solved with lots of time remaining
    if(timeLeft > 15){
      streakCount++;
      streakBonus = streakCount * 15;
      showStreakIndicator();
    } else {
      streakCount = 0;
    }
    
    lastSolveTime = now;
    
    const totalPoints = base + bonus + comboBonus + streakBonus;
    score += totalPoints;
    els.score.textContent = score;
    
    // Show animated score popup
    showScorePopup(totalPoints, comboBonus, streakBonus);
    
    // Update progress bar
    updateProgressBar();
    
    // persist high score
    const prevHigh = Number(localStorage.getItem('noteGateHighScore') || 0);
    if(score > prevHigh){
      localStorage.setItem('noteGateHighScore', score);
      const hs = document.getElementById('highscore'); if(hs) hs.textContent = score;
      showToast('🌟 NEW HIGH SCORE: ' + score + ' 🌟');
      unlockAchievement('⭐ New High Score Record');
    }
    
    // visual + audio feedback
    launchConfetti();
    playSound('win');
    
    // Unlock achievements
    if(comboCount >= 3) unlockAchievement('🔥 Combo Master x3');
    if(streakCount >= 5) unlockAchievement('⚡ Speed Demon x5');
    
    // show next-level button if not last
    if(currentLevel < levels.length){
      // Automatically unlock the next level
      const nextLevelNum = currentLevel + 1;
      const unlocked = JSON.parse(localStorage.getItem('noteGateUnlocked') || '[]');
      if(!unlocked.includes(nextLevelNum)){
        unlocked.push(nextLevelNum);
        localStorage.setItem('noteGateUnlocked', JSON.stringify(unlocked));
      }
      
      if(els.nextLevelBtn){
        els.nextLevelBtn.style.display = 'inline-block';
        console.log('✅ Next Level button shown for level ' + nextLevelNum);
      } else {
        console.error('❌ Next Level button not found!');
      }
      let msg = '🎉 Level Complete! +' + totalPoints + ' points!';
      if(comboBonus > 0) msg += ' (Combo +' + comboBonus + ')';
      if(streakBonus > 0) msg += ' (Streak +' + streakBonus + ')';
      msg += ' 🔓 Level ' + nextLevelNum + ' Unlocked!';
      showToast(msg);
    } else {
      setTimeout(()=> alert('🏆🎉 ULTIMATE CONGRATULATIONS! ��🏆\n\n✨ You conquered ALL 100 LEVELS! ✨\n\nFinal Score: ' + score + '\n\nYou are an ABSOLUTE ECE LEGEND! ⚡🔥\n\nYou mastered:\n• Voltage Dividers\n• All Logic Gates\n• Adders & Subtractors\n• Complex Digital Circuits\n\n👑 You are now an ECE MASTER! 👑'), 200);
      unlockAchievement('🏆 ECE LEGEND - Completed ALL 100 Levels!');
    }
    stopTimer();
  }
  
  function showScorePopup(points, combo, streak){
    const container = document.getElementById('scorePopupContainer');
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    let text = '+' + points;
    if(combo > 0) text += ' 🔥';
    if(streak > 0) text += ' ⚡';
    popup.textContent = text;
    popup.style.left = (window.innerWidth / 2) + 'px';
    popup.style.top = (window.innerHeight / 2) + 'px';
    container.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
  }
  
  function showComboIndicator(count){
    const indicator = document.getElementById('comboIndicator');
    indicator.textContent = 'x' + count + ' COMBO!';
    indicator.style.display = 'inline-block';
    setTimeout(() => indicator.style.display = 'none', 3000);
  }
  
  function showStreakIndicator(){
    const indicator = document.getElementById('streakBonus');
    indicator.style.display = 'inline-block';
    setTimeout(() => indicator.style.display = 'none', 3000);
  }
  
  function updateProgressBar(){
    const progress = (currentLevel / levels.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = currentLevel + '/' + levels.length;
  }

  function nextLevel(){
    console.log('⏭️ Next Level button clicked. Current level: ' + currentLevel);
    if(currentLevel >= levels.length){
      showToast('🏆 You are at the final level!');
      return;
    }
    currentLevel += 1;
    console.log('➡️ Moving to level ' + currentLevel);
    if(els.level) els.level.textContent = currentLevel;
    if(els.nextLevelBtn) els.nextLevelBtn.style.display = 'none';
    solved = false;
    // reset sliders
    els.r1.value = 1000; els.r2.value = 1000;
    
    // Reset manual inputs if they exist
    const manualR1 = document.getElementById('manualR1');
    const manualR2 = document.getElementById('manualR2');
    if(manualR1) manualR1.value = '';
    if(manualR2) manualR2.value = '';
    
    // Clear drop zones
    const dropR1 = document.getElementById('dropR1');
    const dropR2 = document.getElementById('dropR2');
    if(dropR1){
      dropR1.textContent = 'Drop Here';
      dropR1.classList.remove('filled');
    }
    if(dropR2){
      dropR2.textContent = 'Drop Here';
      dropR2.classList.remove('filled');
    }
    
    startLevel(currentLevel);
  }

  function randomizeLevel(){
    solved = false;
    els.r1.value = 1000; els.r2.value = 1000;
    els.nextLevelBtn.style.display = 'none';
    startLevel(currentLevel);
  }

  function startTimer(seconds){
    stopTimer();
    timeLeft = Math.max(0, Math.floor(seconds));
    els.timer.textContent = timeLeft;
    timerId = setInterval(()=>{
      timeLeft -= 1;
      if(timeLeft < 0) timeLeft = 0;
      els.timer.textContent = timeLeft;
      if(timeLeft === 0){
        stopTimer();
        // time up: reveal hint and make level slightly easier by increasing tolerance
        tolFrac *= 1.25;
        showToast('⏰ Time\'s up! Don\'t worry, tolerance increased. Keep trying! 💪');
      }
    }, 1000);
  }

  function stopTimer(){
    if(timerId) clearInterval(timerId);
    timerId = null;
  }

  function startLevel(level){
    const idx = Math.max(0, Math.min(levels.length-1, level-1));
    const cfg = levels[idx];
    tolFrac = cfg[2];
    const timeLimit = cfg[3] || 30;
    const desc = cfg[4] || 'Match the target voltage using R1 and R2.';
    const topic = cfg[5] || 'analog';
    
    console.log('🎮 Starting Level ' + level + ' (' + topic + ')');
    
    document.getElementById('levelDesc').textContent = desc;
    
    // Show appropriate interaction mode (A, B, or C)
    showInteractionMode(level);
    
    // Show/hide controls based on topic type
    if(topic === 'digital'){
      // Digital levels: show interactive logic gate controls
      showDigitalControls(level, idx);
    } else {
      // Analog levels: show resistor sliders
      showAnalogControls();
    }
    
    // before starting, ensure level is unlocked via quiz or match-3
    const unlocked = JSON.parse(localStorage.getItem('noteGateUnlocked') || '[]');
    if(!unlocked.includes(level)){
      console.log('🔒 Level ' + level + ' is locked. Showing unlock challenge...');
      // Check if this level has a quiz question
      if(quizQuestions[level]){
        // Show quiz modal to unlock
        showQuizModal(level);
        // when unlocked, callback will start the level
        window._onQuizUnlocked = function(){
          if(topic === 'analog'){ randomTargetForLevel(level); }
          startTimer(timeLimit); updateUI();
        };
      } else {
        // Fallback to match-3 for levels without quiz
        initMatchModal(level);
        showMatchModal();
        window._onMatchUnlocked = function(){
          if(topic === 'analog'){ randomTargetForLevel(level); }
          startTimer(timeLimit); updateUI();
        };
      }
    } else {
      console.log('✅ Level ' + level + ' is unlocked. Starting game...');
      if(topic === 'analog'){ randomTargetForLevel(level); }
      startTimer(timeLimit);
      updateUI();
      showToast('🎮 Level ' + level + ' started!');
    }
  }
  
  function showAnalogControls(){
    // Show resistor controls
    document.querySelectorAll('.controls').forEach(c => c.style.display = 'block');
    const dg = document.getElementById('digitalGame');
    if(dg) dg.style.display = 'none';
  }
  
  function showDigitalControls(level, idx){
    // Hide resistor controls
    document.querySelectorAll('.controls').forEach(c => c.style.display = 'none');
    // Show digital game UI
    let dg = document.getElementById('digitalGame');
    if(!dg){
      dg = document.createElement('div');
      dg.id = 'digitalGame';
      dg.innerHTML = `
        <div class="logic-inputs">
          <div class="input-toggle">
            <label>Input A:</label>
            <button id="inputA" class="logic-btn off" data-state="0">0 (LOW)</button>
          </div>
          <div class="input-toggle">
            <label>Input B:</label>
            <button id="inputB" class="logic-btn off" data-state="0">0 (LOW)</button>
          </div>
        </div>
        <div class="gate-visual" id="gateVisual">
          <div class="gate-box">?</div>
        </div>
        <div class="logic-output">
          <div class="output-display">
            <label>Output:</label>
            <div id="logicOutput" class="output-value off">0 (LOW)</div>
          </div>
        </div>
        <div class="truth-table-hint">
          <button id="showTruthTable" class="hint-btn">💡 Show Truth Table</button>
          <div id="truthTableDisplay" style="display:none"></div>
        </div>
      `;
      document.querySelector('.left').appendChild(dg);
      
      // Wire up toggle buttons
      document.getElementById('inputA').addEventListener('click', function(){
        const state = this.dataset.state === '0' ? '1' : '0';
        this.dataset.state = state;
        this.textContent = state === '1' ? '1 (HIGH)' : '0 (LOW)';
        this.classList.toggle('on', state === '1');
        this.classList.toggle('off', state === '0');
        updateDigitalOutput(level);
      });
      
      document.getElementById('inputB').addEventListener('click', function(){
        const state = this.dataset.state === '0' ? '1' : '0';
        this.dataset.state = state;
        this.textContent = state === '1' ? '1 (HIGH)' : '0 (LOW)';
        this.classList.toggle('on', state === '1');
        this.classList.toggle('off', state === '0');
        updateDigitalOutput(level);
      });
      
      document.getElementById('showTruthTable').addEventListener('click', function(){
        const tt = document.getElementById('truthTableDisplay');
        if(tt.style.display === 'none'){
          tt.style.display = 'block';
          showTruthTableFor(level);
        } else {
          tt.style.display = 'none';
        }
      });
    }
    dg.style.display = 'block';
    updateGateVisual(level);
  }
  
  function updateGateVisual(level){
    const gates = ['','AND','OR','NOT','NAND','NOR','XOR','Half Adder','Full Adder','4-bit Adder'];
    const visual = document.getElementById('gateVisual');
    if(visual){
      visual.querySelector('.gate-box').textContent = gates[level-1] || '?';
    }
  }
  
  function updateDigitalOutput(level){
    const a = parseInt(document.getElementById('inputA').dataset.state);
    const b = parseInt(document.getElementById('inputB').dataset.state);
    let output = 0;
    
    // Calculate output based on gate type (level)
    switch(level){
      case 2: output = a && b; break; // AND
      case 3: output = a || b; break; // OR
      case 4: output = !a ? 1 : 0; break; // NOT (only uses A)
      case 5: output = !(a && b) ? 1 : 0; break; // NAND
      case 6: output = !(a || b) ? 1 : 0; break; // NOR
      case 7: output = (a ^ b); break; // XOR
      case 8: case 9: case 10: output = (a ^ b); break; // Adders (simplified for now)
    }
    
    const outEl = document.getElementById('logicOutput');
    if(outEl){
      outEl.textContent = output === 1 ? '1 (HIGH)' : '0 (LOW)';
      outEl.classList.toggle('on', output === 1);
      outEl.classList.toggle('off', output === 0);
    }
    
    // Check if user explored all combinations (mini-challenge)
    checkDigitalCompletion(level, a, b, output);
  }
  
  function checkDigitalCompletion(level, a, b, output){
    // For now, simple check: if output is HIGH, solve the level
    if(output === 1 && !solved){
      solved = true;
      onSolve();
    }
  }
  
  function showTruthTableFor(level){
    const tables = {
      2: [['A','B','Out'],['0','0','0'],['0','1','0'],['1','0','0'],['1','1','1']], // AND
      3: [['A','B','Out'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','1']], // OR
      4: [['A','Out'],['0','1'],['1','0']], // NOT
      5: [['A','B','Out'],['0','0','1'],['0','1','1'],['1','0','1'],['1','1','0']], // NAND
      6: [['A','B','Out'],['0','0','1'],['0','1','0'],['1','0','0'],['1','1','0']], // NOR
      7: [['A','B','Out'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']]  // XOR
    };
    const table = tables[level];
    if(!table) return;
    
    let html = '<table class="truth-table"><tr>';
    table[0].forEach(h => html += `<th>${h}</th>`);
    html += '</tr>';
    for(let i=1; i<table.length; i++){
      html += '<tr>';
      table[i].forEach(cell => html += `<td>${cell}</td>`);
      html += '</tr>';
    }
    html += '</table>';
    document.getElementById('truthTableDisplay').innerHTML = html;
  }

  // --- Quiz Modal to unlock levels ---
  let currentQuizLevel = null;
  let selectedQuizAnswer = null;

  function showQuizModal(level){
    currentQuizLevel = level;
    selectedQuizAnswer = null;
    const quiz = quizQuestions[level];
    if(!quiz) return;
    
    const modal = document.getElementById('quizModal');
    document.getElementById('quizLevelNum').textContent = level;
    document.getElementById('questionText').textContent = quiz.question;
    
    // Render options
    const optionsEl = document.getElementById('quizOptions');
    optionsEl.innerHTML = '';
    quiz.options.forEach((option, idx) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'quiz-option';
      optionDiv.textContent = option;
      optionDiv.dataset.index = idx;
      optionDiv.addEventListener('click', function(){
        // Clear previous selections
        document.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectedQuizAnswer = idx;
        document.getElementById('quizSubmit').disabled = false;
      });
      optionsEl.appendChild(optionDiv);
    });
    
    // Reset feedback and buttons
    document.getElementById('quizFeedback').style.display = 'none';
    document.getElementById('quizSubmit').style.display = 'inline-block';
    document.getElementById('quizSubmit').disabled = true;
    document.getElementById('quizRetry').style.display = 'none';
    
    modal.style.display = 'flex';
    playSound('click');
  }

  function checkQuizAnswer(){
    if(selectedQuizAnswer === null || currentQuizLevel === null) return;
    
    const quiz = quizQuestions[currentQuizLevel];
    const isCorrect = selectedQuizAnswer === quiz.correct;
    const feedbackEl = document.getElementById('quizFeedback');
    const submitBtn = document.getElementById('quizSubmit');
    const retryBtn = document.getElementById('quizRetry');
    
    // Highlight correct/wrong answers
    const options = document.querySelectorAll('.quiz-option');
    options.forEach((option, idx) => {
      if(idx === quiz.correct){
        option.classList.add('correct');
      } else if(idx === selectedQuizAnswer && !isCorrect){
        option.classList.add('wrong');
      }
      option.style.pointerEvents = 'none'; // Disable further clicks
    });
    
    // Show feedback
    feedbackEl.style.display = 'block';
    if(isCorrect){
      feedbackEl.className = 'quiz-feedback correct';
      feedbackEl.textContent = quiz.explanation;
      submitBtn.style.display = 'none';
      
      // Unlock level after 2 seconds
      setTimeout(() => {
        unlockLevelAfterQuiz(currentQuizLevel);
      }, 2000);
      
      playSound('win');
      showToast('🎉 Correct Answer! Level Unlocked!');
    } else {
      feedbackEl.className = 'quiz-feedback wrong';
      feedbackEl.textContent = '❌ Wrong answer. Try again to learn!';
      submitBtn.style.display = 'none';
      retryBtn.style.display = 'inline-block';
      playSound('click');
    }
  }

  function retryQuiz(){
    showQuizModal(currentQuizLevel);
  }

  function unlockLevelAfterQuiz(level){
    // Mark level as unlocked
    const unlocked = JSON.parse(localStorage.getItem('noteGateUnlocked') || '[]');
    if(!unlocked.includes(level)){
      unlocked.push(level);
      localStorage.setItem('noteGateUnlocked', JSON.stringify(unlocked));
    }
    
    // Close modal
    document.getElementById('quizModal').style.display = 'none';
    
    // Call unlock callback
    if(window._onQuizUnlocked){
      window._onQuizUnlocked();
    }
    
    launchConfetti();
    showToast('🔓 Level ' + level + ' Unlocked! 🎓');
  }

  // Wire up quiz buttons
  const quizSubmitBtn = document.getElementById('quizSubmit');
  if(quizSubmitBtn){
    quizSubmitBtn.addEventListener('click', checkQuizAnswer);
  }
  
  const quizRetryBtn = document.getElementById('quizRetry');
  if(quizRetryBtn){
    quizRetryBtn.addEventListener('click', retryQuiz);
  }

  // --- Match-3 mini-game to unlock levels ---
  const COLORS = [
    {bg:'linear-gradient(135deg,#f97316,#fb923c)',emoji:'🍬'},
    {bg:'linear-gradient(135deg,#ec4899,#f472b6)',emoji:'🍭'},
    {bg:'linear-gradient(135deg,#3b82f6,#60a5fa)',emoji:'💎'},
    {bg:'linear-gradient(135deg,#10b981,#34d399)',emoji:'🍀'},
    {bg:'linear-gradient(135deg,#a855f7,#c084fc)',emoji:'🌟'}
  ];
  let matchState = {rows:6,cols:6,grid:[],score:0,moves:0,target:50,selected:null,levelToUnlock:1};

  function initMatchModal(level){
    matchState = {rows:6,cols:6,grid:[],score:0,moves:0,target:40 + (level-1)*15,selected:null,levelToUnlock:level};
    const gridEl = document.getElementById('matchGrid'); gridEl.innerHTML='';
    for(let r=0;r<matchState.rows;r++){
      for(let c=0;c<matchState.cols;c++){
        const idx = Math.floor(Math.random()*COLORS.length);
        matchState.grid.push(idx);
      }
    }
    renderMatchGrid();
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchMoves').textContent = matchState.moves;
    document.getElementById('matchTarget').textContent = matchState.target;
    document.getElementById('matchClose').disabled = true;
  }

  function renderMatchGrid(){
    const gridEl = document.getElementById('matchGrid'); gridEl.innerHTML='';
    for(let i=0;i<matchState.grid.length;i++){
      const cell = document.createElement('div'); cell.className='match-cell'; cell.dataset.index = i;
      const colorObj = COLORS[matchState.grid[i]];
      cell.style.background = colorObj.bg;
      cell.textContent = colorObj.emoji;
      cell.style.fontSize = '28px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.addEventListener('click', onCellClick);
      gridEl.appendChild(cell);
    }
  }

  function onCellClick(e){
    const idx = Number(e.currentTarget.dataset.index);
    if(matchState.selected === null){ matchState.selected = idx; e.currentTarget.style.outline='3px solid rgba(255,255,255,0.6)'; }
    else {
      const prev = matchState.selected; const valid = areAdjacent(prev, idx);
      clearSelectionUI();
      if(valid){ swapCells(prev, idx); matchState.moves += 1; document.getElementById('matchMoves').textContent = matchState.moves; const matched = resolveMatches(); if(matched){ matchState.score += matched*10; document.getElementById('matchScore').textContent = matchState.score; playSound('click'); } else { // swap back if no match
          swapCells(prev, idx);
        }
      }
      matchState.selected = null;
      checkMatchTarget();
    }
  }

  function clearSelectionUI(){ const cells = document.querySelectorAll('.match-cell'); cells.forEach(c=> c.style.outline=''); }
  function areAdjacent(a,b){ const ar = Math.floor(a/matchState.cols), ac = a%matchState.cols; const br = Math.floor(b/matchState.cols), bc = b%matchState.cols; return (Math.abs(ar-br)+Math.abs(ac-bc))===1; }
  function swapCells(a,b){ const tmp = matchState.grid[a]; matchState.grid[a]=matchState.grid[b]; matchState.grid[b]=tmp; renderMatchGrid(); }

  function resolveMatches(){
    const toRemove = new Set(); let total=0;
    // horizontal
    for(let r=0;r<matchState.rows;r++){
      let runStart=0; for(let c=1;c<=matchState.cols;c++){
        if(c<matchState.cols && matchState.grid[r*matchState.cols+c]===matchState.grid[r*matchState.cols+runStart]) continue;
        const runLen = c-runStart; if(runLen>=3){ for(let k=runStart;k<c;k++) toRemove.add(r*matchState.cols+k); }
        runStart = c;
      }
    }
    // vertical
    for(let c=0;c<matchState.cols;c++){
      let runStart=0; for(let r=1;r<=matchState.rows;r++){
        if(r<matchState.rows && matchState.grid[r*matchState.cols+c]===matchState.grid[runStart*matchState.cols+c]) continue;
        const runLen = r-runStart; if(runLen>=3){ for(let k=runStart;k<r;k++) toRemove.add(k*matchState.cols+c); }
        runStart = r;
      }
    }
    if(toRemove.size===0) return 0;
    total = toRemove.size;
    // remove and gravity
    for(const idx of Array.from(toRemove).sort((a,b)=>b-a)){
      matchState.grid.splice(idx,1);
    }
    // add new on top with animation
    while(matchState.grid.length < matchState.rows*matchState.cols) matchState.grid.unshift(Math.floor(Math.random()*COLORS.length));
    renderMatchGrid();
    // chain reaction: check again after a short delay
    setTimeout(()=>{ const more = resolveMatches(); if(more){ matchState.score += more*10; document.getElementById('matchScore').textContent = matchState.score; } },150);
    return total;
  }

  function checkMatchTarget(){
    if(matchState.score >= matchState.target){
      // unlocked
      const arr = JSON.parse(localStorage.getItem('noteGateUnlocked') || '[]');
      if(!arr.includes(matchState.levelToUnlock)) arr.push(matchState.levelToUnlock);
      localStorage.setItem('noteGateUnlocked', JSON.stringify(arr));
      document.getElementById('matchClose').disabled = false;
      document.getElementById('matchClose').addEventListener('click', function(){ hideMatchModal(); if(window._onMatchUnlocked) window._onMatchUnlocked(); unlockAchievement('🔓 Unlocked Level ' + matchState.levelToUnlock); });
      showToast('🎉 Amazing! Level ' + matchState.levelToUnlock + ' unlocked! 🔓'); playSound('win');
    }
  }

  function showMatchModal(){ document.getElementById('matchModal').style.display = 'flex'; }
  function hideMatchModal(){ document.getElementById('matchModal').style.display = 'none'; }

  // match modal controls
  document.addEventListener('click', function(e){ if(e.target && e.target.id==='matchReset'){ initMatchModal(matchState.levelToUnlock); } });

  // language selector
  const langSelect = document.getElementById('lang');
  if(langSelect){
    langSelect.addEventListener('change', function(e){ applyLang(e.target.value); });
  }

  // events
  els.r1.addEventListener('input', updateUI);
  els.r2.addEventListener('input', updateUI);
  els.randomize.addEventListener('click', function(){ randomizeLevel(); });
  els.hint.addEventListener('click', function(){
    const ratio = targetV / Vin;
    alert('Hint: make R2/(R1+R2) ≈ ' + ratio.toFixed(3) + '\nExample: set R1=1k, R2= (ratio/(1-ratio))*R1');
  });
  if(els.nextLevelBtn){
    els.nextLevelBtn.addEventListener('click', nextLevel);
  }

  // initialize
  if(els.level) els.level.textContent = currentLevel;
  els.score.textContent = score;
  // load high score
  const hsVal = localStorage.getItem('noteGateHighScore') || 0; document.getElementById('highscore').textContent = hsVal;
  // achievements UI
  loadAchievementsUI();
  
  // Ensure Level 1 is always unlocked by default
  const unlocked = JSON.parse(localStorage.getItem('noteGateUnlocked') || '[]');
  if(!unlocked.includes(1)){
    unlocked.push(1);
    localStorage.setItem('noteGateUnlocked', JSON.stringify(unlocked));
  }
  
  startLevel(currentLevel);

  // --- Visual confetti and audio helpers ---
  const confettiCanvas = document.getElementById('confetti-canvas');
  const ctx = confettiCanvas && confettiCanvas.getContext ? confettiCanvas.getContext('2d') : null;
  function resizeCanvas(){ if(!confettiCanvas) return; confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
  window.addEventListener('resize', resizeCanvas); resizeCanvas();

  let particles = [];
  function launchConfetti(){
    if(!ctx) return;
    const count = 100; particles = [];
    const emojis = ['🎉','⚡','💎','🌟','🍬','🍭','✨','🎊','🔥','💫'];
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*confettiCanvas.width,
        y: -10 - Math.random()*300,
        vx: (Math.random()-0.5)*8,
        vy: Math.random()*5+3,
        size: Math.random()*8+6,
        color: ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#fbbf24'][Math.floor(Math.random()*7)],
        rot: Math.random()*360,
        emoji: emojis[Math.floor(Math.random()*emojis.length)],
        isEmoji: Math.random() > 0.5
      });
    }
    function frame(){
      ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      for(let p of particles){
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.rot += 8;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        if(p.isEmoji){
          ctx.font = p.size*2 + 'px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        }
        ctx.restore();
      }
      particles = particles.filter(p=> p.y < confettiCanvas.height + 50);
      if(particles.length>0) requestAnimationFrame(frame);
      else ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    }
    requestAnimationFrame(frame);
  }

  // simple WebAudio beep/chime
  let soundEnabled = true;
  const audioCtx = (typeof window !== 'undefined' && window.AudioContext) ? new AudioContext() : null;
  function playSound(kind){ if(!soundEnabled || !audioCtx) return; const now = audioCtx.currentTime; if(kind === 'win'){ const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(880, now); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.2, now+0.01); o.connect(g); g.connect(audioCtx.destination); o.start(now); o.frequency.exponentialRampToValueAtTime(440, now+0.25); g.gain.exponentialRampToValueAtTime(0.0001, now+0.7); o.stop(now+0.75); } else if(kind === 'click'){ const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = 'square'; o.frequency.value = 880; g.gain.value = 0.05; o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + 0.06); } }

  // now that soundEnabled exists, apply language strings to UI
  applyLang(currentLang);

  // toast helper
  function showToast(text, ms=2200){ const t = document.getElementById('toast'); if(!t) return; t.textContent = text; t.style.display='block'; t.style.opacity=1; setTimeout(()=>{ t.style.transition='opacity 400ms'; t.style.opacity=0; setTimeout(()=> t.style.display='none',400); }, ms); }

  // achievements & persistence
  const ACH_KEY = 'noteGateAchievements';
  function unlockAchievement(name){ const data = JSON.parse(localStorage.getItem(ACH_KEY) || '[]'); if(!data.includes(name)){ data.push(name); localStorage.setItem(ACH_KEY, JSON.stringify(data)); showToast('Achievement: ' + name); loadAchievementsUI(); } }
  function loadAchievementsUI(){ const list = document.getElementById('achList'); if(!list) return; list.innerHTML=''; const data = JSON.parse(localStorage.getItem(ACH_KEY) || '[]'); if(data.length===0) list.innerHTML = '<li>(no achievements yet)</li>'; else for(const a of data){ const li = document.createElement('li'); li.textContent = a; list.appendChild(li); } }

  // ========== OPTION A: DRAG & DROP COMPONENTS ==========
  function initDragDrop(){
    const zone = document.getElementById('dragDropZone');
    if(!zone) return;
    
    const dropR1 = document.getElementById('dropR1');
    const dropR2 = document.getElementById('dropR2');
    const dropGate = document.getElementById('dropGate');
    
    // Draggable components
    document.querySelectorAll('.component-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', item.dataset.type);
        e.dataTransfer.setData('value', item.dataset.value || item.dataset.gate || '');
        playSound('click');
      });
    });
    
    // Drop targets for resistors
    [dropR1, dropR2].forEach((target, idx) => {
      if(!target) return;
      
      target.addEventListener('dragover', (e) => {
        e.preventDefault();
        target.classList.add('drag-over');
      });
      
      target.addEventListener('dragleave', () => {
        target.classList.remove('drag-over');
      });
      
      target.addEventListener('drop', (e) => {
        e.preventDefault();
        target.classList.remove('drag-over');
        
        const type = e.dataTransfer.getData('type');
        const value = e.dataTransfer.getData('value');
        
        if(type === 'resistor'){
          target.textContent = '🔧 ' + value + 'Ω';
          target.classList.add('filled');
          
          // Update actual resistor value
          if(idx === 0) els.r1.value = value;
          else els.r2.value = value;
          
          updateUI();
          playSound('win');
          showToast('✨ Component placed! ' + value + 'Ω');
        }
      });
    });
    
    // Drop target for gate
    if(dropGate){
      dropGate.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropGate.classList.add('drag-over');
      });
      
      dropGate.addEventListener('dragleave', () => {
        dropGate.classList.remove('drag-over');
      });
      
      dropGate.addEventListener('drop', (e) => {
        e.preventDefault();
        dropGate.classList.remove('drag-over');
        
        const type = e.dataTransfer.getData('type');
        const value = e.dataTransfer.getData('value');
        
        if(type === 'gate'){
          // Gate emoji mapping
          const gateEmojis = {
            'and': '🔷', 'or': '🔶', 'not': '🔘',
            'nand': '🔹', 'nor': '🔸', 'xor': '⭕'
          };
          
          dropGate.textContent = gateEmojis[value] + ' ' + value.toUpperCase() + ' Gate';
          dropGate.classList.add('filled');
          
          // Update gate type
          if(levels[currentLevel].mode === 'digital'){
            levels[currentLevel].gate = value;
          }
          
          updateUI();
          playSound('win');
          showToast('✨ Gate placed! ' + value.toUpperCase() + ' gate selected');
        }
      });
    }
    
    // Wire up manual input buttons
    const applyR1 = document.getElementById('applyR1');
    const applyR2 = document.getElementById('applyR2');
    const manualR1 = document.getElementById('manualR1');
    const manualR2 = document.getElementById('manualR2');
    
    if(applyR1 && manualR1){
      applyR1.addEventListener('click', function(){
        const value = parseInt(manualR1.value);
        console.log('📝 Manual R1 input: ' + value);
        if(value >= 100 && value <= 1000000){
          els.r1.value = value;
          console.log('✅ R1 slider updated to: ' + els.r1.value);
          if(dropR1){
            dropR1.textContent = '✍️ ' + value + 'Ω';
            dropR1.classList.add('filled');
          }
          // Trigger input event to ensure UI updates
          els.r1.dispatchEvent(new Event('input'));
          updateUI();
          playSound('win');
          showToast('✨ R1 set to ' + value + 'Ω');
        } else {
          showToast('❌ Enter value between 100-1000000Ω');
        }
      });
      
      // Press Enter to apply
      manualR1.addEventListener('keypress', function(e){
        if(e.key === 'Enter') applyR1.click();
      });
    }
    
    if(applyR2 && manualR2){
      applyR2.addEventListener('click', function(){
        const value = parseInt(manualR2.value);
        console.log('📝 Manual R2 input: ' + value);
        if(value >= 100 && value <= 1000000){
          els.r2.value = value;
          console.log('✅ R2 slider updated to: ' + els.r2.value);
          if(dropR2){
            dropR2.textContent = '✍️ ' + value + 'Ω';
            dropR2.classList.add('filled');
          }
          // Trigger input event to ensure UI updates
          els.r2.dispatchEvent(new Event('input'));
          updateUI();
          playSound('win');
          showToast('✨ R2 set to ' + value + 'Ω');
        } else {
          showToast('❌ Enter value between 100-1000000Ω');
        }
      });
      
      // Press Enter to apply
      manualR2.addEventListener('keypress', function(e){
        if(e.key === 'Enter') applyR2.click();
      });
    }
    
    // Wire up reset button for drag-drop
    const resetDragDrop = document.getElementById('resetDragDrop');
    if(resetDragDrop){
      resetDragDrop.addEventListener('click', function(){
        // Clear resistor drop targets
        [dropR1, dropR2].forEach(target => {
          if(target){
            target.textContent = 'Drop Here';
            target.classList.remove('filled', 'drag-over');
          }
        });
        
        // Clear gate drop target
        if(dropGate){
          dropGate.textContent = 'Drop Gate Here';
          dropGate.classList.remove('filled', 'drag-over');
        }
        
        // Clear manual inputs
        if(manualR1) manualR1.value = '';
        if(manualR2) manualR2.value = '';
        
        // Reset resistor values to default
        els.r1.value = 1000;
        els.r2.value = 1000;
        
        updateUI();
        playSound('click');
        showToast('🔄 Choices reset! Try again.');
      });
    }
  }
  
  // ========== OPTION B: PHYSICAL SWITCH CONTROLS ==========
  function initPhysicalSwitches(){
    const switchControls = document.getElementById('switchControls');
    if(!switchControls) return;
    
    const switchA = document.getElementById('switchA');
    const switchB = document.getElementById('switchB');
    
    [switchA, switchB].forEach((sw, idx) => {
      sw.addEventListener('click', function(){
        const isOn = this.classList.contains('on');
        this.classList.toggle('on', !isOn);
        
        const stateLabel = this.querySelector('.switch-state');
        stateLabel.textContent = !isOn ? 'HIGH' : 'LOW';
        
        playSound('click');
        
        // Update digital logic output
        const inputName = idx === 0 ? 'inputA' : 'inputB';
        const btn = document.getElementById(inputName);
        if(btn){
          btn.dataset.state = !isOn ? '1' : '0';
          btn.textContent = !isOn ? '1 (HIGH)' : '0 (LOW)';
          btn.className = !isOn ? 'logic-btn on' : 'logic-btn off';
        }
        
        // Recalculate output
        updateDigitalOutput(currentLevel);
      });
    });
    
    // Wire up reset button for switches
    const resetSwitches = document.getElementById('resetSwitches');
    if(resetSwitches){
      resetSwitches.addEventListener('click', function(){
        // Reset both switches to OFF/LOW
        [switchA, switchB].forEach((sw, idx) => {
          sw.classList.remove('on');
          const stateLabel = sw.querySelector('.switch-state');
          stateLabel.textContent = 'LOW';
          
          // Reset corresponding input buttons
          const inputName = idx === 0 ? 'inputA' : 'inputB';
          const btn = document.getElementById(inputName);
          if(btn){
            btn.dataset.state = '0';
            btn.textContent = '0 (LOW)';
            btn.className = 'logic-btn off';
          }
        });
        
        playSound('click');
        showToast('🔄 All switches reset to LOW!');
        updateDigitalOutput(currentLevel);
      });
    }
  }
  
  // ========== OPTION C: PUZZLE PIECE CIRCUIT BUILDER ==========
  let placedGate = null;
  
  function initPuzzleBuilder(){
    const builder = document.getElementById('puzzleBuilder');
    if(!builder) return;
    
    const gateSlot = document.getElementById('gateSlot');
    const gateText = gateSlot.querySelector('text');
    
    // Draggable puzzle pieces
    document.querySelectorAll('.puzzle-piece').forEach(piece => {
      piece.addEventListener('dragstart', (e) => {
        if(piece.classList.contains('placed')) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('piece', piece.dataset.piece);
        playSound('click');
      });
    });
    
    // Gate slot drop target
    gateSlot.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    gateSlot.addEventListener('drop', (e) => {
      e.preventDefault();
      const pieceName = e.dataTransfer.getData('piece');
      
      if(pieceName){
        // Update gate visual
        gateText.textContent = pieceName.toUpperCase();
        placedGate = pieceName;
        
        // Mark piece as placed
        const piece = document.querySelector(`.puzzle-piece[data-piece="${pieceName}"]`);
        if(piece) piece.classList.add('placed');
        
        playSound('win');
        showToast('🎯 Gate placed: ' + pieceName.toUpperCase());
        
        // Update logic output if inputs are set
        updateDigitalOutput(currentLevel);
      }
    });
    
    // SVG interactivity for inputs
    const inputSlots = [document.getElementById('pieceSlot1'), document.getElementById('pieceSlot2')];
    inputSlots.forEach((slot, idx) => {
      slot.addEventListener('click', function(){
        const circle = this.querySelector('circle');
        const currentFill = circle.getAttribute('fill');
        const isHigh = currentFill === '#4caf50';
        
        circle.setAttribute('fill', isHigh ? '#fff' : '#4caf50');
        playSound('click');
        
        // Update corresponding input button
        const inputName = idx === 0 ? 'inputA' : 'inputB';
        const btn = document.getElementById(inputName);
        if(btn){
          btn.dataset.state = isHigh ? '0' : '1';
          btn.textContent = isHigh ? '0 (LOW)' : '1 (HIGH)';
          btn.className = isHigh ? 'logic-btn off' : 'logic-btn on';
        }
        
        updateDigitalOutput(currentLevel);
      });
    });
  }
  
  // Show appropriate interaction mode based on level
  function showInteractionMode(level, mode = 'auto'){
    // Hide all modes first
    const dragDrop = document.getElementById('dragDropZone');
    const switches = document.getElementById('switchControls');
    const puzzle = document.getElementById('puzzleBuilder');
    const wirePuzzle = document.getElementById('wireConnectPuzzle');
    const componentMatch = document.getElementById('componentMatch');
    const patternPuzzle = document.getElementById('patternPuzzle');
    const standard = document.getElementById('standardControls');
    
    [dragDrop, switches, puzzle, wirePuzzle, componentMatch, patternPuzzle, standard].forEach(el => {
      if(el) el.style.display = 'none';
    });
    
    // Set body class based on level mode (analog or digital)
    const levelConfig = levels[level];
    document.body.classList.remove('analog-level', 'digital-level');
    if(levelConfig && levelConfig.mode === 'digital'){
      document.body.classList.add('digital-level');
    } else {
      document.body.classList.add('analog-level');
    }
    
    // Auto-select mode based on level - VARIETY!
    if(mode === 'auto'){
      const puzzleType = level % 6; // Rotate through 6 different puzzle types
      
      switch(puzzleType){
        case 1: // Level 1, 7
          if(dragDrop){ dragDrop.style.display = 'block'; initDragDrop(); }
          break;
        case 2: // Level 2, 8
          if(switches){ switches.style.display = 'flex'; initPhysicalSwitches(); }
          break;
        case 3: // Level 3, 9
          if(puzzle){ puzzle.style.display = 'block'; initPuzzleBuilder(); }
          break;
        case 4: // Level 4, 10
          if(wirePuzzle){ wirePuzzle.style.display = 'block'; initWireConnectPuzzle(); }
          break;
        case 5: // Level 5
          if(componentMatch){ componentMatch.style.display = 'block'; initComponentMatch(); }
          break;
        case 0: // Level 6
          if(patternPuzzle){ patternPuzzle.style.display = 'block'; initPatternPuzzle(); }
          break;
      }
    }
  }
  
  // ========== OPTION D: WIRE CONNECTION PUZZLE ==========
  let wireConnections = [];
  let selectedTerminal = null;
  const correctWires = {L1: 'R2', L2: 'R1', L3: 'R3'}; // Correct connections
  
  function initWireConnectPuzzle(){
    wireConnections = [];
    selectedTerminal = null;
    document.getElementById('wireDrawingArea').innerHTML = '';
    document.getElementById('wireFeedback').classList.remove('show');
    
    // Add click handlers to terminals
    document.querySelectorAll('.terminal').forEach(term => {
      term.addEventListener('click', function(){
        const termId = this.dataset.terminal;
        
        if(!selectedTerminal){
          // First click - select terminal
          selectedTerminal = termId;
          this.classList.add('selected');
          playSound('click');
        } else if(selectedTerminal === termId){
          // Clicking same terminal - deselect
          this.classList.remove('selected');
          selectedTerminal = null;
        } else {
          // Second click - create wire
          const firstTerm = document.querySelector(`[data-terminal="${selectedTerminal}"]`);
          firstTerm.classList.remove('selected');
          
          createWire(selectedTerminal, termId);
          selectedTerminal = null;
        }
      });
    });
  }
  
  function createWire(from, to){
    const fromEl = document.querySelector(`[data-terminal="${from}"] circle`);
    const toEl = document.querySelector(`[data-terminal="${to}"] circle`);
    
    const x1 = parseFloat(fromEl.getAttribute('cx'));
    const y1 = parseFloat(fromEl.getAttribute('cy'));
    const x2 = parseFloat(toEl.getAttribute('cx'));
    const y2 = parseFloat(toEl.getAttribute('cy'));
    
    const wire = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    wire.setAttribute('x1', x1);
    wire.setAttribute('y1', y1);
    wire.setAttribute('x2', x2);
    wire.setAttribute('y2', y2);
    wire.setAttribute('class', 'wire-line');
    wire.dataset.from = from;
    wire.dataset.to = to;
    
    // Check if correct
    const isCorrect = correctWires[from] === to || correctWires[to] === from;
    wire.style.stroke = isCorrect ? '#10b981' : '#ef4444';
    if(isCorrect) wire.classList.add('correct');
    else wire.classList.add('wrong');
    
    wireConnections.push({from, to, correct: isCorrect});
    
    document.getElementById('wireDrawingArea').appendChild(wire);
    playSound(isCorrect ? 'win' : 'click');
    
    // Check if all connections are made
    checkWireCompletion();
  }
  
  function checkWireCompletion(){
    if(wireConnections.length >= 3){
      const allCorrect = wireConnections.every(w => w.correct);
      const feedback = document.getElementById('wireFeedback');
      feedback.classList.add('show');
      
      if(allCorrect){
        feedback.className = 'wire-feedback show success';
        feedback.textContent = '✅ Perfect! All wires connected correctly!';
        setTimeout(() => onSolve(), 1000);
      } else {
        feedback.className = 'wire-feedback show error';
        feedback.textContent = '❌ Some wires are wrong. Check the colors!';
      }
    }
  }
  
  // Wire reset
  document.getElementById('resetWires')?.addEventListener('click', function(){
    wireConnections = [];
    document.getElementById('wireDrawingArea').innerHTML = '';
    document.getElementById('wireFeedback').classList.remove('show');
    playSound('click');
    showToast('🔄 Wires cleared!');
  });
  
  // ========== OPTION E: COMPONENT MATCHING PUZZLE ==========
  function initComponentMatch(){
    const draggables = document.querySelectorAll('.match-item.draggable');
    const slots = document.querySelectorAll('.match-slot');
    
    draggables.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('componentId', item.dataset.id);
        playSound('click');
      });
    });
    
    slots.forEach(slot => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('drag-over');
      });
      
      slot.addEventListener('dragleave', () => {
        slot.classList.remove('drag-over');
      });
      
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        
        const componentId = e.dataTransfer.getData('componentId');
        const correctAnswer = slot.dataset.answer;
        
        if(componentId === correctAnswer){
          slot.classList.add('filled');
          slot.textContent = '✅ ' + componentId;
          playSound('win');
          
          // Check if all matched
          const allFilled = Array.from(slots).every(s => s.classList.contains('filled'));
          if(allFilled){
            showToast('🎉 All components matched correctly!');
            setTimeout(() => onSolve(), 1000);
          }
        } else {
          slot.classList.add('wrong');
          playSound('click');
          setTimeout(() => slot.classList.remove('wrong'), 500);
          showToast('❌ Wrong match! Try again.');
        }
      });
    });
  }
  
  // ========== OPTION F: PATTERN RECOGNITION PUZZLE ==========
  function initPatternPuzzle(){
    document.querySelectorAll('.pattern-option').forEach(btn => {
      btn.addEventListener('click', function(){
        const answer = this.dataset.answer;
        const feedback = document.getElementById('patternFeedback');
        
        // For this simple pattern: 1,0,1,? -> answer is 0 (alternating)
        const correctAnswer = '0';
        
        if(answer === correctAnswer){
          feedback.className = 'pattern-feedback show success';
          feedback.textContent = '✅ Correct! The pattern alternates: 1-0-1-0';
          playSound('win');
          setTimeout(() => onSolve(), 1500);
        } else {
          feedback.className = 'pattern-feedback show error';
          feedback.textContent = '❌ Not quite! Look for the alternating pattern.';
          playSound('click');
        }
      });
    });
  }

  // ========== POWER-UPS SYSTEM ==========
  function initPowerUps(){
    const powerupsBar = document.getElementById('powerupsBar');
    if(score >= 50 && powerupsBar) powerupsBar.style.display = 'block';
    
    // Hint Power-up
    const hintBtn = document.getElementById('hintPowerup');
    if(hintBtn){
      hintBtn.addEventListener('click', function(){
        const cost = Number(this.dataset.cost);
        if(score >= cost){
          score -= cost;
          els.score.textContent = score;
          
          // Show hint based on level type
          const cfg = levels[currentLevel - 1];
          const topic = cfg[5] || 'analog';
          
          if(topic === 'analog'){
            const ratio = targetV / Vin;
            const suggestedR1 = 1000;
            const suggestedR2 = Math.round(suggestedR1 * ratio / (1 - ratio));
            showToast('💡 Hint: Try R1≈' + suggestedR1 + 'Ω, R2≈' + suggestedR2 + 'Ω');
          } else {
            showToast('💡 Hint: Check the truth table! Look for patterns.');
          }
          
          playSound('click');
          updatePowerUpButtons();
        } else {
          showToast('❌ Not enough points! Need ' + cost + ' pts.');
        }
      });
    }
    
    // Time Power-up
    const timeBtn = document.getElementById('timePowerup');
    if(timeBtn){
      timeBtn.addEventListener('click', function(){
        const cost = Number(this.dataset.cost);
        if(score >= cost){
          score -= cost;
          els.score.textContent = score;
          timeLeft += 30;
          els.timer.textContent = timeLeft;
          showToast('⏰ +30 seconds added!');
          playSound('win');
          updatePowerUpButtons();
        } else {
          showToast('❌ Not enough points! Need ' + cost + ' pts.');
        }
      });
    }
    
    // Skip Power-up
    const skipBtn = document.getElementById('skipPowerup');
    if(skipBtn){
      skipBtn.addEventListener('click', function(){
        const cost = Number(this.dataset.cost);
        if(score >= cost && currentLevel < levels.length){
          score -= cost;
          els.score.textContent = score;
          showToast('⏭️ Level skipped! Moving to next level.');
          playSound('click');
          nextLevel();
          updatePowerUpButtons();
        } else if(score < cost){
          showToast('❌ Not enough points! Need ' + cost + ' pts.');
        } else {
          showToast('❌ Already at final level!');
        }
      });
    }
  }
  
  function updatePowerUpButtons(){
    const powerupsBar = document.getElementById('powerupsBar');
    if(score >= 50){
      if(powerupsBar) powerupsBar.style.display = 'block';
    }
    
    // Enable/disable based on score
    ['hintPowerup', 'timePowerup', 'skipPowerup'].forEach(id => {
      const btn = document.getElementById(id);
      if(btn){
        const cost = Number(btn.dataset.cost);
        btn.disabled = score < cost;
      }
    });
  }

  // wire sound toggle
  const soundBtn = document.getElementById('soundToggle'); if(soundBtn){ soundBtn.addEventListener('click', function(){ soundEnabled = !soundEnabled; const labels = I18N[currentLang] || I18N.en; soundBtn.textContent = soundEnabled? labels.soundOn: labels.soundOff; soundBtn.classList.toggle('off', !soundEnabled); playSound('click'); }); }
  
  // Initialize power-ups
  initPowerUps();
  updateProgressBar();
  
  // Load high score on page load
  const savedHigh = Number(localStorage.getItem('noteGateHighScore') || 0);
  const hsEl = document.getElementById('highscore');
  if(hsEl) hsEl.textContent = savedHigh;
});


