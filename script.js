// Hamburger Menu Toggle
        function toggleMenu() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        }

        // Close menu when a link is clicked
        function closeMenu() {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const nav = document.querySelector('nav');
            if (!nav.contains(event.target)) {
                closeMenu();
            }
        });

        function scrollToFlashcard() {
            document.getElementById('flashcard-section').scrollIntoView({behavior: 'smooth'});
            closeMenu();
        }

        // Typing Animation untuk Home Section
        document.addEventListener('DOMContentLoaded', function() {
            const typingText = document.getElementById('typingText');
            const fullText = 'Wort des Tages dan Smenti';
            let currentIndex = 0;
            const typingSpeed = 100;
            const deletingSpeed = 50;
            const pauseTime = 2000;
            let isDeleting = false;

            function type() {
                if (!isDeleting) {
                    if (currentIndex < fullText.length) {
                        typingText.textContent += fullText[currentIndex];
                        currentIndex++;
                        setTimeout(type, typingSpeed);
                    } else {
                        isDeleting = true;
                        setTimeout(type, pauseTime);
                    }
                } else {
                    if (currentIndex > 0) {
                        typingText.textContent = fullText.substring(0, currentIndex - 1);
                        currentIndex--;
                        setTimeout(type, deletingSpeed);
                    } else {
                        isDeleting = false;
                        setTimeout(type, 500);
                    }
                }
            }

            type();
        });

        // Smooth scroll untuk nav links
        document.querySelectorAll('a[href^="#"]').forEach(element => {
            element.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Animasi kartu saat halaman dimuat
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.flashcard-container');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 150);
            });

            loadComments();
        });

        // Comment Form Handler
        const commentForm = document.getElementById('commentForm');
        const commentsContainer = document.getElementById('commentsContainer');
        let comments = [];

        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const comment = this.querySelector('textarea').value;

            const commentObj = {
                id: Date.now(),
                name: name,
                email: email,
                comment: comment,
                date: new Date().toLocaleDateString('id-ID', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            comments.unshift(commentObj);
            saveComments();
            renderComments();
            this.reset();

            const successMsg = document.createElement('div');
            successMsg.textContent = '✓ Komentar Anda berhasil dikirim!';
            successMsg.style.cssText = 'background: #4CAF50; color: white; padding: 1rem; border-radius: 0.4rem; margin-bottom: 1.5rem; animation: slideDown 0.3s ease;';
            commentsContainer.parentElement.insertBefore(successMsg, commentsContainer);
            
            setTimeout(() => successMsg.remove(), 4000);
        });

        function saveComments() {
            try {
                window.storage.set('comments-data', JSON.stringify(comments));
            } catch (err) {
                localStorage.setItem('wort-des-tages-comments', JSON.stringify(comments));
            }
        }

        function loadComments() {
            try {
                window.storage.get('comments-data').then(result => {
                    if (result && result.value) {
                        comments = JSON.parse(result.value);
                        renderComments();
                    }
                }).catch(() => {
                    const saved = localStorage.getItem('wort-des-tages-comments');
                    if (saved) {
                        comments = JSON.parse(saved);
                        renderComments();
                    }
                });
            } catch (err) {
                const saved = localStorage.getItem('wort-des-tages-comments');
                if (saved) {
                    comments = JSON.parse(saved);
                    renderComments();
                }
            }
        }

        function renderComments() {
            commentsContainer.innerHTML = '';

            if (comments.length === 0) {
                commentsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem; font-style: italic;">Belum ada komentar. Jadilah yang pertama berbagi masukan Anda!</p>';
                return;
            }

            comments.forEach(c => {
                const commentEl = document.createElement('div');
                commentEl.style.cssText = 'background: white; padding: 1.5rem; border-radius: 0.8rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid #DD0000;';
                
                const nameEl = document.createElement('div');
                nameEl.style.cssText = 'font-weight: 600; color: #000; font-size: 1.05rem; margin-bottom: 0.5rem;';
                nameEl.textContent = c.name;

                const dateEl = document.createElement('div');
                dateEl.style.cssText = 'font-size: 0.85rem; color: #999; margin-bottom: 1rem;';
                dateEl.textContent = c.date;

                const textEl = document.createElement('div');
                textEl.style.cssText = 'color: #666; line-height: 1.6; word-wrap: break-word;';
                textEl.textContent = c.comment;

                commentEl.appendChild(nameEl);
                commentEl.appendChild(dateEl);
                commentEl.appendChild(textEl);
                commentsContainer.appendChild(commentEl);
            });
        }