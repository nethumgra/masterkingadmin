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
        if (user) {
            if (user.email === "admin@gmail.com") {
                 if (currentPath.endsWith('index.html') || currentPath.endsWith('/admin/')) {
                    window.location.href = "dashboard.html";
                }
                return;
            }

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists() && userDoc.data().isAdmin === true) {
                if (currentPath.endsWith('index.html') || currentPath.endsWith('/admin/')) {
                    window.location.href = "dashboard.html";
                }
            } else {
                if(typeof Swal !== 'undefined') {
                    await Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You do not have admin privileges.' });
                } else {
                    alert("Access Denied");
                }
                await signOut(auth);
                window.location.href = "index.html";
            }
        } else {
            if (requireAuth && !currentPath.endsWith('index.html')) {
                window.location.href = "index.html";
            }
        }
    });
}

export function renderSidebar(activePage) {
    const sidebarHTML = `
    <aside class="w-64 fixed top-0 left-0 h-full bg-white shadow-xl z-30 hidden md:flex flex-col border-r border-gray-200 font-sans">
        <div class="p-6 border-b flex items-center gap-3">
            <img src="https://i.ibb.co/1tCywvyP/logo.png" class="h-10" alt="Logo">
            <div>
                
            </div>
        </div>
        
        <nav class="flex-grow p-4 space-y-1 overflow-y-auto custom-scrollbar">
            
            <p class="px-4 mt-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Main</p>
            
            <a href="dashboard.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'dashboard' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-tachometer-alt w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Dashboard</span>
            </a>
            
            <a href="orders.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'orders' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-shopping-cart w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Orders</span>
            </a>

            <a href="products.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'products' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-box w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Products</span>
            </a>

            <p class="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Users</p>
            
            <a href="sellers.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'sellers' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-store w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Sellers</span>
            </a>
            
            <a href="affiliates.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'affiliates' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-bullhorn w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Affiliates</span>
            </a>

            <p class="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">System</p>

          
<a href="loyalty.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'loyalty' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
    <i class="fa fa-coins w-6 text-lg transition-transform group-hover:scale-110"></i>
    <span class="ml-2">Loyalty Coins</span>
</a>

            <a href="marketing.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'marketing' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-ad w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Marketing</span>
            </a>
            
             <a href="settings.html" class="flex items-center px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-mudalali-green rounded-lg transition-all duration-200 group ${activePage === 'settings' ? 'bg-green-50 text-mudalali-green font-bold' : ''}">
                <i class="fa fa-cog w-6 text-lg transition-transform group-hover:scale-110"></i>
                <span class="ml-2">Settings</span>
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
            <img src="https://i.ibb.co/1tCywvyP/logo.png" class="h-8" alt="Logo">
            <span class="font-bold text-gray-800 text-lg">Admin</span>
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

export async function confirmAction(title = "Are you sure?", text = "You won't be able to revert this!") {
    if(typeof Swal === 'undefined') return confirm(title);
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3a6a4a',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, do it!'
    });
    return result.isConfirmed;
}

export async function uploadImage(file) {
    if (!file) throw new Error("No file selected");
    
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error("Upload failed via ImgBB");
        }
    } catch (error) {
        console.error("Image Upload Error:", error);
        throw error;
    }
}