# Bingo Stage App

A professional bingo game web application designed for live events, optimized for projector displays and in-room presentations.

## Features

- **Host-Only View**: Clean, distraction-free interface for event hosts
- **Word-Based Bingo**: Uses customizable words instead of numbers
- **Professional Stage UI**: Modern, minimal design perfect for projection
- **GSAP Animations**: Smooth rolling animations that simulate a real bingo drum
- **Web Audio API**: Built-in beep sounds (no external files needed)
- **Used Words Tracking**: Bootstrap modal to view all called words
- **Keyboard Shortcuts**: Space/Enter to roll, U for used words, Ctrl+R to reset
- **Responsive Design**: Works on all screen sizes
- **Confetti Celebration**: Built-in celebration animation (Ctrl+C)

## Quick Start

```bash
npm install
npm start
```

The application will open at `http://localhost:3000`

## Customizing Words

Edit the `src/words.json` file to customize the word list:

```json
{
  "words": [
    "YOUR_WORD_1",
    "YOUR_WORD_2",
    "YOUR_WORD_3"
  ]
}
```

## Controls

### Mouse Controls
- **ROLL Button**: Click the red circular button (bottom-right) to roll next word
- **USED WORDS Button**: Click the blue button (bottom-left) to view called words
- **Reset Button**: Small circular button (top-left, appears after first roll)

### Keyboard Shortcuts
- **Space or Enter**: Roll next word
- **U**: Open used words modal
- **Ctrl + R**: Reset the entire game
- **Ctrl + C**: Trigger confetti celebration
- **ESC**: Close modal (when open)

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **Bootstrap 5**: Professional UI components
- **GSAP**: High-performance animations
- **Web Audio API**: Sound effects without external files

### Performance Optimized
- Efficient state management for 20-30+ participant events
- Smooth animations that won't overload projectors
- Minimal memory footprint
- No external dependencies for core functionality

### Browser Compatibility
- Modern browsers with Web Audio API support
- Works offline after initial load
- Responsive design for different screen ratios

## File Structure

```
src/
├── components/
│   ├── BingoGame.js      # Main game component
│   └── BingoGame.css     # Stage styling
├── words.json            # Customizable word list
├── App.js               # Root component
├── index.js             # React entry point
└── index.css            # Global styles
```

## Customization

### Adding More Words
Simply edit `src/words.json` and restart the application.

### Styling Changes
Modify `src/components/BingoGame.css` to change colors, fonts, or layout.

### Sound Effects
The app uses Web Audio API to generate beep sounds. No external audio files needed.

## Event Usage Tips

1. **Test Before Event**: Run the app and test all controls before your event
2. **Fullscreen Mode**: Use F11 to go fullscreen for projection
3. **Backup Plan**: Keep a printed word list as backup
4. **Reset Between Games**: Use Ctrl+R to start fresh games
5. **Celebrate Winners**: Use Ctrl+C for confetti when someone wins

## Troubleshooting

**No Sound**: Some browsers require user interaction before audio. Click the ROLL button once to enable audio.

**Performance Issues**: Close other browser tabs and applications for best performance during events.

**Words Not Loading**: Ensure `words.json` is valid JSON format with no syntax errors.

## License

Open source - feel free to customize for your events!
