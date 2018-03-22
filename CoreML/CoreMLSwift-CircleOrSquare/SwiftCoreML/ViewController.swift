//
//  ViewController.swift
//  SwiftCoreML
//
//  Created by Nono Martínez Alonso on 3/21/18.
//  Copyright © 2018 Nono Martínez Alonso. All rights reserved.
//

import UIKit
import Vision
import CoreVideo

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let model = circle_or_square_138209706()
        
        // Load circle.jpg as a UIImage
        let image = UIImage(named: "circle.jpg")!
        
        // Convert it to a pixel buffer with helper
        // function from github.com/brianadvent/UIImage-to-CVPixelBuffer
        let pixelBuffer = ImageProcessor.pixelBuffer(forImage: image.cgImage!)
        
        // Use Watson Visual Recognition custom CoreML model
        // using our image as input
        guard let classificationOutput = try? model.prediction(data: pixelBuffer!) else {
            fatalError("Unexpected runtime error.")
        }
        
        // Print the output label
        print(classificationOutput.outputLabel) // returns 'circle'
        
        // Print the output scores
        print(classificationOutput.outputScores) // returns ["circle": 0.92008340358734131, "square": 0.0014200210571289062]
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}


struct ImageProcessor {
    static func pixelBuffer (forImage image:CGImage) -> CVPixelBuffer? {
        
        
        let frameSize = CGSize(width: image.width, height: image.height)
        
        var pixelBuffer:CVPixelBuffer? = nil
        let status = CVPixelBufferCreate(kCFAllocatorDefault, Int(frameSize.width), Int(frameSize.height), kCVPixelFormatType_32BGRA , nil, &pixelBuffer)
        
        if status != kCVReturnSuccess {
            return nil
            
        }
        
        CVPixelBufferLockBaseAddress(pixelBuffer!, CVPixelBufferLockFlags.init(rawValue: 0))
        let data = CVPixelBufferGetBaseAddress(pixelBuffer!)
        let rgbColorSpace = CGColorSpaceCreateDeviceRGB()
        let bitmapInfo = CGBitmapInfo(rawValue: CGBitmapInfo.byteOrder32Little.rawValue | CGImageAlphaInfo.premultipliedFirst.rawValue)
        let context = CGContext(data: data, width: Int(frameSize.width), height: Int(frameSize.height), bitsPerComponent: 8, bytesPerRow: CVPixelBufferGetBytesPerRow(pixelBuffer!), space: rgbColorSpace, bitmapInfo: bitmapInfo.rawValue)
        
        
        context?.draw(image, in: CGRect(x: 0, y: 0, width: image.width, height: image.height))
        
        CVPixelBufferUnlockBaseAddress(pixelBuffer!, CVPixelBufferLockFlags(rawValue: 0))
        
        return pixelBuffer
        
    }
    
}

