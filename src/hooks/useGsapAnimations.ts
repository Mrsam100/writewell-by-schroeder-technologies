/** @license SPDX-License-Identifier: Apache-2.0 */
import { useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useGsapAnimations(
  landingRef: RefObject<HTMLDivElement | null>,
  heroTextRef: RefObject<HTMLHeadingElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !landingRef.current) return;
    const ctx = gsap.context(() => {
      // Animate all sections on scroll
      gsap.utils.toArray<HTMLElement>(".gsap-reveal").forEach((el) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Stagger card animations
      gsap.utils.toArray<HTMLElement>(".gsap-stagger-parent").forEach((parent) => {
        const children = parent.querySelectorAll(".gsap-stagger-child");
        gsap.from(children, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: parent,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // Parallax elements
      gsap.utils.toArray<HTMLElement>(".gsap-parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.5");
        gsap.to(el, {
          y: () => -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Hero text reveal
      if (heroTextRef.current) {
        const chars = heroTextRef.current.querySelectorAll(".char-anim");
        gsap.from(chars, {
          y: 80,
          opacity: 0,
          rotateX: -40,
          duration: 1,
          stagger: 0.03,
          ease: "power4.out",
          delay: 0.3,
        });
      }

      // Counter animation
      gsap.utils.toArray<HTMLElement>(".gsap-counter").forEach((el) => {
        const target = parseInt(el.dataset.target || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + (el.dataset.suffix || "");
          },
        });
      });

      // Blur-in text reveals
      gsap.utils.toArray<HTMLElement>(".gsap-blur-in").forEach((el) => {
        gsap.from(el, {
          filter: "blur(10px)",
          opacity: 0,
          y: 20,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Scale-rotate entrance
      gsap.utils.toArray<HTMLElement>(".gsap-scale-rotate").forEach((el) => {
        gsap.from(el, {
          scale: 0.8,
          rotation: -5,
          opacity: 0,
          duration: 1,
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Slide in from left
      gsap.utils.toArray<HTMLElement>(".gsap-slide-left").forEach((el) => {
        gsap.from(el, {
          x: -120,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Slide in from right
      gsap.utils.toArray<HTMLElement>(".gsap-slide-right").forEach((el) => {
        gsap.from(el, {
          x: 120,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // 3D flip entrance
      gsap.utils.toArray<HTMLElement>(".gsap-flip-in").forEach((el) => {
        gsap.from(el, {
          rotateY: -90,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // Elastic scale-in
      gsap.utils.toArray<HTMLElement>(".gsap-elastic").forEach((el) => {
        gsap.from(el, {
          scale: 0,
          opacity: 0,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
        });
      });

      // ── Infinite testimonial carousel with center scaling ──
      const testimonialTrack = document.querySelector('.testimonial-track-infinite') as HTMLElement;
      if (testimonialTrack) {
        const cardW = 344; // 320px card + 24px gap
        const oneSetW = cardW * 6;

        // Start from the 2nd set so cards appear from both sides
        gsap.set(testimonialTrack, { x: -oneSetW });

        // Continuously scroll left by one set width, then seamlessly repeat
        gsap.to(testimonialTrack, {
          x: -(oneSetW * 2),
          duration: 16,
          ease: "none",
          repeat: -1,
          onUpdate() {
            const container = testimonialTrack.parentElement;
            if (!container) return;
            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.left + containerRect.width / 2;

            testimonialTrack.querySelectorAll('.testimonial-item').forEach((card) => {
              const rect = card.getBoundingClientRect();
              const cardCenter = rect.left + rect.width / 2;
              const dist = Math.abs(cardCenter - centerX);
              const maxDist = containerRect.width / 2.5;
              const proximity = Math.max(0, 1 - dist / maxDist);
              const scale = 0.78 + 0.27 * proximity;
              const opacity = 0.3 + 0.7 * proximity;

              gsap.set(card, {
                scale,
                opacity,
                zIndex: Math.round(proximity * 10),
              });
            });
          },
        });
      }
    }, landingRef);

    return () => ctx.revert();
  }, [isActive]);
}
