using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChangeColor : MonoBehaviour
{
    public Color newColor = Color.gray; // Mets la couleur que tu veux

    void Start()
    {
        GetComponent<Renderer>().material.color = newColor;
    }
     void Update()
    {
        
    }
}