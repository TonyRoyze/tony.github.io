# Monocle

Monocle is a native macOS 13+ menu-bar app for live screen magnification, local OCR, and spoken reading. It uses AppKit, ScreenCaptureKit, Vision, AVFoundation, Carbon hot keys, and ServiceManagement. Magnification, OCR, and speech stay on-device; optional AI screen descriptions use a user-provided OpenAI API key stored in Keychain.

This repository contains the native macOS app source, tests, and install script for Monocle.

## What it does

- Live circular magnifier that follows the mouse pointer.
- Global shortcuts for OCR capture and spoken reading.
- Local text recognition and speech synthesis.
- Optional AI screen descriptions on explicit user request.
- No browser renderer, web server, or Dock-centric app shell.

## Requirements

- macOS 13 or newer
- Xcode
- XcodeGen (`brew install xcodegen`)

## Build

1. Generate the Xcode project:

```sh
xcodegen generate
```

2. Open `Monocle.xcodeproj` in Xcode.
3. Select your Development Team.
4. Build the `Monocle` scheme.

For a command-line development build:

```sh
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild \
  -project Monocle.xcodeproj -scheme Monocle -configuration Debug \
  CODE_SIGNING_ALLOWED=NO build
```

## First launch

- The app opens Settings on first launch.
- Monocle requests Screen Recording permission so it can capture the display.
- macOS may require quitting and reopening the app after permission is granted.

## Screen Recording

Monocle needs Screen Recording permission for the magnifier and screen captures. Keep the bundle identifier and signing identity stable so macOS continues to recognize the app as the same installation.

The installed app is expected at `/Applications/Monocle.app`.

## AI screen descriptions

To enable AI descriptions:

1. Open Settings.
2. Choose a supported vision model.
3. Add an OpenAI API key.

The key is stored in macOS Keychain, not in preferences. Use **Describe Screen with AI** from the menu bar or press `Command-Option-Shift-4`.

Only that action uploads a temporary, downscaled capture. The file is deleted after the response is received. API usage may incur charges.

## Install

Use the **Install Monocle** scheme to build and replace the installed app.

After a signed build, the post-build action:

- quits the running menu-bar process,
- verifies the new bundle,
- replaces `/Applications/Monocle.app`,
- moves the previous copy to Trash,
- launches the installed app.

If replacement fails after the old bundle is moved aside, the installer restores it.

## Tests

The repository includes unit tests for:

- OCR reading order
- shortcut validation
- display coordinate mapping

Run them from the `Monocle` scheme in Xcode or with `xcodebuild`.

## Repository layout

- `Monocle/` - app source
- `MonocleTests/` - unit tests
- `scripts/install-built-app.sh` - install helper
