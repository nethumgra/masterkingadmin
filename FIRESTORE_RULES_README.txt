================================================================
TUTU ADMIN - SETUP INSTRUCTIONS
================================================================

STEP 1: FIX FIREBASE PERMISSION ERROR
---------------------------------------
1. Go to: https://console.firebase.google.com
2. Select project: masterking-fa629
3. Click "Firestore Database" in left menu
4. Click "Rules" tab at the top
5. DELETE all existing rules
6. PASTE the entire content from "firestore.rules" file
7. Click "Publish"

This fixes the "permission-denied" error you were seeing.

STEP 2: ADD YOUR EMAIL AS ADMIN
---------------------------------
If your admin email is NOT "admin@gmail.com", open common.js
and add it to the ADMIN_EMAILS array:

    const ADMIN_EMAILS = [
        "admin@gmail.com",
        "your.email@gmail.com"   ← Add your email here
    ];

STEP 3: RUN THE PROJECT
-------------------------
Use VS Code Live Server or any local server.
Open: http://localhost:5500/admin%20panel/index.html

================================================================
WHAT WAS FIXED IN THIS VERSION:
================================================================
✅ Fixed permission-denied Firestore error (circular auth bug)
✅ Fixed sidebar - all new pages now visible
✅ Added: Categories page
✅ Added: Banners/Carousels page  
✅ Added: Stories page
✅ Added: Seller Overview dashboard
✅ Added: Proper Admin Login page
✅ All pages converted to Rose/Pink theme
✅ Improved mobile sidebar with overlay
================================================================
