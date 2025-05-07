document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const posterUrlInput = document.getElementById('posterUrl');
    const posterFileInput = document.getElementById('posterFile');
    const englishTitleInput = document.getElementById('englishTitle');
    const thaiTitleInput = document.getElementById('thaiTitle');
    const watchDateInput = document.getElementById('watchDate');
    const genresInput = document.getElementById('genres');
    const countryInput = document.getElementById('country');
    const cinemaNameInput = document.getElementById('cinemaName');
    const displayMovieCodeInput = document.getElementById('displayMovieCode');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const fileNameDisplay = document.getElementById('fileName');
    
    // Ticket elements
    const ticketPoster = document.getElementById('ticketPoster');
    const ticketEnglishTitle = document.getElementById('ticketEnglishTitle');
    const ticketThaiTitle = document.getElementById('ticketThaiTitle');
    const ticketDate = document.getElementById('ticketDate');
    const ticketGenres = document.getElementById('ticketGenres');
    const ticketCountry = document.getElementById('ticketCountry');
    const ticketCode = document.getElementById('ticketCode');
    const ticketQR = document.getElementById('ticketQR');
    const cinemaLogo = document.getElementById('cinemaLogo');
    const ticketCinemaName = document.getElementById('ticketCinemaName');
    
    // Default N/A poster image
    const defaultPosterImage = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'150\' height=\'225\' viewBox=\'0 0 150 225\'%3E%3Crect width=\'150\' height=\'225\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'75\' y=\'112.5\' font-family=\'Arial\' font-size=\'24\' fill=\'%23999\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EN/A%3C/text%3E%3C/svg%3E';
    
    // Store previously generated codes to avoid duplicates
    const generatedCodes = new Set();
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    watchDateInput.value = today;
    
    // Generate cinema logo on load
    generateCinemaLogo();
    
    // Handle poster file input
    let posterImage = null;
    posterFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                posterImage = event.target.result;
                ticketPoster.src = posterImage;
                posterUrlInput.value = ''; // Clear URL input when file is selected
                fileNameDisplay.textContent = file.name; // Update file name display
            };
            reader.readAsDataURL(file);
        } else {
            fileNameDisplay.textContent = 'No file selected';
            posterImage = null;
            ticketPoster.src = defaultPosterImage;
        }
    });
    
    // Handle poster URL input
    posterUrlInput.addEventListener('input', () => {
        if (posterUrlInput.value.trim() !== '') {
            posterImage = posterUrlInput.value;
            ticketPoster.src = posterImage;
            posterFileInput.value = ''; // Clear file input when URL is entered
            fileNameDisplay.textContent = 'No file selected'; // Reset file name display
        } else {
            posterImage = null;
            ticketPoster.src = defaultPosterImage;
        }
    });
    
    // Handle cinema name input
    cinemaNameInput.addEventListener('input', () => {
        ticketCinemaName.textContent = cinemaNameInput.value || 'MOVIE SLIP';
        // Regenerate logo when name changes
        generateCinemaLogo();
    });
    
    // Generate a cinema logo using SVG
    function generateCinemaLogo() {
        const cinemaName = cinemaNameInput.value || 'MOVIE SLIP';
        const firstLetter = cinemaName.charAt(0).toUpperCase();
        
        // Generate random color for the logo
        const hue = Math.floor(Math.random() * 360); 
        const color = `hsl(${hue}, 80%, 60%)`;
        const darkColor = `hsl(${hue}, 80%, 40%)`;
        
        // Create SVG with first letter of cinema name
        const svg = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="${color}" />
                        <stop offset="100%" stop-color="${darkColor}" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#logoGradient)" />
                <path d="M30 30 L70 30 L80 50 L70 70 L30 70 L20 50 Z" fill="rgba(255, 255, 255, 0.2)" />
                <text x="50" y="65" font-family="Arial, sans-serif" font-size="45" font-weight="bold" 
                    text-anchor="middle" fill="white">${firstLetter}</text>
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="2" stroke-opacity="0.5" />
            </svg>
        `;
        
        cinemaLogo.innerHTML = svg;
    }
    
    // Generate unique movie code
    function generateUniqueCode() {
        let code;
        do {
            // Generate a random 6-character alphanumeric code
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            code = '';
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        } while (generatedCodes.has(code)); // Check if code already exists
        
        generatedCodes.add(code); // Add to set of generated codes
        return code;
    }
    
    // Generate ticket
    generateBtn.addEventListener('click', () => {
        // Validate required fields
        if (!englishTitleInput.value || !thaiTitleInput.value || !watchDateInput.value || 
            !countryInput.value || !cinemaNameInput.value) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Generate a unique movie code
        const movieCode = generateUniqueCode();
        displayMovieCodeInput.value = movieCode;
        
        // Set poster image
        if (posterImage) {
            ticketPoster.src = posterImage;
        } else {
            ticketPoster.src = defaultPosterImage;
        }
        
        // Set ticket information
        ticketEnglishTitle.textContent = englishTitleInput.value;
        ticketThaiTitle.textContent = thaiTitleInput.value;
        
        // Format date to DD/MM/YYYY
        const dateObj = new Date(watchDateInput.value);
        const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        ticketDate.textContent = formattedDate;
        
        // Generate genre tags
        ticketGenres.innerHTML = '';
        if (genresInput.value) {
            const genres = genresInput.value.split(',').map(g => g.trim());
            genres.forEach(genre => {
                if (genre) {
                    const tagElement = document.createElement('span');
                    tagElement.classList.add('tag');
                    tagElement.textContent = genre;
                    ticketGenres.appendChild(tagElement);
                }
            });
        }
        
        ticketCountry.textContent = countryInput.value;
        ticketCode.textContent = movieCode;
        ticketCinemaName.textContent = cinemaNameInput.value;
        
        // Regenerate cinema logo
        generateCinemaLogo();
        
        // Generate QR code
        generateQRCode(movieCode);
        
        // Show download button
        downloadBtn.style.display = 'block';
    });
    
    // Generate QR code
    function generateQRCode(text) {
        // Use qrcode-generator library
        const qr = qrcode(0, 'L');
        qr.addData(text);
        qr.make();
        
        // Create QR code in the ticket
        ticketQR.innerHTML = qr.createImgTag(4);
    }
    
    // Download ticket as image
    downloadBtn.addEventListener('click', () => {
        const ticket = document.getElementById('ticket');
        
        // Use html2canvas library (loaded in HTML)
        html2canvas(ticket).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `${englishTitleInput.value.replace(/\s+/g, '-')}-ticket.png`;
            link.href = image;
            link.click();
        });
    });

    // Genre tags drag and drop functionality
    const availableTags = document.getElementById('availableTags');
    const selectedGenres = document.getElementById('selectedGenres');
    let selectedTags = new Set();

    // Initialize drag and drop functionality
    function initializeDragAndDrop() {
        // Make all genre tags draggable
        document.querySelectorAll('.genre-tag').forEach(tag => {
            tag.addEventListener('dragstart', dragStart);
            tag.addEventListener('dragend', dragEnd);
        });

        // Set up drop zone
        selectedGenres.addEventListener('dragover', allowDrop);
        selectedGenres.addEventListener('drop', drop);
        selectedGenres.addEventListener('dragleave', () => {
            selectedGenres.classList.remove('drag-over');
        });
    }

    function dragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.genre);
        e.dataTransfer.effectAllowed = 'move';
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function allowDrop(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        selectedGenres.classList.add('drag-over');
    }

    function drop(e) {
        e.preventDefault();
        selectedGenres.classList.remove('drag-over');
        
        const genre = e.dataTransfer.getData('text/plain');
        if (!selectedTags.has(genre)) {
            selectedTags.add(genre);
            updateSelectedGenres();
        }
    }

    function updateSelectedGenres() {
        // Clear existing tags
        const existingTags = selectedGenres.querySelectorAll('.genre-tag');
        existingTags.forEach(tag => tag.remove());

        // Add new tags
        selectedTags.forEach(genre => {
            const tag = document.createElement('span');
            tag.className = 'genre-tag';
            tag.textContent = genre;
            tag.draggable = true;
            tag.dataset.genre = genre;
            
            const removeBtn = document.createElement('span');
            removeBtn.className = 'remove-tag';
            removeBtn.textContent = '×';
            removeBtn.onclick = () => {
                selectedTags.delete(genre);
                updateSelectedGenres();
            };
            
            tag.appendChild(removeBtn);
            selectedGenres.insertBefore(tag, genresInput);
        });

        // Update input value
        genresInput.value = Array.from(selectedTags).join(', ');

        // Reinitialize drag and drop for new tags
        initializeDragAndDrop();
    }

    // Initialize drag and drop on page load
    initializeDragAndDrop();
});

// Load html2canvas dynamically for downloading the ticket
(function loadHtml2Canvas() {
    const script = document.createElement('script');
    script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
    script.async = true;
    document.head.appendChild(script);
})(); 