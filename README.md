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

## Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **AI21 Maestro** - Advanced AI agent platform
- **Bright Data** - Web data collection platform
- **Python 3.8+** - Core runtime

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **HeroUI** - Beautiful, accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- AI21 Labs API key ([Get one here](https://studio.ai21.com/))
- Bright Data token ([Get one here](https://brightdata.com/))

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/brightdata/ai21labs-brightdata-template
   cd maestro-brightdata
   ```

2. **Create virtual environment**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate
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

The API will be available at `http://localhost:8000`

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

The web interface will be available at `http://localhost:5173`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

- `POST /run` - Execute an AI agent with web access
- `GET /status/{run_id}` - Get the status of a specific run
- `GET /runs` - List all runs with their status
- `GET /tools` - Get information about available Bright Data tools
- `POST /quick-run` - Simplified endpoint for basic queries

## Available Tools

### Free Tools (Rapid Mode)
- **Search Engine** - Scrape search results from Google, Bing, or Yandex
- **Web Scraper** - Extract clean markdown from any webpage

### Pro Tools (Premium)
- **E-commerce** - Amazon, Walmart, eBay, Home Depot, Zara, Etsy, Best Buy
- **Social Media** - LinkedIn, Instagram, Twitter, TikTok, Facebook
- **Business Intelligence** - ZoomInfo, Crunchbase, job listings
- **Browser Automation** - Navigate, click, type, screenshot

## Configuration Options

### Agent Personalities
- **Web Researcher** - Helpful assistant focused on web data research
- **Data Analyst** - Technical assistant for data analysis tasks
- **Content Creator** - Creative assistant for content generation
- **Technical Expert** - Detailed technical responses with sources

### Budget Levels
- **Low** - Basic computation resources
- **Medium** - Standard computation resources
- **High** - Maximum computation resources for complex tasks

## Environment Variables

```bash
# Required
AI21_LABS_KEY=your_ai21_labs_api_key_here
BRIGHTDATA_TOKEN=your_brightdata_token_here

# Optional
PORT=8000
HOST=0.0.0.0
```

## Development

### Backend Development
```bash
# Run with auto-reload
uvicorn api_server:app --reload --host 0.0.0.0 --port 8000

# Run tests (if available)
pytest

# Format code
black .
isort .
```

### Frontend Development
```bash
cd ui

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
maestro-brightdata/
├── api_server.py          # FastAPI server
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # This file
└── ui/                  # Frontend React app
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── config/      # Configuration files
    │   └── types/       # TypeScript type definitions
    ├── package.json     # Node.js dependencies
    └── vite.config.ts   # Vite configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

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
