/**
 * BL Concordance - Book of Life Reference System
 * Dynamic search and navigation for Book of Life content
 */

let concordanceData = null;
let filteredData = null;

// Initialize concordance on page load
document.addEventListener('DOMContentLoaded', function() {
    loadConcordanceData();
    initSearchBox();
});

/**
 * Load concordance index from JSON file
 */
async function loadConcordanceData() {
    try {
        // Detect if we're in www/pages or root
        const isInPages = window.location.pathname.includes('/pages/');
        const dataPath = isInPages ? '../data/bl-concordance-index.json' : 'data/bl-concordance-index.json';
        
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        concordanceData = await response.json();
        filteredData = concordanceData;
        
        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('scriptureSection').style.display = 'block';
        document.getElementById('themesSection').style.display = 'block';
        document.getElementById('directorySection').style.display = 'block';
        
        // Update badges
        updateBadgeCounts();
        
        // Render all sections
        renderScriptureIndex();
        renderThemeIndex();
        renderSectionDirectory();
        
    } catch (error) {
        console.error('Error loading concordance data:', error);
        document.getElementById('loadingState').innerHTML = 
            '<p class="text-danger">Error loading concordance data. Please refresh the page.</p>';
    }
}

/**
 * Initialize search box with real-time filtering
 */
function initSearchBox() {
    const searchInput = document.getElementById('concordanceSearch');
    
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        
        if (query === '') {
            // Show all data, hide search results
            filteredData = concordanceData;
            document.getElementById('searchResults').style.display = 'none';
            document.getElementById('searchResultsInfo').textContent = '';
        } else {
            // Perform comprehensive search
            performDynamicSearch(query);
        }
        
        // Update badges
        updateBadgeCounts();
        
        // Re-render all sections
        renderScriptureIndex();
        renderThemeIndex();
        renderSectionDirectory();
    });
}

/**
 * Perform dynamic search across all content
 */
function performDynamicSearch(query) {
    const searchWords = query.split(' ').filter(w => w.length > 2);
    const searchResults = [];
    
    // Search in article texts
    if (concordanceData && concordanceData.sections) {
        concordanceData.sections.forEach(article => {
            let matches = [];
            let score = 0;
            
            // Search in article text
            if (article.text) {
                const textLower = article.text.toLowerCase();
                
                // Check if query matches
                if (textLower.includes(query)) {
                    matches.push('text');
                    score += 10;
                } else {
                    // Check individual words
                    searchWords.forEach(word => {
                        if (textLower.includes(word)) {
                            matches.push('text');
                            score += 3;
                        }
                    });
                }
            }
            
            // Search in article number
            if (article.number.toString().includes(query)) {
                matches.push('number');
                score += 20;
            }
            
            // Search in chapter/part
            if (article.partTitle && article.partTitle.toLowerCase().includes(query)) {
                matches.push('chapter');
                score += 5;
            }
            
            // Check if article is referenced in scripture or themes
            const inScripture = concordanceData.scripture.some(s => 
                s.sections.includes(article.number) && 
                (s.reference.toLowerCase().includes(query) || 
                 s.book.toLowerCase().includes(query) ||
                 s.context.toLowerCase().includes(query))
            );
            
            if (inScripture) {
                matches.push('scripture');
                score += 7;
            }
            
            const inTheme = concordanceData.themes.some(t => 
                t.sections.includes(article.number) && 
                (t.keyword.toLowerCase().includes(query) ||
                 t.description.toLowerCase().includes(query))
            );
            
            if (inTheme) {
                matches.push('theme');
                score += 7;
            }
            
            if (matches.length > 0) {
                searchResults.push({
                    article: article,
                    matches: matches,
                    score: score
                });
            }
        });
    }
    
    // Sort by relevance score
    searchResults.sort((a, b) => b.score - a.score);
    
    // Update search results display
    displaySearchResults(searchResults, query);
    
    // Also filter the existing sections
    filteredData = {
        scripture: concordanceData.scripture.filter(item => 
            item.reference.toLowerCase().includes(query) ||
            item.book.toLowerCase().includes(query) ||
            item.context.toLowerCase().includes(query)
        ),
        themes: concordanceData.themes.filter(item =>
            item.keyword.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        ),
        sections: concordanceData.sections.filter(item =>
            item.number.toString().includes(query) ||
            (item.text && item.text.toLowerCase().includes(query)) ||
            item.partTitle.toLowerCase().includes(query)
        )
    };
}

/**
 * Display search results
 */
function displaySearchResults(results, query) {
    const resultsSection = document.getElementById('searchResults');
    const resultsContent = document.getElementById('searchResultsContent');
    const resultsInfo = document.getElementById('searchResultsInfo');
    
    if (results.length === 0) {
        resultsSection.style.display = 'none';
        resultsInfo.textContent = 'No results found.';
        return;
    }
    
    resultsInfo.textContent = `Found ${results.length} article${results.length > 1 ? 's' : ''} matching "${query}"`;
    resultsSection.style.display = 'block';
    
    let html = '';
    results.forEach(result => {
        const article = result.article;
        
        // Get preview text with highlighting
        let preview = '';
        if (article.text) {
            const textLower = article.text.toLowerCase();
            const queryIndex = textLower.indexOf(query.toLowerCase());
            
            if (queryIndex !== -1) {
                // Show context around the match
                const start = Math.max(0, queryIndex - 100);
                const end = Math.min(article.text.length, queryIndex + query.length + 100);
                const snippet = article.text.substring(start, end);
                
                // Highlight the match
                const regex = new RegExp(`(${query})`, 'gi');
                preview = (start > 0 ? '...' : '') + 
                         snippet.replace(regex, '<span class="search-highlight">$1</span>') + 
                         (end < article.text.length ? '...' : '');
            } else {
                // Show first 200 characters
                preview = article.text.substring(0, 200) + '...';
            }
        }
        
        const matchTypes = result.matches.join(', ');
        
        html += `
            <div class="search-result-item" onclick="showArticleModal(${article.number})">
                <div class="search-result-title">Article ${article.number}</div>
                <div class="search-result-preview">${preview || 'Click to view full article text.'}</div>
                <div class="search-result-meta">
                    Chapter ${article.part}: ${article.partTitle} • 
                    Matched in: ${matchTypes}
                </div>
            </div>
        `;
    });
    
    resultsContent.innerHTML = html;
}

/**
 * Render scripture index
 */
function renderScriptureIndex() {
    const container = document.getElementById('scriptureIndex');
    
    if (!filteredData || !filteredData.scripture || filteredData.scripture.length === 0) {
        container.innerHTML = '<div class="no-results">No scripture references found.</div>';
        return;
    }
    
    // Sort by book and chapter
    const sortedScripture = [...filteredData.scripture].sort((a, b) => {
        if (a.book !== b.book) return a.book.localeCompare(b.book);
        return a.chapter - b.chapter;
    });
    
    let html = '';
    sortedScripture.forEach(item => {
        html += `
            <div class="concordance-item">
                <div class="concordance-ref">${item.reference}</div>
                <div class="concordance-context">${item.context}</div>
                <div class="concordance-sections">
                    ${item.sections.map(sec => 
                        `<span class="section-tag article-tag-clickable" onclick="showArticleModal(${sec})">Art. ${sec}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Render themes and keywords index
 */
function renderThemeIndex() {
    const container = document.getElementById('themesIndex');
    
    if (!filteredData || !filteredData.themes || filteredData.themes.length === 0) {
        container.innerHTML = '<div class="no-results">No themes found.</div>';
        return;
    }
    
    // Sort by importance (primary first) then alphabetically
    const sortedThemes = [...filteredData.themes].sort((a, b) => {
        if (a.importance !== b.importance) {
            return a.importance === 'primary' ? -1 : 1;
        }
        return a.keyword.localeCompare(b.keyword);
    });
    
    let html = '';
    sortedThemes.forEach(item => {
        html += `
            <div class="theme-item">
                <div class="theme-title">${item.keyword}</div>
                <div class="theme-description">${item.description}</div>
                <div class="concordance-sections">
                    ${item.sections.map(sec => 
                        `<span class="section-tag article-tag-clickable" onclick="showArticleModal(${sec})">Art. ${sec}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Render article directory
 */
function renderSectionDirectory() {
    const container = document.getElementById('sectionDirectory');
    
    if (!filteredData || !filteredData.sections || filteredData.sections.length === 0) {
        container.innerHTML = '<div class="no-results">No articles found.</div>';
        return;
    }
    
    // Sort by article number
    const sortedSections = [...filteredData.sections].sort((a, b) => a.number - b.number);
    
    let html = '';
    sortedSections.forEach(item => {
        html += `
            <div class="section-card" onclick="showArticleModal(${item.number})">
                <div class="section-number">Art. ${item.number}</div>
                <div class="section-part">Chapter ${item.part}: ${item.partTitle}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Navigate to a specific article in Book of Life
 * @param {number} sectionNumber - The article number to navigate to
 */
function navigateToBLSection(sectionNumber) {
    // Find the article in the data
    const section = concordanceData.sections.find(s => s.number === sectionNumber);
    
    if (!section) {
        console.error('Article not found:', sectionNumber);
        return;
    }
    
    // Determine if we're in www/pages or root
    const isInPages = window.location.pathname.includes('/pages/');
    
    // Map article numbers to pages
    let targetPage = null;
    
    // Articles 1-8: Nature and Mission
    if (sectionNumber >= 1 && sectionNumber <= 8) {
        targetPage = isInPages ? 'BLnatureandmission.html' : 'BLnatureandmission.html';
    }
    // Articles 9-13: Life of Consecration
    else if (sectionNumber >= 9 && sectionNumber <= 13) {
        targetPage = isInPages ? 'BLlifeofconsecration.html' : 'BLlifeofconsecration.html';
    }
    // Articles 14-110: Other chapters (not yet implemented as separate pages)
    else {
        // For now, redirect to "Who Are We" as a fallback
        targetPage = isInPages ? 'BLwhoarewe.html' : 'BLwhoarewe.html';
    }
    
    if (targetPage) {
        // Navigate to the page with an article anchor
        window.location.href = targetPage + '#article-' + sectionNumber;
    }
}

/**
 * Search concordance (for external use)
 * @param {string} query - Search query
 */
function searchConcordance(query) {
    const searchInput = document.getElementById('concordanceSearch');
    if (searchInput) {
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
    }
}

/**
 * Show article text in modal
 * @param {number} articleNumber - The article number to display
 */
function showArticleModal(articleNumber) {
    if (!concordanceData || !concordanceData.sections) {
        console.error('Concordance data not loaded');
        return;
    }
    
    const article = concordanceData.sections.find(s => s.number === articleNumber);
    
    if (!article) {
        console.error('Article not found:', articleNumber);
        return;
    }
    
    // Update modal content
    const modalTitle = document.getElementById('modalArticleTitle');
    const modalText = document.getElementById('modalArticleText');
    
    modalTitle.textContent = `Art. ${article.number}: ${article.title}`;
    
    if (article.text) {
        modalText.textContent = article.text;
    } else {
        modalText.innerHTML = '<em style="color: #6c757d;">Article text not available yet. This content will be added soon.</em>';
    }
    
    // Show modal
    const modal = document.getElementById('articleModal');
    modal.style.display = 'block';
    
    // Store current article number for copy function
    modal.dataset.articleNumber = articleNumber;
}

/**
 * Close article modal
 */
function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    modal.style.display = 'none';
    
    // Reset copy button
    const copyBtn = document.querySelector('.btn-copy');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
    copyBtn.classList.remove('copied');
}

/**
 * Copy article text to clipboard
 */
function copyArticleText() {
    const modalText = document.getElementById('modalArticleText');
    const modalTitle = document.getElementById('modalArticleTitle');
    const copyBtn = document.querySelector('.btn-copy');
    
    // Get full text including article number
    const fullText = `${modalTitle.textContent}\n\n${modalText.textContent}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(fullText).then(() => {
        // Show success feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.classList.add('copied');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Text';
            copyBtn.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy text. Please try selecting and copying manually.');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('articleModal');
    if (event.target === modal) {
        closeArticleModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeArticleModal();
    }
});

/**
 * Toggle collapsible sections
 * @param {string} section - 'scripture' or 'themes'
 */
function toggleSection(section) {
    const content = document.getElementById(section + 'Index');
    const toggle = document.getElementById(section + 'Toggle');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggle.classList.remove('collapsed');
    } else {
        content.classList.add('collapsed');
        toggle.classList.add('collapsed');
    }
}

/**
 * Update badge counts for sections
 */
function updateBadgeCounts() {
    if (filteredData) {
        const scriptureCount = filteredData.scripture ? filteredData.scripture.length : 0;
        const themesCount = filteredData.themes ? filteredData.themes.length : 0;
        
        const scriptureBadge = document.getElementById('scriptureBadge');
        const themesBadge = document.getElementById('themesBadge');
        
        if (scriptureBadge) scriptureBadge.textContent = scriptureCount;
        if (themesBadge) themesBadge.textContent = themesCount;
    }
}
