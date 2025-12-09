import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKFinkyjgys2HOO_QpRoMosGYyTFEcIgE",
  authDomain: "masterking-fa629.firebaseapp.com",
  projectId: "masterking-fa629",
  storageBucket: "masterking-fa629.firebasestorage.app",
  messagingSenderId: "680021576286",
  appId: "1:680021576286:web:52769441eeda5ab56f02cf",
  measurementId: "G-9443L8L88Q"
};

const IMGBB_API_KEY = 'f068295c19803c448665a0ea48bcc2fc';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export function checkAdminAuth(requireAuth = true) {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop(); // Get the last part of URL

        // Identify if we are on the login page
        const isLoginPage = pageName === "" || pageName === "index.html" || pageName === "admin-login.html";

        if (user) {
            // 1. Hardcoded Admin Check
            if (user.email === "admin@gmail.com") {
                if (isLoginPage) {
                    window.location.href = "dashboard.html";
                }
                return;
            }

            // 2. Database Admin Check
            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);

                // Check for 'isAdmin' (Legacy) OR 'role' === 'admin' (New)
                if (userDoc.exists() && (userDoc.data().isAdmin === true || userDoc.data().role === 'admin')) {
                    if (isLoginPage) {
                        window.location.href = "dashboard.html";
                    }
                } else {
                    // Not an admin
                    handleAccessDenied();
                }
            } catch (error) {
                console.error("Auth Error:", error);
                handleAccessDenied();
            }
        } else {
            // No user logged in
            if (requireAuth && !isLoginPage) {
                window.location.href = "index.html";
            }
        }
    });
}

async function handleAccessDenied() {
    if(typeof Swal !== 'undefined') {
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

// --- Sidebar & Helper Functions ---

export function renderSidebar(activePage) {
    const sidebarHTML = `
    <aside class="w-64 fixed top-0 left-0 h-full bg-white shadow-xl z-30 hidden md:flex flex-col border-r border-gray-200 font-sans">
        <div class="p-6 border-b flex items-center gap-3">
            <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                T
            </div>
            <div>
                <h2 class="font-bold text-gray-800 text-lg">TUTU Admin</h2>
                <p class="text-[10px] text-gray-400 uppercase tracking-wider">Control Panel</p>
            </div>
        </div>
        
        <nav class="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p class="px-4 mt-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</p>
            
            <a href="dashboard.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'dashboard' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-tachometer-alt w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Dashboard</span>
            </a>
            
            <a href="orders.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'orders' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-shopping-cart w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Orders</span>
            </a>

            <a href="products.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'products' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-box w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Products</span>
            </a>

            <a href="financials.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'financials' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-file-invoice-dollar w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Financials</span>
            </a>

            <p class="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Management</p>
            
            <a href="sellers.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'sellers' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-store w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Sellers</span>
            </a>

            <a href="loyalty.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'loyalty' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-coins w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Loyalty</span>
            </a>

            <a href="marketing.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-all duration-200 group ${activePage === 'marketing' ? 'bg-pink-50 text-pink-600 font-bold' : ''}">
                <i class="fa fa-bullhorn w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Marketing</span>
            </a>
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

    document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    setTimeout(() => {
        document.getElementById('admin-logout-btn')?.addEventListener('click', async () => {
            await signOut(auth);
            window.location.href = "index.html";
        });
    }, 500);
}

export function formatLKR(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2
    }).format(amount || 0);
}

export function showToast(title, icon = 'success') {
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

export async function uploadImage(file) {
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