# AI Programming Tutor

A modern web application that provides an interactive learning experience for programming concepts using AI-powered tutoring.

## Features

- Interactive chat interface with AI tutor
- Progress tracking through various programming topics
- Integrated code editor with real-time feedback
- AI-generated coding exercises and solutions
- Modern, responsive UI built with React and Material-UI

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-programming-tutor
```

2. Set up the frontend:
```bash
# Install dependencies
npm install

# Create a .env file in the root directory
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

3. Set up the backend:
```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the backend directory
echo "GEMINI_API_KEY=your-api-key-here" > backend/.env
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
# In a new terminal
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ai-programming-tutor/
├── src/                    # Frontend React source code
│   ├── components/         # React components
│   ├── data/              # Static data
│   └── App.js             # Main application component
├── backend/               # Python FastAPI backend
│   ├── data/             # Backend data files
│   └── main.py           # Backend server code
├── package.json          # Frontend dependencies
├── requirements.txt      # Backend dependencies
└── README.md            # Project documentation
```

## API Endpoints

- `POST /api/generate-intro`: Generate introduction for a topic
- `POST /api/chat`: Handle chat messages
- `POST /api/generate-problem`: Generate coding exercises
- `POST /api/submit-code`: Submit and evaluate code

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 