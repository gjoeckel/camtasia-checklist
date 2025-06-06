<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<!-- Added viewport meta for responsiveness -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Camtasia Accessibility Checklist</title>
<link rel="stylesheet" href="camtasia.css">
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
        <button id="saveButton" class="header-button">Save</button>
        <button id="testButton" class="header-button">Test</button>
    </div>
</header>

<!-- Side Panel -->
<nav class="side-panel" aria-expanded="true">
    <ul id="side-panel">
        <li>
            <a href="#perceivable" aria-label="Perceivable">
                <img src="images/perceivable1.svg" alt="" width="24" height="24">
            </a>
        </li>
        <li>
            <a href="#operable" aria-label="Operable">
                <img src="images/operable0.svg" alt="" width="24" height="24">
            </a>
        </li>
        <li>
            <a href="#understandable" aria-label="Understandable">
                <img src="images/understandable0.svg" alt="" width="24" height="24">
            </a>
        </li>
        <li><a href="#report"><img src="images/report0.svg" alt="Report"></a></li>
    </ul>
    <button class="toggle-strip" aria-label="Toggle side panel" aria-expanded="true" aria-controls="side-panel">
        <span class="toggle-arrow">◀</span>
    </button>
</nav>

<!-- Main Content -->
<main>
    <h1>Planning Checklist</h1>
    <p>Use this checklist to plan your video content.</p>

    <!-- Content will be generated dynamically -->
    <div id="content">
        <section class="principles-container">
            <!-- Principles content will be added here -->
        </section>
        <section class="report-section">
            <div class="report-container">
                <!-- Report content will be added here -->
            </div>
        </section>
    </div>
</main>

<div id="infoModal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="modalTitle">Example Information</h2>
            <button class="close-modal" aria-label="Close modal">×</button>
        </div>
        <div class="modal-body">
            <iframe id="modalIframe" title="Example content"></iframe>
        </div>
    </div>
</div>
<div id="modalOverlay" class="modal-overlay" aria-hidden="true"></div>

<!-- Footer -->
<footer>
    <p>© 2025 NCADEMI. All rights reserved.</p>
</footer>

<!-- Scripts -->
<script src="buildPrinciples.js" type="module"></script>
<script src="buildReport.js" type="module"></script>
<script src="main.js" type="module"></script>
</body>
</html> 