<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<!-- Added viewport meta for responsiveness -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Camtasia Accessibility Checklist</title>
<link rel="stylesheet" href="camtasia.css">
<style>
    /* Header button styles */
    .sticky-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
    }
    
    .sticky-header h1 {
        margin: 0;
        flex-grow: 1;
        text-align: center;
    }
    
    .header-buttons {
        display: flex;
        align-items: center;
        gap: 3rem;
    }
    
    .header-button {
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    #startButton {
        background-color: #28a745;
    }
    
    #startButton:hover {
        background-color: #218838;
    }
    
    #testButton {
        background-color: #333;
    }
    
    #testButton:hover {
        background-color: #444;
    }
</style>
</head>
<body>
<!-- NoScript fallback to notify users that JavaScript is required -->
<noscript>
<p>This application requires JavaScript to function properly. Please enable JavaScript in your browser settings.</p>
</noscript>

<!-- Sticky Header -->
<header class="sticky-header">
    <h1>Camtasia Accessibility Checklist</h1>
    <div class="header-buttons">
        <button id="startButton" class="header-button">Start</button>
        <button id="testButton" class="header-button">Test</button>
    </div>
</header>


<!-- Footer -->
<footer>
    <p>© 2025 NCADEMI. All rights reserved.</p>
</footer>


</body>
</html> 