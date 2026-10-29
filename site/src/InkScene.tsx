import { useEffect, useMemo, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";

type InkSceneProps = {
  color: string;
  companions: string[];
  background: string;
  dark: boolean;
  reducedMotion: boolean;
  onFailure: () => void;
};

// Pigment is an illustration, not a source for the site's copyable values.
const fragment = `
  uniform vec3 ink, teal, burgundy, moss;
  uniform float progress;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
  }
  float fbm(vec2 p) { return .55*noise(p)+.27*noise(p*2.1)+.12*noise(p*4.3)+.06*noise(p*8.7); }
  void main() {
    vec2 p=(vUv-.5)*2.;
    p.y *= 1.0;
    float growth=smoothstep(.18,.88,progress);
    float radius=mix(.02,.65,growth);
    vec2 warp=vec2(fbm(p*3.1+2.2),fbm(p*3.1+13.4))-.5;
    vec2 q=p+warp*.22;
    float dist=length(q);
    float edge=radius + (fbm(q*8.)-.5)*.16*growth;
    float coverage=1.-smoothstep(edge-.10,edge+.035,dist);
    float fibers=fbm(q*32.);
    float bloom=smoothstep(.3,.85,growth);
    float t=fbm(q*4.2+vec2(2.4,-1.2));
    vec3 pigment=ink;
    pigment=mix(pigment,teal,smoothstep(.43,.67,t)*bloom*.85);
    pigment=mix(pigment,burgundy,smoothstep(.48,.75,fbm(q*3.8+vec2(12.,4.)))*bloom*.8);
    pigment=mix(pigment,moss,smoothstep(.53,.73,fbm(q*4.5+vec2(-6.,9.)))*bloom*.72);
    float tide=1.-smoothstep(.02,.10,abs(dist-radius*.66+(fbm(q*11.)-.5)*.06));
    pigment *= .88 + fibers*.16 - tide*.11;
    float grain=.91 + .09*hash(floor(vUv*850.));
    gl_FragColor=vec4(pigment, coverage*grain*.94);
    #include <colorspace_fragment>
  }
`;
const vertex = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

function Composition({ color, companions, background, dark, reducedMotion, onFailure }: InkSceneProps) {
  const { gl, invalidate, size, camera } = useThree();
  const material = useRef<THREE.ShaderMaterial>(null);
  const drop = useRef<THREE.Mesh>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    progress: { value: 0 },
    ink: { value: new THREE.Color(color) },
    teal: { value: new THREE.Color(companions[0]) },
    burgundy: { value: new THREE.Color(companions[1]) },
    moss: { value: new THREE.Color(companions[2]) },
  }), []);
  const dropGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 64, 48);
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      // A rounded base and tapered crown, like a drop gathering on a nib.
      const taper = 1 - .38 * Math.max(0, y);
      positions.setXYZ(i, positions.getX(i) * taper, y * 1.23 + .1 * Math.max(0, y) ** 3, positions.getZ(i) * taper);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => dropGeometry.dispose(), [dropGeometry]);
  useEffect(() => {
    uniforms.ink.value.set(color);
    uniforms.teal.value.set(companions[0]);
    uniforms.burgundy.value.set(companions[1]);
    uniforms.moss.value.set(companions[2]);
    if (material.current) {
      material.current.uniforms.ink.value.set(color);
      material.current.uniforms.teal.value.set(companions[0]);
      material.current.uniforms.burgundy.value.set(companions[1]);
      material.current.uniforms.moss.value.set(companions[2]);
    }
    invalidate();
  }, [color, companions.join(','), uniforms, invalidate]);
  useEffect(() => {
    const c = camera as THREE.OrthographicCamera;
    c.zoom = Math.min(size.width / 5.5, size.height / 5.2);
    c.updateProjectionMatrix(); invalidate();
  }, [camera, size, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const fail = (event: Event) => { event.preventDefault(); onFailure(); };
    canvas.addEventListener("webglcontextlost", fail);
    return () => canvas.removeEventListener("webglcontextlost", fail);
  }, [gl, onFailure]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const rail = document.querySelector('.ink-rail');
      if (!rail || document.hidden) return;
      const rect = rail.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const distance = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const p = reducedMotion ? 1 : Math.max(0, Math.min(1, window.scrollY / distance));
      uniforms.progress.value = p;
      if (material.current) material.current.uniforms.progress.value = p;
      if (drop.current) {
        const forming = THREE.MathUtils.smoothstep(p, 0, .13);
        const impact = THREE.MathUtils.smoothstep(p, .13, .30);
        const vanish = 1 - THREE.MathUtils.smoothstep(p, .25, .40);
        drop.current.position.y = 1.05 - impact * 1.05;
        drop.current.scale.setScalar((.33 + forming * .19) * Math.max(.001, vanish));
      }
      if (shadow.current) shadow.current.scale.setScalar(.4 + p * .7);
      invalidate();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule); document.addEventListener('visibilitychange', schedule);
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); document.removeEventListener('visibilitychange', schedule); cancelAnimationFrame(frame); };
  }, [invalidate, reducedMotion, uniforms]);
  return <>
    <color attach="background" args={[background]} />
    <ambientLight intensity={dark ? 1.2 : 1.5} />
    <directionalLight position={[-3, 5, 8]} intensity={3} />
    <directionalLight position={[4, -2, 5]} intensity={1.5} />
    <mesh position={[0, -.2, 0]}>
      <planeGeometry args={[5.2, 5.2]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertex} fragmentShader={fragment} transparent depthWrite={false} />
    </mesh>
    <mesh ref={shadow} position={[0, -.3, .1]}>
      <circleGeometry args={[.5, 64]} />
      <meshBasicMaterial color={color} transparent opacity={.12} depthWrite={false} />
    </mesh>
    <mesh ref={drop} geometry={dropGeometry} position={[0, 1.05, .6]} scale={.33}>
      <meshPhysicalMaterial color={color} metalness={.2} roughness={.13} clearcoat={1} clearcoatRoughness={.08} />
      <mesh position={[-.35, .4, .82]} rotation={[0,0,-.4]} scale={[.12,.32,.03]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial color={dark ? '#e7e8e4' : '#fafaf7'} transparent opacity={.7} />
      </mesh>
    </mesh>
  </>;
}

export default function InkScene(props: InkSceneProps) {
  return <Canvas orthographic camera={{position:[0,0,10],zoom:75,near:.1,far:30}} dpr={[1,1.5]} frameloop="demand" gl={{antialias:true,alpha:false,powerPreference:'low-power'}} fallback={null} aria-hidden="true"><Composition {...props} /></Canvas>;
}
