import React, { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    char: string;
    life: number;
    maxLife: number;
    phase: number; // for sine wave movement
}

const MAX_PARTICLES = 25;
const SPAWN_INTERVAL = 600; // ms

const ThemeEffects: React.FC = () => {
    const theme = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const frameRef = useRef<number>(0);
    const lastSpawnRef = useRef<number>(0);

    // Check reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const getParticleConfig = () => {
            switch (theme.particleType) {
                case 'petals': // Spring - cherry blossom
                    return {
                        chars: ['🌸', '🏵️', '✿', '❀'],
                        colors: ['#EC4899', '#F472B6', '#FBCFE8'],
                        sizeRange: [14, 22],
                        gravity: 0.3,
                        wind: 0.5,
                        swayAmount: 2,
                    };
                case 'sunbeams': // Summer
                    return {
                        chars: ['✦', '✧', '⊹', '˖'],
                        colors: ['#F59E0B', '#FBBF24', '#FDE68A', '#06B6D4'],
                        sizeRange: [10, 20],
                        gravity: 0.1,
                        wind: 0.2,
                        swayAmount: 1,
                    };
                case 'leaves': // Autumn
                    return {
                        chars: ['🍂', '🍁', '🍃'],
                        colors: ['#EA580C', '#F97316', '#92400E', '#DC2626'],
                        sizeRange: [16, 24],
                        gravity: 0.4,
                        wind: 1.0,
                        swayAmount: 3,
                    };
                case 'snowflakes': // Winter
                    return {
                        chars: ['❄', '❅', '❆', '✻'],
                        colors: ['#BFDBFE', '#93C5FD', '#DBEAFE', '#E2E8F0'],
                        sizeRange: [12, 22],
                        gravity: 0.2,
                        wind: 0.3,
                        swayAmount: 1.5,
                    };
                case 'sakura': // Women's Day - enhanced petals
                    return {
                        chars: ['🌸', '✨', '💜', '🏵️'],
                        colors: ['#7C3AED', '#A78BFA', '#C4B5FD', '#DDD6FE'],
                        sizeRange: [14, 24],
                        gravity: 0.35,
                        wind: 0.6,
                        swayAmount: 2.5,
                    };
                case 'fireworks': // Anniversary
                    return {
                        chars: ['✨', '⭐', '💫', '🌟', '❤️'],
                        colors: ['#DC2626', '#F59E0B', '#FBBF24', '#EF4444'],
                        sizeRange: [14, 22],
                        gravity: -0.3, // float upward
                        wind: 0.4,
                        swayAmount: 2,
                    };
                case 'balloons': // Children's Day
                    return {
                        chars: ['🎈', '🎉', '🎊', '⭐', '🌈'],
                        colors: ['#4F46E5', '#F97316', '#EC4899', '#10B981', '#F59E0B'],
                        sizeRange: [16, 26],
                        gravity: -0.4, // float upward
                        wind: 0.3,
                        swayAmount: 1.5,
                    };
                default:
                    return {
                        chars: ['❤'],
                        colors: ['#EC4899'],
                        sizeRange: [14, 20],
                        gravity: 0.3,
                        wind: 0.3,
                        swayAmount: 1.5,
                    };
            }
        };

        const config = getParticleConfig();

        const spawnParticle = (): Particle => {
            const goesUp = config.gravity < 0;
            return {
                x: Math.random() * canvas.width,
                y: goesUp ? canvas.height + 20 : -20,
                vx: (Math.random() - 0.5) * config.wind * 2,
                vy: goesUp ? -(Math.random() * 1.5 + 0.5) : Math.random() * 1.5 + 0.5,
                size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
                opacity: 0.4 + Math.random() * 0.5,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 3,
                color: config.colors[Math.floor(Math.random() * config.colors.length)],
                char: config.chars[Math.floor(Math.random() * config.chars.length)],
                life: 0,
                maxLife: 300 + Math.random() * 200,
                phase: Math.random() * Math.PI * 2,
            };
        };

        const animate = (timestamp: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn new particles
            if (timestamp - lastSpawnRef.current > SPAWN_INTERVAL && particlesRef.current.length < MAX_PARTICLES) {
                particlesRef.current.push(spawnParticle());
                lastSpawnRef.current = timestamp;
            }

            // Update & draw particles
            particlesRef.current = particlesRef.current.filter(p => {
                p.life++;

                // Apply physics
                p.vy += config.gravity * 0.01;
                p.x += p.vx + Math.sin(p.life * 0.02 + p.phase) * config.swayAmount * 0.3;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                // Fade in/out
                const lifeRatio = p.life / p.maxLife;
                if (lifeRatio < 0.1) {
                    p.opacity = (lifeRatio / 0.1) * 0.7;
                } else if (lifeRatio > 0.8) {
                    p.opacity = ((1 - lifeRatio) / 0.2) * 0.7;
                }

                // Remove if off-screen or expired
                const isOffScreen = config.gravity < 0
                    ? p.y < -50
                    : p.y > canvas.height + 50;
                if (isOffScreen || p.life > p.maxLife) return false;

                // Draw
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.font = `${p.size}px serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(p.char, 0, 0);
                ctx.restore();

                return true;
            });

            frameRef.current = requestAnimationFrame(animate);
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [theme.particleType, prefersReducedMotion]);

    if (prefersReducedMotion) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[5]"
            style={{ width: '100vw', height: '100vh' }}
            aria-hidden="true"
        />
    );
};

export default ThemeEffects;
