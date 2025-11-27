let employees = [];
let nextEmployeeId = 1;
let currentRoomForAssignment = null;

const REGEX = {
    fullname: /^[a-zA-Za-ÿ\s'-]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(?:(?:\+|00)212|0)[5-7][\s.-]*\d{2}[\s.-]*\d{2}[\s.-]*\d{2}[\s.-]*\d{2}$/,
    photoUrl: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|avif))$/i
};

const ERROR_MESSAGES = {
    fullname: "Le nom doit contenir entre 2 et 50 caracteres",
    email: "Veuillez entrer une adresse email valide",
    phone: "Veuillez entrer un numero de telephone valide (ex: +212 23 45 67 89 ou 06 23 45 67 89)",
    photoUrl: "Veuillez entrer une URL d'image valide (png, jpg, jpeg, gif, webp)",
    role: "Veuillez selectionner un rôle",
    required: "Ce champ est obligatoire"
};

let addEmployeeBtn = document.getElementById('add-worker-btn');
let addEmployeeModal = document.getElementById('addEmployeeModal');
let employeeInfoModal = document.getElementById('employeeInfoModal');
let employeeSelectionModal = document.getElementById('employeeSelectionModal');
let closeModal = document.getElementById('closeModal');
let closeInfoModal = document.getElementById('closeInfoModal');
let closeSelectionModal = document.getElementById('closeSelectionModal');
let cancelBtn = document.getElementById('cancelBtn');
let closeInfoBtn = document.getElementById('closeInfoBtn');
let cancelSelectionBtn = document.getElementById('cancelSelectionBtn');
let addWorkerBtn = document.getElementById('addWorkerBtn');
let addExperienceBtn = document.getElementById('addExperienceBtn');
let experienceContainer = document.getElementById('experienceContainer');
let workerList = document.getElementById('worker-list');
let unassignedCounter = document.getElementById('unassigned-counter');

const fullnameInput = document.getElementById('fullname');
const roleInput = document.getElementById('role');
const photoUrlInput = document.getElementById('photoUrl');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const photoPreview = document.getElementById('photoPreview');

function isEmployeeEligibleForRoom(employee, roomId) {
    const employeeRole = employee.role;

    if (employeeRole === 'Manager') {
        return true;
    }

    switch (roomId) {
        case 'reception':
            return employeeRole === 'Receptionist';

        case 'server':
            return employeeRole === 'Technician';

        case 'security':
            return employeeRole === 'Security';

        case 'archives':
            if (employeeRole === 'Cleaning') {
                return false;
            }
            return true;

        case 'conference':
        case 'staff':
            return true;

        default:
            return true;
    }
}

function getRestrictionMessage(employeeRole, roomId) {
    switch (roomId) {
        case 'reception':
            if (employeeRole !== 'Receptionist') {
                return 'Seuls les Receptionnistes peuvent etre assignes a la Reception';
            }
            break;

        case 'server':
            if (employeeRole !== 'Technician') {
                return 'Seuls les Techniciens IT peuvent etre assignes a la Salle des Serveurs';
            }
            break;

        case 'security':
            if (employeeRole !== 'Security') {
                return 'Seuls les Agents de securite peuvent etre assignes a la Salle de Securite';
            }
            break;

        case 'archives':
            if (employeeRole === 'Cleaning') {
                return 'Le personnel de Nettoyage ne peut pas etre assigne a la Salle des Archives';
            }
            break;
    }
    return '';
}

function validateFullname() {
    const value = fullnameInput.value.trim();
    const errorElement = document.getElementById('fullname-error');

    if (!value) {
        showError(fullnameInput, errorElement, ERROR_MESSAGES.required);
        return false;
    }

    if (!REGEX.fullname.test(value)) {
        showError(fullnameInput, errorElement, ERROR_MESSAGES.fullname);
        return false;
    }

    clearError(fullnameInput, errorElement);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    const errorElement = document.getElementById('email-error');

    if (!value) {
        showError(emailInput, errorElement, ERROR_MESSAGES.required);
        return false;
    }

    if (!REGEX.email.test(value)) {
        showError(emailInput, errorElement, ERROR_MESSAGES.email);
        return false;
    }

    clearError(emailInput, errorElement);
    return true;
}

function validatePhone() {
    const value = phoneInput.value.trim();
    const errorElement = document.getElementById('phone-error');

    if (!value) {
        showError(phoneInput, errorElement, ERROR_MESSAGES.required);
        return false;
    }

    const cleanPhone = value.replace(/\s/g, '');
    if (!REGEX.phone.test(cleanPhone)) {
        showError(phoneInput, errorElement, ERROR_MESSAGES.phone);
        return false;
    }

    clearError(phoneInput, errorElement);
    return true;
}

function validateRole() {
    const value = roleInput.value;
    const errorElement = document.getElementById('role-error');

    if (!value) {
        showError(roleInput, errorElement, ERROR_MESSAGES.role);
        return false;
    }

    clearError(roleInput, errorElement);
    return true;
}

function validatePhotoUrl() {
    const value = photoUrlInput.value.trim();
    const errorElement = document.getElementById('photoUrl-error');

    if (!value) {
        clearError(photoUrlInput, errorElement);
        return true;
    }

    if (!REGEX.photoUrl.test(value)) {
        showError(photoUrlInput, errorElement, ERROR_MESSAGES.photoUrl);
        return false;
    }

    clearError(photoUrlInput, errorElement);
    return true;
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    errorElement.textContent = message;
}

function clearError(input, errorElement) {
    input.classList.remove('error');
    errorElement.textContent = '';
}


function validateForm() {
    const validations = [
        validateFullname(),
        validateEmail(),
        validatePhone(),
        validateRole(),
        validatePhotoUrl()
    ];

    return validations.every(validation => validation === true);
}

function openmodal() {
    addEmployeeModal.style.display = 'flex';
    clearForm();
}

function closeEmployeeModal() {
    addEmployeeModal.style.display = 'none';
}

function closeEmployeeInfoModal() {
    employeeInfoModal.style.display = 'none';
}

function closeEmployeeSelectionModal() {
    employeeSelectionModal.style.display = 'none';
}

function addEmployee() {
    if (!validateForm()) {
        alert('Veuillez corriger les erreurs dans le formulaire avant de continuer.');
        return;
    }

    let fullname = fullnameInput.value.trim();
    let role = roleInput.value;
    let email = emailInput.value.trim();
    let phone = phoneInput.value.trim();
    let photoUrl = photoUrlInput.value.trim();

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

    const newEmployee = {
        id: nextEmployeeId++,
        fullname: fullname,
        role: role,
        email: email,
        phone: phone,
        photoUrl: photoUrl || 'https://via.placeholder.com/150?text=Photo',
        experiences: experiences,
        assignedRoom: null
    };

    employees.push(newEmployee);

    changeUnassignedlist();
    changeUnassignedcontor();
    updateAllRooms();
    closeEmployeeModal();
}

function openEmployeeInfoModal(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    document.getElementById('info-avatar').src = employee.photoUrl;
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

    const unassignedEmployees = employees.filter(emp => !emp.assignedRoom);

    if (unassignedEmployees.length === 0) {
        workerList.innerHTML = '<p class="empty-room">Aucun employe non assigne</p>';
        return;
    }

    unassignedEmployees.forEach(employee => {
        const workerCard = document.createElement('div');
        workerCard.className = 'worker-card';
        workerCard.setAttribute('data-id', employee.id);

        workerCard.innerHTML = `
                    <div class="worker-info">
                        <img src="${employee.photoUrl}" alt="${employee.fullname}" class="worker-avatar">
                        <div class="worker-details">
                            <h3 class="worker-name">${employee.fullname}</h3>
                            <p class="worker-role">${employee.role}</p>
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

        workerCard.setAttribute("draggable", "true");
    workerCard.addEventListener("dragstart", handleDragStart);
        workerList.appendChild(workerCard);
    });


}

function changeUnassignedcontor() {
    const unassignedCount = employees.filter(emp => !emp.assignedRoom).length;
    unassignedCounter.textContent = unassignedCount;
}

function deleteEmployee(employeeId) {
    if (confirm('etes-vous sur de vouloir supprimer cet employe ?')) {
        employees = employees.filter(emp => emp.id !== employeeId);
        changeUnassignedlist();
        changeUnassignedcontor();
        updateAllRooms();
    }
}

function updateAllRooms() {
    const roomCards = document.querySelectorAll('.room-card');
    roomCards.forEach(roomCard => {
        updateRoomDisplay(roomCard);
    });
}

function updateRoomDisplay(roomCard) {
    const roomId = roomCard.getAttribute('data-room-id');
    const capacity = parseInt(roomCard.getAttribute('data-capacity'));
    const isRequired = roomCard.getAttribute('data-required') === 'true';
    const workersList = roomCard.querySelector('.room-workers-list');
    const counterElement = roomCard.querySelector('.room-counter');
    const addButton = roomCard.querySelector('.add-to-room-btn');

    const employeesInRoom = employees.filter(emp => emp.assignedRoom === roomId);
    const currentCount = employeesInRoom.length;

    counterElement.textContent = `${currentCount} / ${capacity}`;

    workersList.innerHTML = '';

    if (currentCount === 0) {
        workersList.innerHTML = '<div class="empty-room">Aucun employe assigne</div>';

        if (isRequired) {
            roomCard.classList.remove('white');
            roomCard.classList.add('red');
        }
    } else {
        employeesInRoom.forEach(employee => {
            const workerCard = document.createElement('div');
            workerCard.className = 'worker-card';
            workerCard.setAttribute('data-id', employee.id);

            workerCard.innerHTML = `
                        <div class="worker-info">
                            <img src="${employee.photoUrl}" alt="${employee.fullname}" class="worker-avatar">
                            <div class="worker-details">
                                <h3 class="worker-name">${employee.fullname}</h3>
                                <p class="worker-role">${employee.role}</p>
                            </div>
                        </div>
                        <button class="delete-btn" onclick="removeFromRoom(${employee.id})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    `;

            workerCard.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    openEmployeeInfoModal(employee.id);
                }
            });

            workerCard.setAttribute("draggable", "true");
        workerCard.addEventListener("dragstart", handleDragStart);
            workersList.appendChild(workerCard);
        });

        roomCard.classList.remove('red');
        roomCard.classList.add('white');
    }

    addButton.disabled = currentCount >= capacity;

}

function removeFromRoom(employeeId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        employee.assignedRoom = null;
        changeUnassignedlist();
        changeUnassignedcontor();
        updateAllRooms();
    }
}

function openEmployeeSelectionModal(roomElement) {
    currentRoomForAssignment = roomElement;
    const roomId = roomElement.getAttribute('data-room-id');
    const capacity = parseInt(roomElement.getAttribute('data-capacity'));

    document.getElementById('selectionModalTitle').textContent =
        `Assigner a ${roomElement.querySelector('.room-title').textContent}`;
    document.getElementById('selectionModalDescription').textContent =
        `Selectionnez un employe a assigner a cette salle :`;

    const selectionList = document.getElementById('employeeSelectionList');
    selectionList.innerHTML = '';

    const unassignedEmployees = employees.filter(emp => !emp.assignedRoom);

    if (unassignedEmployees.length === 0) {
        selectionList.innerHTML = '<p class="empty-room">Aucun employe disponible</p>';
    } else {
        unassignedEmployees.forEach(emp => {
            const isEligible = isEmployeeEligibleForRoom(emp, roomId);
            const restrictionMessage = getRestrictionMessage(emp.role, roomId);

            const employeeItem = document.createElement('div');
            employeeItem.className = `selection-worker-card ${!isEligible ? 'disabled' : ''}`;
            employeeItem.innerHTML = `
                        <div class="worker-info">
                            <img src="${emp.photoUrl}" alt="${emp.fullname}" class="worker-avatar">
                            <div class="worker-details">
                                <h3 class="worker-name">${emp.fullname}</h3>
                                <p class="worker-role">${emp.role}</p>
                                ${!isEligible ? `<div class="role-restriction-message">${restrictionMessage}</div>` : ''}
                            </div>
                        </div>
                    `;

            if (isEligible) {
                employeeItem.addEventListener('click', () => {
                    assignToRoom(emp.id, roomId);
                });
            }

            selectionList.appendChild(employeeItem);
        });
    }

    employeeSelectionModal.style.display = 'flex';
}

function assignToRoom(employeeId, roomId) {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
        if (!isEmployeeEligibleForRoom(employee, roomId)) {
            const restrictionMessage = getRestrictionMessage(employee.role, roomId);
            alert(`Impossible d'assigner cet employe : ${restrictionMessage}`);
            return;
        }

        employee.assignedRoom = roomId;
        changeUnassignedlist();
        changeUnassignedcontor();
        updateAllRooms();
        closeEmployeeSelectionModal();
    }
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
    let startDateText = startDate ? new Date(startDate).toLocaleDateString() : 'Non specifiee';
    let endDateText = endDate ? new Date(endDate).toLocaleDateString() : 'Non specifiee';
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

function clearForm() {
    fullnameInput.value = '';
    roleInput.value = '';
    photoUrlInput.value = '';
    emailInput.value = '';
    phoneInput.value = '';
    experienceContainer.innerHTML = '';

    clearError(fullnameInput, document.getElementById('fullname-error'));
    clearError(roleInput, document.getElementById('role-error'));
    clearError(photoUrlInput, document.getElementById('photoUrl-error'));
    clearError(emailInput, document.getElementById('email-error'));
    clearError(phoneInput, document.getElementById('phone-error'));
}

function setupOutsideClick() {
    window.addEventListener('click', function (event) {
        if (event.target === addEmployeeModal) {
            closeEmployeeModal();
        }
        if (event.target === employeeInfoModal) {
            closeEmployeeInfoModal();
        }
        if (event.target === employeeSelectionModal) {
            closeEmployeeSelectionModal();
        }
    });
}

function initialdom() {
    addEmployeeBtn.addEventListener('click', openmodal);
    closeModal.addEventListener('click', closeEmployeeModal);
    cancelBtn.addEventListener('click', closeEmployeeModal);

    closeInfoModal.addEventListener('click', closeEmployeeInfoModal);
    closeInfoBtn.addEventListener('click', closeEmployeeInfoModal);

    closeSelectionModal.addEventListener('click', closeEmployeeSelectionModal);
    cancelSelectionBtn.addEventListener('click', closeEmployeeSelectionModal);

    addWorkerBtn.addEventListener('click', addEmployee);
    addExperienceBtn.addEventListener('click', addExperience);

    fullnameInput.addEventListener('blur', validateFullname);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    roleInput.addEventListener('change', validateRole);
    photoUrlInput.addEventListener('input', function () {
        validatePhotoUrl();
    });
    const addToRoomButtons = document.querySelectorAll('.add-to-room-btn');
    addToRoomButtons.forEach(button => {
        button.addEventListener('click', function () {
            const roomCard = this.closest('.room-card'); // ila derna event west fonction yemkn n3awdo this b event.target
            openEmployeeSelectionModal(roomCard);
        });
    });

    changeUnassignedcontor();
    const roomCards = document.querySelectorAll('.room-card');
roomCards.forEach(room => {
    room.addEventListener("dragover", handleDragOver);
    room.addEventListener("drop", handleDrop);
});

    setupOutsideClick();
}

// === DRAG & DROP SYSTEM ===

function handleDragStart(e) {
    const employeeId = e.target.getAttribute("data-id");
    e.dataTransfer.setData("employeeId", employeeId);
    e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
    e.preventDefault();
    const employeeId = parseInt(e.dataTransfer.getData("employeeId"));
    const roomCard = e.currentTarget;
    const roomId = roomCard.getAttribute("data-room-id");

    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) return;

    if (!isEmployeeEligibleForRoom(employee, roomId)) {
        alert(getRestrictionMessage(employee.role, roomId));
        return;
    }

    const capacity = parseInt(roomCard.getAttribute("data-capacity"));
    const employeesInRoom = employees.filter(emp => emp.assignedRoom === roomId);

    if (employeesInRoom.length >= capacity) {
        alert("Cette salle a atteint sa capacité maximale !");
        return;
    }
    employee.assignedRoom = roomId;
    changeUnassignedlist();
    changeUnassignedcontor();
    updateAllRooms();
}



document.addEventListener('DOMContentLoaded', initialdom);
