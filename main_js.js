let addEmployeeBtn = document.getElementById('add-worker-btn');
let addEmployeeModal = document.getElementById('addEmployeeModal');
let closeModal = document.getElementById('closeModal');
let cancelBtn = document.getElementById('cancelBtn');
let addWorkerBtn = document.getElementById('addWorkerBtn');
let addExperienceBtn = document.getElementById('addExperienceBtn');
let experienceContainer = document.getElementById('experienceContainer');


function openmodal() {
    addEmployeeModal.style.display = 'flex';
}

function closeEmployeeModal() {
    addEmployeeModal.style.display = 'none';
}

function addEmployee() {
    let fullname = document.getElementById('fullname').value;
    let role = document.getElementById('role').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;

}

function validateDates(startDate, endDate) {
    if (startDate && endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);

        if (start > end) {
            alert('Error: respect date de debut avant le date de fin');
            return false;
        }
    }
    return true;
}

function createExperienceElement(company, position, startDate, endDate) {
    let startDateText = startDate ? new Date(startDate).toLocaleDateString() : 'Not specified';
    let endDateText = endDate ? new Date(endDate).toLocaleDateString() : 'Not specified';
    let dateRange = startDateText + ' - ' + endDateText;

    let newExperience = document.createElement('div');
    newExperience.className = 'experience-item';
    newExperience.innerHTML = `
            <div class="experience-header">
                <div class="experience-title">${position}</div>
                <button class="remove-experience">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="experience-company">${company}</div>
            <div class="experience-dates">${dateRange}</div>
        `;

    return newExperience;
}

function addExperience() {
    let company = document.getElementById('company').value;
    let position = document.getElementById('position').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    if (!company || !position) {
        alert('ajouter company et positon');
        return;
    }

    if (!validateDates(startDate, endDate)) {
        return;
    }

    let newExperience = createExperienceElement(company, position, startDate, endDate);
    experienceContainer.appendChild(newExperience);

    addRemoveEvent(newExperience);

    clearExperienceForm();
}

function addRemoveEvent(experienceElement) {
    let removeBtn = experienceElement.querySelector('.remove-experience');
    removeBtn.addEventListener('click', function () {
        if (experienceContainer.children.length > 0) {
            experienceContainer.removeChild(experienceElement);
        }
    });
}

function clearExperienceForm() {
    document.getElementById('company').value = '';
    document.getElementById('position').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}


function setupOutsideClick() {
    window.addEventListener('click', function (event) {
        if (event.target === addEmployeeModal) {
            closeEmployeeModal();
        }
    });
}

function initialdom() {
    addEmployeeBtn.addEventListener('click', openmodal);
    closeModal.addEventListener('click', closeEmployeeModal);
    cancelBtn.addEventListener('click', closeEmployeeModal);

    addWorkerBtn.addEventListener('click', addEmployee);
    addExperienceBtn.addEventListener('click', addExperience);

    initializeRemoveEvents();
    setupOutsideClick();
}

document.addEventListener('DOMContentLoaded', initialdom);