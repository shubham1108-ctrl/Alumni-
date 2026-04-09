import auth from './auth.js';
import api from './api.js';

const app = {
    async init() {
        console.log('App initialized');
        window.addEventListener('hashchange', () => this.route());
        this.route();
    },

    async route() {
        const hash = window.location.hash || '#home';
        console.log('Routing to:', hash);
        const appElement = document.getElementById('app');

        // Protected routes
<<<<<<< HEAD
        const protectedRoutes = ['#home', '#events', '#jobs', '#funding', '#alumni', '#profile', '#chat'];
=======
        const protectedRoutes = ['#home', '#events', '#jobs', '#chat', '#alumni', '#profile'];
>>>>>>> fa17c6d6c4b262153409c160293464dfc7131fe1
        
        if (protectedRoutes.includes(hash) && !auth.isAuthenticated()) {
            console.log('Not authenticated, redirecting to login');
            window.location.hash = '#login';
            return;
        }

        if ((hash === '#login' || hash === '#register') && auth.isAuthenticated()) {
            console.log('Already authenticated, redirecting to home');
            window.location.hash = '#home';
            return;
        }

        appElement.innerHTML = '<div class="loading-overlay"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';

        switch (hash) {
            case '#login':
                this.renderLogin();
                break;
            case '#register':
                this.renderRegister();
                break;
            case '#home':
                await this.renderHome();
                break;
            case '#events':
                await this.renderEvents();
                break;
            case '#jobs':
                await this.renderJobs();
                break;
<<<<<<< HEAD
            case '#funding':
                this.renderFundingScreen();
                break;
            case '#chat':
                this.openChatScreen();
=======
            case '#chat':
                this.renderChat();
>>>>>>> fa17c6d6c4b262153409c160293464dfc7131fe1
                break;
            case '#alumni':
                await this.renderAlumni();
                break;
            case '#profile':
                this.renderProfile();
                break;
            default:
                window.location.hash = '#home';
        }
    },

    renderLogin() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <div class="landing-page animate-fade">
                <div class="auth-card">
                    <div style="margin-bottom: 30px;">
                        <i class="fas fa-user-graduate fa-3x" style="color: var(--primary);"></i>
                        <h2 style="margin-top: 15px; color: var(--primary);">Golden Years</h2>
                        <p style="color: var(--text-sub); font-size: 0.9rem;">Alumni Network</p>
                    </div>
                    <h2>Login</h2>
                    <form id="login-form" class="auth-inputs">
                        <input type="email" id="email" class="chat-input" placeholder="Email" required>
                        <input type="password" id="password" class="chat-input" placeholder="Password" required>
                        <div id="login-error" style="color: #e53935; font-size: 0.85rem; display: none; margin-top: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="login-btn">Login</button>
                    </form>
                    <p style="margin-top: 20px; font-size: 0.9rem;">
                        Don't have an account? <a href="#register" style="color: var(--primary); text-decoration: none; font-weight: 600;">Register</a>
                    </p>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('login-btn');
            const errorEl = document.getElementById('login-error');

            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            errorEl.style.display = 'none';

            try {
                await auth.login(email, password);
                window.location.hash = '#home';
            } catch (error) {
                console.error('Login Error:', error);
                errorEl.textContent = error.message;
                errorEl.style.display = 'block';
                loginBtn.disabled = false;
                loginBtn.textContent = 'Login';
            }
        });
    },

    renderRegister() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <div class="landing-page animate-fade">
                <div class="auth-card">
                    <div style="margin-bottom: 20px;">
                        <i class="fas fa-user-plus fa-3x" style="color: var(--primary);"></i>
                        <h2 style="margin-top: 10px; color: var(--primary);">Join Network</h2>
                    </div>
                    <h2>Register</h2>
                    <form id="register-form" class="auth-inputs">
                        <input type="text" id="fullName" class="chat-input" placeholder="Full Name" required>
                        <input type="email" id="email" class="chat-input" placeholder="Email" required>
                        <input type="password" id="password" class="chat-input" placeholder="Password" required>
                        <select id="role" class="chat-input" required>
                            <option value="" disabled selected>Select Your Role</option>
                            <option value="Alumni">Alumni</option>
                            <option value="Student">Student</option>
                        </select>
                        <div id="register-error" style="color: #e53935; font-size: 0.85rem; display: none; margin-top: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="register-btn">Create Account</button>
                    </form>
                    <p style="margin-top: 20px; font-size: 0.9rem;">
                        Already have an account? <a href="#login" style="color: var(--primary); text-decoration: none; font-weight: 600;">Login</a>
                    </p>
                </div>
            </div>
        `;

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const registerBtn = document.getElementById('register-btn');
            const errorEl = document.getElementById('register-error');

            registerBtn.disabled = true;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            errorEl.style.display = 'none';

            try {
                await auth.register({ fullName, email, password, role });
                window.location.hash = '#home';
            } catch (error) {
                console.error('Register Error:', error);
                errorEl.textContent = error.message;
                errorEl.style.display = 'block';
                registerBtn.disabled = false;
                registerBtn.textContent = 'Create Account';
            }
        });
    },

    async renderHome() {
        const user = auth.getUser();
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <i class="fas fa-bars hamburger" id="menu-btn"></i>
                <h1>Golden Years Network</h1>
                <i class="fas fa-bell hamburger"></i>
            </header>

            <div style="flex: 1; overflow-y: auto;">
                <div class="welcome-banner animate-fade">
                    <h2>Welcome, ${user?.fullName || 'Alumni'}!</h2>
                    <p>Stay connected with your network today.</p>
                </div>

                <div class="action-grid">
                    <a href="#events" class="action-item">
                        <div class="icon-circle"><i class="fas fa-calendar-alt"></i></div>
                        <span>Events</span>
                    </a>
                    <a href="#jobs" class="action-item">
                        <div class="icon-circle"><i class="fas fa-briefcase"></i></div>
                        <span>Jobs</span>
                    </a>
                    <a href="#chat" class="action-item">
                        <div class="icon-circle"><i class="fas fa-comments"></i></div>
                        <span>Chat</span>
                    </a>
                    <a href="#alumni" class="action-item">
                        <div class="icon-circle"><i class="fas fa-users"></i></div>
                        <span>Alumni</span>
                    </a>
                </div>

                <div class="card" style="padding: 16px;">
                    <h3 style="margin-bottom: 12px; font-size: 1rem;">Share an update</h3>
                    <form id="post-form" style="display: flex; gap: 12px; align-items: center;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                            <i class="fas fa-user"></i>
                        </div>
                        <input type="text" id="post-content" class="chat-input" placeholder="What's on your mind?" style="background: #f0f2f5;">
                        <button type="submit" class="btn btn-primary" style="padding: 8px 12px; border-radius: 8px;"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>

                <div id="feed-container">
                    <div class="loading-overlay" style="padding: 20px;">
                        <i class="fas fa-circle-notch fa-spin"></i>
                        <p style="color: var(--text-sub); font-size: 0.9rem; margin-left: 10px;">Fetching latest posts...</p>
                    </div>
                </div>
            </div>

            ${this.renderBottomNav('home')}
            ${this.renderSidebar()}
        `;

        this.initSidebar();
        this.initPostForm();
        await this.fetchPosts();
    },

    initPostForm() {
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.onsubmit = async (e) => {
                e.preventDefault();
                const contentInput = document.getElementById('post-content');
                const content = contentInput.value.trim();
                if (!content) return;

                console.log('Creating post:', content);
                try {
                    await api.post('/posts', { content });
                    contentInput.value = '';
                    await this.fetchPosts();
                } catch (error) {
                    console.error('Post Creation Failed:', error);
                    alert('Failed to create post: ' + error.message);
                }
            };
        }
    },

    async fetchPosts() {
        const feedContainer = document.getElementById('feed-container');
        if (!feedContainer) return;

        try {
            console.log('Fetching posts...');
            const posts = await api.get('/posts');
            if (!posts || posts.length === 0) {
                feedContainer.innerHTML = '<p style="text-align: center; padding: 30px; color: var(--text-sub);">No posts yet. Be the first to share something!</p>';
                return;
            }

            feedContainer.innerHTML = posts.map(post => `
                <div class="card animate-fade">
                    <div style="padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h4 style="font-size: 0.9rem;">${post.author?.fullName || 'Alumni'}</h4>
                                <p style="font-size: 0.7rem; color: var(--text-sub);">${new Date(post.createdAt).toLocaleDateString()} • ${post.author?.role || 'Member'}</p>
                            </div>
                        </div>
                        <i class="fas fa-ellipsis-h" style="color: var(--text-sub);"></i>
                    </div>
                    <div style="padding: 0 12px 12px;">
                        <p style="font-size: 0.9rem; line-height: 1.5;">${post.content}</p>
                    </div>
                    <div style="padding: 8px 12px; border-top: 1px solid var(--border); display: flex; gap: 20px; color: var(--text-sub); font-size: 0.8rem;">
                        <span style="cursor: pointer;"><i class="far fa-heart"></i> ${post.likesCount || 0} Like</span>
                        <span style="cursor: pointer;"><i class="far fa-comment"></i> ${post.comments ? post.comments.length : 0} Comment</span>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Posts Failed:', error);
            feedContainer.innerHTML = `<p style="text-align: center; padding: 20px; color: #e53935;">Failed to load posts: ${error.message}</p>`;
        }
    },

    renderBottomNav(active) {
        return `
            <nav style="height: 60px; background: var(--white); border-top: 1px solid var(--border); display: flex; justify-content: space-around; align-items: center; z-index: 1000;">
                <a href="#home" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'home' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-home" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Home</span>
                </a>
                <a href="#alumni" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'alumni' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-user-friends" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Network</span>
                </a>
<<<<<<< HEAD
                <div id="quick-post-btn" onclick="app.openFabMenu()" style="width: 45px; height: 45px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--white); margin-top: -25px; box-shadow: 0 4px 10px rgba(25, 118, 210, 0.4); cursor: pointer;">
                    <i class="fas fa-plus"></i>
                </div>
                <a href="#funding" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'funding' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-qrcode" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Funding</span>
=======
                <div id="quick-post-btn" style="width: 45px; height: 45px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--white); margin-top: -25px; box-shadow: 0 4px 10px rgba(25, 118, 210, 0.4); cursor: pointer;">
                    <i class="fas fa-plus"></i>
                </div>
                <a href="#chat" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'chat' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-comment-dots" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Chat</span>
>>>>>>> fa17c6d6c4b262153409c160293464dfc7131fe1
                </a>
                <a href="#profile" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'profile' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-user-circle" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Profile</span>
                </a>
            </nav>
        `;
    },

    renderSidebar() {
        const user = auth.getUser();
        return `
            <div id="sidebar-overlay" class="sidebar-overlay"></div>
            <div id="sidebar" class="sidebar">
                <div class="sidebar-header">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 12px; font-size: 1.5rem;">
                        <i class="fas fa-user"></i>
                    </div>
                    <h4>${user?.fullName || 'User'}</h4>
                    <p style="font-size: 0.8rem; opacity: 0.8;">${user?.email || ''}</p>
                </div>
                <div class="sidebar-nav">
                    <a href="#home" class="menu-item"><i class="fas fa-home"></i> Home</a>
                    <a href="#profile" class="menu-item"><i class="fas fa-user"></i> My Profile</a>
                    <a href="#events" class="menu-item"><i class="fas fa-calendar-alt"></i> Events</a>
                    <a href="#jobs" class="menu-item"><i class="fas fa-briefcase"></i> Jobs</a>
<<<<<<< HEAD
                    <a href="#funding" class="menu-item"><i class="fas fa-qrcode"></i> Funding</a>
=======
                    <a href="#chat" class="menu-item"><i class="fas fa-comments"></i> Messages</a>
>>>>>>> fa17c6d6c4b262153409c160293464dfc7131fe1
                    <a href="#alumni" class="menu-item"><i class="fas fa-users"></i> Alumni Network</a>
                    <hr style="margin: 10px 0; border: none; border-top: 1px solid var(--border);">
                    <a href="#" class="menu-item" id="sidebar-logout" style="color: #e53935;"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;
    },

    initSidebar() {
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const logoutBtn = document.getElementById('sidebar-logout');

        if (menuBtn) {
            menuBtn.onclick = () => {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            };
        }

        if (overlay) {
            overlay.onclick = () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            };
        }

        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                console.log('Sidebar Logout clicked');
                e.preventDefault();
                auth.logout();
            };
        }
        
        // Ensure sidebar links close the sidebar
        const links = sidebar.querySelectorAll('a:not(#sidebar-logout)');
        links.forEach(link => {
            link.onclick = () => {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            };
        });
    },

    async renderEvents() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Events</h1>
                <div></div>
            </header>
            <div id="events-container" style="flex: 1; overflow-y: auto; padding: 16px;">
                 <div class="loading-overlay">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <p style="margin-left: 10px;">Loading events...</p>
                </div>
            </div>
            ${this.renderBottomNav('home')}
        `;
        
        try {
            const events = await api.get('/events');
            const container = document.getElementById('events-container');
            if (!events || events.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 30px; color: var(--text-sub);">No upcoming events.</p>';
                return;
            }

            container.innerHTML = events.map(event => `
                <div class="card animate-fade">
                    <div style="height: 140px; background: linear-gradient(135deg, #1976d2, #64b5f6); display: flex; align-items: center; justify-content: center; color: var(--white);">
                        ${event.imageUrl ? `<img src="${event.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="fas fa-calendar-alt fa-3x"></i>`}
                    </div>
                    <div style="padding: 16px;">
                        <span style="font-size: 0.7rem; color: var(--primary); font-weight: 600; text-transform: uppercase;">${event.date || 'TBD'}</span>
                        <h3 style="margin: 5px 0 10px; font-size: 1.1rem;">${event.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-sub); margin-bottom: 8px;"><i class="fas fa-map-marker-alt" style="margin-right: 5px;"></i> ${event.location || 'Online'}</p>
                        <p style="font-size: 0.85rem; color: var(--text-main); margin-bottom: 15px;">${event.description}</p>
                        <button class="btn btn-primary" style="width: 100%; font-size: 0.9rem;">Register Now</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Events Failed:', error);
            document.getElementById('events-container').innerHTML = `<p style="text-align: center; color: #e53935; padding: 20px;">Failed to load events: ${error.message}</p>`;
        }
    },

    async renderJobs() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Job Board</h1>
                <div></div>
            </header>
            <div id="jobs-container" style="flex: 1; overflow-y: auto; padding: 16px;">
                <div class="loading-overlay">
                    <i class="fas fa-circle-notch fa-spin"></i>
                    <p style="margin-left: 10px;">Finding opportunities...</p>
                </div>
            </div>
            ${this.renderBottomNav('home')}
        `;

        try {
            const jobs = await api.get('/jobs');
            const container = document.getElementById('jobs-container');
            if (!jobs || jobs.length === 0) {
                container.innerHTML = '<p style="text-align: center; padding: 30px; color: var(--text-sub);">No job postings at the moment.</p>';
                return;
            }

            container.innerHTML = jobs.map(job => `
                <div class="card animate-fade" style="padding: 16px; display: flex; gap: 12px; align-items: start;">
                    <div style="width: 45px; height: 45px; border-radius: 8px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: var(--primary);">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size: 0.95rem; margin-bottom: 4px;">${job.title}</h3>
                        <p style="font-size: 0.8rem; color: var(--text-main);">${job.company} • ${job.location}</p>
                        <p style="font-size: 0.75rem; color: var(--text-sub); margin-top: 5px;">${job.category || 'Full-time'}</p>
                    </div>
                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px;">View</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Jobs Failed:', error);
            document.getElementById('jobs-container').innerHTML = `<p style="text-align: center; color: #e53935; padding: 20px;">Failed to load jobs: ${error.message}</p>`;
        }
    },

    renderChat() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Chat</h1>
                <div></div>
            </header>
            <div class="chat-container">
                <div class="messages">
                    <div class="received"><div class="message-bubble">Hey! Welcome to the Golden Years Network!</div></div>
                    <div class="sent"><div class="message-bubble">Thanks! Glad to be here.</div></div>
                </div>
                <div class="chat-input-area">
                    <input type="text" class="chat-input" placeholder="Type a message...">
                    <button class="btn btn-primary" style="width: 40px; height: 40px; padding: 0; border-radius: 50%;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            ${this.renderBottomNav('chat')}
        `;
    },

    async renderAlumni() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Alumni Network</h1>
                <div></div>
            </header>
            <div style="flex: 1; overflow-y: auto; padding: 16px;">
                <input type="text" class="chat-input" placeholder="Search alumni by name or company..." style="width: 100%; margin-bottom: 20px;">
                
                <h3 style="font-size: 1rem; margin-bottom: 12px; color: var(--text-main); font-weight: 600;">People you may know</h3>
                <div id="alumni-suggestions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div class="loading-overlay" style="grid-column: span 2;">
                        <i class="fas fa-circle-notch fa-spin"></i>
                    </div>
                </div>
            </div>
            ${this.renderBottomNav('alumni')}
        `;

        try {
            console.log('Fetching alumni suggestions...');
            const suggestions = await api.get('/discovery/suggestions');
            const container = document.getElementById('alumni-suggestions');
            if (!suggestions || suggestions.length === 0) {
                container.innerHTML = '<p style="grid-column: span 2; text-align: center; padding: 20px;">No suggestions found.</p>';
                return;
            }

            container.innerHTML = suggestions.map(alumni => `
                <div class="card animate-fade" style="margin: 0; padding: 15px; text-align: center;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-light); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.5rem;">
                        <i class="fas fa-user"></i>
                    </div>
                    <h4 style="font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${alumni.fullName}</h4>
                    <p style="font-size: 0.7rem; color: var(--text-sub); margin-bottom: 10px;">${alumni.role || 'Member'}</p>
                    <button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.7rem; border-radius: 8px; width: 100%;">Connect</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Fetch Alumni Failed:', error);
            document.getElementById('alumni-suggestions').innerHTML = `<p style="grid-column: span 2; text-align: center; color: #e53935;">Failed to load suggestions: ${error.message}</p>`;
        }
    },

    renderProfile() {
        const user = auth.getUser();
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>My Profile</h1>
                <i class="fas fa-edit"></i>
            </header>
            <div style="flex: 1; overflow-y: auto;">
                <div style="background: var(--white); padding: 30px 20px; text-align: center; border-bottom: 1px solid var(--border);">
                    <div style="width: 90px; height: 90px; border-radius: 50%; background: var(--primary-light); margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 2.5rem; border: 4px solid var(--white); box-shadow: var(--shadow-md);">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2 style="font-size: 1.3rem;">${user?.fullName || 'User'}</h2>
                    <p style="color: var(--text-sub); font-size: 0.85rem; margin-top: 4px;">${user?.role || 'Member'} • Golden Years Network</p>
                    <p style="color: var(--primary); font-size: 0.8rem; margin-top: 4px;">${user?.email || ''}</p>
                </div>
                
                <div style="padding: 20px; background: var(--white); margin-top: 12px; border-bottom: 1px solid var(--border); border-top: 1px solid var(--border);">
                    <h3 style="font-size: 0.95rem; margin-bottom: 15px; font-weight: 600;">Account Settings</h3>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div class="menu-item-profile">
                            <i class="fas fa-bell"></i>
                            <span>Notifications</span>
                        </div>
                        <div class="menu-item-profile">
                            <i class="fas fa-lock"></i>
                            <span>Privacy & Security</span>
                        </div>
                        <div class="menu-item-profile" id="profile-logout" style="color: #e53935; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </div>
                    </div>
                </div>
            </div>
            ${this.renderBottomNav('profile')}
        `;

        document.getElementById('profile-logout').onclick = (e) => {
            console.log('Profile Logout clicked');
            auth.logout();
        };
<<<<<<< HEAD
    },

    openFabMenu() {
        if (location.hash.includes("events")) {
            this.openAddEventModal();
            return;
        }
        else if (location.hash.includes("jobs")) {
            this.openAddJobModal();
            return;
        }

        let menu = document.getElementById('fab-menu');
        let overlay = document.getElementById('sidebar-overlay');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'fab-menu';
            menu.className = 'bottom-menu';
            menu.innerHTML = `
                <div class="bottom-menu-item" onclick="app.openAddEventModal(); app.closeFabMenu();">
                    <i class="fas fa-calendar-plus"></i>
                    <span>Add Event</span>
                </div>
                <div class="bottom-menu-item" onclick="app.openAddJobModal(); app.closeFabMenu();">
                    <i class="fas fa-briefcase"></i>
                    <span>Add Job</span>
                </div>
            `;
            document.getElementById('app').appendChild(menu);
        }
        
        menu.classList.add('active');
        if(overlay) {
            overlay.classList.add('active');
            let oldOnClick = overlay.onclick;
            overlay.onclick = () => {
                app.closeFabMenu();
                if(oldOnClick) oldOnClick();
            };
        }
    },

    closeFabMenu() {
        const menu = document.getElementById('fab-menu');
        const overlay = document.getElementById('sidebar-overlay');
        if (menu) menu.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
            const sidebar = document.getElementById('sidebar');
            overlay.onclick = () => {
                if (sidebar) sidebar.classList.remove('active');
                overlay.classList.remove('active');
            };
        }
    },

    openAddEventModal() {
        let modal = document.getElementById('add-event-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'add-event-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-header">
                    <h3>Add Event</h3>
                    <i class="fas fa-times modal-close" onclick="document.getElementById('add-event-modal').classList.remove('active'); document.getElementById('sidebar-overlay').classList.remove('active');"></i>
                </div>
                <form id="add-event-form" class="auth-inputs">
                    <input type="text" id="event-title" class="chat-input" placeholder="Event Title" required>
                    <input type="date" id="event-date" class="chat-input" required>
                    <input type="text" id="event-location" class="chat-input" placeholder="Location" required>
                    <textarea id="event-desc" class="chat-input" placeholder="Description" rows="3" required></textarea>
                    <button type="submit" class="btn btn-primary" id="submit-event-btn">Submit</button>
                </form>
            `;
            document.getElementById('app').appendChild(modal);

            document.getElementById('add-event-form').addEventListener('submit', (e) => {
                e.preventDefault();
                app.submitEventForm();
            });
        }
        modal.classList.add('active');
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.classList.add('active');
            overlay.onclick = () => {
                modal.classList.remove('active');
                overlay.classList.remove('active');
            };
        }
    },

    openAddJobModal() {
        let modal = document.getElementById('add-job-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'add-job-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-header">
                    <h3>Add Job</h3>
                    <i class="fas fa-times modal-close" onclick="document.getElementById('add-job-modal').classList.remove('active'); document.getElementById('sidebar-overlay').classList.remove('active');"></i>
                </div>
                <form id="add-job-form" class="auth-inputs">
                    <input type="text" id="job-title" class="chat-input" placeholder="Job Title" required>
                    <input type="text" id="job-company" class="chat-input" placeholder="Company Name" required>
                    <input type="text" id="job-location" class="chat-input" placeholder="Location" required>
                    <textarea id="job-desc" class="chat-input" placeholder="Description" rows="3" required></textarea>
                    <button type="submit" class="btn btn-primary" id="submit-job-btn">Submit</button>
                </form>
            `;
            document.getElementById('app').appendChild(modal);

            document.getElementById('add-job-form').addEventListener('submit', (e) => {
                e.preventDefault();
                app.submitJobForm();
            });
        }
        modal.classList.add('active');
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) {
            overlay.classList.add('active');
            overlay.onclick = () => {
                modal.classList.remove('active');
                overlay.classList.remove('active');
            };
        }
    },

    async submitEventForm() {
        const btn = document.getElementById('submit-event-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const payload = {
            title: document.getElementById('event-title').value,
            date: document.getElementById('event-date').value,
            location: document.getElementById('event-location').value,
            description: document.getElementById('event-desc').value
        };

        try {
            await api.post('/events', payload);
            document.getElementById('add-event-modal').classList.remove('active');
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) overlay.classList.remove('active');
            
            if (window.location.hash === '#events') {
                await app.renderEvents();
            } else {
                window.location.hash = '#events';
            }
        } catch (error) {
            console.error('Failed to add event:', error);
            alert('Failed to add event: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Submit';
        }
    },

    async submitJobForm() {
        const btn = document.getElementById('submit-job-btn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

        const payload = {
            title: document.getElementById('job-title').value,
            company: document.getElementById('job-company').value,
            location: document.getElementById('job-location').value,
            description: document.getElementById('job-desc').value
        };

        try {
            await api.post('/jobs', payload);
            document.getElementById('add-job-modal').classList.remove('active');
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) overlay.classList.remove('active');
            
            if (window.location.hash === '#jobs') {
                await app.renderJobs();
            } else {
                window.location.hash = '#jobs';
            }
        } catch (error) {
            console.error('Failed to add job:', error);
            alert('Failed to add job: ' + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = 'Submit';
        }
    },

    renderFundingScreen() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Support Alumni Initiatives</h1>
                <div></div>
            </header>
            <div style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-app);">
                <div class="card animate-fade" style="padding: 30px; text-align: center; border-radius: var(--radius-lg); width: 100%; max-width: 320px; box-shadow: var(--shadow-md);">
                    <i class="fas fa-hand-holding-heart fa-3x" style="color: var(--primary); margin-bottom: 20px;"></i>
                    <h2 style="font-size: 1.2rem; color: var(--text-main); margin-bottom: 24px;">Support Alumni Initiatives</h2>
                    
                    <div style="background: var(--white); padding: 15px; border-radius: var(--radius-md); border: 2px solid var(--border); margin-bottom: 20px;">
                        <img src="/asset/upi-qr.jpg.jpeg" alt="UPI QR Code" style="width: 100%; height: auto; display: block; border-radius: var(--radius-sm);">
                    </div>
                    
                    <p style="font-size: 0.9rem; color: var(--text-sub); font-weight: 500;">Scan to contribute using UPI</p>
                </div>
            </div>
            ${this.renderBottomNav('funding')}
        `;
    },

    openChatScreen() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Alumni Chat</h1>
                <div></div>
            </header>
            <div class="chat-container" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #e0e6ed;">
                <div class="messages" id="chat-messages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: var(--bg-app);">
                </div>
                <div class="chat-input-area" style="background: var(--white); padding: 12px 16px; display: flex; gap: 12px; align-items: center; border-top: 1px solid var(--border);">
                    <input type="text" id="chat-input-field" class="chat-input" placeholder="Type a message..." style="flex: 1;">
                    <button class="btn btn-primary" onclick="app.sendChatMessage()" style="width: 40px; height: 40px; padding: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            ${this.renderBottomNav('')}
        `;
        this.initializeChatUI();
    },

    initializeChatUI() {
        let messages = JSON.parse(localStorage.getItem('alumni_chat_messages'));
        if (!messages) {
            messages = [
                { type: 'received', content: 'Hey! Welcome to Alumni Chat! How can we help you connect today?' }
            ];
            localStorage.setItem('alumni_chat_messages', JSON.stringify(messages));
        }

        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        container.innerHTML = messages.map(msg => `
            <div class="${msg.type === 'sent' ? 'sent' : 'received'}" style="align-self: ${msg.type === 'sent' ? 'flex-end' : 'flex-start'};">
                <div class="message-bubble" style="${msg.type === 'sent' ? 'background: var(--primary); color: var(--white); border-radius: 18px 18px 2px 18px;' : 'background: var(--white); color: var(--text-main); border-radius: 18px 18px 18px 2px; box-shadow: 0 1px 1px rgba(0,0,0,0.05);'}">
                    ${msg.content}
                </div>
            </div>
        `).join('');

        container.scrollTop = container.scrollHeight;

        const inputField = document.getElementById('chat-input-field');
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    app.sendChatMessage();
                }
            });
        }
    },

    sendChatMessage() {
        const inputField = document.getElementById('chat-input-field');
        if (!inputField) return;
        const text = inputField.value.trim();
        if (!text) return;

        const container = document.getElementById('chat-messages');
        let messages = JSON.parse(localStorage.getItem('alumni_chat_messages') || '[]');
        
        const newMsg = { type: 'sent', content: text };
        messages.push(newMsg);
        
        localStorage.setItem('alumni_chat_messages', JSON.stringify(messages));

        if(container) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'sent';
            msgDiv.style.alignSelf = 'flex-end';
            msgDiv.innerHTML = `<div class="message-bubble" style="background: var(--primary); color: var(--white); border-radius: 18px 18px 2px 18px;">${text}</div>`;
            container.appendChild(msgDiv);
            
            container.scrollTop = container.scrollHeight;
        }

        inputField.value = '';
    }
};

window.app = app;
=======
    }
};

>>>>>>> fa17c6d6c4b262153409c160293464dfc7131fe1
app.init();
export default app;
