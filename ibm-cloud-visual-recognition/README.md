This should return some like the following.

- Classify an image
- Detect faces in an image
- [Create a custom classifier](https://console.bluemix.net/docs/services/visual-recognition/tutorial-custom-classifier.html)

## External links

- [Best practices for custom classifiers](https://www.ibm.com/blogs/bluemix/2016/10/watson-visual-recognition-training-best-practices/) (Blog post)
- [Building Cognitive Applications: Visual Recognition (IBM Redbooks)](http://www.redbooks.ibm.com/redbooks/pdfs/sg248393.pdf) (PDF)

## Classify an image

```bash
make classify_fruits
```

This should return some like the following.

```
{
    "images": [
        {
            "classifiers": [
                {
                    "classifier_id": "default",
                    "name": "default",
                    "classes": [
                        {
                            "class": "banana",
                            "score": 0.562,
                            "type_hierarchy": "/fruit/banana"
                        },
                        {
                            "class": "fruit",
                            "score": 0.788
                        },
                        {
                            "class": "diet (food)",
                            "score": 0.528,
                            "type_hierarchy": "/food/diet (food)"
                        },
                        {
                            "class": "food",
                            "score": 0.528
                        },
                        {
                            "class": "honeydew",
                            "score": 0.5,
                            "type_hierarchy": "/fruit/melon/honeydew"
                        },
                        {
                            "class": "melon",
                            "score": 0.501
                        },
                        {
                            "class": "olive color",
                            "score": 0.973
                        },
                        {
                            "class": "lemon yellow color",
                            "score": 0.789
                        }
                    ]
                }
            ],
            "image": "fruitbowl.jpg"
        }
    ],
    "images_processed": 1,
    "custom_classes": 0
}
```

## Detect faces in an image

```bash
make recognize_face
```

This should return some like the following.

```json
{
    "images": [
        {
            "faces": [
                {
                    "age": {
                        "max": 44,
                        "min": 35,
                        "score": 0.446989
                    },
                    "face_location": {
                        "height": 159,
                        "left": 256,
                        "top": 64,
                        "width": 92
                    },
                    "gender": {
                        "gender": "MALE",
                        "score": 0.99593
                    },
                    "identity": {
                        "name": "Barack Obama",
                        "score": 0.970688,
                        "type_hierarchy": "/people/politicians/democrats/barack obama"
                    }
                }
            ],
            "image": "prez.jpg"
        }
    ],
    "images_processed": 1
}
```