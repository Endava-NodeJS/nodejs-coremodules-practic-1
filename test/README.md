# NodeJS workshop final homework.

## Create production-like bank API

**Description:**
Imagine that we have to create a real bank REST API, taking in consideration that it should give us the ability to:

- Create a user.
- Authorize a user.
- Fill in the data in user's profile. (Firstname, login, email, lastname, date of birth, avatar).
- Make money transfer.
- Check the status of a specific transaction.
- Retrieving the list of the current user's transaction (id, account number, description, amount, currency, creation
  date, status).
- Retrieving the full transaction info. (id, account number, description, amount, currency, creation date, update date,
  status, details, bank name, recipient account number (format example \***\* \*\*** \*\*\*\* 4568)).
- Cancel the transaction (if it's not finished/completed).
- Download the csv (archived/gz) file with a list of all the transactions related to the current user.
- Get the home page with the app commercial video (you can choose any video you want. Try to make it more simple,
  considering the fact that the most important thing here is the stream implementation).
- Errors should be logged and returned consistently to the FE.

You're able to choose any NodeJS framework, any libraries... anything that you think is appropriate to be used for this
implementation. Do your best and GOOD LUCK!)

### **Acceptance criteria:**

### As a customer

1. I should be able to create an account, and uploading the avatar image (separate endpoint for file upload). I'm expecting the
   default account number (unique) to be created and attached to my current profile, so I can use it for payments,
   transfers, etc. By default, there should be $100.50.
2. I should be able to sign in, providing { login, password }
3. I should be able to see the history of all the transactions that I made (The Latest goes first). Also, I should be able
   to download the gz archive with my transactions history table in CSV format.
4. I should be able to transfer an amount of money to another user, knowing his account number.
5. I should be able to check the status of the transaction.
6. In case if I made a transaction by mistake, I should be able to cancel it having its id.
7. If I want to share the application, I should be able to give the link to the application's home page, where my friend
   could watch the commercial video.
8. In case if some errors appear, I should be able to get some details about them from the API response.

### Technical acceptance

From the technical perspective we'll be waiting for you to create the real-like API. There should be taken into consideration the
best practices and REST constraints. You have to simulate the real transactions processing with all the delays.

#### Transaction's statuses:

- CREATED - when transaction was just created
- IN_REVIEW - when transaction is made and its credentials are in the state of validation process
- DECLINED - when transaction is made but its credentials are wrong or requested amount is exceeding the limit
- CANCELED - when transaction is made, but it was canceled by user
- COMPLETE - when transaction is made and amount of money successfully transferred
  {"mode":"full","isActive":false}
