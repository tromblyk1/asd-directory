import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://twcofvgxitfvoedftik.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Then check your `.env` file** at `src/frontend/.env` - make sure it has:
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzAyNzUsImV4cCI6MjA3NTc0NjI3NX0.pkxp6DBSgQykenv2UZIILZhUY9P6xp-lBNs6Z8NNmdI