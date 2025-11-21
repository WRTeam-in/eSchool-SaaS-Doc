---
sidebar_position: 1
---

# 📚 Introduction

Welcome to the **e-School SaaS Installation Guide** by WRTeam! This comprehensive documentation will guide you through the complete setup process for both the **Admin Panel** and **Mobile Application** of the e-School SaaS system.

## 🎯 About This Guide

This guide is designed to help developers and administrators install and configure the core components of the e-School SaaS system, including:

- 🖥️ Setting up the **Admin Panel** on a VPS server
- 📱 Configuring and rebranding the **Flutter-based Mobile Application**
- 🔥 Connecting the app with **Firebase** and the backend
- 🎨 Additional configuration options for branding, theming, and localization

If you encounter any issues during setup, don't hesitate to reach out to us.

## 👨‍💻 Author & Contact

**By:** WRTeam  
**📧 Email:** [wrteam.mahesh@gmail.com](mailto:wrteam.mahesh@gmail.com)

---

## 🔑 Purchase Code Help

To find your Envato purchase code, please visit:  
👉 [Where is My Purchase Code?](https://help.market.envato.com/hc/en-us/articles/202822600-Where-Is-My-Purchase-Code-)

---

## 🚀 Getting Started

Thank you for choosing **e-School SaaS**! Let's begin your installation journey! 🎉

---

<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '48px 32px',
  margin: '48px 0',
  textAlign: 'center',
  boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)'
}}>
  <h2 style={{
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '16px',
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    🚀 Ready to Get Started?
  </h2>

  <p style={{
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '16px',
    marginBottom: '32px',
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: '1.6'
  }}>
    Begin your installation journey by setting up the Admin Panel first. This is the recommended starting point for most users.
  </p>

  <!-- Admin Panel Button -->
  <a
    href="/eSchool-SaaS-Doc/installation/admin-panel-installation/overview"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '18px 42px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#667eea',
      backgroundColor: '#ffffff',
      borderRadius: '14px',
      textDecoration: 'none',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '2px solid transparent',
      cursor: 'pointer',
      lineHeight: '1',
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    }}
  >
    <span style={{ fontSize: '22px', display: 'flex', alignItems: 'center' }}>🖥️</span>
    <span>Begin Admin Panel Setup →</span>
  </a>
</div>

<!-- Grid Section -->
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '24px',
  margin: '48px 0'
}}>

  <!-- Mobile App Card -->
  <div style={{
    background: '#ec4899',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(236, 72, 153, 0.25)',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
    <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
      Mobile App Installation
    </h3>
    <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
      Prefer to set up the mobile application first? Start here.
    </p>

    <a
      href="/eSchool-SaaS-Doc/installation/application-installation/overview"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#ec4899',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        lineHeight: '1',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <span>Setup Mobile App →</span>
    </a>
  </div>

  <!-- FAQs Card -->
  <div style={{
    background: '#06b6d4',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(6, 182, 212, 0.25)',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>❓</div>
    <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
      Need Help?
    </h3>
    <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
      Check our FAQs for common questions and solutions.
    </p>

    <a
      href="/eSchool-SaaS-Doc/installation/faqs"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#06b6d4',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        lineHeight: '1',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <span>View FAQs →</span>
    </a>
  </div>

  <!-- Support Card -->
  <div style={{
    background: '#10b981',
    borderRadius: '16px',
    padding: '32px 24px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
    transition: 'all 0.3s ease'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🆘</div>
    <h3 style={{ color: '#ffffff', fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
      Get Support
    </h3>
    <p style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
      Our team is here to help you with any issues.
    </p>

    <a
      href="/eSchool-SaaS-Doc/installation/help-and-support"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#10b981',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        lineHeight: '1',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      <span>Contact Support →</span>
    </a>
  </div>

</div>
