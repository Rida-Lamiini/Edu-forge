using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MouseMouvment : MonoBehaviour
{
    public float mouseSensitivity = 100f;
    float xRotation = 0f;
    float yRotation = 0f;

    public float topClamp = -90f;
    public float bottomClamp = 90f;

    void Start()
    {
        mouseSensitivity = 100f; 
        Cursor.lockState = CursorLockMode.Locked;
        Debug.Log("Initial Mouse Sensitivity: " + mouseSensitivity);
    }

    void Update()
    {
        // Utilisation de GetAxisRaw pour éviter les problèmes d'Input Manager
        float mouseX = Input.GetAxisRaw("Mouse X") * mouseSensitivity * Time.deltaTime;
        float mouseY = Input.GetAxisRaw("Mouse Y") * mouseSensitivity * Time.deltaTime;

        xRotation -= mouseY;
        xRotation = Mathf.Clamp(xRotation, topClamp, bottomClamp);

        yRotation += mouseX; // Correction ici

        transform.rotation = Quaternion.Euler(xRotation, yRotation, 0f);

        Debug.Log("MouseX: " + mouseX + ", MouseY: " + mouseY);
    }
}
