# Database Design Patterns

## Normalization

Organize data to reduce redundancy:
- First Normal Form: Atomic values
- Second Normal Form: No partial dependencies
- Third Normal Form: No transitive dependencies

## Naming Conventions

- Tables: Plural nouns (users, posts)
- Columns: snake_case (created_at) or camelCase (createdAt)
- Primary keys: `id`
- Foreign keys: `{table}Id` (userId)

## Schema Design

- Start with core entities
- Add relationships gradually
- Use indexes for performance
- Add constraints for data integrity

## Migration Strategy

- Small, incremental changes
- Test in development first
- Review SQL before production
- Always backup before migrations
