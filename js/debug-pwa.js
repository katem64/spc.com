// Debug script for PWA controls positioning
console.log('=== PWA DEBUG START ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking PWA controls...');
    
    const pwaControls = document.querySelector('.pwa-controls');
    
    if (pwaControls) {
        console.log('✓ PWA controls div found');
        console.log('PWA controls innerHTML:', pwaControls.innerHTML);
        console.log('PWA controls children:', pwaControls.children.length);
        
        const rect = pwaControls.getBoundingClientRect();
        console.log('PWA controls position:', {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            bottom: rect.bottom
        });
        
        const computed = window.getComputedStyle(pwaControls);
        console.log('PWA controls styles:', {
            position: computed.position,
            top: computed.top,
            zIndex: computed.zIndex,
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            backgroundColor: computed.backgroundColor,
            padding: computed.padding,
            margin: computed.margin
        });
        
        // Check if masthead is covering it
        const masthead = document.querySelector('.masthead');
        if (masthead) {
            const mastheadRect = masthead.getBoundingClientRect();
            console.log('Masthead position:', {
                top: mastheadRect.top,
                height: mastheadRect.height,
                bottom: mastheadRect.bottom
            });
            const mastheadComputed = window.getComputedStyle(masthead);
            console.log('Masthead styles:', {
                position: mastheadComputed.position,
                zIndex: mastheadComputed.zIndex,
                marginTop: mastheadComputed.marginTop
            });
        }
        
        // Check navbar
        const navbar = document.querySelector('nav.navbar');
        if (navbar) {
            const navRect = navbar.getBoundingClientRect();
            console.log('Navbar position:', {
                height: navRect.height,
                bottom: navRect.bottom
            });
        }
        
    } else {
        console.error('✗ PWA controls div NOT found!');
    }
    
    console.log('=== PWA DEBUG END ===');
});
