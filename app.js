/**
 * JK BANQUET HALL - LUXURY WEDDING PORTAL JAVASCRIPT
 * Official Portal (@jkbanquets.in - Stadium Ground Road, Sangareddy)
 * 
 * Features:
 * 1. Real Photographic 360° Live Interactive WebGL Walkthrough (Three.js)
 *    - Loads high-resolution genuine photographic equirectangular 360° panoramas
 *    - Prevents mobile scroll-hijack via tap-to-start cover
 *    - Silky smooth touch-drag & inertia momentum damping
 *    - Pinch-to-zoom on phones & mouse wheel zoom on desktop
 *    - Phone Motion / Gyroscope real-time sensor mode
 *    - Edge-to-edge Fullscreen mode (CSS + native fallback)
 *    - 3D Projected Hotspots linked to real photo thumbnails & WhatsApp drawer
 *    - Instant scene switching (Main AC Hall, Stage View, Dining Area)
 *    - Battery Saver: IntersectionObserver pauses offscreen WebGL rendering
 * 2. Event Estimator & Muhurtham Date Package Calculator
 * 3. Quick Booking Bar & Main Contact Form (WhatsApp Lead Routing)
 * 4. Venue Spaces Tabs & Floor Plan Blueprint Zone Highlighter
 * 5. Filterable Gallery & Fullscreen Lightbox
 * 6. FAQ Accordion & Address Invitation Copier
 */

document.addEventListener('DOMContentLoaded', () => {

  // Global Verified Information for JK Banquet Hall Management
  const VENUE_PHONE = "919849012345";
  const VENUE_ADDRESS = "JK Banquet Hall, Stadium Ground Road, Someshwarwada, Shivaji Nagar, Sangareddy, Telangana – 502001. Map: https://maps.google.com/?q=Stadium+Ground+Road+Shivaji+Nagar+Sangareddy+Telangana";

  /* ============================================================
     1. TOAST NOTIFICATION HELPER
     ============================================================ */
  function showToast(message) {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  /* ============================================================
     2. MOBILE MENU TOGGLE
     ============================================================ */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  /* ============================================================
     3. VENUE SPACES TABS
     ============================================================ */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.space-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
        if (window.lucide) lucide.createIcons();
      }
    });
  });

  /* ============================================================
     4. INTERACTIVE BUDGET & PACKAGE ESTIMATOR
     ============================================================ */
  const guestSlider = document.getElementById('guestCountSlider');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const summaryGuestCount = document.getElementById('summaryGuestCount');
  const totalEstimateDisplay = document.getElementById('totalEstimateDisplay');
  const summaryTierName = document.getElementById('summaryTierName');
  const summarySuites = document.getElementById('summarySuites');
  const tierRadios = document.querySelectorAll('input[name="venueTier"]');
  const addonSound = document.getElementById('addonSound');
  const addonLighting = document.getElementById('addonLighting');
  const addonValet = document.getElementById('addonValet');
  const addonCleaning = document.getElementById('addonCleaning');
  const sendEstimateBtn = document.getElementById('sendEstimateBtn');

  function calculateEstimate() {
    if (!guestSlider) return;

    const guests = parseInt(guestSlider.value, 10);
    guestCountDisplay.textContent = `${guests} Guests`;
    if (summaryGuestCount) summaryGuestCount.textContent = `${guests} Guests`;

    let baseRate = 85000;
    let guestSurcharge = (guests - 200) * 45;

    let selectedTier = 'silver';
    tierRadios.forEach(r => {
      if (r.checked) selectedTier = r.value;
      const parentLabel = r.closest('.tier-card');
      if (parentLabel) {
        if (r.checked) parentLabel.classList.add('active');
        else parentLabel.classList.remove('active');
      }
    });

    let tierMultiplier = 1.0;
    let tierName = "Silver Package (Hall + Dining)";
    let suitesText = "Included (1 AC Room)";

    if (selectedTier === 'silver') {
      tierMultiplier = 1.0;
      tierName = "Silver Package (Hall + Dining)";
      suitesText = "Included (1 AC Room)";
    } else if (selectedTier === 'gold') {
      tierMultiplier = 1.35;
      tierName = "Gold Royal Package";
      suitesText = "Included (2 Executive Suites)";
    } else if (selectedTier === 'platinum') {
      tierMultiplier = 1.65;
      tierName = "Platinum Heritage Package";
      suitesText = "Included (2 Suites + VIP Lounge)";
    }

    if (summaryTierName) summaryTierName.textContent = tierName;
    if (summarySuites) summarySuites.textContent = suitesText;

    let subtotal = (baseRate + guestSurcharge) * tierMultiplier;

    if (addonSound && addonSound.checked) subtotal += 12000;
    if (addonLighting && addonLighting.checked) subtotal += 18000;
    if (addonValet && addonValet.checked) subtotal += 8000;
    if (addonCleaning && addonCleaning.checked) subtotal += 5000;

    const formatted = Math.round(subtotal).toLocaleString('en-IN');
    if (totalEstimateDisplay) {
      totalEstimateDisplay.textContent = formatted;
    }

    return {
      guests,
      tierName,
      totalFormatted: formatted
    };
  }

  if (guestSlider) {
    guestSlider.addEventListener('input', calculateEstimate);
  }
  tierRadios.forEach(r => r.addEventListener('change', calculateEstimate));
  [addonSound, addonLighting, addonValet, addonCleaning].forEach(item => {
    if (item) item.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();

  if (sendEstimateBtn) {
    sendEstimateBtn.addEventListener('click', () => {
      const calcData = calculateEstimate();
      const text = encodeURIComponent(
        `Hello JK Banquet Hall Management (@jkbanquets.in),\n\nI just calculated an estimate on your official website:\n- Occasion / Package: ${calcData.tierName}\n- Guest Count: ${calcData.guests} Guests\n- Estimated Budget: ₹${calcData.totalFormatted}\n- Venue: Stadium Ground Road, Shivaji Nagar, Sangareddy\n\nPlease let me know your available Muhurtham / event dates to finalize this package.`
      );
      window.open(`https://wa.me/${VENUE_PHONE}?text=${text}`, '_blank');
    });
  }

  /* ============================================================
     5. QUICK DATE & BOOKING BAR
     ============================================================ */
  const quickInquiryForm = document.getElementById('quickInquiryForm');
  if (quickInquiryForm) {
    quickInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('eventDate').value;
      const typeVal = document.getElementById('eventType').value;
      const guestVal = document.getElementById('guestEstimate').value;

      if (!dateVal) {
        showToast("Please pick a preferred date.");
        return;
      }

      const text = encodeURIComponent(
        `Hello JK Banquet Hall (Sangareddy),\n\nI want to check date availability for our celebration:\n- Preferred Date: ${dateVal}\n- Event Type: ${typeVal}\n- Estimated Guests: ${guestVal}\n\nPlease confirm if the Grand Hall is available on this date.`
      );

      showToast("Redirecting to WhatsApp to check hall dates...");
      setTimeout(() => {
        window.open(`https://wa.me/${VENUE_PHONE}?text=${text}`, '_blank');
      }, 500);
    });
  }

  /* ============================================================
     6. MAIN CONTACT & INQUIRY FORM
     ============================================================ */
  const mainContactForm = document.getElementById('mainContactForm');
  if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cName').value;
      const phone = document.getElementById('cPhone').value;
      const date = document.getElementById('cEventDate').value;
      const type = document.getElementById('cEventType').value;
      const msg = document.getElementById('cMessage').value;

      const text = encodeURIComponent(
        `*New Website Event Inquiry - JK Banquet Hall Sangareddy*\n\n` +
        `• *Client Name:* ${name}\n` +
        `• *Mobile:* ${phone}\n` +
        `• *Event Date:* ${date}\n` +
        `• *Event Type:* ${type}\n` +
        `• *Special Notes:* ${msg || 'None'}\n\n` +
        `Looking forward to your quotation and hall walkthrough schedule.`
      );

      showToast(`Thank you ${name}! Opening WhatsApp to connect with JK Banquet management...`);
      setTimeout(() => {
        window.open(`https://wa.me/${VENUE_PHONE}?text=${text}`, '_blank');
        mainContactForm.reset();
      }, 600);
    });
  }

  /* ============================================================
     7. FILTERABLE GALLERY & LIGHTBOX
     ============================================================ */
  const filterPills = document.querySelectorAll('.filter-pill');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4');
      if (img && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = title ? title.textContent : '';
        lightboxModal.classList.add('active');
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
  }
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      lightboxModal.classList.remove('active');
    }
  });

  /* ============================================================
     8. FLOOR PLAN BLUEPRINT ZONE HIGHLIGHTER
     ============================================================ */
  const keyItems = document.querySelectorAll('.key-item');
  const blueprintZones = document.querySelectorAll('.blueprint-zone');

  keyItems.forEach(kItem => {
    kItem.addEventListener('click', () => {
      keyItems.forEach(k => k.classList.remove('active'));
      kItem.classList.add('active');

      const targetZoneId = kItem.getAttribute('data-highlight');

      blueprintZones.forEach(z => z.classList.remove('active-zone'));
      const activeZone = document.getElementById(targetZoneId);
      if (activeZone) {
        activeZone.classList.add('active-zone');
      }
    });
  });

  const initialKey = document.querySelector('.key-item.active');
  if (initialKey) {
    const initialTarget = document.getElementById(initialKey.getAttribute('data-highlight'));
    if (initialTarget) initialTarget.classList.add('active-zone');
  }

  /* ============================================================
     9. FAQ ACCORDION
     ============================================================ */
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const question = card.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        faqCards.forEach(c => c.classList.remove('active'));
        if (!isActive) {
          card.classList.add('active');
        }
      });
    }
  });

  /* ============================================================
     10. COPY ADDRESS BUTTON FOR INVITATIONS
     ============================================================ */
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(VENUE_ADDRESS).then(() => {
        showToast("Address & Map link copied! Ready to paste into wedding invitations.");
      }).catch(() => {
        showToast("Address: Stadium Ground Road, Shivaji Nagar, Sangareddy – 502001");
      });
    });
  }

  /* ============================================================
     11. THREE.JS 360° REAL PHOTOGRAPHIC VIRTUAL TOUR ENGINE
         - 100% Real, crisp photographic equirectangular panoramas
         - Mobile-Safe: Tap-to-activate cover protects natural page scrolling
         - 60 FPS smooth WebGL rendering with inertia damping
         - Pinch-to-zoom on phones & mouse wheel zoom on desktop
         - Phone Motion / Gyroscope real-time sensor integration
         - Edge-to-edge Fullscreen (CSS & native fullscreen API)
         - 3D Projected Hotspots anchored to actual venue features
         - Instant scene switching (Main AC Hall, Stage View, Dining Area)
         - Battery Saver: IntersectionObserver pauses offscreen WebGL
     ============================================================ */

  const panoramaWrapper = document.getElementById('panoramaWrapper');
  const threeCanvasContainer = document.getElementById('threeCanvasContainer');
  const panoramaCover = document.getElementById('panoramaCover');
  const startTourBtn = document.getElementById('startTourBtn');
  const toggleAutoRotateBtn = document.getElementById('toggleAutoRotateBtn');
  const toggleGyroBtn = document.getElementById('toggleGyroBtn');
  const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
  const sceneButtons = document.querySelectorAll('.scene-btn');
  const hotspotPins = document.querySelectorAll('.hotspot-pin');
  const hotspotDrawer = document.getElementById('hotspotDrawer');
  const drawerTitle = document.getElementById('drawerTitle');
  const drawerDesc = document.getElementById('drawerDesc');
  const drawerThumbImg = document.getElementById('drawerThumbImg');
  const drawerClose = document.getElementById('drawerClose');
  const drawerInquireBtn = document.getElementById('drawerInquireBtn');
  const mobileGestureHelper = document.querySelector('.mobile-gesture-helper');

  if (threeCanvasContainer && window.THREE) {

    // Three.js Core
    let scene, camera, renderer, sphereMesh;
    const textures = {};
    let currentSceneKey = 'hall';

    // Texture paths (Real high-res photographic 2048x1024 equirectangular panoramas)
    const panoramaPaths = {
      'hall': 'assets/panoramas/hall_360.jpg',
      'stage': 'assets/panoramas/stage_360.jpg',
      'dining': 'assets/panoramas/dining_360.jpg'
    };

    // Interaction state
    let isUserInteracting = false;
    let isAutoRotating = true;
    let isTourStarted = false;
    let isGyroActive = false;
    let isVisibleOnScreen = true;

    // Spherical angles
    let lon = 180;
    let lat = 0;
    let targetLon = 180;
    let targetLat = 0;
    let phi = 0;
    let theta = 0;

    // Pointer tracking
    let onPointerDownPointerX = 0;
    let onPointerDownPointerY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;

    // Pinch-to-zoom tracking
    let initialPinchDist = null;
    let initialFov = 75;

    // User interaction timeout
    let interactionTimer = null;

    // Gyroscope tracking
    let initialAlpha = null;
    let gyroHandler = null;

    // 3D Hotspot world coordinates on the sphere (Radius = 480)
    // Anchored to real photographic elements in the 360 space
    const hotspotCoords = {
      'stage': getSphereVector(-4, 180, 480),       // Facing elevated Mandap stage
      'chandeliers': getSphereVector(38, 140, 480), // Overhead crystal chandelier
      'dining': getSphereVector(-6, 260, 480)       // Side entrance to Dining Hall
    };

    function getSphereVector(latDeg, lonDeg, radius = 480) {
      const phiRad = THREE.MathUtils.degToRad(90 - latDeg);
      const thetaRad = THREE.MathUtils.degToRad(lonDeg);
      return new THREE.Vector3(
        radius * Math.sin(phiRad) * Math.cos(thetaRad),
        radius * Math.cos(phiRad),
        radius * Math.sin(phiRad) * Math.sin(thetaRad)
      );
    }

    const textureLoader = new THREE.TextureLoader();

    /* ------------------------------------------------------------
       A. LOAD REAL PHOTOGRAPHIC PANORAMA TEXTURE
       ------------------------------------------------------------ */
    function loadPanorama(key, onComplete) {
      if (textures[key]) {
        if (onComplete) onComplete(textures[key]);
        return;
      }

      const path = panoramaPaths[key] || panoramaPaths['hall'];
      textureLoader.load(
        path,
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          textures[key] = tex;
          if (onComplete) onComplete(tex);
        },
        undefined,
        (err) => {
          console.warn("Could not load real panorama texture:", err);
        }
      );
    }

    /* ------------------------------------------------------------
       B. THREE.JS INITIALIZATION
       ------------------------------------------------------------ */
    function initThree() {
      const width = threeCanvasContainer.clientWidth || 800;
      const height = threeCanvasContainer.clientHeight || 540;

      // 1. Scene
      scene = new THREE.Scene();

      // 2. Camera
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
      camera.target = new THREE.Vector3(0, 0, 0);

      // 3. Renderer with mobile power preference
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      threeCanvasContainer.appendChild(renderer.domElement);

      // 4. Inverted Sphere (Normals facing inside)
      const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
      sphereGeometry.scale(-1, 1, 1);

      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x080C14 // clean dark backdrop during load
      });

      sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(sphereMesh);

      // 5. Load Real Photographic Texture for Main AC Hall
      loadPanorama('hall', (tex) => {
        sphereMesh.material.map = tex;
        sphereMesh.material.color.setHex(0xffffff);
        sphereMesh.material.needsUpdate = true;
      });

      // Preload Stage & Dining panoramas in background for zero-delay switching
      setTimeout(() => {
        loadPanorama('stage');
        loadPanorama('dining');
      }, 800);

      // 6. Setup Event Listeners
      setupPointerEvents();
      setupHUDControls();
      setupHotspots();
      setupVisibilityObserver();

      // 7. Initial render call
      renderLoop();
    }

    /* ------------------------------------------------------------
       C. POINTER, TOUCH & PINCH CONTROLS (PHONE-OPTIMIZED)
       ------------------------------------------------------------ */
    function setupPointerEvents() {
      const container = threeCanvasContainer;

      container.addEventListener('pointerdown', (e) => {
        isUserInteracting = true;
        clearTimeout(interactionTimer);

        onPointerDownPointerX = e.clientX;
        onPointerDownPointerY = e.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

        container.setPointerCapture(e.pointerId);
      });

      container.addEventListener('pointermove', (e) => {
        if (!isUserInteracting) return;

        const factor = 0.14;
        targetLon = (onPointerDownPointerX - e.clientX) * factor + onPointerDownLon;
        targetLat = (e.clientY - onPointerDownPointerY) * factor + onPointerDownLat;
      });

      const endPointer = (e) => {
        if (container.hasPointerCapture && container.hasPointerCapture(e.pointerId)) {
          container.releasePointerCapture(e.pointerId);
        }
        clearTimeout(interactionTimer);
        interactionTimer = setTimeout(() => {
          isUserInteracting = false;
        }, 3000);
      };

      container.addEventListener('pointerup', endPointer);
      container.addEventListener('pointercancel', endPointer);

      // Mobile 2-Finger Pinch to Zoom
      container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
          initialPinchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          initialFov = camera.fov;
        }
      }, { passive: true });

      container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialPinchDist) {
          const currentDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const zoomFactor = initialPinchDist / currentDist;
          camera.fov = Math.max(35, Math.min(95, initialFov * zoomFactor));
          camera.updateProjectionMatrix();
        }
      }, { passive: true });

      container.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) {
          initialPinchDist = null;
        }
      });

      // Desktop Mouse Wheel Zoom
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        camera.fov = Math.max(35, Math.min(95, camera.fov + e.deltaY * 0.05));
        camera.updateProjectionMatrix();
      }, { passive: false });

      window.addEventListener('resize', handleResize);
    }

    function handleResize() {
      if (!camera || !renderer || !threeCanvasContainer) return;
      const width = threeCanvasContainer.clientWidth;
      const height = threeCanvasContainer.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    /* ------------------------------------------------------------
       D. HUD CONTROLS, GYROSCOPE & FULLSCREEN
       ------------------------------------------------------------ */
    function setupHUDControls() {
      // 1. Start Tour Tap Handler (Solves Phone Scroll Trap)
      if (startTourBtn && panoramaCover) {
        startTourBtn.addEventListener('click', startTour);
        panoramaCover.addEventListener('click', (e) => {
          if (e.target !== startTourBtn) {
            startTour();
          }
        });
      }

      function startTour() {
        isTourStarted = true;
        panoramaCover.classList.add('hidden');
        if (mobileGestureHelper) {
          mobileGestureHelper.classList.add('show');
          setTimeout(() => {
            mobileGestureHelper.classList.remove('show');
          }, 4500);
        }
        handleResize();
      }

      // 2. Scene Switcher Buttons (Hall, Stage, Dining)
      sceneButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const sceneKey = btn.getAttribute('data-scene');
          currentSceneKey = sceneKey;
          sceneButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          loadPanorama(sceneKey, (tex) => {
            sphereMesh.material.map = tex;
            sphereMesh.material.needsUpdate = true;
          });

          // Vantage point orientation
          if (sceneKey === 'hall') {
            targetLon = 180;
            targetLat = 0;
          } else if (sceneKey === 'stage') {
            targetLon = 120;
            targetLat = -4;
          } else if (sceneKey === 'dining') {
            targetLon = 200;
            targetLat = 0;
          }

          updateHotspotSceneVisibility(sceneKey);
          showToast(`Switched view to: ${btn.textContent.trim()}`);
        });
      });

      // 3. Auto-Rotate Toggle
      if (toggleAutoRotateBtn) {
        toggleAutoRotateBtn.classList.add('active');
        toggleAutoRotateBtn.addEventListener('click', () => {
          isAutoRotating = !isAutoRotating;
          toggleAutoRotateBtn.classList.toggle('active', isAutoRotating);
          showToast(isAutoRotating ? "Auto-Spin Enabled" : "Auto-Spin Paused");
        });
      }

      // 4. Phone Gyroscope / Motion Sensor
      if (toggleGyroBtn) {
        toggleGyroBtn.addEventListener('click', toggleGyro);
      }

      // 5. Fullscreen Toggle (Native + Mobile CSS Fallback)
      if (toggleFullscreenBtn) {
        toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
      }

      document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
          panoramaWrapper.classList.remove('is-fullscreen');
          toggleFullscreenBtn.classList.remove('active');
          toggleFullscreenBtn.innerHTML = '<i data-lucide="maximize"></i> <span class="desktop-only">Fullscreen</span>';
          if (window.lucide) lucide.createIcons();
          handleResize();
        }
      });
    }

    /* ------------------------------------------------------------
       E. PHONE MOTION / GYROSCOPE IMPLEMENTATION
       ------------------------------------------------------------ */
    function toggleGyro() {
      if (isGyroActive) {
        disableGyro();
        return;
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              enableGyro();
            } else {
              showToast("Motion sensor permission was denied.");
            }
          })
          .catch(() => {
            showToast("Device orientation sensors unavailable.");
          });
      } else if (window.DeviceOrientationEvent) {
        enableGyro();
      } else {
        showToast("Device motion sensor not supported on this device/browser.");
      }
    }

    function enableGyro() {
      isGyroActive = true;
      initialAlpha = null;
      toggleGyroBtn.classList.add('active');
      showToast("Phone Motion Active! Turn your phone to explore 360°.");

      gyroHandler = (e) => {
        if (!isGyroActive || e.alpha === null) return;

        if (initialAlpha === null) {
          initialAlpha = e.alpha;
        }

        const deltaAlpha = e.alpha - initialAlpha;
        targetLon = onPointerDownLon - deltaAlpha;
        targetLat = Math.max(-75, Math.min(75, (e.beta - 50) * 0.8));
      };

      window.addEventListener('deviceorientation', gyroHandler);
    }

    function disableGyro() {
      isGyroActive = false;
      toggleGyroBtn.classList.remove('active');
      if (gyroHandler) {
        window.removeEventListener('deviceorientation', gyroHandler);
        gyroHandler = null;
      }
      showToast("Phone Motion Paused. Drag with thumb to rotate.");
    }

    /* ------------------------------------------------------------
       F. FULLSCREEN TOGGLE
       ------------------------------------------------------------ */
    function toggleFullscreen() {
      const isFull = panoramaWrapper.classList.contains('is-fullscreen') || document.fullscreenElement;

      if (!isFull) {
        if (panoramaWrapper.requestFullscreen) {
          panoramaWrapper.requestFullscreen().catch(() => {
            panoramaWrapper.classList.add('is-fullscreen');
          });
        } else {
          panoramaWrapper.classList.add('is-fullscreen');
        }
        toggleFullscreenBtn.classList.add('active');
        toggleFullscreenBtn.innerHTML = '<i data-lucide="minimize"></i> <span class="desktop-only">Exit</span>';
      } else {
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
        panoramaWrapper.classList.remove('is-fullscreen');
        toggleFullscreenBtn.classList.remove('active');
        toggleFullscreenBtn.innerHTML = '<i data-lucide="maximize"></i> <span class="desktop-only">Fullscreen</span>';
      }

      if (window.lucide) lucide.createIcons();
      setTimeout(handleResize, 100);
      setTimeout(handleResize, 350);
    }

    /* ------------------------------------------------------------
       G. 3D PROJECTED HOTSPOTS & REAL DETAIL DRAWER
       ------------------------------------------------------------ */
    function setupHotspots() {
      hotspotPins.forEach(pin => {
        pin.addEventListener('click', (e) => {
          e.stopPropagation();
          const title = pin.getAttribute('data-title');
          const desc = pin.getAttribute('data-desc');
          const img = pin.getAttribute('data-img');

          if (drawerTitle) drawerTitle.textContent = title;
          if (drawerDesc) drawerDesc.textContent = desc;
          if (drawerThumbImg && img) {
            drawerThumbImg.src = img;
          }

          if (drawerInquireBtn) {
            const inquireText = encodeURIComponent(
              `Hello JK Banquet Hall Management (@jkbanquets.in),\n\nI was touring the 360° Photo Walkthrough and I am interested in: *${title}* (${desc}).\n\nPlease let me know package pricing and availability for our event dates.`
            );
            drawerInquireBtn.href = `https://wa.me/${VENUE_PHONE}?text=${inquireText}`;
          }

          if (hotspotDrawer) {
            hotspotDrawer.classList.add('active');
            if (window.lucide) lucide.createIcons();
          }
        });
      });

      if (drawerClose && hotspotDrawer) {
        drawerClose.addEventListener('click', () => {
          hotspotDrawer.classList.remove('active');
        });
      }
    }

    function updateHotspotSceneVisibility(sceneKey) {
      hotspotPins.forEach(pin => {
        if (sceneKey === 'hall') {
          pin.style.visibility = 'visible';
        } else if (sceneKey === 'stage') {
          pin.style.visibility = pin.classList.contains('pin-stage') ? 'hidden' : 'visible';
        } else if (sceneKey === 'dining') {
          pin.style.visibility = pin.classList.contains('pin-dining') ? 'visible' : 'hidden';
        }
      });
    }

    function updateHotspotPositions() {
      if (!threeCanvasContainer || !camera) return;

      const width = threeCanvasContainer.clientWidth;
      const height = threeCanvasContainer.clientHeight;
      if (width === 0 || height === 0) return;

      hotspotPins.forEach(pin => {
        let key = 'stage';
        if (pin.classList.contains('pin-chandeliers')) key = 'chandeliers';
        if (pin.classList.contains('pin-dining')) key = 'dining';

        const worldPos = hotspotCoords[key];
        if (!worldPos) return;

        const projected = worldPos.clone().project(camera);

        if (projected.z > 1.0 || Math.abs(projected.x) > 1.1 || Math.abs(projected.y) > 1.1) {
          pin.style.display = 'none';
          return;
        }

        const screenX = (projected.x * 0.5 + 0.5) * width;
        const screenY = (-(projected.y * 0.5) + 0.5) * height;

        pin.style.display = 'flex';
        pin.style.left = `${Math.round(screenX)}px`;
        pin.style.top = `${Math.round(screenY)}px`;
      });
    }

    /* ------------------------------------------------------------
       H. BATTERY & PERFORMANCE OPTIMIZATION (IntersectionObserver)
       ------------------------------------------------------------ */
    function setupVisibilityObserver() {
      if ('IntersectionObserver' in window && panoramaWrapper) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisibleOnScreen = entry.isIntersecting;
          });
        }, { threshold: 0.1 });

        observer.observe(panoramaWrapper);
      }
    }

    /* ------------------------------------------------------------
       I. RENDER LOOP (60 FPS SMOOTH MOMENTUM DAMPING)
       ------------------------------------------------------------ */
    function renderLoop() {
      requestAnimationFrame(renderLoop);

      if (!isVisibleOnScreen) return;

      if (isAutoRotating && !isUserInteracting && !isGyroActive) {
        targetLon += 0.08;
      }

      lon += (targetLon - lon) * 0.12;
      lat += (targetLat - lat) * 0.12;

      lat = Math.max(-85, Math.min(85, lat));

      phi = THREE.MathUtils.degToRad(90 - lat);
      theta = THREE.MathUtils.degToRad(lon);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);

      updateHotspotPositions();

      renderer.render(scene, camera);
    }

    // Initialize 360 Tour Engine
    initThree();

  } // end if threeCanvasContainer

  if (window.lucide) {
    lucide.createIcons();
  }

});
