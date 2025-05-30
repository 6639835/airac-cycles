document.addEventListener('DOMContentLoaded', function() {
    // AIRAC cycle calculation
    // AIRAC cycles start every 28 days
    // First AIRAC cycle of 2025 starts on January 23rd, 2025 (as per official data)
    
    // Dark mode toggle
    initDarkMode();
    
    // Generate all AIRAC cycles from 2025-01 to 2099-13
    const airacCycles = generateAiracCycles();
    
    // Make airacCycles globally available for the details page
    window.airacCycles = airacCycles;
    
    // Find current cycle
    const currentCycle = findCurrentCycle(airacCycles);
    
    // Display current cycle info
    displayCurrentCycleInfo(currentCycle);
    
    // Create timeline
    createTimeline(airacCycles, currentCycle);
    initTimelineScroll();
    
    // Pagination setup
    const itemsPerPage = parseInt(localStorage.getItem('airacItemsPerPage')) || 20;
    let currentPage = 1;
    const totalPages = Math.ceil(airacCycles.length / itemsPerPage);
    updatePageInfo(currentPage, totalPages);
    
    // Populate the year filter dropdown
    populateYearFilter(airacCycles);
    
    // Display AIRAC cycles with pagination
    let filteredCycles = airacCycles;
    displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
    
    // Initialize enhanced UX features
    initEnhancedUX();
    
    // Make these variables globally available for enhanced functions
    window.itemsPerPage = itemsPerPage;
    window.currentPage = currentPage;
    window.filteredCycles = filteredCycles;
    window.currentCycle = currentCycle;
    
    // Add event listener for year filter
    document.getElementById('year-select').addEventListener('change', function() {
        const selectedYear = this.value;
        
        if (selectedYear === 'all') {
            filteredCycles = airacCycles;
        } else {
            filteredCycles = airacCycles.filter(cycle => cycle.year === parseInt(selectedYear));
        }
        
        // Reset to first page when filter changes
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.toggle('hidden', filteredCycles.length > 0);
    });
    
    // Pagination controls
    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
            displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        }
    });
    
    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < Math.ceil(filteredCycles.length / itemsPerPage)) {
            currentPage++;
            updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
            displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        }
    });
    
    // Search functionality
    const debouncedSearch = debounce(performSearch, 300);
    
    document.getElementById('search-input').addEventListener('input', function() {
        if (this.value.length >= 2 || this.value.length === 0) {
            debouncedSearch();
        }
    });
    
    document.getElementById('search-btn').addEventListener('click', function() {
        performSearch();
    });
    
    document.getElementById('reset-search').addEventListener('click', function() {
        document.getElementById('search-input').value = '';
        document.getElementById('year-select').value = 'all';
        filteredCycles = airacCycles;
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.add('hidden');
    });
    
    // Quick navigation links
    document.getElementById('go-to-current').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('year-select').value = 'all';
        filteredCycles = airacCycles;
        // Find page with current cycle
        const currentCycleIndex = airacCycles.findIndex(cycle => cycle.cycle === currentCycle.cycle);
        currentPage = Math.floor(currentCycleIndex / itemsPerPage) + 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.add('hidden');
    });
    
    document.getElementById('show-year-2025').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('year-select').value = '2025';
        filteredCycles = airacCycles.filter(cycle => cycle.year === 2025);
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.toggle('hidden', filteredCycles.length > 0);
    });
    
    document.getElementById('show-all').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('year-select').value = 'all';
        filteredCycles = airacCycles;
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.add('hidden');
    });
    
    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', function() {
        // Reset everything and refresh the display
        document.getElementById('search-input').value = '';
        document.getElementById('year-select').value = 'all';
        filteredCycles = airacCycles;
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.add('hidden');
    });
    
    function performSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        if (searchTerm.trim() === '') {
            filteredCycles = airacCycles;
        } else {
            filteredCycles = airacCycles.filter(cycle => 
                cycle.cycle.toLowerCase().includes(searchTerm) ||
                cycle.startDate.toLowerCase().includes(searchTerm) ||
                cycle.endDate.toLowerCase().includes(searchTerm) ||
                cycle.year.toString().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.toggle('hidden', filteredCycles.length > 0);
    }
    
    function getPaginatedItems(items, page, perPage) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        return items.slice(start, end);
    }
    
    function updatePageInfo(current, total) {
        document.getElementById('page-info').textContent = `Page ${current} of ${total || 1}`;
        document.getElementById('prev-page').disabled = current <= 1;
        document.getElementById('next-page').disabled = current >= total;
    }
    
    // Initialize additional UI features
    initKeyboardShortcuts();
    initChartVisualization();
    initCycleDetails();
    initExportCSV();
    initHeaderActions();
    updateCycleStatistics(airacCycles);
    
    // Initialize additional UX features
    initTooltips();
    detectTouchDevice();
    initSwipeSupport();
    initLazyLoading();
    checkFirstVisit();
    
    // Add tour styles
    addGuidedTourStyles();
    
    // Performance monitoring
    initPerformanceMonitoring();
    
    // Add support for export dropdown menu
    document.getElementById('export-btn')?.addEventListener('click', function(e) {
        e.preventDefault();
        this.closest('.export-dropdown').classList.toggle('active');
    });
    
    // Add support for JSON export
    document.getElementById('export-json-btn')?.addEventListener('click', function() {
        const data = getAllCycleData();
        const jsonString = JSON.stringify(data, null, 2);
        downloadFile(jsonString, 'airac-cycles.json', 'application/json');
        showToast('JSON file exported successfully', 'success');
    });
    
    // Add support for PDF export
    document.getElementById('export-pdf-btn')?.addEventListener('click', function() {
        showToast('Preparing PDF export...', 'info');
        // PDF implementation would go here in a real application
        setTimeout(() => {
            showToast('PDF export feature coming soon!', 'warning');
        }, 1500);
    });
    
    // Add support for page selector
    function updatePageSelector(currentPage, totalPages) {
        const pageSelect = document.getElementById('page-select');
        if (!pageSelect) return;
        
        // Clear existing options
        pageSelect.innerHTML = '';
        
        // Add page options
        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Page ${i} of ${totalPages}`;
            if (i === currentPage) {
                option.selected = true;
            }
            pageSelect.appendChild(option);
        }
        
        // Add event listener
        pageSelect.addEventListener('change', function() {
            goToPage(parseInt(this.value));
        });
    }
    
    // Add timeline progress indicator
    function updateTimelineProgress(currentCycleIndex, totalCycles) {
        const progressIndicator = document.getElementById('timeline-progress-indicator');
        if (!progressIndicator) return;
        
        const progressPercentage = (currentCycleIndex / totalCycles) * 100;
        progressIndicator.style.width = `${progressPercentage}%`;
    }
    
    // Add table quick filter functionality
    document.getElementById('table-search-input')?.addEventListener('input', function() {
        const filterValue = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('#airac-data tr');
        
        let hasMatches = false;
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const shouldShow = text.includes(filterValue);
            
            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) {
                hasMatches = true;
            }
        });
        
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.classList.toggle('hidden', hasMatches);
        }
    });
    
    // Add current cycle detailed information display
    function populateCurrentCycleDetails(cycleData) {
        const container = document.getElementById('current-cycle-details');
        if (!container) return;
        
        container.innerHTML = `
            <div class="cycle-detail-item">
                <div class="cycle-detail-label">Cycle Number</div>
                <div class="cycle-detail-value">${cycleData.cycle}</div>
            </div>
            <div class="cycle-detail-item">
                <div class="cycle-detail-label">Start Date</div>
                <div class="cycle-detail-value">${formatDate(cycleData.startDate)}</div>
            </div>
            <div class="cycle-detail-item">
                <div class="cycle-detail-label">End Date</div>
                <div class="cycle-detail-value">${formatDate(cycleData.endDate)}</div>
            </div>
            <div class="cycle-detail-item">
                <div class="cycle-detail-label">Days Remaining</div>
                <div class="cycle-detail-value">${getDaysRemaining(cycleData.endDate)}</div>
            </div>
        `;
    }
    
    // Helper function to get days remaining
    function getDaysRemaining(endDate) {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    }
    
    // Function to download file
    function downloadFile(content, fileName, contentType) {
        const a = document.createElement('a');
        const file = new Blob([content], {type: contentType});
        
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(a.href);
    }
    
    // Enhanced toast notification system
    function showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        // Get appropriate icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
    
    // Call these functions when initializing or updating the page
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize page selector with placeholder data
        // In a real implementation, this would use actual pagination data
        updatePageSelector(1, 5);
        
        // Initialize timeline progress with placeholder data
        // In a real implementation, this would use actual cycle data
        updateTimelineProgress(10, 100);
        
        // Initialize current cycle details with placeholder data
        // In a real implementation, this would use actual cycle data
        const placeholderCycle = {
            cycle: '2301',
            startDate: new Date(),
            endDate: new Date(new Date().setDate(new Date().getDate() + 28)),
            year: '2023'
        };
        populateCurrentCycleDetails(placeholderCycle);
    });
    
    // Close dropdown menus when clicking outside
    document.addEventListener('click', function(e) {
        const dropdowns = document.querySelectorAll('.export-dropdown');
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    });
});

function initDarkMode() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or use system preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
        htmlElement.setAttribute('data-theme', 'dark');
        updateThemeToggleButton(true);
    } else {
        htmlElement.setAttribute('data-theme', 'light');
        updateThemeToggleButton(false);
    }
    
    // Theme toggle button click event
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeToggleButton(newTheme === 'dark');
    });
    
    function updateThemeToggleButton(isDarkMode) {
        const icon = themeToggleBtn.querySelector('i');
        const text = themeToggleBtn.querySelector('span');
        
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
            themeToggleBtn.setAttribute('data-tooltip', 'Switch to light theme');
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
            themeToggleBtn.setAttribute('data-tooltip', 'Switch to dark theme');
        }
    }
}

function generateAiracCycles() {
    const cycles = [];
    
    // First AIRAC cycle of 2025 starts on January 23rd, 2025 (as per official data)
    // This is based on the provided AIRAC cycle information
    const startDate = new Date(2025, 0, 23); // January 23rd, 2025
    
    // Known 2025 AIRAC dates for validation:
    const knownDates2025 = [
        { cycle: "2501", date: "23 JAN 25" },
        { cycle: "2502", date: "20 FEB 25" },
        { cycle: "2503", date: "20 MAR 25" },
        { cycle: "2504", date: "17 APR 25" },
        { cycle: "2505", date: "15 MAY 25" },
        { cycle: "2506", date: "12 JUN 25" },
        { cycle: "2507", date: "10 JUL 25" },
        { cycle: "2508", date: "07 AUG 25" },
        { cycle: "2509", date: "04 SEP 25" },
        { cycle: "2510", date: "02 OCT 25" },
        { cycle: "2511", date: "30 OCT 25" },
        { cycle: "2512", date: "27 NOV 25" },
        { cycle: "2513", date: "25 DEC 25" }
    ];
    
    // Calculate cycles from 2025-01 (2501) to 2099-13 (9913)
    let year = 2025;
    let cycleNum = 1;
    
    while (year <= 2099) {
        // Create cycle
        const cycleStart = new Date(startDate);
        const cycleEnd = new Date(startDate);
        cycleEnd.setDate(cycleEnd.getDate() + 27); // AIRAC cycles are 28 days, so end date is start + 27
        
        // Format cycle number (e.g., 2501 for 2025 cycle 1)
        const formattedCycleNum = String(year).substring(2) + String(cycleNum).padStart(2, '0');
        
        cycles.push({
            cycle: formattedCycleNum,
            startDate: formatDate(cycleStart),
            endDate: formatDate(cycleEnd),
            year: year,
            startDateObj: new Date(cycleStart),
            endDateObj: new Date(cycleEnd)
        });
        
        // Move to next cycle
        startDate.setDate(startDate.getDate() + 28);
        
        // Check if we need to move to next year or reset cycle number
        if (cycleNum === 13) {
            cycleNum = 1;
            year++;
        } else {
            cycleNum++;
        }
    }
    
    return cycles;
}

function findCurrentCycle(cycles) {
    const today = new Date();
    
    // For demo purposes, if current date is before 2025, pretend we're in the first cycle
    if (today < cycles[0].startDateObj) {
        return cycles[0];
    }
    
    // Find the cycle that contains today's date
    for (const cycle of cycles) {
        if (today >= cycle.startDateObj && today <= cycle.endDateObj) {
            return cycle;
        }
    }
    
    // If no cycle contains today (shouldn't happen), return the last cycle
    return cycles[cycles.length - 1];
}

function createTimeline(cycles, currentCycle) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    // Determine which cycles to show in the timeline (3 before, current, 3 after)
    const currentIndex = cycles.findIndex(cycle => cycle.cycle === currentCycle.cycle);
    const startIndex = Math.max(0, currentIndex - 3);
    const endIndex = Math.min(cycles.length - 1, currentIndex + 3);
    
    for (let i = startIndex; i <= endIndex; i++) {
        const cycle = cycles[i];
        const isActive = cycle.cycle === currentCycle.cycle;
        
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${isActive ? 'active' : ''}`;
        
        timelineItem.innerHTML = `
            <div class="timeline-item-point"></div>
            <div class="timeline-item-label">${cycle.cycle}</div>
            <div class="timeline-item-date">${formatDisplayDate(cycle.startDateObj).split(' ').slice(0, 2).join(' ')}</div>
        `;
        
        timeline.appendChild(timelineItem);
    }
}

function displayCurrentCycleInfo(currentCycle) {
    // Create current cycle info element if it doesn't exist
    if (!document.querySelector('.current-cycle-info')) {
        const container = document.querySelector('.controls');
        const cycleInfo = document.createElement('div');
        cycleInfo.className = 'current-cycle-info';
        
        // Format dates for display
        const startDate = formatDisplayDate(currentCycle.startDateObj);
        const endDate = formatDisplayDate(currentCycle.endDateObj);
        
        cycleInfo.innerHTML = `
            <strong>Current AIRAC Cycle:</strong> ${currentCycle.cycle} 
            (${startDate} to ${endDate})
            <div class="cycle-description">
                The AIRAC (Aeronautical Information Regulation and Control) cycle is a standardized 28-day schedule 
                for updating aeronautical data, ensuring that information like navigation data and procedures 
                is synchronized across the globe.
            </div>
        `;
        
        // Insert after the controls
        container.parentNode.insertBefore(cycleInfo, container.nextSibling);
    }
}

function formatDisplayDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

function populateYearFilter(cycles) {
    const yearSelect = document.getElementById('year-select');
    const years = [...new Set(cycles.map(cycle => cycle.year))];
    
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });
}

function displayAiracCycles(cycles, currentCycle) {
    const tableBody = document.getElementById('airac-data');
    
    // Show loading state
    tableBody.innerHTML = '';
    tableBody.parentElement.parentElement.classList.add('loading');
    
    // Use setTimeout to ensure the loading state is visible
    setTimeout(() => {
        // Proceed with rendering
        cycles.forEach(cycle => {
            const row = document.createElement('tr');
            
            // Add current-cycle class if this is the current cycle
            if (currentCycle && cycle.cycle === currentCycle.cycle) {
                row.classList.add('current-cycle');
            }
            
            const cycleCell = document.createElement('td');
            cycleCell.textContent = cycle.cycle;
            row.appendChild(cycleCell);
            
            const startDateCell = document.createElement('td');
            startDateCell.textContent = cycle.startDate;
            row.appendChild(startDateCell);
            
            const endDateCell = document.createElement('td');
            endDateCell.textContent = cycle.endDate;
            row.appendChild(endDateCell);
            
            const yearCell = document.createElement('td');
            yearCell.textContent = cycle.year;
            row.appendChild(yearCell);
            
            // Add status column
            const statusCell = document.createElement('td');
            
            // Determine cycle status (past, current, or upcoming)
            const today = new Date();
            let statusHTML = '';
            if (today > cycle.endDateObj) {
                statusHTML = '<span class="status status-past"><i class="fas fa-check-circle"></i>Past</span>';
            } else if (today >= cycle.startDateObj && today <= cycle.endDateObj) {
                statusHTML = '<span class="status status-active"><i class="fas fa-sync-alt"></i>Active</span>';
            } else {
                statusHTML = '<span class="status status-upcoming"><i class="fas fa-clock"></i>Upcoming</span>';
            }
            
            statusCell.innerHTML = statusHTML;
            row.appendChild(statusCell);
            
            // Add action buttons
            addCycleActionButtons(row, cycle);
            
            tableBody.appendChild(row);
        });
        
        // If there's a current cycle, scroll to it
        if (currentCycle) {
            const currentRow = tableBody.querySelector('.current-cycle');
            if (currentRow) {
                setTimeout(() => {
                    currentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Briefly highlight the current row
                    currentRow.classList.add('highlight-pulse');
                    setTimeout(() => {
                        currentRow.classList.remove('highlight-pulse');
                    }, 3000);
                }, 100);
            }
        }
        
        // Remove loading state
        tableBody.parentElement.parentElement.classList.remove('loading');
    }, 300); // Short delay to show loading indicator
}

// New function to initialize keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Don't trigger shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 's':
            case 'S':
                e.preventDefault();
                document.getElementById('search-input').focus();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                document.getElementById('prev-page').click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                document.getElementById('next-page').click();
                break;
            case 't':
            case 'T':
                e.preventDefault();
                document.getElementById('theme-toggle-btn').click();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                document.getElementById('go-to-current').click();
                break;
        }
    });
}

// New function to create and update chart visualization
function initChartVisualization() {
    const ctx = document.getElementById('cycles-chart').getContext('2d');
    
    // Get color scheme based on current theme
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e0e6f0' : '#30475e';
    
    // Create chart
    window.cyclesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Past', 'Current', 'Upcoming'],
            datasets: [{
                data: [0, 1, 0],
                backgroundColor: [
                    isDarkMode ? '#757575' : '#9e9e9e',
                    '#4caf50',
                    isDarkMode ? '#ff9800' : '#ff9800'
                ],
                borderWidth: 1,
                borderColor: isDarkMode ? '#22223a' : '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} cycles`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
    
    // Update chart when theme changes
    document.getElementById('theme-toggle-btn').addEventListener('click', function() {
        setTimeout(() => {
            const newIsDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            window.cyclesChart.data.datasets[0].backgroundColor = [
                newIsDarkMode ? '#757575' : '#9e9e9e',
                '#4caf50',
                newIsDarkMode ? '#ff9800' : '#ff9800'
            ];
            window.cyclesChart.data.datasets[0].borderColor = newIsDarkMode ? '#22223a' : '#ffffff';
            window.cyclesChart.options.plugins.legend.labels.color = newIsDarkMode ? '#e0e6f0' : '#30475e';
            window.cyclesChart.update();
        }, 300);
    });
}

// New function to update cycle statistics and chart
function updateCycleStatistics(cycles) {
    const today = new Date();
    let pastCycles = 0;
    let futureCycles = 0;
    let currentCycleCount = 0;
    
    cycles.forEach(cycle => {
        if (today > cycle.endDateObj) {
            pastCycles++;
        } else if (today < cycle.startDateObj) {
            futureCycles++;
        } else {
            currentCycleCount++;
        }
    });
    
    // Update statistics display
    document.getElementById('total-cycles').textContent = cycles.length;
    document.getElementById('elapsed-cycles').textContent = pastCycles;
    document.getElementById('remaining-cycles').textContent = futureCycles + currentCycleCount;
    
    // Update chart if it exists
    if (window.cyclesChart) {
        window.cyclesChart.data.datasets[0].data = [pastCycles, currentCycleCount, futureCycles];
        window.cyclesChart.update();
    }
}

// New function to initialize cycle details modal
function initCycleDetails() {
    const modal = document.getElementById('cycle-details-modal');
    const modalContent = document.getElementById('cycle-details-content');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Close modal when clicking close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        });
    });
    
    // Close modal when clicking outside of content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
        }
    });
}

// Update the addCycleActionButtons function to include tooltips and more interactive elements
function addCycleActionButtons(row, cycle) {
    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-small';
    viewBtn.setAttribute('data-tooltip', 'View details');
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.setAttribute('aria-label', 'View cycle details');
    viewBtn.addEventListener('click', () => showCycleDetails(cycle));
    
    actionsCell.appendChild(viewBtn);
    row.appendChild(actionsCell);
}

// Enhance the show cycle details function
function showCycleDetails(cycle) {
    const modal = document.getElementById('cycle-details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('cycle-details-content');
    
    // Update modal title and content
    modalTitle.innerHTML = `<i class="fas fa-calendar-week"></i> AIRAC Cycle ${cycle.cycle}`;
    
    // Get days elapsed/remaining in current cycle
    let daysInfo = '';
    let statusClass = '';
    let statusIcon = '';
    let statusLabel = '';
    const today = new Date();
    
    if (today < cycle.startDateObj) {
        const daysUntil = Math.ceil((cycle.startDateObj - today) / (1000 * 60 * 60 * 24));
        daysInfo = `<div class="days-info upcoming">Starts in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}</div>`;
        statusClass = 'status-upcoming';
        statusIcon = 'clock';
        statusLabel = 'Upcoming';
    } else if (today > cycle.endDateObj) {
        const daysAgo = Math.ceil((today - cycle.endDateObj) / (1000 * 60 * 60 * 24));
        daysInfo = `<div class="days-info past">Ended ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago</div>`;
        statusClass = 'status-past';
        statusIcon = 'check-circle';
        statusLabel = 'Past';
    } else {
        const daysElapsed = Math.ceil((today - cycle.startDateObj) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.ceil((cycle.endDateObj - today) / (1000 * 60 * 60 * 24));
        const progressPercent = Math.round((daysElapsed / 28) * 100);
        
        daysInfo = `
            <div class="days-info current">
                <div>Day ${daysElapsed} of 28 (${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining)</div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
        statusClass = 'status-active';
        statusIcon = 'sync-alt';
        statusLabel = 'Active';
    }
    
    // Calculate adjacent cycles
    const cycleIndex = window.airacCycles.findIndex(c => c.cycle === cycle.cycle);
    const prevCycle = cycleIndex > 0 ? window.airacCycles[cycleIndex - 1] : null;
    const nextCycle = cycleIndex < window.airacCycles.length - 1 ? window.airacCycles[cycleIndex + 1] : null;
    
    // Create adjacent cycles navigation
    const adjacentCyclesHtml = `
        <div class="adjacent-cycles">
            ${prevCycle ? `
                <button class="btn btn-small btn-adjacent" onclick="showCycleDetails(window.airacCycles[${cycleIndex - 1}])">
                    <i class="fas fa-chevron-left"></i> ${prevCycle.cycle}
                </button>` : `<div></div>`}
            
            <div class="status-badge ${statusClass}">
                <i class="fas fa-${statusIcon}"></i> ${statusLabel}
            </div>
            
            ${nextCycle ? `
                <button class="btn btn-small btn-adjacent" onclick="showCycleDetails(window.airacCycles[${cycleIndex + 1}])">
                    ${nextCycle.cycle} <i class="fas fa-chevron-right"></i>
                </button>` : `<div></div>`}
        </div>
    `;
    
    // Create calendar visualization
    const calendarHtml = createCalendarView(cycle);
    
    modalContent.innerHTML = `
        ${adjacentCyclesHtml}
        
        <div class="cycle-detail-header">
            <div class="cycle-detail-badge">${cycle.cycle.substring(0, 2)}<span>${cycle.cycle.substring(2)}</span></div>
            <div class="cycle-detail-main">
                <h3>${formatMonthYear(cycle.startDateObj)}</h3>
                <div class="cycle-dates">
                    <div class="date-range">
                        <i class="fas fa-play"></i> ${formatDisplayDate(cycle.startDateObj)}
                        <span class="date-separator">→</span>
                        <i class="fas fa-stop"></i> ${formatDisplayDate(cycle.endDateObj)}
                    </div>
                </div>
            </div>
        </div>
        
        ${daysInfo}
        
        <div class="cycle-calendar-view">
            <h4><i class="fas fa-calendar-alt"></i> Calendar View</h4>
            ${calendarHtml}
        </div>
        
        <div class="detail-section">
            <h4><i class="fas fa-info-circle"></i> Cycle Details</h4>
            <div class="cycle-detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Cycle Number:</div>
                    <div class="detail-value">${cycle.cycle}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Year:</div>
                    <div class="detail-value">${cycle.year}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Start Date:</div>
                    <div class="detail-value">${formatDisplayDate(cycle.startDateObj)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">End Date:</div>
                    <div class="detail-value">${formatDisplayDate(cycle.endDateObj)}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Duration:</div>
                    <div class="detail-value">28 days</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Cycle Number of Year:</div>
                    <div class="detail-value">${cycle.cycle.substring(2)}</div>
                </div>
            </div>
        </div>
        
        <div class="cycle-description detail-section">
            <h4><i class="fas fa-bookmark"></i> About AIRAC Cycles</h4>
            <p>The AIRAC (Aeronautical Information Regulation and Control) cycle is a standardized 28-day schedule 
            for updating aeronautical data, ensuring that information like navigation data and procedures 
            is synchronized across the globe.</p>
            <p>These updates include changes to airways, waypoints, navaids, arrival and departure procedures, airspace 
            classifications, and other critical data used by air traffic control and aircraft operators.</p>
        </div>
        
        <div class="detail-actions">
            <button class="btn btn-secondary" onclick="window.print()">
                <i class="fas fa-print"></i> Print Cycle
            </button>
            <button class="btn" onclick="exportCycleData('${cycle.cycle}')">
                <i class="fas fa-download"></i> Export Data
            </button>
        </div>
    `;
    
    // Add styles for the detail page
    addCycleDetailStyles();
    
    // Show the modal
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

// Create a calendar view for the cycle
function createCalendarView(cycle) {
    const startDate = new Date(cycle.startDateObj);
    const endDate = new Date(cycle.endDateObj);
    
    // Get the first day of the month
    const firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const lastDay = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
    
    // Create the days of the week header
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdaysHtml = daysOfWeek.map(day => `<div class="weekday">${day}</div>`).join('');
    
    // Calculate total days to display
    const totalDays = Math.ceil((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.ceil((firstDay.getDay() + totalDays) / 7);
    
    let calendarHtml = `<div class="calendar"><div class="weekdays">${weekdaysHtml}</div><div class="days">`;
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarHtml += `<div class="day empty"></div>`;
    }
    
    // Add all days of the month(s)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        const currentDate = new Date(d);
        const isToday = currentDate.getTime() === today.getTime();
        const isInCycle = currentDate >= startDate && currentDate <= endDate;
        const isCycleStart = currentDate.getTime() === startDate.getTime();
        const isCycleEnd = currentDate.getTime() === endDate.getTime();
        
        let classes = 'day';
        if (isInCycle) classes += ' in-cycle';
        if (isToday) classes += ' today';
        if (isCycleStart) classes += ' cycle-start';
        if (isCycleEnd) classes += ' cycle-end';
        
        calendarHtml += `<div class="${classes}">${currentDate.getDate()}</div>`;
    }
    
    // Add empty cells for days after the last day of the month
    const remainingCells = 7 - (lastDay.getDay() + 1);
    if (remainingCells < 7) {
        for (let i = 0; i < remainingCells; i++) {
            calendarHtml += `<div class="day empty"></div>`;
        }
    }
    
    calendarHtml += `</div></div>`;
    return calendarHtml;
}

// Format month and year
function formatMonthYear(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Export cycle data
function exportCycleData(cycleId) {
    const cycle = window.airacCycles.find(c => c.cycle === cycleId);
    if (!cycle) return;
    
    const cycleData = {
        cycle: cycle.cycle,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        year: cycle.year,
        description: "AIRAC (Aeronautical Information Regulation and Control) cycle"
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cycleData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `airac_cycle_${cycle.cycle}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    showToast('Cycle data exported', 'success');
}

// Add cycle detail styles
function addCycleDetailStyles() {
    // Add styles if they don't already exist
    if (!document.getElementById('cycle-detail-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'cycle-detail-styles';
        styleEl.textContent = `
            .cycle-detail-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid var(--border);
            }
            
            .cycle-detail-badge {
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                color: white;
                font-size: 1.8rem;
                font-weight: bold;
                border-radius: 8px;
                padding: 10px 15px;
                text-align: center;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                margin-right: 20px;
                min-width: 80px;
                display: flex;
                flex-direction: column;
                line-height: 1;
            }
            
            .cycle-detail-badge span {
                font-size: 1.2rem;
                opacity: 0.9;
            }
            
            .cycle-detail-main {
                flex: 1;
            }
            
            .cycle-detail-main h3 {
                font-size: 1.5rem;
                margin: 0 0 10px 0;
                color: var(--primary-dark);
                border: none;
                padding: 0;
            }
            
            .cycle-dates {
                display: flex;
                align-items: center;
                color: var(--text-dark);
                opacity: 0.8;
            }
            
            .date-range {
                display: flex;
                align-items: center;
                font-size: 1rem;
            }
            
            .date-range i {
                margin-right: 5px;
                font-size: 0.8rem;
            }
            
            .date-separator {
                margin: 0 10px;
                color: var(--primary);
            }
            
            .days-info {
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 25px;
                font-weight: 500;
                text-align: center;
            }
            
            .days-info.current {
                background-color: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.3);
                color: var(--status-active);
            }
            
            .days-info.upcoming {
                background-color: rgba(255, 152, 0, 0.1);
                border: 1px solid rgba(255, 152, 0, 0.3);
                color: var(--status-upcoming);
            }
            
            .days-info.past {
                background-color: rgba(158, 158, 158, 0.1);
                border: 1px solid rgba(158, 158, 158, 0.3);
                color: var(--status-past);
            }
            
            .progress-bar {
                height: 8px;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 4px;
                margin-top: 10px;
                overflow: hidden;
            }
            
            .progress {
                height: 100%;
                background-color: var(--status-active);
                border-radius: 4px;
            }
            
            .cycle-detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .detail-item {
                padding: 10px;
                background-color: var(--background);
                border-radius: 8px;
                transition: transform 0.2s ease;
            }
            
            .detail-item:hover {
                transform: translateY(-3px);
            }
            
            .detail-label {
                font-size: 0.85rem;
                color: var(--text-dark);
                opacity: 0.7;
                margin-bottom: 5px;
            }
            
            .detail-value {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--primary-dark);
            }
            
            .detail-section {
                margin-bottom: 25px;
            }
            
            .detail-section h4 {
                font-size: 1.1rem;
                color: var(--primary-dark);
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--border);
            }
            
            .detail-actions {
                display: flex;
                justify-content: flex-end;
                gap: 15px;
                margin-top: 25px;
                padding-top: 15px;
                border-top: 1px solid var(--border);
            }
            
            .btn-adjacent {
                background-color: var(--background);
                color: var(--text-dark);
                border: 1px solid var(--border);
                padding: 6px 12px;
            }
            
            .adjacent-cycles {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                padding: 5px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .status-badge i {
                margin-right: 5px;
            }
            
            .status-badge.status-active {
                background-color: rgba(76, 175, 80, 0.15);
                color: var(--status-active);
                border: 1px solid rgba(76, 175, 80, 0.3);
            }
            
            .status-badge.status-upcoming {
                background-color: rgba(255, 152, 0, 0.15);
                color: var(--status-upcoming);
                border: 1px solid rgba(255, 152, 0, 0.3);
            }
            
            .status-badge.status-past {
                background-color: rgba(158, 158, 158, 0.15);
                color: var(--status-past);
                border: 1px solid rgba(158, 158, 158, 0.3);
            }
            
            /* Calendar styles */
            .cycle-calendar-view {
                margin-bottom: 25px;
            }
            
            .calendar {
                display: flex;
                flex-direction: column;
                box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                border-radius: 8px;
                overflow: hidden;
                border: 1px solid var(--border);
            }
            
            .weekdays {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                background-color: var(--primary);
                color: white;
                font-weight: bold;
                text-align: center;
            }
            
            .weekday {
                padding: 10px;
                font-size: 0.85rem;
            }
            
            .days {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                background-color: var(--card-bg);
            }
            
            .day {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid var(--border);
                font-size: 0.9rem;
                position: relative;
                color: var(--text-dark);
            }
            
            .day.empty {
                background-color: var(--background);
                color: rgba(0,0,0,0.1);
            }
            
            .day.in-cycle {
                background-color: rgba(58, 123, 213, 0.1);
                font-weight: 500;
            }
            
            .day.today {
                background-color: rgba(240, 84, 84, 0.1);
                font-weight: bold;
                border: 2px solid var(--accent);
                z-index: 1;
            }
            
            .day.cycle-start {
                border-left: 3px solid var(--primary);
            }
            
            .day.cycle-start::before {
                content: 'Start';
                position: absolute;
                top: 2px;
                left: 2px;
                font-size: 0.6rem;
                color: var(--primary);
            }
            
            .day.cycle-end {
                border-right: 3px solid var(--primary);
            }
            
            .day.cycle-end::before {
                content: 'End';
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 0.6rem;
                color: var(--primary);
            }
        `;
        
        document.head.appendChild(styleEl);
    }
}

// Function to export the current view to CSV
function initExportCSV() {
    document.getElementById('export-csv-btn').addEventListener('click', function() {
        // Get visible cycles
        const tableBody = document.getElementById('airac-data');
        const rows = tableBody.querySelectorAll('tr');
        
        if (rows.length === 0) {
            showToast('No data to export', 'error');
            return;
        }
        
        // Create CSV content
        let csvContent = 'Cycle,Start Date,End Date,Year,Status\n';
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            // Skip the last cell (actions)
            const rowData = [
                cells[0].textContent,
                cells[1].textContent,
                cells[2].textContent,
                cells[3].textContent,
                cells[4].querySelector('.status').textContent
            ];
            csvContent += rowData.join(',') + '\n';
        });
        
        // Create download link
        const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'airac_cycles.csv');
        document.body.appendChild(link);
        
        // Trigger download and clean up
        link.click();
        document.body.removeChild(link);
        
        showToast('CSV file exported successfully', 'success');
    });
}

// Header action buttons functionality
function initHeaderActions() {
    // Print button
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });
    
    // Share button
    document.getElementById('share-btn').addEventListener('click', function() {
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'AIRAC Cycles Explorer',
                text: 'Check out this AIRAC Cycles Explorer',
                url: window.location.href
            })
            .then(() => showToast('Content shared successfully', 'success'))
            .catch(() => showToast('Share operation cancelled', 'error'));
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => showToast('URL copied to clipboard', 'success'))
                .catch(() => showToast('Failed to copy URL', 'error'));
        }
    });
    
    // Fullscreen button
    document.getElementById('fullscreen-btn').addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                showToast('Error entering fullscreen mode', 'error');
            });
            this.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                this.innerHTML = '<i class="fas fa-expand"></i>';
            }
        }
    });
    
    // Timeline navigation
    document.getElementById('timeline-prev').addEventListener('click', function() {
        const timeline = document.getElementById('timeline');
        timeline.scrollLeft -= 300;
    });
    
    document.getElementById('timeline-next').addEventListener('click', function() {
        const timeline = document.getElementById('timeline');
        timeline.scrollLeft += 300;
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after animation completes
    setTimeout(() => {
        toast.remove();
    }, 3300);
}

// Initialize tooltips
function initTooltips() {
    // Add tooltips to buttons and controls that might need explanation
    document.getElementById('theme-toggle-btn').setAttribute('data-tooltip', 'Toggle light/dark mode');
    document.getElementById('search-btn').setAttribute('data-tooltip', 'Search cycles');
    document.getElementById('refresh-btn').setAttribute('data-tooltip', 'Refresh data');
    document.getElementById('export-csv-btn').setAttribute('data-tooltip', 'Export as CSV file');
    document.getElementById('prev-page').setAttribute('data-tooltip', 'Previous page');
    document.getElementById('next-page').setAttribute('data-tooltip', 'Next page');
    document.getElementById('print-btn').setAttribute('data-tooltip', 'Print table');
    document.getElementById('share-btn').setAttribute('data-tooltip', 'Share this page');
    document.getElementById('fullscreen-btn').setAttribute('data-tooltip', 'Toggle fullscreen');
    document.getElementById('timeline-prev').setAttribute('data-tooltip', 'Previous cycles');
    document.getElementById('timeline-next').setAttribute('data-tooltip', 'Next cycles');
}

// Detect touch device
function detectTouchDevice() {
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) || 
                          (navigator.msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }
}

// Add touch swipe support for mobile devices
function initSwipeSupport() {
    const timeline = document.getElementById('timeline');
    const tableWrapper = document.querySelector('.table-wrapper');
    
    // Add swipe functionality to timeline
    addSwipeHandler(timeline, function(direction) {
        if (direction === 'left') {
            document.getElementById('timeline-next').click();
        } else if (direction === 'right') {
            document.getElementById('timeline-prev').click();
        }
    });
    
    // Add swipe functionality to table pagination
    addSwipeHandler(tableWrapper, function(direction) {
        if (direction === 'left') {
            document.getElementById('next-page').click();
        } else if (direction === 'right') {
            document.getElementById('prev-page').click();
        }
    });
}

// Generic swipe handler
function addSwipeHandler(element, callback) {
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    element.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    element.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        const distance = touchStartX - touchEndX;
        if (Math.abs(distance) < minSwipeDistance) return;
        
        if (distance > 0) {
            callback('left');
        } else {
            callback('right');
        }
    }
}

// Implement lazy loading for table data when scrolling
function initLazyLoading() {
    const tableWrapper = document.querySelector('.table-wrapper');
    let isLoading = false;
    
    tableWrapper.addEventListener('scroll', function() {
        const scrollPosition = tableWrapper.scrollTop + tableWrapper.clientHeight;
        const scrollHeight = tableWrapper.scrollHeight;
        
        // If we're close to the bottom and not currently loading
        if (scrollPosition > scrollHeight - 200 && !isLoading) {
            // Only implement lazy loading when viewing all cycles
            const yearSelect = document.getElementById('year-select');
            if (yearSelect.value === 'all') {
                isLoading = true;
                simulateLazyLoading();
            }
        }
    });
    
    function simulateLazyLoading() {
        // In a real app with a large dataset, this would load the next batch of data
        // For our demo, we'll just simulate the loading effect
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<div class="loading-spinner"></div><div>Loading more cycles...</div>';
        tableWrapper.appendChild(loadingIndicator);
        
        setTimeout(() => {
            tableWrapper.removeChild(loadingIndicator);
            isLoading = false;
        }, 1000);
    }
}

// First-time user guidance
function checkFirstVisit() {
    if (!localStorage.getItem('airacCyclesVisited')) {
        // Set flag to indicate user has visited before
        localStorage.setItem('airacCyclesVisited', 'true');
        
        // Show welcome message and start tour
        setTimeout(() => {
            showWelcomeMessage();
        }, 1000);
    }
}

function showWelcomeMessage() {
    const welcomeToast = document.createElement('div');
    welcomeToast.className = 'toast welcome-toast';
    welcomeToast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-hand-wave"></i></div>
        <div class="toast-message">
            <strong>Welcome to AIRAC Cycles Explorer!</strong><br>
            Would you like a quick tour of the features?
        </div>
        <div class="toast-actions">
            <button id="tour-start" class="btn btn-small">Yes, show me around</button>
            <button id="tour-skip" class="btn btn-small btn-secondary">No, thanks</button>
        </div>
    `;
    
    document.querySelector('.toast-container').appendChild(welcomeToast);
    
    // Handle tour actions
    document.getElementById('tour-start').addEventListener('click', function() {
        welcomeToast.remove();
        startGuidedTour();
    });
    
    document.getElementById('tour-skip').addEventListener('click', function() {
        welcomeToast.remove();
    });
    
    // Remove welcome toast after 30 seconds if user doesn't interact
    setTimeout(() => {
        if (document.contains(welcomeToast)) {
            welcomeToast.remove();
        }
    }, 30000);
}

function startGuidedTour() {
    const tourSteps = [
        {
            element: '.current-cycle-info',
            title: 'Current Cycle',
            message: 'This shows information about the current active AIRAC cycle.',
            position: 'bottom'
        },
        {
            element: '.card-grid',
            title: 'Cycle Statistics',
            message: 'Here you can view statistics about AIRAC cycles and their distribution.',
            position: 'bottom'
        },
        {
            element: '.timeline-container',
            title: 'Timeline',
            message: 'Navigate through cycles visually with this interactive timeline.',
            position: 'top'
        },
        {
            element: '.table-wrapper',
            title: 'Cycles Table',
            message: 'All AIRAC cycles are displayed here. Click on any cycle to view more details.',
            position: 'top'
        },
        {
            element: '#theme-toggle-btn',
            title: 'Theme Toggle',
            message: 'Switch between light and dark mode based on your preference.',
            position: 'left'
        },
        {
            element: '.shortcuts-list',
            title: 'Keyboard Shortcuts',
            message: 'Power users can navigate quickly using these keyboard shortcuts.',
            position: 'top'
        }
    ];
    
    let currentStep = 0;
    
    function showTourStep(step) {
        const targetElement = document.querySelector(tourSteps[step].element);
        if (!targetElement) return nextStep();
        
        // Add highlight to current element
        targetElement.classList.add('guide-highlight');
        
        // Create and show tooltip
        const tourTooltip = document.createElement('div');
        tourTooltip.className = 'tour-tooltip';
        tourTooltip.innerHTML = `
            <div class="tour-title">${tourSteps[step].title}</div>
            <div class="tour-message">${tourSteps[step].message}</div>
            <div class="tour-nav">
                <span class="tour-progress">${step + 1}/${tourSteps.length}</span>
                <div class="tour-buttons">
                    ${step > 0 ? '<button class="tour-prev btn btn-small">Previous</button>' : ''}
                    ${step < tourSteps.length - 1 ? 
                        '<button class="tour-next btn btn-small">Next</button>' : 
                        '<button class="tour-finish btn btn-small">Finish Tour</button>'}
                </div>
            </div>
        `;
        
        // Position tooltip
        const position = tourSteps[step].position;
        tourTooltip.classList.add(`tour-${position}`);
        document.body.appendChild(tourTooltip);
        
        // Position tooltip relative to target element
        const targetRect = targetElement.getBoundingClientRect();
        const tooltipRect = tourTooltip.getBoundingClientRect();
        
        let top, left;
        switch(position) {
            case 'top':
                top = targetRect.top - tooltipRect.height - 10;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'bottom':
                top = targetRect.bottom + 10;
                left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'left':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.left - tooltipRect.width - 10;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
                left = targetRect.right + 10;
                break;
        }
        
        // Ensure tooltip is within viewport
        top = Math.max(10, Math.min(window.innerHeight - tooltipRect.height - 10, top));
        left = Math.max(10, Math.min(window.innerWidth - tooltipRect.width - 10, left));
        
        tourTooltip.style.top = `${top}px`;
        tourTooltip.style.left = `${left}px`;
        
        // Scroll element into view if necessary
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Add event listeners
        const prevButton = tourTooltip.querySelector('.tour-prev');
        if (prevButton) {
            prevButton.addEventListener('click', prevStep);
        }
        
        const nextButton = tourTooltip.querySelector('.tour-next');
        if (nextButton) {
            nextButton.addEventListener('click', nextStep);
        }
        
        const finishButton = tourTooltip.querySelector('.tour-finish');
        if (finishButton) {
            finishButton.addEventListener('click', endTour);
        }
    }
    
    function nextStep() {
        removeTourStep();
        currentStep++;
        if (currentStep < tourSteps.length) {
            showTourStep(currentStep);
        } else {
            endTour();
        }
    }
    
    function prevStep() {
        removeTourStep();
        currentStep--;
        if (currentStep >= 0) {
            showTourStep(currentStep);
        } else {
            currentStep = 0;
            showTourStep(currentStep);
        }
    }
    
    function removeTourStep() {
        // Remove highlight from current element
        const currentElement = document.querySelector(tourSteps[currentStep].element);
        if (currentElement) {
            currentElement.classList.remove('guide-highlight');
        }
        
        // Remove current tooltip
        const currentTooltip = document.querySelector('.tour-tooltip');
        if (currentTooltip) {
            currentTooltip.remove();
        }
    }
    
    function endTour() {
        removeTourStep();
        showToast('Tour completed! Enjoy exploring AIRAC cycles.', 'success');
    }
    
    // Start the tour
    showTourStep(currentStep);
    
    // Allow escaping the tour with Escape key
    document.addEventListener('keydown', function tourEscape(e) {
        if (e.key === 'Escape') {
            endTour();
            document.removeEventListener('keydown', tourEscape);
        }
    });
}

// Add error handling and retries
function safeJSONParse(str, fallback) {
    try {
        return JSON.parse(str);
    } catch (e) {
        console.error('JSON parse error:', e);
        return fallback;
    }
}

// Add styles for the guided tour
function addGuidedTourStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .tour-tooltip {
            position: fixed;
            z-index: 9999;
            background-color: var(--primary-dark);
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            width: 300px;
            animation: fade-in 0.3s ease-out;
        }
        
        .tour-title {
            font-weight: bold;
            font-size: 1.1rem;
            margin-bottom: 8px;
        }
        
        .tour-message {
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .tour-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .tour-progress {
            font-size: 0.85rem;
            opacity: 0.8;
        }
        
        .tour-buttons {
            display: flex;
            gap: 10px;
        }
        
        .tour-tooltip::after {
            content: '';
            position: absolute;
            border-style: solid;
        }
        
        .tour-top::after {
            border-width: 10px 10px 0 10px;
            border-color: var(--primary-dark) transparent transparent transparent;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .tour-bottom::after {
            border-width: 0 10px 10px 10px;
            border-color: transparent transparent var(--primary-dark) transparent;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .tour-left::after {
            border-width: 10px 0 10px 10px;
            border-color: transparent transparent transparent var(--primary-dark);
            right: -10px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .tour-right::after {
            border-width: 10px 10px 10px 0;
            border-color: transparent var(--primary-dark) transparent transparent;
            left: -10px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .welcome-toast {
            width: 320px;
            padding: 15px;
        }
        
        .toast-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        
        .loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            width: 100%;
            font-size: 0.9rem;
            color: var(--text-dark);
            gap: 10px;
        }
        
        .loading-spinner {
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-light);
            border-top-color: var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(styleEl);
}

// Performance monitoring and optimization
function initPerformanceMonitoring() {
    // Monitor performance issues
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log any long tasks (> 50ms)
            if (entry.duration > 50) {
                console.warn('Long task detected:', entry);
            }
        }
    });
    
    try {
        perfObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
        console.warn('PerformanceObserver for long tasks not supported in this browser');
    }
}

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Function to initialize timeline scrolling features
function initTimelineScroll() {
    const timeline = document.getElementById('timeline');
    const timelineContainer = document.querySelector('.timeline-container');
    
    // Check if timeline is scrollable
    function checkTimelineScroll() {
        if (timeline.scrollWidth > timeline.clientWidth) {
            timelineContainer.classList.add('timeline-scrollable');
        } else {
            timelineContainer.classList.remove('timeline-scrollable');
        }
    }
    
    // Initial check
    setTimeout(checkTimelineScroll, 500);
    
    // Check on window resize
    window.addEventListener('resize', checkTimelineScroll);
    
    // Enhance scroll buttons
    document.getElementById('timeline-prev').addEventListener('click', function() {
        timeline.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    document.getElementById('timeline-next').addEventListener('click', function() {
        timeline.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Add enhanced sorting functionality for the table
function initTableSorting() {
    const tableHeaders = document.querySelectorAll('#airac-table th:not(.actions-col)');
    
    tableHeaders.forEach((header, index) => {
        // Add sorting indicators and cursor pointer
        header.style.cursor = 'pointer';
        header.setAttribute('data-tooltip', 'Click to sort');
        
        // Create and append sorting indicator
        const sortIndicator = document.createElement('span');
        sortIndicator.className = 'sort-indicator';
        sortIndicator.innerHTML = '<i class="fas fa-sort"></i>';
        header.appendChild(sortIndicator);
        
        // Add click event for sorting
        header.addEventListener('click', () => {
            const isAscending = header.getAttribute('data-sort') !== 'asc';
            
            // Reset all headers
            tableHeaders.forEach(th => {
                th.removeAttribute('data-sort');
                th.querySelector('.sort-indicator').innerHTML = '<i class="fas fa-sort"></i>';
            });
            
            // Set current header sorting state
            header.setAttribute('data-sort', isAscending ? 'asc' : 'desc');
            header.querySelector('.sort-indicator').innerHTML = isAscending 
                ? '<i class="fas fa-sort-up"></i>' 
                : '<i class="fas fa-sort-down"></i>';
            
            sortTable(index, isAscending);
        });
    });
}

// Sort table data based on column index and direction
function sortTable(columnIndex, ascending) {
    const table = document.getElementById('airac-table');
    const tbody = document.getElementById('airac-data');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Show loading state
    table.classList.add('loading');
    showToast('Sorting data...', 'info');
    
    // Sort after a small delay to allow the UI to update
    setTimeout(() => {
        const sortedRows = rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            // Special handling for dates
            if (columnIndex === 1 || columnIndex === 2) {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);
                return ascending ? aDate - bDate : bDate - aDate;
            }
            
            // Default string comparison
            return ascending 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        });
        
        // Clear and add sorted rows
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));
        
        // Highlight current cycle if displayed
        const currentCycle = document.querySelector('.current-cycle');
        if (currentCycle) {
            currentCycle.scrollIntoView({ behavior: 'smooth', block: 'center' });
            currentCycle.classList.add('highlight-pulse');
            setTimeout(() => {
                currentCycle.classList.remove('highlight-pulse');
            }, 3000);
        }
        
        // Remove loading state
        table.classList.remove('loading');
        showToast('Table sorted', 'success');
    }, 300);
}

// Enhanced search with better feedback and highlighting
function enhanceSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-search');
    
    // Add search suggestions
    const suggestions = ['2025', '2026', 'January', 'December', 'active', 'upcoming'];
    const datalist = document.createElement('datalist');
    datalist.id = 'search-suggestions';
    
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
    
    document.body.appendChild(datalist);
    searchInput.setAttribute('list', 'search-suggestions');
    
    // Enhanced search function
    const enhancedSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            resetSearch();
            return;
        }
        
        showToast('Searching...', 'info');
        
        // Add search animation
        document.querySelector('.table-container').classList.add('loading');
        
        setTimeout(() => {
            const filteredCycles = window.airacCycles.filter(cycle => 
                cycle.cycle.toLowerCase().includes(searchTerm) ||
                cycle.startDate.toLowerCase().includes(searchTerm) ||
                cycle.endDate.toLowerCase().includes(searchTerm) ||
                cycle.year.toString().includes(searchTerm)
            );
            
            // Update UI with results
            currentPage = 1;
            updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
            displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
            
            const resultsContainer = document.getElementById('no-results');
            if (filteredCycles.length === 0) {
                resultsContainer.classList.remove('hidden');
                
                // Add enhanced no results message
                resultsContainer.innerHTML = `
                    <i class="fas fa-search"></i>
                    <p>No cycles found matching <strong>"${searchTerm}"</strong></p>
                    <p class="search-suggestion">Try different keywords or check your spelling</p>
                    <button id="reset-search" class="btn"><i class="fas fa-times"></i> Clear Search</button>
                `;
                
                // Re-attach event listener to the new button
                document.getElementById('reset-search').addEventListener('click', resetSearch);
            } else {
                resultsContainer.classList.add('hidden');
                showToast(`Found ${filteredCycles.length} matching cycles`, 'success');
                
                // Highlight search terms in results
                highlightSearchTerms(searchTerm);
            }
            
            document.querySelector('.table-container').classList.remove('loading');
        }, 500);
    };
    
    // Function to reset search
    const resetSearch = () => {
        searchInput.value = '';
        document.getElementById('year-select').value = 'all';
        filteredCycles = airacCycles;
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        document.getElementById('no-results').classList.add('hidden');
    };
    
    // Update event listeners
    searchBtn.addEventListener('click', enhancedSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            enhancedSearch();
        }
    });
    
    // Add a clear button inside the search input
    const searchContainer = searchInput.parentElement;
    const clearBtn = document.createElement('button');
    clearBtn.className = 'search-clear-btn';
    clearBtn.innerHTML = '<i class="fas fa-times"></i>';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.addEventListener('click', resetSearch);
    searchContainer.appendChild(clearBtn);
}

// Function to highlight search terms in table results
function highlightSearchTerms(searchTerm) {
    const tableBody = document.getElementById('airac-data');
    const cells = tableBody.querySelectorAll('td:not(:last-child)');
    
    cells.forEach(cell => {
        const text = cell.textContent;
        if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
            const regex = new RegExp('(' + searchTerm + ')', 'gi');
            cell.innerHTML = text.replace(regex, '<mark>$1</mark>');
        }
    });
}

// Add back to top button
function addBackToTopButton() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    button.setAttribute('data-tooltip', 'Back to top');
    document.body.appendChild(button);
    
    // Show button only when scrolled down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Create a welcome guide for new users
function createWelcomeGuide() {
    // Only show if user hasn't seen it before
    if (localStorage.getItem('airacWelcomeShown')) {
        return;
    }
    
    // Mark as shown
    localStorage.setItem('airacWelcomeShown', 'true');
    
    const steps = [
        {
            element: '.search-bar',
            title: 'Search Cycles',
            message: 'Search for cycles by number, date, or year'
        },
        {
            element: '.timeline-container',
            title: 'Timeline View',
            message: 'View and navigate through AIRAC cycles in a visual timeline'
        },
        {
            element: '#airac-table',
            title: 'Cycles Table',
            message: 'View details of all cycles and click on any row to see more information'
        },
        {
            element: '.stats-card',
            title: 'Cycle Statistics',
            message: 'See statistics about past, current, and upcoming cycles'
        }
    ];
    
    let currentStep = 0;
    
    function showGuideStep() {
        const step = steps[currentStep];
        const element = document.querySelector(step.element);
        
        if (!element) {
            nextStep();
            return;
        }
        
        // Create guide element
        const guide = document.createElement('div');
        guide.className = 'welcome-guide';
        guide.innerHTML = `
            <div class="guide-header">
                <h3>${step.title}</h3>
                <button class="guide-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="guide-content">
                <p>${step.message}</p>
            </div>
            <div class="guide-footer">
                <span class="guide-progress">${currentStep + 1}/${steps.length}</span>
                <div class="guide-buttons">
                    ${currentStep > 0 ? '<button class="btn btn-small guide-prev">Previous</button>' : ''}
                    <button class="btn btn-small guide-next">${currentStep < steps.length - 1 ? 'Next' : 'Finish'}</button>
                </div>
            </div>
        `;
        
        // Position guide
        document.body.appendChild(guide);
        positionGuide(guide, element);
        
        // Highlight target element
        element.classList.add('guide-highlight');
        
        // Add event listeners
        guide.querySelector('.guide-close').addEventListener('click', closeGuide);
        
        if (currentStep > 0) {
            guide.querySelector('.guide-prev').addEventListener('click', prevStep);
        }
        
        guide.querySelector('.guide-next').addEventListener('click', nextStep);
    }
    
    function positionGuide(guide, element) {
        const rect = element.getBoundingClientRect();
        const guideRect = guide.getBoundingClientRect();
        
        // Position the guide under the element by default
        let top = rect.bottom + 10;
        let left = rect.left + (rect.width / 2) - (guideRect.width / 2);
        
        // Make sure the guide stays in the viewport
        if (top + guideRect.height > window.innerHeight) {
            top = rect.top - guideRect.height - 10;
        }
        
        if (left < 10) left = 10;
        if (left + guideRect.width > window.innerWidth - 10) {
            left = window.innerWidth - guideRect.width - 10;
        }
        
        guide.style.top = `${top + window.scrollY}px`;
        guide.style.left = `${left}px`;
        
        // Scroll to ensure element is in view
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    function nextStep() {
        // Remove current guide
        removeCurrentGuide();
        
        // Move to next step
        currentStep++;
        if (currentStep < steps.length) {
            showGuideStep();
        } else {
            showToast('Welcome to AIRAC Cycles Explorer! Enjoy exploring.', 'success');
        }
    }
    
    function prevStep() {
        // Remove current guide
        removeCurrentGuide();
        
        // Move to previous step
        currentStep--;
        if (currentStep >= 0) {
            showGuideStep();
        }
    }
    
    function removeCurrentGuide() {
        // Remove current guide element
        const guide = document.querySelector('.welcome-guide');
        if (guide) {
            guide.remove();
        }
        
        // Remove highlight
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight');
        });
    }
    
    function closeGuide() {
        removeCurrentGuide();
        showToast('You can restart the guide from Settings', 'info');
    }
    
    // Start the guide after a short delay
    setTimeout(showGuideStep, 1500);
}

// Add settings menu
function addSettingsMenu() {
    // Create settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
    settingsBtn.setAttribute('aria-label', 'Settings');
    settingsBtn.setAttribute('data-tooltip', 'Settings');
    document.body.appendChild(settingsBtn);
    
    // Create settings panel
    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-header">
            <h3><i class="fas fa-cog"></i> Settings</h3>
            <button class="settings-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="settings-content">
            <div class="settings-group">
                <label class="settings-label">Font Size</label>
                <div class="settings-controls">
                    <button class="btn btn-small font-size-btn" data-size="small">Small</button>
                    <button class="btn btn-small font-size-btn active" data-size="medium">Medium</button>
                    <button class="btn btn-small font-size-btn" data-size="large">Large</button>
                </div>
            </div>
            <div class="settings-group">
                <label class="settings-label">Reset First-time Guide</label>
                <button id="reset-guide" class="btn btn-small">Show Welcome Guide</button>
            </div>
            <div class="settings-group">
                <label class="settings-label">Table Display</label>
                <select id="items-per-page">
                    <option value="10">10 items per page</option>
                    <option value="20" selected>20 items per page</option>
                    <option value="50">50 items per page</option>
                    <option value="100">100 items per page</option>
                </select>
            </div>
        </div>
    `;
    document.body.appendChild(settingsPanel);
    
    // Toggle settings panel
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });
    
    // Close settings panel
    settingsPanel.querySelector('.settings-close').addEventListener('click', () => {
        settingsPanel.classList.remove('active');
    });
    
    // Font size buttons
    const fontSizeBtns = settingsPanel.querySelectorAll('.font-size-btn');
    fontSizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            fontSizeBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Apply font size
            const size = btn.getAttribute('data-size');
            document.documentElement.setAttribute('data-font-size', size);
            
            // Save preference
            localStorage.setItem('airacFontSize', size);
            
            showToast(`Font size set to ${size}`, 'success');
        });
    });
    
    // Reset welcome guide
    document.getElementById('reset-guide').addEventListener('click', () => {
        localStorage.removeItem('airacWelcomeShown');
        settingsPanel.classList.remove('active');
        createWelcomeGuide();
    });
    
    // Items per page setting
    const itemsPerPageSelect = document.getElementById('items-per-page');
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        localStorage.setItem('airacItemsPerPage', itemsPerPage);
        
        // Refresh table
        currentPage = 1;
        updatePageInfo(currentPage, Math.ceil(filteredCycles.length / itemsPerPage));
        displayAiracCycles(getPaginatedItems(filteredCycles, currentPage, itemsPerPage), currentCycle);
        
        showToast(`Now showing ${itemsPerPage} items per page`, 'success');
    });
    
    // Load saved preferences
    const savedFontSize = localStorage.getItem('airacFontSize');
    if (savedFontSize) {
        document.documentElement.setAttribute('data-font-size', savedFontSize);
        fontSizeBtns.forEach(btn => {
            if (btn.getAttribute('data-size') === savedFontSize) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    const savedItemsPerPage = localStorage.getItem('airacItemsPerPage');
    if (savedItemsPerPage) {
        itemsPerPage = parseInt(savedItemsPerPage);
        itemsPerPageSelect.value = savedItemsPerPage;
    }
}

/**
 * Enhance the UI with animations and visual effects
 */
function addAnimations() {
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        /* Table row hover effect */
        .cycles-table tbody tr {
            transition: background 0.2s, transform 0.2s;
        }
        .cycles-table tbody tr:hover {
            background: var(--hover-color);
            transform: translateX(5px);
        }
        
        /* Button hover effects */
        .btn {
            transition: all 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .btn:active {
            transform: translateY(0);
        }
        
        /* Timeline item effects */
        .timeline-item {
            transition: all 0.3s;
        }
        .timeline-item:hover {
            transform: scale(1.05);
            z-index: 2;
        }
        
        /* Page transitions */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .cycles-table tbody tr {
            animation: fadeIn 0.3s ease-out forwards;
        }
        .cycles-table tbody tr:nth-child(2n) {
            animation-delay: 0.05s;
        }
        .cycles-table tbody tr:nth-child(3n) {
            animation-delay: 0.1s;
        }
        
        /* Modal animations */
        .modal {
            transition: opacity 0.3s, visibility 0.3s;
        }
        .modal-content {
            transition: transform 0.3s;
            transform: scale(0.9);
        }
        .modal.show .modal-content {
            transform: scale(1);
        }
        
        /* Loading state */
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        .loading {
            animation: pulse 1.5s infinite;
        }
        
        /* Input focus effects */
        input, select {
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        input:focus, select:focus {
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(var(--accent-color-rgb), 0.2);
            outline: none;
        }
    `;
    document.head.appendChild(style);
    
    // Add loading indicator
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(var(--bg-color-rgb), 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        .loading-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(var(--accent-color-rgb), 0.3);
            border-radius: 50%;
            border-top-color: var(--accent-color);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(loadingStyles);
    
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    // Show loading on navigation
    const showLoading = () => {
        loadingOverlay.classList.add('show');
        setTimeout(() => {
            loadingOverlay.classList.remove('show');
        }, 800); // Hide after a reasonable time to simulate loading
    };
    
    // Add loading effect to pagination
    document.getElementById('prev-page').addEventListener('click', showLoading);
    document.getElementById('next-page').addEventListener('click', showLoading);
    
    // Add loading to year filter
    document.getElementById('year-filter').addEventListener('change', showLoading);
}

/**
 * Improve accessibility features
 */
function improveAccessibility() {
    // Add ARIA labels to elements
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.getAttribute('aria-label') && btn.textContent.trim()) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
    
    // Add skip to content link for keyboard users
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content area
    const mainContent = document.querySelector('.container') || document.querySelector('main');
    if (mainContent) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
    
    // Add aria-current to current page
    const currentPageBtn = document.querySelector('.current-page');
    if (currentPageBtn) {
        currentPageBtn.setAttribute('aria-current', 'page');
    }
    
    // Add CSS for accessibility
    const style = document.createElement('style');
    style.textContent = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--accent-color);
            color: white;
            padding: 8px;
            z-index: 100;
            transition: top 0.3s;
        }
        .skip-link:focus {
            top: 0;
        }
        
        /* Focus styles */
        a:focus, button:focus, input:focus, select:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        /* Increase contrast for text */
        .dark-mode {
            --text-color: #ffffff;
            --text-secondary: #cccccc;
        }
        
        /* Ensure sufficient text size */
        body {
            font-size: var(--base-font-size, 16px);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add mobile optimizations
 */
function addMobileOptimizations() {
    // Add responsive design CSS
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            /* Table optimizations */
            .cycles-table {
                display: block;
                overflow-x: auto;
            }
            .cycles-table th, .cycles-table td {
                padding: 8px 5px;
            }
            
            /* Hide less important columns on small screens */
            .cycles-table th:nth-child(4), 
            .cycles-table td:nth-child(4) {
                display: none;
            }
            
            /* Pagination controls */
            .pagination-controls {
                flex-direction: column;
                gap: 10px;
            }
            
            /* Current cycle box */
            .current-cycle-box {
                flex-direction: column;
            }
            
            /* Shrink the timeline */
            .timeline-container {
                padding: 10px 0;
            }
            .timeline-item {
                margin: 0 5px;
                padding: 5px;
                min-width: 100px;
            }
            
            /* Settings panel full width */
            .settings-panel {
                width: calc(100% - 40px);
                right: 10px;
                left: 10px;
            }
            
            /* Adjust modal width */
            .modal-content {
                width: 95%;
                margin: 20px auto;
            }
            
            /* Calendar view in cycle details */
            .calendar-grid {
                grid-template-columns: repeat(7, 1fr);
                font-size: 12px;
            }
            
            /* Stack buttons in welcome modal */
            .welcome-actions {
                flex-direction: column;
                gap: 10px;
            }
        }
        
        /* Add viewport meta tag for proper mobile scaling */
        @media (max-width: 480px) {
            .cycles-table th, .cycles-table td {
                font-size: 14px;
            }
            
            /* Hide year column on very small screens */
            .cycles-table th:nth-child(2), 
            .cycles-table td:nth-child(2) {
                display: none;
            }
            
            /* Adjust timeline further */
            .timeline-item {
                min-width: 80px;
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add viewport meta tag if not present
    if (!document.querySelector('meta[name="viewport"]')) {
        const metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(metaViewport);
    }
    
    // Add touch-friendly enhancements
    document.querySelectorAll('button, .timeline-item').forEach(elem => {
        elem.style.minHeight = '44px'; // Minimum touch target size
    });
}

// Initialize enhanced UX features
function initEnhancedUX() {
    initTableSorting();
    enhanceSearch();
    addBackToTopButton();
    addKeyboardShortcuts();
    createWelcomeGuide();
    addSettingsMenu();
    addCycleDetailStyles();
} 