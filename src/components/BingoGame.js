import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { gsap } from 'gsap';
import wordsData from '../words.json';
import './BingoGame.css';

const BingoGame = () => {
  const [currentWord, setCurrentWord] = useState('READY?');
  const [displayWord, setDisplayWord] = useState('READY?');
  const [usedWords, setUsedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([...wordsData.words]);
  const [showUsedWordsModal, setShowUsedWordsModal] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  
  const wordRef = useRef(null);
  const audioContextRef = useRef(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported');
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play beep sound using Web Audio API
  const playBeep = useCallback(() => {
    if (!audioContextRef.current) return;
    
    try {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.1);
    } catch (error) {
      console.warn('Error playing beep:', error);
    }
  }, []);

  // Rolling animation using GSAP + whole-word scrambling
  const animateWordRoll = useCallback((newWord) => {
    if (!wordRef.current) return;
    
    const container = wordRef.current;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Gentle scale/opacity animation on the whole word while scrambling
    gsap.fromTo(
      container,
      { scale: 0.95, opacity: 0.6 },
      { scale: 1.05, opacity: 1, duration: 0.6, ease: 'power1.inOut' }
    );

    const scrambleDuration = 1000; // ms
    const intervalDelay = 80; // ms
    const startTime = Date.now();
    const targetLength = newWord.length;

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= scrambleDuration) {
        clearInterval(intervalId);
        setCurrentWord(newWord);
        setDisplayWord(newWord);
        setIsRolling(false);
        return;
      }

      let randomWord = '';
      for (let i = 0; i < targetLength; i++) {
        const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        randomWord += randomChar;
      }
      setDisplayWord(randomWord);
    }, intervalDelay);

  }, []);

  // Roll for next word
  const rollNextWord = useCallback(() => {
    if (isRolling || availableWords.length === 0) return;
    
    setIsRolling(true);
    playBeep();
    
    // Select random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];
    
    // Update state
    const newAvailableWords = availableWords.filter((_, index) => index !== randomIndex);
    setAvailableWords(newAvailableWords);
    setUsedWords(prev => [...prev, selectedWord]);
    
    // Animate word change
    setTimeout(() => {
      animateWordRoll(selectedWord);
    }, 200);
    
  }, [availableWords, isRolling, playBeep, animateWordRoll]);

  // Reset game
  const resetGame = () => {
    setCurrentWord('READY?');
    setDisplayWord('READY?');
    setUsedWords([]);
    setAvailableWords([...wordsData.words]);
    setIsRolling(false);
  };

  // Confetti celebration (prepared function)
  const triggerConfetti = useCallback(() => {
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      
      document.body.appendChild(confetti);
      
      gsap.to(confetti, {
        duration: Math.random() * 3 + 2,
        y: window.innerHeight + 100,
        x: '+=' + (Math.random() * 200 - 100),
        rotation: Math.random() * 360,
        opacity: 0,
        ease: 'power2.out',
        onComplete: () => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }
      });
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault();
        rollNextWord();
      } else if (event.key === 'u' || event.key === 'U') {
        setShowUsedWordsModal(true);
      } else if (event.key === 'r' || event.key === 'R') {
        if (event.ctrlKey) {
          resetGame();
        }
      } else if (event.key === 'c' || event.key === 'C') {
        if (event.ctrlKey) {
          triggerConfetti();
        }
      } else if (event.key === 'p' || event.key === 'P') {
        if (event.ctrlKey) {
          setPresentationMode(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [rollNextWord, triggerConfetti]);

  return (
    <div className={`bingo-stage ${presentationMode ? 'presentation-mode' : ''}`}>
      <div className="stage-background">
        <div className="background-glow"></div>
      </div>
      
      <div className="main-content">
        <div className="word-display" ref={wordRef}>
          {displayWord}
        </div>
        
        <div className="word-counter">
          {usedWords.length > 0 && (
            <span>Words Called: {usedWords.length}</span>
          )}
        </div>
      </div>

      {/* Roll Button */}
      <button 
        className={`roll-button ${isRolling ? 'rolling' : ''}`}
        onClick={rollNextWord}
        disabled={isRolling || availableWords.length === 0}
        title="Space or Enter to roll"
      >
        {isRolling ? '...' : 'ROLL'}
      </button>

      {/* Used Words Button */}
      <button 
        className="used-words-button"
        onClick={() => setShowUsedWordsModal(true)}
        title="Press 'U' to open"
      >
        USED WORDS
      </button>

      {/* Reset Button (Hidden, Ctrl+R) */}
      {usedWords.length > 0 && (
        <button 
          className="reset-button"
          onClick={resetGame}
          title="Ctrl+R to reset"
        >
          ↻
        </button>
      )}

      {/* Used Words Modal */}
      <Modal 
        show={showUsedWordsModal} 
        onHide={() => setShowUsedWordsModal(false)}
        size="lg"
        centered
        className="used-words-modal"
      >
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Called Words</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <div className="words-stats">
            <span className="total-counter">Total Rolled Words: {usedWords.length}</span>
            <span className="remaining-counter">Remaining: {availableWords.length}</span>
          </div>
          
          {usedWords.length === 0 ? (
            <div className="no-words">No words have been called yet.</div>
          ) : (
            <div className="words-grid">
              {usedWords.map((word, index) => (
                <div key={index} className="word-item">
                  <span className="word-number">#{index + 1}</span>
                  <span className="word-text">{word}</span>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <Button variant="secondary" onClick={() => setShowUsedWordsModal(false)}>
            Close
          </Button>
          {usedWords.length > 0 && (
            <Button variant="outline-warning" onClick={triggerConfetti}>
              🎉 Celebrate
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Presentation mode indicator */}
      {presentationMode && (
        <div className="presentation-indicator">
          PRESENTATION MODE • Ctrl+P to toggle
        </div>
      )}

      {/* Keyboard shortcuts info */}
      <div className="shortcuts-hint">
        Space/Enter: Roll • U: Used Words • Ctrl+R: Reset • Ctrl+C: Confetti • Ctrl+P: Presentation Mode
      </div>

      {/* Love footer */}
      <div className="love-footer">
        made with <span className="love-heart">❤</span> by Technotutor
      </div>
    </div>
  );
};

export default BingoGame;
