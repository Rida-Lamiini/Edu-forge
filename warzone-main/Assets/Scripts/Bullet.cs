using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
   private void OnCollisionEnter(Collision collision){
        if (collision.gameObject.CompareTag("Target")){  // Vérifiez aussi l'orthographe de "Target"
            print("hit " + collision.gameObject.name + "!");
            Destroy(gameObject);
        }
        if (collision.gameObject.CompareTag("Wall")){  // Vérifiez aussi l'orthographe de "Target"
            print("hit Wall");
            Destroy(gameObject);
        }
    }
}

