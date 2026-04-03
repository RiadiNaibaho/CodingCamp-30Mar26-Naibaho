# Design Document: Expense & Budget Visualizer

## Overview

The Expense & Budget Visualizer is a client-side web application built with vanilla JavaScript, HTML, and CSS. The application enables users to track expenses through a simple transaction input form, view spending history in a scrollable list, monitor total spending, and visualize spending distribution through a pie chart. All data persists locally using the browser's Local Storage API, requiring no backend infrastructure.

The application follows a single-page architecture where all components are visible simultaneously: total balance at the top, input form below it, and the transaction list alongside the spending chart. This layout provides immediate visibility into spending patterns without requiring navigation.

## Architecture

### System Architecture

The application uses a Model-View-Controller (MVC) pattern adapted for vanilla JavaScript:

```
┌─────────────────────────────────────────────────────────┐
│                     index.html                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Total Balance Display                          │   │
│  ├─────────────────────────────────────────────────┤   │
│  │  Transaction Input Form                         │   │
│  ├──────────────────────┬──────────────────────────┤   │
│  │  Transaction List    │  Pie Chart (Chart.js)    │   │
│  │  (Scrollable)        │                          │   │
│  └──────────────────────┴──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   app.js (Controller) │
              └───────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐   ┌──────────┐
    │  Model  │    │   View   │   │ Storage  │
    │ (State) │    │ (Render) │   │ (Local)  │
    └─────────┘    └──────────┘   └──────────┘
```

### Component Breakdown

1. **Model Layer**: Manages application state (transactions array, total balance)
2. **View Layer**: Handles DOM manipulation and rendering (transaction list, chart updates, form display)
3. **Storage Layer**: Manages Local Storage operations (save, load, serialize/deserialize)
4. **Controller Layer**: Coordinates between Model, View, and Storage (event handlers, business logic)

### Technology Stack

- **HTML5**: Semantic markup for structure
- **CSS3**: Styling with flexbox/grid for layout
- **Vanilla JavaScript (ES6+)**: Application logic
- **Chart.js**: Pie chart visualization library
- **Local Storage API**: Client-side data persistence

### File Structure

```
expense-budget-visualizer/
├── index.html          # Main HTML structure
├── css/
│   └── styles.css      # All application styles
└── js/
    └── app.js          # All application logic
```

## Components and Interfaces

### 1. Transaction Input Form Component

**Responsibilities:**
- Capture user input for item name, amount, and category
- Validate input fields before submission
- Clear form after successful submission
- Display validation error messages

**Interface:**
```javascript
// Form validation
function validateTransactionForm(name, amount, category) {
  // Returns: { valid: boolean, error: string }
}

// Form submission handler
function handleFormSubmit(event) {
  // Validates input, creates transaction, updates state
}

// Form reset
function clearForm() {
  // Clears all input fields
}
```

### 2. Transaction List Component

**Responsibilities:**
- Render all transactions in chronological order
- Display transaction details (name, amount, category)
- Provide delete functionality for each transaction
- Handle scrolling for long lists

**Interface:**
```javascript
// Render transaction list
function renderTransactionList(transactions) {
  // Updates DOM with transaction elements
}

// Delete transaction handler
function handleDeleteTransaction(transactionId) {
  // Removes transaction from state and updates view
}
```

### 3. Total Balance Component

**Responsibilities:**
- Calculate sum of all transaction amounts
- Display total with two decimal places
- Update immediately when transactions change

**Interface:**
```javascript
// Calculate total balance
function calculateTotalBalance(transactions) {
  // Returns: number (sum of all amounts)
}

// Update balance display
function updateBalanceDisplay(total) {
  // Updates DOM element with formatted total
}
```

### 4. Pie Chart Component

**Responsibilities:**
- Aggregate spending by category
- Render pie chart using Chart.js
- Update chart when transactions change
- Display distinct colors per category

**Interface:**
```javascript
// Calculate category totals
function calculateCategoryTotals(transactions) {
  // Returns: { Food: number, Transport: number, Fun: number }
}

// Initialize chart
function initializeChart(canvasElement) {
  // Creates Chart.js instance
  // Returns: Chart instance
}

// Update chart data
function updateChart(chartInstance, categoryTotals) {
  // Updates chart with new data
}
```

### 5. Storage Component

**Responsibilities:**
- Save transactions to Local Storage
- Load transactions from Local Storage
- Serialize/deserialize transaction data
- Handle storage errors gracefully

**Interface:**
```javascript
// Save transactions
function saveTransactions(transactions) {
  // Serializes and stores in Local Storage
  // Returns: boolean (success/failure)
}

// Load transactions
function loadTransactions() {
  // Retrieves and deserializes from Local Storage
  // Returns: Transaction[] or empty array
}

// Check storage availability
function isStorageAvailable() {
  // Returns: boolean
}
```

## Data Models

### Transaction Model

```javascript
{
  id: string,           // Unique identifier (timestamp-based or UUID)
  name: string,         // Item name (non-empty)
  amount: number,       // Positive number with up to 2 decimal places
  category: string,     // One of: "Food", "Transport", "Fun"
  timestamp: number     // Unix timestamp for ordering
}
```

**Validation Rules:**
- `id`: Must be unique, non-empty string
- `name`: Must be non-empty string after trimming whitespace
- `amount`: Must be positive number (> 0)
- `category`: Must be one of the three allowed values
- `timestamp`: Must be valid Unix timestamp

### Application State Model

```javascript
{
  transactions: Transaction[],  // Array of all transactions
  chart: Chart | null,          // Chart.js instance
  storageAvailable: boolean     // Local Storage availability flag
}
```

### Local Storage Schema

**Key:** `expense-tracker-transactions`

**Value:** JSON string representing Transaction array

```json
[
  {
    "id": "1234567890123",
    "name": "Lunch",
    "amount": 12.50,
    "category": "Food",
    "timestamp": 1234567890123
  },
  {
    "id": "1234567890456",
    "name": "Bus fare",
    "amount": 2.75,
    "category": "Transport",
    "timestamp": 1234567890456
  }
]
```

### Category Configuration

```javascript
const CATEGORIES = {
  FOOD: "Food",
  TRANSPORT: "Transport",
  FUN: "Fun"
};

const CATEGORY_COLORS = {
  Food: "#FF6384",      // Pink/Red
  Transport: "#36A2EB", // Blue
  Fun: "#FFCE56"        // Yellow
};
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Valid Transaction Addition Updates All Components

For any valid transaction (non-empty name, positive amount, valid category), when added to the application, the transaction should appear in the list, the total balance should increase by the transaction amount, the chart should reflect the updated category totals, and the transaction should be saved to Local Storage.

**Validates: Requirements 1.3, 3.2, 4.2, 5.1**

### Property 2: Invalid Input Rejection

For any transaction input where the name is empty (or only whitespace), or the amount is non-positive (zero or negative), or the amount is non-numeric, or the category is missing, the form validation should reject the input and display an error message, and the transaction list should remain unchanged.

**Validates: Requirements 1.4, 1.5**

### Property 3: Form Clearing After Successful Addition

For any valid transaction, after successfully adding it to the application, all form input fields should be cleared (empty strings for text inputs, reset to default for select).

**Validates: Requirements 1.6**

### Property 4: Transaction Display Completeness

For any transaction in the application state, the rendered transaction list should contain an element displaying the transaction's name, amount, and category.

**Validates: Requirements 2.1, 2.2**

### Property 5: Transaction Display Order Preservation

For any sequence of transactions added to the application, the displayed transaction list should maintain the same chronological order in which they were added.

**Validates: Requirements 2.3**

### Property 6: Transaction Deletion Updates All Components

For any transaction in the application, when deleted, the transaction should be removed from the list, the total balance should decrease by the transaction amount, the chart should reflect the updated category totals, and Local Storage should be updated to exclude the deleted transaction.

**Validates: Requirements 2.4, 3.3, 4.3, 5.2**

### Property 7: Delete Button Availability

For any transaction displayed in the list, a delete button should be present and associated with that specific transaction.

**Validates: Requirements 2.5**

### Property 8: Total Balance Calculation Accuracy

For any set of transactions in the application, the displayed total balance should equal the sum of all transaction amounts.

**Validates: Requirements 3.4**

### Property 9: Total Balance Formatting

For any calculated total balance value, the displayed total should be formatted with exactly two decimal places.

**Validates: Requirements 3.5**

### Property 10: Chart Category Totals Accuracy

For any set of transactions in the application, the pie chart should display category totals where each category's value equals the sum of all transaction amounts in that category.

**Validates: Requirements 4.5**

### Property 11: Storage Round Trip Preservation

For any set of transactions, after saving to Local Storage and then loading from Local Storage, the loaded transactions should be equivalent to the original transactions (same id, name, amount, category, and timestamp for each).

**Validates: Requirements 5.3, 5.4**

## Error Handling

### Form Validation Errors

**Error Conditions:**
- Empty item name (after trimming whitespace)
- Empty or invalid amount (non-numeric, zero, negative)
- No category selected

**Handling Strategy:**
- Display inline error message near the form
- Prevent form submission
- Maintain current application state
- Keep user input in form fields for correction
- Clear error message when user corrects input

**Error Message Examples:**
- "Please enter an item name"
- "Please enter a valid positive amount"
- "Please select a category"

### Local Storage Errors

**Error Conditions:**
- Local Storage unavailable (disabled, quota exceeded, browser doesn't support)
- JSON parsing errors when loading data
- Corrupted data in Local Storage

**Handling Strategy:**
- Check storage availability on application initialization
- Display persistent warning banner if storage unavailable
- Gracefully handle parsing errors by initializing with empty transaction list
- Log errors to console for debugging
- Allow application to function in memory-only mode if storage fails

**Error Message Examples:**
- "Warning: Local Storage is unavailable. Your data will not be saved."
- "Error loading saved data. Starting with empty transaction list."

### Chart Rendering Errors

**Error Conditions:**
- Chart.js library fails to load
- Canvas element not found
- Invalid chart data

**Handling Strategy:**
- Check for Chart.js availability before initialization
- Display fallback message if chart cannot render
- Continue application functionality without chart
- Log errors to console

**Error Message Examples:**
- "Chart visualization unavailable. Transaction list and totals are still functional."

### Data Validation Errors

**Error Conditions:**
- Transaction with invalid structure loaded from storage
- Missing required fields
- Invalid data types

**Handling Strategy:**
- Validate each transaction when loading from storage
- Skip invalid transactions with console warning
- Continue loading valid transactions
- Prevent corrupted data from breaking application

## Testing Strategy

### Overview

The testing strategy employs a dual approach combining unit tests for specific examples and edge cases with property-based tests for universal correctness guarantees. This comprehensive approach ensures both concrete functionality and general correctness across all possible inputs.

### Property-Based Testing

**Library:** fast-check (JavaScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tag format: `Feature: expense-budget-visualizer, Property {number}: {property_text}`

**Property Test Coverage:**

1. **Property 1 Test**: Generate random valid transactions, add each, verify list contains it, total increases correctly, chart updates, and storage contains it
   - Tag: `Feature: expense-budget-visualizer, Property 1: Valid Transaction Addition Updates All Components`

2. **Property 2 Test**: Generate random invalid transactions (empty names, negative amounts, invalid categories), verify all are rejected with error messages
   - Tag: `Feature: expense-budget-visualizer, Property 2: Invalid Input Rejection`

3. **Property 3 Test**: Generate random valid transactions, add each, verify form fields are cleared after each addition
   - Tag: `Feature: expense-budget-visualizer, Property 3: Form Clearing After Successful Addition`

4. **Property 4 Test**: Generate random transactions, verify rendered list contains all transaction fields for each
   - Tag: `Feature: expense-budget-visualizer, Property 4: Transaction Display Completeness`

5. **Property 5 Test**: Generate random sequence of transactions, add in order, verify display order matches addition order
   - Tag: `Feature: expense-budget-visualizer, Property 5: Transaction Display Order Preservation`

6. **Property 6 Test**: Generate random transactions, add them, delete random ones, verify list updates, total decreases, chart updates, storage updates
   - Tag: `Feature: expense-budget-visualizer, Property 6: Transaction Deletion Updates All Components`

7. **Property 7 Test**: Generate random transactions, verify each has an associated delete button in the rendered list
   - Tag: `Feature: expense-budget-visualizer, Property 7: Delete Button Availability`

8. **Property 8 Test**: Generate random sets of transactions, verify displayed total equals sum of amounts
   - Tag: `Feature: expense-budget-visualizer, Property 8: Total Balance Calculation Accuracy`

9. **Property 9 Test**: Generate random transaction sets with various decimal amounts, verify total displays with exactly two decimal places
   - Tag: `Feature: expense-budget-visualizer, Property 9: Total Balance Formatting`

10. **Property 10 Test**: Generate random transactions across categories, verify chart shows correct sum for each category
    - Tag: `Feature: expense-budget-visualizer, Property 10: Chart Category Totals Accuracy`

11. **Property 11 Test**: Generate random transactions, save to storage, load from storage, verify loaded data matches original
    - Tag: `Feature: expense-budget-visualizer, Property 11: Storage Round Trip Preservation`

### Unit Testing

**Library:** Jest or Mocha (JavaScript testing framework)

**Unit Test Coverage:**

1. **UI Structure Tests** (Examples):
   - Verify form contains name input, amount input, and category dropdown (Requirement 1.1)
   - Verify category dropdown contains exactly "Food", "Transport", "Fun" options (Requirement 1.2)
   - Verify total balance display exists at top of page (Requirement 3.1)
   - Verify pie chart canvas element exists (Requirement 4.1)
   - Verify each category uses distinct color in chart (Requirement 4.4)
   - Verify all form inputs have associated labels (Requirement 6.2)
   - Verify page layout order: total at top, form below, list and chart visible (Requirement 6.5)

2. **Edge Cases**:
   - Test with zero transactions (empty state)
   - Test with single transaction
   - Test with large number of transactions (100+)
   - Test with very large amounts (edge of number precision)
   - Test with very small amounts (0.01)
   - Test Local Storage unavailable scenario (Requirement 5.5)
   - Test with corrupted Local Storage data
   - Test with special characters in transaction names

3. **Integration Tests**:
   - Test complete user flow: add transaction → verify all updates → delete transaction → verify all updates
   - Test application initialization with existing Local Storage data
   - Test chart updates with transactions in single category
   - Test chart updates with transactions across all categories

### Test Data Generators (for Property-Based Testing)

```javascript
// Generate valid transaction
function generateValidTransaction() {
  return {
    id: generateUniqueId(),
    name: generateNonEmptyString(),
    amount: generatePositiveNumber(),
    category: generateCategory(),
    timestamp: Date.now()
  };
}

// Generate invalid transaction
function generateInvalidTransaction() {
  // Randomly choose which field to make invalid
  // Return transaction with empty name, negative amount, or invalid category
}

// Generate category
function generateCategory() {
  return fc.constantFrom("Food", "Transport", "Fun");
}

// Generate positive number
function generatePositiveNumber() {
  return fc.float({ min: 0.01, max: 10000, noNaN: true });
}
```

### Testing Workflow

1. Run property-based tests first to verify universal correctness
2. Run unit tests to verify specific examples and edge cases
3. Run integration tests to verify end-to-end workflows
4. Achieve minimum 90% code coverage
5. All tests must pass before deployment

### Manual Testing Checklist

- Visual verification of UI layout and styling
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Responsive design testing (desktop, tablet, mobile)
- Accessibility testing (keyboard navigation, screen reader compatibility)
- Performance testing with large transaction lists (1000+ items)
- Local Storage quota testing

