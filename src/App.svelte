<script lang="ts">
  import svelteLogo from './assets/svelte.svg';
  import Counter from './lib/Counter.svelte';
  import {onMount} from 'svelte';
  import vertex from './shaders/vertex.glsl';
  import fragment from './shaders/fragment.glsl';

  let gl;
  let canvas;

  onMount(() => {
    console.log({vertex, fragment});
    canvas = document.getElementById('gl-context');
    gl = canvas.getContext('webgl2');
    if (!gl) {
      alert('No se pudo inicial web GL');
      return;
    }
    console.log(gl.getParameter(gl.VERSION));
    console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
    const shad = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shad, vertex);
    gl.compileShader(shad);
    const compiled = gl.getShaderParameter(shad, gl.COMPILE_STATUS);
    console.log({compiled});
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });

</script>

<main>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite Logo"/>
        </a>
        <a href="https://svelte.dev" target="_blank">
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo"/>
        </a>
    </div>
    <h1>Vite + Svelte</h1>

    <div class="card">
        <Counter/>
    </div>
    <canvas width="800px" height="600px" id="gl-context">

    </canvas>
</main>

<style>
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
    }

    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }

    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
</style>
