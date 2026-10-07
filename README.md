# Overview

Soft Signal is a responsive digital product storefront. Visitors can browse templates, guides, bundles, and mini-courses; filter products; open product details; add products to a shopping bag; adjust quantities; and submit a contact form.

The application starts with a Vite development server at `http://localhost:5173/`. It uses React Router to navigate between the Home, Shop, Product Details, About, Contact, and Cart views without full-page reloads. Product records are loaded from Supabase so the catalog is dynamically created from cloud data, and contact messages are saved in the cloud database.

I created this software to practice building a complete interactive web application with React. The project demonstrates reusable components, client-side routing, state management, form validation, responsive design, cloud data retrieval, and database-backed form submission.

[Software Demo Video](ADD_WEB_APPS_VIDEO_LINK_HERE)

# Web Pages

- **Home:** Introduces Soft Signal and dynamically displays featured products retrieved from the cloud catalog.
- **Shop:** Displays all products and creates category filters from the returned product data. Selecting a filter changes the products displayed on the page.
- **Product Details:** Uses the product ID in the route to display one product, its description, price, features, and related cloud reviews.
- **About:** Explains the purpose and design values of the storefront.
- **Contact:** Provides a validated form. A successful submission creates a record in the Supabase `contact_messages` table.
- **Cart:** Displays products added by the user, lets the user adjust quantities, calculates totals, and links to Contact as the checkout step.

The application uses React state and Supabase responses to determine what content appears. The product list, filters, detail page, contact confirmation, reviews, and cart totals all respond to application or user data.

# Development Environment

I used Visual Studio Code, Node.js, npm, Vite, React, React Router, Supabase, PostgreSQL, HTML, CSS, and JavaScript. Vite provides the development server and production build process. React provides the component model and state management. React Router provides client-side navigation, and Supabase provides the cloud database and JavaScript API.

To install and run the application:

```powershell
npm install
npm run dev
```

Open `http://localhost:5173/` in a browser. To validate the project, run:

```powershell
npm run build
npm run lint
```

The Supabase setup is documented in `public/supabase-schema.sql` and `public/reviews-migration.sql`. The browser uses the publishable key through `.env`; private service-role credentials are never committed.

# Useful Websites

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vite.dev/guide/)
- [Supabase JavaScript Documentation](https://supabase.com/docs/reference/javascript/introduction)
- [Supabase Row Level Security Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [MDN Web Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

# Future Work

- Add customer authentication and private order history.
- Add a real checkout and payment provider.
- Add pagination and search for a larger cloud catalog.
- Add automated tests for routing, forms, and database operations.
- Add a protected administration view for managing products and reviews.
