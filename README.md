# Overview

Soft Signal is a responsive digital product storefront. Visitors can browse a collection of templates, guides, bundles, and mini-courses; filter products; open a product detail page; add products to a shopping bag; adjust quantities; and submit a contact form.

I created this software to practice building a complete web application with React. The project demonstrates client-side routing, reusable UI components, state management, form validation, responsive CSS, and a multi-page user experience.

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
- Loading and error states for database operations.
- Public GitHub repository with documented source code.

# Development Environment

I used Visual Studio Code, Node.js, npm, Vite, React, React Router, HTML, CSS, and JavaScript. Vite provides the development server and production build process. React provides the component model and state management, while React Router provides client-side navigation without full-page reloads.

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
2. Run [`public/supabase-schema.sql`](public/supabase-schema.sql) in the Supabase SQL Editor. This creates the `products` and `contact_messages` tables, their policies, and starter products.
3. Copy `.env.example` to `.env` and add the project URL and anonymous key:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not put a Supabase service-role key in this project. The `.env` file is ignored by Git.

## Data Flow

`ProductProvider` requests rows from the `products` table when the application starts. `Home`, `Shop`, and `ProductDetails` read those rows through the product context. `Shop` filters the returned rows based on the selected category.

When the contact form is submitted, `Contact.handleSubmit` validates the browser form, creates an object with `FormData`, inserts it into `contact_messages`, and displays success only after Supabase confirms the insert. Database errors are displayed instead of being presented as successful submissions.

# Video

Video link: **Add the final 4-5 minute YouTube link here before submitting.**

The video must show my face, demonstrate the running application, and explain the React context, routes, Supabase query, contact-message insert, and error handling.

# Useful Websites

* [React Documentation](https://react.dev/)
* [React Router Documentation](https://reactrouter.com/)
* [Vite Documentation](https://vite.dev/guide/)
* [MDN Web Docs: Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
* [MDN Web Docs: Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)

# Learning Strategies

I learned this module by breaking the work into small, testable tasks. First, I studied React components, then I practiced client-side routing with a small set of pages. After that, I added the shopping cart state and tested one behavior at a time. I used official React, React Router, and Vite documentation as my primary sources and compared the expected behavior with the application in the browser.

When I encountered a problem, I first wrote down what I expected to happen, inspected the error, and made one focused change. This process helped me avoid changing several unrelated files at once. I also used responsive browser sizes to check that the layout remained usable on mobile and desktop screens.

# Time Log

Record the actual time spent on research, planning, coding, testing, documentation, video production, and publication in the Module Submission document. The course expectation is at least 20 hours for this module. Do not report time that was not actually spent on the project.
