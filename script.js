// Bus Management Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Check authentication
    checkAuthentication();
    
    // Initialize the dashboard
    initializeDashboard();

    // Add event listeners
    addEventListeners();

    // Initialize user dropdown
    initializeUserDropdown();

    // Initialize notification dropdown
    initializeNotificationDropdown();

    // Initialize add bus functionality
    initializeAddBus();

    // Simulate real-time updates
    startRealTimeUpdates();
});

// Check if user is authenticated
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // Redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in sidebar
    updateUserInfo();
}

// Update user info in sidebar
function updateUserInfo() {
    const loginType = localStorage.getItem('loginType');
    const userIdentifier = localStorage.getItem('userIdentifier');
    
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    
    if (userNameElement && userRoleElement) {
        if (loginType === 'admin') {
            userNameElement.textContent = userIdentifier || 'Admin';
            userRoleElement.textContent = 'Administrator';
        } else {
            userNameElement.textContent = userIdentifier || 'User';
            userRoleElement.textContent = 'Student';
        }
    }
}

function initializeDashboard() {
    console.log('Pragati Tracker Dashboard initialized');

    // Add loading animation to cards
    const cards = document.querySelectorAll('.bus-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Initialize dashboard search
    initializeDashboardSearch();
    
    // Initialize filter pills
    initializeFilterPills();
}

// Dashboard Search Functionality
function initializeDashboardSearch() {
    const searchInput = document.getElementById('dashboard-search');
    const searchClear = document.getElementById('dashboard-search-clear');
    
    if (!searchInput) return;
    
    // Search input event
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchTerm) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }
        
        // Filter bus cards
        filterDashboardBuses(searchTerm);
    });
    
    // Clear button event
    searchClear.addEventListener('click', function() {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filterDashboardBuses('');
        searchInput.focus();
    });
    
    // Clear on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchClear.style.display = 'none';
            filterDashboardBuses('');
        }
    });
}

// Filter dashboard buses based on search term
function filterDashboardBuses(searchTerm) {
    const busCards = document.querySelectorAll('.bus-card');
    let visibleCount = 0;
    
    busCards.forEach(card => {
        // Get searchable data from attributes and elements
        const busNumber = (card.dataset.busNumber || card.querySelector('.bus-title h3')?.textContent || '').toLowerCase();
        const route = (card.dataset.route || card.querySelector('.route-text')?.textContent || '').toLowerCase();
        const driver = (card.dataset.driver || card.querySelector('.driver-label')?.textContent || '').toLowerCase();
        const status = (card.dataset.status || card.querySelector('.status-badge')?.textContent || '').toLowerCase();
        const eta = card.querySelector('.eta-label')?.textContent.toLowerCase() || '';
        const students = card.querySelector('.students-info')?.textContent.toLowerCase() || '';
        
        // Check if search term matches any field
        const matches = busNumber.includes(searchTerm) || 
                       route.includes(searchTerm) || 
                       driver.includes(searchTerm) ||
                       status.includes(searchTerm) ||
                       eta.includes(searchTerm) ||
                       students.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    showDashboardSearchResults(visibleCount, searchTerm);
}

// Show search results message
function showDashboardSearchResults(count, searchTerm) {
    const dashboardGrid = document.getElementById('dashboard-content');
    let noResultsMsg = document.getElementById('dashboard-no-results');
    
    if (count === 0 && searchTerm) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'dashboard-no-results';
            noResultsMsg.className = 'dashboard-no-results';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No buses found</h3>
                    <p>Try searching with different keywords like bus number, route, or driver name.</p>
                </div>
            `;
            dashboardGrid.appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'flex';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// Initialize Filter Pills
function initializeFilterPills() {
    const filterPills = document.querySelectorAll('.filter-pill');
    
    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Remove active class from all pills
            filterPills.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked pill
            this.classList.add('active');
            
            // Get filter value
            const filter = this.dataset.filter;
            
            // Apply filter
            applyDashboardFilter(filter);
        });
    });
}

// Apply dashboard filter
function applyDashboardFilter(filter) {
    const busCards = document.querySelectorAll('.bus-card');
    let visibleCount = 0;
    
    busCards.forEach(card => {
        const status = card.dataset.status;
        const isFavorite = card.dataset.favorite === 'true';
        
        let shouldShow = false;
        
        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'on-time':
                shouldShow = status === 'on-time';
                break;
            case 'delayed':
                shouldShow = status === 'delayed';
                break;
            case 'early':
                shouldShow = status === 'early';
                break;
            case 'favorites':
                shouldShow = isFavorite;
                break;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show notification
    const filterName = filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ');
    if (filter !== 'all') {
        showNotification(`Showing ${visibleCount} ${filterName} buses`, 'info');
    }
}

function addEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', toggleFavorite);
    });

    // Track buttons
    const trackButtons = document.querySelectorAll('.track-btn');
    trackButtons.forEach(button => {
        button.addEventListener('click', trackBus);
    });

    // Logout button
    const logoutButton = document.querySelector('.logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Add hover effects to cards
    const busCards = document.querySelectorAll('.bus-card');
    busCards.forEach(card => {
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardLeave);
    });
}

function handleNavigation(event) {
    event.preventDefault();
    console.log('Navigation clicked');

    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to clicked item
    const navItem = event.target.closest('.nav-item');
    if (navItem) {
        navItem.classList.add('active');
    }

    // Update page title based on navigation
    const navText = event.target.textContent.trim();
    console.log('Navigation text:', navText);

    const headerElement = document.querySelector('.content-header h1');
    if (headerElement) {
        headerElement.textContent = navText;
    }

    // Show/hide content based on navigation
    showContent(navText);

    // Add a subtle animation
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '0.7';
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 150);
    }
}

function showContent(section) {
    console.log('Showing content for:', section);

    // Hide all content sections
    const dashboardContent = document.getElementById('dashboard-content');
    const routesContent = document.getElementById('routes-content');
    const busPassContent = document.getElementById('bus-pass-content');
    const filterPills = document.getElementById('filter-pills');
    const searchContainer = document.querySelector('.dashboard-search-container');

    if (!dashboardContent || !routesContent) {
        console.error('Content sections not found!');
        return;
    }

    dashboardContent.style.display = 'none';
    routesContent.style.display = 'none';
    if (busPassContent) {
        busPassContent.style.display = 'none';
    }

    // Show selected content
    switch (section) {
        case 'Dashboard':
            dashboardContent.style.display = 'grid';
            // Show filter pills and search for dashboard
            if (filterPills) filterPills.style.display = 'flex';
            if (searchContainer) searchContainer.style.display = 'flex';
            console.log('Dashboard content shown');
            break;
        case 'Routes':
            routesContent.style.display = 'flex';
            // Hide filter pills and search for routes
            if (filterPills) filterPills.style.display = 'none';
            if (searchContainer) searchContainer.style.display = 'none';
            console.log('Routes content shown');
            // Initialize map if not already done
            if (!window.mapInitialized) {
                console.log('Initializing map...');
                setTimeout(() => {
                    if (typeof google !== 'undefined' && google.maps) {
                        initializeGoogleMap();
                    } else {
                        console.log('Google Maps not loaded yet, showing fallback');
                        showMapFallback();
                    }
                }, 500);
            } else {
                console.log('Map already initialized');
            }
            break;

        case 'Bus Pass':
            const busPassContent = document.getElementById('bus-pass-content');
            if (busPassContent) {
                busPassContent.style.display = 'block';
                // Hide filter pills and search for bus pass
                if (filterPills) filterPills.style.display = 'none';
                if (searchContainer) searchContainer.style.display = 'none';
                console.log('Bus Pass content shown');
                // Initialize bus pass data if not already done
                if (!window.busPassInitialized) {
                    initializeBusPassData();
                    window.busPassInitialized = true;
                }
            }
            break;

        default:
            dashboardContent.style.display = 'grid';
            // Show filter pills and search by default
            if (filterPills) filterPills.style.display = 'flex';
            if (searchContainer) searchContainer.style.display = 'flex';
    }
}

function toggleFavorite(event) {
    event.preventDefault();
    const button = event.target.closest('.favorite-btn');
    const icon = button.querySelector('i');

    // Toggle between filled and empty star
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Removed from favorites', 'info');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Added to favorites', 'success');
    }

    // Add animation
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

function trackBus(event) {
    event.preventDefault();
    const button = event.target.closest('.track-btn');
    const card = button.closest('.bus-card');
    
    // Get bus information from card
    const busNumber = card.querySelector('.bus-title h3')?.textContent || 'Bus';
    const routeText = card.querySelector('.route-text')?.textContent || '';
    const busId = card.dataset.busNumber || '1';
    
    // Show modal with map
    showTrackModal(busNumber, routeText, busId);
}

// Show track modal with map
function showTrackModal(busNumber, routeText, busId) {
    const modal = document.getElementById('track-modal');
    const modalTitle = document.getElementById('track-modal-title');
    const mapContainer = document.getElementById('track-map');
    
    console.log('showTrackModal called', { busNumber, routeText, busId });
    
    if (!modal) {
        console.error('Track modal not found');
        return;
    }
    
    console.log('Modal found, showing...');
    
    // Set modal title
    modalTitle.innerHTML = `<i class="fas fa-bus"></i> ${busNumber} - ${routeText.replace('Route: ', '')}`;
    
    // Show modal with flex display for centering
    modal.style.setProperty('display', 'flex', 'important');
    modal.classList.add('show');
    
    console.log('Modal display set to:', modal.style.display);
    console.log('Modal classes:', modal.className);
    
    // Initialize map after modal is visible
    setTimeout(() => {
        console.log('Initializing map for bus', busId);
        initTrackMap(busId);
    }, 100);
    
    showNotification(`Tracking ${busNumber}`, 'success');
}

// Initialize track map
let trackMapInstance = null;
let trackMarkers = [];
let trackPolyline = null;

function initTrackMap(busId) {
    console.log('initTrackMap called for bus:', busId);
    
    const mapContainer = document.getElementById('track-map');
    
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }
    
    console.log('Map container found:', mapContainer);
    
    // Check if Google Maps is loaded
    if (typeof google === 'undefined' || !google.maps) {
        console.error('Google Maps not loaded');
        showNotification('Map loading error. Please refresh the page.', 'error');
        return;
    }
    
    console.log('Google Maps is loaded');
    
    // College location
    const collegeLocation = { lat: 17.083056007230727, lng: 82.05445438182011 };
    
    // Bus locations data
    const busLocations = {
        '1': { lat: 17.0005, lng: 81.8040, name: 'Rajahmundry', color: '#667eea' },
        '3': { lat: 16.9891, lng: 82.2711, name: 'Kakinada', color: '#dc2626' },
        '4': { lat: 17.1167, lng: 82.2500, name: 'Pithapuram', color: '#16a34a' },
        '8': { lat: 17.0833, lng: 82.1333, name: 'Peddapuram', color: '#fbbf24' },
        '90': { lat: 17.0500, lng: 82.1667, name: 'Samalkot', color: '#8b5cf6' },
        '12': { lat: 16.5833, lng: 82.0167, name: 'Amalapuram', color: '#f59e0b' },
        '15': { lat: 16.8667, lng: 81.9333, name: 'Mandapeta', color: '#06b6d4' },
        '22': { lat: 17.3500, lng: 82.5500, name: 'Tuni', color: '#ef4444' },
        '25': { lat: 16.7333, lng: 82.2167, name: 'Yanam', color: '#10b981' },
        '30': { lat: 16.8333, lng: 82.3000, name: 'Ramachandrapuram', color: '#f97316' },
        '35': { lat: 16.7833, lng: 81.8833, name: 'Kotananduru', color: '#ec4899' },
        '40': { lat: 17.0833, lng: 82.3500, name: 'Uppada', color: '#14b8a6' }
    };
    
    const busLocation = busLocations[busId] || busLocations['1'];
    
    // Create or update map
    if (!trackMapInstance) {
        trackMapInstance = new google.maps.Map(mapContainer, {
            zoom: 10,
            center: collegeLocation,
            mapTypeId: 'roadmap'
        });
    }
    
    // Clear existing markers and polyline
    trackMarkers.forEach(marker => marker.setMap(null));
    trackMarkers = [];
    if (trackPolyline) {
        trackPolyline.setMap(null);
    }
    
    // Add college marker
    const collegeMarker = new google.maps.Marker({
        position: collegeLocation,
        map: trackMapInstance,
        title: 'Pragati Engineering College',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#fbbf24',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        },
        label: {
            text: '🏫',
            fontSize: '20px'
        },
        zIndex: 1000
    });
    
    // Add bus marker
    const busMarker = new google.maps.Marker({
        position: { lat: busLocation.lat, lng: busLocation.lng },
        map: trackMapInstance,
        title: `Bus ${busId} - ${busLocation.name}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: busLocation.color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
        },
        label: {
            text: busId.toString(),
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 'bold'
        },
        animation: google.maps.Animation.BOUNCE,
        zIndex: 500
    });
    
    // Stop bouncing after 2 seconds
    setTimeout(() => {
        busMarker.setAnimation(null);
    }, 2000);
    
    // Add route line
    trackPolyline = new google.maps.Polyline({
        path: [
            { lat: busLocation.lat, lng: busLocation.lng },
            collegeLocation
        ],
        geodesic: true,
        strokeColor: busLocation.color,
        strokeOpacity: 0.7,
        strokeWeight: 4,
        map: trackMapInstance
    });
    
    trackMarkers.push(collegeMarker, busMarker);
    
    // Fit bounds to show both markers
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(collegeLocation);
    bounds.extend({ lat: busLocation.lat, lng: busLocation.lng });
    trackMapInstance.fitBounds(bounds);
    
    // Add info windows
    const collegeInfo = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: Inter, sans-serif;">
                <h4 style="margin: 0 0 6px 0; color: #0f172a;">🏫 Pragati Engineering College</h4>
                <p style="margin: 0; color: #64748b; font-size: 12px;">Destination</p>
            </div>
        `
    });
    
    const busInfo = new google.maps.InfoWindow({
        content: `
            <div style="padding: 10px; font-family: Inter, sans-serif;">
                <h4 style="margin: 0 0 6px 0; color: #0f172a;">🚌 Bus ${busId}</h4>
                <p style="margin: 4px 0; color: #64748b; font-size: 12px;"><strong>From:</strong> ${busLocation.name}</p>
                <p style="margin: 4px 0; color: #64748b; font-size: 12px;"><strong>To:</strong> College</p>
            </div>
        `
    });
    
    collegeMarker.addListener('click', () => {
        collegeInfo.open(trackMapInstance, collegeMarker);
    });
    
    busMarker.addListener('click', () => {
        busInfo.open(trackMapInstance, busMarker);
    });
    
    // Auto-open bus info
    setTimeout(() => {
        busInfo.open(trackMapInstance, busMarker);
    }, 500);
}

// Close modal
function closeTrackModal() {
    const modal = document.getElementById('track-modal');
    if (!modal) return;
    
    // Hide modal
    modal.style.display = 'none';
    modal.classList.remove('show');
    
    console.log('Modal closed');
}

// Add event listeners for modal
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.getElementById('track-modal-close');
    const modal = document.getElementById('track-modal');
    
    console.log('Setting up modal event listeners');
    
    // Ensure modal is hidden on page load
    if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        console.log('Modal hidden on page load');
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Close button clicked');
            closeTrackModal();
        });
    }
    
    if (modal) {
        // Close when clicking on overlay (outside modal content)
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                console.log('Overlay clicked');
                closeTrackModal();
            }
        });
    }
    
    // Close on ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('track-modal');
            if (modal && (modal.style.display === 'flex' || modal.classList.contains('show'))) {
                console.log('ESC key pressed');
                closeTrackModal();
            }
        }
    });
});

function navigateToRoutes(busNumber) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to routes nav item
    const allNavLinks = document.querySelectorAll('.nav-link');
    allNavLinks.forEach(link => {
        if (link.textContent.trim().includes('Routes')) {
            link.closest('.nav-item').classList.add('active');
        }
    });

    // Update page title
    const headerElement = document.querySelector('.content-header h1');
    if (headerElement) {
        headerElement.textContent = 'Routes';
    }

    // Show routes content
    showContent('Routes');

    // Focus on the specific bus after a short delay to ensure map is loaded
    setTimeout(() => {
        focusOnSpecificBus(busNumber);
    }, 1500);
}

function focusOnSpecificBus(busNumber) {
    console.log(`Focusing on Bus ${busNumber}`);

    // Focus on bus in the map if available
    if (typeof focusOnBus === 'function') {
        focusOnBus(busNumber);
    }

    // Highlight the bus in the panel
    document.querySelectorAll('.bus-item').forEach(item => {
        item.classList.remove('highlighted');
    });

    const busItem = document.querySelector(`[data-bus="${busNumber}"]`);
    if (busItem) {
        busItem.classList.add('highlighted');

        // Scroll to the bus item smoothly
        busItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });

        // Add a pulse animation
        busItem.style.animation = 'pulse 2s ease-in-out';
        setTimeout(() => {
            busItem.style.animation = '';
        }, 2000);
    }

    // Show additional notification
    setTimeout(() => {
        showNotification(`Bus ${busNumber} located and highlighted`, 'success');
    }, 500);
}

function handleCardHover(event) {
    const card = event.target.closest('.bus-card');
    const trackBtn = card.querySelector('.track-btn');

    // Add subtle glow effect
    trackBtn.style.boxShadow = '0 6px 20px rgba(251, 191, 36, 0.4)';
}

function handleCardLeave(event) {
    const card = event.target.closest('.bus-card');
    const trackBtn = card.querySelector('.track-btn');

    // Remove glow effect
    trackBtn.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
}

function startRealTimeUpdates() {
    // Simulate real-time status updates
    setInterval(() => {
        updateBusStatuses();
    }, 30000); // Update every 30 seconds
}

function updateBusStatuses() {
    const statusElements = document.querySelectorAll('.status');
    const statuses = ['on-time', 'delayed', 'early'];
    const statusTexts = ['On-time', 'Delayed', 'Early'];

    statusElements.forEach(statusEl => {
        // Randomly update some statuses (20% chance)
        if (Math.random() < 0.2) {
            const randomIndex = Math.floor(Math.random() * statuses.length);
            const newStatus = statuses[randomIndex];
            const newText = statusTexts[randomIndex];

            // Remove old status classes
            statusEl.className = 'status';
            // Add new status class
            statusEl.classList.add(newStatus);
            statusEl.textContent = newText;

            // Add update animation
            statusEl.style.transform = 'scale(1.1)';
            setTimeout(() => {
                statusEl.style.transform = 'scale(1)';
            }, 300);
        }
    });
}

function handleLogout(event) {
    event.preventDefault();

    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Add loading state
        const button = event.target.closest('.logout-btn');
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        button.disabled = true;

        // Simulate logout process
        setTimeout(() => {
            showNotification('Logged out successfully', 'success');

            // Clear authentication data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginType');
            localStorage.removeItem('userIdentifier');
            localStorage.removeItem('loginTime');

            // Fade out the entire app
            const appContainer = document.querySelector('.app-container');
            appContainer.style.transition = 'opacity 0.5s ease';
            appContainer.style.opacity = '0';

            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        }, 1000);
    }
}



// Add some interactive features
document.addEventListener('keydown', function (event) {
    // Add keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case '1':
                event.preventDefault();
                document.querySelector('.nav-link').click();
                break;
            case 'f':
                event.preventDefault();
                document.querySelectorAll('.nav-link')[1].click();
                break;
        }
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Google Maps Integration
let map;
let busMarkers = [];
let routePolylines = [];
window.mapInitialized = false;

// Simple global initMap function for Google Maps API callback
window.initMap = function () {
    console.log('Google Maps API loaded, initializing map...');
    initializeGoogleMap();
};

// Bus locations and routes data - All routes to Surampalem with different colors
const busData = {
    1: {
        name: 'Bus 1',
        driver: 'Ramesh Babu',
        route: 'Rajahmundry → Surampalem',
        currentLocation: { lat: 17.0005, lng: 81.8040 }, // Rajahmundry
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 45,
        status: 'online',
        color: '#667eea' // Blue
    },
    3: {
        name: 'Bus 3',
        driver: 'Srinivas Reddy',
        route: 'Kakinada → Surampalem',
        currentLocation: { lat: 16.9891, lng: 82.2711 }, // Kakinada
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 38,
        status: 'delayed',
        color: '#dc2626' // Red
    },
    4: {
        name: 'Bus 4',
        driver: 'Venkata Rao',
        route: 'Pithapuram → Surampalem',
        currentLocation: { lat: 17.1167, lng: 82.2500 }, // Pithapuram
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 52,
        status: 'online',
        color: '#16a34a' // Green
    },
    8: {
        name: 'Bus 8',
        driver: 'Prasad Raju',
        route: 'Peddapuram → Surampalem',
        currentLocation: { lat: 17.0833, lng: 82.1333 }, // Peddapuram
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 41,
        status: 'early',
        color: '#fbbf24' // Yellow
    },
    90: {
        name: 'Bus 90',
        driver: 'Kiran Kumar',
        route: 'Samalkot → Surampalem',
        currentLocation: { lat: 17.0500, lng: 82.1667 }, // Samalkot
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 47,
        status: 'online',
        color: '#8b5cf6' // Purple
    },
    12: {
        name: 'Bus 12',
        driver: 'Suresh Babu',
        route: 'Amalapuram → Surampalem',
        currentLocation: { lat: 16.5833, lng: 82.0167 }, // Amalapuram
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 43,
        status: 'early',
        color: '#f59e0b' // Orange
    },
    15: {
        name: 'Bus 15',
        driver: 'Ravi Teja',
        route: 'Mandapeta → Surampalem',
        currentLocation: { lat: 16.8667, lng: 81.9333 }, // Mandapeta
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 39,
        status: 'online',
        color: '#06b6d4' // Cyan
    },
    22: {
        name: 'Bus 22',
        driver: 'Mahesh Kumar',
        route: 'Tuni → Surampalem',
        currentLocation: { lat: 17.3500, lng: 82.5500 }, // Tuni
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 35,
        status: 'delayed',
        color: '#ef4444' // Bright Red
    },
    25: {
        name: 'Bus 25',
        driver: 'Naresh Reddy',
        route: 'Yanam → Surampalem',
        currentLocation: { lat: 16.7333, lng: 82.2167 }, // Yanam
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 48,
        status: 'online',
        color: '#10b981' // Emerald
    },
    30: {
        name: 'Bus 30',
        driver: 'Vijay Krishna',
        route: 'Ramachandrapuram → Surampalem',
        currentLocation: { lat: 16.8333, lng: 82.3000 }, // Ramachandrapuram
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 44,
        status: 'early',
        color: '#f97316' // Deep Orange
    },
    35: {
        name: 'Bus 35',
        driver: 'Srinivas Rao',
        route: 'Kotananduru → Surampalem',
        currentLocation: { lat: 16.7833, lng: 81.8833 }, // Kotananduru
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 32,
        status: 'delayed',
        color: '#ec4899' // Pink
    },
    40: {
        name: 'Bus 40',
        driver: 'Rajesh Kumar',
        route: 'Uppada → Surampalem',
        currentLocation: { lat: 17.0833, lng: 82.3500 }, // Uppada
        destination: { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        speed: 41,
        status: 'online',
        color: '#14b8a6' // Teal
    }
};

// Direct map initialization function
function initializeMapDirectly() {
    console.log('Direct map initialization started');

    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        console.log('Google Maps not loaded, showing fallback');
        showMapFallback();
    }
}

// Initialize Google Map
function initializeGoogleMap() {
    console.log('initializeGoogleMap called, mapInitialized:', window.mapInitialized);
    if (window.mapInitialized) return;

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map element not found!');
        return;
    }

    // Center map on Surampalem (Pragati Engineering College - correct location)
    const collegeLocation = { lat: 17.083056007230727, lng: 82.05445438182011 };

    try {
        // Create map
        map = new google.maps.Map(mapElement, {
            zoom: 10,
            center: collegeLocation,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'geometry.fill',
                    stylers: [{ color: '#f8fafc' }]
                },
                {
                    featureType: 'water',
                    elementType: 'geometry',
                    stylers: [{ color: '#dbeafe' }]
                },
                {
                    featureType: 'road',
                    elementType: 'geometry',
                    stylers: [{ color: '#ffffff' }]
                }
            ]
        });

        console.log('Google Map created successfully');
    } catch (error) {
        console.error('Error creating Google Map:', error);
        showMapFallback();
        return;
    }

    // Add Surampalem (Pragati Engineering College) marker - Main destination
    const collegeMarker = new google.maps.Marker({
        position: collegeLocation,
        map: map,
        title: 'Pragati Engineering College, Surampalem',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <circle cx="25" cy="25" r="22" fill="#fbbf24" stroke="#f59e0b" stroke-width="3" filter="url(#glow)"/>
                    <circle cx="25" cy="25" r="24" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.3"/>
                    <text x="25" y="32" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">🏫</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(50, 50),
            anchor: new google.maps.Point(25, 25)
        },
        zIndex: 1000
    });
    
    console.log('College marker added at:', collegeLocation);

    // Add info window for college
    const collegeInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 8px; font-family: Inter, sans-serif;">
                <h4 style="margin: 0 0 8px 0; color: #0f172a;">Pragati Engineering College</h4>
                <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>Location:</strong> Surampalem, East Godavari</p>
                <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>All Bus Routes:</strong> Destination Point</p>
                <div style="margin-top: 8px;">
                    <span style="padding: 4px 8px; background: #fbbf24; color: white; border-radius: 12px; font-size: 12px;">Main Campus</span>
                </div>
            </div>
        `
    });

    collegeMarker.addListener('click', () => {
        collegeInfoWindow.open(map, collegeMarker);
    });

    // Add Aditya Engineering College marker (nearby reference)
    const adityaLocation = { lat: 17.0195, lng: 82.2275 }; // Slightly offset from Pragati, near highway 15
    const adityaMarker = new google.maps.Marker({
        position: adityaLocation,
        map: map,
        title: 'Aditya Engineering College, Surampalem',
        icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="17.5" cy="17.5" r="15" fill="#94a3b8" stroke="#64748b" stroke-width="2"/>
                    <text x="17.5" y="22" text-anchor="middle" fill="white" font-family="Arial" font-size="10" font-weight="bold">🏫</text>
                </svg>
            `),
            scaledSize: new google.maps.Size(35, 35)
        }
    });

    const adityaInfoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 8px; font-family: Inter, sans-serif;">
                <h4 style="margin: 0 0 8px 0; color: #0f172a;">Aditya Engineering College</h4>
                <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>Location:</strong> Surampalem, East Godavari</p>
                <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>Note:</strong> Reference location</p>
                <div style="margin-top: 8px;">
                    <span style="padding: 4px 8px; background: #94a3b8; color: white; border-radius: 12px; font-size: 12px;">Reference Point</span>
                </div>
            </div>
        `
    });

    adityaMarker.addListener('click', () => {
        adityaInfoWindow.open(map, adityaMarker);
    });

    // Add bus markers and routes
    console.log('Adding bus markers to map...');
    console.log('Bus data:', busData);
    
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(collegeLocation);
    
    Object.keys(busData).forEach(busId => {
        console.log(`Adding Bus ${busId} to map`);
        addBusToMap(busId, busData[busId]);
        bounds.extend(busData[busId].currentLocation);
    });
    
    console.log(`Total ${Object.keys(busData).length} buses added to map`);
    
    // Fit map to show all markers
    map.fitBounds(bounds);
    
    // Adjust zoom after fitting bounds
    setTimeout(() => {
        const currentZoom = map.getZoom();
        if (currentZoom > 10) {
            map.setZoom(10);
        }
    }, 1000);

    // Add event listeners for map controls
    document.getElementById('refresh-map').addEventListener('click', refreshMap);
    document.getElementById('fullscreen-map').addEventListener('click', toggleFullscreen);

    // Initialize search functionality
    initializeMapSearch();

    // Add bus item click handlers
    document.querySelectorAll('.bus-item').forEach(item => {
        item.addEventListener('click', function () {
            const busId = this.dataset.bus;
            focusOnBus(busId);
        });
    });

    window.mapInitialized = true;

    // Start real-time updates
    startBusTracking();
}

function addBusToMap(busId, busInfo) {
    // Use bus-specific color
    const busColor = busInfo.color || '#667eea';
    
    console.log(`Creating marker for Bus ${busId} at`, busInfo.currentLocation, 'with color', busColor);
    
    // Create simple, visible bus marker
    const busMarker = new google.maps.Marker({
        position: busInfo.currentLocation,
        map: map,
        title: `${busInfo.name} - ${busInfo.driver}`,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: busColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3
        },
        label: {
            text: busId.toString(),
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 'bold'
        },
        animation: google.maps.Animation.DROP,
        zIndex: 100
    });
    
    console.log(`Bus ${busId} marker created successfully`);

    // Create enhanced info window with route color
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 12px; font-family: Inter, sans-serif; min-width: 200px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <div style="width: 40px; height: 40px; background: ${busColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${busId}</div>
                    <div>
                        <h4 style="margin: 0; color: #0f172a; font-size: 16px;">${busInfo.name}</h4>
                        <p style="margin: 2px 0 0 0; color: #64748b; font-size: 12px;">${busInfo.driver}</p>
                    </div>
                </div>
                <div style="border-top: 1px solid #e2e8f0; padding-top: 8px;">
                    <p style="margin: 4px 0; color: #64748b; font-size: 13px;"><strong>📍 Route:</strong> ${busInfo.route}</p>
                    <p style="margin: 4px 0; color: #64748b; font-size: 13px;"><strong>⚡ Speed:</strong> ${busInfo.speed} km/h</p>
                    <div style="margin-top: 10px;">
                        <span style="padding: 4px 10px; background: ${getStatusColor(busInfo.status)}; color: white; border-radius: 12px; font-size: 11px; text-transform: uppercase; font-weight: 600;">${busInfo.status}</span>
                    </div>
                </div>
            </div>
        `
    });

    // Add click listener to marker with bounce animation
    busMarker.addListener('click', () => {
        // Close all other info windows
        busMarkers.forEach(marker => {
            if (marker.infoWindow) {
                marker.infoWindow.close();
            }
            marker.setAnimation(null);
        });
        
        // Bounce animation
        busMarker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
            busMarker.setAnimation(null);
        }, 2100);
        
        infoWindow.open(map, busMarker);
    });

    // Store marker with info window
    busMarker.infoWindow = infoWindow;
    busMarkers.push(busMarker);

    // Draw colored route line
    const routeLine = new google.maps.Polyline({
        path: [busInfo.currentLocation, busInfo.destination],
        geodesic: true,
        strokeColor: busColor,
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: map,
        icons: [{
            icon: {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                scale: 4,
                fillColor: busColor,
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            },
            offset: '50%',
            repeat: '100px'
        }]
    });
    
    console.log(`Route line created for Bus ${busId} from`, busInfo.currentLocation, 'to', busInfo.destination);

    // Add route line hover effect
    google.maps.event.addListener(routeLine, 'mouseover', function() {
        routeLine.setOptions({
            strokeWeight: 7,
            strokeOpacity: 1
        });
    });

    google.maps.event.addListener(routeLine, 'mouseout', function() {
        routeLine.setOptions({
            strokeWeight: 5,
            strokeOpacity: 0.8
        });
    });

    routePolylines.push(routeLine);
    
    console.log(`Bus ${busId} fully added to map with route`);
}

function getStatusColor(status) {
    switch (status) {
        case 'online': return '#16a34a';
        case 'delayed': return '#dc2626';
        case 'early': return '#ca8a04';
        default: return '#64748b';
    }
}

function focusOnBus(busId) {
    const busInfo = busData[busId];
    if (busInfo && map) {
        map.setCenter(busInfo.currentLocation);
        map.setZoom(12);

        // Find and click the corresponding marker
        const markerIndex = Object.keys(busData).indexOf(busId);
        if (busMarkers[markerIndex]) {
            google.maps.event.trigger(busMarkers[markerIndex], 'click');
        }

        // Highlight the bus item
        document.querySelectorAll('.bus-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        document.querySelector(`[data-bus="${busId}"]`).classList.add('highlighted');
    }
}

function refreshMap() {
    const refreshBtn = document.getElementById('refresh-map');
    const originalIcon = refreshBtn.innerHTML;

    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    refreshBtn.disabled = true;

    // Simulate refresh
    setTimeout(() => {
        // Update bus positions (simulate movement)
        Object.keys(busData).forEach((busId, index) => {
            const bus = busData[busId];
            // Simulate small movement
            bus.currentLocation.lat += (Math.random() - 0.5) * 0.01;
            bus.currentLocation.lng += (Math.random() - 0.5) * 0.01;

            // Update marker position
            if (busMarkers[index]) {
                busMarkers[index].setPosition(bus.currentLocation);
            }
        });

        refreshBtn.innerHTML = originalIcon;
        refreshBtn.disabled = false;
        showNotification('Map refreshed successfully', 'success');
    }, 1500);
}

function toggleFullscreen() {
    const mapContainer = document.querySelector('.map-container');

    if (!document.fullscreenElement) {
        mapContainer.requestFullscreen().then(() => {
            document.getElementById('fullscreen-map').innerHTML = '<i class="fas fa-compress"></i>';
        });
    } else {
        document.exitFullscreen().then(() => {
            document.getElementById('fullscreen-map').innerHTML = '<i class="fas fa-expand"></i>';
        });
    }
}

function startBusTracking() {
    // Update bus positions every 10 seconds
    setInterval(() => {
        if (window.mapInitialized && document.getElementById('routes-content').style.display !== 'none') {
            Object.keys(busData).forEach((busId, index) => {
                const bus = busData[busId];

                // Simulate realistic movement towards destination
                const lat_diff = bus.destination.lat - bus.currentLocation.lat;
                const lng_diff = bus.destination.lng - bus.currentLocation.lng;

                // Move 1% closer to destination each update
                bus.currentLocation.lat += lat_diff * 0.01;
                bus.currentLocation.lng += lng_diff * 0.01;

                // Update speed randomly
                bus.speed = Math.max(20, Math.min(60, bus.speed + (Math.random() - 0.5) * 10));

                // Update marker position
                if (busMarkers[index]) {
                    busMarkers[index].setPosition(bus.currentLocation);
                }

                // Update UI
                updateBusInfoPanel(busId, bus);
            });
        }
    }, 10000);
}

function updateBusInfoPanel(busId, busInfo) {
    const busItem = document.querySelector(`[data-bus="${busId}"]`);
    if (busItem) {
        const speedElement = busItem.querySelector('.speed');
        const distanceElement = busItem.querySelector('.distance');

        if (speedElement) {
            speedElement.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${Math.round(busInfo.speed)} km/h`;
        }

        // Calculate approximate distance (simplified)
        const distance = Math.random() * 20 + 5; // Simulate distance calculation
        if (distanceElement) {
            distanceElement.innerHTML = `<i class="fas fa-road"></i> ${distance.toFixed(1)} km`;
        }
    }
}

// Show map fallback when Google Maps is not available
function showMapFallback() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    mapElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; padding: 2rem;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem; color: #667eea;"></i>
                <h3 style="margin: 0 0 0.5rem 0; color: #0f172a;">Loading Google Maps...</h3>
                <p style="margin: 0; color: #64748b;">Please wait while we initialize the live tracking system.</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; width: 100%; max-width: 400px;">
                <div style="background: linear-gradient(135deg, #667eea20, #764ba220); padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                    <div style="color: #667eea; font-weight: bold; margin-bottom: 0.25rem;">🚌 Bus 1</div>
                    <div style="font-size: 0.8rem; color: #64748b;">Rajahmundry Route</div>
                </div>
                <div style="background: linear-gradient(135deg, #667eea20, #764ba220); padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                    <div style="color: #667eea; font-weight: bold; margin-bottom: 0.25rem;">🚌 Bus 3</div>
                    <div style="font-size: 0.8rem; color: #64748b;">Kakinada Route</div>
                </div>
                <div style="background: linear-gradient(135deg, #667eea20, #764ba220); padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                    <div style="color: #667eea; font-weight: bold; margin-bottom: 0.25rem;">🚌 Bus 4</div>
                    <div style="font-size: 0.8rem; color: #64748b;">Pithapuram Route</div>
                </div>
                <div style="background: linear-gradient(135deg, #667eea20, #764ba220); padding: 1rem; border-radius: 12px; text-align: center; border: 1px solid #e2e8f0;">
                    <div style="color: #667eea; font-weight: bold; margin-bottom: 0.25rem;">🚌 Bus 8</div>
                    <div style="font-size: 0.8rem; color: #64748b;">Peddapuram Route</div>
                </div>
            </div>
            
            <div style="margin-top: 2rem; text-align: center;">
                <button onclick="location.reload()" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    <i class="fas fa-refresh" style="margin-right: 0.5rem;"></i>Refresh Map
                </button>
            </div>
        </div>
    `;

    // Add event listeners for demo mode
    setTimeout(() => {
        const refreshBtn = document.getElementById('refresh-map');
        const fullscreenBtn = document.getElementById('fullscreen-map');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                showNotification('Map refresh simulated', 'info');
            });
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                showNotification('Fullscreen mode - Demo', 'info');
            });
        }

        // Initialize search even in fallback mode
        initializeMapSearch();

        // Add bus item click handlers
        document.querySelectorAll('.bus-item').forEach(item => {
            item.addEventListener('click', function () {
                const busId = this.dataset.bus;
                showNotification(`Focusing on Bus ${busId} (Demo Mode)`, 'info');

                // Highlight the bus item
                document.querySelectorAll('.bus-item').forEach(i => i.classList.remove('highlighted'));
                this.classList.add('highlighted');
            });
        });
    }, 100);
}

// Map Search Functionality
function initializeMapSearch() {
    const searchInput = document.getElementById('map-search');
    const clearBtn = document.getElementById('clear-search');
    const suggestions = document.getElementById('search-suggestions');

    if (!searchInput) return;

    // Search input event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);

    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }

    // Suggestion items
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.addEventListener('mousedown', function (e) {
            e.preventDefault(); // Prevent blur event
            selectLocation(this.dataset.location, this.textContent.trim());
        });
    });
}

function handleSearchInput(event) {
    const value = event.target.value;
    const clearBtn = document.getElementById('clear-search');

    if (value.length > 0) {
        clearBtn.style.display = 'block';
        filterSuggestions(value);
    } else {
        clearBtn.style.display = 'none';
        showAllSuggestions();
    }
}

function showSearchSuggestions() {
    const suggestions = document.getElementById('search-suggestions');
    if (suggestions) {
        suggestions.style.display = 'block';
    }
}

function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('search-suggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }, 200);
}

function clearSearch() {
    const searchInput = document.getElementById('map-search');
    const clearBtn = document.getElementById('clear-search');

    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }

    showAllSuggestions();

    // Reset map to default view
    if (map) {
        map.setCenter({ lat: 16.9891, lng: 82.2711 });
        map.setZoom(10);
    }
}

function filterSuggestions(query) {
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    const lowerQuery = query.toLowerCase();

    suggestionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerQuery)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function showAllSuggestions() {
    const suggestionItems = document.querySelectorAll('.suggestion-item');
    suggestionItems.forEach(item => {
        item.style.display = 'flex';
    });
}

function selectLocation(location, displayName) {
    const searchInput = document.getElementById('map-search');
    const suggestions = document.getElementById('search-suggestions');

    if (searchInput) {
        searchInput.value = displayName;
    }
    if (suggestions) {
        suggestions.style.display = 'none';
    }

    // Location coordinates - All routes leading to Surampalem
    const locations = {
        'rajahmundry': { lat: 17.0005, lng: 81.8040 },
        'kakinada': { lat: 16.9891, lng: 82.2711 },
        'pithapuram': { lat: 17.1167, lng: 82.2500 },
        'peddapuram': { lat: 17.0833, lng: 82.1333 },
        'samalkot': { lat: 17.0500, lng: 82.1667 },
        'college': { lat: 17.083056007230727, lng: 82.05445438182011 }, // Pragati Engineering College
        'surampalem': { lat: 17.083056007230727, lng: 82.05445438182011 }
    };

    const coords = locations[location];
    if (coords && map) {
        map.setCenter(coords);
        map.setZoom(12);

        // Show notification
        showNotification(`Showing ${displayName} on map`, 'success');

        // Highlight related bus if any
        highlightRelatedBus(location);
    }
}

function highlightRelatedBus(location) {
    // Map locations to bus routes
    const locationToBus = {
        'rajahmundry': '1',
        'kakinada': '3',
        'pithapuram': '4',
        'peddapuram': '8',
        'samalkot': '90',
        'college': null // All buses go to college
    };

    const busId = locationToBus[location];
    if (busId) {
        // Highlight the bus in the panel
        document.querySelectorAll('.bus-item').forEach(item => {
            item.classList.remove('highlighted');
        });

        const busItem = document.querySelector(`[data-bus="${busId}"]`);
        if (busItem) {
            busItem.classList.add('highlighted');

            // Scroll to the bus item
            busItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
}

// Additional debugging for map loading
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, checking Google Maps availability');

    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
        console.log('Google Maps already available');
    } else {
        console.log('Google Maps not yet loaded, waiting for callback');
    }

    // Add a timeout to check if maps failed to load
    setTimeout(() => {
        if (typeof google === 'undefined') {
            console.error('Google Maps failed to load after 10 seconds');
            const mapElement = document.getElementById('map');
            if (mapElement) {
                mapElement.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #dc2626; background: #fee2e2; border-radius: 8px; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h3 style="margin: 0 0 0.5rem 0;">Maps Failed to Load</h3>
                        <p style="margin: 0; text-align: center;">Please check your internet connection<br>and refresh the page.</p>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 6px; cursor: pointer;">Refresh Page</button>
                    </div>
                `;
            }
        }
    }, 10000);
});

// Ensure routes section works properly
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, setting up routes functionality');

    // Test if routes content exists
    const routesContent = document.getElementById('routes-content');
    if (routesContent) {
        console.log('Routes content found');
    } else {
        console.error('Routes content not found!');
    }

    // Add additional click handler for routes navigation
    setTimeout(() => {
        const routesNavLink = document.querySelector('a[href="#"]:has(span:contains("Routes"))');
        if (!routesNavLink) {
            // Fallback selector
            const allNavLinks = document.querySelectorAll('.nav-link');
            allNavLinks.forEach(link => {
                if (link.textContent.trim().includes('Routes')) {
                    link.addEventListener('click', function (e) {
                        console.log('Routes link clicked via fallback');
                        e.preventDefault();
                        showContent('Routes');
                    });
                }
            });
        }
    }, 500);
});

// Bus Pass Management System
let busPassData = [];
let editingRowId = null;

// Initialize Bus Pass Data
function initializeBusPassData() {
    console.log('Initializing Bus Pass data...');
    
    // Load data from localStorage or create sample data
    const savedData = localStorage.getItem('busPassData');
    if (savedData) {
        busPassData = JSON.parse(savedData);
    } else {
        // Create sample data
        busPassData = [
            {
                id: 1,
                rollNo: '24A31A0501',
                name: 'Rajesh Kumar',
                branch: 'CSE',
                section: 'A',
                feeStatus: 'paid',
                busNo: 1
            },
            {
                id: 2,
                rollNo: '24A31A0502',
                name: 'Priya Sharma',
                branch: 'ECE',
                section: 'B',
                feeStatus: 'pending',
                busNo: 3
            },
            {
                id: 3,
                rollNo: '24A31A0503',
                name: 'Arjun Reddy',
                branch: 'EEE',
                section: 'A',
                feeStatus: 'overdue',
                busNo: 4
            },
            {
                id: 4,
                rollNo: '24A31A0504',
                name: 'Sneha Patel',
                branch: 'MECH',
                section: 'C',
                feeStatus: 'paid',
                busNo: 8
            },
            {
                id: 5,
                rollNo: '24A31A0505',
                name: 'Vikram Singh',
                branch: 'CIVIL',
                section: 'D',
                feeStatus: 'pending',
                busNo: 90
            },
            {
                id: 6,
                rollNo: '24A31A0506',
                name: 'Lakshmi Devi',
                branch: 'IT',
                section: 'E',
                feeStatus: 'paid',
                busNo: 12
            },
            {
                id: 7,
                rollNo: '24A31A0507',
                name: 'Karthik Reddy',
                branch: 'CSE',
                section: 'F',
                feeStatus: 'paid',
                busNo: 15
            }
        ];
        saveBusPassData();
    }
    
    renderBusPassTable();
    addBusPassEventListeners();
}

// Save data to localStorage
function saveBusPassData() {
    localStorage.setItem('busPassData', JSON.stringify(busPassData));
}

// Render the bus pass table
function renderBusPassTable() {
    const tbody = document.getElementById('bus-pass-tbody');
    if (!tbody) return;
    
    if (busPassData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h4>No Students Found</h4>
                    <p>Click "Add Student" to add your first bus pass entry.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = busPassData.map(student => `
        <tr data-id="${student.id}" ${editingRowId === student.id ? 'class="editing"' : ''}>
            <td>
                ${editingRowId === student.id ? 
                    `<input type="text" class="editable-input roll-number-input" value="${student.rollNo}" data-field="rollNo" placeholder="Enter roll number" maxlength="20">` :
                    `<span class="roll-number">${student.rollNo}</span>`
                }
            </td>
            <td>
                ${editingRowId === student.id ? 
                    `<input type="text" class="editable-input" value="${student.name}" data-field="name" placeholder="Enter name">` :
                    student.name
                }
            </td>
            <td>
                ${editingRowId === student.id ? 
                    `<select class="editable-select" data-field="branch">
                        <option value="CSE" ${student.branch === 'CSE' ? 'selected' : ''}>CSE</option>
                        <option value="ECE" ${student.branch === 'ECE' ? 'selected' : ''}>ECE</option>
                        <option value="EEE" ${student.branch === 'EEE' ? 'selected' : ''}>EEE</option>
                        <option value="MECH" ${student.branch === 'MECH' ? 'selected' : ''}>MECH</option>
                        <option value="CIVIL" ${student.branch === 'CIVIL' ? 'selected' : ''}>CIVIL</option>
                        <option value="IT" ${student.branch === 'IT' ? 'selected' : ''}>IT</option>
                    </select>` :
                    student.branch
                }
            </td>
            <td>
                ${editingRowId === student.id ? 
                    `<select class="editable-select" data-field="section">
                        <option value="A" ${student.section === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${student.section === 'B' ? 'selected' : ''}>B</option>
                        <option value="C" ${student.section === 'C' ? 'selected' : ''}>C</option>
                        <option value="D" ${student.section === 'D' ? 'selected' : ''}>D</option>
                        <option value="E" ${student.section === 'E' ? 'selected' : ''}>E</option>
                        <option value="F" ${student.section === 'F' ? 'selected' : ''}>F</option>
                    </select>` :
                    student.section
                }
            </td>
            <td>
                ${editingRowId === student.id ? 
                    `<select class="editable-select" data-field="feeStatus">
                        <option value="paid" ${student.feeStatus === 'paid' ? 'selected' : ''}>Paid</option>
                        <option value="pending" ${student.feeStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="overdue" ${student.feeStatus === 'overdue' ? 'selected' : ''}>Overdue</option>
                    </select>` :
                    `<span class="status-badge ${student.feeStatus}">
                        <i class="fas fa-${getStatusIcon(student.feeStatus)}"></i>
                        ${student.feeStatus.charAt(0).toUpperCase() + student.feeStatus.slice(1)}
                    </span>`
                }
            </td>
            <td>
                ${editingRowId === student.id ? 
                    `<input type="number" class="editable-input bus-number-cell" value="${student.busNo}" data-field="busNo" min="1" max="999">` :
                    `<span class="bus-number-cell">${student.busNo}</span>`
                }
            </td>
            <td>
                <div class="action-buttons">
                    ${editingRowId === student.id ? 
                        `<button class="action-btn save-btn" onclick="saveStudent(${student.id})">
                            <i class="fas fa-save"></i> Save
                        </button>
                        <button class="action-btn edit-btn" onclick="cancelEdit()">
                            <i class="fas fa-times"></i> Cancel
                        </button>` :
                        `<button class="action-btn edit-btn" onclick="editStudent(${student.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteStudent(${student.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>`
                    }
                </div>
            </td>
        </tr>
    `).join('');
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'paid': return 'check-circle';
        case 'pending': return 'clock';
        case 'overdue': return 'exclamation-triangle';
        default: return 'question-circle';
    }
}

// Add event listeners for Bus Pass functionality
function addBusPassEventListeners() {
    const addStudentBtn = document.getElementById('add-student-btn');
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', addNewStudent);
    }
    
    // Initialize bus pass search
    initializeBusPassSearch();
}

// Bus Pass Search Functionality
function initializeBusPassSearch() {
    const searchInput = document.getElementById('bus-pass-search');
    const searchClear = document.getElementById('bus-pass-search-clear');
    
    if (!searchInput) return;
    
    // Search input event
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Show/hide clear button
        if (searchTerm) {
            searchClear.style.display = 'flex';
        } else {
            searchClear.style.display = 'none';
        }
        
        // Filter table rows
        filterBusPassTable(searchTerm);
    });
    
    // Clear button event
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            searchClear.style.display = 'none';
            filterBusPassTable('');
            searchInput.focus();
        });
    }
    
    // Clear on Escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchClear.style.display = 'none';
            filterBusPassTable('');
        }
    });
}

// Filter bus pass table based on search term
function filterBusPassTable(searchTerm) {
    const tbody = document.getElementById('bus-pass-tbody');
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        // Skip the "no students" row
        if (row.querySelector('.no-students-message')) {
            return;
        }
        
        // Get all searchable text from the row
        const rollNo = row.querySelector('.roll-number')?.textContent.toLowerCase() || 
                      row.querySelector('input[data-field="rollNo"]')?.value.toLowerCase() || '';
        const name = row.cells[1]?.textContent.toLowerCase() || '';
        const branch = row.cells[2]?.textContent.toLowerCase() || '';
        const section = row.cells[3]?.textContent.toLowerCase() || '';
        const feeStatus = row.cells[4]?.textContent.toLowerCase() || '';
        const busNo = row.cells[5]?.textContent.toLowerCase() || '';
        
        // Check if search term matches any field
        const matches = rollNo.includes(searchTerm) || 
                       name.includes(searchTerm) || 
                       branch.includes(searchTerm) ||
                       section.includes(searchTerm) ||
                       feeStatus.includes(searchTerm) ||
                       busNo.includes(searchTerm);
        
        if (matches || searchTerm === '') {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show "no results" message if needed
    showBusPassSearchResults(visibleCount, searchTerm);
}

// Show search results message for bus pass
function showBusPassSearchResults(count, searchTerm) {
    const tbody = document.getElementById('bus-pass-tbody');
    if (!tbody) return;
    
    let noResultsRow = tbody.querySelector('.no-search-results');
    
    if (count === 0 && searchTerm) {
        if (!noResultsRow) {
            noResultsRow = document.createElement('tr');
            noResultsRow.className = 'no-search-results';
            noResultsRow.innerHTML = `
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #cbd5e1; margin-bottom: 16px;"></i>
                    <h4 style="color: #64748b; margin: 0 0 8px 0;">No Results Found</h4>
                    <p style="color: #94a3b8; margin: 0;">No students match "${searchTerm}"</p>
                </td>
            `;
            tbody.appendChild(noResultsRow);
        }
    } else {
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }
}

// Add new student
function addNewStudent() {
    const newId = Math.max(...busPassData.map(s => s.id), 0) + 1;
    const newRollNo = generateRollNumber();
    
    const newStudent = {
        id: newId,
        rollNo: newRollNo,
        name: '',
        branch: 'CSE',
        section: 'A',
        feeStatus: 'pending',
        busNo: 1
    };
    
    busPassData.unshift(newStudent);
    editingRowId = newId;
    renderBusPassTable();
    saveBusPassData();
    
    // Focus on the name input
    setTimeout(() => {
        const nameInput = document.querySelector(`tr[data-id="${newId}"] input[data-field="name"]`);
        if (nameInput) {
            nameInput.focus();
        }
    }, 100);
    
    showNotification('New student added. Please fill in the details.', 'info');
}

// Generate roll number (simple sequential format)
function generateRollNumber() {
    const year = new Date().getFullYear().toString().slice(-2);
    const existingNumbers = busPassData
        .map(s => s.rollNo)
        .map(roll => {
            // Try to extract number from roll number
            const match = roll.match(/\d+$/);
            return match ? parseInt(match[0]) : 0;
        })
        .filter(num => !isNaN(num) && num > 0);
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${year}STUD${nextNumber.toString().padStart(3, '0')}`;
}

// Edit student
function editStudent(id) {
    if (editingRowId !== null) {
        showNotification('Please save or cancel the current edit first.', 'info');
        return;
    }
    
    editingRowId = id;
    renderBusPassTable();
    
    // Focus on the first editable field
    setTimeout(() => {
        const firstInput = document.querySelector(`tr[data-id="${id}"] .editable-input, tr[data-id="${id}"] .editable-select`);
        if (firstInput) {
            firstInput.focus();
        }
    }, 100);
}

// Save student
function saveStudent(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) return;
    
    const studentIndex = busPassData.findIndex(s => s.id === id);
    if (studentIndex === -1) return;
    
    // Get values from inputs
    const rollNoInput = row.querySelector('input[data-field="rollNo"]');
    const nameInput = row.querySelector('input[data-field="name"]');
    const branchSelect = row.querySelector('select[data-field="branch"]');
    const sectionSelect = row.querySelector('select[data-field="section"]');
    const feeStatusSelect = row.querySelector('select[data-field="feeStatus"]');
    const busNoInput = row.querySelector('input[data-field="busNo"]');
    
    // Validate required fields
    if (!rollNoInput.value.trim()) {
        showNotification('Roll number is required!', 'error');
        rollNoInput.focus();
        return;
    }
    
    // Allow any roll number format (removed strict validation)
    // Just check that it's not empty and has reasonable length
    const rollNo = rollNoInput.value.trim();
    if (rollNo.length < 3 || rollNo.length > 20) {
        showNotification('Roll number must be between 3 and 20 characters!', 'error');
        rollNoInput.focus();
        return;
    }
    
    // Check for duplicate roll numbers
    const duplicateRollNo = busPassData.find(s => 
        s.id !== id && s.rollNo === rollNoInput.value.trim()
    );
    if (duplicateRollNo) {
        showNotification('Roll number already exists!', 'error');
        rollNoInput.focus();
        return;
    }
    
    if (!nameInput.value.trim()) {
        showNotification('Name is required!', 'error');
        nameInput.focus();
        return;
    }
    
    if (!busNoInput.value || busNoInput.value < 1) {
        showNotification('Valid bus number is required!', 'error');
        busNoInput.focus();
        return;
    }
    
    // Update student data
    busPassData[studentIndex] = {
        ...busPassData[studentIndex],
        rollNo: rollNoInput.value.trim().toUpperCase(),
        name: nameInput.value.trim(),
        branch: branchSelect.value,
        section: sectionSelect.value,
        feeStatus: feeStatusSelect.value,
        busNo: parseInt(busNoInput.value)
    };
    
    editingRowId = null;
    renderBusPassTable();
    saveBusPassData();
    
    showNotification('Student information saved successfully!', 'success');
}

// Cancel edit
function cancelEdit() {
    // If it's a new student (empty name), remove it
    if (editingRowId !== null) {
        const student = busPassData.find(s => s.id === editingRowId);
        if (student && !student.name.trim()) {
            busPassData = busPassData.filter(s => s.id !== editingRowId);
        }
    }
    
    editingRowId = null;
    renderBusPassTable();
    saveBusPassData();
}

// Delete student
function deleteStudent(id) {
    const student = busPassData.find(s => s.id === id);
    if (!student) return;
    
    if (confirm(`Are you sure you want to delete ${student.name || 'this student'}?`)) {
        busPassData = busPassData.filter(s => s.id !== id);
        renderBusPassTable();
        saveBusPassData();
        showNotification('Student deleted successfully!', 'success');
    }
}

// Enhanced notification function for error type
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let icon = 'info-circle';
    let bgColor = '#dbeafe';
    let textColor = '#1e40af';
    
    switch (type) {
        case 'success':
            icon = 'check-circle';
            bgColor = '#dcfce7';
            textColor = '#166534';
            break;
        case 'error':
            icon = 'exclamation-triangle';
            bgColor = '#fee2e2';
            textColor = '#dc2626';
            break;
        case 'info':
        default:
            icon = 'info-circle';
            bgColor = '#dbeafe';
            textColor = '#1e40af';
            break;
    }
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add keyboard shortcuts for Bus Pass
document.addEventListener('keydown', function(event) {
    // ESC to cancel edit
    if (event.key === 'Escape' && editingRowId !== null) {
        cancelEdit();
    }
    
    // Ctrl+S to save (when editing)
    if ((event.ctrlKey || event.metaKey) && event.key === 's' && editingRowId !== null) {
        event.preventDefault();
        saveStudent(editingRowId);
    }
    
    // Ctrl+N to add new student (when on Bus Pass page)
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        const busPassContent = document.getElementById('bus-pass-content');
        if (busPassContent && busPassContent.style.display !== 'none') {
            event.preventDefault();
            addNewStudent();
        }
    }
});

// Initialize Bus Pass when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Bus Pass will be initialized when the section is first accessed
    window.busPassInitialized = false;
});


// User Dropdown Menu Functions
function initializeUserDropdown() {
    const userAvatarBtn = document.getElementById('user-avatar-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const liveLocationBtn = document.getElementById('live-location-btn');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const busSelectionBtn = document.getElementById('bus-selection-btn');
    const logoutBtnDropdown = document.getElementById('logout-btn-dropdown');
    
    if (!userAvatarBtn || !userDropdown) return;
    
    // Toggle dropdown on avatar click
    userAvatarBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
        // Close notification dropdown if open
        const notificationDropdown = document.getElementById('notification-dropdown');
        if (notificationDropdown) {
            notificationDropdown.classList.remove('show');
            document.getElementById('notification-btn')?.classList.remove('active');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userAvatarBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Live Location
    if (liveLocationBtn) {
        liveLocationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.remove('show');
            showLiveLocation();
        });
    }
    
    // Edit Profile
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.remove('show');
            showEditProfile();
        });
    }
    
    // Bus Selection
    if (busSelectionBtn) {
        busSelectionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.remove('show');
            showBusSelection();
        });
    }
    
    // Logout
    if (logoutBtnDropdown) {
        logoutBtnDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.remove('show');
            handleLogout(e);
        });
    }
}

// Show Live Location
function showLiveLocation() {
    showNotification('Opening live location...', 'info');
    // Navigate to Routes section
    const routesLink = document.querySelector('[href="#routes"]');
    if (routesLink) {
        routesLink.click();
    } else {
        showContent('Routes');
    }
}

// Show Edit Profile - moved to edit profile section below

// Show Bus Selection
function showBusSelection() {
    showNotification('Opening bus selection...', 'info');
    // Navigate to Bus Pass section
    const busPassLink = document.querySelector('[href="#bus-pass"]');
    if (busPassLink) {
        busPassLink.click();
    } else {
        showContent('Bus Pass');
    }
}

// Notification Dropdown Functions
function initializeNotificationDropdown() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationDropdown = document.getElementById('notification-dropdown');
    const notificationBadge = document.getElementById('notification-badge');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item');
    
    if (!notificationBtn || !notificationDropdown) return;
    
    // Toggle dropdown on button click
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.classList.toggle('show');
        notificationBtn.classList.toggle('active');
        
        // Close user dropdown if open
        const userDropdown = document.getElementById('user-dropdown');
        if (userDropdown) {
            userDropdown.classList.remove('show');
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationDropdown.classList.remove('show');
            notificationBtn.classList.remove('active');
        }
    });
    
    // Mark all as read
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            markAllNotificationsRead();
        });
    }
    
    // Click on notification item
    notificationItems.forEach(item => {
        item.addEventListener('click', function() {
            markNotificationRead(this);
        });
    });
    
    // Update badge count
    updateNotificationBadge();
}

// Mark all notifications as read
function markAllNotificationsRead() {
    const notificationItems = document.querySelectorAll('.notification-item.unread');
    
    notificationItems.forEach(item => {
        item.classList.remove('unread');
        item.style.animation = 'fadeOut 0.3s ease';
    });
    
    setTimeout(() => {
        notificationItems.forEach(item => {
            item.style.animation = '';
        });
        updateNotificationBadge();
        showNotification('All notifications marked as read', 'success');
    }, 300);
}

// Mark single notification as read
function markNotificationRead(notificationItem) {
    if (notificationItem.classList.contains('unread')) {
        notificationItem.classList.remove('unread');
        updateNotificationBadge();
        
        // Get notification details
        const title = notificationItem.querySelector('.notification-title')?.textContent;
        showNotification(`Notification read: ${title}`, 'info');
    }
}

// Update notification badge count
function updateNotificationBadge() {
    const notificationBadge = document.getElementById('notification-badge');
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    
    if (notificationBadge) {
        if (unreadCount > 0) {
            notificationBadge.textContent = unreadCount;
            notificationBadge.style.display = 'flex';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
}

// Add new notification (for real-time updates)
function addNotification(type, title, text) {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return;
    
    const now = new Date();
    const notificationId = Date.now();
    
    const notificationHTML = `
        <div class="notification-item unread" data-id="${notificationId}">
            <div class="notification-icon ${type}">
                <i class="fas fa-${type === 'delayed' ? 'exclamation-circle' : type === 'early' ? 'clock' : 'check-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-text">${text}</div>
                <div class="notification-time">Just now</div>
            </div>
        </div>
    `;
    
    notificationList.insertAdjacentHTML('afterbegin', notificationHTML);
    
    // Add click listener to new notification
    const newNotification = notificationList.querySelector(`[data-id="${notificationId}"]`);
    if (newNotification) {
        newNotification.addEventListener('click', function() {
            markNotificationRead(this);
        });
    }
    
    // Update badge
    updateNotificationBadge();
    
    // Animate the notification button
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            notificationBtn.style.animation = '';
        }, 500);
    }
}


// ============================================
// ADD BUS FUNCTIONALITY
// ============================================

function initializeAddBus() {
    const addBusCard = document.getElementById('add-bus-card');
    const addBusModal = document.getElementById('add-bus-modal');
    const addBusForm = document.getElementById('add-bus-form');
    const closeBtn = document.getElementById('add-bus-modal-close');
    const cancelBtn = document.getElementById('add-bus-cancel');
    
    if (!addBusCard || !addBusModal || !addBusForm) return;
    
    // Ensure modal is hidden on page load
    addBusModal.style.display = 'none';
    addBusModal.classList.remove('show');
    
    // Open modal when clicking add bus card
    addBusCard.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        addBusModal.style.display = 'flex';
        addBusModal.classList.add('show');
    });
    
    // Close modal
    function closeAddBusModal() {
        addBusModal.style.display = 'none';
        addBusModal.classList.remove('show');
        addBusForm.reset();
    }
    
    closeBtn.addEventListener('click', closeAddBusModal);
    cancelBtn.addEventListener('click', closeAddBusModal);
    
    // Close on outside click
    addBusModal.addEventListener('click', function(e) {
        if (e.target === addBusModal) {
            closeAddBusModal();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && addBusModal.classList.contains('show')) {
            closeAddBusModal();
        }
    });
    
    // Handle form submission
    addBusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            busNumber: document.getElementById('bus-number').value.trim(),
            status: document.getElementById('bus-status').value,
            route: document.getElementById('bus-route').value.trim(),
            driver: document.getElementById('bus-driver').value.trim(),
            eta: document.getElementById('bus-eta').value,
            students: document.getElementById('bus-students').value.trim(),
            progress: document.getElementById('bus-progress').value
        };
        
        // Validate
        if (!formData.busNumber || !formData.status || !formData.route || 
            !formData.driver || !formData.eta || !formData.students || !formData.progress) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Create new bus card
        createBusCard(formData);
        
        // Close modal
        closeAddBusModal();
        
        // Show success message
        showNotification(`Bus ${formData.busNumber} added successfully!`, 'success');
    });
}

function createBusCard(data) {
    const dashboardGrid = document.getElementById('dashboard-content');
    const addBusCard = document.getElementById('add-bus-card');
    
    if (!dashboardGrid || !addBusCard) return;
    
    // Determine status icon
    let statusIcon = 'check-circle';
    if (data.status === 'delayed') statusIcon = 'exclamation-circle';
    if (data.status === 'early') statusIcon = 'clock';
    
    // Create card HTML
    const cardHTML = `
        <div class="bus-card" data-status="${data.status}" data-favorite="false" 
             data-bus-number="${data.busNumber}" 
             data-route="${data.route.toLowerCase()}" 
             data-driver="${data.driver.toLowerCase()}">
            <div class="card-header">
                <div class="bus-icon ${data.status}">
                    <i class="fas fa-bus"></i>
                </div>
                <div class="bus-title">
                    <h3>Bus ${data.busNumber}</h3>
                </div>
                <button class="favorite-btn">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="route-info">
                <p class="route-text">
                    <i class="fas fa-map-marker-alt"></i>
                    Route: ${data.route}
                </p>
            </div>
            <div class="status-badge ${data.status}">
                <i class="fas fa-${statusIcon}"></i>
                Status: ${data.status.charAt(0).toUpperCase() + data.status.slice(1).replace('-', ' ')}
            </div>
            <div class="card-actions">
                <button class="location-btn">
                    <i class="fas fa-location-arrow"></i>
                </button>
                <button class="track-btn">
                    <i class="fas fa-map-marker-alt"></i>
                    Track
                </button>
            </div>
            <div class="driver-info">
                <span class="driver-label">Driver: ${data.driver}</span>
            </div>
            <div class="eta-info">
                <span class="eta-label">ETA: ${data.eta} min</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.progress}%;"></div>
            </div>
            <div class="students-info">
                <span>Students: ${data.students}</span>
            </div>
        </div>
    `;
    
    // Insert before the add bus card
    addBusCard.insertAdjacentHTML('beforebegin', cardHTML);
    
    // Get the newly created card
    const newCard = addBusCard.previousElementSibling;
    
    // Add animation
    newCard.style.opacity = '0';
    newCard.style.transform = 'scale(0.8)';
    setTimeout(() => {
        newCard.style.transition = 'all 0.5s ease';
        newCard.style.opacity = '1';
        newCard.style.transform = 'scale(1)';
    }, 10);
    
    // Add event listeners to the new card
    const favoriteBtn = newCard.querySelector('.favorite-btn');
    const trackBtn = newCard.querySelector('.track-btn');
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    if (trackBtn) {
        trackBtn.addEventListener('click', trackBus);
    }
    
    // Add hover effects
    newCard.addEventListener('mouseenter', handleCardHover);
    newCard.addEventListener('mouseleave', handleCardLeave);
}

// ============================================
// LIVE LOCATION TRACKING SYSTEM
// ============================================

// Global state for live location
const liveLocationState = {
    isTracking: false,
    busNumber: null,
    route: null,
    currentLocation: null,
    watchId: null,
    updateInterval: null,
    lastUpdate: null
};

// Initialize Live Location Modal
function initializeLiveLocationModal() {
    const modal = document.getElementById('live-location-modal');
    const closeBtn = document.getElementById('live-location-modal-close');
    const busSelect = document.getElementById('bus-number-select');
    const startBtn = document.getElementById('btn-start-tracking');
    const stopBtn = document.getElementById('btn-stop-tracking');
    
    if (!modal) return;
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLiveLocationModal);
    }
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLiveLocationModal();
        }
    });
    
    // Bus selection change
    if (busSelect) {
        busSelect.addEventListener('change', function() {
            const busNumber = this.value;
            if (busNumber) {
                const busText = this.options[this.selectedIndex].text;
                const route = busText.split(' - ')[1] || 'Unknown Route';
                liveLocationState.busNumber = busNumber;
                liveLocationState.route = route;
                
                if (startBtn) {
                    startBtn.disabled = false;
                }
            } else {
                if (startBtn) {
                    startBtn.disabled = true;
                }
            }
        });
    }
    
    // Start tracking button
    if (startBtn) {
        startBtn.addEventListener('click', startLiveTracking);
    }
    
    // Stop tracking button
    if (stopBtn) {
        stopBtn.addEventListener('click', stopLiveTracking);
    }
    
    // Check if already tracking
    const savedTracking = localStorage.getItem('liveTracking');
    if (savedTracking) {
        const data = JSON.parse(savedTracking);
        liveLocationState.busNumber = data.busNumber;
        liveLocationState.route = data.route;
        liveLocationState.isTracking = true;
        resumeLiveTracking();
    }
}

// Show Live Location Modal
function showLiveLocationModal() {
    const modal = document.getElementById('live-location-modal');
    if (modal) {
        modal.classList.add('show');
        
        // If already tracking, show current state
        if (liveLocationState.isTracking) {
            updateLiveLocationUI();
        }
    }
}

// Close Live Location Modal
function closeLiveLocationModal() {
    const modal = document.getElementById('live-location-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Start Live Tracking
function startLiveTracking() {
    if (!liveLocationState.busNumber) {
        showNotification('Please select a bus first', 'error');
        return;
    }
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    const statusEl = document.getElementById('location-status');
    if (statusEl) {
        statusEl.className = 'location-status';
        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Requesting location permission...</span>';
    }
    
    // Request location permission and start watching
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Success - start tracking
            liveLocationState.isTracking = true;
            liveLocationState.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('liveTracking', JSON.stringify({
                busNumber: liveLocationState.busNumber,
                route: liveLocationState.route,
                startTime: new Date().toISOString()
            }));
            
            // Start continuous tracking
            startContinuousTracking();
            
            // Update UI
            updateLiveLocationUI();
            
            // Show success message
            showNotification(`Live location sharing started for Bus ${liveLocationState.busNumber} - ${liveLocationState.route}`, 'success');
            
            // Update status
            if (statusEl) {
                statusEl.className = 'location-status active';
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i><span>Live tracking active</span>';
            }
            
            // Update all maps and displays
            updateAllBusDisplays();
        },
        function(error) {
            // Error
            let errorMessage = 'Unable to get your location';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location permission denied. Please enable location access.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
            }
            
            showNotification(errorMessage, 'error');
            
            if (statusEl) {
                statusEl.className = 'location-status error';
                statusEl.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${errorMessage}</span>`;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Start Continuous Tracking
function startContinuousTracking() {
    // Watch position for real-time updates
    liveLocationState.watchId = navigator.geolocation.watchPosition(
        function(position) {
            liveLocationState.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString()
            };
            liveLocationState.lastUpdate = new Date();
            
            updateLiveLocationUI();
            updateAllBusDisplays();
            
            console.log('Location updated:', liveLocationState.currentLocation);
        },
        function(error) {
            console.error('Location watch error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
    
    // Also set interval for periodic updates (every 10 seconds)
    liveLocationState.updateInterval = setInterval(function() {
        if (liveLocationState.currentLocation) {
            updateAllBusDisplays();
            console.log('Periodic update triggered');
        }
    }, 10000); // 10 seconds
}

// Stop Live Tracking
function stopLiveTracking() {
    if (liveLocationState.watchId) {
        navigator.geolocation.clearWatch(liveLocationState.watchId);
        liveLocationState.watchId = null;
    }
    
    if (liveLocationState.updateInterval) {
        clearInterval(liveLocationState.updateInterval);
        liveLocationState.updateInterval = null;
    }
    
    liveLocationState.isTracking = false;
    liveLocationState.currentLocation = null;
    
    // Remove from localStorage
    localStorage.removeItem('liveTracking');
    
    // Update UI
    const statusEl = document.getElementById('location-status');
    if (statusEl) {
        statusEl.className = 'location-status';
        statusEl.innerHTML = '<i class="fas fa-info-circle"></i><span>Tracking stopped</span>';
    }
    
    const locationInfo = document.getElementById('location-info');
    if (locationInfo) {
        locationInfo.style.display = 'none';
    }
    
    const startBtn = document.getElementById('btn-start-tracking');
    const stopBtn = document.getElementById('btn-stop-tracking');
    if (startBtn) startBtn.style.display = 'flex';
    if (stopBtn) stopBtn.style.display = 'none';
    
    showNotification('Live location tracking stopped', 'info');
}

// Resume Live Tracking (on page load)
function resumeLiveTracking() {
    if (liveLocationState.isTracking) {
        startContinuousTracking();
        updateLiveLocationUI();
    }
}

// Update Live Location UI
function updateLiveLocationUI() {
    const busSelect = document.getElementById('bus-number-select');
    const locationInfo = document.getElementById('location-info');
    const currentCoords = document.getElementById('current-coords');
    const lastUpdated = document.getElementById('last-updated');
    const startBtn = document.getElementById('btn-start-tracking');
    const stopBtn = document.getElementById('btn-stop-tracking');
    
    if (liveLocationState.isTracking) {
        // Set bus selection
        if (busSelect && liveLocationState.busNumber) {
            busSelect.value = liveLocationState.busNumber;
            busSelect.disabled = true;
        }
        
        // Show location info
        if (locationInfo) {
            locationInfo.style.display = 'flex';
        }
        
        // Update coordinates
        if (currentCoords && liveLocationState.currentLocation) {
            currentCoords.textContent = `${liveLocationState.currentLocation.lat.toFixed(6)}, ${liveLocationState.currentLocation.lng.toFixed(6)}`;
        }
        
        // Update last updated time
        if (lastUpdated && liveLocationState.lastUpdate) {
            const timeAgo = getTimeAgo(liveLocationState.lastUpdate);
            lastUpdated.textContent = timeAgo;
        }
        
        // Show stop button
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'flex';
    } else {
        if (busSelect) busSelect.disabled = false;
        if (startBtn) startBtn.style.display = 'flex';
        if (stopBtn) stopBtn.style.display = 'none';
    }
}

// Update All Bus Displays
function updateAllBusDisplays() {
    if (!liveLocationState.isTracking || !liveLocationState.currentLocation) return;
    
    const busNumber = liveLocationState.busNumber;
    const location = liveLocationState.currentLocation;
    
    console.log(`Updating displays for Bus ${busNumber}:`, location);
    
    // Update bus cards
    updateBusCard(busNumber, location);
    
    // Update maps if visible
    updateMapMarker(busNumber, location);
    
    // Update any other displays
    updateRouteDisplay(busNumber, location);
}

// Update Bus Card
function updateBusCard(busNumber, location) {
    const cards = document.querySelectorAll('.bus-card');
    cards.forEach(card => {
        const cardBusNumber = card.dataset.busNumber;
        if (cardBusNumber === busNumber) {
            // Add live indicator
            let liveIndicator = card.querySelector('.live-indicator');
            if (!liveIndicator) {
                liveIndicator = document.createElement('div');
                liveIndicator.className = 'live-indicator';
                liveIndicator.innerHTML = '<i class="fas fa-circle"></i> LIVE';
                const cardHeader = card.querySelector('.card-header');
                if (cardHeader) {
                    cardHeader.appendChild(liveIndicator);
                }
            }
            
            console.log(`Updated card for Bus ${busNumber}`);
        }
    });
}

// Update Map Marker
function updateMapMarker(busNumber, location) {
    // Update main map if it exists
    if (typeof map !== 'undefined' && map) {
        // Find and update the marker for this bus
        console.log(`Updating map marker for Bus ${busNumber} at`, location);
        // Implementation depends on your map structure
    }
    
    // Update track modal map if open
    if (trackMapInstance && trackMarkers.length > 0) {
        // Update the bus marker position
        console.log(`Updating track modal for Bus ${busNumber}`);
    }
}

// Update Route Display
function updateRouteDisplay(busNumber, location) {
    // Update any route-specific displays
    console.log(`Updating route display for Bus ${busNumber}`);
}

// Get Time Ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
}

// Update showLiveLocation function
function showLiveLocation() {
    showLiveLocationModal();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLiveLocationModal();
});


// ============================================
// EDIT PROFILE SYSTEM
// ============================================

// Profile state
const profileState = {
    name: '9014251662',
    avatar: 'default',
    avatarType: 'icon', // 'icon' or 'image'
    avatarImage: null
};

// Initialize Edit Profile Modal
function initializeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.getElementById('edit-profile-modal-close');
    const cancelBtn = document.getElementById('btn-cancel-profile');
    const saveBtn = document.getElementById('btn-save-profile');
    const nameInput = document.getElementById('profile-name-input');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const uploadBtn = document.getElementById('btn-upload-avatar');
    const uploadInput = document.getElementById('avatar-upload');
    
    if (!modal) return;
    
    // Load saved profile
    loadProfile();
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditProfileModal);
    }
    
    // Cancel button
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditProfileModal);
    }
    
    // Click outside to close
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeEditProfileModal();
        }
    });
    
    // Avatar selection
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const avatarType = this.dataset.avatar;
            profileState.avatar = avatarType;
            profileState.avatarType = 'icon';
            profileState.avatarImage = null;
            
            updateProfilePreview();
        });
    });
    
    // Upload button
    if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', function() {
            uploadInput.click();
        });
        
        uploadInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('Image size must be less than 2MB', 'error');
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showNotification('Please select an image file', 'error');
                    return;
                }
                
                // Read and preview image
                const reader = new FileReader();
                reader.onload = function(event) {
                    profileState.avatarType = 'image';
                    profileState.avatarImage = event.target.result;
                    
                    // Deselect icon avatars
                    avatarOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    updateProfilePreview();
                    showNotification('Image uploaded successfully', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Name input - live preview
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            updateProfilePreview();
        });
    }
    
    // Save button
    if (saveBtn) {
        saveBtn.addEventListener('click', saveProfile);
    }
}

// Show Edit Profile Modal
function showEditProfileModal() {
    console.log('showEditProfileModal called');
    const modal = document.getElementById('edit-profile-modal');
    console.log('Modal element:', modal);
    const nameInput = document.getElementById('profile-name-input');
    const avatarOptions = document.querySelectorAll('.avatar-option');
    
    if (!modal) {
        console.error('Edit profile modal not found!');
        showNotification('Error: Modal not found', 'error');
        return;
    }
    
    // Load current profile data
    if (nameInput) {
        nameInput.value = profileState.name;
    }
    
    // Select current avatar
    avatarOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.avatar === profileState.avatar && profileState.avatarType === 'icon') {
            option.classList.add('selected');
        }
    });
    
    updateProfilePreview();
    modal.classList.add('show');
    console.log('Modal should be visible now, classes:', modal.className);
}

// Close Edit Profile Modal
function closeEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Update Profile Preview
function updateProfilePreview() {
    const previewAvatar = document.getElementById('profile-preview-avatar');
    const previewName = document.getElementById('profile-preview-name');
    const nameInput = document.getElementById('profile-name-input');
    
    // Update name preview
    if (previewName && nameInput) {
        const newName = nameInput.value.trim() || profileState.name;
        previewName.textContent = newName;
    }
    
    // Update avatar preview
    if (previewAvatar) {
        if (profileState.avatarType === 'image' && profileState.avatarImage) {
            previewAvatar.innerHTML = `<img src="${profileState.avatarImage}" alt="Avatar">`;
        } else {
            const iconClass = getAvatarIcon(profileState.avatar);
            previewAvatar.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }
}

// Get Avatar Icon Class
function getAvatarIcon(avatarType) {
    const icons = {
        'default': 'fas fa-user',
        'avatar1': 'fas fa-user-graduate',
        'avatar2': 'fas fa-user-tie',
        'avatar3': 'fas fa-user-astronaut',
        'avatar4': 'fas fa-user-ninja',
        'avatar5': 'fas fa-user-secret',
        'avatar6': 'fas fa-user-md',
        'avatar7': 'fas fa-user-shield'
    };
    return icons[avatarType] || icons['default'];
}

// Save Profile
function saveProfile() {
    const nameInput = document.getElementById('profile-name-input');
    
    if (!nameInput) return;
    
    const newName = nameInput.value.trim();
    
    // Validate name
    if (!newName) {
        showNotification('Please enter a name', 'error');
        nameInput.focus();
        return;
    }
    
    if (newName.length < 2) {
        showNotification('Name must be at least 2 characters', 'error');
        nameInput.focus();
        return;
    }
    
    // Update profile state
    profileState.name = newName;
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileState));
    
    // Update all profile displays
    updateAllProfileDisplays();
    
    // Close modal
    closeEditProfileModal();
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
}

// Load Profile
function loadProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            profileState.name = data.name || '9014251662';
            profileState.avatar = data.avatar || 'default';
            profileState.avatarType = data.avatarType || 'icon';
            profileState.avatarImage = data.avatarImage || null;
            
            updateAllProfileDisplays();
        } catch (e) {
            console.error('Error loading profile:', e);
        }
    }
}

// Update All Profile Displays
function updateAllProfileDisplays() {
    // Update header avatar
    updateHeaderAvatar();
    
    // Update sidebar avatar
    updateSidebarAvatar();
    
    // Update dropdown avatar
    updateDropdownAvatar();
    
    // Update any other profile displays
    updateOtherProfileDisplays();
}

// Update Header Avatar
function updateHeaderAvatar() {
    const headerAvatar = document.querySelector('.user-avatar-small');
    if (headerAvatar) {
        if (profileState.avatarType === 'image' && profileState.avatarImage) {
            headerAvatar.innerHTML = `<img src="${profileState.avatarImage}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 12px; object-fit: cover;">`;
        } else {
            const iconClass = getAvatarIcon(profileState.avatar);
            headerAvatar.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }
}

// Update Sidebar Avatar
function updateSidebarAvatar() {
    const sidebarAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    
    if (sidebarAvatar) {
        if (profileState.avatarType === 'image' && profileState.avatarImage) {
            sidebarAvatar.innerHTML = `<img src="${profileState.avatarImage}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            const iconClass = getAvatarIcon(profileState.avatar);
            sidebarAvatar.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }
    
    if (userName) {
        userName.textContent = profileState.name;
    }
}

// Update Dropdown Avatar
function updateDropdownAvatar() {
    const dropdownAvatar = document.querySelector('.user-dropdown-avatar');
    const dropdownName = document.querySelector('.user-dropdown-name');
    
    if (dropdownAvatar) {
        if (profileState.avatarType === 'image' && profileState.avatarImage) {
            dropdownAvatar.innerHTML = `<img src="${profileState.avatarImage}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        } else {
            const iconClass = getAvatarIcon(profileState.avatar);
            dropdownAvatar.innerHTML = `<i class="${iconClass}"></i>`;
        }
    }
    
    if (dropdownName) {
        dropdownName.textContent = profileState.name;
    }
}

// Update Other Profile Displays
function updateOtherProfileDisplays() {
    // Update any other places where profile is displayed
    console.log('Profile updated globally:', profileState);
}

// Update showEditProfile function
function showEditProfile() {
    console.log('showEditProfile called');
    showEditProfileModal();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeEditProfileModal();
    loadProfile(); // Load profile on page load
});
