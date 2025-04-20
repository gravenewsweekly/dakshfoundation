document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navMenu.classList.remove('show');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Donation amount buttons
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    let selectedAmount = 0;
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set selected amount
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            
            // Clear custom amount input
            customAmountInput.value = '';
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', function() {
        // Remove active class from all buttons when custom amount is entered
        amountButtons.forEach(btn => btn.classList.remove('active'));
        
        // Set selected amount from input
        selectedAmount = parseInt(this.value) || 0;
    });
    
    // Donate button click handler
    document.getElementById('donate-btn').addEventListener('click', function() {
        if (selectedAmount <= 0) {
            alert('Please select or enter a donation amount');
            return;
        }
        
        // Convert to cents/pence for Razorpay
        const amountInCents = selectedAmount * 100;
        
        // Razorpay integration
        const options = {
            key: 'rzp_test_1DP5mmOlF5G5ag', // Replace with your actual Razorpay API key
            amount: amountInCents,
            currency: 'EUR',
            name: 'Daksh Foundation',
            description: 'Donation for Environmental and Education Initiatives',
            image: 'https://example.com/your_logo.png', // Add your logo URL
            handler: function(response) {
                alert('Thank you for your donation of €' + selectedAmount + '! Your payment ID is: ' + response.razorpay_payment_id);
                
                // Here you would typically send the payment details to your server
                // for verification and to record the donation
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            notes: {
                address: 'Daksh Foundation donation'
            },
            theme: {
                color: '#2e7d32'
            }
        };
        
        const rzp = new Razorpay(options);
        rzp.open();
    });
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the email to your server
            // or newsletter service like Mailchimp
            
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Using Formspree endpoint
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Thank you for your message! We will get back to you soon.');
                    this.reset();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                alert('There was a problem sending your message. Please try again later.');
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        });
    }
});
