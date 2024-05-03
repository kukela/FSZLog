//
//  MainViewController.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

import UIKit


class FAViewController: UIViewController {
    public var stateStr = "加载中..."
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        let finPath = Bundle.main.path(forResource:"fin", ofType:"bundle")
        if(finPath == nil) { return }
        let finBundle = Bundle.init(path: finPath!)
        if(finBundle == nil) { return }
        
        let request = FATAppletRequest.init()
        request.appletId = "662a70d82233de000188d862"
        request.offlineFrameworkZipPath = finBundle!.path(forResource: "framework-3.3.2", ofType: "zip")
        request.offlineMiniprogramZipPath = finBundle!.path(forResource: "app-1.0.4", ofType: "zip")
        request.presentationConfig = FATAppletPresentationConfig.currentContext()
        
        FATClient().startApplet(with: request, inParentViewController: self) { (result, error) in
            if(result) {
                self.stateStr = "加载成功。"
            }else {
                self.stateStr = "加载失败：" + (error?.localizedDescription ?? "未知错误")
            }
//            UIAlertAction(title: "好的", style: .destructive, handler: nil)
            print("打开小程序:", self.stateStr)
        } closeCompletion: {
            print("关闭小程序")
            self.stateStr = "小程序关闭"
        }
        
    }
    
}
