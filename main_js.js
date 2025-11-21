let employees = [];
let nextEmployeeId = 1;

let addEmployeeBtn = document.getElementById('add-worker-btn');
let addEmployeeModal = document.getElementById('addEmployeeModal');
let employeeInfoModal = document.getElementById('employeeInfoModal');
let closeModal = document.getElementById('closeModal');
let closeInfoModal = document.getElementById('closeInfoModal');
let cancelBtn = document.getElementById('cancelBtn');
let closeInfoBtn = document.getElementById('closeInfoBtn');
let addWorkerBtn = document.getElementById('addWorkerBtn');
let addExperienceBtn = document.getElementById('addExperienceBtn');
let experienceContainer = document.getElementById('experienceContainer');
let workerList = document.getElementById('worker-list');
let unassignedCounter = document.getElementById('unassigned-counter');


function openmodal() {
    addEmployeeModal.style.display = 'flex';
}

function closeEmployeeModal() {
    addEmployeeModal.style.display = 'none';
}

function closeEmployeeInfoModal() {
    employeeInfoModal.style.display = 'none';
}

function addEmployee() {
    let fullname = document.getElementById('fullname').value;
    let role = document.getElementById('role').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    let photoUrl = document.getElementById('photoUrl').value;

    if (fullname && role && email && phone) {

        const experiences = [];
        const experienceItems = experienceContainer.querySelectorAll('.experience-item');
        experienceItems.forEach(item => {
            const position = item.querySelector('.experience-title').textContent;
            const company = item.querySelector('.experience-company').textContent;
            const dates = item.querySelector('.experience-dates').textContent.split(' - ');

            experiences.push({
                company: company,
                position: position,
                startDate: dates[0],
                endDate: dates[1]
            });
        });

        // Creer un nouvel employe
        const newEmployee = {
            id: nextEmployeeId++,
            fullname: fullname,
            role: role,
            email: email,
            phone: phone,
            photoUrl: photoUrl || 'https://via.placeholder.com/48',
            experiences: experiences
        };

        employees.push(newEmployee);

        changeUnassignedlist();
        changeUnassignedcontor();

        // vider la formulaire
        document.getElementById('fullname').value = '';
        document.getElementById('role').value = 'Receptionist';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('photoUrl').value = '';
        experienceContainer.innerHTML = '';

        // Fermer la modal
        closeEmployeeModal();
    } else {
        alert('Veuillez remplir tous les champs obligatoires');
    }
}

function openEmployeeInfoModal(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    document.getElementById('info-avatar').src = employee.photoUrl || 'https://via.placeholder.com/100';
    document.getElementById('info-name').textContent = employee.fullname;
    document.getElementById('info-role').textContent = employee.role;
    document.getElementById('info-email').textContent = employee.email;
    document.getElementById('info-phone').textContent = employee.phone;

    const experienceList = document.getElementById('info-experience');
    experienceList.innerHTML = '';

    if (employee.experiences && employee.experiences.length > 0) {
        employee.experiences.forEach(exp => {
            const experienceItem = document.createElement('div');
            experienceItem.className = 'experience-item';
            experienceItem.innerHTML = `
                        <div class="experience-header">
                            <div class="experience-title">${exp.position}</div>
                        </div>
                        <div class="experience-company">${exp.company}</div>
                        <div class="experience-dates">${exp.startDate} - ${exp.endDate}</div>
                    `;
            experienceList.appendChild(experienceItem);
        });
    } else {
        experienceList.innerHTML = '<p>Aucune experience enregistree</p>';
    }

    employeeInfoModal.style.display = 'flex';
}


function changeUnassignedlist() {
    workerList.innerHTML = '';

    employees.forEach(employee => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';
        workerCard.setAttribute('data-id', employee.id);

        workerCard.innerHTML = `
                    <div id="worker-info">
                        <img src="${employee.photoUrl}" alt="${employee.fullname}" id="worker-avatar">
                        <div id="worker-details">
                            <h3 id="worker-name">${employee.fullname}</h3>
                            <p id="worker-role">${employee.role}</p>
                        </div>
                    </div>
                    <button class="delete-btn" onclick="deleteEmployee(${employee.id})">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;

        workerCard.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                openEmployeeInfoModal(employee.id);
            }
        });

        workerList.appendChild(workerCard);
    });
}

function changeUnassignedcontor() {
    unassignedCounter.textContent = employees.length;
}

function deleteEmployee(employeeId) {
    employees = employees.filter(emp => emp.id !== employeeId);
    changeUnassignedlist();
    changeUnassignedcontor();
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

    closeInfoModal.addEventListener('click', closeEmployeeInfoModal);
    closeInfoBtn.addEventListener('click', closeEmployeeInfoModal);

    addWorkerBtn.addEventListener('click', addEmployee);
    addExperienceBtn.addEventListener('click', addExperience);

    changeUnassignedcontor();
    setupOutsideClick();
}

document.addEventListener('DOMContentLoaded', initialdom);