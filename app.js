// Personal Finance Tracker - Main Application

class FinanceTracker {
  constructor() {
    this.transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    this.budgets = JSON.parse(localStorage.getItem("budgets")) || [];
    this.goals = JSON.parse(localStorage.getItem("goals")) || [];

    this.init();
  }

  init() {
    // Load mock data if no data exists
    if (this.transactions.length === 0) {
      this.loadMockData();
    }

    this.setupEventListeners();
    this.updateDashboard();
    this.renderTransactions();
    this.renderBudgets();
    this.renderGoals();
    this.renderCharts();
  }

  loadMockData() {
    const mockTransactions = [
      {
        id: 1,
        type: "expense",
        amount: 50.0,
        category: "food",
        description: "Grocery shopping",
        date: "2024-11-01",
      },
      {
        id: 2,
        type: "expense",
        amount: 30.0,
        category: "transportation",
        description: "Gas",
        date: "2024-11-02",
      },
      {
        id: 3,
        type: "income",
        amount: 3000.0,
        category: "salary",
        description: "Monthly salary",
        date: "2024-11-01",
      },
      {
        id: 4,
        type: "expense",
        amount: 80.0,
        category: "utilities",
        description: "Electricity bill",
        date: "2024-11-03",
      },
      {
        id: 5,
        type: "expense",
        amount: 25.0,
        category: "entertainment",
        description: "Movie tickets",
        date: "2024-11-04",
      },
      {
        id: 6,
        type: "expense",
        amount: 120.0,
        category: "food",
        description: "Restaurant dinner",
        date: "2024-11-05",
      },
      {
        id: 7,
        type: "expense",
        amount: 45.0,
        category: "transportation",
        description: "Uber ride",
        date: "2024-11-06",
      },
      {
        id: 8,
        type: "income",
        amount: 500.0,
        category: "other",
        description: "Freelance work",
        date: "2024-11-07",
      },
      {
        id: 9,
        type: "expense",
        amount: 200.0,
        category: "healthcare",
        description: "Doctor visit",
        date: "2024-11-08",
      },
      {
        id: 10,
        type: "expense",
        amount: 75.0,
        category: "entertainment",
        description: "Concert tickets",
        date: "2024-11-09",
      },
    ];

    const mockBudgets = [
      { id: 1, category: "food", amount: 400.0 },
      { id: 2, category: "transportation", amount: 200.0 },
      { id: 3, category: "entertainment", amount: 150.0 },
      { id: 4, category: "utilities", amount: 300.0 },
    ];

    const mockGoals = [
      {
        id: 1,
        name: "Emergency Fund",
        target: 10000.0,
        current: 2500.0,
        targetDate: "2024-12-31",
      },
      {
        id: 2,
        name: "Vacation",
        target: 3000.0,
        current: 800.0,
        targetDate: "2024-08-15",
      },
      {
        id: 3,
        name: "New Car",
        target: 25000.0,
        current: 5000.0,
        targetDate: "2025-06-30",
      },
    ];

    this.transactions = mockTransactions;
    this.budgets = mockBudgets;
    this.goals = mockGoals;

    this.saveData();
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabName = e.target.textContent.toLowerCase();
        this.switchTab(tabName);
      });
    });

    // Form submissions
    document
      .getElementById("transactionForm")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addTransaction();
      });

    document.getElementById("budgetForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addBudget();
    });

    document.getElementById("goalForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addGoal();
    });

    // Filters
    document
      .getElementById("transactionFilter")
      .addEventListener("change", () => {
        this.renderTransactions();
      });

    document.getElementById("categoryFilter").addEventListener("change", () => {
      this.renderTransactions();
    });

    // Set today's date as default
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("transactionDate").value = today;
  }

  switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll(".tab-content").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to selected tab and button
    const tabMap = {
      dashboard: "dashboard",
      transactions: "transactions",
      budget: "budgets",
      goals: "goals",
    };

    const targetTab = tabMap[tabName] || tabName;
    document.getElementById(targetTab).classList.add("active");

    // Find and activate the corresponding button
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn.textContent.toLowerCase() === tabName) {
        btn.classList.add("active");
      }
    });

    // Update charts when switching to dashboard
    if (targetTab === "dashboard") {
      setTimeout(() => this.renderCharts(), 100);
    }
  }

  addTransaction() {
    const transaction = {
      id: Date.now(),
      type: document.getElementById("transactionType").value,
      amount: parseFloat(document.getElementById("transactionAmount").value),
      category: document.getElementById("transactionCategory").value,
      description: document.getElementById("transactionDescription").value,
      date: document.getElementById("transactionDate").value,
    };

    this.transactions.push(transaction);
    this.saveData();
    this.updateDashboard();
    this.renderTransactions();
    this.renderCharts();
    this.closeModal("transactionModal");
    document.getElementById("transactionForm").reset();
  }

  addBudget() {
    const budget = {
      id: Date.now(),
      category: document.getElementById("budgetCategory").value,
      amount: parseFloat(document.getElementById("budgetAmount").value),
    };

    // Check if budget for this category already exists
    const existingIndex = this.budgets.findIndex(
      (b) => b.category === budget.category
    );
    if (existingIndex !== -1) {
      this.budgets[existingIndex] = budget;
    } else {
      this.budgets.push(budget);
    }

    this.saveData();
    this.renderBudgets();
    this.closeModal("budgetModal");
    document.getElementById("budgetForm").reset();
  }

  addGoal() {
    const goal = {
      id: Date.now(),
      name: document.getElementById("goalName").value,
      target: parseFloat(document.getElementById("goalTarget").value),
      current: parseFloat(document.getElementById("goalCurrent").value),
      targetDate: document.getElementById("goalDate").value,
    };

    this.goals.push(goal);
    this.saveData();
    this.renderGoals();
    this.closeModal("goalModal");
    document.getElementById("goalForm").reset();
  }

  updateDashboard() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTransactions = this.transactions.filter((t) =>
      t.date.startsWith(currentMonth)
    );

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = this.transactions.reduce(
      (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
      0
    );

    document.getElementById(
      "totalBalance"
    ).textContent = `$${totalBalance.toFixed(2)}`;
    document.getElementById(
      "monthlyIncome"
    ).textContent = `$${monthlyIncome.toFixed(2)}`;
    document.getElementById(
      "monthlyExpenses"
    ).textContent = `$${monthlyExpenses.toFixed(2)}`;

    this.renderRecentTransactions();
    this.renderBudgetOverview();
  }

  renderRecentTransactions() {
    const recentTransactions = this.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    const html = recentTransactions
      .map(
        (transaction) => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-details">
                    <strong>${transaction.description}</strong><br>
                    <small>${transaction.date}</small>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${
                      transaction.type === "income" ? "+" : "-"
                    }$${transaction.amount.toFixed(2)}
                </div>
                <span class="transaction-category">${
                  transaction.category
                }</span>
            </div>
        `
      )
      .join("");

    document.getElementById("recentTransactionsList").innerHTML = html;
  }

  renderBudgetOverview() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = this.transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(currentMonth)
    );

    const html = this.budgets
      .map((budget) => {
        const spent = monthlyExpenses
          .filter((t) => t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;

        return `
                <div class="budget-item">
                    <div><strong>${budget.category}</strong></div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${
                              isOverBudget ? "over-budget" : ""
                            }" 
                                 style="width: ${Math.min(
                                   percentage,
                                   100
                                 )}%"></div>
                        </div>
                        <small>$${spent.toFixed(2)} / $${budget.amount.toFixed(
          2
        )}</small>
                    </div>
                </div>
            `;
      })
      .join("");

    document.getElementById("budgetOverview").innerHTML = html;
  }

  renderTransactions() {
    const typeFilter = document.getElementById("transactionFilter").value;
    const categoryFilter = document.getElementById("categoryFilter").value;

    let filteredTransactions = this.transactions;

    if (typeFilter !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === typeFilter
      );
    }

    if (categoryFilter !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.category === categoryFilter
      );
    }

    const html = filteredTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(
        (transaction) => `
                <div class="transaction-item ${transaction.type}">
                    <div class="transaction-details">
                        <strong>${transaction.description}</strong><br>
                        <small>${transaction.date}</small>
                    </div>
                    <div class="transaction-amount ${transaction.type}">
                        ${
                          transaction.type === "income" ? "+" : "-"
                        }$${transaction.amount.toFixed(2)}
                    </div>
                    <span class="transaction-category">${
                      transaction.category
                    }</span>
                    <button class="btn btn-danger" onclick="app.deleteTransaction(${
                      transaction.id
                    })">Delete</button>
                </div>
            `
      )
      .join("");

    document.getElementById("transactionsList").innerHTML = html;
  }

  renderBudgets() {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyExpenses = this.transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(currentMonth)
    );

    const html = this.budgets
      .map((budget) => {
        const spent = monthlyExpenses
          .filter((t) => t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);

        const percentage = (spent / budget.amount) * 100;
        const isOverBudget = percentage > 100;

        return `
                <div class="budget-item">
                    <div><strong>${budget.category}</strong></div>
                    <div class="budget-progress">
                        <div class="progress-bar">
                            <div class="progress-fill ${
                              isOverBudget ? "over-budget" : ""
                            }" 
                                 style="width: ${Math.min(
                                   percentage,
                                   100
                                 )}%"></div>
                        </div>
                        <small>$${spent.toFixed(2)} / $${budget.amount.toFixed(
          2
        )} (${percentage.toFixed(1)}%)</small>
                    </div>
                    <button class="btn btn-danger" onclick="app.deleteBudget(${
                      budget.id
                    })">Delete</button>
                </div>
            `;
      })
      .join("");

    document.getElementById("budgetList").innerHTML = html;
  }

  renderGoals() {
    const html = this.goals
      .map((goal) => {
        const percentage = (goal.current / goal.target) * 100;
        const isCompleted = percentage >= 100;

        return `
                <div class="goal-item">
                    <div><strong>${goal.name}</strong><br><small>Target: ${
          goal.targetDate
        }</small></div>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${Math.min(
                              percentage,
                              100
                            )}%"></div>
                        </div>
                        <small>$${goal.current.toFixed(
                          2
                        )} / $${goal.target.toFixed(2)} (${percentage.toFixed(
          1
        )}%)</small>
                    </div>
                    <div>
                        <button class="btn btn-primary" onclick="app.updateGoal(${
                          goal.id
                        })">Update</button>
                        <button class="btn btn-danger" onclick="app.deleteGoal(${
                          goal.id
                        })">Delete</button>
                    </div>
                </div>
            `;
      })
      .join("");

    document.getElementById("goalsList").innerHTML = html;
  }

  renderCharts() {
    this.renderExpenseChart();
    this.renderTrendChart();
  }

  renderExpenseChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");

    // Destroy existing chart if it exists
    if (this.expenseChart) {
      this.expenseChart.destroy();
    }

    const expenses = this.transactions.filter((t) => t.type === "expense");
    const categoryTotals = {};

    expenses.forEach((expense) => {
      categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) + expense.amount;
    });

    this.expenseChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: Object.keys(categoryTotals),
        datasets: [
          {
            data: Object.values(categoryTotals),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#FF6384",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }

  renderTrendChart() {
    const ctx = document.getElementById("trendChart").getContext("2d");

    // Destroy existing chart if it exists
    if (this.trendChart) {
      this.trendChart.destroy();
    }

    // Group transactions by month
    const monthlyData = {};
    this.transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 };
      }
      if (transaction.type === "income") {
        monthlyData[month].income += transaction.amount;
      } else {
        monthlyData[month].expenses += transaction.amount;
      }
    });

    const months = Object.keys(monthlyData).sort();
    const incomeData = months.map((month) => monthlyData[month].income);
    const expenseData = months.map((month) => monthlyData[month].expenses);

    this.trendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            borderColor: "#27ae60",
            backgroundColor: "rgba(39, 174, 96, 0.1)",
            tension: 0.4,
          },
          {
            label: "Expenses",
            data: expenseData,
            borderColor: "#e74c3c",
            backgroundColor: "rgba(231, 76, 60, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  deleteTransaction(id) {
    this.transactions = this.transactions.filter((t) => t.id !== id);
    this.saveData();
    this.updateDashboard();
    this.renderTransactions();
    this.renderCharts();
  }

  deleteBudget(id) {
    this.budgets = this.budgets.filter((b) => b.id !== id);
    this.saveData();
    this.renderBudgets();
  }

  deleteGoal(id) {
    this.goals = this.goals.filter((g) => g.id !== id);
    this.saveData();
    this.renderGoals();
  }

  updateGoal(id) {
    const goal = this.goals.find((g) => g.id === id);
    if (goal) {
      const newAmount = prompt(
        `Update amount for ${goal.name} (current: $${goal.current.toFixed(
          2
        )}):`,
        goal.current
      );
      if (newAmount !== null) {
        goal.current = parseFloat(newAmount) || goal.current;
        this.saveData();
        this.renderGoals();
      }
    }
  }

  saveData() {
    localStorage.setItem("transactions", JSON.stringify(this.transactions));
    localStorage.setItem("budgets", JSON.stringify(this.budgets));
    localStorage.setItem("goals", JSON.stringify(this.goals));
  }

  showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
}

// Global functions for HTML onclick handlers
function switchTab(tabName) {
  app.switchTab(tabName);
}

function showAddTransactionModal() {
  app.showModal("transactionModal");
}

function showAddBudgetModal() {
  app.showModal("budgetModal");
}

function showAddGoalModal() {
  app.showModal("goalModal");
}

function closeModal(modalId) {
  app.closeModal(modalId);
}

// Initialize the app
const app = new FinanceTracker();

// Close modals when clicking outside
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
};
