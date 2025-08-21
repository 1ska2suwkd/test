using UnityEngine;

public class NewMonoBehaviourScript : MonoBehaviour
{
    public float speed = 5f;
    Rigidbody2D rigid;
    Vector2 input;

    //Awake는 시작할 때 한번만. 
    void Awake()
    {
        regid = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        float h = input.GetAxisRaw("Horizontal");
        float v = input.GetAxisRaw("Vertical");
        input = new Vector2(h, v).normalized;
    }

    private void FixedUpdate()
    {
        rigid.velocity = input * speed;
    }
}
