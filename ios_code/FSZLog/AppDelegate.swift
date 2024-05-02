//
//  AppDelegate.swift
//  FSZLog
//
//  Created by kukela on 2024/5/2.
//

class AppDelegate: NSObject, UIApplicationDelegate {
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {

        let storeConfig = FATStoreConfig()
        storeConfig.sdkKey = "RoD3eJmOwrcXAwhqN2rhJLscAb47O260ikXGAklpBkY="
        storeConfig.sdkSecret = "e11da60e07364490"
        storeConfig.apiServer = "https://api.finclip.com"

        let config = FATConfig(storeConfigs: [storeConfig])

        do {
            try FATClient.shared().initWith(config, uiConfig: nil)
        } catch let err {
            print("初始化失败：\(err)")
            return true
        }
        
        FATClipBoardComponent.register()
         
        
        return true
    }
    
}
