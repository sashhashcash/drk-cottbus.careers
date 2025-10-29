const API_BASE = '';

const state = {
  token: localStorage.getItem('drk_admin_token'),
  applications: [],
  filteredApplications: [],
  translations: {}
};

const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutButton = document.getElementById('logoutButton');
const searchInput = document.getElementById('searchInput');
const languageFilter = document.getElementById('languageFilter');
const applicationTable = document.getElementById('applicationTable');
const applicationCount = document.getElementById('applicationCount');
const modal = document.getElementById('applicationModal');
const modalContent = document.getElementById('modalContent');
const modalMeta = document.getElementById('modalMeta');
const closeModalButton = document.getElementById('closeModalButton');
const downloadApplicationButton = document.getElementById('downloadApplicationButton');
const archiveApplicationButton = document.getElementById('archiveApplicationButton');
const deleteApplicationButton = document.getElementById('deleteApplicationButton');
const dashboardMessageWrapper = document.getElementById('dashboardMessageWrapper');
const dashboardMessage = document.getElementById('dashboardMessage');

const attachmentLabels = {
  lebenslauf: 'Lebenslauf',
  zeugnisse: 'Zeugnisse',
  bewerbungsfoto: 'Bewerbungsfoto',
  bewerbungsvideo: 'Bewerbungsvideo'
};

let currentApplication = null;
let messageTimeout = null;

function formatDate(value) {
  if (!value) return '–';
  return new Intl.DateTimeFormat('de-DE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function ensureFeather() {
  if (window.feather) {
    window.feather.replace();
  }
}

function renderStatusBadge(application) {
  if (application.archived) {
    return '<span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">Archiviert</span>';
  }
  return '<span class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Aktiv</span>';
}

function hideDashboardMessage() {
  if (!dashboardMessageWrapper) return;
  dashboardMessageWrapper.classList.add('hidden');
  if (messageTimeout) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }
}

function showDashboardMessage(text, variant = 'success') {
  if (!dashboardMessageWrapper || !dashboardMessage) return;
  const variantClasses = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700'
  };
  const baseClasses = 'rounded-lg border px-4 py-3 text-sm flex items-start gap-2';
  const iconMap = {
    success: 'check-circle',
    error: 'alert-triangle',
    info: 'info'
  };

  dashboardMessage.innerHTML = `
    <i data-feather="${iconMap[variant] || iconMap.info}" class="w-4 h-4 mt-0.5"></i>
    <span>${text}</span>
  `;
  dashboardMessage.className = `${baseClasses} ${variantClasses[variant] || variantClasses.info}`;
  dashboardMessageWrapper.classList.remove('hidden');
  ensureFeather();

  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }
  messageTimeout = setTimeout(() => hideDashboardMessage(), 4000);
}

function toggleLoading(stateText = 'Lade ...') {
  applicationTable.innerHTML = `
    <tr>
      <td colspan="7" class="px-6 py-10 text-center text-gray-500">
        <div class="flex flex-col items-center gap-3">
          <i data-feather="loader" class="w-10 h-10 text-gray-300 animate-spin"></i>
          <p>${stateText}</p>
        </div>
      </td>
    </tr>
  `;
  ensureFeather();
}

async function fetchApplications() {
  if (!state.token) return;
  try {
    toggleLoading();
    const response = await fetch(`${API_BASE}/api/applications`, {
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Fehler beim Laden der Bewerbungen');
    }

    const data = await response.json();
    state.applications = data;
    populateLanguageFilter();
    renderApplications();

    if (!modal.classList.contains('hidden') && currentApplication) {
      const updated = state.applications.find((item) => item.id === currentApplication.id);
      if (updated) {
        renderModal(updated);
      } else {
        hideModal();
        currentApplication = null;
      }
    }
  } catch (error) {
    applicationTable.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-red-500">
          ${error.message}
        </td>
      </tr>
    `;
  }
}

function populateLanguageFilter() {
  const languages = new Set(state.applications.map((item) => item.formLanguage || 'de'));
  languageFilter.innerHTML = '<option value="">Alle Sprachen</option>';
  Array.from(languages)
    .sort()
    .forEach((language) => {
      const option = document.createElement('option');
      option.value = language;
      option.textContent = language.toUpperCase();
      languageFilter.appendChild(option);
    });
}

function matchesSearch(application, query) {
  if (!query) return true;
  const haystack = [
    application.vorname,
    application.nachname,
    application.email,
    application.selectedJob,
    application.telefon,
    application.adresse,
    application.ort
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function updateApplicationInState(updatedApplication) {
  if (!updatedApplication || !updatedApplication.id) return;
  const index = state.applications.findIndex((item) => item.id === updatedApplication.id);
  if (index !== -1) {
    state.applications[index] = {
      ...state.applications[index],
      ...updatedApplication
    };
  }
}

function removeApplicationFromState(id) {
  if (!id) return;
  state.applications = state.applications.filter((item) => item.id !== id);
  state.filteredApplications = state.filteredApplications.filter((item) => item.id !== id);
  delete state.translations[id];
}

function renderApplications() {
  const query = searchInput.value.trim();
  const selectedLanguage = languageFilter.value;

  const filtered = state.applications.filter((application) => {
    const languageMatch = selectedLanguage ? application.formLanguage === selectedLanguage : true;
    return languageMatch && matchesSearch(application, query);
  });

  state.filteredApplications = filtered;
  applicationCount.textContent = filtered.length;

  if (!filtered.length) {
    applicationTable.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-gray-500">
          <div class="flex flex-col items-center gap-3">
            <i data-feather="inbox" class="w-10 h-10 text-gray-300"></i>
            <p>Keine Bewerbungen gefunden.</p>
          </div>
        </td>
      </tr>
    `;
    ensureFeather();
    return;
  }

  const rows = filtered
    .map((application) => {
      const rowClasses = application.archived ? 'hover:bg-gray-50 bg-gray-50/70' : 'hover:bg-gray-50';
      return `
        <tr class="${rowClasses}">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${formatDate(application.createdAt)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${application.archived ? 'text-gray-500' : 'text-gray-900'}">${application.vorname || ''} ${application.nachname || ''}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${application.selectedJob || '—'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${(application.formLanguage || 'de').toUpperCase()}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${application.germanLevel || '—'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">${renderStatusBadge(application)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="inline-flex items-center gap-3">
              <button class="inline-flex items-center gap-1 text-red-600 hover:text-red-800" data-action="view-application" data-id="${application.id}">
                <i data-feather="eye" class="w-4 h-4"></i>
                Details
              </button>
              <button class="text-gray-400 hover:text-gray-600" title="Herunterladen" data-action="download-application" data-id="${application.id}">
                <i data-feather="download" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  applicationTable.innerHTML = rows;
  ensureFeather();
}

function renderList(items, fallback = 'Keine Angaben') {
  if (!items || !items.length) {
    return `<p class="text-sm text-gray-500">${fallback}</p>`;
  }

  return `
    <ol class="space-y-4">
      ${items
        .map((item) => `
          <li class="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <p class="font-semibold text-gray-800">${item.arbeitgeber || item.bildungseinrichtung || '—'}</p>
            <p class="text-sm text-gray-600">${item.position || item.abschluss || ''}</p>
            <p class="text-xs text-gray-500 mt-1">${item.startdatum || item.bildungsstart || '—'} – ${item.enddatum || item.bildungsende || '—'}</p>
            ${item.beschreibung || item.fachrichtung ? `<p class="text-sm text-gray-700 mt-2 whitespace-pre-line">${item.beschreibung || item.fachrichtung}</p>` : ''}
          </li>
        `)
        .join('')}
    </ol>
  `;
}

function renderAttachments(attachments) {
  if (!attachments || !attachments.length) {
    return '<p class="text-sm text-gray-500">Keine Dateien hochgeladen.</p>';
  }

  const renderCard = (content) => `
    <div class="border border-gray-200 rounded-lg p-3 bg-white">
      ${content}
    </div>
  `;

  return `
    <div class="grid md:grid-cols-2 gap-3">
      ${attachments
        .map((file) => {
          const meta = `
            <div class="flex items-center justify-between gap-3">
              <div class="space-y-0.5">
                <p class="text-sm font-medium text-gray-800">${attachmentLabels[file.fieldName] || file.filename}</p>
                <p class="text-xs text-gray-500">${file.filename} · ${(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <a href="${file.publicPath}" download class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
                <i data-feather="download" class="w-4 h-4"></i>
                Download
              </a>
            </div>
          `;

          if (file.mimetype && file.mimetype.startsWith('video/')) {
            return renderCard(`
              ${meta}
              <video controls class="w-full mt-3 rounded-lg max-h-64 bg-black" src="${file.publicPath}"></video>
            `);
          }

          return renderCard(`
            <a href="${file.publicPath}" class="flex items-center gap-3" download>
              <i data-feather="paperclip" class="w-4 h-4 text-red-500"></i>
              <div>
                <p class="text-sm font-medium text-gray-800">${attachmentLabels[file.fieldName] || file.filename}</p>
                <p class="text-xs text-gray-500">${file.filename}</p>
              </div>
            </a>
          `);
        })
        .join('')}
    </div>
  `;
}

function updateActionButtons(application = {}) {
  if (!downloadApplicationButton || !archiveApplicationButton || !deleteApplicationButton) return;

  downloadApplicationButton.disabled = false;
  downloadApplicationButton.classList.remove('opacity-60');
  downloadApplicationButton.innerHTML = '<i data-feather="download" class="w-4 h-4"></i><span>Herunterladen</span>';

  const archiveIcon = application.archived ? 'rotate-ccw' : 'archive';
  const archiveLabel = application.archived ? 'Wiederherstellen' : 'Archivieren';
  archiveApplicationButton.disabled = false;
  archiveApplicationButton.classList.remove('opacity-60');
  archiveApplicationButton.dataset.archived = application.archived ? 'true' : 'false';
  archiveApplicationButton.innerHTML = `<i data-feather="${archiveIcon}" class="w-4 h-4"></i><span>${archiveLabel}</span>`;

  deleteApplicationButton.disabled = false;
  deleteApplicationButton.classList.remove('opacity-60');
  deleteApplicationButton.innerHTML = '<i data-feather="trash-2" class="w-4 h-4"></i><span>Löschen</span>';

  ensureFeather();
}

function renderModal(application) {
  currentApplication = application;
  const languageLabel = (application.formLanguage || 'de').toUpperCase();
  const germanLabel = application.germanLevel || 'Keine Angabe';

  modalMeta.innerHTML = `
    <span class="text-gray-600">${formatDate(application.createdAt)}</span>
    <span class="text-gray-400">• ${application.selectedJob || '—'}</span>
    <span class="text-gray-400">• Sprache: ${languageLabel}</span>
    <span class="text-gray-400">• Deutsch: ${germanLabel}</span>
    ${renderStatusBadge(application)}
  `;

  const archivedNotice = application.archived
    ? `<div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 flex items-center gap-2">
        <i data-feather="archive" class="w-4 h-4"></i>
        <span>Diese Bewerbung ist archiviert.</span>
      </div>`
    : '';

  modalContent.innerHTML = `
    ${archivedNotice}
    <section class="space-y-3">
      <h4 class="text-lg font-semibold text-gray-900">Stammdaten</h4>
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="text-gray-500">Name</p>
          <p class="font-medium text-gray-800">${application.vorname || ''} ${application.nachname || ''}</p>
        </div>
        <div>
          <p class="text-gray-500">E-Mail</p>
          <p class="font-medium text-gray-800"><a href="mailto:${application.email}" class="text-red-600 hover:text-red-700">${application.email}</a></p>
        </div>
        <div>
          <p class="text-gray-500">Telefon</p>
          <p class="font-medium text-gray-800"><a href="tel:${application.telefon}" class="text-red-600 hover:text-red-700">${application.telefon}</a></p>
        </div>
        <div>
          <p class="text-gray-500">Deutschniveau</p>
          <p class="font-medium text-gray-800">${application.germanLevel || 'Keine Angabe'}</p>
        </div>
      </div>
      <div class="text-sm text-gray-700">
        <p>${application.adresse || ''}</p>
        <p>${application.plz || ''} ${application.ort || ''}</p>
        <p>${application.land || ''}</p>
      </div>
    </section>

    <section class="space-y-3">
      <h4 class="text-lg font-semibold text-gray-900">Beruflicher Werdegang</h4>
      ${renderList(application.workExperience)}
    </section>

    <section class="space-y-3">
      <h4 class="text-lg font-semibold text-gray-900">Ausbildung &amp; Qualifikationen</h4>
      ${renderList(application.education)}
    </section>

    <section class="space-y-3">
      <h4 class="text-lg font-semibold text-gray-900">Dokumente</h4>
      ${renderAttachments(application.attachments)}
    </section>

    <section class="space-y-4" id="translationSection">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-semibold text-gray-900">Übersetzung</h4>
        <button class="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800" data-action="translate" data-id="${application.id}">
          <i data-feather="globe" class="w-4 h-4"></i>
          Auf Deutsch übersetzen
        </button>
      </div>
      <p class="text-sm text-gray-500">Automatische Übersetzung der Freitextfelder in die deutsche Sprache.</p>
      <div id="translationContent" class="space-y-3"></div>
    </section>
  `;
  updateActionButtons(application);
  ensureFeather();

  if (state.translations[application.id]) {
    renderTranslation(state.translations[application.id]);
  }
}

function showModal(application) {
  renderModal(application);
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
}

function hideModal() {
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
}

async function handleLogin(event) {
  event.preventDefault();
  loginError.classList.add('hidden');

  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Anmeldung fehlgeschlagen. Bitte prüfen Sie Ihre Zugangsdaten.');
    }

    const data = await response.json();
    state.token = data.token;
    localStorage.setItem('drk_admin_token', state.token);
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    fetchApplications();
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove('hidden');
  }
}

function handleLogout() {
  localStorage.removeItem('drk_admin_token');
  state.token = null;
  state.applications = [];
  state.filteredApplications = [];
  currentApplication = null;
  hideDashboardMessage();
  loginSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
  logoutButton.classList.add('hidden');
}

async function handleTranslate(applicationId, button) {
  if (!state.token) return;
  const translationSection = document.getElementById('translationContent');
  translationSection.innerHTML = '<p class="text-sm text-gray-500">Übersetzung wird vorbereitet ...</p>';
  button.disabled = true;
  button.classList.add('opacity-60');

  try {
    const response = await fetch(`${API_BASE}/api/applications/${applicationId}/translate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Übersetzung nicht möglich.');
    }

    const data = await response.json();
    state.translations[applicationId] = data;
    renderTranslation(data);
  } catch (error) {
    translationSection.innerHTML = `<p class="text-sm text-red-600">${error.message}</p>`;
  } finally {
    button.disabled = false;
    button.classList.remove('opacity-60');
    ensureFeather();
  }
}

function renderTranslation(data) {
  const translationSection = document.getElementById('translationContent');
  if (!data) {
    translationSection.innerHTML = '<p class="text-sm text-gray-500">Keine Übersetzungen verfügbar.</p>';
    return;
  }

  const workExperiences = (data.workExperience || [])
    .map((item, index) => {
      return `
        <div class="border border-gray-200 rounded-lg p-3">
          <p class="text-xs uppercase text-gray-400">Station ${index + 1}</p>
          <p class="text-sm text-gray-600 whitespace-pre-line">${item.beschreibungTranslated || item.beschreibung || 'Keine Beschreibung'}</p>
        </div>
      `;
    })
    .join('');

  translationSection.innerHTML = `
    ${workExperiences || '<p class="text-sm text-gray-500">Keine freitextlichen Angaben zum Übersetzen vorhanden.</p>'}
  `;
}

async function handleDownload(applicationId, button) {
  if (!state.token) return;
  const targetButton = button || downloadApplicationButton;
  if (targetButton) {
    targetButton.disabled = true;
    targetButton.classList.add('opacity-60');
  }

  try {
    const response = await fetch(`${API_BASE}/api/applications/${applicationId}/export`, {
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download nicht möglich.');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bewerbung-${applicationId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    showDashboardMessage('Bewerbung wurde heruntergeladen.', 'success');
  } catch (error) {
    showDashboardMessage(error.message || 'Download fehlgeschlagen.', 'error');
  } finally {
    if (targetButton) {
      targetButton.disabled = false;
      targetButton.classList.remove('opacity-60');
    }
    if (currentApplication) {
      updateActionButtons(currentApplication);
    }
  }
}

async function handleArchive(application) {
  if (!state.token || !application) return;
  const targetState = !application.archived;
  if (archiveApplicationButton) {
    archiveApplicationButton.disabled = true;
    archiveApplicationButton.classList.add('opacity-60');
  }

  try {
    const response = await fetch(`${API_BASE}/api/applications/${application.id}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${state.token}`
      },
      body: JSON.stringify({ archived: targetState })
    });

    if (!response.ok) {
      throw new Error('Aktion konnte nicht ausgeführt werden.');
    }

    const updatedFields = {
      ...application,
      archived: targetState,
      archivedAt: targetState ? new Date().toISOString() : null
    };

    currentApplication = updatedFields;
    updateApplicationInState(updatedFields);
    renderApplications();
    renderModal(updatedFields);
    showDashboardMessage(targetState ? 'Bewerbung archiviert.' : 'Bewerbung wiederhergestellt.', 'info');
  } catch (error) {
    showDashboardMessage(error.message || 'Aktion fehlgeschlagen.', 'error');
  } finally {
    if (archiveApplicationButton) {
      archiveApplicationButton.disabled = false;
      archiveApplicationButton.classList.remove('opacity-60');
    }
  }
}

async function handleDelete(application) {
  if (!state.token || !application) return;
  const confirmed = window.confirm('Möchten Sie diese Bewerbung dauerhaft löschen?');
  if (!confirmed) return;

  if (deleteApplicationButton) {
    deleteApplicationButton.disabled = true;
    deleteApplicationButton.classList.add('opacity-60');
  }

  try {
    const response = await fetch(`${API_BASE}/api/applications/${application.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${state.token}`
      }
    });

    if (!response.ok) {
      throw new Error('Löschen nicht möglich.');
    }

    removeApplicationFromState(application.id);
    renderApplications();
    hideModal();
    currentApplication = null;
    showDashboardMessage('Bewerbung wurde gelöscht.', 'success');
  } catch (error) {
    showDashboardMessage(error.message || 'Löschen fehlgeschlagen.', 'error');
  } finally {
    if (deleteApplicationButton) {
      deleteApplicationButton.disabled = false;
      deleteApplicationButton.classList.remove('opacity-60');
    }
  }
}

applicationTable.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="view-application"]');
  const downloadBtn = event.target.closest('[data-action="download-application"]');

  if (button) {
    const id = button.dataset.id;
    const application = state.applications.find((item) => item.id === id);
    if (application) {
      showModal(application);
    }
    return;
  }

  if (downloadBtn) {
    const id = downloadBtn.dataset.id;
    handleDownload(id, downloadBtn);
  }
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

closeModalButton.addEventListener('click', hideModal);

modalContent.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="translate"]');
  if (!button) return;
  const applicationId = button.dataset.id;
  handleTranslate(applicationId, button);
});

loginForm.addEventListener('submit', handleLogin);
logoutButton.addEventListener('click', handleLogout);
searchInput.addEventListener('input', renderApplications);
languageFilter.addEventListener('change', renderApplications);

if (downloadApplicationButton) {
  downloadApplicationButton.addEventListener('click', () => {
    if (currentApplication) {
      handleDownload(currentApplication.id, downloadApplicationButton);
    }
  });
}

if (archiveApplicationButton) {
  archiveApplicationButton.addEventListener('click', () => {
    if (currentApplication) {
      handleArchive(currentApplication);
    }
  });
}

if (deleteApplicationButton) {
  deleteApplicationButton.addEventListener('click', () => {
    if (currentApplication) {
      handleDelete(currentApplication);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ensureFeather();
  if (state.token) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    logoutButton.classList.remove('hidden');
    fetchApplications();
  }
});
