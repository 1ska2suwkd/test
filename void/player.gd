extends Area2D
@export var speed = 400
var screen_size

# 실행 될 때 한 번 호출 되는 함수 == create 함수
func _ready():
	screen_size = get_viewport_rect().size

# update 함수
func _process(delta):
	var velocity = Vector2.ZERO
	if Input.is_action_pressed("move_up"):
			velocity.y -= 1
	if Input.is_action_pressed("move_down"):
			velocity.y += 1
	if Input.is_action_pressed("move_left"):
			velocity.x -= 1
	if Input.is_action_pressed("move_right"):
			velocity.x += 1
			
	if velocity.length() > 0:
		velocity = velocity.normalized() * speed
		$AnimatedSprite2D.animation = "walk"
		$AnimatedSprite2D.flip_h = velocity.x < 0
	else:
		$AnimatedSprite2D.play("idle")
		
	position += velocity * delta
