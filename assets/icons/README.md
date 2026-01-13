# PWA Icon Generation Instructions

## Required Icons for SPC Online

You need to create app icons in the following sizes:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Design Recommendations

### Icon Design Elements:
1. **Central Symbol**: Use a cross or fleur-de-lis (symbol of St. Paul of Chartres)
2. **Background Color**: #8B4513 (warm brown - religious dignity)
3. **Foreground Color**: White or #FAF9F6 (liturgical linen)
4. **Style**: Simple, recognizable, works at small sizes

### Option 1: Simple Cross Icon
- Centered cross on brown background
- Clean, minimal design
- High contrast for visibility

### Option 2: Fleur-de-lis Icon
- Traditional French religious symbol
- Associated with Chartres
- Elegant and distinctive

### Option 3: Initials "SPC"
- Clean typography
- Easy to recognize
- Works well at all sizes

## How to Generate Icons:

### Method 1: Using Online Tools
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 base image
3. Generate all required sizes automatically

### Method 2: Using Canva (Free)
1. Create a 512x512px design
2. Use the designs above as inspiration
3. Download as PNG
4. Use an icon resizer to create other sizes

### Method 3: Using Photoshop/GIMP
1. Create 512x512px image
2. Design with high contrast
3. Save as PNG with transparency
4. Resize to all required dimensions

### Method 4: Using Figma (Free)
1. Create artboard 512x512px
2. Design icon
3. Export at multiple scales

## Temporary Solution

Until you create custom icons, you can:

1. **Use a placeholder**: Create simple colored squares with text
2. **Use existing logo**: If you have an SPC logo, resize it
3. **Use Font Awesome**: Generate icon using FA icons as base

## Quick Placeholder Creation

Create a simple HTML file to generate placeholder icons:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Icon Generator</title>
    <style>
        canvas { display: block; margin: 10px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <script>
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        
        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Background
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(0, 0, size, size);
            
            // Cross
            ctx.fillStyle = '#FFFFFF';
            const lineWidth = size * 0.15;
            const crossSize = size * 0.6;
            const center = size / 2;
            
            // Vertical
            ctx.fillRect(center - lineWidth/2, center - crossSize/2, lineWidth, crossSize);
            // Horizontal
            ctx.fillRect(center - crossSize/2, center - lineWidth/2, crossSize, lineWidth);
            
            document.body.appendChild(canvas);
            
            // Download link
            canvas.toBlob(blob => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `icon-${size}.png`;
                a.textContent = `Download ${size}x${size}`;
                a.style.display = 'block';
                document.body.appendChild(a);
            });
        });
    </script>
</body>
</html>
```

Save this as `icon-generator.html`, open in browser, and download all icons.

## File Naming Convention

Save files as:
- `icon-72.png`
- `icon-96.png`
- `icon-128.png`
- `icon-144.png`
- `icon-152.png`
- `icon-192.png`
- `icon-384.png`
- `icon-512.png`

Place all files in the `/spconline/icons/` folder.

## Testing Icons

After creating icons:
1. Clear browser cache
2. Reload the app
3. Check manifest in DevTools (Application > Manifest)
4. Verify icons appear correctly

## Need Help?

If you need assistance creating icons, you can:
1. Ask me to create a more detailed design
2. Provide an existing SPC logo to adapt
3. Use the placeholder generator above as a starting point
