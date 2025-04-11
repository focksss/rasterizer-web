import { Vector3 } from './mathUtils.js';

let NEXT_TRI_ID = 0;

export class Triangle {
  constructor(v1, v2, v3, n1 = null, n2 = null, n3 = null, vt1 = null, vt2 = null, vt3 = null, material = 0) {
    this.v1 = v1;
    this.v2 = v2;
    this.v3 = v3;
    this.material = material;
    this.ID = NEXT_TRI_ID++;

    // Default values if not provided
    this.n1 = n1 ? n1.normalize() : new Vector3(0, 0, 1);
    this.n2 = n2 ? n2.normalize() : new Vector3(0, 0, 1);
    this.n3 = n3 ? n3.normalize() : new Vector3(0, 0, 1);

    this.vt1 = vt1 || new Vector3(0, 0);
    this.vt2 = vt2 || new Vector3(0, 0);
    this.vt3 = vt3 || new Vector3(0, 0);

    const e1 = this.v2.sub(this.v1);
    const e2 = this.v3.sub(this.v1);
    const deltaUV1 = this.vt2.sub(this.vt1);
    const deltaUV2 = this.vt3.sub(this.vt1);

    const f = 1.0 / (deltaUV1.x * deltaUV2.y - deltaUV2.x * deltaUV1.y);

    let tangent = new Vector3();
    let bitangent = new Vector3();

    tangent.x = f * (deltaUV2.y * e1.x - deltaUV1.y * e2.x);
    tangent.y = f * (deltaUV2.y * e1.y - deltaUV1.y * e2.y);
    tangent.z = f * (deltaUV2.y * e1.z - deltaUV1.y * e2.z);

    bitangent.x = f * (-deltaUV2.x * e1.x + deltaUV1.x * e2.x);
    bitangent.y = f * (-deltaUV2.x * e1.y + deltaUV1.x * e2.y);
    bitangent.z = f * (-deltaUV2.x * e1.z + deltaUV1.x * e2.z);

    tangent = tangent.normalize();
    bitangent = bitangent.normalize();

    if (tangent.cross(bitangent).dot(this.n1) < 0.2) {
      tangent = tangent.mult(-1);
    }

    this.t1 = tangent;
    this.t2 = tangent;
    this.t3 = tangent;

    this.bt1 = bitangent;
    this.bt2 = bitangent;
    this.bt3 = bitangent;
  }

  area() {
    const AB = this.v2.sub(this.v1);
    const AC = this.v3.sub(this.v1);
    const cross = AB.cross(AC);
    return 0.5 * Math.abs(cross.magnitude());
  }

  ID() {
    return this.ID;
  }
}
