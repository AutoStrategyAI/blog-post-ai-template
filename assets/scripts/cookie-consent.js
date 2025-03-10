document.addEventListener('DOMContentLoaded', function() {
  console.log('Cookie consent script loaded');
  
  // DOM elements
  const banner = document.getElementById('cookie-consent-banner');
  const modal = document.getElementById('cookie-settings-modal');
  const settingsTrigger = document.getElementById('cookie-settings-trigger');
  
  // Checkbox elements
  const analyticsCheckbox = document.getElementById('analytics-cookies');
  const marketingCheckbox = document.getElementById('marketing-cookies');
  
  // Button elements
  const acceptAllBtn = document.getElementById('cookie-consent-accept');
  const rejectAllBtn = document.getElementById('cookie-consent-reject');
  const customizeBtn = document.getElementById('cookie-consent-customize');
  const closeModalBtn = document.getElementById('cookie-settings-close');
  const savePreferencesBtn = document.getElementById('cookie-settings-save');
  
  // Cookie consent state
  const cookieConsent = {
    necessary: true,
    analytics: false,
    marketing: false
  };
  
  // Check if consent has been given before
  const hasConsented = function() {
    return localStorage.getItem('cookieConsent') !== null;
  };
  
  // Load saved preferences
  const loadPreferences = function() {
    const saved = localStorage.getItem('cookieConsent');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        cookieConsent.analytics = parsed.analytics;
        cookieConsent.marketing = parsed.marketing;
      } catch (e) {
        console.error('Error parsing saved cookie preferences', e);
      }
    }
  };
  
  // Apply preferences
  const applyPreferences = function() {
    // Handle Google Analytics
    if (cookieConsent.analytics) {
      loadGoogleAnalytics();
    }
    
    // Handle Google Ads separately if marketing cookies are accepted
    const gaAdsEnabled = document.querySelector('meta[name="ga-ads"]')?.getAttribute('content') === 'true';
    if (cookieConsent.marketing && gaAdsEnabled && !cookieConsent.analytics) {
      // If analytics is not enabled but marketing is, we need to load Google Ads directly
      loadGoogleAds();
    }
    
    // Add class to body to indicate consent has been given
    document.body.classList.add('has-cookie-consent');
  };
  
  // Load Google Analytics and Google Ads if enabled
  const loadGoogleAnalytics = function() {
    // Check if Google Analytics is already loaded
    if (window.ga) {
      return;
    }
    
    // Get Google Analytics ID and Ads status from meta tags
    const gaId = document.querySelector('meta[name="ga-id"]')?.getAttribute('content');
    const gaAdsEnabled = document.querySelector('meta[name="ga-ads"]')?.getAttribute('content') === 'true';
    
    if (!gaId) {
      console.warn('Google Analytics ID not found');
      return;
    }
    
    // Create and append the Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.google-analytics.com/analytics.js';
    
    script.onload = function() {
      window.ga = window.ga || function() {
        (window.ga.q = window.ga.q || []).push(arguments);
      };
      window.ga.l = +new Date();
      
      window.ga('create', gaId, 'auto');
      window.ga('send', 'pageview');
      
      // Load Google Ads if enabled
      if (gaAdsEnabled) {
        loadGoogleAds();
      }
    };
    
    document.head.appendChild(script);
  };
  
  // Load Google Ads
  const loadGoogleAds = function() {
    console.log('Loading Google Ads');
    
    // Create and append the Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js';
    
    script.onload = function() {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-CONVERSION_ID'); // This would be replaced with actual conversion ID
    };
    
    document.head.appendChild(script);
  };
  
  // Show banner
  const showBanner = function() {
    if (banner) {
      banner.classList.add('visible');
    }
  };
  
  // Hide banner
  const hideBanner = function() {
    if (banner) {
      banner.classList.remove('visible');
    }
  };
  
  // Show modal
  const showModal = function() {
    // Make sure we have the latest preferences from localStorage
    loadPreferences();
    
    // Update checkboxes to reflect current state
    if (analyticsCheckbox) {
      analyticsCheckbox.checked = cookieConsent.analytics;
    }
    
    if (marketingCheckbox) {
      marketingCheckbox.checked = cookieConsent.marketing;
    }
    
    // Show modal
    if (modal) {
      modal.classList.add('visible');
    }
    
    // Hide banner
    hideBanner();
  };
  
  // Hide modal
  const hideModal = function() {
    if (modal) {
      modal.classList.remove('visible');
    }
    
    // Show the banner again if consent hasn't been given yet
    if (!hasConsented()) {
      showBanner();
    }
  };
  
  // Accept all cookies
  const acceptAll = function() {
    cookieConsent.analytics = true;
    cookieConsent.marketing = true;
    
    savePreferences(true); // Skip reading from checkboxes
    hideBanner();
    applyPreferences();
  };
  
  // Reject all optional cookies
  const rejectAll = function() {
    cookieConsent.analytics = false;
    cookieConsent.marketing = false;
    
    savePreferences(true); // Skip reading from checkboxes
    hideBanner();
    applyPreferences();
  };
  
  // Save preferences
  const savePreferences = function(skipCheckboxRead) {
    // Update consent state from checkboxes if not skipped
    if (!skipCheckboxRead) {
      if (analyticsCheckbox) {
        cookieConsent.analytics = analyticsCheckbox.checked;
      }
      
      if (marketingCheckbox) {
        cookieConsent.marketing = marketingCheckbox.checked;
      }
    }
    
    // Save to localStorage
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: cookieConsent.necessary,
      analytics: cookieConsent.analytics,
      marketing: cookieConsent.marketing,
      timestamp: new Date().toISOString()
    }));
    
    hideModal();
    applyPreferences();
  };
  
  // Set up event listeners
  if (acceptAllBtn) {
    acceptAllBtn.addEventListener('click', acceptAll);
  }
  
  if (rejectAllBtn) {
    rejectAllBtn.addEventListener('click', rejectAll);
  }
  
  if (customizeBtn) {
    customizeBtn.addEventListener('click', showModal);
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
  
  if (savePreferencesBtn) {
    savePreferencesBtn.addEventListener('click', function() {
      savePreferences(false); // Read from checkboxes
    });
  }
  
  if (settingsTrigger) {
    settingsTrigger.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent the default anchor behavior
      showModal();
    });
  }
  
  // Initialize
  loadPreferences();
  
  if (!hasConsented()) {
    console.log('No consent found, showing banner');
    showBanner();
  } else {
    console.log('Consent already given, applying preferences');
    applyPreferences();
  }
});