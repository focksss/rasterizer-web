
import { Vector3 } from './mathUtils.js';

export class Material {
    constructor() {
        this.name = '';
        this.texturesDirectory = 'NULL';
        this.Ka = new Vector3(0, 0, 0);
        this.Kd = new Vector3(0.8, 0.8, 0.8);
        this.Ks = new Vector3(0.5, 0.5, 0.5);
        this.Ns = 10;
        this.d = 0;
        this.Tr = 0;
        this.Tf = new Vector3(0, 0, 0);
        this.Ni = 1;
        this.Ke = new Vector3(0, 0, 0);
        this.illum = 0;
        this.map_Ka = '';
        this.map_Kd = '';
        this.map_Ks = '';
        this.Pm = 0;
        this.Pr = 0.5;
        this.Ps = 0;
        this.Pc = 0;
        this.Pcr = 0;
        this.aniso = 0;
        this.anisor = 0;
        this.map_Pm = '';
        this.map_Pr = '';
        this.map_Ps = '';
        this.map_Pc = '';
        this.map_Pcr = '';
        this.map_Bump = '';
        this.map_d = '';
        this.map_Tr = '';
        this.map_Ns = '';
        this.map_Ke = '';
        this.map_Disp = '';
        this.Density = 1;
        this.subsurface = 0;
        this.subsurfaceColor = new Vector3(0, 0, 0);
        this.subsurfaceRadius = new Vector3(0, 0, 0);
        this.alphaCutoff = 0.1;
        this.emissiveStrength = 1;
        this.doubleSided = false;
    }

    static vecProperties = new Set(['Ka', 'Kd', 'Ks', 'Tf', 'Ke', 'SubsurfaceColor', 'SubsurfaceRadius']);
    static doubleProperties = new Set(['Ns', 'd', 'Tr', 'Ni', 'Pm', 'Pr', 'Ps', 'Pc', 'Pcr', 'aniso', 'anisor', 'Density', 'subsurface', 'alphaCutoff', 'emissiveStrength']);
    static intProperties = new Set(['illum']);

    print() {
        console.log('name:', this.name);
        console.log('texturesDirectory:', this.texturesDirectory);
        console.log('Ka:', this.Ka);
        console.log('Kd:', this.Kd);
        console.log('Ks:', this.Ks);
        console.log('Ns:', this.Ns);
        console.log('d:', this.d);
        console.log('Tr:', this.Tr);
        console.log('Tf:', this.Tf);
        console.log('Ni:', this.Ni);
        console.log('Ke:', this.Ke);
        console.log('illum:', this.illum);
        console.log('map_Ka:', this.map_Ka);
        console.log('map_Kd:', this.map_Kd);
        console.log('map_Ks:', this.map_Ks);
        console.log('Pm:', this.Pm);
        console.log('Pr:', this.Pr);
        console.log('Ps:', this.Ps);
        console.log('Pc:', this.Pc);
        console.log('Pcr:', this.Pcr);
        console.log('aniso:', this.aniso);
        console.log('anisor:', this.anisor);
        console.log('map_Pm:', this.map_Pm);
        console.log('map_Pr:', this.map_Pr);
        console.log('map_Ps:', this.map_Ps);
        console.log('map_Pc:', this.map_Pc);
        console.log('map_Pcr:', this.map_Pcr);
        console.log('map_Bump:', this.map_Bump);
        console.log('map_d:', this.map_d);
        console.log('map_Tr:', this.map_Tr);
        console.log('map_Ns:', this.map_Ns);
        console.log('map_Ke:', this.map_Ke);
        console.log('map_Disp:', this.map_Disp);
        console.log('doubleSided:', this.doubleSided);
    }

    setProperty(name, value) {
        if (this.hasOwnProperty(name)) {
            this[name] = value;
        } else {
            throw new Error(`Invalid property: ${name}`);
        }
    }

    getPropertyValue(property) {
        if (this.hasOwnProperty(property)) {
            return this[property]?.toString() ?? 'null';
        }
        throw new Error(`Property not found: ${property}`);
    }
}
