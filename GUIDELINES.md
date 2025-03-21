# AsteriaGL Contribution Guidelines

This document outlines best practices and patterns for contributing to the Andamio codebase. Following these guidelines ensures code consistency, maintainability, and optimal performance across the application.

## Architecture Principles

### Server-Side Logic

- **No client-side business logic**: All business logic should be implemented in TRPC routers on the server.
- **Client components should be presentational**: Client components should focus on UI concerns and delegate data fetching and mutations to custom hooks.

### Data Fetching Pattern

- **One query per component**: Components should ideally make only one query. If a component needs additional data, create a specific endpoint in the TRPC router.
- **Custom hooks for data access**: Wrap all TRPC endpoints in custom hooks that follow the `use<EntityName>` pattern.

### Type Safety

- **Use Zod for validation**: All input and output schemas should be validated with Zod.
- **Leverage TypeScript**: Maintain strict typing throughout the codebase.

## Folder Structure

```
src/
├── components/      # UI components
├── hooks/           # Custom hooks
│   ├── db/          # Database-related hooks
│   └── cardano-indexer-api/  # External API hooks
├── server/
│   └── api/
│       └── routers/ # TRPC routers
└── utils/           # Utility functions
```

## TRPC Router Implementation

### Router Creation

1. Create a new router file in `src/server/api/routers/` using the appropriate subfolder
2. Export the router using the `createTRPCRouter` function
3. Define procedures using `publicProcedure` or `protectedProcedure`

Example:

```typescript
// src/server/api/routers/database/course/module.ts
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const moduleRouter = createTRPCRouter({
  getModule: publicProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Implementation here
    }),

  updateModule: protectedProcedure
    .input(
      z.object({
        /* schema */
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Implementation here
    }),
});
```

### Input Validation

- Always use Zod to validate inputs
- Define detailed schemas with appropriate error messages
- Reuse common schemas when possible

```typescript
// Good example
.input(
  z.object({
    moduleId: z.string().min(1, "Module ID is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string(),
  })
)

// Avoid
.input(
  z.object({
    moduleId: z.string(),
    title: z.string(),
    description: z.string(),
  })
)
```

### Error Handling

- Use TRPC's error system to communicate errors to the client
- Include meaningful error messages
- Use appropriate error codes

```typescript
if (!courseModule) {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Module not found",
  });
}
```

## Custom Hooks

### Query Hooks

Create a custom hook for each TRPC query following the `use<EntityName>` pattern.

```typescript
// src/hooks/db/course/useCourseModule.ts
export default function useCourseModule(moduleId: string | undefined) {
  const {
    data: module,
    isLoading,
    isError,
    error,
  } = api.module.getModule.useQuery(
    { moduleId: moduleId ?? "" },
    { enabled: !!moduleId },
  );

  return {
    module,
    isLoading,
    isError,
    error,
  };
}
```

### Mutation Hooks

Create custom hooks for mutations that handle cache invalidation.

```typescript
// Inside the same hook file
const updateModuleStatus = api.module.updateModuleStatus.useMutation({
  onSuccess: async () => {
    // Invalidate relevant queries
    await ctx.module.getModule.invalidate({ moduleId });
    await ctx.module.getCourseModuleOverviews.invalidate();
  },
});

// Return in the hook
return {
  module,
  isLoading,
  updateModuleStatus: updateModuleStatus.mutate,
  // Other properties
};
```

### Component Integration

Components should use the custom hooks instead of directly using the TRPC API.

```tsx
// Good
function ModuleEditor({ moduleId }: { moduleId: string }) {
  const { module, updateModuleStatus } = useCourseModule(moduleId);

  // Component implementation
}

// Avoid
function ModuleEditor({ moduleId }: { moduleId: string }) {
  const { data: module } = api.module.getModule.useQuery({ moduleId });
  const updateModule = api.module.updateModuleStatus.useMutation();

  // Component implementation
}
```

## Form Handling

### Form Construction

- Use `react-hook-form` for form state management
- Integrate Zod validation with `zodResolver`

```tsx
const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const form = useForm<FormValues>({
  resolver: zodResolver(FormSchema),
  defaultValues: {
    title: "",
    description: "",
  },
});
```

### Form Components

- Use the provided form components from your UI library
- Ensure accessibility is maintained
- Handle loading and error states appropriately

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter title" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    {/* More fields */}
    <Button type="submit" disabled={isLoading}>
      Submit
    </Button>
  </form>
</Form>
```

## Component Design

### Props and TypeScript

- Define prop types explicitly using TypeScript interfaces
- Use sensible defaults and optional props where appropriate

```tsx
interface TaskDialogProps {
  id?: string;
  escrowId?: string;
  treasuryId?: string;
  escrow?: Escrow;
  openButtonSize?: "sm" | "lg";
}

export default function DialogTask({
  id,
  escrowId: defaultEscrowId,
  treasuryId: defaultTreasuryId,
  escrow,
  openButtonSize,
}: TaskDialogProps) {
  // Component implementation
}
```

### React Hooks Best Practices

#### Using `useState` Effectively

- **Minimize state variables**: Keep state minimal by deriving values when possible
- **Use appropriate initial values**: Provide sensible defaults that prevent errors during initial render
- **Group related state**: Use objects for related state or consider using `useReducer` for complex state
- **Follow naming conventions**: Use `[value, setValue]` pattern for clarity

```tsx
// Good
const [isOpen, setIsOpen] = useState(false);
const isButtonDisabled = isOpen || isLoading;

// Better for related state
const [formState, setFormState] = useState({
  isSubmitting: false,
  hasErrors: false,
  attemptCount: 0,
});

// Update related state immutably
setFormState((prev) => ({
  ...prev,
  attemptCount: prev.attemptCount + 1,
}));

// Avoid
const [isOpen, setIsOpen] = useState(false);
const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Derivable from other state
const [submitting, setSubmitting] = useState(false); // Should be grouped with related state
```

#### When to Use `useState`

- Use for state that triggers re-renders when changed
- Use for values that cannot be derived from props or other state
- Use for UI state like toggles, form inputs, and loading states
- Avoid using for values that can be computed from existing state or props

#### Using `useEffect` Properly

- **Be specific with dependencies**: Include all values from the component scope that the effect uses
- **Clean up side effects**: Return a cleanup function for subscriptions, timers, or event listeners
- **Use effect for synchronization**: Effects synchronize your component with external systems
- **Split unrelated effects**: Use multiple `useEffect` calls for unrelated logic
- **Avoid redundant effects**: Don't use effects for state transformations that could be done directly

```tsx
// Good: Specific purpose with proper cleanup
useEffect(() => {
  const subscription = someExternalAPI.subscribe((data) => {
    setApiData(data);
  });

  return () => {
    subscription.unsubscribe();
  };
}, [someExternalAPI]);

// Good: Loading data conditionally
useEffect(() => {
  if (isOpen && !hasLoadedCriteria && escrow?.savedAcceptanceCriteria?.length) {
    form.setValue(
      "acceptanceCriteria",
      escrow.savedAcceptanceCriteria.filter(
        (criteria) => criteria.trim() !== "",
      ),
      { shouldValidate: true },
    );
    setHasLoadedCriteria(true);
  }
}, [escrow, form, isOpen, hasLoadedCriteria]);

// Avoid: Empty dependency array when dependencies exist
useEffect(() => {
  setFilteredItems(items.filter((item) => item.isActive));
  // Missing dependency: items
}, []);

// Avoid: Side effects that could be simple derivations
useEffect(() => {
  setTotalPrice(items.reduce((sum, item) => sum + item.price, 0));
}, [items]); // This should be a derived value instead
```

#### Common Anti-patterns to Avoid

1. **Dependency array lies**: Missing dependencies that should be included
2. **Over-synchronization**: Running effects for state that could be derived
3. **Effect chains**: One effect setting state that triggers another effect
4. **Conditional hook calls**: Hooks must be called at the top level, never conditionally
5. **Stale closure problems**: Not using the latest state in effect callbacks

```tsx
// Anti-pattern: Dependency array lie
useEffect(() => {
  setFilteredResults(
    allItems.filter((item) => item.category === selectedCategory),
  );
  // Missing dependencies: allItems, selectedCategory
}, []);

// Anti-pattern: Effect chain
useEffect(() => {
  setProcessedData(data.map((item) => ({ ...item, processed: true })));
}, [data]);

useEffect(() => {
  setFilteredData(processedData.filter((item) => item.isRelevant));
}, [processedData]); // These could be combined or made into a derived value

// Correct approach for the above - derive values
const processedData = useMemo(
  () => data.map((item) => ({ ...item, processed: true })),
  [data],
);

const filteredData = useMemo(
  () => processedData.filter((item) => item.isRelevant),
  [processedData],
);
```

#### When to Use `useEffect`

- Fetching data that cannot be handled by the query hooks
- Setting up and tearing down subscriptions or connections
- Manually changing the DOM in ways React cannot handle
- Logging or analytics that need to run after renders
- Syncing component state with external storage (localStorage, etc.)

#### When NOT to Use `useEffect`

- Transforming data for rendering (use derived state instead)
- Handling user events (use event handlers instead)
- Running logic on every render (do it directly in the component body)
- Running code only once during app initialization (use an app-level service)

## UI Components

### Reusable Components

- Create reusable UI components for common patterns
- Prefer composition over inheritance
- Use the ShadCN/UI component library when available

### Styling

- Use Tailwind CSS for styling
- Follow the project's naming conventions
- Use the project's color scheme and design tokens

```tsx
// Good
<Button
  intent="destructive"
  size="sm"
  onClick={handleRemoveCriterion}
  disabled={isLoading}
>
  X
</Button>

// Avoid inline styles or separate CSS files
```

## Testing

- Write tests for new functionality
- Ensure existing tests pass
- Use the provided testing utilities

## Code Formatting

- Use the provided `.prettierrc` configuration
- Run prettier before submitting code
- Maintain consistent indentation and spacing

## Performance Considerations

- Use appropriate caching strategies
- Memoize expensive computations with `useMemo` and `useCallback`
- Avoid unnecessary re-renders
- Implement pagination for large data sets

## Security Best Practices

- Always validate user input on the server side
- Use protected procedures for authenticated routes
- Never expose sensitive information to the client

## Documentation

- Document complex functions and components
- Use JSDoc comments for public APIs
- Keep documentation updated as code changes

## PR Guidelines

- Create focused PRs that address a single concern
- Include appropriate tests
- Reference related issues
- Ensure CI passes before requesting review
