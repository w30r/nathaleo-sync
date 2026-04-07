🚀 Tech Stack
Framework: Next.js 15 (App Router)

Styling: Tailwind CSS + Lucide React

UI Components: Radix UI + Shadcn/UI

Database: MongoDB (via Mongoose/Prisma - specify which one you use)

State Management: React Server Actions + useState/useEffect

🛠 Critical Rules & Patterns
1. Next.js 15 Async APIs (CRITICAL)
Dynamic APIs are Promises: params and searchParams in page.tsx or layout.tsx must be awaited before accessing properties.

Server Components: Use const { date } = await params;.

Client Components: Use const { date } = use(params); from react.

2. Shadcn/UI Workflow
Do not rewrite components: If you need a new UI element, assume it's in @/components/ui.

Installation: If a component is missing, ask me to run npx shadcn@latest add [component].

Customization: Modify the logic in the page, but keep the core Shadcn component files clean unless a design change is specifically requested.

3. Styling Guidelines
Responsive Design: Always use mobile-first Tailwind classes (md:, lg:).

Dark Mode: Use dark: variants. Ensure text uses text-primary or text-muted-foreground instead of hardcoded hex codes.

Layouts: Prefer Flexbox and CSS Grid. Use the cn() utility for conditional classes.

4. Data Handling (MongoDB)
Server Actions: All database mutations must happen in app/actions/.

Validation: Use zod for validating form inputs and environment variables.

Safe Dates: When passing dates from Server to Client, ensure they are stringified (ISO format) to avoid serialization errors.

5. File Structure
Components: Shared components in @/components/.

Features: Page-specific components in a _components folder inside the route directory.

Actions: Group logic in app/actions/ (e.g., foodActions.ts, roomActions.ts).

🤖 Aider Instructions
Code Style: Use TypeScript. Prefer functional components and arrow functions.

Conciseness: Provide the minimal code change necessary.

Modernity: Use lucide-react for icons.

Verification: When creating a new route, ensure the folder structure matches the App Router (e.g., app/path/page.tsx).