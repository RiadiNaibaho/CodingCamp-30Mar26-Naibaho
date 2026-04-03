# Implementation Plan: Expense & Budget Visualizer

## Overview

This implementation plan breaks down the Expense & Budget Visualizer into discrete coding tasks. The application is a vanilla JavaScript web app with HTML/CSS that tracks expenses, displays them in a list, shows a total balance, and visualizes spending with a pie chart. All data persists in Local Storage.

The implementation follows an incremental approach: first establishing the HTML structure and basic styling, then building core functionality (transaction management), followed by visualization (chart integration), and finally data persistence and error handling.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create index.html with semantic HTML5 structure
  - Include meta tags for viewport and charset
  - Add container divs for: total balance display, transaction form, transaction list, and chart canvas
  - Link to Chart.js CDN (or local copy)
  - Link to css/styles.css and js/app.js
  - Create form with inputs: item name (text), amount (number), category (select with Food/Transport/Fun options)
  - Add submit button to form
  - Create empty div/ul for transaction list display
  - Create canvas element for pie chart
  - _Requirements: 1.1, 1.2, 6.2, 6.5_

- [x] 2. Create CSS styling
  - Create css/styles.css with base styles and CSS reset
  - Style the page layout with total balance at top, form below, list and chart side-by-side
  - Implement consistent color scheme throughout interface
  - Style form inputs with clear labels and appropriate spacing
  - Style buttons with hover effects for visual feedback
  - Style transaction list items with readable typography
  - Make transaction list scrollable with max-height
  - Ensure responsive layout for different screen sizes
  - Apply distinct colors for each category (Food: #FF6384, Transport: #36A2EB, Fun: #FFCE56)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 3. Implement core application structure and state management
  - [x] 3.1 Create js/app.js with application initialization
    - Define application state object (transactions array, chart instance, storageAvailable flag)
    - Define CATEGORIES constant object with Food, Transport, Fun
    - Define CATEGORY_COLORS constant object with color mappings
    - Define LOCAL_STORAGE_KEY constant
    - Create DOMContentLoaded event listener for initialization
    - _Requirements: All requirements depend on this foundation_
  
  - [ ]* 3.2 Set up property-based testing framework
    - Install fast-check library for property-based testing
    - Create test file structure for property tests
    - Configure test runner with minimum 100 iterations per property
    - _Requirements: Testing infrastructure for all properties_

- [x] 4. Implement transaction model and validation
  - [x] 4.1 Create transaction validation function
    - Implement validateTransactionForm(name, amount, category) function
    - Validate name is non-empty after trimming whitespace
    - Validate amount is positive number (> 0) and numeric
    - Validate category is one of the three allowed values
    - Return object with { valid: boolean, error: string }
    - _Requirements: 1.4, 1.5_
  
  - [ ]* 4.2 Write property test for invalid input rejection
    - **Property 2: Invalid Input Rejection**
    - **Validates: Requirements 1.4, 1.5**
    - Generate random invalid transactions (empty names, negative/zero amounts, invalid categories)
    - Verify validation function rejects all invalid inputs with error messages
    - Tag: `Feature: expense-budget-visualizer, Property 2: Invalid Input Rejection`
  
  - [x] 4.3 Create transaction factory function
    - Implement createTransaction(name, amount, category) function
    - Generate unique ID using timestamp or UUID approach
    - Create timestamp for ordering
    - Return transaction object with all required fields
    - _Requirements: 1.3, 2.3_
  
  - [ ]* 4.4 Write unit tests for transaction validation
    - Test validation with empty name, whitespace-only name
    - Test validation with zero amount, negative amount, non-numeric amount
    - Test validation with missing category, invalid category
    - Test validation with valid inputs returns success
    - _Requirements: 1.4, 1.5_

- [x] 5. Implement form handling and transaction addition
  - [x] 5.1 Create form submission handler
    - Implement handleFormSubmit(event) function
    - Prevent default form submission
    - Get form values from DOM inputs
    - Call validation function
    - If invalid, display error message and return early
    - If valid, create transaction and add to state
    - Call functions to update all components (list, balance, chart, storage)
    - Clear form fields after successful addition
    - _Requirements: 1.3, 1.4, 1.6_
  
  - [x] 5.2 Create form clearing function
    - Implement clearForm() function
    - Reset all input fields to empty/default values
    - Clear any displayed error messages
    - _Requirements: 1.6_
  
  - [x] 5.3 Create error message display function
    - Implement displayError(message) function
    - Show error message near form with appropriate styling
    - Auto-clear error when user starts typing
    - _Requirements: 1.4_
  
  - [ ]* 5.4 Write property test for valid transaction addition
    - **Property 1: Valid Transaction Addition Updates All Components**
    - **Validates: Requirements 1.3, 3.2, 4.2, 5.1**
    - Generate random valid transactions
    - Add each transaction and verify it appears in list
    - Verify total balance increases by transaction amount
    - Verify chart reflects updated category totals
    - Verify transaction is saved to Local Storage
    - Tag: `Feature: expense-budget-visualizer, Property 1: Valid Transaction Addition Updates All Components`
  
  - [ ]* 5.5 Write property test for form clearing
    - **Property 3: Form Clearing After Successful Addition**
    - **Validates: Requirements 1.6**
    - Generate random valid transactions
    - Add each and verify all form fields are cleared after addition
    - Tag: `Feature: expense-budget-visualizer, Property 3: Form Clearing After Successful Addition`

- [x] 6. Checkpoint - Verify form functionality
  - Ensure form validation works correctly with valid and invalid inputs
  - Ensure transactions are added to state array
  - Ensure form clears after successful submission
  - Ask the user if questions arise

- [x] 7. Implement transaction list display
  - [x] 7.1 Create transaction list rendering function
    - Implement renderTransactionList(transactions) function
    - Clear existing list DOM elements
    - Iterate through transactions array in order
    - For each transaction, create list item element with name, amount, category
    - Format amount with two decimal places and currency symbol
    - Add delete button to each list item with data attribute for transaction ID
    - Append all elements to transaction list container
    - _Requirements: 2.1, 2.2, 2.3, 2.5_
  
  - [x] 7.2 Create delete transaction handler
    - Implement handleDeleteTransaction(transactionId) function
    - Find transaction in state array by ID
    - Remove transaction from state array
    - Call functions to update all components (list, balance, chart, storage)
    - _Requirements: 2.4_
  
  - [x] 7.3 Attach event listeners to delete buttons
    - Use event delegation on transaction list container
    - Listen for clicks on delete buttons
    - Extract transaction ID from clicked button
    - Call delete handler with transaction ID
    - _Requirements: 2.4, 2.5_
  
  - [ ]* 7.4 Write property test for transaction display completeness
    - **Property 4: Transaction Display Completeness**
    - **Validates: Requirements 2.1, 2.2**
    - Generate random transactions and add to state
    - Render list and verify each transaction's name, amount, and category are displayed
    - Tag: `Feature: expense-budget-visualizer, Property 4: Transaction Display Completeness`
  
  - [ ]* 7.5 Write property test for display order preservation
    - **Property 5: Transaction Display Order Preservation**
    - **Validates: Requirements 2.3**
    - Generate random sequence of transactions
    - Add in specific order and verify display order matches addition order
    - Tag: `Feature: expense-budget-visualizer, Property 5: Transaction Display Order Preservation`
  
  - [ ]* 7.6 Write property test for delete button availability
    - **Property 7: Delete Button Availability**
    - **Validates: Requirements 2.5**
    - Generate random transactions
    - Verify each rendered transaction has an associated delete button
    - Tag: `Feature: expense-budget-visualizer, Property 7: Delete Button Availability`
  
  - [ ]* 7.7 Write property test for transaction deletion
    - **Property 6: Transaction Deletion Updates All Components**
    - **Validates: Requirements 2.4, 3.3, 4.3, 5.2**
    - Generate random transactions, add them, then delete random ones
    - Verify deleted transactions are removed from list
    - Verify total balance decreases by deleted amount
    - Verify chart updates to reflect new category totals
    - Verify Local Storage is updated
    - Tag: `Feature: expense-budget-visualizer, Property 6: Transaction Deletion Updates All Components`
  
  - [ ]* 7.8 Write unit tests for transaction list edge cases
    - Test rendering with zero transactions (empty state)
    - Test rendering with single transaction
    - Test rendering with large number of transactions (100+)
    - Test delete functionality removes correct transaction
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 8. Implement total balance calculation and display
  - [x] 8.1 Create balance calculation function
    - Implement calculateTotalBalance(transactions) function
    - Use reduce to sum all transaction amounts
    - Return total as number
    - _Requirements: 3.4_
  
  - [x] 8.2 Create balance display update function
    - Implement updateBalanceDisplay(total) function
    - Format total with exactly two decimal places
    - Add currency symbol or label
    - Update DOM element with formatted total
    - _Requirements: 3.1, 3.5_
  
  - [x] 8.3 Integrate balance updates into add/delete flows
    - Call updateBalanceDisplay after adding transaction
    - Call updateBalanceDisplay after deleting transaction
    - _Requirements: 3.2, 3.3_
  
  - [ ]* 8.4 Write property test for balance calculation accuracy
    - **Property 8: Total Balance Calculation Accuracy**
    - **Validates: Requirements 3.4**
    - Generate random sets of transactions
    - Verify displayed total equals sum of all transaction amounts
    - Tag: `Feature: expense-budget-visualizer, Property 8: Total Balance Calculation Accuracy`
  
  - [ ]* 8.5 Write property test for balance formatting
    - **Property 9: Total Balance Formatting**
    - **Validates: Requirements 3.5**
    - Generate random transaction sets with various decimal amounts
    - Verify total displays with exactly two decimal places
    - Tag: `Feature: expense-budget-visualizer, Property 9: Total Balance Formatting`
  
  - [ ]* 8.6 Write unit tests for balance edge cases
    - Test balance with zero transactions (should be 0.00)
    - Test balance with single transaction
    - Test balance with very large amounts
    - Test balance with very small amounts (0.01)
    - _Requirements: 3.4, 3.5_

- [x] 9. Checkpoint - Verify list and balance functionality
  - Ensure transactions display correctly in list with all details
  - Ensure delete buttons work and remove correct transactions
  - Ensure total balance calculates and displays correctly
  - Ask the user if questions arise

- [x] 10. Implement pie chart visualization
  - [x] 10.1 Create category totals calculation function
    - Implement calculateCategoryTotals(transactions) function
    - Initialize object with Food: 0, Transport: 0, Fun: 0
    - Iterate through transactions and sum amounts by category
    - Return category totals object
    - _Requirements: 4.5_
  
  - [x] 10.2 Create chart initialization function
    - Implement initializeChart(canvasElement) function
    - Check if Chart.js library is available
    - Create new Chart instance with type 'pie'
    - Configure chart with category labels and colors from CATEGORY_COLORS
    - Set initial data to zeros or empty
    - Store chart instance in application state
    - Return chart instance
    - _Requirements: 4.1, 4.4_
  
  - [x] 10.3 Create chart update function
    - Implement updateChart(chartInstance, categoryTotals) function
    - Update chart data with new category totals
    - Call chart.update() to re-render
    - _Requirements: 4.2, 4.3_
  
  - [x] 10.4 Integrate chart updates into add/delete flows
    - Call updateChart after adding transaction
    - Call updateChart after deleting transaction
    - Call initializeChart during application initialization
    - _Requirements: 4.2, 4.3_
  
  - [ ]* 10.5 Write property test for chart category totals accuracy
    - **Property 10: Chart Category Totals Accuracy**
    - **Validates: Requirements 4.5**
    - Generate random transactions across categories
    - Verify chart displays correct sum for each category
    - Tag: `Feature: expense-budget-visualizer, Property 10: Chart Category Totals Accuracy`
  
  - [ ]* 10.6 Write unit tests for chart edge cases
    - Test chart with zero transactions (all categories at 0)
    - Test chart with transactions in single category only
    - Test chart with transactions across all categories
    - Test chart colors match CATEGORY_COLORS configuration
    - _Requirements: 4.1, 4.4, 4.5_

- [x] 11. Implement Local Storage persistence
  - [x] 11.1 Create storage availability check function
    - Implement isStorageAvailable() function
    - Try to write and read test value to Local Storage
    - Return boolean indicating availability
    - Handle exceptions gracefully
    - _Requirements: 5.5_
  
  - [x] 11.2 Create save transactions function
    - Implement saveTransactions(transactions) function
    - Serialize transactions array to JSON string
    - Store in Local Storage with LOCAL_STORAGE_KEY
    - Return boolean indicating success/failure
    - Handle quota exceeded errors
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 11.3 Create load transactions function
    - Implement loadTransactions() function
    - Retrieve JSON string from Local Storage with LOCAL_STORAGE_KEY
    - Parse JSON string to transactions array
    - Validate each transaction structure
    - Filter out invalid transactions with console warning
    - Return valid transactions array or empty array if none/error
    - _Requirements: 5.3, 5.4_
  
  - [x] 11.4 Integrate storage into add/delete flows
    - Call saveTransactions after adding transaction
    - Call saveTransactions after deleting transaction
    - Call loadTransactions during application initialization
    - Update state with loaded transactions
    - Render initial UI with loaded data
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 11.5 Write property test for storage round trip preservation
    - **Property 11: Storage Round Trip Preservation**
    - **Validates: Requirements 5.3, 5.4**
    - Generate random sets of transactions
    - Save to Local Storage, then load from Local Storage
    - Verify loaded transactions match original (same id, name, amount, category, timestamp)
    - Tag: `Feature: expense-budget-visualizer, Property 11: Storage Round Trip Preservation`
  
  - [ ]* 11.6 Write unit tests for storage edge cases
    - Test with Local Storage unavailable (mock unavailable scenario)
    - Test with corrupted JSON data in Local Storage
    - Test with invalid transaction structures in storage
    - Test with empty Local Storage (first time user)
    - Test quota exceeded scenario
    - _Requirements: 5.3, 5.4, 5.5_

- [x] 12. Implement error handling and user feedback
  - [x] 12.1 Add Local Storage unavailable warning
    - Check storage availability during initialization
    - If unavailable, display persistent warning banner at top of page
    - Style warning banner to be noticeable but not intrusive
    - Message: "Warning: Local Storage is unavailable. Your data will not be saved."
    - _Requirements: 5.5_
  
  - [x] 12.2 Add chart rendering error handling
    - Wrap chart initialization in try-catch
    - If Chart.js unavailable or error occurs, display fallback message
    - Message: "Chart visualization unavailable. Transaction list and totals are still functional."
    - Log error to console for debugging
    - Allow application to continue without chart
    - _Requirements: 4.1_
  
  - [x] 12.3 Add data loading error handling
    - Wrap loadTransactions in try-catch
    - If parsing fails, log error to console
    - Display message: "Error loading saved data. Starting with empty transaction list."
    - Initialize with empty transactions array
    - _Requirements: 5.3_
  
  - [ ]* 12.4 Write unit tests for error scenarios
    - Test form validation error display
    - Test Local Storage unavailable warning display
    - Test chart error fallback message
    - Test data loading error handling
    - _Requirements: 1.4, 5.5_

- [x] 13. Final integration and polish
  - [x] 13.1 Wire all components together in initialization
    - Create init() function that orchestrates startup
    - Check storage availability and display warning if needed
    - Load transactions from Local Storage
    - Initialize chart
    - Render initial transaction list
    - Update initial balance display
    - Update initial chart with loaded data
    - Attach all event listeners (form submit, delete buttons)
    - Call init() on DOMContentLoaded
    - _Requirements: All requirements_
  
  - [x] 13.2 Add accessibility improvements
    - Add ARIA labels to form inputs
    - Add ARIA live region for error messages
    - Ensure keyboard navigation works for all interactive elements
    - Add focus styles for keyboard users
    - Test with screen reader
    - _Requirements: 6.2, 6.3_
  
  - [ ]* 13.3 Write integration tests for complete user flows
    - Test complete flow: load app → add transaction → verify all updates → delete transaction → verify all updates
    - Test initialization with existing Local Storage data
    - Test multiple add/delete operations in sequence
    - _Requirements: All requirements_

- [x] 14. Final checkpoint - Complete testing and validation
  - Run all property-based tests and verify they pass
  - Run all unit tests and verify they pass
  - Run all integration tests and verify they pass
  - Manually test in multiple browsers (Chrome, Firefox, Safari, Edge)
  - Test responsive design on different screen sizes
  - Verify all requirements are met
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties across all possible inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows a bottom-up approach: structure → styling → core logic → visualization → persistence → error handling
- All JavaScript should use ES6+ features (const/let, arrow functions, template literals, etc.)
- Chart.js can be included via CDN or npm package depending on preference
- fast-check library should be installed via npm for property-based testing
