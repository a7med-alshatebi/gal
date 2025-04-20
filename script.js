document.addEventListener('DOMContentLoaded', () => {
    const SLIDER = document.getElementById('slider');
    const LOADING = document.getElementById('loading');
    let currentIndex = 0;

    const CONFIG = {
        apiUrl: '/api/instagram' // Replace with your backend endpoint
    };

    async function fetchInstagramFeed() {
        try {
            LOADING.style.display = 'flex';
            
            // Fetch all data from your backend
            const response = await fetch(CONFIG.apiUrl);
            if (!response.ok) throw new Error('API request failed');
            
            const { profileData, mediaData } = await response.json();

            // Update profile section
            document.getElementById('username').textContent = `@${profileData.username}`;
            document.getElementById('profile-pic').src = profileData.profile_picture_url;
            
            // Process media items
            const validPosts = mediaData.data.filter(post => {
                post.media_url = post.media_url.replace('http://', 'https://');
                return post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM';
            });

            if (validPosts.length === 0) {
                SLIDER.innerHTML = `<div class="min-w-full text-center p-8">No posts available</div>`;
                return;
            }

            createSlider(validPosts);
            setupNavigation(validPosts.length);
            
        } catch (error) {
            console.error('Error:', error);
            SLIDER.innerHTML = `<div class="min-w-full text-center p-8">Error loading content</div>`;
        } finally {
            LOADING.style.display = 'none';
        }
    }

    function createSlider(posts) {
        SLIDER.innerHTML = '';
        
        posts.forEach((post) => {
            const slide = document.createElement('div');
            slide.className = 'min-w-full relative';
            
            const mediaContent = post.media_type === 'CAROUSEL_ALBUM' 
                ? post.children.data.map(child => `
                    <img src="${child.media_url}" 
                         alt="${post.caption || 'Instagram post'}"
                         class="w-full h-96 object-contain bg-gray-50">
                `).join('')
                : `
                    <img src="${post.media_url}" 
                         alt="${post.caption || 'Instagram post'}"
                         class="w-full h-96 object-contain bg-gray-50">
                `;

            slide.innerHTML = `
                <div class="relative">
                    ${mediaContent}
                    <a href="${post.permalink}" 
                       target="_blank" 
                       class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white hover:text-gray-300 transition-colors">
                        <p class="text-sm line-clamp-2">${post.caption || ''}</p>
                    </a>
                </div>
            `;
            SLIDER.appendChild(slide);
        });
    }

    // ... rest of the code remains the same
});
