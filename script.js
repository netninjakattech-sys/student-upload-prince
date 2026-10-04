const students = [];

const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const namePanel = document.getElementById('namePanel');
const nameList = document.getElementById('nameList');
const studentCount = document.getElementById('studentCount');
const statusMessage = document.getElementById('statusMessage');
const removeLastButton = document.getElementById('removeLast');
const addSamplesButton = document.getElementById('addSamples');
const toggleNamesButton = document.getElementById('toggleNames');

const nameInput = document.getElementById('name');
const matricInput = document.getElementById('matric');
const levelInput = document.getElementById('level');
const departmentInput = document.getElementById('department');

const nameError = document.getElementById('nameError');
const matricError = document.getElementById('matricError');
const levelError = document.getElementById('levelError');
const departmentError = document.getElementById('departmentError');

// Validate the form fields and return any inline errors.
function validate(student) {
  const errors = {};

  if (!student.name || student.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!student.matric) {
    errors.matric = 'Matric number is required.';
  } else if (!/^\d{2}\/\d{9}$/.test(student.matric)) {
    errors.matric = 'Use the format 23/024145123.';
  } else if (matricExists(student.matric)) {
    errors.matric = 'This matric number already exists.';
  }

  if (!student.level) {
    errors.level = 'Please choose a level.';
  }

  if (!student.department || student.department.trim().length < 2) {
    errors.department = 'Department must be at least 2 characters.';
  }

  return errors;
}

// Check whether a matric number is already registered.
function matricExists(matricNumber) {
  for (let i = 0; i < students.length; i += 1) {
    if (students[i].matric === matricNumber) {
      return true;
    }
  }

  return false;
}

// Add a student to the array after validation passes.
function addStudent(student) {
  students.push(student);
  render();
  statusMessage.textContent = `Added ${student.name} (${student.matric}).`;
}

// Remove the most recently added item from the array.
function removeLast() {
  if (students.length === 0) {
    statusMessage.textContent = 'There are no students to remove.';
    return;
  }

  const removedStudent = students.pop();
  render();
  statusMessage.textContent = `Removed ${removedStudent.name} (${removedStudent.matric}).`;
}

// Render the ledger rows and any empty states.
function render() {
  studentCount.textContent = String(students.length);
  removeLastButton.disabled = students.length === 0;

  studentList.innerHTML = '';

  if (students.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';

    const text = document.createElement('p');
    text.textContent = 'No students added yet. Start with a new entry or add the sample students.';

    const sampleButton = document.createElement('button');
    sampleButton.type = 'button';
    sampleButton.className = 'primary-button';
    sampleButton.textContent = 'Add 3 sample students';
    sampleButton.addEventListener('click', addSampleStudents);

    emptyState.appendChild(text);
    emptyState.appendChild(sampleButton);
    studentList.appendChild(emptyState);
  } else {
    for (let i = 0; i < students.length; i += 1) {
      const student = students[i];
      const row = document.createElement('div');
      row.className = 'student-row';

      if (i === students.length - 1) {
        row.classList.add('last-added');
      }

      const number = document.createElement('div');
      number.className = 'row-number';
      number.textContent = String(i + 1);

      const details = document.createElement('div');
      details.className = 'student-details';

      const studentName = document.createElement('p');
      studentName.className = 'student-name';
      studentName.textContent = student.name;

      const department = document.createElement('p');
      department.className = 'student-department';
      department.textContent = student.department;

      details.appendChild(studentName);
      details.appendChild(department);

      const meta = document.createElement('div');
      meta.className = 'student-meta';

      const matric = document.createElement('span');
      matric.className = 'matric-number';
      matric.textContent = student.matric;

      const badge = document.createElement('span');
      badge.className = 'level-badge';
      badge.textContent = `${student.level} Level`;

      const lastTag = document.createElement('span');
      lastTag.className = 'last-added-tag';
      lastTag.textContent = 'Last added';

      meta.appendChild(matric);
      meta.appendChild(badge);

      if (i === students.length - 1) {
        meta.appendChild(lastTag);
      }

      row.appendChild(number);
      row.appendChild(details);
      row.appendChild(meta);
      studentList.appendChild(row);
    }
  }

  renderNamesList();
}

// Render the panel containing only student names.
function renderNamesList() {
  nameList.innerHTML = '';

  if (students.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No student names yet.';
    nameList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < students.length; i += 1) {
    const item = document.createElement('li');
    item.textContent = students[i].name;
    nameList.appendChild(item);
  }
}

// Add the required sample students when the list is empty.
function addSampleStudents() {
  const sampleStudents = [
    { name: 'Effa Divine', matric: '23/024145123', level: '300', department: 'Computer Science' },
    { name: 'Bassey Joy', matric: '23/024145124', level: '300', department: 'Accounting' },
    { name: 'Ikechukwu Emeka', matric: '23/024145125', level: '300', department: 'Mass Communication' }
  ];

  if (students.length > 0) {
    statusMessage.textContent = 'The list already has students. Add a new entry instead.';
    return;
  }

  for (let i = 0; i < sampleStudents.length; i += 1) {
    students.push(sampleStudents[i]);
  }

  render();
  statusMessage.textContent = 'Added 3 sample students.';
}

// Show or hide the names list panel.
function toggleNamesPanel() {
  const isHidden = namePanel.classList.toggle('hidden');
  toggleNamesButton.textContent = isHidden ? 'Done, show names' : 'Done, hide names';
}

// Reset the form and all error text.
function clearErrors() {
  nameError.textContent = '';
  matricError.textContent = '';
  levelError.textContent = '';
  departmentError.textContent = '';
}

// Handle the form submit and validate all values before storing the student.
studentForm.addEventListener('submit', function (event) {
  event.preventDefault();
  clearErrors();

  const student = {
    name: nameInput.value,
    matric: matricInput.value,
    level: levelInput.value,
    department: departmentInput.value
  };

  const errors = validate(student);

  if (Object.keys(errors).length > 0) {
    if (errors.name) {
      nameError.textContent = errors.name;
    }
    if (errors.matric) {
      matricError.textContent = errors.matric;
    }
    if (errors.level) {
      levelError.textContent = errors.level;
    }
    if (errors.department) {
      departmentError.textContent = errors.department;
    }

    return;
  }

  addStudent({
    name: student.name.trim(),
    matric: student.matric.trim(),
    level: student.level,
    department: student.department.trim()
  });

  studentForm.reset();
});

removeLastButton.addEventListener('click', removeLast);
addSamplesButton.addEventListener('click', addSampleStudents);
toggleNamesButton.addEventListener('click', toggleNamesPanel);

render();
statusMessage.textContent = 'Add a student to begin.';
