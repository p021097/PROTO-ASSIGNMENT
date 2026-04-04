# Website Navigator

This project is made for a MERN stack assignment.

The main idea of the project is simple. A user uploads an Excel file, CSV file, or a public Google Sheets link that contains website URLs. The app reads those URLs, shows them in a list, and lets the user move through them using Previous and Next buttons.

I also added MongoDB storage so that uploaded files are saved and can be opened again later from the Previous Files section.

## What this project does

- Upload Excel files and CSV files
- Import a public Google Sheets link
- Read website URLs from the uploaded data
- Show all extracted URLs inside the app
- Let the user move between websites using Previous and Next
- Save uploaded files in MongoDB Atlas
- Show previously uploaded files and reload their URLs

## Tech stack used

- React for frontend
- Vite for frontend setup
- Node.js and Express for backend
- MongoDB Atlas for database
- `xlsx` for reading Excel and CSV files
- `multer` for file uploads

## Project structure

```text
PROTO ASSIGNMENT/
|- frontend/
|- backend/
|- README.md
```

## How the project works

### Frontend part

The frontend is built using React.

It handles:

- file selection
- sending the file to backend
- showing the extracted URLs
- moving to next and previous website
- opening saved files from database

State is managed using `StoreContext`.

### Backend part

The backend is built using Express.

It handles:

- receiving uploaded files
- reading URLs from the file
- saving file name and URLs in MongoDB
- sending saved files back to frontend when needed

## Main flow

1. User uploads a file
2. Frontend sends the file to backend
3. Backend reads the first sheet and extracts URLs
4. Backend stores file name and URLs in MongoDB
5. Frontend receives the URLs and shows them
6. User can click URLs or use Previous and Next buttons
7. User can also open an older uploaded file from Previous Files

## API routes

Base route:

```text
/api/files
```

Used routes:

- `POST /api/files/upload`
  Upload file and save it in database

- `GET /api/files`
  Get list of previously uploaded files

- `GET /api/files/:id`
  Get one selected file and all its URLs

## How to run the project locally

### Install frontend packages

```bash
cd frontend
npm install
```

### Install backend packages

```bash
cd ../backend
npm install
```

### Start backend

```bash
cd backend
npm run server
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:4000
```

## Environment variables

### Backend `.env`

Create a `.env` file inside `backend`:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend `.env`

Create a `.env` file inside `frontend`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/files
```

If deployed, use the backend deployed URL:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api/files
```

## Deployment idea

Frontend can be deployed as a static site.

Backend can be deployed as a web service.

If using Render:

### Frontend

- Root Directory: `frontend`
- Build Command: `npm run build`
- Publish Directory: `dist`

### Backend

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

## Important thing to know

Some websites do not allow themselves to open inside an iframe.

So even if:

- the URL is correct
- the file upload worked
- the navigator is working

the website preview may still not load inside the app.

That is why there is also an **Open Website** option.

## Current limitations

- Google Sheets works only for public sheets
- Google Sheets imported data is not saved in MongoDB yet
- only the first sheet is read from Excel files
- deployment needs correct API base URL setup

## Features completed

- File upload
- URL extraction
- Website navigation
- Previous and Next buttons
- Responsive UI
- MongoDB file history

## Future improvements

- Save Google Sheets imports in database too
- Add delete option for saved files
- Add better error handling
- Add better deployment support
- Add tests
