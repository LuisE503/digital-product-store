# Overview

Soft Signal is a responsive digital product storefront. Visitors can browse a collection of templates, guides, bundles, and mini-courses; filter products; open a product detail page; add products to a shopping bag; adjust quantities; and submit a contact form.

I created this software to practice connecting a web application to a cloud database. The project demonstrates client-side routing, reusable UI components, state management, form validation, responsive CSS, and Supabase database operations.

The product catalog is loaded from Supabase instead of being hardcoded in the React component. Contact form submissions are also saved in Supabase.

## Module Requirements Demonstrated

- Multi-page application structure using React Router.
- Client-side routes for Home, Shop, Product Details, About, Contact, and Cart.
- Reusable product card and layout components.
- React state for product filtering, contact form submission, and shopping cart quantities.
- Responsive design for desktop and mobile screen sizes.
- Functional form with required fields and email validation.
- Product records loaded from a Supabase PostgreSQL table.
- Contact messages persisted in a Supabase PostgreSQL table.
- Product reviews stored in a related Supabase table.
- Complete cloud database CRUD operations: retrieve, insert, update, and delete reviews.
- Loading and error states for database operations.
- Public GitHub repository with documented source code.

# Development Environment

I used Visual Studio Code, Node.js, npm, Vite, React, React Router, Supabase, PostgreSQL, HTML, CSS, and JavaScript. Vite provides the development server and production build process. React provides the component model and state management, while Supabase provides the cloud PostgreSQL database and API used by the application.

To install and run the project:

```bash
npm install
npm run dev
```

To validate the production version:

```bash
npm run build
npm run lint
```

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com/).
2. For a new database, run [`public/supabase-schema.sql`](public/supabase-schema.sql) in the Supabase SQL Editor. This creates the `products`, `contact_messages`, and related `reviews` tables, their policies, and starter products.
3. For the existing Soft Signal database, run [`public/reviews-migration.sql`](public/reviews-migration.sql) to add the related reviews table and CRUD policies.
4. Copy `.env.example` to `.env` and add the project URL and anonymous key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service-role key in this project. The `.env` file is ignored by Git.

## Data Flow

`ProductProvider` requests rows from the `products` table when the application starts. `Home`, `Shop`, and `ProductDetails` read those rows through the product context. `Shop` filters the returned rows based on the selected category.

When the contact form is submitted, `Contact.handleSubmit` validates the browser form, creates an object with `FormData`, inserts it into `contact_messages`, and displays success only after Supabase confirms the insert. Database errors are displayed instead of being presented as successful submissions.

The product details page demonstrates complete CRUD operations for the related `reviews` table. `ReviewManager` retrieves reviews for a product, inserts new reviews, updates an existing review, and deletes a review after confirmation. The `reviews.product_id` foreign key relates every review to a product in the `products` table.

# Video

[Software Demo Video](ADD_CLOUD_DATABASE_VIDEO_LINK_HERE)

The video must show my face, demonstrate the running application, show the Supabase dashboard, and explain the React context, Supabase queries, contact-message insert, related review table, CRUD operations, and error handling.

# Cloud Database

This project uses Supabase, a hosted PostgreSQL cloud database with a JavaScript API. The application uses the Supabase publishable key from environment variables and never exposes a service-role key in the browser.

The database contains three tables. The `products` table stores the product catalog. The `contact_messages` table stores messages submitted through the contact form. The `reviews` table stores product reviews and has a foreign key named `product_id` that relates each review to a record in `products`.

The application demonstrates complete database operations. It retrieves products and reviews, inserts contact messages and reviews, updates reviews, and deletes reviews. Row Level Security policies control the permitted browser operations. The database schema is in [`public/supabase-schema.sql`](public/supabase-schema.sql), and [`public/reviews-migration.sql`](public/reviews-migration.sql) adds the related reviews table to an existing project.

# Useful Websites

* [React Documentation](https://react.dev/)
* [React Router Documentation](https://reactrouter.com/)
* [Vite Documentation](https://vite.dev/guide/)
* [Supabase JavaScript Documentation](https://supabase.com/docs/reference/javascript/introduction)
* [Supabase Row Level Security Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
* [MDN Web Docs: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
* [MDN Web Docs: Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

# Learning Strategies

I learned this module by breaking the cloud database work into small, testable tasks. I studied Supabase tables, SQL schemas, Row Level Security, and the JavaScript client before connecting the application. I then tested product retrieval, contact-message insertion, and the related review CRUD operations one at a time. I used official React, Vite, and Supabase documentation and compared the expected database records with the application in the browser.

When I encountered a problem, I first wrote down what I expected to happen, inspected the error, and made one focused change. I tested missing configuration, invalid form data, failed database requests, and the complete create, read, update, and delete review flow. This process helped me avoid changing several unrelated files at once.

# Time Log

Record the actual time spent on research, planning, coding, testing, documentation, video production, and publication in the Module Submission document. The course expectation is at least 20 hours for this module. Do not report time that was not actually spent on the project.
