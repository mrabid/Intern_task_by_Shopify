document.addEventListener('DOMContentLoaded', function() {
    // Sample review data
    const reviews = [
        {
            name: "Sarah Johnson",
            avatar: "assets/avatar1.jpg",
            rating: 5,
            date: "2024-03-15",
            content: "This device has been a game-changer for my senior dog's arthritis. He's much more active now and seems to be in less pain.",
            images: ["assets/review1-1.jpg", "assets/review1-2.jpg"]
        },
        {
            name: "Michael Chen",
            avatar: "assets/avatar2.jpg",
            rating: 4,
            date: "2024-03-10",
            content: "Great product! My cat's wound healed much faster than expected. The only reason for 4 stars is that the battery life could be better.",
            images: ["assets/review2-1.jpg"]
        },
        {
            name: "Emma Davis",
            avatar: "assets/avatar3.jpg",
            rating: 5,
            date: "2024-03-05",
            content: "Absolutely worth every penny. My dog loves the treatment sessions and I can see visible improvements in his mobility.",
            images: ["assets/review3-1.jpg", "assets/review3-2.jpg", "assets/review3-3.jpg"]
        }
    ];

    // Load reviews
    const reviewsList = document.querySelector('.reviews-list');
    
    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        
        // Create stars HTML
        const starsHTML = Array(review.rating).fill('<i class="fas fa-star"></i>').join('');
        
        reviewCard.innerHTML = `
            <div class="review-header">
                <img src="${review.avatar}" alt="${review.name}" class="reviewer-avatar">
                <div class="reviewer-info">
                    <div class="reviewer-name">${review.name}</div>
                    <div class="stars">${starsHTML}</div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="review-content">${review.content}</div>
            ${review.images ? `
                <div class="review-images">
                    ${review.images.map(img => `
                        <img src="${img}" alt="Review image" class="review-image" onclick="openModal(this.src)">
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        reviewsList.appendChild(reviewCard);
    });

    // Modal functionality
    window.openModal = function(imgSrc) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        modal.style.display = "block";
        modalImg.src = imgSrc;
    };

    // Close modal when clicking the close button or outside the image
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = function() {
        modal.style.display = "none";
    };

    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    // Lazy loading for review images
    const lazyImages = document.querySelectorAll('.review-image');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}); 