# Would You Try? Create - UI Description

## Application Overview

**Would You Try? Create** is a single-page React application with a two-column layout: a persistent sidebar on the left and a main content area that switches between different views based on user state and actions.

---

## Layout Structure

### Global Layout
- **Navigation Bar (AppNav)** — Fixed top bar with logo, step indicator (1-2), and user account controls
- **Sidebar** — Left column with recipe lists, sharing options, and account access
- **Main Content Area** — Right column that displays different pages/views

### Responsive Behavior
- Desktop-focused design
- Sidebar remains visible
- Main content scrolls independently

---

## Pages & Views

### 1. Landing Page (Unauthenticated)

**Purpose:** First impression for new visitors

**Layout:** Two-panel split design
- **Left Panel:** Brand introduction card
  - Eyebrow text: "Would You Try? Create"
  - Headline: "Your leftovers, one dish"
  - Description explaining the product value
  - CTA button: "Sign in to get started"
- **Right Panel:** Feature highlight cards
  - "Save recipes you love" panel
  - "Tailored to your kitchen" panel

---

### 2. Auth Page (Sign Up / Sign In)

**Purpose:** User authentication

**Layout:** Two-panel split design
- **Left Panel:** Auth form card
  - Back button
  - Toggle between Sign Up / Sign In modes
  - Form fields:
    - Name (sign up only)
    - Email
    - Password (with visibility toggle)
    - Re-type password (sign up only)
  - Password requirements checklist:
    - At least 8 characters
    - At least one number or symbol
    - Lowercase and uppercase
  - Forgot password link (sign in only)
  - Primary submit button
- **Right Panel:** Value proposition cards
  - "Your leftovers, one dish" panel
  - "Save recipes you love" panel

---

### 3. Onboarding Page (4-Step Wizard)

**Purpose:** Collect cafe profile information for new users

**Layout:** Two-panel split design
- **Left Panel:** Step-by-step form
  - Step indicator: "Step X of 4"
  - Dynamic title per step
  - Dynamic subtitle per step
  
  **Step 1 — Your Cafe:**
  - Cafe name input
  - Cuisine type input
  - Description textarea
  
  **Step 2 — Kitchen Equipment:**
  - Toggle button chips for equipment selection:
    - Stovetop, Oven, Grill, Sandwich grill, Deep fryer
    - Blender, Food processor, Microwave, Steamer, Rice cooker
  
  **Step 3 — Preferences:**
  - Cuisine style toggle chips:
    - Asian fusion, Comfort food, Healthy, Mediterranean
    - Brunch, Bakery, Modern Australian, Café classics
  - Ingredients to avoid (comma-separated input)
  
  **Step 4 — Current Menu:**
  - "Add menu item" button
  - Menu item cards with:
    - Dish name input
    - Category dropdown
    - Ingredient search with autocomplete
    - Ingredient chips (removable)
    - Remove item button
  - Skip for now option

- **Right Panel:** Onboarding guidance cards
  - "Set up once, use every day" panel
  - "Edit any time" panel

---

### 4. Prep Page (Ingredient Input)

**Purpose:** Daily ingredient entry for generating suggestions

**Layout:** Single-column form layout

**Components:**

**Header Section:**
- Eyebrow: "Morning Prep · Today's Kitchen"
- Title: "What's in the kitchen?"
- Subtitle explaining at-risk prioritization

**Voice Input:**
- Microphone button with pulse animation when active
- Hint text: "Tap to speak your ingredients"
- Transcript display showing recognized speech
- Matched/unmatched ingredient feedback chips

**Ingredient Selector:**
- **Search Bar:** Text input with clear button
- **Category Tabs (horizontally scrollable):**
  - ⭐ Featured (default)
  - 🥬 Vegetables
  - 🍖 Proteins
  - 🧀 Dairy
  - 🌾 Grains
  - 🌿 Herbs
  - 🥫 Pantry
  - 🍎 Fruits
- **Ingredient Grid:** Clickable chips
  - Unselected: Default styling
  - Selected: Highlighted with checkmark
  - Selected + At-risk: Warning icon added
- **Selected Tray (collapsible):**
  - Badge showing count
  - Expand/collapse toggle
  - Table with columns: Ingredient, Qty, Unit, At-risk, Remove
  - Quantity input (number)
  - Unit dropdown: g, kg, ml, L, pcs, cups, bunch, slice
  - At-risk toggle button

**Chef Notes:**
- Optional textarea for context (e.g., "busy Saturday, market crowd")

**Submit Button:**
- Dynamic text: "Generate today's special — X ingredients selected →"
- Disabled state when no ingredients selected

---

### 5. Output Page (Dish Suggestions)

**Purpose:** Display AI-generated dish suggestions with actions

**Layout:** Centered single-column with cards

**Components:**

**Back Button:** "Back to ingredients" (top-left)

**Result Header:**
- Title: "Your dish suggestions"
- Subtitle: "Based on your leftover ingredients — ranked by waste cleared"

**Recipe Cards (one per suggestion):**

Each card contains:

**Dish Suggestion Card:**
- Dish name (heading)
- Description (paragraph)

**Score Section:**
- "Waste cleared: X%" badge
- "~X portions" badge
- Equipment required badge (if any)

**Ingredient Tag List:**
- Chip for each ingredient
- At-risk ingredients highlighted with warning icon

**Reason Section:**
- Explanation of why this dish was suggested

**Portion Scaling:**
- Number input for portions to sell
- Auto-calculated ingredient quantities display

**Action Buttons:**
- "Save for later" (secondary)
- "Approve" (primary, filled)
- "Adjust" (outlined)

**Adjust Modal:**
- Opens on "Adjust" click
- Editable ingredient list
- Add/remove ingredients
- Save/Cancel buttons

---

### 6. Profile Page (Account Settings)

**Purpose:** Edit cafe profile after initial setup

**Layout:** Two-panel split design
- **Left Panel:** Edit form
  - Back button
  - Title: "[Cafe Name] Profile"
  - Cafe name input
  - Description textarea
  - Equipment toggle chips
  - Current menu items section:
    - Add menu item button
    - Menu item cards (same as onboarding)
  - Save changes button

- **Right Panel:** Value card
  - "Better suggestions" panel

---

### 7. Share Menu Page

**Purpose:** Select dishes to share with customers for voting

**Layout:** Full-page picker interface

**Components:**

**Header:**
- Back button
- Eyebrow: "Share with customers"
- Title: "Choose 3 dishes to share"
- Subtitle: "Customers will vote on which one becomes today's special"

**Selection Counter:**
- Three dots (filled based on selection count)
- Text: "X / 3 selected"

**Dish Card Grid:**
- Each card shows:
  - Selection badge (number 1-3)
  - Source badge: "Approved" or "Saved"
  - Dish name
  - Description
  - Meta row: waste score, portions, equipment
  - Ingredient chips (at-risk highlighted)
  - At-risk ingredient count note
- Cards are clickable to select/deselect
- Disabled state when 3 already selected

**Footer:**
- Share button (disabled until 3 selected)
- Loading state with spinner

**Success View (after sharing):**
- Check icon
- "Menu shared!" title
- Customer link with copy button
- Share options: WhatsApp, Email, Copy link
- "Share different dishes" and "Back to prep" buttons

---

### 8. Recipe Detail View

**Purpose:** View full details of a saved or approved recipe

**Layout:** Centered single-column card

**Components:**
- Back button
- Status badge: "✓ Approved" or "Saved"
- Dish Suggestion Card (name + description)
- Recipe Stats section:
  - Waste cleared percentage
  - Portions
  - Equipment required
- Ingredient Tag List
- Reason Section

---

## Sidebar (Persistent)

**Purpose:** Quick access to saved recipes, sharing, and account

**Sections:**

### Approved Recipes
- Section title
- Empty state message or
- List of approved recipe names (clickable to view details)
- Remove button per item

### Saved Recipes
- Section title
- Empty state message or
- List of saved recipe names (clickable to view details)
- Remove button per item

### Share with Customers
- Section title
- Description with count of recommended dishes
- "Choose 3 to share →" button (opens Share Menu Page)

### Account
- Account name (cafe name or email)
- "Account settings" link

---

## Navigation Bar (AppNav)

**Components:**
- **Logo:** "Would You Try? Create" (left)
- **Step Indicator:** (center)
  - Two numbered circles (1, 2)
  - Connected by a line
  - Step labels: "Choose ingredients" / "Get suggestion"
  - Active step highlighted
- **User Controls:** (right)
  - If signed in: User email + "Sign out" button
  - If signed out: "Sign in" button with user icon

---

## Common Components

### Dish Suggestion Card
- Card container with border
- Dish name (h2)
- Description paragraph

### Ingredient Tag List
- Label: "Ingredients"
- Horizontal chip list
- Each chip shows: quantity, unit, name
- At-risk chips have warning icon and different styling

### Reason Section
- "Why this dish?" heading
- AI-generated explanation paragraph

### Loading State
- Spinning animation
- "Loading..." text

### Error State
- Error message
- "Try again" button
- "Back to ingredients" button

### Empty State
- Message explaining no results
- "Try again" button
- "Back to ingredients" button

---

## Design System

### Colors (CSS Variables)
- `--color-primary` — Primary brand color (buttons, highlights)
- `--color-primary-dark` — Darker variant for emphasis
- `--color-bg` — Page background
- `--color-bg-card` — Card background
- `--color-surface` — Secondary surface
- `--color-border` — Border color
- `--color-text` — Primary text
- `--color-text-muted` — Secondary text
- `--color-text-secondary` — Tertiary text
- `--color-warning` — Warning/error color

### Border Radius
- `--radius-sm` — Small elements
- `--radius-md` — Buttons, inputs
- `--radius-lg` — Cards

### Typography
- **Font Families:**
  - DM Sans (body text)
  - Playfair Display (headings)
- **Font Sizes:**
  - Eyebrow: 0.75rem, uppercase, tracking
  - Heading 1: 2rem
  - Heading 2: 1.25rem
  - Body: 0.9375rem
  - Small: 0.8125rem
  - Tiny: 0.75rem

### Spacing
- Card padding: 1.5rem
- Section margins: 1.5rem
- Gap between elements: 0.5rem - 1rem

---

## Interaction Patterns

### Selection
- Click to toggle ingredient selection
- Selected items show checkmark
- Long-press or click for additional options

### At-Risk Flagging
- Toggle button in selected tray
- Warning icon appears on flagged items
- AI prioritizes these in suggestions

### Voice Input
- Tap microphone to start
- Speak naturally with quantities
- Auto-parses and selects matching ingredients
- Shows transcript and matched/unmatched items

### Recipe Actions
- **Save:** Stores for future reference
- **Approve:** Marks for today's special
- **Adjust:** Opens modal to modify ingredients

### Sharing Flow
1. Select exactly 3 dishes from saved/approved
2. Click "Share" to create customer menu
3. Copy link or share via WhatsApp/Email
4. Customers vote (external customer-facing app)

---

## State Management

### Authentication State
- Loading → Check session
- No session → Landing page
- Session + no profile → Onboarding
- Session + profile → Prep page

### View State
- `landing` | `auth` | `onboarding` | `input` | `output` | `profile` | `recipe-detail` | `share-menu`

### Data Persistence
- Cookies for saved/approved recipes
- Cookies for profile cache
- Supabase for user accounts and profiles
- LocalStorage fallback for suggestions

---

*Document describes UI as of March 2026*
