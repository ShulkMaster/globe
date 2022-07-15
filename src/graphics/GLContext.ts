import {GLError} from './GLError';
import {GLProgramBuilder} from './GLProgramBuilder';

export class GLContextManager {
  private readonly gl: WebGL2RenderingContext;
  private readonly vertexShades = new Map<string, WebGLShader>();
  private readonly fragmentShades = new Map<string, WebGLShader>();
  private readonly errors: GLError[] = [];

  constructor(context: WebGL2RenderingContext) {
    this.gl = context;
  }

  public get version(): string {
    return this.gl.getParameter(this.gl.VERSION);
  }

  public get langVersion(): string {
    return this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION);
  }

  public get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  private getShaderClass(kind: GLenum): string {
    switch (kind) {
      case this.gl.VERTEX_SHADER:
        return 'Vertex';
      case this.gl.FRAGMENT_SHADER:
        return 'Fragment';
      default:
        return '';
    }
  }

  private AddShader(kind: GLenum, name: string, source: string): WebGLShader {
    const glShader = this.gl.createShader(kind);
    this.gl.shaderSource(glShader, source);
    this.gl.compileShader(glShader);
    const compiled = this.gl.getShaderParameter(glShader, this.gl.COMPILE_STATUS);
    if (!compiled) {
      const error = new GLError();
      error.message = `Error compiling ${this.getShaderClass(kind)} shader ${name}`;
      error.GLMessage = this.gl.getShaderInfoLog(glShader);
      return error;
    }
    return glShader;
  }

  public AddVertexShader(name: string, source: string) {
    const vertex = this.AddShader(this.gl.VERTEX_SHADER, name, source);
    if (vertex instanceof GLError) {
      this.errors.push(vertex);
      return;
    }
    this.vertexShades.set(name, vertex);
  }

  public AddFragmentShader(name: string, source: string) {
    const fragment = this.AddShader(this.gl.FRAGMENT_SHADER, name, source);
    if (fragment instanceof GLError) {
      this.errors.push(fragment);
      return;
    }
    this.fragmentShades.set(name, fragment);
  }

  public GetBuilder(): GLProgramBuilder {
    return GLProgramBuilder.FromContext(this, this.gl);
  }

  public ForErrors(func: (error: GLError) => void) {
    this.errors.forEach(func);
  }

  public Paint() {
    this.gl.clearColor(0.5, 0.5, 0.5, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  public GetVertexShader(id: string): WebGLShader | undefined {
    return this.vertexShades.get(id);
  }

  public GetFragmentShader(id: string): WebGLShader | undefined {
    return this.fragmentShades.get(id);
  }

  public ClearShaders() {
    this.vertexShades.forEach(s => this.gl.deleteShader(s));
    this.fragmentShades.forEach(s => this.gl.deleteShader(s));
  }

  public Operate(program: WebGLProgram){
    this.gl.useProgram(program);
  }
}
