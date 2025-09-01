// js/systems/PlayerStats.js
export class Stats {
    constructor(scene) {
        this.scene = scene; // time.now 사용
        // 기본값(절대값)
        this.base = {
            moveSpeed: 300,     // px/s
            attackSpeed: 1.0,   // 애니메이션 재생 배수
        };
        // 장비/영구 배수
        this.equipMult = {
            moveSpeed: 1.0,
            attackSpeed: 1.0,
        };
    }

    // -------- Base / Equip ----------
    setBase(stat, value) {
        this.base[stat] = value;
    }
    setEquipMult(stat, mult) {
        this.equipMult[stat] = mult;
    }

    getValue(stat) {
        const base = this.base[stat] ?? 0;
        const equip = this.equipMult[stat] ?? 1.0;
        return base * equip;
    }
}
