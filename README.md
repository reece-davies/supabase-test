This is a [Next.js](https://nextjs.org) app specifically made to test its compatibility with [Supabase](https://supabase.com/).

## Supabase + Next.js Setup Instructions
Below outlines the basic steps to connect a Next.js app to a Supabase database.

### Step 1. Create Supabase project & retrieve credentials
Create new project and wait for it to finish provisioning.

Retrieve the Project URL and API Key:
* **Project URL**: available at project dashboard
* **API Key**: navigate to 'Project Settings' > 'API Keys' > 'Publishable key'

### Step 2. Create database table(s)
Navigate to 'Table Editor' and add a new database table.

### Step 3. Aassign RLS policies to table(s)
Within the Table Editor, add RLS (Row Level Security) Policies to allow access permissions. "anon" refers to anonymous users, which was used in this project due to lack of authentication.

### Step 4. Expose table(s) to API
Expose the table(s) by navigating to 'Integrations' > 'Data API' > 'Settings' > 'Exposed tables'.

### Step 5. Create Next.js app
Create Next.js app by running the CLI command
```bash
npx create-next-app@latest .
```
or
```bash
npx create-next-app@latest <project_name>
```

The following configuration was applied to this project:
```
* Would you like to use the recommended Next.js defaults? » No, customize settings
* Would you like to use TypeScript? No
* Which linter would you like to use? ESLint
* Would you like to use React Compiler? Yes
* Would you like to use Tailwind CSS? Yes
* Would you like your code inside a `src/` directory? Yes
* Would you like to use App Router? (recommended) Yes
* Would you like to customize the import alias (`@/*` by default)? No
* Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No
```

### Step 6. Install Supabase package
Install Supabase npm package with the CLI command
```bash
npm install @supabase/supabase-js
```

### Step 7. Add environment variables
Create a `.env.local` (or `.env`) file and store the Project URL and API Key retrieved earlier.
```
NEXT_PUBLIC_SUPABASE_URL=<project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<api_key>
```

### Step 8. Set up Supabase client
Create `src/lib/supabase.js` and populate it with
```javascript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### Step 9. Add frontend functionality to `app/page.js`
Example code for READ, DELETE, and CREATE:
```javascript
  // READ
  async function fetchItems() {
    setLoading(true);

    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  // CREATE
  async function addItem(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim()) return;

    const { error } = await supabase.from("items").insert({
      title,
      description,
    });

    if (error) {
      console.error("Insert error:", error);
      return;
    }

    setTitle("");
    setDescription("");
    fetchItems();
  }

  // DELETE
  async function deleteItem(id) {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }
```

## Step 10. Test
Run the app to test connectivity.
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.