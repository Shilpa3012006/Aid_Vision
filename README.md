# 🏥 aidvision: AI-Powered First-Aid Assistant

> Intelligent, real-time guidance for medical scenarios, powered by Gemini AI.

![GitHub language count](https://img.shields.io/github/languages/count/Shilpa3012006/Aid_Vision?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/Shilpa3012006/Aid_Vision?style=for-the-badge)
![Netlify Status](https://api.netlify.com/api/v1/badges/fd3b0b17-9664-4530-8adc-8c16eb8fa326/deploy-status) 


## 🚀 Live Demo

Experience the application deployed on Netlify:

**[aidvision.netlify.app](https://aidvision.netlify.app/)**

---

## ✨ Project Overview

**aidvision** is a proof-of-concept application designed to deliver immediate, concise, and reliable first-aid information. In high-stress situations, users can input a brief description of a medical scenario and receive structured, step-by-step instructions on what to do next.

This project was developed to showcase the power of rapid development and integration of large language models (LLMs) into real-world utility applications.

## 💡 Key Features

* **Intelligent Guidance:** Uses the Gemini API to analyze user input and generate accurate first-aid protocols.
* **Rapid Response:** Designed for quick loading and immediate information delivery when time is critical.
* **Clean UI/UX:** Simple, focused interface to minimize distraction during an emergency.
* **Modern Stack:** Built using Next.js for efficient and scalable deployment.

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js | Modern React framework for performance and scalability. |
| **AI/LLM** | Google Gemini API | Powers the intelligent first-aid response generation. |
| **Styling** | [Add your CSS/UI framework here, e.g., Tailwind CSS, plain CSS] | For responsive and clean design. |
| **Deployment** | Netlify | Continuous deployment and hosting solution. |

## ⚙️ Installation & Setup (Local)

To run this project on your local machine, follow these steps:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Shilpa3012006/Aid_Vision/
    cd aidvision
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set Environment Variable:**
    Create a file named **`.env.local`** in the root of the project and add your API key:
    ```
    REACT_APP_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
4.  **Run the Project:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:3000`.

## 📄 License

This project is open-sourced under the [MIT License](https://opensource.org/licenses/MIT).
