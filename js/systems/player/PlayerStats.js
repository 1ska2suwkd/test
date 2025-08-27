// js/systems/PlayerStats.js
export class PlayerStats {
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
        // 일시 버프(배수)
        // 예: { stat: 'attackSpeed', mult: 1.25, until: 12345678 }
        this.buffs = [];
    }

    // -------- Base / Equip ----------
    setBase(stat, value) {
        this.base[stat] = value;
    }
    setEquipMult(stat, mult) {
        this.equipMult[stat] = mult;
    }

    // -------- Buffs ----------
    addBuff(stat, percent, durationMs = 0) {
        const mult = 1 + percent; // +0.25 => 1.25배
        const until = durationMs > 0 ? (this.scene.time.now + durationMs) : null;
        this.buffs.push({ stat, mult, until });
    }

    // 만료 버프 정리(내부용)
    #prune() {
        const now = this.scene.time.now;
        this.buffs = this.buffs.filter(b => !b.until || b.until > now);
    }

    // 최종 값 = base * equip * (버프 곱)
    getValue(stat) {
        this.#prune();
        const base = this.base[stat] ?? 0;
        const equip = this.equipMult[stat] ?? 1.0;
        const buffProd = this.buffs
            .filter(b => b.stat === stat)
            .reduce((acc, b) => acc * b.mult, 1.0);
        return base * equip * buffProd;
    }
}
