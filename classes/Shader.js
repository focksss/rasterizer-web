
export class Shader {
    constructor(gl, vertPath, fragPath) {
        this.gl = gl;
        this.loadShaders(vertPath, fragPath);
    }

    async loadShaders(vertPath, fragPath) {
        const [vertexSource, fragmentSource] = await Promise.all([
            fetch(vertPath).then(r => r.text()),
            fetch(fragPath).then(r => r.text())
        ]);

        this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
        this.checkProgramError();
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        this.checkShaderError(shader, type === this.gl.VERTEX_SHADER ? "vertex" : "fragment");
        return shader;
    }

    checkShaderError(shader, type) {
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const log = this.gl.getShaderInfoLog(shader);
            throw new Error(`${type} shader compilation failed: ${log}`);
        }
    }

    checkProgramError() {
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            const log = this.gl.getProgramInfoLog(this.program);
            throw new Error(`Program linking failed: ${log}`);
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setUniform(name, value) {
        this.use();
        const location = this.gl.getUniformLocation(this.program, name);

        if (typeof value === 'number') {
            Number.isInteger(value) ? 
                this.gl.uniform1i(location, value) :
                this.gl.uniform1f(location, value);
        } else if (value instanceof Float32Array && value.length === 16) {
            // Assume Matrix4
            this.gl.uniformMatrix4fv(location, false, value);
        } else if (value instanceof Float32Array && value.length === 3) {
            // Assume Vector3
            this.gl.uniform3fv(location, value);
        } else if (typeof value === 'boolean') {
            this.gl.uniform1i(location, value ? 1 : 0);
        }
    }

    setUniformTexture(name, texture, unit) {
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.setUniform(name, unit);
    }
}
