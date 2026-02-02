(function(){
  const display = document.getElementById('display');
  const buttons = Array.from(document.querySelectorAll('.btn'));
  const clearBtn = document.getElementById('clear');
  const backBtn = document.getElementById('back');
  const equalsBtn = document.getElementById('equals');

  let current = '';

  function updateDisplay(){
    display.value = current || '0';
  }

  function append(value){
    // Prevent multiple decimals in a number
    if(value === '.'){ 
      const parts = current.split(/([+\-*/])/);
      const last = parts[parts.length-1];
      if(last.includes('.')) return;
      if(last === '') value = '0.'; // allow . => 0.
    }

    // Prevent two operators in a row
    if(/[+\-*/]/.test(value)){ 
      if(current === '') return; // no leading operator
      if(/[+\-*/]$/.test(current)){ 
        // replace last operator
        current = current.slice(0,-1) + value;
        updateDisplay();
        return;
      }
    }

    current += value;
    updateDisplay();
  }

  function clearAll(){
    current = '';
    updateDisplay();
  }

  function backspace(){
    current = current.slice(0,-1);
    updateDisplay();
  }

  function compute(){
    if(current === '') return;
    try{
      // Evaluate safely: replace any unicode operators and limit chars
      const sanitized = current.replace(/×/g,'*').replace(/÷/g,'/');
      if(/[^0-9.+\-*/() ]/.test(sanitized)){
        throw new Error('Invalid characters');
      }
      // Use Function instead of eval to avoid indirect eval surprises
      const result = Function('return (' + sanitized + ')')();
      current = String(result);
      updateDisplay();
    }catch(e){
      current = '';
      display.value = 'Error';
      setTimeout(updateDisplay,800);
    }
  }

  // Button clicks
  buttons.forEach(btn => {
    const v = btn.dataset.value;
    if(v){
      btn.addEventListener('click', () => append(v));
    }
  });

  clearBtn.addEventListener('click', clearAll);
  backBtn.addEventListener('click', backspace);
  equalsBtn.addEventListener('click', compute);

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if(e.key >= '0' && e.key <= '9') append(e.key);
    else if(e.key === '.') append('.');
    else if(e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
    else if(e.key === 'Backspace') backspace();
    else if(e.key === 'Escape') clearAll();
    else if(['+','-','*','/'].includes(e.key)) append(e.key);
  });

  updateDisplay();
})();