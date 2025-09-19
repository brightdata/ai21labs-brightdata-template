# AI21 Maestro + Bright Data

A beautiful web interface for building AI agents with web access through Bright Data tools. This project combines AI21's Maestro platform with Bright Data's web scraping capabilities to create powerful AI agents that can research and analyze real-time web data.


<img width="1345" height="889" alt="2025-09-19_03h13_42" src="https://github.com/user-attachments/assets/296de2a5-53cb-450b-adf0-699668f4211b" />

FastAPI docs: 

<img width="1483" height="860" alt="image" src="https://github.com/user-attachments/assets/ba04140f-0d37-4447-9362-ad8add3c94ad" />


## Features

🤖 **AI Agent Dashboard** - Configure and run AI agents with different personalities and budgets  
🌐 **Web Data Access** - Integration with Bright Data's free and pro web scraping tools  
📊 **Real-time Results** - Watch your agents work and see results as they happen  
📝 **Run History** - Track all your agent runs with detailed logs and results  
🎨 **Beautiful UI** - Modern, responsive interface built with HeroUI components  
⚡ **Fast API** - High-performance FastAPI backend with async support  

## 🛠️ Tech Stack

<div align="center">

### Backend
![Python](https://img.shields.io/badge/Python-14354C?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![AI21](https://img.shields.io/badge/AI21%20Maestro-0066CC?style=for-the-badge)
![Bright Data](https://img.shields.io/badge/Bright%20Data-FF6B35?style=for-the-badge)

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

---

## 📋 Table of Contents

- [AI21 Maestro + Bright Data](#ai21-maestro--bright-data)
  - [Features](#features)
  - [🛠️ Tech Stack](#️-tech-stack)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Quick Start](#-quick-start)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [📖 API Documentation](#-api-documentation)
    - [Key Endpoints](#key-endpoints)
  - [🔧 Available Tools](#-available-tools)
    - [🆓 Free Tools (Rapid Mode)](#-free-tools-rapid-mode)
    - [💎 Pro Tools (Premium)](#-pro-tools-premium)
  - [⚙️ Configuration](#️-configuration)
    - [Agent Personalities](#agent-personalities)
    - [Budget Levels](#budget-levels)
    - [Environment Variables](#environment-variables)
  - [🏗️ Project Structure](#️-project-structure)
  - [🧪 Development](#-development)
    - [Backend Development](#backend-development)
    - [Frontend Development](#frontend-development)
  - [🤝 Contributing](#-contributing)
    - [Development Process](#development-process)
    - [Pull Request Guidelines](#pull-request-guidelines)
  - [📄 License](#-license)
  - [Support](#support)
  - [Acknowledgments](#acknowledgments)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- ![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white) Python 3.8 or higher
- ![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js&logoColor=white) Node.js 16 or higher
- 🔑 [AI21 Labs API key](https://studio.ai21.com/) - Sign up for free
- 🌐 [Bright Data token](https://brightdata.com/) - Get your web scraping access

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/brightdata/ai21labs-brightdata-template
   cd maestro-brightdata
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your API keys
   ```

5. **Start the API server**
   ```bash
   python api_server.py
   ```

   🎉 **API will be available at `http://localhost:8000`**

### Frontend Setup

1. **Navigate to UI directory**
   ```bash
   cd ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   🎉 **Web interface will be available at `http://localhost:5173`**

---

## 📖 API Documentation

Once the backend is running, visit **`http://localhost:8000/docs`** for interactive API documentation powered by FastAPI's automatic OpenAPI generation.

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/run` | Execute an AI agent with web access |
| `GET` | `/status/{run_id}` | Get the status of a specific run |
| `GET` | `/runs` | List all runs with their status |
| `GET` | `/tools` | Get information about available Bright Data tools |
| `POST` | `/quick-run` | Simplified endpoint for basic queries |

---

## 🔧 Available Tools

### 🆓 Free Tools (Rapid Mode)
- **Search Engine** - Scrape search results from Google, Bing, or Yandex
- **Web Scraper** - Extract clean markdown from any webpage

### 💎 Pro Tools (Premium)
- **E-commerce** - Amazon, Walmart, eBay, Home Depot, Zara, Etsy, Best Buy
- **Social Media** - LinkedIn, Instagram, Twitter, TikTok, Facebook
- **Business Intelligence** - ZoomInfo, Crunchbase, job listings
- **Browser Automation** - Navigate, click, type, screenshot

---

## ⚙️ Configuration

### Agent Personalities
| Personality | Description |
|-------------|-------------|
| **Web Researcher** | Helpful assistant focused on web data research |
| **Data Analyst** | Technical assistant for data analysis tasks |
| **Content Creator** | Creative assistant for content generation |
| **Technical Expert** | Detailed technical responses with sources |

### Budget Levels
| Level | Resources | Best For |
|-------|-----------|----------|
| **Low** | Basic computation | Simple queries |
| **Medium** | Standard computation | Most use cases |
| **High** | Maximum computation | Complex analysis |

### Environment Variables

```bash
# Required
AI21_LABS_KEY=your_ai21_labs_api_key_here
BRIGHTDATA_TOKEN=your_brightdata_token_here

# Optional
PORT=8000
HOST=0.0.0.0
```

---

## 🏗️ Project Structure

```
maestro-brightdata/
├── 📄 api_server.py          # FastAPI server
├── 📋 requirements.txt       # Python dependencies
├── 🔧 .env.example          # Environment variables template
├── 🚫 .gitignore            # Git ignore rules
├── 📖 README.md             # This file
└── 🎨 ui/                   # Frontend React app
    ├── 📁 src/
    │   ├── 🧩 components/   # Reusable UI components
    │   ├── 📄 pages/        # Page components
    │   ├── ⚙️ config/       # Configuration files
    │   └── 📝 types/        # TypeScript type definitions
    ├── 📦 package.json      # Node.js dependencies
    └── ⚡ vite.config.ts    # Vite configuration
```

---

## 🧪 Development

### Backend Development
```bash
# Run with auto-reload
uvicorn api_server:app --reload --host 0.0.0.0 --port 8000

# Format code
black .
isort .
```

### Frontend Development
```bash
cd ui

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🤝 Contributing

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- 🐛 Reporting a bug
- 💡 Discussing the current state of the code
- 🚀 Submitting a fix
- 💫 Proposing new features
- 🎯 Becoming a maintainer

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Visit the [API docs](http://localhost:8000/docs) when running locally
- **Issues**: Report bugs and request features via GitHub Issues
- **AI21 Maestro**: [Official Documentation](https://docs.ai21.com/docs/maestro-overview)
- **Bright Data**: [Platform Documentation](https://docs.brightdata.com/)

## Acknowledgments

- [AI21 Labs](https://ai21.com/) for the Maestro platform
- [Bright Data](https://brightdata.com/) for web data collection tools
- [HeroUI](https://heroui.com/) for the beautiful component library
- [FastAPI](https://fastapi.tiangolo.com/) for the amazing web framework
