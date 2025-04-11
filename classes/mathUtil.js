
export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mult(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x * v, this.y * v, this.z * v);
        }
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }

    div(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x / v, this.y / v, this.z / v);
        }
        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v) {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        const mag = this.magnitude();
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    dist(v) {
        return Math.sqrt(
            Math.pow(this.x - v.x, 2) +
            Math.pow(this.y - v.y, 2) +
            Math.pow(this.z - v.z, 2)
        );
    }

    toArray() {
        return [this.x, this.y, this.z];
    }

    rotate(rot) {
        let x = this.x, y = this.y, z = this.z;

        // X rotation
        const cosX = Math.cos(rot.x);
        const sinX = Math.sin(rot.x);
        const ny1 = y * cosX - z * sinX;
        const nz1 = y * sinX + z * cosX;
        y = ny1;
        z = nz1;

        // Y rotation
        const cosY = Math.cos(rot.y);
        const sinY = Math.sin(rot.y);
        const nx2 = x * cosY + z * sinY;
        const nz2 = -x * sinY + z * cosY;
        x = nx2;
        z = nz2;

        // Z rotation
        const cosZ = Math.cos(rot.z);
        const sinZ = Math.sin(rot.z);
        const nx3 = x * cosZ - y * sinZ;
        const ny3 = x * sinZ + y * cosZ;
        x = nx3;
        y = ny3;

        return new Vector3(x, y, z);
    }
}



export class Matrix4 {
    constructor() {
        this.data = new Float32Array(16);
        this.identity();
    }

    identity() {
        this.data.fill(0);
        this.data[0] = 1;
        this.data[5] = 1;
        this.data[10] = 1;
        this.data[15] = 1;
        return this;
    }

    multiply(other) {
        const result = new Matrix4();
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                let sum = 0;
                for (let i = 0; i < 4; i++) {
                    sum += this.data[row * 4 + i] * other.data[i * 4 + col];
                }
                result.data[row * 4 + col] = sum;
            }
        }
        return result;
    }

    multiplyVec4(vec) {
        const result = new Float32Array(4);
        for (let row = 0; row < 4; row++) {
            result[row] =
                this.data[row * 4] * vec[0] +
                this.data[row * 4 + 1] * vec[1] +
                this.data[row * 4 + 2] * vec[2] +
                this.data[row * 4 + 3] * vec[3];
        }
        return result;
    }

    static translation(x, y, z) {
        const mat = new Matrix4();
        mat.data[12] = x;
        mat.data[13] = y;
        mat.data[14] = z;
        return mat;
    }

    static rotateX(theta) {
        const mat = new Matrix4();
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        mat.identity();
        mat.data[5] = c;
        mat.data[6] = -s;
        mat.data[9] = s;
        mat.data[10] = c;
        return mat;
    }
    static rotateY(theta) {
        const mat = new Matrix4();
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        mat.identity();
        mat.data[0] = c;
        mat.data[2] = s;
        mat.data[8] = -s;
        mat.data[10] = c;
        return mat;
    }
    static rotateZ(theta) {
        const mat = new Matrix4();
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        mat.identity();
        mat.data[0] = c;
        mat.data[1] = -s;
        mat.data[4] = s;
        mat.data[5] = c;
        return mat;
    }

    static rotation(x, y, z) {
        const rx = Matrix4.rotateX(x);
        const ry = Matrix4.rotateY(y);
        const rz = Matrix4.rotateZ(z);
        return rz.multiply(ry).multiply(rx);
    }

    static rotateQuat(x, y, z, w) {
        const mat = new Matrix4();
        mat.identity();
        mat.data[0] = 1 - 2*(y*y + z*z);
        mat.data[1] = 2*(x*y - z*w);
        mat.data[2] = 2*(x*z + y*w);
        mat.data[4] = 2*(x*y + z*w);
        mat.data[5] = 1 - 2*(x*x + z*z);
        mat.data[6] = 2*(y*z - x*w);
        mat.data[8] = 2*(x*z - y*w);
        mat.data[9] = 2*(y*z + x*w);
        mat.data[10] = 1 - 2*(x*x + y*y);
        return mat;
    }

    static scale(x, y, z) {
        const mat = new Matrix4();
        mat.identity();
        mat.data[0] = x;
        mat.data[5] = y;
        mat.data[10] = z;
        return mat;
    }

    static projection(fov, aspect, near, far) {
        const mat = new Matrix4();
        mat.identity();
        const f = 1.0 / Math.tan(fov / 2);

        mat.data[0] = f / aspect;
        mat.data[5] = f;
        mat.data[10] = (far + near) / (near - far);
        mat.data[11] = -1;
        mat.data[14] = (2 * far * near) / (near - far);
        mat.data[15] = 0;

        return mat;
    }

    static view(rot, pos) {
        const rotate = Matrix4.rotation(rot.x, rot.y, rot.z);
        const mat = Matrix4.translation(-pos.x, -pos.y, -pos.z);
        return mat.multiply(rotate);
    }

    toArray() {
        return this.data;
    }
}
