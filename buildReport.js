// Function to build the reports section
function buildReportsSection(data) {
    // Create the section element
    const section = document.createElement('section');
    section.id = 'report';
    section.className = 'report-section';

    // Create and style the h2 element
    const reportsHeading = document.createElement('h2');
    reportsHeading.id = 'report-caption';
    reportsHeading.textContent = data.caption;

    // Create the container div
    const container = document.createElement('div');
    container.className = 'report-container';

    // Create the table
    const reportsTable = document.createElement('table');
    reportsTable.className = 'report-table';
    reportsTable.setAttribute('aria-labelledby', 'report-caption');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create header cells with specified widths and classes
    const dateHeader = document.createElement('th');
    dateHeader.className = 'report-date-cell';
    dateHeader.setAttribute('scope', 'col');
    dateHeader.textContent = 'Date';

    const taskHeader = document.createElement('th');
    taskHeader.className = 'report-task-cell';
    taskHeader.setAttribute('scope', 'col');
    taskHeader.textContent = 'Task';

    const notesHeader = document.createElement('th');
    notesHeader.className = 'report-notes-cell';
    notesHeader.setAttribute('scope', 'col');
    notesHeader.textContent = 'Notes';

    // Append headers to the row
    headerRow.appendChild(dateHeader);
    headerRow.appendChild(taskHeader);
    headerRow.appendChild(notesHeader);
    thead.appendChild(headerRow);
    reportsTable.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    reportsTable.appendChild(tbody);

    // Array to store completed tasks in memory
    const completedTasks = [];

    // Function to add a new row to the table
    function addRow(task) {
        const tableRow = document.createElement('tr');
        
        const dateCell = document.createElement('td');
        dateCell.className = 'report-date-cell';
        dateCell.textContent = task.date.replace(/\//g, '-');
        
        const taskCell = document.createElement('td');
        taskCell.className = 'report-task-cell';
        taskCell.textContent = task.tasks;
        
        const notesCell = document.createElement('td');
        notesCell.className = 'report-notes-cell';
        notesCell.textContent = task.notes;
        
        tableRow.appendChild(dateCell);
        tableRow.appendChild(taskCell);
        tableRow.appendChild(notesCell);
        tbody.appendChild(tableRow);
    }

    // Listen for taskCompleted events
    document.addEventListener('taskCompleted', (event) => {
        const completedTask = event.detail;
        completedTasks.push(completedTask);
        addRow(completedTask);
    });
    
    // Append table to container
    container.appendChild(reportsTable);

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'report-buttons';

    // Function to handle SVG state changes
    function handleButtonState(event) {
        const button = event.target.closest('.report-button');
        if (!button) return;
        const img = button.querySelector('img');
        if (!img) return;
        const baseName = img.src.split('/').pop().replace('0.svg', '1.svg');
        img.src = `images/${baseName}`;
    }

    function handleButtonStateEnd(event) {
        const button = event.target.closest('.report-button');
        if (!button) return;
        const img = button.querySelector('img');
        if (!img) return;
        const baseName = img.src.split('/').pop().replace('1.svg', '0.svg');
        img.src = `images/${baseName}`;
    }

    // Create add button
    const addButton = document.createElement('button');
    addButton.id = 'addRow';
    addButton.className = 'report-button';
    addButton.innerHTML = '<img src="images/add0.svg" alt="Add Row">';
    
    // Add hover and focus event listeners
    addButton.addEventListener('mouseenter', handleButtonState);
    addButton.addEventListener('mouseleave', handleButtonStateEnd);
    addButton.addEventListener('focus', handleButtonState);
    addButton.addEventListener('blur', handleButtonStateEnd);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.id = 'deleteRow';
    deleteButton.className = 'report-button';
    deleteButton.innerHTML = '<img src="images/delete0.svg" alt="Delete Row">';
    
    // Add hover and focus event listeners
    deleteButton.addEventListener('mouseenter', handleButtonState);
    deleteButton.addEventListener('mouseleave', handleButtonStateEnd);
    deleteButton.addEventListener('focus', handleButtonState);
    deleteButton.addEventListener('blur', handleButtonStateEnd);

    // Add buttons to container
    buttonContainer.appendChild(addButton);
    buttonContainer.appendChild(deleteButton);

    // Append button container to main container
    container.appendChild(buttonContainer);

    // Append elements to section
    section.appendChild(reportsHeading);
    section.appendChild(container);

    // Get current date in mm-dd-yy format
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');

    return section;
}

// Export the function
export { buildReportsSection }; 