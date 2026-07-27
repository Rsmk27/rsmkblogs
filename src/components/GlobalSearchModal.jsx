import React, { useState, useEffect } from 'react';

const SEARCH_INDEX = [
  { title: "Mastering MATLAB: Numerical Computing & Simulink", type: "Article", category: "Engineering Software", url: "/blogs/matlab-guide", tags: ["MATLAB", "Simulink", "Signal Processing", "MathWorks", "Matrix", "Robotics"] },
  { title: "ESP8266 & ESP32 IoT Engineering", type: "Article", category: "Embedded Systems", url: "/blogs/esp8266", tags: ["ESP32", "ESP8266", "IoT", "Wi-Fi", "Microcontrollers"] },
  { title: "Arduino Nano Architecture & Industrial Controls", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-nano", tags: ["Arduino", "ATmega328P", "PWM", "Sensors", "PLC"] },
  { title: "Arduino MEGA 2560 in Industrial Engineering", type: "Article", category: "Industrial Automation", url: "/blogs/arduino-mega", tags: ["Arduino", "ATmega2560", "Modbus", "PLC", "SCADA"] },
  { title: "Arduino UNO R4 Hardware Deep-Dive", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-uno", tags: ["Arduino", "RA4M1", "ARM", "Renesas", "CAN Bus"] },
  { title: "Complete Arduino Hardware & Software Guide", type: "Article", category: "Embedded Systems", url: "/blogs/arduino-guide", tags: ["Arduino", "Microcontrollers", "IDE", "C++"] },
  { title: "Quantum Computing Principles & Hardware", type: "Article", category: "Cutting-Edge Tech", url: "/blogs/quantum-computing", tags: ["Quantum", "Qubits", "Physics", "Superconducting"] },
  { title: "Smart Home Automation Systems Architecture", type: "Article", category: "IoT & Smart Systems", url: "/blogs/smart-home", tags: ["IoT", "ESP32", "Zigbee", "Home Assistant", "Automation"] },
  { title: "Semiconductors & Silicon Manufacturing Process", type: "Article", category: "Semiconductors", url: "/blogs/semiconductors", tags: ["Silicon", "Fab", "Transistors", "TSMC", "Intel"] },
  { title: "5G & 6G Wireless Communication Engineering", type: "Article", category: "Networking", url: "/blogs/5g-6g-tech", tags: ["5G", "6G", "Wireless", "mmWave", "Antennas"] },
  { title: "AI-Powered Autonomous Drones & Flight Controllers", type: "Article", category: "Robotics", url: "/blogs/ai-drones", tags: ["Drones", "Robotics", "Flight Controller", "PX4", "Computer Vision"] },
  { title: "Electric Vehicle (EV) Charging Architecture", type: "Article", category: "Power Electronics", url: "/blogs/ev-charging", tags: ["EV", "Power Electronics", "Inverters", "Battery", "OCPP"] },
  { title: "Renewable Energy & Microgrid Control Systems", type: "Article", category: "Smart Energy", url: "/blogs/renewable-energy", tags: ["Solar", "Wind", "Inverters", "Grid", "Microgrid"] },
  { title: "Engineering Career & Technical Skills Roadmap", type: "Article", category: "Career", url: "/blogs/careers", tags: ["Career", "Skills", "Engineering", "Embedded", "Automation"] }
];

export default function GlobalSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filtered = query.trim()
    ? SEARCH_INDEX.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase()) ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  return (
    <>
      <button className="search-trigger-btn" onClick={() => setIsOpen(true)} aria-label="Open Global Search">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <span>Search documentation...</span>
        <kbd>Ctrl K</kbd>
      </button>

      {isOpen && (
        <div className="search-modal-backdrop active" onClick={() => setIsOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="search-input-header">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documentation, technologies, roadmaps..."
                autoFocus
              />
              <kbd style={{ fontSize: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px' }}>
                ESC
              </kbd>
            </div>

            <div className="search-results-list">
              {!query.trim() ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  Type any keyword to search engineering knowledge base...
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
                  No documentation matching "{query}"
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <a key={idx} href={item.url} className={`search-result-item ${idx === 0 ? 'selected' : ''}`}>
                    <div className="search-result-title">
                      <span>{item.title}</span>
                      <span className="badge" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--primary-color)', fontSize: '0.7rem' }}>
                        {item.type}
                      </span>
                    </div>
                    <div className="search-result-meta">
                      {item.category} {item.tags ? '• ' + item.tags.slice(0, 3).join(', ') : ''}
                    </div>
                  </a>
                ))
              )}
            </div>

            <div className="search-modal-footer">
              <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>ESC</kbd> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
