import type {GLContextManager} from './GLContext';
import {GLError} from './GLError';

export class GLProgramBuilder {
  private readonly manager: GLContextManager;
  private readonly program: WebGLProgram;
  private readonly gl: WebGL2RenderingContext;

  private constructor(contextManager: GLContextManager, context: WebGL2RenderingContext) {
    this.manager = contextManager;
    this.gl = context;
    this.program = this.gl.createProgram();
  }

  public static FromContext(contextManager: GLContextManager, context: WebGL2RenderingContext): GLProgramBuilder {
    return new GLProgramBuilder(contextManager, context);
  }

  public AttachVertex(name: string) {
    const v = this.manager.GetVertexShader(name);
    if (v) {
      this.gl.attachShader(this.program, v);
    }
    return this;
  }

  public AttachFragmentShader(name: string) {
    const frag = this.manager.GetFragmentShader(name);
    if (frag) {
      this.gl.attachShader(this.program, frag);
    }
    return this;
  }

  public build(): WebGLProgram | GLError {
    this.gl.linkProgram(this.program);
    const linked = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS);
    if(!linked){
      const error = new GLError();
      error.message = "Program error";
      error.GLMessage = this.gl.getProgramInfoLog(this.program);
      return error;
    }

    return this.program;
  }

}
