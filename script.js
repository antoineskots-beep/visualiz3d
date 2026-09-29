const steps = ['1','2','3','4','5','done'];
let idx = 0;
const panels = document.querySelectorAll('.step-panel');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const stepTitle = document.getElementById('stepTitle');
const stepTrack = document.getElementById('stepTrack');
const trackLabels = ['business','site','goal','timeline','budget'];
const quoteForm = document.getElementById('quoteForm');
const nextUrlField = document.getElementById('nextUrl');

// Point FormSubmit back to this same page with ?sent=1 so we can show the confirmation step after redirect
if (nextUrlField) {
  nextUrlField.value = window.location.origin + window.location.pathname + '?sent=1#quote';
}

function render(){
  panels.forEach(p => p.classList.toggle('active', p.dataset.step === steps[idx]));
  backBtn.style.visibility = idx === 0 ? 'hidden' : 'visible';
  if(steps[idx] === 'done'){
    nextBtn.style.display = 'none'; stepTitle.textContent = 'Done';
  } else {
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = idx === steps.length - 2 ? 'Send' : 'Continue';
    stepTitle.textContent = `Step ${idx+1} of 5`;
    stepTrack.innerHTML = trackLabels.map((l,i)=> i===idx ? `<strong style="color:var(--ink)">${l}</strong>` : l).join(' — ');
  }
}

document.querySelectorAll('.opt').forEach(opt => {
  opt.addEventListener('click', () => {
    const group = opt.dataset.group;
    document.querySelectorAll(`.opt[data-group="${group}"]`).forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');

    const fieldMap = { goal: 'goalField', timeline: 'timelineField', budget: 'budgetField' };
    const targetField = document.getElementById(fieldMap[group]);
    if (targetField) targetField.value = opt.textContent.trim();

    if(group === 'budget'){
      document.getElementById('lowBudgetNote').style.display = opt.textContent.includes('Under $300') ? 'block' : 'none';
    }
  });
});

nextBtn.addEventListener('click', () => {
  if (idx === steps.length - 2) {
    // Last real step — submit the form to FormSubmit, which will redirect back with ?sent=1
    quoteForm.submit();
    return;
  }
  if (idx < steps.length - 1) { idx++; render(); }
});

backBtn.addEventListener('click', () => { if(idx>0){ idx--; render(); } });

// If we've just been redirected back from FormSubmit, jump straight to the confirmation panel
if (window.location.search.includes('sent=1')) {
  idx = steps.length - 1;
}

render();