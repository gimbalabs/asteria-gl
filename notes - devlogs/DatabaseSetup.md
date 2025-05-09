<!-- File: setup-supabase-t3.md -->

# 1. Setup Supabase in your T3 App

This guide walks you through wiring up a brand-new Supabase project to your T3 (Next.js + tRPC + Prisma) app.

---

## 🔧 Prerequisites

- Node ≥14  
- A T3 App scaffolded (`create-t3-app`)  
- A Supabase account and a running project

---

## 1. Install the Supabase client

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

## 2. Set up .env file

used in client-side code
``` bash
NEXT_PUBLIC_SUPABASE_URL=https://<YOUR_PROJECT_REF>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

used in server-side code only (e.g. edge functions, migrations)
``` bash
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>
```

Note: Only keys prefixed with NEXT_PUBLIC_ are exposed to the browser.

## 3. Add the helper in utils (already added to Asteria-GL repo)

``` bash
import { router, publicProcedure } from '../trpc';
import { supabase } from '@/utils/supabaseClient';

export const exampleRouter = router({
  getUsers: publicProcedure.query(async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  }),
});
```

## 4. Example use in trpc rourter

``` bash
import { router, publicProcedure } from '../trpc';
import { supabase } from '@/utils/supabaseClient';

export const exampleRouter = router({
  getUsers: publicProcedure.query(async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  }),
});
```

Mets suck!
