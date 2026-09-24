# Product Admin Dashboard

A responsive Product Admin Dashboard built using Next.js, React, TypeScript, Tailwind CSS, and Axios.

## Features

- User login and authentication
- Protected product dashboard
- Product listing
- Product search
- Category filtering
- Product sorting by price, rating, and stock
- Ascending and descending sorting
- Pagination
- Adjustable page size
- Product details page
- Product images and information
- Product rating and stock information
- Invalid product ID handling
- Logout functionality
- Responsive dashboard UI

## Tech Stack

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Axios
- DummyJSON Products API

## Project Structure

```text
product-admin-dashboard/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── products/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── ...
├── lib/
│   ├── authApi.ts
│   ├── axios.ts
│   └── productApi.ts
├── package.json
├── package-lock.json
└── README.md