# Supabase Database Setup

This folder contains SQL files for setting up and managing your Supabase database.

## Files

### `schema.sql`
**Purpose:** Initial database schema setup  
**When to run:** Once when setting up a new project  
**Contains:**
- Tables: `profiles`, `posts`, `comments`
- Trigger function to auto-create profile on user signup
- Foreign key relationships

### `policies.sql`
**Purpose:** Row Level Security (RLS) policies  
**Status:** ✅ Already applied to database  
**Contains:**
- RLS policies for all tables
- Access control rules for admin vs regular users
- Security policies for create/read/update/delete operations

**Security Summary:**
- **Profiles:** Anyone can read, users can update own username only
- **Posts:** Public can read published posts, only admins can create/edit/delete
- **Comments:** Anyone can read, authenticated users can create, users can edit/delete their own

### `admin.sql`
**Purpose:** Admin management helper queries  
**Usage:** Copy and modify these queries in Supabase SQL editor  
**Contains:**
- Promote user to admin
- Demote admin to commenter
- List all admins
- List all users

## Setup Instructions

### Initial Setup (New Project)

1. Run `schema.sql` in Supabase SQL Editor to create tables
2. Run `policies.sql` in Supabase SQL Editor to enable RLS
3. Use `admin.sql` to promote your first admin user

### Current Status

✅ Schema created  
✅ RLS enabled on all tables  
✅ Policies applied  
✅ Username column exists  
✅ Auto-profile creation trigger active

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Admin role** required for post management
- **User authentication** required for comments
- **Self-service username** updates allowed
- **Protected roles** - users cannot change their own role

## Database Structure

```
profiles
├── id (uuid, primary key)
├── email (text, unique)
├── username (text, unique)
├── role (text: 'admin' | 'commenter')
└── created_at (timestamp)

posts
├── id (uuid, primary key)
├── user_id (uuid, foreign key)
├── title (text)
├── content (text)
├── slug (text, unique)
├── published (boolean)
├── created_at (timestamp)
└── updated_at (timestamp)

comments
├── id (uuid, primary key)
├── post_id (uuid, foreign key)
├── user_id (uuid, foreign key)
├── content (text)
└── created_at (timestamp)
```

## Making Changes

If you need to modify the database:

1. Test changes in Supabase SQL editor first
2. Update the relevant SQL file in this folder
3. Document the change in this README
4. Consider RLS impact on any new tables/columns

## Useful Queries

Check if RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

View active policies:
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

Check security advisors:
Use the Supabase dashboard → Database → Advisors

