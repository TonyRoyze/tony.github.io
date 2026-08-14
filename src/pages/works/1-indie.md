---
title: Indie Developer
date: Since 2023
url: https://github.com/TonyRoyze
location: Remote
org: Freelance
tags: ["Accessibility", "Assistive Technology", "Swift", "SwiftUI", "AppKit", "Tauri", "Rust"]
---

As an independent developer, I build accessibility-focused software that combines assistive technology, privacy-conscious processing, and keyboard-first interaction design.

- **Monocle**: Developed a native macOS menu-bar app for live screen magnification, local OCR, and spoken reading.
    - Built with **AppKit**, **ScreenCaptureKit**, **Apple Vision**, and **AVFoundation**, with magnification, text recognition, and speech processed on-device.
    - Added global keyboard shortcuts and optional AI screen descriptions using a user-provided API key stored securely in Keychain.
- **Meta Vision**: Created an iOS assistive-reading prototype for blind and low-vision users.
    - Built an iPhone camera pipeline that checks image quality, performs **Apple Vision OCR**, verifies text with an on-device **Gemma** model through **LiteRT-LM**, and reads the result aloud.
    - Designed accessible controls for repeating, stopping, adjusting speech speed, and reviewing recent readings, with Meta Ray-Ban integration planned.
- **B-Counting**: Designed a command-driven desktop accounting application for blind and low-vision users.
    - Combined concise commands with guided, one-question-at-a-time forms, predictable focus, screen-reader-friendly announcements, and complete keyboard navigation.
    - Planned a **Tauri** and **Rust** architecture with portable **JSON Lines** records, CSV export, backups, and a clear audit trail.
