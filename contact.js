document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
      name: document.getElementById('contactName').value,
      email: document.getElementById('contactEmail').value,
      phone: document.getElementById('contactPhone').value,
      subject: document.getElementById('contactSubject').value,
      message: document.getElementById('contactMessage').value
    };
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        contactForm.classList.add('hidden');
        const successDiv = document.getElementById('contactSuccess');
        if (successDiv) {
          successDiv.classList.remove('hidden');
        }
        if (typeof showToast === 'function') {
          showToast('Message sent successfully!');
        }
      } else {
        const errData = await response.json();
        if (typeof showToast === 'function') {
          showToast(errData.error || 'Failed to send message.', 'error');
        } else {
          alert(errData.error || 'Failed to send message.');
        }
      }
    } catch (error) {
      console.error('Contact Form Submit Error:', error);
      if (typeof showToast === 'function') {
        showToast('Network error, please try again.', 'error');
      } else {
        alert('Network error, please try again.');
      }
    }
  });
});
