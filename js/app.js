    // Constants
const CATEGORIES = {
    FOOD: "Food",
    TRANSPORT: "Transport",
    FUN: "Fun"
};

const CATEGORY_COLORS = {
    Food: "#FF6384",
    Transport: "#36A2EB",
    Fun: "#FFCE56"
};

const LOCAL_STORAGE_KEY = "expense-tracker-transactions";

// Application State
const appState = {
    transactions: [],
    chart: null,
    storageAvailable: false,
    sortBy: 'date',
    spendingLimit: null,
    darkMode: false
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Application initialization function
function initializeApp() {
    console.log('Expense & Budget Visualizer initialized');
    
    // Load dark mode preference
    loadDarkModePreference();
    
    // Check storage availability
    appState.storageAvailable = isStorageAvailable();
    
    // Load transactions from storage
    if (appState.storageAvailable) {
        appState.transactions = loadTransactions();
        loadSpendingLimit();
    } else {
        displayStorageWarning();
    }
    
    // Initialize chart
    initializeChart();
    
    // Render initial UI
    renderTransactionList(appState.transactions);
    updateBalanceDisplay(calculateTotalBalance(appState.transactions));
    updateChart(appState.chart, calculateCategoryTotals(appState.transactions));
    
    // Attach event listeners
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    const form = document.getElementById('transaction-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const transactionList = document.getElementById('transaction-list');
    if (transactionList) {
        transactionList.addEventListener('click', handleDeleteClick);
    }
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Spending limit input
    const limitInput = document.getElementById('spending-limit');
    if (limitInput) {
        limitInput.addEventListener('change', handleSpendingLimitChange);
    }
    
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Setup auto-clear for error messages
    setupErrorAutoClear();
}

// Transaction Validation
function validateTransactionForm(name, amount, category) {
    // Validate name is non-empty after trimming whitespace
    const trimmedName = name.trim();
    if (!trimmedName) {
        return {
            valid: false,
            error: "Please enter an item name"
        };
    }
    
    // Validate amount is numeric
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
        return {
            valid: false,
            error: "Please enter a valid amount"
        };
    }
    
    // Validate amount is positive (> 0)
    if (numericAmount <= 0) {
        return {
            valid: false,
            error: "Please enter a positive amount"
        };
    }
    
    // Validate category is one of the allowed values
    const validCategories = Object.values(CATEGORIES);
    if (!validCategories.includes(category)) {
        return {
            valid: false,
            error: "Please select a category"
        };
    }
    
    // All validations passed
    return {
        valid: true,
        error: ""
    };
}

// Transaction Factory
function createTransaction(name, amount, category) {
    // Generate unique ID using timestamp
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // Create timestamp for ordering
    const timestamp = Date.now();
    
    // Return transaction object with all required fields
    return {
        id: id,
        name: name.trim(),
        amount: parseFloat(amount),
        category: category,
        timestamp: timestamp
    };
}

// Form Handling Functions
function clearForm() {
    // Get form elements
    const itemNameInput = document.getElementById('item-name');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    
    // Reset all input fields to empty/default values
    if (itemNameInput) itemNameInput.value = '';
    if (amountInput) amountInput.value = '';
    if (categorySelect) categorySelect.value = '';
    
    // Clear any displayed error messages
    clearError();
}

function displayError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Auto-clear error when user starts typing
function setupErrorAutoClear() {
    const itemNameInput = document.getElementById('item-name');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    
    const inputs = [itemNameInput, amountInput, categorySelect];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', clearError);
            input.addEventListener('change', clearError);
        }
    });
}

// Placeholder functions (to be implemented in subsequent tasks)
function isStorageAvailable() {
    try {
        // Try to write and read test value to Local Storage
        const testKey = '__storage_test__';
        const testValue = 'test';
        
        localStorage.setItem(testKey, testValue);
        const retrievedValue = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        
        // Return boolean indicating availability
        return retrievedValue === testValue;
    } catch (error) {
        // Handle exceptions gracefully
        console.warn('Local Storage is not available:', error);
        return false;
    }
}

function loadTransactions() {
    try {
        // Retrieve JSON string from Local Storage with LOCAL_STORAGE_KEY
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        
        // If no data exists, return empty array
        if (!storedData) {
            return [];
        }
        
        // Parse JSON string to transactions array
        const transactions = JSON.parse(storedData);
        
        // Validate that it's an array
        if (!Array.isArray(transactions)) {
            console.warn('Stored data is not an array, returning empty array');
            return [];
        }
        
        // Validate each transaction structure and filter out invalid ones
        const validTransactions = transactions.filter(transaction => {
            // Check if transaction has all required fields
            const isValid = 
                transaction &&
                typeof transaction.id === 'string' &&
                typeof transaction.name === 'string' &&
                typeof transaction.amount === 'number' &&
                typeof transaction.category === 'string' &&
                typeof transaction.timestamp === 'number' &&
                transaction.amount > 0 &&
                Object.values(CATEGORIES).includes(transaction.category);
            
            if (!isValid) {
                console.warn('Invalid transaction found and filtered out:', transaction);
            }
            
            return isValid;
        });
        
        // Return valid transactions array
        return validTransactions;
    } catch (error) {
        // Return empty array if error occurs
        console.error('Error loading transactions from storage:', error);
        return [];
    }
}

function saveTransactions(transactions) {
    try {
        // Serialize transactions array to JSON string
        const jsonString = JSON.stringify(transactions);
        
        // Store in Local Storage with LOCAL_STORAGE_KEY
        localStorage.setItem(LOCAL_STORAGE_KEY, jsonString);
        
        // Return boolean indicating success
        return true;
    } catch (error) {
        // Handle quota exceeded errors
        if (error.name === 'QuotaExceededError') {
            console.error('Local Storage quota exceeded. Please export your data.');
            alert('Storage quota exceeded. Your data cannot be saved. Please export your transactions.');
        } else {
            console.error('Error saving transactions to storage:', error);
        }
        
        // Return boolean indicating failure
        return false;
    }
}

function displayStorageWarning() {
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Create warning banner
    const warningBanner = document.createElement('div');
    warningBanner.id = 'storage-warning';
    warningBanner.style.backgroundColor = '#e74c3c';
    warningBanner.style.color = 'white';
    warningBanner.style.padding = '15px';
    warningBanner.style.borderRadius = '4px';
    warningBanner.style.marginBottom = '20px';
    warningBanner.style.textAlign = 'center';
    warningBanner.style.fontWeight = '600';
    warningBanner.textContent = 'Warning: Local Storage is unavailable. Your data will not be saved.';
    
    // Insert at the beginning of container
    container.insertBefore(warningBanner, container.firstChild);
}

function renderTransactionList(transactions) {
    const transactionList = document.getElementById('transaction-list');
    if (!transactionList) return;
    
    // Clear existing list DOM elements
    transactionList.innerHTML = '';
    
    // Check if there are no transactions
    if (transactions.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No transactions yet. Add one above!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#7f8c8d';
        emptyMessage.style.padding = '20px';
        transactionList.appendChild(emptyMessage);
        return;
    }
    
    // Sort transactions based on current sort setting
    const sortedTransactions = sortTransactions(transactions, appState.sortBy);
    
    // Iterate through sorted transactions array
    sortedTransactions.forEach(transaction => {
        // Create list item element
        const listItem = document.createElement('li');
        listItem.className = `transaction-item ${transaction.category.toLowerCase()}`;
        
        // Highlight if over spending limit
        if (appState.spendingLimit && transaction.amount > appState.spendingLimit) {
            listItem.classList.add('over-limit-item');
        }
        
        // Create transaction details container
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'transaction-details';
        
        // Create name element
        const nameDiv = document.createElement('div');
        nameDiv.className = 'transaction-name';
        nameDiv.textContent = transaction.name;
        
        // Create category element
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'transaction-category';
        categoryDiv.textContent = transaction.category;
        
        // Append name and category to details
        detailsDiv.appendChild(nameDiv);
        detailsDiv.appendChild(categoryDiv);
        
        // Create amount element with two decimal places and currency symbol
        const amountDiv = document.createElement('div');
        amountDiv.className = 'transaction-amount';
        amountDiv.textContent = `$${transaction.amount.toFixed(2)}`;
        
        // Create delete button with data attribute for transaction ID
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-transaction-id', transaction.id);
        deleteButton.setAttribute('aria-label', `Delete ${transaction.name} transaction`);
        
        // Append all elements to list item
        listItem.appendChild(detailsDiv);
        listItem.appendChild(amountDiv);
        listItem.appendChild(deleteButton);
        
        // Append list item to transaction list container
        transactionList.appendChild(listItem);
    });
}

function calculateTotalBalance(transactions) {
    // Use reduce to sum all transaction amounts
    const total = transactions.reduce((sum, transaction) => {
        return sum + transaction.amount;
    }, 0);
    
    // Return total as number
    return total;
}

function updateBalanceDisplay(total) {
    const balanceElement = document.getElementById('total-balance');
    if (!balanceElement) return;
    
    // Format total with exactly two decimal places
    // Add currency symbol or label
    const formattedTotal = `$${total.toFixed(2)}`;
    
    // Update DOM element with formatted total
    balanceElement.textContent = formattedTotal;
    
    // Highlight if over spending limit
    if (appState.spendingLimit && total > appState.spendingLimit) {
        balanceElement.classList.add('over-limit');
    } else {
        balanceElement.classList.remove('over-limit');
    }
}

function calculateCategoryTotals(transactions) {
    // Initialize object with Food: 0, Transport: 0, Fun: 0
    const categoryTotals = {
        Food: 0,
        Transport: 0,
        Fun: 0
    };
    
    // Iterate through transactions and sum amounts by category
    transactions.forEach(transaction => {
        if (categoryTotals.hasOwnProperty(transaction.category)) {
            categoryTotals[transaction.category] += transaction.amount;
        }
    });
    
    // Return category totals object
    return categoryTotals;
}

function initializeChart() {
    const canvas = document.getElementById('spending-chart');
    if (!canvas) {
        console.error('Chart canvas element not found');
        return null;
    }
    
    // Check if Chart.js library is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        displayChartError();
        return null;
    }
    
    try {
        // Create new Chart instance with type 'pie'
        const chart = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['Food', 'Transport', 'Fun'],
                datasets: [{
                    data: [0, 0, 0], // Set initial data to zeros
                    backgroundColor: [
                        CATEGORY_COLORS.Food,
                        CATEGORY_COLORS.Transport,
                        CATEGORY_COLORS.Fun
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: $${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
        
        // Store chart instance in application state
        appState.chart = chart;
        
        // Return chart instance
        return chart;
    } catch (error) {
        console.error('Error initializing chart:', error);
        displayChartError();
        return null;
    }
}

function updateChart(chartInstance, categoryTotals) {
    // Check if chart instance exists
    if (!chartInstance) {
        console.warn('Chart instance not available');
        return;
    }
    
    // Update chart data with new category totals
    chartInstance.data.datasets[0].data = [
        categoryTotals.Food,
        categoryTotals.Transport,
        categoryTotals.Fun
    ];
    
    // Call chart.update() to re-render
    chartInstance.update();
}

function displayChartError() {
    const chartSection = document.querySelector('.chart-section');
    if (chartSection) {
        const errorMessage = document.createElement('div');
        errorMessage.style.padding = '20px';
        errorMessage.style.textAlign = 'center';
        errorMessage.style.color = '#e74c3c';
        errorMessage.textContent = 'Chart visualization unavailable. Transaction list and totals are still functional.';
        chartSection.appendChild(errorMessage);
    }
}

function handleFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();
    
    // Get form values from DOM inputs
    const itemNameInput = document.getElementById('item-name');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    
    const name = itemNameInput ? itemNameInput.value : '';
    const amount = amountInput ? amountInput.value : '';
    const category = categorySelect ? categorySelect.value : '';
    
    // Call validation function
    const validation = validateTransactionForm(name, amount, category);
    
    // If invalid, display error message and return early
    if (!validation.valid) {
        displayError(validation.error);
        return;
    }
    
    // If valid, create transaction and add to state
    const transaction = createTransaction(name, amount, category);
    appState.transactions.push(transaction);
    
    // Update all components (list, balance, chart, storage)
    renderTransactionList(appState.transactions);
    updateBalanceDisplay(calculateTotalBalance(appState.transactions));
    updateChart(appState.chart, calculateCategoryTotals(appState.transactions));
    
    // Save to storage if available
    if (appState.storageAvailable) {
        saveTransactions(appState.transactions);
    }
    
    // Clear form fields after successful addition
    clearForm();
    
    console.log('Transaction added:', transaction);
}

function handleDeleteClick(event) {
    // Check if the clicked element is a delete button
    if (event.target.classList.contains('btn-delete')) {
        // Extract transaction ID from clicked button
        const transactionId = event.target.getAttribute('data-transaction-id');
        if (transactionId) {
            // Call delete handler with transaction ID
            handleDeleteTransaction(transactionId);
        }
    }
}

// Delete transaction handler
function handleDeleteTransaction(transactionId) {
    // Find transaction in state array by ID
    const transactionIndex = appState.transactions.findIndex(t => t.id === transactionId);
    
    if (transactionIndex === -1) {
        console.error('Transaction not found:', transactionId);
        return;
    }
    
    // Remove transaction from state array
    appState.transactions.splice(transactionIndex, 1);
    
    // Update all components (list, balance, chart, storage)
    renderTransactionList(appState.transactions);
    updateBalanceDisplay(calculateTotalBalance(appState.transactions));
    updateChart(appState.chart, calculateCategoryTotals(appState.transactions));
    
    // Save to storage if available
    if (appState.storageAvailable) {
        saveTransactions(appState.transactions);
    }
    
    console.log('Transaction deleted:', transactionId);
}


// Sorting Functions
function handleSortChange(event) {
    appState.sortBy = event.target.value;
    renderTransactionList(appState.transactions);
}

function sortTransactions(transactions, sortBy) {
    const sorted = [...transactions];
    
    switch(sortBy) {
        case 'amount-high':
            return sorted.sort((a, b) => b.amount - a.amount);
        case 'amount-low':
            return sorted.sort((a, b) => a.amount - b.amount);
        case 'category':
            return sorted.sort((a, b) => a.category.localeCompare(b.category));
        case 'date':
        default:
            return sorted.sort((a, b) => b.timestamp - a.timestamp);
    }
}

// Spending Limit Functions
function handleSpendingLimitChange(event) {
    const limit = parseFloat(event.target.value);
    if (!isNaN(limit) && limit > 0) {
        appState.spendingLimit = limit;
        if (appState.storageAvailable) {
            localStorage.setItem('spending-limit', limit.toString());
        }
    } else {
        appState.spendingLimit = null;
        if (appState.storageAvailable) {
            localStorage.removeItem('spending-limit');
        }
    }
    updateBalanceDisplay(calculateTotalBalance(appState.transactions));
}

function loadSpendingLimit() {
    try {
        const savedLimit = localStorage.getItem('spending-limit');
        if (savedLimit) {
            const limit = parseFloat(savedLimit);
            if (!isNaN(limit) && limit > 0) {
                appState.spendingLimit = limit;
                const limitInput = document.getElementById('spending-limit');
                if (limitInput) {
                    limitInput.value = limit;
                }
            }
        }
    } catch (error) {
        console.error('Error loading spending limit:', error);
    }
}

// Dark Mode Functions
function toggleDarkMode() {
    appState.darkMode = !appState.darkMode;
    applyDarkMode();
    saveDarkModePreference();
}

function applyDarkMode() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    
    if (appState.darkMode) {
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
    }
    
    // Update chart colors for dark mode
    if (appState.chart) {
        updateChartTheme();
    }
}

function saveDarkModePreference() {
    if (appState.storageAvailable) {
        localStorage.setItem('dark-mode', appState.darkMode.toString());
    }
}

function loadDarkModePreference() {
    try {
        const savedMode = localStorage.getItem('dark-mode');
        if (savedMode === 'true') {
            appState.darkMode = true;
            applyDarkMode();
        }
    } catch (error) {
        console.error('Error loading dark mode preference:', error);
    }
}

function updateChartTheme() {
    if (!appState.chart) return;
    
    const textColor = appState.darkMode ? '#ecf0f1' : '#2c3e50';
    
    appState.chart.options.plugins.legend.labels.color = textColor;
    appState.chart.update();
}
