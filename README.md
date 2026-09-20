# FixMate: Smart Circuit Solutions

Build a modern, responsive web application called "FixMate".

FixMate is an intelligent electronics troubleshooting assistant designed for engineering students and electronics laboratory users.

The website should have a professional modern electronics-themed UI.

Create these pages:

1. Home

2. Diagnose

3. Circuit Analyzer

4. History

5. About

HOME PAGE:

- Show the FixMate logo/name

- Heading: "Fix Your Circuit Smarter"

- Subtitle: "An intelligent electronics fault diagnosis assistant for students and lab users."

- Add a prominent "Start Diagnosis" button

- Add an "Upload Circuit" button

- Add three feature cards:

  - Smart Diagnosis

  - Circuit Analysis

  - Troubleshooting History

DIAGNOSE PAGE:

- Display selectable problem cards:

  - LED Not Working

  - Motor Not Working

  - Arduino Problem

  - Buzzer Not Working

  - No Power / No Output

  - Other Circuit Problem

When the user selects a problem, show a step-by-step troubleshooting interface with YES/NO buttons.

RESULT PAGE:

- Show the detected possible fault

- Explain why the fault may have occurred

- Show recommended troubleshooting steps

- Add buttons for "Try Another Diagnosis" and "Ask AI"

CIRCUIT ANALYZER PAGE:

- Provide a drag-and-drop or click-to-upload area for circuit images

- Show a placeholder AI analysis result

- Display detected components and possible issues

HISTORY PAGE:

- Display previous troubleshooting cases using sample data

- Show problem, diagnosis and date

ABOUT PAGE:

- Explain the purpose of FixMate

Design requirements:

- Responsive on desktop, tablet and mobile

- Modern professional UI

- Clean cards

- Rounded corners

- Subtle animations

- Clear navigation bar

- Use appropriate electronics-related icons

- Make the interface look like a real hackathon product, not a basic student website

- Use mock data for now

- Do not implement the backend yet

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://circuit-fixer-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3005f693-fab2-4e87-995b-0f7fa8cad13c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
