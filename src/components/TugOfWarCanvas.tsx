import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface TugOfWarCanvasProps {
  scoreA: number; // Left side (Player 1 / Team A)
  scoreB: number; // Right side (Player 2 / Computer / Team B)
  nameA?: string;
  nameB?: string;
  teamAColor?: string; // e.g. '#2563EB'
  teamBColor?: string; // e.g. '#DC2626'
  isGameOver?: boolean;
  winner?: 'A' | 'B' | 'DRAW' | null;
  pullCountA?: number; // increments on correct answer
  pullCountB?: number;
  hideHUD?: boolean; // When true (e.g. on TitleScreen), hides team names, scores and tension gauge
}

export const TugOfWarCanvas: React.FC<TugOfWarCanvasProps> = ({
  scoreA,
  scoreB,
  nameA = 'Tim A',
  nameB = 'Tim B',
  teamAColor = '#2563EB',
  teamBColor = '#DC2626',
  isGameOver = false,
  winner = null,
  pullCountA = 0,
  pullCountB = 0,
  hideHUD = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Keep latest mutable props in ref for animation loop
  const propsRef = useRef({
    scoreA,
    scoreB,
    nameA,
    nameB,
    teamAColor,
    teamBColor,
    isGameOver,
    winner,
    pullCountA,
    pullCountB,
    hideHUD,
  });

  useEffect(() => {
    propsRef.current = {
      scoreA,
      scoreB,
      nameA,
      nameB,
      teamAColor,
      teamBColor,
      isGameOver,
      winner,
      pullCountA,
      pullCountB,
      hideHUD,
    };
  }, [scoreA, scoreB, nameA, nameB, teamAColor, teamBColor, isGameOver, winner, pullCountA, pullCountB, hideHUD]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#7DD3FC'); // Sky blue
    scene.fog = new THREE.FogExp2('#BAE6FD', 0.012);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 3.6, 8.8);
    camera.lookAt(0, 1.25, 0);

    // RENDERER
    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    const renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTS
    const hemiLight = new THREE.HemisphereLight('#FFFFFF', '#4ADE80', 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight('#FFFBEB', 1.5);
    dirLight.position.set(6, 12, 7);
    dirLight.castShadow = !isHeadless;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 30;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // GROUND & ARENA MARKINGS
    const groundGeo = new THREE.PlaneGeometry(40, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: '#4ADE80', // Vibrant green grass
      roughness: 0.82,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Little colorful flower blossoms scattered on the grass
    const flowerGeo = new THREE.CircleGeometry(0.06, 6);
    const flowerMats = [
      new THREE.MeshBasicMaterial({ color: '#FEF08A' }), // Yellow buttercup
      new THREE.MeshBasicMaterial({ color: '#FFFFFF' }), // White daisy
      new THREE.MeshBasicMaterial({ color: '#F472B6' }), // Pink wildflower
      new THREE.MeshBasicMaterial({ color: '#67E8F9' }), // Blue forget-me-not
    ];
    const flowerPositions = [
      [-3.2, -1.8], [-1.8, -2.4], [1.5, -2.2], [3.5, -1.9],
      [-4.0, 1.8], [-2.1, 2.3], [2.2, 2.1], [4.1, 1.7],
      [-0.8, -2.8], [0.8, -2.6], [-0.5, 2.5], [0.6, 2.7]
    ];
    flowerPositions.forEach(([fx, fz], i) => {
      const flower = new THREE.Mesh(flowerGeo, flowerMats[i % flowerMats.length]);
      flower.rotation.x = -Math.PI / 2;
      flower.position.set(fx, 0.012, fz);
      scene.add(flower);
    });

    // Center pitch chalk line (Chalk white with center circle)
    const centerLineGeo = new THREE.PlaneGeometry(0.14, 10);
    const centerLineMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.9 });
    const centerLine = new THREE.Mesh(centerLineGeo, centerLineMat);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.015, 0);
    scene.add(centerLine);

    const centerRingGeo = new THREE.RingGeometry(0.9, 1.0, 32);
    const centerRing = new THREE.Mesh(centerRingGeo, centerLineMat);
    centerRing.rotation.x = -Math.PI / 2;
    centerRing.position.set(0, 0.016, 0);
    scene.add(centerRing);

    // Left victory line
    const winLineAGeo = new THREE.PlaneGeometry(0.1, 10);
    const winLineAMat = new THREE.MeshBasicMaterial({ color: '#3B82F6', transparent: true, opacity: 0.8 });
    const winLineA = new THREE.Mesh(winLineAGeo, winLineAMat);
    winLineA.rotation.x = -Math.PI / 2;
    winLineA.position.set(-2.5, 0.015, 0);
    scene.add(winLineA);

    // Right victory line
    const winLineBGeo = new THREE.PlaneGeometry(0.1, 10);
    const winLineBMat = new THREE.MeshBasicMaterial({ color: '#EF4444', transparent: true, opacity: 0.8 });
    const winLineB = new THREE.Mesh(winLineBGeo, winLineBMat);
    winLineB.rotation.x = -Math.PI / 2;
    winLineB.position.set(2.5, 0.015, 0);
    scene.add(winLineB);

    // Sideline Festive Stakes & Colorful Pennant Bunting
    const stakeGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.3, 8);
    const stakeMat = new THREE.MeshStandardMaterial({ color: '#B45309', roughness: 0.7 });
    const flagGeo = new THREE.ConeGeometry(0.22, 0.4, 3);
    const flagColors = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

    [-3.0, -1.5, 0, 1.5, 3.0].forEach((xPos, idx) => {
      [-3.4, 3.4].forEach((zPos) => {
        const stake = new THREE.Mesh(stakeGeo, stakeMat);
        stake.position.set(xPos, 0.65, zPos);
        stake.castShadow = true;
        scene.add(stake);

        const flagMat = new THREE.MeshStandardMaterial({
          color: flagColors[idx % flagColors.length],
          roughness: 0.4,
        });
        const flag = new THREE.Mesh(flagGeo, flagMat);
        flag.rotation.z = Math.PI / 2;
        flag.position.set(xPos, 1.35, zPos);
        scene.add(flag);
      });
    });

    // Background stylized procedural trees
    const treeTrunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.4, 8);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.9 });
    const treeFoliageGeo = new THREE.DodecahedronGeometry(1.1);
    const treeFoliageMat1 = new THREE.MeshStandardMaterial({ color: '#15803D', roughness: 0.8 });
    const treeFoliageMat2 = new THREE.MeshStandardMaterial({ color: '#16A34A', roughness: 0.8 });

    const treePositions = [
      [-9, -5], [-6, -6.5], [-3, -7], [3, -7], [6, -6.5], [9, -5],
      [-10, 5], [10, 5], [-7, 6], [7, 6]
    ];
    treePositions.forEach(([tx, tz], i) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, 0, tz);

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 0.7;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliage = new THREE.Mesh(treeFoliageGeo, i % 2 === 0 ? treeFoliageMat1 : treeFoliageMat2);
      foliage.position.y = 1.9;
      foliage.scale.set(1, 1.2, 1);
      foliage.castShadow = true;
      treeGroup.add(foliage);

      scene.add(treeGroup);
    });

    // ROPE ASSEMBLY
    const ropeGroup = new THREE.Group();
    scene.add(ropeGroup);

    // Main thick natural hemp rope
    const ropeGeo = new THREE.CylinderGeometry(0.048, 0.048, 11.5, 16);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: '#D97706', // Golden brown natural fiber rope
      roughness: 0.95,
      metalness: 0.05,
    });
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    rope.rotation.z = Math.PI / 2;
    rope.position.y = 0.92;
    rope.castShadow = true;
    ropeGroup.add(rope);

    // Center Marker: Vibrant Crimson Ribbon with Golden Ring & Tassels
    const markerRingGeo = new THREE.TorusGeometry(0.12, 0.035, 8, 16);
    const markerRingMat = new THREE.MeshStandardMaterial({ color: '#FACC15', metalness: 0.7, roughness: 0.3 });
    const markerRing = new THREE.Mesh(markerRingGeo, markerRingMat);
    markerRing.position.set(0, 0.92, 0);
    ropeGroup.add(markerRing);

    const ribbonGeo = new THREE.BoxGeometry(0.12, 0.45, 0.12);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: '#EF4444',
      roughness: 0.35,
      metalness: 0.1,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0, 0.7, 0);
    ribbon.castShadow = true;
    ropeGroup.add(ribbon);

    // Golden Tassel at ribbon bottom
    const tasselGeo = new THREE.ConeGeometry(0.08, 0.18, 8);
    const tasselMat = new THREE.MeshStandardMaterial({ color: '#FBBF24', roughness: 0.4 });
    const tassel = new THREE.Mesh(tasselGeo, tasselMat);
    tassel.rotation.x = Math.PI;
    tassel.position.set(0, 0.42, 0);
    ropeGroup.add(tassel);

    // =========================================================================
    // HIGH-CHARM COLORFUL CARTOON AVATARS (Saling Berhadapan & Lebih Menarik)
    // =========================================================================
    interface CartoonAvatar {
      group: THREE.Group;
      torso: THREE.Mesh;
      head: THREE.Mesh;
      armL: THREE.Mesh;
      armR: THREE.Mesh;
      jerseyMat: THREE.MeshStandardMaterial;
      initialX: number;
      role: number;
    }

    const skinTones = ['#FED7AA', '#FCD34D', '#F59E0B']; // Diverse warm skin tones
    const irisColors = ['#0284C7', '#D97706', '#059669', '#7C3AED']; // Expressive anime eye iris colors

    const createColorfulAvatar = (
      isLeft: boolean,
      roleIndex: number, // 0 = Captain/Front, 1 = Middle, 2 = Anchor/Back
      primaryColorHex: string,
      accentColorHex: string
    ): CartoonAvatar => {
      const charGroup = new THREE.Group();

      // Shadow blob on ground
      const shadowGeo = new THREE.CircleGeometry(0.44, 16);
      const shadowMat = new THREE.MeshBasicMaterial({ color: '#14532D', transparent: true, opacity: 0.38 });
      const shadow = new THREE.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.012;
      charGroup.add(shadow);

      // Colorful Athletic Sneakers (Two-tone with thick white traction sole)
      const shoeSoleGeo = new THREE.BoxGeometry(0.2, 0.08, 0.36);
      const shoeSoleMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.5 }); // White grip sole

      const shoeUpperGeo = new THREE.BoxGeometry(0.19, 0.12, 0.32);
      const shoeUpperMat = new THREE.MeshStandardMaterial({
        color: roleIndex === 0 ? accentColorHex : primaryColorHex,
        roughness: 0.5,
      });

      // Left Shoe
      const shoeL = new THREE.Group();
      shoeL.position.set(-0.16, 0.08, isLeft ? 0.12 : -0.12);
      const soleL = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
      soleL.position.y = -0.04;
      soleL.castShadow = true;
      const upperL = new THREE.Mesh(shoeUpperGeo, shoeUpperMat);
      upperL.position.y = 0.04;
      upperL.castShadow = true;
      shoeL.add(soleL);
      shoeL.add(upperL);
      charGroup.add(shoeL);

      // Right Shoe
      const shoeR = new THREE.Group();
      shoeR.position.set(0.16, 0.08, isLeft ? -0.15 : 0.15);
      const soleR = new THREE.Mesh(shoeSoleGeo, shoeSoleMat);
      soleR.position.y = -0.04;
      soleR.castShadow = true;
      const upperR = new THREE.Mesh(shoeUpperGeo, shoeUpperMat);
      upperR.position.y = 0.04;
      upperR.castShadow = true;
      shoeR.add(soleR);
      shoeR.add(upperR);
      charGroup.add(shoeR);

      // Legs / Sporty Shorts with Athletic Racing Stripes
      const legGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.52, 10);
      const shortsMat = new THREE.MeshStandardMaterial({
        color: isLeft ? '#1E3A8A' : '#18181B', // Dark athletic shorts
        roughness: 0.65,
      });

      const legL = new THREE.Mesh(legGeo, shortsMat);
      legL.position.set(-0.16, 0.36, isLeft ? 0.08 : -0.08);
      legL.rotation.z = isLeft ? 0.2 : -0.2;
      legL.castShadow = true;
      charGroup.add(legL);

      const legR = new THREE.Mesh(legGeo, shortsMat);
      legR.position.set(0.16, 0.36, isLeft ? -0.1 : 0.1);
      legR.rotation.z = isLeft ? -0.2 : 0.2;
      legR.castShadow = true;
      charGroup.add(legR);

      // Torso / Vibrant Jersey
      const torsoGeo = new THREE.CapsuleGeometry(0.25, 0.44, 8, 12);
      const jerseyMat = new THREE.MeshStandardMaterial({
        color: primaryColorHex,
        roughness: 0.45,
        metalness: 0.05,
      });
      const torso = new THREE.Mesh(torsoGeo, jerseyMat);
      torso.position.set(0, 0.88, 0);
      torso.castShadow = true;
      charGroup.add(torso);

      // Crisp White Collar Accent
      const collarGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 16);
      const collarMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });
      const collar = new THREE.Mesh(collarGeo, collarMat);
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 1.15, 0);
      charGroup.add(collar);

      // Jersey Chest Star / Emblem badge
      const badgeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.03);
      const badgeMat = new THREE.MeshStandardMaterial({ color: '#FACC15', metalness: 0.6, roughness: 0.2 });
      const badge = new THREE.Mesh(badgeGeo, badgeMat);
      badge.position.set(0, 0.95, isLeft ? 0.22 : -0.22);
      charGroup.add(badge);

      // Head
      const skinColor = skinTones[roleIndex % skinTones.length];
      const headGeo = new THREE.SphereGeometry(0.26, 20, 20);
      const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.55 });
      const head = new THREE.Mesh(headGeo, skinMat);
      head.position.set(0, 1.38, 0);
      head.castShadow = true;
      charGroup.add(head);

      // Rosy Blushing Cheeks (Cute charm discs)
      const blushGeo = new THREE.CircleGeometry(0.045, 12);
      const blushMat = new THREE.MeshBasicMaterial({ color: '#FDA4AF', transparent: true, opacity: 0.75 });
      const blushL = new THREE.Mesh(blushGeo, blushMat);
      blushL.position.set(isLeft ? 0.16 : -0.16, 1.32, 0.22);
      blushL.rotation.y = isLeft ? 0.4 : -0.4;
      head.add(blushL);

      const blushR = new THREE.Mesh(blushGeo, blushMat);
      blushR.position.set(isLeft ? 0.24 : -0.05, 1.32, 0.12);
      blushR.rotation.y = isLeft ? 0.8 : -0.8;
      head.add(blushR);

      // Cute Smile / Mouth
      const mouthGeo = new THREE.TorusGeometry(0.045, 0.012, 6, 8, Math.PI);
      const mouthMat = new THREE.MeshBasicMaterial({ color: '#991B1B' });
      const mouth = new THREE.Mesh(mouthGeo, mouthMat);
      mouth.rotation.x = Math.PI;
      mouth.rotation.y = isLeft ? 0.5 : -0.5;
      mouth.position.set(isLeft ? 0.19 : -0.19, 1.28, 0.18);
      head.add(mouth);

      // Big Expressive 3D Cartoon Anime Eyes (White sclera, colored iris, sparkle catchlight)
      const eyeWhiteGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });

      const irisColor = irisColors[roleIndex % irisColors.length];
      const irisGeo = new THREE.SphereGeometry(0.042, 10, 10);
      const irisMat = new THREE.MeshBasicMaterial({ color: irisColor });

      const pupilGeo = new THREE.SphereGeometry(0.024, 8, 8);
      const pupilMat = new THREE.MeshBasicMaterial({ color: '#09090B' });

      const glintGeo = new THREE.SphereGeometry(0.012, 6, 6);
      const glintMat = new THREE.MeshBasicMaterial({ color: '#FFFFFF' });

      const buildEye = (offsetX: number, offsetZ: number) => {
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(offsetX, 1.40, offsetZ);

        const white = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
        eyeGroup.add(white);

        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.set(isLeft ? 0.025 : -0.025, 0, 0.035);
        eyeGroup.add(iris);

        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        pupil.position.set(isLeft ? 0.027 : -0.027, 0, 0.045);
        eyeGroup.add(pupil);

        const glint = new THREE.Mesh(glintGeo, glintMat);
        glint.position.set(isLeft ? 0.032 : -0.022, 0.018, 0.055);
        eyeGroup.add(glint);

        return eyeGroup;
      };

      const eyeL = buildEye(isLeft ? 0.14 : -0.14, 0.22);
      head.add(eyeL);

      const eyeR = buildEye(isLeft ? 0.23 : -0.04, 0.14);
      head.add(eyeR);

      // Eyebrows (Determined & friendly arch)
      const browGeo = new THREE.BoxGeometry(0.06, 0.018, 0.015);
      const browMat = new THREE.MeshBasicMaterial({ color: '#3E2723' });
      const browL = new THREE.Mesh(browGeo, browMat);
      browL.position.set(isLeft ? 0.14 : -0.14, 1.48, 0.22);
      browL.rotation.z = isLeft ? -0.2 : 0.2;
      head.add(browL);

      const browR = new THREE.Mesh(browGeo, browMat);
      browR.position.set(isLeft ? 0.23 : -0.04, 1.48, 0.14);
      browR.rotation.z = isLeft ? 0.2 : -0.2;
      head.add(browR);

      // Distinct, Colorful Headwear per Player Role
      if (roleIndex === 0) {
        // Captain: Athletic Headband with Champion Star
        const bandGeo = new THREE.TorusGeometry(0.27, 0.038, 8, 24);
        const bandMat = new THREE.MeshStandardMaterial({ color: '#FACC15', roughness: 0.3 }); // Gold headband
        const band = new THREE.Mesh(bandGeo, bandMat);
        band.rotation.x = Math.PI / 2;
        band.position.set(0, 1.44, 0);
        head.add(band);

        // Spiky colorful hair on top
        const hairGeo = new THREE.ConeGeometry(0.16, 0.28, 5);
        const hairMat = new THREE.MeshStandardMaterial({ color: isLeft ? '#1E40AF' : '#991B1B', roughness: 0.8 });
        for (let i = 0; i < 4; i++) {
          const hairSpike = new THREE.Mesh(hairGeo, hairMat);
          hairSpike.position.set((i - 1.5) * 0.1, 1.62, 0);
          hairSpike.rotation.z = (i - 1.5) * 0.2;
          head.add(hairSpike);
        }
      } else if (roleIndex === 1) {
        // Middle Player: Cool Sporty Backwards Baseball Cap with Contrast Visor
        const capGeo = new THREE.SphereGeometry(0.275, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.52);
        const capMat = new THREE.MeshStandardMaterial({ color: primaryColorHex, roughness: 0.5 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.set(0, 1.39, 0);
        head.add(cap);

        // Visor Brim
        const brimGeo = new THREE.BoxGeometry(0.18, 0.02, 0.14);
        const brimMat = new THREE.MeshStandardMaterial({ color: accentColorHex, roughness: 0.4 });
        const brim = new THREE.Mesh(brimGeo, brimMat);
        brim.position.set(0, 1.44, -0.26); // Backwards visor
        head.add(brim);
      } else {
        // Anchor Player: Sporty Beanie with Bright Sports Goggles on Forehead
        const beanieGeo = new THREE.SphereGeometry(0.275, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
        const beanieMat = new THREE.MeshStandardMaterial({ color: accentColorHex, roughness: 0.6 });
        const beanie = new THREE.Mesh(beanieGeo, beanieMat);
        beanie.position.set(0, 1.39, 0);
        head.add(beanie);

        // Goggles
        const goggleFrameGeo = new THREE.TorusGeometry(0.07, 0.02, 8, 12);
        const goggleMat = new THREE.MeshStandardMaterial({ color: '#10B981', roughness: 0.3 }); // Emerald goggles
        const goggleL = new THREE.Mesh(goggleFrameGeo, goggleMat);
        goggleL.position.set(isLeft ? 0.11 : -0.11, 1.47, 0.22);
        head.add(goggleL);

        const goggleR = new THREE.Mesh(goggleFrameGeo, goggleMat);
        goggleR.position.set(isLeft ? 0.21 : -0.01, 1.47, 0.14);
        head.add(goggleR);
      }

      // Arms & Gripping Hands holding the rope
      const armGeo = new THREE.CylinderGeometry(0.075, 0.07, 0.48, 8);
      const armL = new THREE.Mesh(armGeo, skinMat);
      armL.position.set(isLeft ? 0.26 : -0.26, 0.94, 0.16);
      armL.rotation.x = Math.PI / 2.5;
      armL.rotation.z = isLeft ? -0.4 : 0.4;
      armL.castShadow = true;
      charGroup.add(armL);

      const armR = new THREE.Mesh(armGeo, skinMat);
      armR.position.set(isLeft ? 0.16 : -0.16, 0.90, 0.28);
      armR.rotation.x = Math.PI / 2.3;
      armR.rotation.z = isLeft ? -0.2 : 0.2;
      armR.castShadow = true;
      charGroup.add(armR);

      // Colorful Wrist Sweatbands
      const wristBandGeo = new THREE.TorusGeometry(0.08, 0.025, 8, 16);
      const wristBandMat = new THREE.MeshStandardMaterial({ color: accentColorHex, roughness: 0.3 });
      const wristL = new THREE.Mesh(wristBandGeo, wristBandMat);
      wristL.position.set(isLeft ? 0.32 : -0.32, 0.88, 0.24);
      charGroup.add(wristL);

      const wristR = new THREE.Mesh(wristBandGeo, wristBandMat);
      wristR.position.set(isLeft ? 0.22 : -0.22, 0.84, 0.36);
      charGroup.add(wristR);

      return {
        group: charGroup,
        torso,
        head,
        armL,
        armR,
        jerseyMat,
        initialX: 0,
        role: roleIndex,
      };
    };

    // Create 3 Team A Characters on Left (Facing Right directly at Team B)
    const teamAChars: CartoonAvatar[] = [
      createColorfulAvatar(true, 0, propsRef.current.teamAColor, '#06B6D4'), // Captain
      createColorfulAvatar(true, 1, propsRef.current.teamAColor, '#F59E0B'), // Middle
      createColorfulAvatar(true, 2, propsRef.current.teamAColor, '#10B981'), // Anchor
    ];

    teamAChars.forEach((c, idx) => {
      // Front avatar sits close to center (X = -1.25), facing opponents head-to-head!
      const posX = -1.25 - idx * 1.15;
      c.initialX = posX;
      c.group.position.set(posX, 0, 0.12 - (idx % 2) * 0.24);
      c.group.rotation.y = Math.PI / 2; // Facing directly right towards center/opponent!
      scene.add(c.group);
    });

    // Create 3 Team B Characters on Right (Facing Left directly at Team A)
    const teamBChars: CartoonAvatar[] = [
      createColorfulAvatar(false, 0, propsRef.current.teamBColor, '#FACC15'), // Captain
      createColorfulAvatar(false, 1, propsRef.current.teamBColor, '#FB923C'), // Middle
      createColorfulAvatar(false, 2, propsRef.current.teamBColor, '#38BDF8'), // Anchor
    ];

    teamBChars.forEach((c, idx) => {
      // Front avatar sits close to center (X = 1.25), facing opponents head-to-head!
      const posX = 1.25 + idx * 1.15;
      c.initialX = posX;
      c.group.position.set(posX, 0, 0.12 - (idx % 2) * 0.24);
      c.group.rotation.y = -Math.PI / 2; // Facing directly left towards center/opponent!
      scene.add(c.group);
    });

    // ANIMATION & KINEMATICS STATE
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let currentRopeX = 0;
    let cameraShake = 0;

    let prevPullA = propsRef.current.pullCountA;
    let prevPullB = propsRef.current.pullCountB;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const p = propsRef.current;

      // Update jersey colors if props changed
      teamAChars.forEach(c => {
        c.jerseyMat.color.set(p.teamAColor);
      });
      teamBChars.forEach(c => {
        c.jerseyMat.color.set(p.teamBColor);
      });

      // Detect sudden heave pull triggers for camera shake & dynamic tug feel
      if (p.pullCountA !== prevPullA) {
        prevPullA = p.pullCountA;
        cameraShake = 0.12;
      }
      if (p.pullCountB !== prevPullB) {
        prevPullB = p.pullCountB;
        cameraShake = 0.12;
      }

      // Smooth rope translation based on score difference:
      // A difference of 1 point moves the rope ~0.35m
      const scoreDiff = p.scoreA - p.scoreB;
      // Clamp between -2.5m (Left win line) and +2.5m (Right win line)
      const targetRopeX = Math.max(-2.6, Math.min(2.6, -scoreDiff * 0.42));
      currentRopeX = THREE.MathUtils.damp(currentRopeX, targetRopeX, 4.0, dt);
      ropeGroup.position.x = currentRopeX;

      // Characters also translate slightly with the rope
      teamAChars.forEach((c) => {
        c.group.position.x = c.initialX + currentRopeX * 0.75;
      });
      teamBChars.forEach((c) => {
        c.group.position.x = c.initialX + currentRopeX * 0.75;
      });

      // Animate characters pulling or celebrating
      if (p.isGameOver) {
        // Game over animations
        if (p.winner === 'A') {
          // Team A celebrates (jumping)
          teamAChars.forEach((c, i) => {
            c.group.position.y = Math.abs(Math.sin(elapsed * 7 + i * 0.8)) * 0.45;
            c.armL.rotation.z = -1.5;
            c.armR.rotation.z = -1.5;
            c.head.rotation.y = Math.sin(elapsed * 4) * 0.2;
          });
          // Team B disappointed / slipped
          teamBChars.forEach((c) => {
            c.group.position.y = 0;
            c.group.rotation.x = -0.35; // slumped forward
          });
        } else if (p.winner === 'B') {
          // Team B celebrates
          teamBChars.forEach((c, i) => {
            c.group.position.y = Math.abs(Math.sin(elapsed * 7 + i * 0.8)) * 0.45;
            c.armL.rotation.z = 1.5;
            c.armR.rotation.z = 1.5;
            c.head.rotation.y = Math.sin(elapsed * 4) * 0.2;
          });
          teamAChars.forEach((c) => {
            c.group.position.y = 0;
            c.group.rotation.x = 0.35; // slumped forward
          });
        } else {
          // Draw
          teamAChars.concat(teamBChars).forEach((c, i) => {
            c.group.position.y = 0;
            c.head.rotation.y = Math.sin(elapsed * 3 + i) * 0.15;
          });
        }
      } else {
        // Active gameplay / Title idle: energetic posture facing opponent!
        const rhythm = Math.sin(elapsed * 4.8);
        const heaveAngleA = 0.22 + (p.scoreA > p.scoreB ? 0.12 : 0) + rhythm * 0.06;
        const heaveAngleB = 0.22 + (p.scoreB > p.scoreA ? 0.12 : 0) + rhythm * 0.06;

        teamAChars.forEach((c, i) => {
          // Lean back into the pull while facing opponent head-on
          c.group.rotation.z = -heaveAngleA;
          c.group.position.y = Math.abs(rhythm * 0.04);
          c.armL.rotation.x = Math.PI / 2.5 + rhythm * 0.08;
          c.armR.rotation.x = Math.PI / 2.3 - rhythm * 0.08;
          // Look slightly up and ahead at the opposing captain
          c.head.rotation.z = 0.12 * Math.sin(elapsed * 3 + i);
        });

        teamBChars.forEach((c, i) => {
          c.group.rotation.z = heaveAngleB;
          c.group.position.y = Math.abs(rhythm * 0.04);
          c.armL.rotation.x = Math.PI / 2.5 + rhythm * 0.08;
          c.armR.rotation.x = Math.PI / 2.3 - rhythm * 0.08;
          c.head.rotation.z = -0.12 * Math.sin(elapsed * 3 + i);
        });
      }

      // Camera gentle pan and dynamic decay shake
      if (cameraShake > 0.001) {
        cameraShake *= 0.88;
        camera.position.x = (Math.random() - 0.5) * cameraShake;
        camera.position.y = 3.6 + (Math.random() - 0.5) * cameraShake;
      } else {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, currentRopeX * 0.35, 2.0, dt);
        camera.position.y = 3.6;
      }
      camera.lookAt(currentRopeX * 0.35, 1.25, 0);

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      ropeGeo.dispose();
      ropeMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-2xl shadow-inner border-2 border-sky-300">
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Stadium Badges - Only shown when NOT hideHUD */}
      {!hideHUD && (
        <>
          <div className="absolute top-3 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-none px-3 py-1.5 rounded-full shadow-md border-2 border-blue-400">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-none"></span>
            <span className="font-bold text-xs md:text-sm text-blue-900 font-['Fredoka'] truncate max-w-[140px]">
              {nameA}
            </span>
            <span className="text-xs bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full">
              {scoreA} Poin
            </span>
          </div>

          <div className="absolute top-3 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-none px-3 py-1.5 rounded-full shadow-md border-2 border-red-400">
            <span className="text-xs bg-red-100 text-red-800 font-extrabold px-2 py-0.5 rounded-full">
              {scoreB} Poin
            </span>
            <span className="font-bold text-xs md:text-sm text-red-900 font-['Fredoka'] truncate max-w-[140px]">
              {nameB}
            </span>
            <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-none"></span>
          </div>

          {/* Center Rope Tension Indicator Gauge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-2 shadow-lg">
            <span className="text-blue-400">◀ Tarikan {nameA}</span>
            <span className="text-yellow-300 font-mono">
              {scoreA === scoreB ? 'SEIMBANG' : scoreA > scoreB ? `+${scoreA - scoreB} KIRI` : `+${scoreB - scoreA} KANAN`}
            </span>
            <span className="text-red-400">{nameB} ▶</span>
          </div>
        </>
      )}
    </div>
  );
};
