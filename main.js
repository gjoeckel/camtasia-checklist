/**
 * main.js
 * 
 * This script is responsible for:
 * 1. Initializing the application
 * 2. Setting up event listeners for principle selection buttons
 * 3. Handling principle switching
 * 4. Coordinating functionality from other modules
 */

import { buildContent } from './buildPrinciples.js';
import { buildReportsSection } from './buildReport.js';

// Function to handle side panel toggle
function handleSidePanelToggle(event) {
    const sidePanel = document.querySelector('.side-panel');
    const toggleStrip = document.querySelector('.toggle-strip');
    if (!sidePanel || !toggleStrip) return;

    const isExpanded = sidePanel.getAttribute('aria-expanded') === 'true';
    sidePanel.setAttribute('aria-expanded', !isExpanded);
    toggleStrip.setAttribute('aria-expanded', !isExpanded);
}

// Function to handle principle selection
function handlePrincipleSelection(event) {
    const link = event.target.closest('a');
    if (!link) return;

    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Update active state in navigation
    document.querySelectorAll('.side-panel a').forEach(a => {
        a.classList.remove('active');
        // Reset all images to their 0 state
        const img = a.querySelector('img');
        if (img) {
            const baseName = img.src.split('/').pop().replace('1.svg', '0.svg');
            img.src = `images/${baseName}`;
        }
    });

    // Set active link's image to 1 state
    const activeImg = link.querySelector('img');
    if (activeImg) {
        const baseName = activeImg.src.split('/').pop().replace('0.svg', '1.svg');
        activeImg.src = `images/${baseName}`;
    }
    link.classList.add('active');

    // Scroll to target position
    window.scrollTo({
        top: targetSection.offsetTop,
        behavior: 'smooth'
    });
}

// Function to handle hover and focus states
function handleLinkState(event) {
    const link = event.target.closest('a');
    if (!link) return;

    const img = link.querySelector('img');
    if (!img) return;

    const baseName = img.src.split('/').pop().replace('0.svg', '1.svg');
    img.src = `images/${baseName}`;
}

function handleLinkStateEnd(event) {
    const link = event.target.closest('a');
    if (!link) return;

    // Only reset if not active
    if (!link.classList.contains('active')) {
        const img = link.querySelector('img');
        if (!img) return;

        const baseName = img.src.split('/').pop().replace('1.svg', '0.svg');
        img.src = `images/${baseName}`;
    }
}

// Function to handle add row button
function handleAddRow(event) {
    event.preventDefault();
    const reportTable = document.querySelector('.report-table tbody');
    if (!reportTable) return;

    // Create new row
    const tableRow = document.createElement('tr');
    tableRow.className = 'manual';

    // Get current date in mm-dd-yy format
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');

    // Create cells
    const dateCell = document.createElement('td');
    dateCell.className = 'report-date-cell';
    dateCell.textContent = date;

    const taskCell = document.createElement('td');
    taskCell.className = 'report-task-cell';
    taskCell.textContent = '';
    taskCell.setAttribute('role', 'textbox');
    taskCell.setAttribute('aria-label', 'Task description');
    taskCell.setAttribute('tabindex', '0');

    const notesCell = document.createElement('td');
    notesCell.className = 'report-notes-cell';
    notesCell.textContent = '';
    notesCell.setAttribute('role', 'textbox');
    notesCell.setAttribute('aria-label', 'Task notes');
    notesCell.setAttribute('tabindex', '0');

    // Append cells to row
    tableRow.appendChild(dateCell);
    tableRow.appendChild(taskCell);
    tableRow.appendChild(notesCell);

    // Append row to table
    reportTable.appendChild(tableRow);

    // Function to make cell editable
    function makeEditable(cell) {
        if (!cell.hasAttribute('contenteditable')) {
            cell.setAttribute('contenteditable', 'true');
            cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')} (editing)`);
            cell.focus();
            
            // Announce to screen readers
            const announcement = document.createElement('div');
            announcement.setAttribute('role', 'status');
            announcement.setAttribute('aria-live', 'polite');
            announcement.className = 'sr-only';
            announcement.textContent = `${cell.getAttribute('aria-label')} is now editable`;
            document.body.appendChild(announcement);
            setTimeout(() => announcement.remove(), 1000);
        }
    }

    // Function to handle keyboard interaction
    function handleKeyDown(event, cell) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            makeEditable(cell);
        }
    }

    // Add click and keyboard handlers
    taskCell.addEventListener('click', () => makeEditable(taskCell));
    taskCell.addEventListener('keydown', (e) => handleKeyDown(e, taskCell));
    
    notesCell.addEventListener('click', () => makeEditable(notesCell));
    notesCell.addEventListener('keydown', (e) => handleKeyDown(e, notesCell));

    // Set focus to the task cell
    taskCell.focus();
}

// Function to handle delete row button
function handleDeleteRow(event) {
    event.preventDefault();
    const manualRows = document.querySelectorAll('.report-table tbody tr.manual');
    if (manualRows.length > 0) {
        // Remove the last manual row
        manualRows[manualRows.length - 1].remove();
        
        // Set focus to the Report link in the side panel
        const reportLink = document.querySelector('.side-panel a[href="#report"]');
        if (reportLink) {
            reportLink.focus();
        }
    }
}

// Function to handle task completion
function handleTaskCompletion(event) {
    // Check if the click is from the Status completed button
    if (!event.target.matches('.status-completed')) {
        return;
    }

    const taskRow = event.target.closest('tr');
    if (!taskRow) return;

    // Get the notes textarea
    const sourceNotesCell = taskRow.querySelector('.notes-cell');
    const sourceNotesTextarea = sourceNotesCell.querySelector('textarea');
    
    // Only proceed if the textarea has content (checked via data attribute)
    if (!sourceNotesTextarea || sourceNotesTextarea.getAttribute('data-has-content') !== 'true') {
        return;
    }

    // Get task text
    const sourceTaskCell = taskRow.querySelector('.task-cell');
    const taskText = sourceTaskCell.textContent.trim();

    // Get current date in mm-dd-yy format
    const today = new Date();
    const date = today.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit'
    }).replace(/\//g, '-');

    // Create new row in report table
    const reportTable = document.querySelector('.report-table tbody');
    if (!reportTable) return;

    const tableRow = document.createElement('tr');
    tableRow.className = 'completed';

    // Create cells
    const reportDateCell = document.createElement('td');
    reportDateCell.className = 'report-date-cell';
    reportDateCell.textContent = date;

    const reportTaskCell = document.createElement('td');
    reportTaskCell.className = 'report-tasks-cell';
    const reportTaskTextarea = document.createElement('textarea');
    reportTaskTextarea.value = taskText;
    reportTaskCell.appendChild(reportTaskTextarea);

    const reportNotesCell = document.createElement('td');
    reportNotesCell.className = 'report-notes-cell';
    const reportNotesTextarea = document.createElement('textarea');
    reportNotesTextarea.value = sourceNotesTextarea.value.trim();
    reportNotesCell.appendChild(reportNotesTextarea);

    // Append cells to row
    tableRow.appendChild(reportDateCell);
    tableRow.appendChild(reportTaskCell);
    tableRow.appendChild(reportNotesCell);

    // Append row to table
    reportTable.appendChild(tableRow);

    // Clear the notes textarea
    sourceNotesTextarea.value = '';
}

// Function to initialize the application
async function initializeApp() {
    // Set up side panel toggle
    const toggleStrip = document.querySelector('.toggle-strip');
    if (toggleStrip) {
        toggleStrip.addEventListener('click', handleSidePanelToggle);
        toggleStrip.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleSidePanelToggle(event);
            }
        });
    }

    // Set up principle selection and hover/focus states
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.addEventListener('click', handlePrincipleSelection);
        
        // Add hover and focus event listeners to all links
        const links = sidePanel.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('mouseenter', handleLinkState);
            link.addEventListener('mouseleave', handleLinkStateEnd);
            link.addEventListener('focus', handleLinkState);
            link.addEventListener('blur', handleLinkStateEnd);
        });
    }

    try {
        // Fetch data once
        const response = await fetch('camtasia.json');
        const data = await response.json();
        
        // Build principle sections
        await buildContent();
        
        // Build report section
        const reportSection = buildReportsSection(data.report);
        document.querySelector('main').appendChild(reportSection);

        // Set up add and delete row buttons
        const addRowButton = document.getElementById('addRow');
        const deleteRowButton = document.getElementById('deleteRow');
        
        if (addRowButton) {
            addRowButton.addEventListener('click', handleAddRow);
        }
        
        if (deleteRowButton) {
            deleteRowButton.addEventListener('click', handleDeleteRow);
        }

        // Set up MutationObserver for notes textareas
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    const textarea = mutation.target;
                    const hasContent = textarea.value.trim().length > 0;
                    textarea.setAttribute('data-has-content', hasContent.toString());
                }
            });
        });

        // Observe all notes textareas
        document.querySelectorAll('.notes-cell textarea').forEach(textarea => {
            // Set initial state
            textarea.setAttribute('data-has-content', (textarea.value.trim().length > 0).toString());
            
            // Observe changes
            observer.observe(textarea, {
                attributes: true,
                attributeFilter: ['value']
            });
        });

        // Scroll to perceivable section
        const perceivableSection = document.getElementById('perceivable');
        if (perceivableSection) {
            window.scrollTo({
                top: perceivableSection.offsetTop,
                behavior: 'instant'
            });
        }
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
