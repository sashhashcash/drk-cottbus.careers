
let workExperienceCounter = 1;
let educationCounter = 1;

const languageCode = (document.documentElement.lang || 'de').substring(0, 2).toLowerCase();
const messageMap = {
    de: {
        success: 'Vielen Dank für Ihre Bewerbung! Wir melden uns zeitnah bei Ihnen.',
        error: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.',
        submitting: 'Wird gesendet…'
    },
    en: {
        success: 'Thank you for your application! We will get back to you shortly.',
        error: 'Something went wrong. Please try again or contact us directly.',
        submitting: 'Submitting…'
    },
    es: {
        success: '¡Gracias por su solicitud! Nos pondremos en contacto con usted en breve.',
        error: 'Se ha producido un error. Vuelva a intentarlo o contáctenos directamente.',
        submitting: 'Enviando…'
    },
    it: {
        success: 'Grazie per la tua candidatura! Ti ricontatteremo a breve.',
        error: "Si è verificato un errore. Riprova o contattaci direttamente.",
        submitting: 'Invio in corso…'
    },
    pt: {
        success: 'Obrigado pela sua candidatura! Entraremos em contacto em breve.',
        error: 'Ocorreu um erro. Tente novamente ou contacte-nos diretamente.',
        submitting: 'A enviar…'
    },
    pl: {
        success: 'Dziękujemy za aplikację! Skontaktujemy się z Tobą wkrótce.',
        error: 'Wystąpił błąd. Spróbuj ponownie lub skontaktuj się z nami bezpośrednio.',
        submitting: 'Wysyłanie…'
    },
    cs: {
        success: 'Děkujeme za Vaši přihlášku! Brzy se Vám ozveme.',
        error: 'Došlo k chybě. Zkuste to prosím znovu nebo nás kontaktujte přímo.',
        submitting: 'Odesílá se…'
    },
    ru: {
        success: 'Спасибо за Вашу заявку! Мы свяжемся с вами в ближайшее время.',
        error: 'Произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую.',
        submitting: 'Отправка…'
    },
    uk: {
        success: 'Дякуємо за вашу заявку! Ми незабаром з вами зв’яжемося.',
        error: 'Сталася помилка. Спробуйте ще раз або зв’яжіться з нами безпосередньо.',
        submitting: 'Надсилання…'
    }
};

const messages = messageMap[languageCode] || messageMap.de;

function createStatusBanner() {
    const status = document.createElement('div');
    status.id = 'formStatus';
    status.className = 'hidden px-4 py-3 rounded-lg text-sm border';
    document.getElementById('applicationForm').prepend(status);
    return status;
}

const statusBanner = createStatusBanner();

function setStatus(type, text) {
    if (!statusBanner) return;
    statusBanner.textContent = text;
    statusBanner.className = `px-4 py-3 rounded-lg text-sm border mt-2 ${
        type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
    }`;
    statusBanner.classList.remove('hidden');
}

function clearStatus() {
    if (!statusBanner) return;
    statusBanner.classList.add('hidden');
    statusBanner.textContent = '';
}

function getFormLanguage() {
    const lang = document.documentElement.lang || 'de';
    return lang.substring(0, 2).toLowerCase();
}

function setFormLanguage() {
    const formLanguageInput = document.getElementById('formLanguage');
    if (formLanguageInput) {
        formLanguageInput.value = getFormLanguage();
    }
}

function showApplicationForm(jobTitle) {
    document.getElementById('jobTitle').textContent = jobTitle;
    document.getElementById('selectedJob').value = jobTitle;
    setFormLanguage();
    document.getElementById('applicationModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    clearStatus();
}

function hideApplicationForm() {
    document.getElementById('applicationModal').classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

function addWorkExperience() {
    workExperienceCounter++;
    const container = document.getElementById('workExperienceContainer');
    const newExperience = document.createElement('div');
    newExperience.className = 'work-experience mb-4 p-4 border rounded-lg';
    newExperience.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6 mb-4">
            <div>
                <label for="arbeitgeber${workExperienceCounter}" class="block text-sm font-medium text-gray-700 mb-1">Arbeitgeber</label>
                <input type="text" id="arbeitgeber${workExperienceCounter}" name="arbeitgeber[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
            </div>
            <div>
                <label for="position${workExperienceCounter}" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input type="text" id="position${workExperienceCounter}" name="position[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
            </div>
        </div>
        <div class="grid md:grid-cols-2 gap-6 mb-4">
            <div>
                <label for="beschreibung${workExperienceCounter}" class="block text-sm font-medium text-gray-700 mb-1">Tätigkeitsbeschreibung</label>
                <textarea id="beschreibung${workExperienceCounter}" name="beschreibung[]" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="startdatum${workExperienceCounter}" class="block text-sm font-medium text-gray-700 mb-1">Von</label>
                    <input type="date" id="startdatum${workExperienceCounter}" name="startdatum[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label for="enddatum${workExperienceCounter}" class="block text-sm font-medium text-gray-700 mb-1">Bis</label>
                    <input type="date" id="enddatum${workExperienceCounter}" name="enddatum[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
            </div>
        </div>
        <button type="button" onclick="removeElement(this.parentNode)" class="text-red-600 hover:text-red-800 text-sm flex items-center">
            <i data-feather="trash-2" class="mr-1 w-4 h-4"></i> Eintrag entfernen
        </button>
    `;
    container.appendChild(newExperience);
    feather.replace();
}

function addEducation() {
    educationCounter++;
    const container = document.getElementById('educationContainer');
    const newEducation = document.createElement('div');
    newEducation.className = 'education mb-4 p-4 border rounded-lg';
    newEducation.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6 mb-4">
            <div>
                <label for="bildungseinrichtung${educationCounter}" class="block text-sm font-medium text-gray-700 mb-1">Bildungseinrichtung</label>
                <input type="text" id="bildungseinrichtung${educationCounter}" name="bildungseinrichtung[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
            </div>
            <div>
                <label for="abschluss${educationCounter}" class="block text-sm font-medium text-gray-700 mb-1">Abschluss</label>
                <input type="text" id="abschluss${educationCounter}" name="abschluss[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
            </div>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
            <div>
                <label for="fachrichtung${educationCounter}" class="block text-sm font-medium text-gray-700 mb-1">Fachrichtung</label>
                <input type="text" id="fachrichtung${educationCounter}" name="fachrichtung[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="bildungsstart${educationCounter}" class="block text-sm font-medium text-gray-700 mb-1">Von</label>
                    <input type="date" id="bildungsstart${educationCounter}" name="bildungsstart[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label for="bildungsende${educationCounter}" class="block text-sm font-medium text-gray-700 mb-1">Bis</label>
                    <input type="date" id="bildungsende${educationCounter}" name="bildungsende[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
            </div>
        </div>
        <button type="button" onclick="removeElement(this.parentNode)" class="text-red-600 hover:text-red-800 text-sm flex items-center">
            <i data-feather="trash-2" class="mr-1 w-4 h-4"></i> Eintrag entfernen
        </button>
    `;
    container.appendChild(newEducation);
    feather.replace();
}

function removeElement(element) {
    element.remove();
}

function resetDynamicSections() {
    document.getElementById('workExperienceContainer').innerHTML = `
        <div class="work-experience mb-4 p-4 border rounded-lg">
            <div class="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label for="arbeitgeber1" class="block text-sm font-medium text-gray-700 mb-1">Arbeitgeber</label>
                    <input type="text" id="arbeitgeber1" name="arbeitgeber[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label for="position1" class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input type="text" id="position1" name="position[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label for="beschreibung1" class="block text-sm font-medium text-gray-700 mb-1">Tätigkeitsbeschreibung</label>
                    <textarea id="beschreibung1" name="beschreibung[]" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="startdatum1" class="block text-sm font-medium text-gray-700 mb-1">Von</label>
                        <input type="date" id="startdatum1" name="startdatum[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div>
                        <label for="enddatum1" class="block text-sm font-medium text-gray-700 mb-1">Bis</label>
                        <input type="date" id="enddatum1" name="enddatum[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('educationContainer').innerHTML = `
        <div class="education mb-4 p-4 border rounded-lg">
            <div class="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label for="bildungseinrichtung1" class="block text-sm font-medium text-gray-700 mb-1">Bildungseinrichtung</label>
                    <input type="text" id="bildungseinrichtung1" name="bildungseinrichtung[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label for="abschluss1" class="block text-sm font-medium text-gray-700 mb-1">Abschluss</label>
                    <input type="text" id="abschluss1" name="abschluss[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <label for="fachrichtung1" class="block text-sm font-medium text-gray-700 mb-1">Fachrichtung</label>
                    <input type="text" id="fachrichtung1" name="fachrichtung[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="bildungsstart1" class="block text-sm font-medium text-gray-700 mb-1">Von</label>
                        <input type="date" id="bildungsstart1" name="bildungsstart[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div>
                        <label for="bildungsende1" class="block text-sm font-medium text-gray-700 mb-1">Bis</label>
                        <input type="date" id="bildungsende1" name="bildungsende[]" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500">
                    </div>
                </div>
            </div>
        </div>
    `;

    workExperienceCounter = 1;
    educationCounter = 1;
    feather.replace();
}

async function submitApplication(event) {
    event.preventDefault();
    clearStatus();

    const form = event.target;
    const formData = new FormData(form);
    formData.set('formLanguage', getFormLanguage());

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonHTML = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>${messages.submitting}</span>`;

    try {
        const response = await fetch('/api/applications', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Request failed');
        }

        setStatus('success', messages.success);
        form.reset();
        resetDynamicSections();
        setFormLanguage();
        setTimeout(() => {
            hideApplicationForm();
            clearStatus();
        }, 1800);
    } catch (error) {
        console.error(error);
        setStatus('error', messages.error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setFormLanguage();
    document.getElementById('applicationForm').addEventListener('submit', submitApplication);
});