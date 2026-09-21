# Facebook Clone — Deploy Guide (Vercel + Render + MongoDB Atlas)

This project has two parts, deployed separately:

- **`frontend/`** → static HTML/CSS/JS → deploy to **Vercel**
- **`backend/`** → Node/Express + Mongoose API → deploy to **Render**
- **Database** → **MongoDB Atlas** (free cloud MongoDB), used by the backend

```
fb-clone/
├── frontend/          (deploy to Vercel)
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── styles.css
│   └── script.js
└── backend/           (deploy to Render)
    ├── server.js
    ├── config/db.js
    ├── models/User.js
    ├── routes/auth.js
    ├── package.json
    ├── .env.example
    └── render.yaml    (optional)
```

---

## Step 1 — Create a MongoDB Atlas database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — any cloud provider/region is fine.
3. **Database Access** (left sidebar) → **Add New Database User**
   - Username/password authentication
   - Give it a username and a strong password (save these — you'll need them)
   - Role: "Read and write to any database" is fine for this project
4. **Network Access** (left sidebar) → **Add IP Address**
   - For simplicity while deploying, choose **Allow Access from Anywhere** (`0.0.0.0/0`)
   - (Render's IPs aren't fixed on the free tier, so this is the simplest option; you can restrict it later if you upgrade)
5. Go to **Database** → **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Edit it: replace `<username>` and `<password>` with your real values, and add a database name before the `?`, e.g. `facebook_clone`:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/facebook_clone?retryWrites=true&w=majority
   ```
   Keep this string — it's your `MONGO_URI`.

---

## Step 2 — Push the project to GitHub

Render and Vercel both deploy from a Git repo.

```bash
cd fb-clone
git init
git add .
git commit -m "Initial commit: Facebook clone frontend + backend"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy the backend to Render

1. Go to https://render.com and sign in (GitHub login is easiest).
2. **New +** → **Web Service** → connect your GitHub repo.
3. Configure the service:
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free is fine to start
4. Add **Environment Variables** (Render dashboard → your service → **Environment**):
   | Key | Value |
   |---|---|
   | `MONGO_URI` | the Atlas connection string from Step 1 |
   | `CORS_ORIGIN` | leave blank for now — you'll add your Vercel URL after Step 4 |
   | `PORT` | `5000` (Render also sets its own `PORT` automatically; either works since `server.js` reads `process.env.PORT`) |
5. Click **Create Web Service**. Render will build and deploy it.
6. Once live, note your backend URL, e.g.:
   ```
   https://facebook-clone-backend.onrender.com
   ```
7. Test it by visiting that URL in your browser — you should see:
   `Facebook clone API is running.`

> Free Render services spin down after inactivity and take ~30-60 seconds to
> wake up on the next request — that's normal for the free tier.

---

## Step 4 — Deploy the frontend to Vercel

1. Before deploying, point the frontend at your live backend. Open
   `frontend/script.js` and change:
   ```js
   const API_BASE_URL = 'http://localhost:5000/api';
   ```
   to your Render URL + `/api`:
   ```js
   const API_BASE_URL = 'https://facebook-clone-backend.onrender.com/api';
   ```
   Commit and push this change:
   ```bash
   git add frontend/script.js
   git commit -m "Point frontend at deployed backend"
   git push
   ```
2. Go to https://vercel.com and sign in (GitHub login is easiest).
3. **Add New...** → **Project** → import your GitHub repo.
4. Configure the project:
   - **Root Directory:** `frontend`
   - **Framework Preset:** "Other" (it's plain static HTML — no build step needed)
   - Leave Build Command / Output Directory blank
5. Click **Deploy**. Once done, you'll get a URL like:
   ```
   https://your-project-name.vercel.app
   ```

---

## Step 5 — Connect the two: update CORS on the backend

Now that you have your Vercel URL, lock down the backend to accept requests
from it:

1. In Render, go to your backend service → **Environment**.
2. Set `CORS_ORIGIN` to your Vercel URL (no trailing slash):
   ```
   CORS_ORIGIN=https://your-project-name.vercel.app
   ```
3. Save — Render will automatically redeploy the service with the new setting.

---

## Step 6 — Test the live site

1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Click **Create Account**, fill out the sign-up form, submit.
3. Check MongoDB Atlas → **Browse Collections** → `facebook_clone` database →
   `users` collection — you should see the new user document (with a hashed
   password).
4. Go back to the login page and log in with the same email/password.

If something fails, open your browser's DevTools → **Console** / **Network**
tab to see the actual error — most issues at this stage are either:
- Wrong `MONGO_URI` (check Atlas username/password/db name)
- `CORS_ORIGIN` not matching your exact Vercel URL
- Forgot to update `API_BASE_URL` in `script.js` before deploying the frontend

---

## Local development (optional)

You can still run everything locally instead of/alongside the deployed version:

```bash
cd backend
cp .env.example .env     # fill in MONGO_URI (Atlas or local MongoDB)
npm install
npm start                # runs on http://localhost:5000
```

Then open `frontend/index.html` directly in your browser (with
`API_BASE_URL` in `script.js` set back to `http://localhost:5000/api`), or
serve the folder with `npx serve frontend`.

---

## Data model

Each user document in MongoDB looks like:

```json
{
  "_id": "ObjectId",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "$2a$10$hashedPasswordHere...",
  "birthday": "1995-04-12T00:00:00.000Z",
  "gender": "female",
  "createdAt": "2026-09-16T00:00:00.000Z",
  "updatedAt": "2026-09-16T00:00:00.000Z"
}
```

Passwords are hashed with bcrypt before being stored — never saved as plain text.

## Notes / next steps

This is a learning/demo project, not production-ready as-is. If you want to
take it further, consider adding:
- Session cookies or JWTs so users stay logged in
- Email verification and password-reset flows
- Rate limiting on `/api/login` to slow down brute-force attempts
- Input validation with a library like `zod` or `joi`
- A custom domain on Vercel/Render instead of the default `.vercel.app` / `.onrender.com` URLs
