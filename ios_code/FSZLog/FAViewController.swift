//
//  MainViewController.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import UIKit


class FAViewController: UIViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

        let request = FATAppletRequest.init()
        request.appletId = "662a70d82233de000188d862"
        
        FATClient().startApplet(with: request, inParentViewController: self) { (result, error) in
            print("打开小程序:", result, error ?? "无错误")
        } closeCompletion: {
            print("关闭小程序")
        }
        
        //        self.dismiss(animated: false)
    }
    
}
