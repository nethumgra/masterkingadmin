// common.js - Universal Config for Mudalali Mama Admin
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDKFinkyjgys2HOO_QpRoMosGYyTFEcIgE",
    authDomain: "masterking-fa629.firebaseapp.com",
    projectId: "masterking-fa629",
    storageBucket: "masterking-fa629.firebasestorage.app",
    messagingSenderId: "680021576286",
    appId: "1:680021576286:web:52769441eeda5ab56f02cf",
    measurementId: "G-9443L8L88Q"
};

// ImgBB API Key (for image uploads)
const IMGBB_API_KEY = 'f068295c19803c448665a0ea48bcc2fc';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. Authentication Check ---
/**
 * Checks if the user is authenticated and has admin privileges.
 * Redirects to login page if not authenticated, or dashboard if already logged in on index.
 * @param {boolean} requireAuth - Whether to redirect to login if not authenticated.
 */
function checkAdminAuth(requireAuth = true) {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop();
        const isLoginPage = pageName === "" || pageName === "index.html" || pageName === "admin-login.html";

        if (user) {
            // Check for admin privileges
            if (user.email === "admin@gmail.com") {
                if (isLoginPage) window.location.href = "dashboard.html";
                return;
            }

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && (userDoc.data().isAdmin === true || userDoc.data().role === 'admin')) {
                    if (isLoginPage) window.location.href = "dashboard.html";
                } else {
                    handleAccessDenied();
                }
            } catch (error) {
                console.error("Auth Error:", error);
                handleAccessDenied();
            }
        } else {
            // User is NOT logged in
            if (requireAuth && !isLoginPage) {
                window.location.href = "index.html";
            }
        }
    });
}

async function handleAccessDenied() {
    if (typeof Swal !== 'undefined') {
        await Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have admin privileges.',
            confirmButtonColor: '#db2777'
        });
    } else {
        alert("Access Denied: You are not an Admin.");
    }
    await signOut(auth);
    window.location.href = "index.html";
}

// --- 2. Sidebar Rendering ---
/**
 * Renders the sidebar navigation based on the active page.
 * @param {string} activePage - The ID of the current page to highlight in the sidebar.
 */
function renderSidebar(activePage) {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    // Define Links
    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: 'fa-th-large', link: 'dashboard.html' },
        { id: 'orders', name: 'Orders', icon: 'fa-shopping-cart', link: 'orders.html' }, // Added Orders
        { id: 'products', name: 'Products', icon: 'fa-box-open', link: 'products.html' },
        { id: 'reseller_orders', name: 'Reseller Orders', icon: 'fa-boxes-packing', link: 'reseller_orders.html' },
        { id: 'financials', name: 'Financials', icon: 'fa-file-invoice-dollar', link: 'financials.html' },
        
        // Management Section Header (Simulated in loop logic or separate structure)
        { header: 'Management' }, 
        
       
       { id: 'resellers', name: 'Manage Resellers', icon: 'fa-users', link: 'manage_resellers.html' },
    { id: 'loyalty', name: 'Loyalty', icon: 'fa-coins', link: 'loyalty.html' },
    { id: 'marketing', name: 'Marketing', icon: 'fa-bullhorn', link: 'marketing.html' },
    { id: 'affiliates', name: 'Affiliates', icon: 'fa-handshake', link: 'affiliates.html' }, // Icon Fixed ✅
    { id: 'settings', name: 'Settings', icon: 'fa-cog', link: 'settings.html' }
    ];

    let navHtml = '';
    
    // Custom logic to handle headers inside the loop or pre-structure
    // For simplicity, hardcoding the structure similar to your previous request but dynamic where possible
    
    // Main Section
    navHtml += `<p class="px-4 mt-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</p>`;
    
    const mainItems = ['dashboard', 'orders', 'reseller_orders', 'products', 'financials'];
    mainItems.forEach(id => {
        const item = menuItems.find(i => i.id === id);
        if(item) navHtml += createNavItem(item, activePage);
    });

    // Management Section
    navHtml += `<p class="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Management</p>`;
    
    const mgmtItems = ['sellers', 'resellers', 'loyalty', 'marketing', 'affiliates', 'settings'];
    mgmtItems.forEach(id => {
        const item = menuItems.find(i => i.id === id);
        if(item) navHtml += createNavItem(item, activePage);
    });

    container.innerHTML = `
        <aside class="w-64 fixed top-0 left-0 h-full bg-white shadow-xl z-30 hidden md:flex flex-col border-r border-gray-200 font-sans">
            <div class="p-6 border-b flex items-center gap-3">
                <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">T</div>
                <div>
                    <h2 class="font-bold text-gray-800 text-lg">TUTU Admin</h2>
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider">Control Panel</p>
                </div>
            </div>
            
            <nav class="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
                ${navHtml}
            </nav>

            <div class="p-4 border-t bg-gray-50">
                <button id="admin-logout-btn" class="w-full flex items-center justify-center gap-2 text-red-600 bg-white border border-red-200 p-2.5 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all shadow-sm font-semibold text-sm">
                    <i class="fa fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>
        
        <div class="md:hidden fixed top-0 w-full bg-white shadow-md p-4 flex justify-between items-center z-40">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">T</div>
                <span class="font-bold text-gray-800 text-lg">TUTU Admin</span>
            </div>
            <button id="mobile-menu-toggle" class="text-gray-600 text-2xl focus:outline-none p-2 rounded hover:bg-gray-100">
                <i class="fa fa-bars"></i>
            </button>
        </div>
    `;

    // Attach Event Listeners
    setTimeout(() => {
        document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = "index.html";
            } catch (e) {
                console.error("Logout Error", e);
            }
        });

        document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
            const sidebar = document.querySelector('aside');
            if (sidebar) {
                sidebar.classList.toggle('hidden');
                sidebar.classList.toggle('flex');
                sidebar.classList.toggle('w-full');
                sidebar.classList.toggle('z-50');
            }
        });
    }, 500);
}

function createNavItem(item, activePage) {
    const isActive = activePage === item.id;
    // Default pink theme for active state, can be customized per page if needed but keeping consistent is better for UI
    const activeClass = isActive ? 'bg-pink-50 text-pink-600 font-bold' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-600';
    
    return `
        <a href="${item.link}" class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${activeClass}">
            <i class="fa ${item.icon} w-6 text-lg transition-transform group-hover:scale-110"></i>
            <span class="ml-2">${item.name}</span>
        </a>
    `;
}

// --- 3. Helper Functions ---

/**
 * Formats a number as Sri Lankan Rupee currency.
 * @param {number} amount 
 * @returns {string} Formatted string (e.g., "Rs. 1,250.00")
 */
function formatLKR(amount) {
    return 'Rs. ' + (amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Displays a toast notification using SweetAlert2.
 * @param {string} title 
 * @param {string} icon - 'success', 'error', 'warning', 'info'
 */
function showToast(title, icon = 'success') {
    if(typeof Swal === 'undefined') { console.warn('SweetAlert2 not loaded'); return; }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    });

    Toast.fire({
        icon: icon,
        title: title
    });
}

/**
 * Uploads an image file to ImgBB.
 * @param {File} file 
 * @returns {Promise<string>} The URL of the uploaded image.
 */
async function uploadImage(file) {
    if (!file) throw new Error("No file selected");
    const formData = new FormData();
    formData.append('image', file);
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST', body: formData
        });
        const data = await res.json();
        if (data.success) return data.data.url;
        else throw new Error("Upload failed via ImgBB");
    } catch (error) {
        console.error("Image Upload Error:", error);
        throw error;
    }
}

// Export functions to be used in HTML files
export { auth, db, checkAdminAuth, renderSidebar, formatLKR, showToast, uploadImage };