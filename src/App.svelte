<script lang="ts">
  import {onMount} from 'svelte';
  import vertex from './shaders/vertex.glsl';
  import fragment from './shaders/fragment.glsl';
  import {GLContextManager} from './graphics/GLContext';
  import {GLError} from './graphics/GLError';

  let errors: GLError[] = [];
  let gl: GLContextManager;
  let vbo: WebGLBuffer;
  const positions = new Float32Array([
    0, 0.5,
    -0.5, -0.5,
    0.5, -0.5
  ]);


  onMount(() => {
    console.log({vertex, fragment});
    const canvas = document.getElementById('gl-context') as HTMLCanvasElement;
    const glContext = canvas.getContext('webgl2');
    if (!glContext) {
      alert('WebGl 2 context is not supported');
      return;
    }

    gl = new GLContextManager(glContext);
    console.log(gl.version);
    console.log(gl.langVersion);

    gl.AddVertexShader('vertex', vertex);
    gl.AddFragmentShader('fragment', fragment);
    if (gl.hasErrors) {
      const newSet: GLError[] = [];
      gl.ForErrors(e => newSet.push(e));
      errors = newSet;
    }

    const program = gl.GetBuilder()
      .AttachVertex('vertex')
      .AttachFragmentShader('fragment')
      .build();

    if (program instanceof GLError) {
      alert(program.GLMessage);
    } else {
      gl.Operate(program);
    }

    gl.Paint();

    const lock = glContext.getAttribLocation(program, 'in_position');
    vbo = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vbo);
    glContext.bufferData(glContext.ARRAY_BUFFER, positions, glContext.STATIC_DRAW);
    glContext.vertexAttribPointer(lock, 2, glContext.FLOAT, false, 0, 0);
    glContext.enableVertexAttribArray(lock);
    glContext.drawArrays(glContext.TRIANGLES, 0, 3);
  });

</script>

<h1>WebGL</h1>
<main>
    <ul>
        {#each errors as error}
            <li>
                <p>{error.GLMessage}</p>
            </li>
        {/each}
    </ul>
    <canvas width="800px" height="600px" id="gl-context">
    </canvas>
</main>

<style>
</style>
