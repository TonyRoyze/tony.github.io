# Meta Vision

Meta Vision is an iOS assistant designed to help blind and low-vision users read documents quickly and accurately. The current version uses the iPhone camera; Meta Ray-Ban support remains planned.

The planned experience is:

`Capture with iPhone camera → check image → OCR → on-device Gemma verification → speak aloud`

## Current status

The first runnable vertical slice uses the built-in iPhone camera, checks image quality, runs Apple Vision OCR, verifies and summarizes the text with an imported on-device Gemma model through LiteRT-LM, then reads it aloud with AVFoundation. The UI also supports repeat, stop, adjustable speech speed, and an on-device recent-reading history.

Physical glasses integration, richer image-quality guidance, and hands-free voice commands are still planned.

## Planned MVP

- Connect to standard Meta Ray-Ban glasses.
- Capture a document from the glasses camera.
- Extract and verify text with OCR and Gemma.
- Read the result through the glasses’ open-ear speakers.
- Support “read this,” “repeat,” “summarize,” and “stop.”
- Provide clear feedback when an image is blurry, dark, or incomplete.

## Technology direction

- SwiftUI for the iOS interface.
- Meta Wearables Device Access Toolkit for glasses connectivity.
- Apple Vision/OCR and image preprocessing for document capture.
- Gemma for OCR correction, reading order, summaries, and questions.
- AVFoundation and Speech for audio input/output.
- A mock glasses provider for development without physical hardware.

## Requirements

- macOS with Xcode.
- An iPhone running the project’s supported iOS version.
- Meta AI app and Developer Mode for physical glasses testing.
- A Meta developer account and access to the Wearables Device Access Toolkit.
- A compatible Gemma `.litertlm` model from [Google AI Edge](https://developers.google.com/edge/litert-lm/swift), downloaded under its applicable license.

## Getting started

1. Open `meta-vision.xcodeproj` in Xcode.
2. Select an iPhone simulator or connected iPhone.
3. Build and run the `meta-vision` target.
4. In Settings, import a compatible `.litertlm` Gemma model downloaded under its applicable license.
5. Tap **Read this**, capture a document, and let the on-device pipeline verify and speak it.

## Accessibility and privacy goals

Accessibility is a core requirement, not a later enhancement. The app will use VoiceOver-friendly controls, high-contrast UI, adjustable speech speed, short spoken feedback, and explicit uncertainty handling.

Document images should be processed on-device where practical. Temporary images should be deleted automatically, and any backend transfer must be encrypted and clearly disclosed to the user.

## Disclaimer

This project is an assistive technology prototype. It must not be treated as a replacement for professional medical, legal, financial, or safety-critical document interpretation.
