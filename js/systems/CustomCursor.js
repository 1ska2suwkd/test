export class CustomCursor {
    constructor(scene, key = 'customCursor') {
        this.scene = scene;

        // 기본 마우스 커서 숨기기
        scene.input.setDefaultCursor('none');

        // 커서 이미지 생성
        this.cursorImage = scene.add.image(0, 0, key).setDepth(999);

        // 마우스 움직임에 따라 위치 갱신
        scene.input.on('pointermove', (pointer) => {
            this.cursorImage.setPosition(pointer.x, pointer.y);
        });

        // 클릭하면 어두워짐
        scene.input.on('pointerdown', () => {
            this.cursorImage.setTint(0x555555); // 회색 어둡게
        });

        // 클릭에서 손 떼면 원래대로
        scene.input.on('pointerup', () => {
            this.cursorImage.clearTint();
        });

    }

    // 필요하면 업데이트 함수 제공
    update() {
        this.cursorImage.setPosition(
            this.scene.input.activePointer.x,
            this.scene.input.activePointer.y
        );
    }
}
