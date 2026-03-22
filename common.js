// common.js - Universal Config for TUTU Admin
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

// --- Admin email list (bypass Firestore read for these) ---
// Add all admin emails here so we don't need Firestore read for auth check
const ADMIN_EMAILS = [
    "admin@gmail.com",
    "masterking.admin@gmail.com"
    // Add more admin emails here if needed
];

// --- 1. Authentication Check ---
function checkAdminAuth(requireAuth = true) {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop();
        const isLoginPage = pageName === "" || pageName === "index.html" || pageName === "admin-login.html";

        if (user) {
            // First check: is email in admin list? (no Firestore read needed)
            if (ADMIN_EMAILS.includes(user.email)) {
                if (isLoginPage) window.location.href = "dashboard.html";
                return;
            }

            // Second check: read Firestore user doc
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && (userDoc.data().isAdmin === true || userDoc.data().role === 'admin')) {
                    if (isLoginPage) window.location.href = "dashboard.html";
                } else {
                    handleAccessDenied();
                }
            } catch (error) {
                // If Firestore read fails due to permissions, 
                // don't immediately kick user — check if they're on a protected page
                console.warn("Firestore auth check failed:", error.code);
                if (error.code === 'permission-denied') {
                    // User is logged in but not admin — deny access
                    if (!isLoginPage) handleAccessDenied();
                }
                // For other errors (network etc.) allow graceful degradation
            }
        } else {
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
function renderSidebar(activePage) {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    const menuItems = [
        { id: 'dashboard',        name: 'Dashboard',       icon: 'fa-th-large',           link: 'dashboard.html' },
        { id: 'orders',           name: 'Orders',           icon: 'fa-shopping-cart',      link: 'orders.html' },
        { id: 'reseller_orders',  name: 'Reseller Orders',  icon: 'fa-boxes-packing',      link: 'reseller_orders.html' },
        { id: 'products',         name: 'Products',         icon: 'fa-box-open',           link: 'products.html' },
        { id: 'financials',       name: 'Financials',       icon: 'fa-file-invoice-dollar', link: 'financials.html' },
        // --- Management ---
        { id: 'sellers',          name: 'Manage Sellers',   icon: 'fa-store',              link: 'sellers.html' },
       
        { id: 'resellers',        name: 'Manage Resellers', icon: 'fa-users',              link: 'admin-resellers.html' },
        { id: 'categories',       name: 'Categories',       icon: 'fa-tags',               link: 'categories.html' },
        { id: 'carousels',        name: 'Banners',          icon: 'fa-images',             link: 'carousels.html' },
        { id: 'stories',          name: 'Stories',          icon: 'fa-circle-play',        link: 'stories.html' },
        
        { id: 'loyalty',          name: 'Loyalty',          icon: 'fa-coins',              link: 'loyalty.html' },
        { id: 'marketing',        name: 'Marketing',        icon: 'fa-bullhorn',           link: 'marketing.html' },
       
        { id: 'settings',         name: 'Settings',         icon: 'fa-cog',               link: 'settings.html' },
    ];

    const mainItems    = ['dashboard', 'orders', 'reseller_orders', 'products', 'financials'];
    const mgmtItems    = ['sellers', 'seller-dashboard', 'resellers', 'categories', 'carousels', 'stories', 'offers', 'loyalty', 'marketing', 'affiliates', 'settings'];

    let mainHtml = mainItems.map(id => {
        const item = menuItems.find(i => i.id === id);
        return item ? createNavItem(item, activePage) : '';
    }).join('');

    let mgmtHtml = mgmtItems.map(id => {
        const item = menuItems.find(i => i.id === id);
        return item ? createNavItem(item, activePage) : '';
    }).join('');

    container.innerHTML = `
        <aside class="w-64 fixed top-0 left-0 h-full bg-white shadow-xl z-30 hidden md:flex flex-col border-r border-gray-200 font-sans">
            <div class="p-5 border-b flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-tutu-pink to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">T</div>
                <div>
                    <h2 class="font-bold text-gray-800 text-lg leading-tight">TUTU Admin</h2>
                    <p class="text-[10px] text-gray-400 uppercase tracking-wider">Control Panel</p>
                </div>
            </div>

            <nav class="flex-grow p-3 overflow-y-auto" style="scrollbar-width:thin;scrollbar-color:#fbcfe8 transparent;">
                <p class="px-3 mt-2 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main</p>
                ${mainHtml}

                <p class="px-3 mt-5 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</p>
                ${mgmtHtml}
            </nav>

            <div class="p-3 border-t bg-gray-50/80">
                <button id="admin-logout-btn" class="w-full flex items-center justify-center gap-2 text-red-500 bg-white border border-red-100 p-2.5 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all font-semibold text-sm">
                    <i class="fa fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </aside>

        <!-- Mobile topbar -->
        <div class="md:hidden fixed top-0 w-full bg-white shadow-md px-4 py-3 flex justify-between items-center z-40 border-b border-gray-100">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-tutu-pink to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
                <span class="font-bold text-gray-800">TUTU Admin</span>
            </div>
            <button id="mobile-menu-toggle" class="text-gray-500 text-xl p-2 rounded-lg hover:bg-gray-100">
                <i class="fa fa-bars"></i>
            </button>
        </div>

        <!-- Mobile drawer overlay -->
        <div id="mobile-overlay" class="md:hidden fixed inset-0 bg-black/40 z-40 hidden" onclick="closeMobileMenu()"></div>

        <!-- Mobile sidebar drawer -->
        <div id="mobile-sidebar" class="md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 flex-col hidden overflow-y-auto">
            <div class="p-5 border-b flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-gradient-to-br from-tutu-pink to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">T</div>
                    <span class="font-bold text-gray-800">TUTU Admin</span>
                </div>
                <button onclick="closeMobileMenu()" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fa fa-times"></i></button>
            </div>
            <nav class="p-3 flex-grow">
                <p class="px-3 mt-2 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main</p>
                ${mainHtml}
                <p class="px-3 mt-5 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Management</p>
                ${mgmtHtml}
            </nav>
            <div class="p-3 border-t">
                <button id="mobile-logout-btn" class="w-full flex items-center justify-center gap-2 text-red-500 bg-white border border-red-100 p-2.5 rounded-xl hover:bg-red-50 font-semibold text-sm">
                    <i class="fa fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </div>
    `;

    // Event listeners
    setTimeout(() => {
        const logoutFn = async () => {
            try { await signOut(auth); window.location.href = "index.html"; }
            catch (e) { console.error("Logout Error", e); }
        };
        document.getElementById('admin-logout-btn')?.addEventListener('click', logoutFn);
        document.getElementById('mobile-logout-btn')?.addEventListener('click', logoutFn);

        document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
            document.getElementById('mobile-sidebar').classList.remove('hidden');
            document.getElementById('mobile-sidebar').classList.add('flex');
            document.getElementById('mobile-overlay').classList.remove('hidden');
        });
    }, 100);
}

window.closeMobileMenu = function() {
    document.getElementById('mobile-sidebar')?.classList.add('hidden');
    document.getElementById('mobile-sidebar')?.classList.remove('flex');
    document.getElementById('mobile-overlay')?.classList.add('hidden');
};

function createNavItem(item, activePage) {
    const isActive = activePage === item.id;
    const activeClass = isActive
        ? 'bg-pink-50 text-tutu-pink font-semibold border-l-4 border-tutu-pink pl-3'
        : 'text-gray-500 hover:bg-pink-50 hover:text-tutu-pink pl-4';
    return `
        <a href="${item.link}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 mb-0.5 ${activeClass}">
            <i class="fa ${item.icon} w-4 text-center text-sm flex-shrink-0"></i>
            <span class="text-sm">${item.name}</span>
        </a>
    `;
}

// --- 3. Helper Functions ---
function formatLKR(amount) {
    return 'Rs. ' + (amount || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(title, icon = 'success') {
    if (typeof Swal === 'undefined') { console.warn('SweetAlert2 not loaded'); return; }
    Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false,
        timer: 3000, timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    }).fire({ icon, title });
}

async function uploadImage(file) {
    if (!file) throw new Error("No file selected");
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) return data.data.url;
    throw new Error("ImgBB upload failed");
}

export { auth, db, checkAdminAuth, renderSidebar, formatLKR, showToast, uploadImage };