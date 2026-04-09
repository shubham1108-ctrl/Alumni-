const routes = {
    '/': 'landing',
    '/home': 'home',
    '/network': 'network',
    '/jobs': 'jobs',
    '/profile': 'profile',
    '/chat': 'chat',
    '/events': 'events'
};

const router = {
    init: () => {
        window.addEventListener('hashchange', router.handleLocation);
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                router.navigateTo(href);
            }
        });
        // Initial load
        if (!window.location.hash) {
            window.location.hash = '#/';
        }
        router.handleLocation();
    },

    navigateTo: (path) => {
        window.location.hash = '#' + path;
    },

    handleLocation: async () => {
        const hash = window.location.hash || '#/';
        const path = hash.replace('#', '') || '/';
        const page = routes[path] || 'landing';

        const event = new CustomEvent('route-change', { detail: { page } });
        window.dispatchEvent(event);
    }
};

export default router;
