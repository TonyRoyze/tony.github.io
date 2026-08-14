# B-Counting: Accessible Command-Driven Accounting App

## 1. Product summary

B-Counting is a desktop accounting application designed primarily for blind and low-vision users. It combines the speed and predictability of a command-line interface with the safety and discoverability of a guided form.

The application opens with a single command prompt. A user enters a short command such as `new`, `summary`, or `help`. The app then presents a small list of choices or asks one question at a time. Every task must be possible with the keyboard, and every state change must be announced in language suitable for listening rather than simply reading the visible screen aloud.

Transactions are stored in human-readable text files. This keeps the data portable, easy to inspect, simple to back up, and straightforward to process later with scripts or other accounting software.

## 2. Goals

- Allow a blind user to record common transactions quickly and independently.
- Make the complete workflow usable without a mouse or sighted assistance.
- Give concise, meaningful spoken feedback for prompts, options, errors, and results.
- Store financial records in documented, open, text-based formats.
- Support uncategorized transactions that can be reviewed and labeled later.
- Produce useful summaries by date, transaction type, and category.
- Preserve a clear audit trail and avoid silent data loss.

## 3. Non-goals for the first release

- Full double-entry bookkeeping.
- Bank account synchronization.
- Invoicing, payroll, tax filing, or inventory management.
- Cloud accounts or collaboration.
- Automatic financial or tax advice.
- Rich charts as a primary reporting method.

These may be considered later, but the first release should remain small, reliable, and easy to learn.

## 4. Intended users

### Primary user

A blind or low-vision person who prefers keyboard-driven software and uses a screen reader such as NVDA, JAWS, VoiceOver, or Narrator.

### Secondary user

A trusted sighted person who may review uncategorized entries, help correct records, or export data. This person should be able to work with either the application or the underlying text files without changing their structure accidentally.

## 5. Recommended desktop framework

Use **Tauri** for the initial implementation, with a semantic HTML interface and a Rust backend.

Reasons:

- Smaller application and memory footprint than a typical Electron build.
- Rust is well suited to safe, atomic file operations and validation.
- The web-based UI layer can use native accessibility semantics such as labels, list boxes, status regions, and alerts.
- The core accounting and storage logic can remain independent from the interface and be tested separately.

Electron remains a valid fallback if cross-platform screen-reader testing reveals major WebView accessibility differences that cannot be resolved. A short prototype should be tested with real assistive technologies before committing to the framework permanently.

## 6. Core interaction model

### 6.1 Home prompt

On launch, keyboard focus is placed in the command input.

Example visual state:

```text
B-Counting
Type a command. Type help to list commands.

> _
```

Suggested spoken announcement:

> B-Counting ready. Command prompt. Type help for available commands.

The prompt accepts short commands and selected aliases. Commands are case-insensitive, and leading or trailing spaces are ignored.

### 6.2 Guided command flow

After a command is accepted, the prompt changes into a guided sequence. Only the current question and essential context are announced. Previous steps remain available in a history region but are not repeatedly spoken.

The user can:

- Press Up or Down Arrow to move through options.
- Press Enter to choose the focused option or submit typed input.
- Press Escape to cancel the current operation and return to the main prompt.
- Press Backspace while editing text normally.
- Press a documented shortcut to repeat the current prompt.
- Press a documented shortcut to hear current progress, such as “New expense, step 2 of 4, amount.”

### 6.3 Example: new transaction

```text
> new

Transaction type, 1 of 2:
> Income
  Expense

Amount:
> 1250.00

Description:
> Monthly internet payment

Category, optional:
> Utilities

Review:
Expense, 1,250.00, Monthly internet payment, category Utilities.
Save? Yes / No / Edit
```

After saving, the app announces a concise result:

> Expense saved. 1,250.00 for Monthly internet payment, category Utilities. Transaction ID 20260811-004. Command prompt.

If the category is left blank:

> Expense saved without a category. It has been added to the review list. Command prompt.

The app must always offer a review step before writing a transaction.

## 7. Initial command set

| Command | Aliases | Purpose |
| --- | --- | --- |
| `new` | `n`, `add` | Record a new income or expense. |
| `summary` | `s`, `report` | Summarize records by period, type, or category. |
| `recent` | `r`, `history` | Read recent transactions. |
| `find` | `f`, `search` | Search by description, category, amount, date, or ID. |
| `review` | `u`, `uncategorized` | Label or inspect uncategorized transactions. |
| `categories` | `cat` | List, add, rename, or archive categories. |
| `edit` | `e` | Edit a transaction by ID, normally selected from search or recent results. |
| `delete` | `d` | Mark a transaction as deleted after explicit confirmation. |
| `undo` | — | Reverse the most recent eligible change in the current session. |
| `export` | `x` | Export records or a report to CSV or JSON Lines. |
| `backup` | `b` | Create a dated backup archive. |
| `settings` | `set` | Change currency, date format, speech detail, and related preferences. |
| `help` | `h`, `?` | List commands or explain one command. |
| `quit` | `q`, `exit` | Close the application after pending changes are handled. |

Unknown commands should produce a helpful response, for example:

> “summery” is not a command. Did you mean “summary”? Press Enter to use summary, or Escape to return.

## 8. New transaction workflow

1. **Choose type:** Income or Expense.
2. **Enter amount:** Accept local decimal conventions, but store a normalized decimal value. Never use floating-point arithmetic for money.
3. **Enter description:** Required short description in the user's own words.
4. **Choose category:** Select an existing category, create one, or leave blank.
5. **Review:** Read a natural-language summary and offer Save, Edit, or Cancel.
6. **Save:** Write the record atomically and announce the result with its transaction ID.

Defaults may be offered but must be spoken explicitly. The app must never infer and silently apply a category in the first release.

### Validation examples

- Empty amount: “Amount is required. Enter a number greater than zero.”
- Invalid amount: “I could not read that amount. Example: 1250 point 50.”
- Negative amount: “Enter the amount without a minus sign. Income or expense determines its direction.”
- Empty description: “Description is required. Briefly describe this transaction.”
- Very large amount: Read the interpreted value and request confirmation.

## 9. Accessibility and spoken-output design

### 9.1 Core principle

Visible content and spoken content serve different purposes. The accessibility layer should convey the meaning, state, and available action—not mechanically announce every character displayed on screen.

For example, a visual table row might be:

```text
2026-08-11 | Expense | 1,250.00 | Utilities | Internet
```

Its accessible name should be closer to:

> Expense of 1,250.00 on 11 August 2026. Internet. Category Utilities.

### 9.2 Screen-reader behavior

- Use standard semantic controls wherever possible: text inputs, buttons, headings, lists, list boxes, and dialogs.
- Give every control a clear accessible name, role, state, and short instruction where necessary.
- Use a polite live region for prompt changes and successful actions.
- Use an assertive alert only for errors that block progress.
- Move programmatic focus only when the user's task moves to a new control or dialog.
- Do not announce decorative characters, prompt symbols, layout separators, or the entire transcript after every update.
- Debounce announcements so rapid option navigation does not create a long speech queue.
- Announce list position, such as “Expense, 2 of 2, selected.”
- Preserve screen-reader browse and focus behavior; do not intercept standard shortcuts unnecessarily.
- Never rely on color, position, icons, sound, or timing alone to communicate information.

### 9.3 Speech strategy

The first release should primarily use the operating system screen reader through accessible UI semantics, rather than forcing a separate text-to-speech engine. This respects the user's chosen voice, rate, verbosity, and braille display.

Optional direct speech may later be offered for users without a screen reader, but it must be disabled automatically or manually when it would cause duplicate announcements.

### 9.4 Adjustable verbosity

Provide three announcement modes:

- **Brief:** Prompt and essential result only.
- **Standard:** Prompt, context, list position, and result.
- **Detailed:** Adds examples, shortcuts, and explanations.

Important confirmations, validation errors, and data-loss warnings must remain clear in every mode.

### 9.5 Keyboard and focus requirements

- A visible focus indicator with high contrast.
- Logical, stable tab order.
- No keyboard traps.
- Commands and forms usable at 200% zoom and with large system text.
- Optional high-contrast themes; support operating-system dark and forced-color modes.
- Reduced-motion preference honored.
- Focus returns to a predictable location after Save, Cancel, and errors.

## 10. Data storage design

### 10.1 Recommended format

Use **JSON Lines** (`.jsonl`) as the canonical transaction format. Each line is one complete JSON object, so records remain text-based, append-friendly, portable, and easy to process with scripts. Provide CSV export for spreadsheet users.

Do not make free-form prose the canonical format; it is easy to read but difficult to validate reliably when descriptions contain separators or line breaks.

Example `transactions.jsonl`:

```json
{"schema_version":1,"id":"20260811-004","created_at":"2026-08-11T14:32:10+05:30","transaction_date":"2026-08-11","type":"expense","amount":"1250.00","currency":"LKR","description":"Monthly internet payment","category":"utilities","status":"active"}
```

Money is stored as a decimal string, not a binary floating-point number.

### 10.2 File layout

```text
B-Counting/
├── data/
│   ├── transactions.jsonl
│   ├── uncategorized.jsonl
│   ├── categories.json
│   └── changes.jsonl
├── exports/
├── backups/
└── settings.json
```

The exact operating-system data directory should follow platform conventions. The app should include an `open data folder` command or action so the user does not need to locate it manually.

### 10.3 Uncategorized records

To satisfy the separate-file requirement, a transaction without a category is written to the canonical transaction log and also represented in `uncategorized.jsonl` as a review item referencing its transaction ID. This avoids losing the transaction from totals while maintaining a simple review queue.

Example:

```json
{"transaction_id":"20260811-005","queued_at":"2026-08-11T14:40:00+05:30","status":"pending"}
```

When categorized later, append a resolved event to the review file and an update event to `changes.jsonl`. Do not silently rewrite historical records in place.

### 10.4 Safety and integrity

- Use atomic writes: write to a temporary file, flush, then rename where rewriting is necessary.
- Keep append-only change records for edits, deletions, category changes, and restores.
- Treat deletion as a reversible status change, not immediate physical removal.
- Generate stable unique transaction IDs.
- Validate every record while loading and report malformed lines without discarding valid data.
- Prevent two running app instances from writing simultaneously, or use a safe locking strategy.
- Create automatic dated backups on a configurable schedule and before migrations.
- Provide a restore preview before replacing active data.

## 11. Summaries and reports

The `summary` command guides the user through:

1. Period: Today, This week, This month, Custom range, or All time.
2. View: Overall, Income, Expenses, or By category.
3. Optional filters: category or description.
4. Output: Read now, Save as text, Export CSV, or Export JSON Lines.

Spoken summary example:

> August 2026 summary. Income: 150,000 rupees across 2 transactions. Expenses: 48,500 rupees across 14 transactions. Net: positive 101,500 rupees. Largest expense category: Housing, 30,000 rupees. Uncategorized: 2 transactions totaling 3,500 rupees.

For long results, announce an overview first. Let the user request details, move item by item, repeat the current item, or save the report. Do not automatically read a long table from beginning to end.

## 12. Categories and later labeling

Initial suggested categories may include:

- Salary
- Other income
- Food
- Housing
- Utilities
- Transport
- Health
- Education
- Entertainment
- Other expense

These are editable and should not be imposed on the user.

The `review` command should:

1. Announce the number and total value of pending uncategorized transactions.
2. Present one transaction at a time in natural language.
3. Offer existing categories, create category, skip, edit transaction, or finish.
4. Confirm each category assignment and proceed to the next item.

A sighted reviewer may use the same workflow or carefully edit interoperable export files. Direct editing of canonical files should be documented as advanced usage because malformed text could damage the dataset.

## 13. Suggested application architecture

```text
Semantic UI
  Command input, guided prompts, option lists, history, accessible announcements
        |
Command controller
  Parses commands, manages state, cancellation, review, and undo
        |
Domain layer
  Transactions, categories, validation, decimal money, summaries
        |
Storage layer
  JSONL repositories, locks, atomic writes, audit log, backups, exports
```

Keep the domain and storage layers independent of Tauri. This allows unit tests, a future real CLI, or a different desktop shell without rewriting accounting rules.

### Suggested modules

- `commands`: command names, aliases, help, and dispatch.
- `flows`: state machines for new, edit, delete, review, summary, and export.
- `domain`: transaction and category models, money rules, and validation.
- `reports`: filters, aggregation, natural-language report generation.
- `storage`: repositories, serialization, locking, migrations, and backups.
- `accessibility`: announcement messages, verbosity rules, and focus coordination.
- `ui`: semantic components and visual presentation.

## 14. Privacy and security

- Store all data locally by default.
- Do not add analytics, cloud sync, or remote error reporting without explicit opt-in.
- Do not include transaction descriptions or amounts in diagnostic logs.
- Explain where data and backups are stored.
- Support encrypted backups as a later feature; clearly state when current files are unencrypted.
- Sanitize filenames and exported content.
- Treat imported files as untrusted and validate their schema and size.

## 15. Testing strategy

### Automated testing

- Unit tests for decimal money, validation, summaries, category changes, and date ranges.
- Parser tests for commands, aliases, whitespace, case, and likely typing errors.
- State-machine tests for every flow, including Cancel, Back, Edit, and invalid input.
- Storage tests for partial writes, malformed lines, duplicate IDs, locking, migration, backup, and recovery.
- Accessibility checks for names, roles, states, labels, focus order, and live regions.
- Snapshot tests for natural-language announcements to prevent accidental verbosity changes.

### Manual assistive-technology testing

Test real builds with:

- Windows: NVDA first, then Narrator and JAWS where available.
- macOS: VoiceOver.
- Keyboard-only use without a screen reader.
- High contrast, 200% zoom, large text, reduced motion, and braille display where possible.

Include blind users in prototype and release testing. Automated accessibility tools cannot verify whether spoken interactions are understandable, appropriately timed, or efficient.

### Critical acceptance scenarios

- Launch the app and create an expense without using a mouse.
- Create an income entry with no category and find it in the review queue.
- Correct an invalid amount without losing the description or other entered values.
- Cancel at every step without writing a partial transaction.
- Find, edit, delete, and restore a transaction by keyboard.
- Hear a concise monthly summary before navigating its details.
- Recover valid transactions when one line in a file is malformed.
- Restore a backup with an accessible confirmation and preview.

## 16. Delivery roadmap

### Phase 0: Interaction prototype

- Build the command prompt and one complete `new` flow using temporary in-memory data.
- Implement accessible list navigation, announcements, cancellation, and review.
- Test the prototype with NVDA and VoiceOver, including at least one blind user if possible.
- Decide whether Tauri's platform accessibility is sufficient or whether Electron is required.

### Phase 1: Minimum viable product

- Commands: `new`, `recent`, `summary`, `review`, `help`, and `quit`.
- JSON Lines transaction storage and separate uncategorized review queue.
- Category management with a small editable default list.
- Review-before-save and predictable error handling.
- Local backups and plain-text report export.
- Standard and detailed speech modes.

### Phase 2: Reliable daily use

- Commands: `find`, `edit`, `delete`, `undo`, `export`, and `settings`.
- Append-only audit events, restore, file locking, and schema migrations.
- CSV export and more report filters.
- Packaging, signing, automatic update design, and expanded assistive-technology testing.

### Phase 3: Optional extensions

- Import from validated CSV templates.
- Recurring transaction reminders.
- Multiple accounts or ledgers.
- Optional encrypted data vault and encrypted backups.
- A real terminal CLI sharing the same domain and storage layers.
- Carefully reviewed category suggestions that always require user confirmation.

## 17. MVP completion criteria

The MVP is ready when:

- A user can complete all primary workflows using only the keyboard and a screen reader.
- Spoken prompts describe context and action without redundantly reading the full screen.
- Transactions survive application restart and remain readable as documented text files.
- Uncategorized transactions appear in totals and in a separate review queue.
- Reports calculate income, expenses, net amount, and category totals correctly.
- Failed writes do not corrupt or silently lose existing data.
- Backup and recovery have been tested.
- Critical workflows pass with NVDA and VoiceOver.
- At least one blind user has completed usability testing and blocking findings have been addressed.

## 18. Early design decisions to validate

Before full implementation, validate these decisions with target users:

- Whether users prefer typed command aliases, numbered shortcuts, or both.
- Whether arrow-key option lists feel faster than typing an option name.
- The best shortcut for repeating a prompt without conflicting with screen readers.
- How much context should be included in Brief, Standard, and Detailed modes.
- Whether uncategorized entries should be reviewed immediately, at startup, or only on request.
- Preferred currency and date-reading behavior for the first supported region.
- Whether editing canonical files directly is genuinely useful or whether export/import is safer.

The most important early milestone is not the storage engine or the visual design. It is a tested, comfortable spoken interaction loop for entering and reviewing a transaction.
