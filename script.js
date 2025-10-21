
let workExperienceCounter = 1;
let educationCounter = 1;

// Language selector functionality
document.addEventListener('DOMContentLoaded', function() {
    const languageLinks = document.querySelectorAll('.language-dropdown a');
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            // Here you would normally implement language change
            // For now we'll just update the button text
            const langText = this.textContent;
            document.querySelector('.language-btn').innerHTML = `
                <i data-feather="globe"></i>
                ${lang.toUpperCase()}
            `;
            feather.replace();
            
            // TODO: Implement actual language switching
            console.log('Switching to language:', lang);
        });
    });
});
function showApplicationForm(jobTitle) {
    document.getElementById('jobTitle').textContent = jobTitle;
    document.getElementById('selectedJob').value = jobTitle;
    document.getElementById('applicationModal').classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
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

document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Here you would normally send the form data to your server
    // For demonstration, we'll just show an alert
    alert('Vielen Dank für Ihre Bewerbung! Wir werden uns in Kürze bei Ihnen melden.');
    hideApplicationForm();
    
    // Reset form
    this.reset();
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
});