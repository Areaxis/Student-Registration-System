// getting references to DOM elements using query selectors
const form = document.querySelector('#student-form');
const tableBody = document.querySelector('#student-table-body');
const studentList = document.getElementById('studentlist');

// Load saved data on page load
window.addEventListener('DOMContentLoaded', () => {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  students.forEach(addRow);
  // after loading all rows, update scroll state once
  updateVerticalScroll();
});

// Handle form submission
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Getting values from forms
  const name = document.querySelector('#student-name').value.trim();
  const id = document.querySelector('#student-id').value.trim();
  const email = document.querySelector('#email-id').value.trim();
  const countryCode = document.querySelector('#country-code').value.trim();
  const contact = document.querySelector('#contact-no').value.trim();

  // Validate if there is element missing
  if (name == '' || id == '' || email == '' || countryCode == '' || contact == '') {
    alert('Please enter all fields');
    return;
  }

  const student = {
    name,
    id,
    email,
    contact: '+' + countryCode + ' ' + contact
  };

  addRow(student);
  saveStudent(student);
  form.reset();
  // update scroll after adding
  updateVerticalScroll();
});

// Add a row to the table and update scroll
function addRow(s) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="px-4 py-2 border-b border-gray-300">${s.name}</td>
    <td class="px-4 py-2 border-b border-gray-300">${s.id}</td>
    <td class="px-4 py-2 border-b border-gray-300">${s.email}</td>
    <td class="px-4 py-2 border-b border-gray-300">${s.contact}</td>
    <td class="px-4 py-2 border-b border-gray-300 text-center">
      <button onclick="editRow(this)" class="text-blue-600 hover:text-blue-800">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button onclick="deleteRow(this)" class="text-red-600 hover:text-red-800">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>`;
  tableBody.appendChild(row);

  // If you want new rows to be visible when the scrollbar appears:
  // studentList.scrollTop = studentList.scrollHeight;

  updateVerticalScroll();
}

// function for saving student data to localStorage
function saveStudent(student) {
  const students = JSON.parse(localStorage.getItem('students')) || [];
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
}

// function for deleting a row and updating storage
function deleteRow(btn) {
  const row = btn.closest('tr');
  const id = row.children[1].textContent;
  row.remove();

  let students = JSON.parse(localStorage.getItem('students')) || [];
  students = students.filter(s => s.id !== id);
  localStorage.setItem('students', JSON.stringify(students));

  updateVerticalScroll();
}

function editRow(btn) {
  const rowCells = btn.closest('tr').children;
  document.querySelector('#student-name').value = rowCells[0].textContent;
  document.querySelector('#student-id').value = rowCells[1].textContent;
  document.querySelector('#email-id').value = rowCells[2].textContent;

  // contact looks like: "+CC NUMBER"
  const contactText = rowCells[3].textContent.trim();
  const parts = contactText.split(' ');
  let cc = parts[0] || '';
  const num = parts.slice(1).join(' ') || '';

  // remove leading '+' for the numeric country-code input
  cc = cc.replace(/^\+/, '');

  document.querySelector('#country-code').value = cc;
  document.querySelector('#contact-no').value = num;

  // remove the old row (and update storage/scroll)
  deleteRow(btn);
}

/* Function adds a limit to rows whereby a scroll appears */
function updateVerticalScroll() {
  // count how many rows are in the table
  const rows = tableBody.querySelectorAll("tr");
  const rowCount = rows.length;

  // set row limit depending on screen size
  let rowLimit;
  if (window.innerWidth < 640) {
    rowLimit = 5; // for small devices
  } else {
    rowLimit = 11; // for bigger devices
  }

  // check if rowCount is more than rowLimit
  if (rowCount > rowLimit) {
    // find out row height
    const firstRow = rows[0];
    let rowHeight;
    if (firstRow) {
      rowHeight = firstRow.getBoundingClientRect().height;
    } else {
      rowHeight = 44; // default height if no rows
    }

    // calculate how tall the box should be
    const boxHeight = rowHeight * rowLimit + 2;

    // apply styles
    studentList.style.maxHeight = boxHeight + "px";
    studentList.style.overflowY = "auto";
  } else {
    // remove scroll if not enough rows
    studentList.style.maxHeight = "";
    studentList.style.overflowY = "";
  }
}
window.addEventListener('resize', updateVerticalScroll);
// just in case the user resizes the window after loading