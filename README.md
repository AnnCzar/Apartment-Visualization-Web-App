# Apartment Visualization Web App

An interactive web application for 3D apartment visualization, built with Django (backend), React (frontend), and Verge3D/Blender (3D models). The app allows users to browse apartments, take a virtual walk through interiors, view room sizes, and customize wall colors.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Example Usage](#example-usage)
- [Links](#links)
- [Hosting Notes](#hosting-notes)
- [Authors](#authors)

---

## Prerequisites

To run the application locally, you need:

- Python 3.8 or newer
- Node.js and npm (or yarn)
- Backend dependencies from `requirements.txt`
- Frontend dependencies from `package.json`
- SQLite database (default for Django)
- A `settings.properties` file with your `SECRET_KEY` and any other configuration data

---

## Getting Started

1. **Clone the repository:**

```
git clone https://github.com/AnnCzar/Apartment-Visualization-Web-App
```


2. **Create a `settings.properties` file** in the main project directory and add the required data (e.g., `SECRET_KEY`).  
You can generate the key with:
```
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Note:** The key cannot contain the `%` character.

3. **Install backend dependencies:**

```
pip install -r requirements.txt
```

4. **Run database migrations:**
```
python manage.py migrate
```

5. **Start the backend server** (optional, if you want to use it locally):
```
python manage.py runserver
```


6. **Go to the frontend directory and install dependencies:**
```
cd frontend/app
npm install
```

7. **Start the frontend:**
```
npm run dev
```


8. **Open your browser and go to:**
```
http://localhost:5173/
```
(or check your terminal for the correct address).

---

## Example Usage

After setup, users can:

- Browse the list of available apartments on the main page
- Select an apartment to view its 3D model and detailed information
- Move around the model in orbital or first-person (FPS) mode
- Check the area of individual rooms via info points
- Change wall colors in the model
- Open a contact form to reach the developer

**Recommended browser:** OperaGX (better WebGL performance).  
**Not recommended:** Google Chrome (possible WebGL optimization issues).

> **NOTE:**  
> By default, the app uses a backend hosted on Render.com. This server is automatically put to sleep after 15 minutes of inactivity, which can cause a long wait time (cold start) for the first request. If you encounter a data loading error, run the backend locally and update the `baseURL` in `ApartmentDetails.jsx` (`frontend/app/src/components`) to your local server address.

---

## Links

- **GitHub repository:**  
[https://github.com/AnnCzar/Apartment-Visualization-Web-App](https://github.com/AnnCzar/Apartment-Visualization-Web-App)

- **Demo app (frontend):**  
[https://annczar.github.io/zig-frontend/](https://annczar.github.io/zig-frontend/)

---

## Hosting Notes

The app is hosted on GitHub Pages, which can be unstable at times, with occasional issues loading static resources. If you experience problems (such as long loading times or file errors), try refreshing the page or use the local version as described above.

---
## Authors
- **Anna Czarnasiak** [GitHub: AnnCzar](https://github.com/AnnCzar)

- **Julia Ujma** [GitHub: juliauu](https://github.com/juliauu)

- **Marta Prucnal** [GitHub: mpruc](https://github.com/mpruc)

---
**Enjoy using the application!**

