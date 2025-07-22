# 🖼️ RemoveBg – Background Removal Tool

**RemoveBg** is a web-based tool that allows users to upload one or multiple images and remove their backgrounds using a custom backend processing pipeline. It explores AI-adjacent capabilities and user-driven image workflows without relying on third-party libraries like remove.bg or Google Gemini.

## ✨ Features

- Upload and process **single or multiple images**
- Two separate UI routes:
  - One for single image upload
  - One for batch/multiple image upload
- Preview uploaded files before processing
- Clean, minimal user interface with focus on usability
- Backend handles background removal (via custom logic or third-party API)
- Downloadable output after background has been removed

## 🔧 Tech Stack

### Frontend

- **React** – Component-based UI
- **Vite** – Lightning-fast build and development tool
- **Tailwind CSS** – Utility-first CSS framework for responsive design

### Backend

- **Node.js** – JavaScript runtime for server logic
- **Express.js** – Web framework for handling image upload and processing
- **remove.bg API** – Third-party background removal service
- **FormData & file handling** – Used to send image files to the remove.bg endpoint

## 💡 Goal

To explore the process of building an end-to-end image processing tool—from UI upload handling to backend image manipulation. This project focuses on integrating frontend and backend systems for a practical use case (background removal), and serves as a portfolio-worthy demonstration of file handling, UI logic, and server-side image processing techniques.
