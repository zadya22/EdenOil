/* ---------------- Modal / Toast (shared across all pages) ---------------- */
function ensureModalScaffold(){
  if (document.getElementById('modal-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'modal-overlay';
  overlay.className = 'modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
  overlay.innerHTML = `
    <div class="modal-box" role="dialog" aria-modal="true">
      <button class="modal-close" onclick="closeModal()" aria-label="Fermer la fenêtre">✕</button>
      <div id="modal-content"></div>
    </div>`;
  document.body.appendChild(overlay);

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);
}
function openModalRaw(html){
  ensureModalScaffold();
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('show');
}
function closeModal(){
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('show');
}
function showToast(msg){
  ensureModalScaffold();
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2600);
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ---------------- Login forms: always proceed, credentials optional ---------------- */
function handleDemoLogin(e, destination){
  e.preventDefault();
  // Intentionally does not validate or require email/password — demo access.
  window.location.href = destination;
  return false;
}

/* ---------------- Generic keyboard support for clickable non-native elements ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  ensureModalScaffold();
  document.querySelectorAll('[onclick]').forEach(el => {
    const tag = el.tagName.toLowerCase();
    if (tag !== 'button' && tag !== 'a' && tag !== 'input') {
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.click(); }
      });
    }
  });

  /* Active nav/sidebar highlighting */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-item').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === path) a.classList.add('active');
  });
});

/* ---------------- Eden stock page: demand form ---------------- */
function handleDemandSubmit(e){
  e.preventDefault();
  const success = document.getElementById('demand-success');
  const form = document.getElementById('demand-form-el');
  if (success) success.style.display = 'block';
  if (form) form.reset();
  showToast('Votre demande a été envoyée à Eden.');
  return false;
}
function requestCarnet(){
  openModalRaw(`
    <h2>Recevoir le carnet de stocks</h2>
    <p>Indiquez l'adresse à laquelle envoyer le PDF (facultatif pour cette démo).</p>
    <label>Email<input id="carnet-email" type="email" placeholder="vous@entreprise.com"></label>
    <div class="modal-actions">
      <button class="btn-outline" type="button" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" type="button" onclick="sendCarnet()">Envoyer</button>
    </div>
  `);
}
function sendCarnet(){
  closeModal();
  showToast('Carnet de stocks envoyé (démo).');
}

/* ---------------- Eden dashboard: order alert ---------------- */
function openOrderDetail(){
  openModalRaw(`
    <h2>Commande — Ibrahim O.</h2>
    <div class="modal-row"><span>Quantité</span><b>80 bidons</b></div>
    <div class="modal-row"><span>Zone</span><b>Ouidah</b></div>
    <div class="modal-row"><span>Livraison</span><b>Frontière</b></div>
    <div class="modal-row" style="border-bottom:none"><span>Prix</span><b>500 F/bidon</b></div>
    <div class="modal-actions">
      <button class="btn-outline" type="button" onclick="closeModal()">Refuser</button>
      <button class="btn-primary" type="button" onclick="acceptOrder()">Accepter la commande</button>
    </div>
  `);
}
function acceptOrder(){
  closeModal();
  showToast('Commande acceptée — Ibrahim O. sera notifié.');
  const btn = document.getElementById('traiter-btn');
  if (btn) { btn.textContent = '✓ Traitée'; btn.disabled = true; }
}

/* ---------------- Gestion stock interne (producteur) ---------------- */
function openLotModal(existing){
  const isEdit = !!existing;
  openModalRaw(`
    <h2>${isEdit ? 'Modifier le lot' : 'Ajouter un lot'}</h2>
    <label>Quantité (bidons)<input id="lot-qty" type="number" min="1" value="${isEdit ? existing.qty : ''}"></label>
    <label>Date de production<input id="lot-date" type="date" value="${isEdit ? existing.date : ''}"></label>
    <div class="modal-actions">
      <button class="btn-outline" type="button" onclick="closeModal()">Annuler</button>
      <button class="btn-primary" type="button" onclick="closeModal();showToast('Lot enregistré.')">Enregistrer</button>
    </div>
  `);
}
function deleteLot(row){
  if (row) row.remove();
  showToast('Lot supprimé.');
}

/* ---------------- Settings page ---------------- */
function handleSettingsSubmit(e){
  e.preventDefault();
  const saved = document.getElementById('settings-saved');
  if (saved) saved.style.display = 'block';
  showToast('Paramètres enregistrés.');
  return false;
}

/* ---------------- Simple financial simulation recompute ---------------- */
function recomputeSimulation(){
  const budget = parseFloat(document.getElementById('sim-budget')?.value) || 0;
  const noix = parseFloat(document.getElementById('sim-noix')?.value) || 0;
  const main = parseFloat(document.getElementById('sim-main')?.value) || 0;
  const divers = parseFloat(document.getElementById('sim-divers')?.value) || 0;
  const marge = budget - noix - main - divers;
  const out = document.getElementById('sim-marge-out');
  if (out) out.textContent = (marge >= 0 ? '+' : '') + marge.toFixed(1).replace('.', ',') + ' M FCFA';
}
