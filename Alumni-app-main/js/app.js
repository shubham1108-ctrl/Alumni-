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
        const protectedRoutes = ['#home', '#events', '#jobs', '#chat', '#alumni', '#profile', '#profile/edit', '#notifications', '#privacy'];
        
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
            case '#chat':
                this.renderChat();
                break;
            case '#alumni':
                await this.renderAlumni();
                break;
            case '#profile':
                await this.renderProfile();
                break;
            case '#profile/edit':
                await this.renderEditProfile();
                break;
            case '#notifications':
                this.renderNotifications();
                break;
            case '#privacy':
                this.renderPrivacy();
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

        // Generate passout year options (2000–2035)
        let yearOptions = '<option value="" disabled selected>Select Passout Year</option>';
        for (let y = 2035; y >= 2000; y--) {
            yearOptions += `<option value="${y}">${y}</option>`;
        }

        appElement.innerHTML = `
            <div class="landing-page animate-fade" style="overflow-y: auto;">
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

                        <select id="passoutYear" class="chat-input" required>
                            ${yearOptions}
                        </select>

                        <input type="text" id="currentCity" class="chat-input" placeholder="Current City" required>

                        <!-- Alumni-only: Working status -->
                        <div id="working-section" style="display: none;">
                            <label style="display: block; text-align: left; font-size: 0.85rem; font-weight: 500; color: var(--text-main); margin-bottom: 8px;">Are you currently working?</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="currentlyWorking" value="yes"> Yes
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="currentlyWorking" value="no"> No
                                </label>
                            </div>
                        </div>

                        <!-- Alumni + Working = Yes: Job details -->
                        <div id="job-fields" style="display: none;">
                            <input type="text" id="jobTitle" class="chat-input" placeholder="Job Title" style="margin-bottom: 16px;">
                            <input type="text" id="companyName" class="chat-input" placeholder="Company Name">
                        </div>

                        <div id="register-error" style="color: #e53935; font-size: 0.85rem; display: none; margin-top: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="register-btn">Create Account</button>
                    </form>
                    <p style="margin-top: 20px; font-size: 0.9rem;">
                        Already have an account? <a href="#login" style="color: var(--primary); text-decoration: none; font-weight: 600;">Login</a>
                    </p>
                </div>
            </div>
        `;

        // Conditional visibility logic
        const roleSelect = document.getElementById('role');
        const workingSection = document.getElementById('working-section');
        const jobFields = document.getElementById('job-fields');

        roleSelect.addEventListener('change', () => {
            const isAlumni = roleSelect.value === 'Alumni';
            workingSection.style.display = isAlumni ? 'block' : 'none';
            if (!isAlumni) {
                jobFields.style.display = 'none';
                // Reset radio buttons when switching away from Alumni
                document.querySelectorAll('input[name="currentlyWorking"]').forEach(r => r.checked = false);
            }
        });

        document.querySelectorAll('input[name="currentlyWorking"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                jobFields.style.display = e.target.value === 'yes' ? 'block' : 'none';
            });
        });

        // Form submission
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const passoutYear = parseInt(document.getElementById('passoutYear').value) || null;
            const currentCity = document.getElementById('currentCity').value;

            const workingRadio = document.querySelector('input[name="currentlyWorking"]:checked');
            const currentlyWorking = workingRadio ? workingRadio.value === 'yes' : null;

            const jobTitle = document.getElementById('jobTitle')?.value || null;
            const companyName = document.getElementById('companyName')?.value || null;

            const registerBtn = document.getElementById('register-btn');
            const errorEl = document.getElementById('register-error');

            registerBtn.disabled = true;
            registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            errorEl.style.display = 'none';

            try {
                await auth.register({ fullName, email, password, role, passoutYear, currentCity, currentlyWorking, jobTitle, companyName });
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
                <div id="quick-post-btn" style="width: 45px; height: 45px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--white); margin-top: -25px; box-shadow: 0 4px 10px rgba(25, 118, 210, 0.4); cursor: pointer;">
                    <i class="fas fa-plus"></i>
                </div>
                <a href="#chat" class="nav-link" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: ${active === 'chat' ? 'var(--primary)' : 'var(--text-sub)'}">
                    <i class="fas fa-comment-dots" style="font-size: 1.2rem;"></i>
                    <span style="font-size: 0.65rem; font-weight: 500; margin-top: 4px;">Chat</span>
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
                    <a href="#chat" class="menu-item"><i class="fas fa-comments"></i> Messages</a>
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
                        <button class="btn btn-primary register-btn" data-id="${event.id}" style="width: 100%; font-size: 0.9rem;">Register Now</button>
                    </div>
                </div>
            `).join('');

            // Add click handlers for registration
            container.querySelectorAll('.register-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const eventId = e.target.getAttribute('data-id');
                    alert("You have successfully registered for this event.");
                    localStorage.setItem('registeredEventId', eventId);
                    console.log(`Registered for event ${eventId}`);
                };
            });
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
                    <button class="btn btn-primary view-job-btn" 
                        data-title="${job.title}" 
                        data-company="${job.company}" 
                        data-location="${job.location}" 
                        data-description="${job.description || ''}"
                        style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px;">View</button>
                </div>
            `).join('');

            // Add click handlers for job view
            container.querySelectorAll('.view-job-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const target = e.currentTarget;
                    const jobData = {
                        title: target.getAttribute('data-title'),
                        company: target.getAttribute('data-company'),
                        location: target.getAttribute('data-location'),
                        description: target.getAttribute('data-description')
                    };
                    this.showJobModal(jobData);
                };
            });
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
            console.log('Fetching alumni suggestions and connections...');
            const [suggestions, sentRequests] = await Promise.all([
                api.get('/discovery/suggestions'),
                api.get('/connections/sent')
            ]);

            const sentIds = new Set(sentRequests.map(req => req.toUserId));
            const container = document.getElementById('alumni-suggestions');
            
            if (!suggestions || suggestions.length === 0) {
                container.innerHTML = '<p style="grid-column: span 2; text-align: center; padding: 20px;">No suggestions found.</p>';
                return;
            }

            container.innerHTML = suggestions.map(alumni => {
                const isRequested = sentIds.has(alumni.id);
                return `
                    <div class="card animate-fade" style="margin: 0; padding: 15px; text-align: center;">
                        <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-light); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.5rem;">
                            <i class="fas fa-user"></i>
                        </div>
                        <h4 style="font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${alumni.fullName}</h4>
                        <p style="font-size: 0.7rem; color: var(--text-sub); margin-bottom: 10px;">${alumni.role || 'Member'}</p>
                        <button class="btn ${isRequested ? 'btn-outline' : 'btn-primary'} connect-btn" 
                                data-id="${alumni.id}" 
                                style="padding: 5px 10px; font-size: 0.7rem; border-radius: 8px; width: 100%;" 
                                ${isRequested ? 'disabled' : ''}>
                            ${isRequested ? 'Requested' : 'Connect'}
                        </button>
                    </div>
                `;
            }).join('');

            // Add event listeners to connect buttons
            container.querySelectorAll('.connect-btn').forEach(btn => {
                btn.onclick = async (e) => {
                    const toUserId = e.target.getAttribute('data-id');
                    e.target.disabled = true;
                    e.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                    try {
                        await api.post(`/connections/request/${toUserId}`);
                        e.target.textContent = 'Requested';
                        e.target.classList.remove('btn-primary');
                        e.target.classList.add('btn-outline');
                    } catch (error) {
                        console.error('Connection request failed:', error);
                        alert('Failed to send connection request: ' + error.message);
                        e.target.disabled = false;
                        e.target.textContent = 'Connect';
                    }
                };
            });

        } catch (error) {
            console.error('Fetch Alumni Failed:', error);
            document.getElementById('alumni-suggestions').innerHTML = `<p style="grid-column: span 2; text-align: center; color: #e53935;">Failed to load suggestions: ${error.message}</p>`;
        }
    },

    async renderProfile() {
        const appElement = document.getElementById('app');
        let user;
        try {
            user = await api.get('/profile/get');
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            user = auth.getUser(); // Fallback to local session if API fails
        }

        const isWorkingAlumni = user.role === 'ALUMNI' && user.currentlyWorking === true;

        appElement.innerHTML = `
            <header class="app-header">
                <a href="#home" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>My Profile</h1>
                <a href="#profile/edit" style="color: var(--text-main);"><i class="fas fa-edit" id="edit-profile-btn" style="cursor: pointer;"></i></a>
            </header>
            <div style="flex: 1; overflow-y: auto;">
                <div style="background: var(--white); padding: 30px 20px; text-align: center; border-bottom: 1px solid var(--border);">
                    <div style="width: 90px; height: 90px; border-radius: 50%; background: var(--primary-light); margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 2.5rem; border: 4px solid var(--white); box-shadow: var(--shadow-md);">
                        <i class="fas fa-user"></i>
                    </div>
                    <h2 style="font-size: 1.3rem;">${user?.fullName || 'User'}</h2>
                    <p style="color: var(--text-sub); font-size: 0.85rem; margin-top: 4px;">${user?.role || 'Member'} • Golden Years Network</p>
                    <p style="color: var(--primary); font-size: 0.8rem; margin-top: 4px;">${user?.email || ''}</p>
                    ${isWorkingAlumni ? `
                        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);">
                            <p style="font-size: 0.9rem; font-weight: 600; color: var(--text-main);">${user.jobTitle || 'No Job Title'}</p>
                            <p style="font-size: 0.85rem; color: var(--text-sub);">${user.companyName || 'No Company Name'}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="padding: 20px; background: var(--white); margin-top: 12px; border-bottom: 1px solid var(--border); border-top: 1px solid var(--border);">
                    <h3 style="font-size: 0.95rem; margin-bottom: 15px; font-weight: 600;">Account Settings</h3>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <a href="#notifications" class="menu-item-profile" style="text-decoration: none; color: inherit;">
                            <i class="fas fa-bell"></i>
                            <span>Notifications</span>
                        </a>
                        <a href="#privacy" class="menu-item-profile" style="text-decoration: none; color: inherit;">
                            <i class="fas fa-lock"></i>
                            <span>Privacy & Security</span>
                        </a>
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
    },

    async renderEditProfile() {
        const appElement = document.getElementById('app');
        let user;
        try {
            user = await api.get('/profile/get');
        } catch (error) {
            console.error('Failed to fetch profile for editing:', error);
            window.location.hash = '#profile';
            return;
        }

        appElement.innerHTML = `
            <header class="app-header">
                <a href="#profile" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Edit Profile</h1>
                <div></div>
            </header>
            <div style="flex: 1; overflow-y: auto; padding: 20px;">
                <div class="auth-card" style="box-shadow: none; padding: 0;">
                    <form id="edit-profile-form" class="auth-inputs">
                        <div style="text-align: left;">
                            <label style="font-size: 0.85rem; color: var(--text-sub); margin-left: 10px;">Full Name</label>
                            <input type="text" id="edit-fullName" class="chat-input" value="${user.fullName || ''}" required>
                        </div>
                        
                        <div style="margin-top: 10px; text-align: left;">
                            <label style="display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-main); margin-bottom: 8px; margin-left: 10px;">Are you currently working?</label>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input type="radio" name="edit-currentlyWorking" value="yes" ${user.currentlyWorking ? 'checked' : ''}> Yes
                                </label>
                                <label class="radio-label">
                                    <input type="radio" name="edit-currentlyWorking" value="no" ${!user.currentlyWorking ? 'checked' : ''}> No
                                </label>
                            </div>
                        </div>

                        <div id="edit-job-fields" style="display: ${user.currentlyWorking ? 'block' : 'none'}; margin-top: 10px;">
                            <div style="text-align: left; margin-bottom: 15px;">
                                <label style="font-size: 0.85rem; color: var(--text-sub); margin-left: 10px;">Job Title</label>
                                <input type="text" id="edit-jobTitle" class="chat-input" value="${user.jobTitle || ''}">
                            </div>
                            <div style="text-align: left;">
                                <label style="font-size: 0.85rem; color: var(--text-sub); margin-left: 10px;">Company Name</label>
                                <input type="text" id="edit-companyName" class="chat-input" value="${user.companyName || ''}">
                            </div>
                        </div>

                        <div id="edit-error" style="color: #e53935; font-size: 0.85rem; display: none; margin-top: 10px;"></div>
                        <button type="submit" class="btn btn-primary" id="save-profile-btn" style="margin-top: 20px; width: 100%;">Save Changes</button>
                    </form>
                </div>
            </div>
            ${this.renderBottomNav('profile')}
        `;

        const workingRadios = document.querySelectorAll('input[name="edit-currentlyWorking"]');
        const jobFields = document.getElementById('edit-job-fields');

        workingRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                jobFields.style.display = e.target.value === 'yes' ? 'block' : 'none';
            });
        });

        document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const saveBtn = document.getElementById('save-profile-btn');
            const errorEl = document.getElementById('edit-error');

            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            errorEl.style.display = 'none';

            const fullName = document.getElementById('edit-fullName').value;
            const workingRadio = document.querySelector('input[name="edit-currentlyWorking"]:checked');
            const currentlyWorking = workingRadio.value === 'yes';
            const jobTitle = currentlyWorking ? document.getElementById('edit-jobTitle').value : null;
            const companyName = currentlyWorking ? document.getElementById('edit-companyName').value : null;

            try {
                const updatedUser = await api.put('/profile/update', {
                    fullName,
                    currentlyWorking,
                    jobTitle,
                    companyName
                });
                
                // Update local session
                const currentUser = auth.getUser();
                auth.setSession({
                    token: localStorage.getItem('token'),
                    id: updatedUser.id,
                    email: updatedUser.email,
                    fullName: updatedUser.fullName,
                    role: updatedUser.role
                });

                window.location.hash = '#profile';
            } catch (error) {
                console.error('Update Profile Error:', error);
                errorEl.textContent = error.message;
                errorEl.style.display = 'block';
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        });
    },

    renderNotifications() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#profile" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Notifications</h1>
                <div></div>
            </header>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px; color: var(--text-sub);">
                <div>
                    <i class="fas fa-bell fa-4x" style="margin-bottom: 20px; color: var(--primary-light);"></i>
                    <h3>Notification settings coming soon</h3>
                    <p style="font-size: 0.9rem; margin-top: 10px;">We are working hard to bring you a better experience.</p>
                </div>
            </div>
            ${this.renderBottomNav('profile')}
        `;
    },

    renderPrivacy() {
        const appElement = document.getElementById('app');
        appElement.innerHTML = `
            <header class="app-header">
                <a href="#profile" style="color: var(--text-main);"><i class="fas fa-arrow-left"></i></a>
                <h1>Privacy & Security</h1>
                <div></div>
            </header>
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; text-align: center; padding: 40px; color: var(--text-sub);">
                <div>
                    <i class="fas fa-lock fa-4x" style="margin-bottom: 20px; color: var(--primary-light);"></i>
                    <h3>Privacy settings coming soon</h3>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Your security is our top priority.</p>
                </div>
            </div>
            ${this.renderBottomNav('profile')}
        `;
    },

    showJobModal(job) {
        const modalId = 'job-detail-modal';
        let modal = document.getElementById(modalId);
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = modalId;
            document.body.appendChild(modal);
        }

        const description = job.description && job.description.trim() ? job.description : "More details will be shared soon.";

        modal.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px);">
                <div class="card animate-fade" style="width: 100%; max-width: 380px; margin: 0; position: relative; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
                    <button id="close-job-modal" style="position: absolute; top: 15px; right: 15px; border: none; background: none; font-size: 1.2rem; color: var(--text-sub); cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: var(--primary); margin-bottom: 20px;">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    
                    <h2 style="font-size: 1.2rem; margin-bottom: 4px; color: var(--text-main);">${job.title}</h2>
                    <p style="font-size: 0.9rem; color: var(--primary); font-weight: 500; margin-bottom: 12px;">${job.company}</p>
                    
                    <div style="display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-size: 0.85rem; margin-bottom: 20px;">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${job.location}</span>
                    </div>
                    
                    <div style="border-top: 1px solid var(--border); padding-top: 20px;">
                        <h4 style="font-size: 0.9rem; margin-bottom: 10px; color: var(--text-main);">Job Description</h4>
                        <p style="font-size: 0.85rem; color: var(--text-main); line-height: 1.6; max-height: 200px; overflow-y: auto;">
                            ${description}
                        </p>
                    </div>
                    
                    <button class="btn btn-primary" style="width: 100%; margin-top: 24px;" onclick="document.getElementById('${modalId}').innerHTML = ''">Close</button>
                </div>
            </div>
        `;

        document.getElementById('close-job-modal').onclick = () => {
            modal.innerHTML = '';
        };
    },
};

app.init();
export default app;
