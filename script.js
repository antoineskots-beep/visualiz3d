const steps = ['1','2','3','4','5','6','7','done'];
let idx = 0;
const panels = document.querySelectorAll('.step-panel');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const stepTitle = document.getElementById('stepTitle');
const stepTrack = document.getElementById('stepTrack');
const trackLabels = ['business','site','inspiration','contact','goal','timeline','budget'];
const quoteForm = document.getElementById('quoteForm');
const formError = document.getElementById('formError');
const contactEmail = document.getElementById('contactEmail');
const contactPhone = document.getElementById('contactPhone');

function render(){
  panels.forEach(p => p.classList.toggle('active', p.dataset.step === steps[idx]));
  backBtn.style.visibility = (idx === 0 || steps[idx] === 'done') ? 'hidden' : 'visible';
  if(steps[idx] === 'done'){
    nextBtn.style.display = 'none'; stepTitle.textContent = 'Done';
  } else {
    nextBtn.style.display = 'inline-flex';
    nextBtn.disabled = false;
    nextBtn.textContent = idx === steps.length - 2 ? 'Send' : 'Continue';
    stepTitle.textContent = `Step ${idx+1} of ${trackLabels.length}`;
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

async function submitQuote(){
  formError.style.display = 'none';
  nextBtn.disabled = true;
  nextBtn.textContent = 'Sending…';

  try {
    const formData = new FormData(quoteForm);
    const res = await fetch(quoteForm.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });
    const result = await res.json();

    if (result.success) {
      idx = steps.length - 1;
      render();
      setTimeout(() => { window.location.href = 'thank-you.html'; }, 600);
    } else {
      throw new Error(result.message || 'Something went wrong.');
    }
  } catch (err) {
    formError.textContent = "Couldn't send that — check your connection and try again.";
    formError.style.display = 'block';
    nextBtn.disabled = false;
    nextBtn.textContent = 'Send';
  }
}

nextBtn.addEventListener('click', () => {
  if (steps[idx] === '4') {
    formError.style.display = 'none';
    if (!contactEmail.value.trim() || !contactPhone.value.trim()) {
      formError.textContent = "We'll need both an email and a phone number to follow up.";
      formError.style.display = 'block';
      return;
    }
  }
  if (idx === steps.length - 2) {
    submitQuote();
    return;
  }
  if (idx < steps.length - 1) { idx++; render(); }
});

backBtn.addEventListener('click', () => { if(idx>0){ idx--; render(); } });

render();