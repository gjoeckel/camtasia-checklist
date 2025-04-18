/**
 * buildPrinciples.js
 * 
 * This script is responsible for:
 * 1. Fetching the JSON data
 * 2. Generating principle sections dynamically
 * 3. Building tables for each principle
 */

// Table configuration
const TABLE_CONFIG = {
    headers: [
        { text: 'Progress', class: 'progress-cell' },
        { text: 'Tasks', class: 'task-cell' },
        { text: 'Info', class: 'info-cell' },
        { text: 'Notes', class: 'notes-cell' },
        { text: 'Status', class: 'status-cell' }
    ]
};

// State management functions
function saveState(id, state) {
    const currentState = getState() || {};
    currentState[id] = state;
    sessionStorage.setItem('checklistState', JSON.stringify(currentState));
}

function getState() {
    const state = sessionStorage.getItem('checklistState');
    return state ? JSON.parse(state) : null;
}

// Function to create a principle section
function createPrincipleSection(principleId, data) {
    const section = document.createElement('section');
    section.id = principleId;
    section.className = `principle-section ${principleId}`;

    // Create heading
    const heading = document.createElement('h2');
    heading.id = `${principleId}-caption`;
    heading.textContent = data.caption;
    section.appendChild(heading);

    // Create container
    const container = document.createElement('div');
    container.className = 'guidelines-container';
    section.appendChild(container);

    return section;
}

// Function to build table
function buildTable(rows, principleId) {
    const table = document.createElement('table');
    table.className = 'principles-table';
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Principles Checklist');

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const progressHeader = document.createElement('th');
    progressHeader.className = 'progress-cell';
    progressHeader.textContent = 'Progress';
    
    const taskHeader = document.createElement('th');
    taskHeader.className = 'task-cell';
    taskHeader.textContent = 'Tasks';
    
    const infoHeader = document.createElement('th');
    infoHeader.className = 'info-cell';
    infoHeader.textContent = 'Info';
    
    const notesHeader = document.createElement('th');
    notesHeader.className = 'notes-cell';
    notesHeader.textContent = 'Notes';
    
    const statusHeader = document.createElement('th');
    statusHeader.className = 'status-cell';
    statusHeader.textContent = 'Status';
    
    headerRow.appendChild(progressHeader);
    headerRow.appendChild(taskHeader);
    headerRow.appendChild(infoHeader);
    headerRow.appendChild(notesHeader);
    headerRow.appendChild(statusHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    tbody.setAttribute('role', 'rowgroup');

    // Add rows for each principle
    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        tr.setAttribute('data-id', row.id);
        tr.className = 'principle-row';
        tbody.appendChild(tr);

        // Add cells in correct order
        const cells = [
            { className: 'progress-cell' },
            { text: row.task, className: 'task-cell' },
            { className: 'info-cell' },
            { className: 'notes-cell' },
            { className: 'status-cell' }
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            td.className = cell.className;
            td.setAttribute('role', 'cell');
            tr.appendChild(td);

            if (cell.text) {
                td.textContent = cell.text;
            }
        });

        // Add star to progress cell
        const progressCell = tr.querySelector('.progress-cell');
        const star = document.createElement('div');
        star.className = 'star pending';
        star.setAttribute('data-id', row.id);
        star.setAttribute('data-state', 'pending');
        star.textContent = '★';
        progressCell.appendChild(star);

        // Add info links to info cell
        const infoCell = tr.querySelector('.info-cell');
        const infoButton = document.createElement('button');
        infoButton.className = 'info-link';
        infoButton.setAttribute('aria-label', `Show example for ${row.task}`);
        
        const infoImg = document.createElement('img');
        infoImg.src = 'images/info0.svg';
        infoImg.alt = '';
        infoButton.appendChild(infoImg);
        
        // Add hover and focus event listeners
        infoButton.addEventListener('mouseenter', () => {
            infoImg.src = 'images/info1.svg';
        });
        
        infoButton.addEventListener('mouseleave', () => {
            infoImg.src = 'images/info0.svg';
        });
        
        infoButton.addEventListener('focus', () => {
            infoImg.src = 'images/info1.svg';
        });
        
        infoButton.addEventListener('blur', () => {
            infoImg.src = 'images/info0.svg';
        });

        // Add click handler for modal
        infoButton.addEventListener('click', () => {
            const modal = document.getElementById('infoModal');
            const overlay = document.getElementById('modalOverlay');
            const iframe = document.getElementById('modalIframe');
            const modalTitle = document.getElementById('modalTitle');
            const closeButton = modal.querySelector('.close-modal');

            // Set modal content
            iframe.src = row.show;
            
            // Truncate title at last complete word within character limit
            const maxLength = 50; // Adjust this value as needed
            const words = row.task.split(' ');
            let truncatedTitle = '';
            
            for (const word of words) {
                if ((truncatedTitle + ' ' + word).length <= maxLength) {
                    truncatedTitle += (truncatedTitle ? ' ' : '') + word;
                } else {
                    break;
                }
            }
            
            modalTitle.textContent = truncatedTitle;
            modalTitle.classList.add('visible');

            // Show modal and overlay
            modal.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');

            // Focus close button
            closeButton.focus();

            // Handle close button click
            const closeModal = () => {
                modal.setAttribute('aria-hidden', 'true');
                overlay.setAttribute('aria-hidden', 'true');
                iframe.src = '';
            };

            closeButton.onclick = closeModal;
            overlay.onclick = closeModal;

            // Handle escape key
            const handleEscape = (event) => {
                if (event.key === 'Escape') {
                    closeModal();
                }
            };

            document.addEventListener('keydown', handleEscape);

            // Clean up event listener when modal is closed
            closeButton.addEventListener('click', () => {
                document.removeEventListener('keydown', handleEscape);
            }, { once: true });
        });
        
        infoCell.appendChild(infoButton);

        // Add notes textarea
        const notesCell = tr.querySelector('.notes-cell');
        const textarea = document.createElement('textarea');
        textarea.className = 'notes-textarea';
        textarea.setAttribute('aria-label', `Notes for ${row.task}`);
        notesCell.appendChild(textarea);

        // Add status button
        const statusCell = tr.querySelector('.status-cell');
        const statusButton = document.createElement('button');
        statusButton.className = 'status-button';
        statusButton.setAttribute('data-state', 'pending');
        statusButton.setAttribute('aria-label', 'Task status: Pending');
        statusButton.innerHTML = `<img src="images/pending.svg" alt="">`;
        statusCell.appendChild(statusButton);

        // Add click handler for status button
        statusButton.addEventListener('click', () => {
            const currentState = statusButton.getAttribute('data-state');
            let newState, newIcon, newLabel, newStarState;
            
            if (currentState === 'pending') {
                // Check if there's text in the textarea
                const notesText = textarea.value.trim();
                if (notesText) {
                    // If there's text, move directly to completed state
                    newState = 'completed';
                    newIcon = 'images/completed.svg';
                    newLabel = 'Task status: Completed';
                    newStarState = 'completed';
                    
                    // Store task and notes values
                    const taskCell = tr.querySelector('.task-cell');
                    if (!taskCell) {
                        console.error('Task cell not found');
                        return;
                    }
                    const taskText = taskCell.textContent || '';
                    
                    // Store in data attributes for later use
                    tr.setAttribute('data-completed-task', taskText);
                    tr.setAttribute('data-completed-notes', notesText);
                    
                    // Store completed task data
                    storeCompletedTask(taskText, notesText);
                    
                    // Clear and disable textarea
                    textarea.value = '';
                    textarea.readOnly = true;
                    textarea.placeholder = "Task completed. Click Status icon to reset.";
                } else {
                    // If no text, move to working state
                    newState = 'working';
                    newIcon = 'images/working.svg';
                    newLabel = 'Task status: Working';
                    newStarState = 'working';
                }
            } else if (currentState === 'working') {
                // Check if there's text in the textarea
                const notesText = textarea.value.trim();
                if (notesText) {
                    newState = 'completed';
                    newIcon = 'images/completed.svg';
                    newLabel = 'Task status: Completed';
                    newStarState = 'completed';
                    
                    // Store task and notes values
                    const taskCell = tr.querySelector('.task-cell');
                    if (!taskCell) {
                        console.error('Task cell not found');
                        return;
                    }
                    const taskText = taskCell.textContent || '';
                    
                    // Store in data attributes for later use
                    tr.setAttribute('data-completed-task', taskText);
                    tr.setAttribute('data-completed-notes', notesText);
                    
                    // Store completed task data
                    storeCompletedTask(taskText, notesText);
                    
                    // Clear and disable textarea
                    textarea.value = '';
                    textarea.readOnly = true;
                    textarea.placeholder = "Task completed. Click Status icon to reset.";
                }
            } else if (currentState === 'completed') {
                newState = 'pending';
                newIcon = 'images/pending.svg';
                newLabel = 'Task status: Pending';
                newStarState = 'pending';
                
                // Reset textarea
                textarea.readOnly = false;
                textarea.placeholder = '';
            }
            
            if (newState) {
                statusButton.setAttribute('data-state', newState);
                statusButton.setAttribute('aria-label', newLabel);
                const statusImg = statusButton.querySelector('img');
                if (statusImg) {
                    statusImg.src = newIcon;
                }
                star.className = `star ${newStarState}`;
                star.setAttribute('data-state', newStarState);
            }
        });

        // Add input handler for textarea
        textarea.addEventListener('input', () => {
            const currentState = statusButton.getAttribute('data-state');
            const hasText = textarea.value.trim().length > 0;
            
            if (currentState === 'pending' && hasText) {
                statusButton.setAttribute('data-state', 'working');
                statusButton.setAttribute('aria-label', 'Task status: Working');
                statusButton.querySelector('img').src = 'images/working.svg';
                star.className = 'star working';
                star.setAttribute('data-state', 'working');
            }
        });

        // Add mutation observer for star state changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const starElement = mutation.target;
                    if (starElement.classList.contains('completed')) {
                        handleStarCompleted(starElement, textarea);
                    }
                }
            });
        });

        observer.observe(star, { attributes: true });

        // Function to handle star completion
        function handleStarCompleted(starElement, textarea) {
            // Step A: Store text temporarily if it exists
            const tempText = textarea.value.trim();
            
            // Step B: Clear textarea after a short delay
            setTimeout(() => {
                textarea.value = '';
                
                // Step C: Set placeholder text after another delay
                setTimeout(() => {
                    textarea.placeholder = "Reset this Task by clicking the Status icon.";
                    
                    // Step D: Set textarea to readonly after final delay
                    setTimeout(() => {
                        textarea.readOnly = true;
                    }, 100);
                }, 100);
            }, 100);
        }
    });

    table.appendChild(tbody);
    return table;
}

// Function to create report section
function createReportSection() {
    const section = document.createElement('section');
    section.id = 'report';
    section.className = 'principle-section';

    const heading = document.createElement('h2');
    heading.textContent = 'Report';
    section.appendChild(heading);

    const container = document.createElement('div');
    container.className = 'guidelines-container';
    section.appendChild(container);

    return section;
}

// Function to store completed task data
function storeCompletedTask(task, notes) {
    // Create completed task data with current date
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    });
    
    const completedTask = {
        date: date,
        tasks: task,
        notes: notes
    };
    
    // Dispatch custom event with completed task data
    const event = new CustomEvent('taskCompleted', {
        detail: completedTask
    });
    document.dispatchEvent(event);
}

// Function to build all content
async function buildContent() {
    try {
        const response = await fetch('camtasia.json');
        const data = await response.json();
        const main = document.querySelector('main');
        
        // Clear existing content
        main.innerHTML = '';

        // Create principle sections
        Object.entries(data).forEach(([principleId, principleData]) => {
            if (principleId !== 'report') {  // Skip report section as it's handled separately
                const section = createPrincipleSection(principleId, principleData);
                const table = buildTable(principleData.table, principleId);
                section.querySelector('.guidelines-container').appendChild(table);
                main.appendChild(section);
            }
        });

    } catch (error) {
        console.error('Error building content:', error);
    }
}

// Export the function
export { buildContent }; 