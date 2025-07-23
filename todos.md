Bugs
- Trying to delete habit causes foreign key constraint if it has any events. Either make the habit delete cascade to the events, or convert it to a soft delete
- Export types from supabase, use them where relevant
- Add dark/light mode switch
- Add custom default scrollbar style
