# WINE LABEL MAKER - FRONT END  

## DESCRIPTION  
Wine Label Maker is a full-stack web application designed for winemakers seeking custom label designs for their products.    
Users can submit detailed requests describing their wine’s identity and visual preferences.  
These requests are then handled by our illustrator and managed through a dedicated admin area  

## FEATURES  

### USERS  
-**Register:** users can create a new account  
-**Login:** users can log in to their account  
-**Logout:** secure logout from the account  
-**"My Requests" page:** displays all submitted requests with updated status; if a request is "Pending," the user can edit or delete it  
-**Create Request:** users can submit a new request by providing details about the wine's identity and visual preferences  
-**Confirmation and Alert Messages:** visual feedback is provided when a request is submitted, edited, or deleted  
-**Responsive Interface:** the website works smoothly on both desktop and mobile devices  

### ADMIN  
-**View All Requests:** the administrator can see all requests submitted by various users, grouped by user  
-**New Request Indicator:** a new request is marked with a green envelope  
-**User Requests Page:** by clicking on a specific user's envelope, the administrator can view all their requests  
-**Change Request Status:** the administrator can update the status of each request  
-**Email Notifications:** whenever a request's status changes, a predefined notification email is sent to the user, except for QuotSent and Confirmation emails.   
For confirmed requests, the email includes the image of the final label  
-**Responsive Interface:** the administrator pages work smoothly on both desktop and mobile devices  

## TECNOLOGIES USED  
-**React** (with Vite) – frontend framework  
-**React Bootstrap** – UI components and responsive layout  
-**React Router DOM** – routing  
-**React Icons** – icons library  
-**JavaScript (ES6+)** – programming language  
-**CSS / Bootstrap** – styling and layout  
-**JWT (JSON Web Tokens)** – secure authentication and session management  

## GETTING STARTED - VISUAL STUDIO CODE  
1 - **Clone the repository**  
Oper your terminal/ Git Bash and run:  
cd DESKTOP (before cloning if you want to put it on your desktop)  
git clone https://github.com/MREBECCA98/WineLabelMakerFE.git  
2 - **Navigate to the project folder**  
cd WineLabelMakerFE  
3 - **Install dependencies**  
npm install  
4 - **Start the development server**  
npm run dev  
5 - **Open the application**  
Local:   http://localhost:5173/  

git clone https://github.com/MREBECCA98/WineLabelMakerFE.git  
cd WineLabelMakerFE  
npm install  
npm run dev  

**Important:** To run the frontend properly, you also need to clone and run the backend:  
[Wine Label Maker Back End](https://github.com/MREBECCA98/WineLabelMakerBE)


