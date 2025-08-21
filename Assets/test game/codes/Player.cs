using UnityEngine;

public class Player : MonoBehaviour
{
    public float speed = 5f;
    Rigidbody2D rigid;
    Vector2 input;

    //Awake는 시작할 때 한번만. 
    void Awake()
    {
        rigid = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        float h = Input.GetAxisRaw("Horizontal");
        float v = Input.GetAxisRaw("Vertical");
        input = new Vector2(h, v).normalized;
    }

    private void FixedUpdate()
    {
        rigid.velocity = input * speed;
    }
}
