const inputAmount = document.querySelector('#amount');
const inputDescription = document.querySelector('#discription');
const inputCategory = document.querySelector('#category');
const myForm = document.querySelector('#my-form');
const expenseList = document.getElementById('expense-list');
const buyPremiumBtn = document.querySelector('#rzp-btn');
const displayCountSelect = document.getElementById('displayCount');


myForm.addEventListener('submit', onSubmit);
buyPremiumBtn.addEventListener('click', buyPremium);

window.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    try {
        const token = localStorage.getItem('token');

        // Fetch expenses
        const expensesResponse = await axios.get("http://localhost:4000/get-expenses", { headers: { "Authorization": token } });

        // Extract data from the expenses response
        const expenses = expensesResponse.data.expenses;
        const totalPages = expensesResponse.data.totalPages;
        const currentPage = expensesResponse.data.currentPage;

        // Update UI if the user is a premium user
        const premiumUserResponse = await axios.get("http://localhost:4000/premiumUser/isPremiumUser", { headers: { "Authorization": token } });
        const isPremiumUser = premiumUserResponse.data.isPremium;

        if (isPremiumUser) {
            updateUIForPremiumUser();
            downloadBtn();
        }

        // Display pagination controls
        displayPaginationControls(currentPage, totalPages);

        // Initialize display count
        initializeDisplayCount();

        // Show expenses
        showExpenses(expenses);

    } catch (error) {
        console.error(error);
    }
}


function displayPaginationControls(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination-container');

    paginationContainer.innerHTML = '';

    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => fetchAndDisplayPage(currentPage - 1));

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => fetchAndDisplayPage(currentPage + 1));

        const pageInfo = document.createElement('span');
        pageInfo.textContent = ` Page ${currentPage} of ${totalPages} `;

        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageInfo);
        paginationContainer.appendChild(nextButton);
    }
}

function initializeDisplayCount() {
    let displayCount = parseInt(localStorage.getItem('displayCount')) || 10; // Default to 10 if not set in local storage

    displayCountSelect.value = displayCount;
    displayCountSelect.addEventListener('change', updateDisplayCount);
}


function updateDisplayCount() {
    let displayCount = parseInt(displayCountSelect.value);
    localStorage.setItem('displayCount', displayCount);
    fetchAndDisplayPage(1);
};



async function fetchAndDisplayPage(page) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/get-expenses?page=${page}`, { headers: { "Authorization": token } });

        const expenses = response.data.expenses;
        const totalPages = response.data.totalPages;
        const currentPage = response.data.currentPage;

        const userDisplayCount = parseInt(localStorage.getItem('displayCount')) || 10;

        showExpenses(expenses.slice(0, userDisplayCount));

        displayPaginationControls(currentPage, totalPages)

        if (currentPage > totalPages) {
            fetchAndDisplayPage(totalPages);
        }

    } catch (error) {
        console.error('Error fetching and displaying page:', error);
    }
}



async function onSubmit(e) {
    e.preventDefault();

    const amount = inputAmount.value;
    const description = inputDescription.value;
    const category = inputCategory.value;

    if (!amount || !description || category === 'Open this select menu') {
        alert('Please Enter All Input Fields!');
    } else {
        const expense = { amount, description, category };
        try {
            const token = localStorage.getItem('token');


            const createExpenseResponse = await axios.post("http://localhost:4000/create-expense", expense, { headers: { "Authorization": token } });

            const expensesResponse = await axios.get("http://localhost:4000/get-expenses", { headers: { "Authorization": token } });
            const expenses = expensesResponse.data.expenses;
            showExpenses(expenses);

            const isPremiumUserResponse = await axios.get("http://localhost:4000/premiumUser/isPremiumUser", { headers: { "Authorization": token } });

            const createdExpense = createExpenseResponse.data;
            const isPremiumUser = isPremiumUserResponse.data.isPremium;

            if (isPremiumUser) {
                updateUIForPremiumUser();
            }

            clearInputs();
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    }
}
function deleteButton(expense, expenseItem) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('btn', 'btn-dark', 'expenseItem-btn');
    deleteBtn.style.marginInline = '70px';
    deleteBtn.addEventListener('click', () => deleteExpense(expense, expenseItem));
    expenseItem.appendChild(deleteBtn);
}

async function deleteExpense(expense, expenseItem) {
    console.log('exp_ID:>>', expense._id);
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:4000/delete-expense/${expense._id}`, { headers: { "Authorization": token } });
        expenseItem.remove();
        console.log('Expense Deleted:', response.data);
    } catch (error) {
        console.log(error);
    }
}

function editButton(expense, expenseItem) {
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('btn', 'btn-dark', 'expenseItem-btn');
    editBtn.addEventListener('click', () => editExpense(expense));
    expenseItem.appendChild(editBtn);
}

async function editExpense(expense) {
    try {
        const token = localStorage.getItem('token');

        const editExpense = response.data;
        console.log(editExpense);
        onUpdate(editExpense);
    } catch (error) {
        console.error('Error getting expense for edit:', error);
    }
}

function showExpenses(expenses) {
    console.log('expzz:>>', expenses);
    expenseList.innerHTML = '';
    expenses.forEach(expense => {

        const expenseItem = document.createElement('li');
        expenseItem.innerHTML = `Rs.${expense.amount}/- | ${expense.description} | ${expense.category} `;
        deleteButton(expense, expenseItem);
        editButton(expense, expenseItem);
        expenseList.appendChild(expenseItem);
    });
    clearInputs();
}

async function onUpdate(editExpense) {

    inputAmount.value = editExpense.amount;
    inputDescription.value = editExpense.description;
    inputCategory.value = editExpense.category;

    const expense = { id, amount, description, category };
    try {
        const response = await axios.put(`http://localhost:4000/edit-expense/${expense._id}`, { headers: { "Authorization": token } });
        const responseData = response.data;
        console.log("newExpense:", responseData);

        setTimeout(async () => {
            const response = await axios.get("http://localhost:4000/get-expenses");
            console.log('Received Expenses:', response);
            showExpenses(response.data);
        }, 0);

        clearInputs();
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}


async function buyPremium(e) {
    const token = localStorage.getItem('token');
    try {
        // Fetching premium membership purchase details from the backend
        const response = await axios.get('http://localhost:4000/purchase/premiumMembership', { headers: { "Authorization": token } });
        console.log(response);

        const options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function (response) {
                // Update transaction status upon successful payment
                await axios.post('http://localhost:4000/purchase/updateTransactionStatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id,
                }, { headers: { "Authorization": token } });

                alert('You Are Premium user now.');
                window.location.href = './';
            }
        };

        // Initialize Razorpay and open payment window
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        // To Handle payment failure
        rzp1.on('payment.failed', async (response) => {
            console.log(response);
            alert('Something went wrong');
            try {
                // Update transaction status upon payment failure
                await axios.post('http://localhost:4000/purchase/updateTransactionStatus', {
                    order_id: options.order_id,
                    error_description: response.error.description
                }, { headers: { "Authorization": token } });
            } catch (error) {
                console.error('Transaction Failed:', error);
            }
        });
    } catch (error) {
        console.log('Error buying premium:', error);
    }
}

// Update UI to reflect premium user status
function updateUIForPremiumUser() {
    buyPremiumBtn.style.visibility = 'hidden';
    const premiumUserText = document.querySelector('.premium-user-text');
    if (!premiumUserText) {
        const premiumUserText = document.createElement('p');
        premiumUserText.textContent = 'You are a Premium User!';
        premiumUserText.classList.add('premium-user-text');
        document.body.appendChild(premiumUserText);
    }
    showLeaderBoard(); 
}


function showLeaderBoard() {
    const leaderboardContainer = document.getElementById('user-leaderboard');
    const leaderBoardBtn = document.querySelector('.leaderboard-btn');
    if (leaderboardContainer && !leaderBoardBtn) {
        const leaderBoardBtn = document.createElement('button');
        leaderBoardBtn.classList.add('btn', 'btn-dark', 'leaderboard-btn');
        leaderBoardBtn.textContent = 'Show LeaderBoard';
        document.body.appendChild(leaderBoardBtn);

        leaderBoardBtn.addEventListener('click', async () => {
            const token = localStorage.getItem('token');
            try {
                const userLeaderBoardArray = await axios.get('http://localhost:4000/premiumUser/getUserleaderBoard', { headers: { "Authorization": token } });
                console.log(userLeaderBoardArray);
                userLeaderBoardArray.data.forEach((ele) => {
                    if (ele.totalExpenses === null) {
                        ele.totalExpenses = 0;
                    }
                });

                const leaderBoardElem = document.createElement('ul');
                leaderBoardElem.innerHTML = '<h4>Leader Board:</h4>';

                userLeaderBoardArray.data.forEach((userDetails) => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Name: ${userDetails.username} | Total Expense: Rs.${userDetails.totalExpenses}/-`;
                    leaderBoardElem.appendChild(listItem);
                });

                leaderboardContainer.appendChild(leaderBoardElem);
            } catch (error) {
                console.log('Failed Loading LeaderBoard data.', error);
            }
        });
    }
}

function downloadBtn() {
    const downloadExpenseBtn = document.querySelector('.download-expense-btn');
    if (!downloadExpenseBtn) {
        const downloadExpenseBtn = document.createElement('button');
        downloadExpenseBtn.classList.add('btn', 'btn-dark', 'download-expense-btn');
        downloadExpenseBtn.textContent = 'Download Expenses';
        document.body.appendChild(downloadExpenseBtn);
        downloadExpenseBtn.addEventListener('click', () => downloadExpenses());
    }
}

async function downloadExpenses() {
    const token = localStorage.getItem('token');
    try {
        const downloadExpenses = await axios.get('http://localhost:4000/user/download', { headers: { "Authorization": token } });
        console.log(downloadExpenses)
        if (downloadExpenses.status == 200) {
            let a = document.createElement('a');
            a.href = downloadExpenses.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        }

    }
    catch (error) {
        console.log('Failed Downloading expenses.', error);
    }
}

function clearInputs() {
    inputAmount.value = '';
    inputDescription.value = '';
    inputCategory.value = 'Open this select menu';
}


