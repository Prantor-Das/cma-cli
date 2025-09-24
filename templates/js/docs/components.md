# UI Components

The MERN Stack Starter includes a comprehensive set of UI components built with Tailwind CSS and designed for accessibility and customization.

## Component Library

### Button

A versatile button component with multiple variants and states.

```jsx
import Button from "./components/ui/Button";

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With loading state
<Button loading>Loading...</Button>
```

**Props:**
- `variant`: `"default" | "secondary" | "outline" | "ghost" | "destructive"`
- `size`: `"sm" | "md" | "lg"`
- `loading`: `boolean`
- `disabled`: `boolean`
- `className`: `string`

### Card

A flexible card component for displaying content.

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./components/ui/Card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Loading

A loading spinner component with customizable size and text.

```jsx
import Loading from "./components/ui/Loading";

<Loading />
<Loading size="lg" text="Loading data..." />
<Loading size="sm" text="" />
```

**Props:**
- `size`: `"sm" | "default" | "lg"`
- `text`: `string`
- `className`: `string`

### Toast

A notification system for user feedback.

```jsx
import { Toast, ToastContainer } from "./components/ui/Toast";
import { useToast } from "./hooks/useToast";

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success("Operation completed successfully!");
  };

  const handleError = () => {
    toast.error("Something went wrong!");
  };

  return (
    <div>
      <Button onClick={handleSuccess}>Success</Button>
      <Button onClick={handleError}>Error</Button>
      
      {/* Toast Container */}
      <ToastContainer toasts={toast.toasts} />
    </div>
  );
}
```

**Toast Types:**
- `success`: Green notification for successful operations
- `error`: Red notification for errors
- `warning`: Amber notification for warnings
- `info`: Blue notification for information

## Custom Hooks

### useToast

Manages toast notifications throughout your application.

```jsx
const toast = useToast();

// Methods
toast.success("Success message");
toast.error("Error message");
toast.warning("Warning message");
toast.info("Info message");

// Custom duration
toast.success("Message", 3000); // 3 seconds

// Access all toasts
console.log(toast.toasts);
```

### useApi

A hook for making API requests with loading and error states.

```jsx
import { useApi } from "./hooks/useApi";

function UserList() {
  const { data, loading, error, refetch } = useApi("/api/users");

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.users?.map(user => (
        <div key={user._id}>{user.name}</div>
      ))}
      <Button onClick={refetch}>Refresh</Button>
    </div>
  );
}
```

## Styling Guidelines

### Theme Classes

The application supports both light and dark themes with CSS classes:

```css
/* Light theme */
.light {
  @apply bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900;
}

/* Dark theme */
.dark {
  @apply bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-slate-100;
}
```

### Status Colors

Use predefined status classes for consistent coloring:

```css
.status-success { /* Green colors */ }
.status-error { /* Red colors */ }
.status-warning { /* Amber colors */ }
.status-info { /* Blue colors */ }
```

### Animations

Built-in animation classes:

```css
.animate-fade-in { /* Fade in animation */ }
.animate-slide-up { /* Slide up animation */ }
.animate-slide-down { /* Slide down animation */ }
.animate-scale-in { /* Scale in animation */ }
```

## Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation**: All interactive elements support keyboard navigation
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations

### Focus Styles

Use the `.focus-ring` class for consistent focus styling:

```jsx
<button className="focus-ring">Accessible Button</button>
```

## Customization

### Extending Components

You can extend existing components:

```jsx
// Custom button with additional styling
function PrimaryButton({ children, ...props }) {
  return (
    <Button 
      className="bg-gradient-to-r from-blue-600 to-purple-600" 
      {...props}
    >
      {children}
    </Button>
  );
}
```

### Creating New Components

Follow the established patterns:

```jsx
import { cn } from "../utils/cn";

function MyComponent({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "base-styles",
        "hover:hover-styles",
        "dark:dark-styles",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

## Best Practices

1. **Use the `cn` utility** for combining classes
2. **Support both themes** in your components
3. **Include proper TypeScript types** (in TS version)
4. **Add accessibility attributes** when needed
5. **Follow the established naming conventions**
6. **Test components** in both light and dark modes